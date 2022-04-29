<template>
  <div class="idm-diverse-list-module-box">
    <!--表头-->
    <div class="idm-dlm-item-flex idm-dlm-item-static">
      <!-- <a-checkbox v-model="item.idm_checkbox_status" style="margin-right:10px"/> -->
      <template v-for="(fobj, findex) in tableFiledList">
        <div
          :key="findex"
          :style="getFieldTitleCustomFont(fobj)"
        >
        {{fobj.dataTitle}}
        </div>
      </template>
    </div>
    <div class="idm-dlm-item-body">
      <vue-scroll
        :ops="scrollOps"
        @handle-scroll="handleScroll"
        @handle-scroll-complete="handleComplete"
        ref="vscroll"
      >
        <div
          class="idm-diverse-list-module-row"
          :class="{ isShowHover: propData.diverseHoverShow }"
          v-for="(item, index) in listData"
          :key="index"
        >
          <!--静态模式下-->
          <div class="idm-dlm-item-flex idm-dlm-item-static">
            <!-- <a-checkbox v-model="item.idm_checkbox_status" style="margin-right:10px"/> -->
            <template v-for="(fobj, findex) in tableFiledList">
              <div
                :key="findex"
                :style="getFieldCustomFont(fobj, item)"
                @click="commonClickOpenToDoHandle(fobj,item)"
              >
                <!--使用图标配置模式-->
                <template v-if="fobj.iconType == 'config'">
                  <a-tooltip
                    v-for="(imgItem, imgIndex) in iconDataList"
                    :key="imgIndex"
                    :title="
                      imgItem.iconTipFunction &&
                      imgItem.iconTipFunction.length > 0
                        ? getIconFunCustomRender(
                            imgItem,
                            item,
                            'iconTipFunction',
                            fobj
                          )
                        : imgItem.iconTip
                    "
                  >
                    <img
                      v-if="
                        imgItem.iconImgUrl &&
                        (imgItem.iconShowType == 'default' ||
                          (imgItem.iconShowType == 'field' &&
                            getExpressData(
                              'data',
                              imgItem.iconDataFiled,
                              item
                            )) ||
                          (imgItem.iconShowType == 'custom' &&
                            getIconFunCustomRender(
                              imgItem,
                              item,
                              'iconDataFunction',
                              fobj
                            )))
                      "
                      :style="{
                        width: imgItem.iconWidth || 'auto',
                        height: imgItem.iconHeight || 'auto',
                        'margin-right':propData.iconListGutter+'px'
                      }"
                      :src="IDM.url.getWebPath(imgItem.iconImgUrl)"
                      @click="
                        commonEventFunHandle(imgItem.clickCustomFunction, {
                          configObject: imgItem,
                          fieldConfigObject: fobj,
                          itemObject: item,
                        })
                      "
                    />
                  </a-tooltip>
                </template>
                <!--使用图标选择固定图标模式-->
                <svg
                  :style="getFieldSvgIconCustomFont(fobj, item)"
                  class="idm_filed_svg_icon"
                  v-else-if="
                    fobj.icon && fobj.icon.length > 0 && fobj.iconType == 'select'
                  "
                  aria-hidden="true"
                >
                  <use :xlink:href="`#${fobj.icon[0]}`"></use>
                </svg>
                <!--使用操作按钮配置模式-->
                <template v-else-if="fobj.iconType == 'button'">
                  <a-tooltip
                    v-for="(btnItem, btnIndex) in buttonDataList"
                    :key="btnIndex"
                    :title="
                      btnItem.buttonTipFunction &&
                      btnItem.buttonTipFunction.length > 0
                        ? getIconFunCustomRender(
                            btnItem,
                            item,
                            'buttonTipFunction',
                            fobj
                          )
                        : btnItem.buttonTip
                    "
                  >
                    <div :class="`idm-dlm-opbutton-${btnItem.buttonLayout}`"
                      v-if="
                        (btnItem.iconSvg || btnItem.buttonText) &&
                        (btnItem.buttonShowType == 'default' ||
                          (btnItem.buttonShowType == 'field' &&
                            getExpressData(
                              'data',
                              btnItem.buttonDataFiled,
                              item
                            )) ||
                          (btnItem.buttonShowType == 'custom' &&
                            getIconFunCustomRender(
                              btnItem,
                              item,
                              'buttonDataFunction',
                              fobj
                            )))
                      "
                      :style="{
                        'padding-left':propData.buttonListGutter/2+'px',
                        'padding-right':propData.buttonListGutter/2+'px'
                      }"
                      @click="btnClickEventFunHandle(btnItem,fobj,item)"
                    >
                      <svg
                        :style="
                          getButtonSvgIconCustomFont(btnItem, 'iconSvgFont',true)
                        "
                        class="idm_filed_svg_icon"
                        v-if="btnItem.iconSvg && btnItem.iconSvg.length > 0"
                        aria-hidden="true"
                      >
                        <use :xlink:href="`#${btnItem.iconSvg[0]}`"></use>
                      </svg>
                      <span v-if="btnItem.buttonText"
                        :style="
                          getButtonSvgIconCustomFont(btnItem, 'buttonTextFont')
                        "
                      >
                        {{ btnItem.buttonText }}
                      </span>
                    </div>
                  </a-tooltip>
                </template>
                {{
                  fobj.customShowFunction && fobj.customShowFunction.length > 0
                    ? ""
                    : item[fobj.dataFiled]
                }}
                <span
                  v-if="
                    fobj.customShowFunction && fobj.customShowFunction.length > 0
                  "
                  v-html="getFieldCustomRender(fobj, item)"
                ></span>
              </div>
            </template>
          </div>
        </div>
        <div
          v-if="loading || (loadingEnd && listData.length > 0)"
          class="idm-dlm-load-style idm-dlm-loading-info"
        >
          {{ loading ? propData.diverseLoadingText : propData.diverseLoadedText }}
        </div>
        <div
          v-if="!loading && loadingEnd && listData.length == 0"
          class="idm-dlm-load-style idm-dlm-nodata-info"
        >
          <div
            v-if="
              propData.diverseNoDataFunction &&
              propData.diverseNoDataFunction.length > 0
            "
            v-html="getOtherCustomRender(propData, 'diverseNoDataFunction')"
          ></div>
          <template v-else> 暂无数据 </template>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>
<script>
//混入不同模板的公共代码
import mixins from './mixin'
export default {
  name: "TableListModule",
  mixins: [mixins],
  data() {
    return {
    };
  },
  props: {
  },
  created() {
  },
  destroyed() {},
  methods: {
  },
  watch: {
  },
};
</script>
<style lang="scss" scoped>
.idm-dlm-item-flex {
  display: flex;
  width:100%;
  &.idm-dlm-item-static{
    & > div {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
.idm-diverse-list-module-box{
  .idm-dlm-item-body{
    .idm-diverse-list-module-row{
      border-bottom: 1px solid #e8e8e8;
      transition: background linear 0.15s;
      &:hover{
        background: #e6f7ff
      }
    }
  }
  &>.idm-dlm-item-flex{
    border-bottom: 1px solid #e8e8e8;
    background-color: #fafafa;
  }
}

</style>