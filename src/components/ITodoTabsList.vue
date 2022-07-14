<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    :style="{ height: moduleHeight + 'px' }"
    ref="module_ref"
  >
    <!--
      组件内部容器
      增加class="drag_container" 必选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
    -->
    <a-tabs
      class="idm_itodotabslist"
      :activeKey="activeTab"
      :size="propData.size || 'default'"
      :tabPosition="propData.tabPosition || 'top'"
      :type="propData.type || 'line'"
      :tabBarGutter="propData.tabBarGutter == 0 ? 0 : propData.tabBarGutter || null"
      :animated="propData.animated !== false ? true : false"
      @change="changeCallback"
      @nextClick="nextClickCallback"
      @prevClick="prevClickCallback"
      @tabClick="tabClickCallback"
      ref="idm_module_tabs_wrapper"
    >
      <a-tab-pane
        :forceRender="item.forceRender === true ? false : true"
        v-for="item in allTabList"
        :key="item.key"
      >
        <div class="idm_itodotabslist_list_box">
          <component
            :is="
              propData.useTableTabArrayStr &&
              propData.useTableTabArrayStr.split(',').indexOf(item.key + '') > -1
                ? 'table-list-module'
                : 'diverse-list-module'
            "
            :ref="`listmodule_${item.key}`"
            :propData="propData"
            :tabObject="item"
            :allTabList="allTabList"
            :moduleObject="moduleObject"
            :currentKey="item.key"
            :allDynamicAttrList="allDynamicAttrList"
            :searchText="searchText"
            @reloadTabInfo="reloadTabInfo"
          />
        </div>
        <span :class="{ 'ant-tabs-tab-divider': propData.tabShowDivider }" slot="tab">
          <template>{{ item.tab }}</template>
          <label
            class="ant-tabs-tab-remind"
            v-show="item.cnt > 0"
            :class="{
              'ant-tabs-tab-remind-reddot': propData.remindShowDot && item.key != activeTab
            }"
            >{{
              item.cnt > propData.remindNumberMax && propData.remindNumberMax
                ? propData.remindNumberMax + '+'
                : item.cnt
            }}</label
          >
        </span>
      </a-tab-pane>
      <div class="idm_itodotabslist_tabbarextra_box" slot="tabBarExtraContent">
        <div
          v-if="propData.headLine && ['top', 'bottom'].includes(propData.tabPosition)"
          class="idm_itodotabslist_headline"
        >
          {{ this.propData.headLine }}
        </div>
        <div
          class="idm_itodotabslist_search_box"
          v-if="propData.showSearch"
          :class="{ 'open-search': searchOpen }"
        >
          <input
            type="text"
            ref="searchInputRef"
            @blur="searchBlurHandle"
            @keyup.enter="searchHandle"
            v-model="searchText"
          />
          <svg
            @click="searchHandle"
            class="idm_button_svg_icon idm-icon-searchOutline"
            aria-hidden="true"
          >
            <use :xlink:href="`#icon-searchOutline`"></use>
          </svg>
        </div>
        <template v-for="(bitem, bindex) in extraBtnList || []">
          <div v-if="bitem.showStatus" @click="tabBarExtraClickHandle(bitem, bindex)" :key="bindex">
            <a-tooltip :title="bitem.tip">
              <svg
                class="idm_button_svg_icon"
                v-if="bitem.icon && bitem.icon.length > 0"
                aria-hidden="true"
              >
                <use :xlink:href="`#${bitem.icon[0]}`"></use></svg
              >{{ bitem.name }}
            </a-tooltip>
          </div>
        </template>
      </div>
    </a-tabs>
    <!--
      组件内部容器
      增加class="drag_container" 代表内部可存放组件容器 必选
      增加idm-ctrl-inner 代表内部容器组件（可定义单独的属性，只支持定义一类的属性,一个组件内只包含一种） 可选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选，建议从1开始
      idm-refresh-container：刷新容器所在的组件状态，如果要刷新，只需要此属性有变化即可刷新整个组件的状态
    -->
    <div
      v-show="propData.showDragContainer && showDragContainer"
      class="idm_itodotabslist_drag_container"
      :style="{ left: propData.dragContainerX, top: propData.dragContainerY }"
    >
      <div
        class="drag_container"
        idm-ctrl-inner
        :idm-ctrl-id="moduleObject.id"
        idm-container-index="1"
      ></div>
    </div>
  </div>
</template>

<script>
//切换调用自定义函数示例
// window.tabchangeClick =function(ctx){
//   return ctx.activeKey == "2";
// }
import DiverseListModule from './module/DiverseListModule.vue';
import TableListModule from './module/TableListModule.vue';
export default {
  name: 'ITodoTabsList',
  components: {
    DiverseListModule,
    TableListModule
  },
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        dragContainerY: '8px',
        dragContainerX: '60%',
        showDragContainer: false,
        // headLine: '行政办公',
        headLineWidth: 100,
        size: 'default',
        animated: true,
        type: 'line',
        tabPosition: 'top',
        tabBarGutter: 20,
        boxShadow: '0px 0px 3px rgba(0,0,0,0.1)',
        tabLeftPadding: {
          inputVal: 10,
          selectVal: 'px'
        },
        tabRightPadding: {
          inputVal: 10,
          selectVal: 'px'
        },
        box: {
          // marginTopVal:"20px",
          // marginBottomVal:"20px",
          // marginLeftVal:"20px",
          // marginRightVal:"20px",
          paddingTopVal: '20px',
          paddingLeftVal: '20px',
          paddingRightVal: '20px',
          paddingBottomVal: '20px'
        },
        innerBox: {
          // marginTopVal:"20px",
          // marginBottomVal:"20px",
          paddingTopVal: '20px',
          paddingBottomVal: '20px',
          paddingRightVal: '20px',
          paddingLeftVal: '20px'
        },
        // diverseDefaultBox:{
        //   marginTopVal:"20px",
        //   marginBottomVal:"20px",
        //   paddingTopVal:"20px",
        //   paddingBottomVal:"20px"
        // },
        // tabTopPadding:{
        //     "inputVal": 10,
        //     "selectVal": "px"
        // },
        // tabBottomPadding:{
        //     "inputVal": 10,
        //     "selectVal": "px"
        // },
        remindShowDot: true,
        remindNumberMax: 9,
        extraBtnList: [
          {
            key: '1',
            name: '设置',
            icon: ['icon-settingOutline'],
            tip: '这里是提示',
            showType: 'default',
            dataFiled: '',
            dataFunction: [
              {
                name: 'tabchangeClick',
                param: {}
              }
            ]
          },
          {
            key: '2',
            name: '',
            icon: ['icon-settingOutline'],
            tip: '点击可以进行个性化定制',
            showType: 'toggle',
            dataFiled: 'key==1'
          }
        ],
        extraBtnGutter: 20,
        extraBtnFontSize: 14,
        extraBtnFontColor: {
          hex: '#666666',
          hex8: '#666666FF'
        },
        diverseDefaultLineHeight: 40,
        // diverseDefaultBox:{
        //   "marginTopVal":"10px",
        // },
        // diverseHoverBox:{
        //   "marginTopVal":"10px",
        // },
        diverseFiledList: [
          {
            //hover default
            dataFiledPosition: 'default',
            dataFiled: 'title',
            width: {
              inputVal: '40',
              selectVal: '%'
            },
            customShowFunction: [{ name: 'reconvert', param: {} }],
            iconType: 'none',
            icon: [],
            defaultFont: {},
            readFont: {},
            readExpression: '',
            fieldLeftPadding: 10,
            fieldRightPadding: 10
          },
          {
            //hover default
            dataFiledPosition: 'default',
            dataFiled: 'leftUserName',
            width: {
              inputVal: '30',
              selectVal: '%'
            },
            customShowFunction: [],
            iconType: 'select',
            icon: ['icon-settingOutline'],
            defaultFont: {},
            readFont: {},
            readExpression: '',
            fieldLeftPadding: 10,
            fieldRightPadding: 10
          },
          {
            //hover default
            dataFiledPosition: 'hoverTitle',
            dataFiled: 'title',
            width: {
              inputVal: '30',
              selectVal: '%'
            },
            customShowFunction: [{ name: 'reconvert', param: {} }],
            iconType: 'none',
            icon: [],
            defaultFont: {},
            readFont: {},
            readExpression: '',
            fieldLeftPadding: 10,
            fieldRightPadding: 10
          },
          {
            //hover default
            dataFiledPosition: 'default',
            dataFiled: 'leftUserName',
            width: {
              inputVal: '30',
              selectVal: '%'
            },
            customShowFunction: [],
            iconType: 'button',
            icon: [],
            defaultFont: {
              fontTextAlign: 'left'
            },
            readFont: {},
            readExpression: '',
            fieldLeftPadding: 10,
            fieldRightPadding: 10
          },
          {
            //hover default
            dataFiledPosition: 'hoverHandle',
            dataFiled: 'leftUserName',
            width: {
              inputVal: '30',
              selectVal: '%'
            },
            customShowFunction: [],
            iconType: 'button',
            icon: [],
            defaultFont: {
              fontTextAlign: 'right'
            },
            readFont: {},
            readExpression: '',
            fieldLeftPadding: 10,
            fieldRightPadding: 10
          }
        ],
        diverseHoverShow: true,
        diverseHoverBgColor: {
          hex: '#FFFFFF',
          hex8: '#FFFFFFFF'
        },
        diverseHoverShadow: '0 0 30px 10px rgba(154, 29, 88, 0.15)',
        showSearch: true,
        buttonOptionList: [
          {
            iconSvg: ['icon-settingOutline'],
            buttonText: '发送',
            buttonLayout: 'horizontal',
            iconSvgFont: {
              fontSize: 14,
              fontSizeUnit: 'px',
              fontColors: {
                hex8: 'red'
              }
            },
            buttonTextFont: {
              fontSize: 14,
              fontSizeUnit: 'px',
              fontLineHeight: 20,
              fontLineHeightUnit: 'px'
            },
            buttonShowType: 'default',
            buttonTip: '发送',
            buttonTipFunction: [],
            buttonHandleType: 'send',
            buttonCustomFunction: []
          },
          {
            iconSvg: ['icon-settingOutline'],
            buttonText: '退回',
            buttonLayout: 'horizontal',
            iconSvgFont: {},
            buttonTextFont: {},
            buttonShowType: 'default',
            buttonTip: '退回',
            buttonTipFunction: [],
            buttonHandleType: 'send',
            buttonCustomFunction: []
          }
        ],
        buttonListGutter: 20,
        iconListGutter: 0,
        tableTitleBgColor: {
          hex8: '#FAFAFAFF'
        },
        tableTitleFont: {
          fontSize: 16,
          fontSizeUnit: 'px',
          fontColors: {
            hex8: '#333333ff'
          },
          fontWeight: '800'
        },
        tableFiledList: [
          {
            dataTitle: '标题',
            dataFiled: 'title',
            width: {
              inputVal: '40',
              selectVal: '%'
            },
            customShowFunction: [{ name: 'reconvert', param: {} }],
            iconType: 'none',
            icon: [],
            defaultFont: {},
            readFont: {},
            readExpression: '',
            fieldLeftPadding: 10,
            fieldRightPadding: 10
          },
          {
            dataTitle: '姓名',
            dataFiled: 'leftUserName',
            width: {
              inputVal: '30',
              selectVal: '%'
            },
            customShowFunction: [],
            iconType: 'select',
            icon: ['icon-settingOutline'],
            defaultFont: {
              fontTextAlign: 'left'
            },
            readFont: {},
            readExpression: '',
            fieldLeftPadding: 10,
            fieldRightPadding: 10
          },
          {
            dataTitle: '操作',
            dataFiled: 'leftUserName',
            width: {
              inputVal: '30',
              selectVal: '%'
            },
            customShowFunction: [],
            iconType: 'button',
            icon: [],
            defaultFont: {
              fontTextAlign: 'left'
            },
            readFont: {},
            readExpression: ''
          }
        ],
        useTableTabArrayStr: '1,3',
        themeList: [
          {
            key: 'blue',
            mainColor: {
              hex8: 'blue'
            },
            minorColor: {
              hex8: 'blue'
            }
          },
          {
            key: 'red',
            mainColor: {
              hex8: 'red'
            },
            minorColor: {
              hex8: 'red'
            }
          }
        ],
        moduleHeight: 500
      },
      //当前选中的tab
      activeTab: '',
      //当前所有的tab集合
      allTabList: [],
      //扩展按钮集合
      extraBtnList: [],
      //所有的动态属性集合
      allDynamicAttrList: [],
      //搜索的内容
      searchText: '',
      //搜索框是否打开
      searchOpen: false,
      //组件的最外层高度
      moduleHeight: 0,
      showDragContainer: false
    };
  },
  props: {},
  created() {
    //初始化默认为设置的高度，后续还是会根据配置自动进行调整的
    this.moduleHeight = this.propData.moduleHeight;
    this.moduleObject = this.$root.moduleObject;
    //获取动态属性列表
    this.fetchDynamicAttr();
    this.initAttrToModule();
  },
  mounted() {
    //赋值给window提供跨页面调用
    this.$nextTick(function(params) {
      this.moduleObject && this.moduleObject.packageid
        ? (window[this.moduleObject.packageid] = this)
        : null;
    });
  },
  destroyed() {},
  methods: {
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.initAttrToModule();
      this.$nextTick(function() {
        this.resizeContentWrapperHeight();
      });
    },
    /**
     * 对属性设置进行初始化
     */
    initAttrToModule() {
      this.initBaseAttrToModule();
      this.convertAttrToStyleObject();
      this.convertTabAttrToStyleObject();
      this.convertListAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
    },
    /**
     * 搜索函数
     */
    searchHandle() {
      if (!this.searchOpen) {
        //打开
        this.searchOpen = true;
        this.$nextTick(function() {
          this.$refs.searchInputRef.focus();
        });
        return;
      }
      //去搜索
      this.serachAllTabList();
    },
    /**
     * 搜索框失去焦点事件
     */
    searchBlurHandle() {
      if (!this.searchText) {
        this.searchOpen = false;
      }
      //去搜索
      this.serachAllTabList();
    },
    /**
     * 要循环搜索全部已打开的组件
     */
    serachAllTabList() {
      this.allTabList.forEach(item => {
        const refObj = this.$refs['listmodule_' + item.key];
        if (refObj && refObj instanceof Array) {
          refObj[0].searchList(this.searchText);
        } else if (refObj) {
          refObj.searchList(this.searchText);
        }
      });
    },
    /**
     * 获取当前所有已查出来的数据
     */
    getAllTabDataList() {
      let result = [];
      for (let index = 0; index < this.allTabList.length; index++) {
        const item = this.allTabList[index];
        let resultObject = {
          tabKey: item.key
        };
        const refObj = this.$refs['listmodule_' + item.key];
        if (refObj && refObj instanceof Array) {
          resultObject.data = refObj[0].listData;
        } else if (refObj) {
          resultObject.data = refObj.listData;
        }
        result.push(resultObject);
      }
      return result;
    },
    /**
     * 获取所有tab的key数组
     */
    getAllTabKeyArray() {
      var tabArray = [];
      for (let index = 0; index < this.allTabList.length; index++) {
        const element = this.allTabList[index];
        tabArray.push(element.key);
      }
      return tabArray;
    },
    /**
     * 获取接口所需要的所有对象
     */
    getUseUrlAllObjectData(currentTab) {
      return {
        //所有tab的逗号隔开
        allTabTypes: this.getAllTabKeyArray().join(','),
        //当前tab
        currentTabType: currentTab || this.activeTab
      };
    },
    /**
     * 重新加载指定tab的key的列表数据（不管是否要刷新指定的key，提醒数据都要重新加载）
     * @param {String} reloadKeys 重新加载的key
     */
    reloadTabInfo(reloadKeys) {
      //重新加载所有tab的数量提醒等信息
      this.initAllTabRemindInfo();
      let reloadKeyArray = reloadKeys ? reloadKeys.split(',') : [];
      if (reloadKeyArray.length == 0) {
        return;
      }
      for (let index = 0; index < this.allTabList.length; index++) {
        const item = this.allTabList[index];
        const refObj = this.$refs['listmodule_' + item.key];
        if (reloadKeyArray.indexOf(item.key) > -1 && refObj) {
          if (refObj instanceof Array) {
            refObj[0].reloadCurrentTabList();
          } else {
            refObj.reloadCurrentTabList();
          }
        }
      }
    },
    /**
     * 加载所有tab的后端查询数据
     */
    initAllTabRemindInfo() {
      let that = this;
      if (that.getAllTabKeyArray().length == 0 || !that.propData.countUrl) {
        return;
      }
      let platformCountUrl = that.getReplaceExpressString(
        that.propData.countUrl,
        that.getUseUrlAllObjectData()
      );
      IDM.http
        .get(platformCountUrl)
        .then(res => {
          //每个用户的定制结果
          if (res && res.data && res.data.data) {
            var tabs = res.data.data.tabs;
            if (that.countUrlExtend) {
              //如果有扩展接口在扩展接口里面接着获取数据并且合并数据
              that.initExtendTabRemindInfo(tabs);
            } else {
              that.interfaceLaterHandle(tabs);
              that.handleTabData();
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 加载扩展接口的数量信息
     */
    initExtendTabRemindInfo(platformTabs) {
      let that = this;
      let extendCountUrl = that.getReplaceExpressString(
        that.propData.countUrlExtend,
        that.getUseUrlAllObjectData()
      );
      IDM.http
        .get(extendCountUrl)
        .then(res => {
          //每个用户的定制结果
          if (res && res.data && res.data.data) {
            var tabs = res.data.data.tabs;
            that.interfaceLaterHandle(tabs);
          }
          that.handleTabData();
        })
        .catch(err => {
          that.handleTabData();
          console.log(err);
        });
    },
    /**
     * 接口请求成功后处理函数
     */
    interfaceLaterHandle(tabs) {
      let that = this;
      for (let index = 0; index < that.allTabList.length; index++) {
        const element = that.allTabList[index];
        if (tabs[element.key] instanceof Object) {
          //存在
          element.cnt = tabs[element.key].count || 0;
          Object.keys(tabs[element.key]).forEach(filedKey => {
            element[filedKey] = tabs[element.key][filedKey];
          });
        }
      }
    },
    /**
     * 对tab进行后续处理
     */
    handleTabData() {
      let that = this;
      //处理标签页无内容时隐藏，默认为否；但至少需要保留一个标签
      for (let index = 0; index < that.allDynamicAttrList.length; index++) {
        const item = that.allDynamicAttrList[index];
        //动态页签
        if (
          item.attrCode == that.propData.dynamicAttrAutoHiddenKeyName &&
          item.attrData == 'true'
        ) {
          let newHandleData = [];
          that.allTabList.map((item, index) => {
            if (item.cnt > 0) {
              newHandleData.push(item);
            }
          });
          if (newHandleData.length == 0) {
            newHandleData.push(that.allTabList[0]);
          }
          that.allTabList = newHandleData;
          that.resetDefaultActiveKey(false);
          break;
        }
      }
    },
    /**
     * 加载基本属性到组件中
     */
    initBaseAttrToModule() {
      let that = this;
      //扩展按钮
      that.propData.extraBtnList &&
        that.propData.extraBtnList.forEach(item => (item.showStatus = item.showType == 'default'));
      this.showDragContainer = this.propData.dragContainerShowType == 'default';
      that.extraBtnList = that.propData.extraBtnList;
      //首先判断tab是用哪种方式加载
      /**
       * 1、使用静态的综合属性加载
       * 2、使用动态属性加载（这个会根据用户设置的进行加载）
       */
      let hasStaticData = false;
      if (that.propData.tabDataType == 'dynamic') {
        //动态属性
        //这里暂时不能做操作，因为接口还没请求，无法使用
      } else if (that.propData.tabDataType == 'static') {
        if (
          that.propData.staticTabPaneList &&
          (that.propData.staticTabPaneList.length > 1 ||
            (that.propData.staticTabPaneList.length == 1 &&
              Object.keys(that.propData.staticTabPaneList[0]).length > 0))
        ) {
          hasStaticData = true;
          that.propData.staticTabPaneList.forEach(item => (item.cnt = 0));
          that.allTabList = that.propData.staticTabPaneList;
          that.resetDefaultActiveKey();
          that.initAllTabRemindInfo();
        }
      }

      //没有数据的话,开发环境下、组件单独模式下显示demo
      if (
        that.moduleObject.env == undefined ||
        (that.moduleObject.env == 'develop' &&
          that.propData.tabDataType == 'static' &&
          !hasStaticData)
      ) {
        //开发模式下不执行此事件
        that.allTabList = [];
        for (let index = 0; index < 5; index++) {
          that.allTabList.push({
            key: index,
            tab: '页签demo' + index,
            defaultActiveKey: index == 0,
            forceRender: false,
            cnt: 1000
          });
        }
        that.resetDefaultActiveKey();
      }
    },
    /**
     * 动态属性处理函数
     */
    dynamicAttrHandle() {
      let that = this;
      if (that.allDynamicAttrList && that.allDynamicAttrList.length > 0) {
        that.allDynamicAttrList.forEach(item => {
          //动态页签
          if (
            that.propData.tabDataType == 'dynamic' &&
            item.attrCode == that.propData.dynamicAttrKeyName
          ) {
            try {
              let tabsData = JSON.parse(item.attrData);
              if (tabsData instanceof Array) {
                let newTabsList = [];
                tabsData.forEach(fitem => {
                  newTabsList.push({
                    key: that.getExpressData('data', that.propData.dynamicKeyName, fitem),
                    tab: that.getExpressData('data', that.propData.dynamicShowName, fitem),
                    cnt: 0,
                    forceRender: that.propData.forceRender
                  });
                });
                that.allTabList = newTabsList;
                that.resetDefaultActiveKey();
              }
            } catch (error) {}
          }
          that.extraBtnList &&
            that.extraBtnList.forEach(eitem => {
              if (eitem.showType == 'dynamic' && eitem.dynamicAttrKeyName == item.attrCode) {
                //dynamicAttrKeyName
                //dynamicCompareType
                if (eitem.dynamicCompareType == 'result') {
                  //结果值比较
                  eitem.showStatus = eitem.dynamicCompareResult == item.attrData;
                } else if (eitem.dynamicCompareType == 'function') {
                  //自定义函数比较
                  eitem.showStatus =
                    window[eitem.dataFunction[0].name] &&
                    window[eitem.dataFunction[0].name].call(this, {
                      ...that.commonParam(),
                      customParam: eitem.dataFunction[0].param,
                      _this: that,
                      activeKey: that.activeTab,
                      allKey: that.allTabList,
                      actionType: 'dynamicAttr'
                    });
                }
              }
            });
          if (
            this.propData.dragContainerShowType == 'dynamic' &&
            this.propData.dragContainerDynamicAttrKeyName == item.attrCode
          ) {
            if (this.propData.dragContainerDynamicCompareType == 'result') {
              this.showDragContainer =
                this.propData.dragContainerDynamicCompareResult == item.attrData;
            } else if (this.propData.dragContainerDynamicCompareType == 'function') {
              this.showDragContainer =
                window[this.propData.dragContainerDataFunction[0].name] &&
                window[this.propData.dragContainerDataFunction[0].name].call(this, {
                  ...that.commonParam(),
                  customParam: this.propData.dragContainerDataFunction[0].param,
                  _this: that,
                  activeKey: that.activeTab,
                  allKey: that.allTabList,
                  actionType: 'dynamicAttr'
                });
            }
          }
        });
      }
      that.initAllTabRemindInfo();
    },
    /**
     * 扩展按钮显示处理事件
     */
    extraBtnShowStatusHandle(actionType) {
      let that = this;
      that.extraBtnList &&
        that.extraBtnList.forEach(item => {
          if (item.showType == 'default') {
            return;
          }
          switch (item.showType) {
            case 'toggle':
              for (let index = 0; index < that.allTabList.length; index++) {
                const element = that.allTabList[index];
                if (element.key == that.activeTab) {
                  //用当前选中的页签对象去执行表达式
                  if (that.getExpressData('data', item.dataFiled, element)) {
                    item.showStatus = true;
                  } else {
                    item.showStatus = false;
                  }
                  continue;
                }
              }
              break;
            case 'dynamic':
              break;
            case 'custom':
              item.showStatus =
                window[item.dataFunction[0].name] &&
                window[item.dataFunction[0].name].call(this, {
                  ...that.commonParam(),
                  customParam: item.dataFunction[0].param,
                  _this: that,
                  activeKey: that.activeTab,
                  allKey: that.allTabList,
                  actionType
                });
              break;
          }
        });
    },
    /**
     * 悬浮容器显示处理事件
     */
    dragContainerShowStatusHandle(actionType) {
      if (this.propData.dragContainerShowType == 'default') {
        return;
      }
      switch (this.propData.dragContainerShowType) {
        case 'toggle':
          //用当前选中的页签对象去执行表达式
          if (
            this.getExpressData(
              'data',
              this.propData.dragContainerDataFiled,
              this.allTabList.find(item => item.key === this.activeTab) || {}
            )
          ) {
            this.showDragContainer = true;
          } else {
            this.showDragContainer = false;
          }
          break;
        case 'dynamic':
          break;
        case 'custom':
          this.showDragContainer =
            window[this.propData.dragContainerDataFunction[0].name] &&
            window[this.propData.dragContainerDataFunction[0].name].call(this, {
              ...this.commonParam(),
              customParam: this.propData.dragContainerDataFunction[0].param,
              _this: this,
              activeKey: this.activeTab,
              allKey: this.allTabList,
              actionType
            });
          break;
      }
    },
    /**
     * tab扩展按钮点击事件
     */
    tabBarExtraClickHandle(item, index) {
      let that = this;
      if (item.clickType == 'customFunction') {
        this.changeEventFunHandle('clickCustomFunction', item.clickCustomFunction);
      } else if (item.clickType == 'openCtrlCenter') {
        //组件内调用
        IDM.broadcast.openControlSetPanel({
          param: {
            marketModuleId: this.moduleObject.comId,
            pageId: IDM.broadcast ? IDM.broadcast.pageModule.id : '',
            packageid: this.moduleObject.packageid
          },
          showTop: true,
          success: function(res) {},
          yes: function(res) {
            //确定后控制中心的表单数据保存了，可以再次调用获取方法获取已经保存的个性化组件属性
            that.fetchDynamicAttr();
          },
          reset: function(res) {
            //重置后可重新获取到初始值
            that.fetchDynamicAttr();
          },
          other: function(res) {
            //关闭或其他按钮触发回调方法
          }
        });
      }
    },
    /**
     * 重置默认选中的key
     * @param isReset 是否重置成默认的tab，传false则会执行以下逻辑：优先判断当前选中tab是否存在tabList中，如果不存在则重置，如果存在则不做任何操作
     */
    resetDefaultActiveKey(isReset) {
      let that = this;
      if (
        !that.allTabList ||
        (that.allTabList &&
          (that.allTabList.length == 0 ||
            (that.allTabList.length == 1 && Object.keys(that.allTabList).length == 0)))
      ) {
        return;
      }
      if (that.activeTab && isReset === false) {
        //如果选中的tab存在且参数是不需要重置则返回
        //这一需求主要用于动态属性变化了后是否还停留选中的tab，如果存在则停留，不存在则重置
        let activeTabInList = false;
        for (let index = 0; index < that.allTabList.length; index++) {
          const element = that.allTabList[index];
          if (element.key == that.activeTab) {
            activeTabInList = true;
            continue;
          }
        }
        if (activeTabInList) {
          return;
        }
      }
      let firstDefaultKey, firstKey;
      for (let index = 0; index < that.allTabList.length; index++) {
        const element = that.allTabList[index];
        if (index == 0) {
          firstKey = element.key;
        }
        if (element.defaultActiveKey) {
          firstDefaultKey = element.key;
          continue;
        }
      }
      that.activeTab = firstDefaultKey || firstKey;
      this.extraBtnShowStatusHandle('defaultTab');
      this.dragContainerShowStatusHandle('defaultTab');
      that.$nextTick(function() {
        that.resizeContentWrapperHeight();
      });
    },
    /**
     * 获取用户个性化设置的结果
     */
    fetchDynamicAttr() {
      // var demo = [
      //   {
      //     "attrCode": "tabsData",
      //     "attrData": "[{\"showName\":\"全部\",\"children\":[],\"name\":\"全部\",\"itemIndex\":1,\"pid\":\"201029163137nbEviNsIaR68CplxJiy\",\"label\":\"全部\",\"id\":\"alldo\",\"type\":0,\"title\":\"全部\",\"value\":\"alldo\",\"key\":\"alldo\",\"attrs\":{\"codeId\":\"201029163231UDTIYdWOQKGRuU1n1MT\",\"createUserid\":\"1\",\"pinyin\":\"\",\"remark\":\"\",\"pinyinInitial\":\"\",\"childrenCount\":0}},{\"showName\":\"我的待阅\",\"pid\":\"201029163137nbEviNsIaR68CplxJiy\",\"label\":\"我的待阅\",\"type\":0,\"title\":\"我的待阅\",\"attrs\":{\"codeId\":\"201029163304zYaGN6nxBL8lSEGAg4h\",\"createUserid\":\"1\",\"pinyin\":\"\",\"remark\":\"\",\"pinyinInitial\":\"\",\"childrenCount\":0},\"children\":[],\"name\":\"我的待阅\",\"itemIndex\":3,\"id\":\"toread\",\"value\":\"toread\",\"key\":\"toread\"},{\"showName\":\"我的待办\",\"children\":[],\"name\":\"我的待办\",\"itemIndex\":2,\"pid\":\"201029163137nbEviNsIaR68CplxJiy\",\"label\":\"我的待办\",\"id\":\"todo\",\"type\":0,\"title\":\"我的待办\",\"value\":\"todo\",\"key\":\"todo\",\"attrs\":{\"codeId\":\"201029163252L8gUrSgjqbAvvI7BLmo\",\"createUserid\":\"1\",\"pinyin\":\"wodedaiban\",\"remark\":\"\",\"pinyinInitial\":\"wddb\",\"childrenCount\":0}},{\"showName\":\"委托代办\",\"children\":[],\"name\":\"委托代办\",\"itemIndex\":4,\"pid\":\"201029163137nbEviNsIaR68CplxJiy\",\"label\":\"委托代办\",\"id\":\"todoagency\",\"type\":0,\"title\":\"委托代办\",\"value\":\"todoagency\",\"key\":\"todoagency\",\"attrs\":{\"codeId\":\"201029163323lkA4xWSU84id6LAmiEx\",\"createUserid\":\"1\",\"pinyin\":\"\",\"remark\":\"\",\"pinyinInitial\":\"\",\"childrenCount\":0}},{\"showName\":\"关注事项\",\"children\":[],\"name\":\"关注事项\",\"itemIndex\":6,\"pid\":\"201029163137nbEviNsIaR68CplxJiy\",\"label\":\"关注事项\",\"id\":\"to_favorite\",\"type\":0,\"title\":\"关注事项\",\"value\":\"to_favorite\",\"key\":\"to_favorite\",\"attrs\":{\"codeId\":\"201116154342qbHL7PUx2Mrx1y3qelt\",\"createUserid\":\"1\",\"pinyin\":\"\",\"remark\":\"\",\"pinyinInitial\":\"\",\"childrenCount\":0}},{\"showName\":\"提醒事项\",\"children\":[],\"name\":\"提醒事项\",\"itemIndex\":7,\"pid\":\"201029163137nbEviNsIaR68CplxJiy\",\"label\":\"提醒事项\",\"id\":\"toremind\",\"type\":0,\"title\":\"提醒事项\",\"value\":\"toremind\",\"key\":\"toremind\",\"attrs\":{\"codeId\":\"2011181113395XqalcRl30vcVuNtmYu\",\"createUserid\":\"1\",\"pinyin\":\"\",\"remark\":\"\",\"pinyinInitial\":\"\",\"childrenCount\":0}}]",
      //   },
      //   {
      //     "attrCode": "settingShow",
      //     "attrData": "true"
      //   }
      // ]
      let that = this;
      IDM.controlcenter &&
        IDM.controlcenter
          .getModuleAttrInstance({
            marketModuleId: this.moduleObject.comId,
            pageId: IDM.broadcast && IDM.broadcast.pageModule ? IDM.broadcast.pageModule.id : '',
            packageid: this.moduleObject.packageid
          })
          .then(res => {
            //每个用户的定制结果
            var resData = res.data;
            if (resData && resData.data) {
              if (!(resData.data instanceof Array)) {
                resData.data = [resData.data];
              }
              that.allDynamicAttrList = resData.data;
              that.dynamicAttrHandle();
            }
          })
          .catch(err => {
            //失败结果
          });
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      var styleObject = {};
      if (this.propData.bgSize && this.propData.bgSize == 'custom') {
        styleObject['background-size'] =
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.bgSize) {
        styleObject['background-size'] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'width':
            case 'height':
              styleObject[key] = element;
              break;
            case 'bgColor':
              if (element && element.hex8) {
                styleObject['background-color'] = element.hex8;
              }
              break;
            case 'box':
              if (element.marginTopVal) {
                styleObject['margin-top'] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                styleObject['margin-right'] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                styleObject['margin-bottom'] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                styleObject['margin-left'] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                styleObject['padding-top'] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                styleObject['padding-right'] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                styleObject['padding-bottom'] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                styleObject['padding-left'] = `${element.paddingLeftVal}`;
              }
              break;
            case 'bgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'positionX':
              //背景横向偏移

              break;
            case 'positionY':
              //背景纵向偏移

              break;
            case 'bgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'bgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
            case 'border':
              if (element.border.top.width > 0) {
                styleObject['border-top-width'] =
                  element.border.top.width + element.border.top.widthUnit;
                styleObject['border-top-style'] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  styleObject['border-top-color'] = element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                styleObject['border-right-width'] =
                  element.border.right.width + element.border.right.widthUnit;
                styleObject['border-right-style'] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  styleObject['border-right-color'] = element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                styleObject['border-bottom-width'] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                styleObject['border-bottom-style'] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  styleObject['border-bottom-color'] = element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                styleObject['border-left-width'] =
                  element.border.left.width + element.border.left.widthUnit;
                styleObject['border-left-style'] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  styleObject['border-left-color'] = element.border.left.colors.hex8;
                }
              }

              styleObject['border-top-left-radius'] =
                element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              styleObject['border-top-right-radius'] =
                element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              styleObject['border-bottom-left-radius'] =
                element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              styleObject['border-bottom-right-radius'] =
                element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case 'font':
              styleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject['color'] = element.fontColors.hex8;
              }
              styleObject['font-weight'] = element.fontWeight && element.fontWeight.split(' ')[0];
              styleObject['font-style'] = element.fontStyle;
              styleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              styleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              styleObject['text-align'] = element.fontTextAlign;
              styleObject['text-decoration'] = element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
    },
    /**
     * tab样式转换
     */
    convertTabAttrToStyleObject() {
      let styleObject = {};
      let titleStyleObject = {};
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .ant-tabs-nav',
        this.propData.headLine && ['top', 'bottom'].includes(this.propData.tabPosition)
          ? {
              left: this.propData.headLineWidth + 'px'
            }
          : { left: 'unset' }
      );
      if (this.propData.size == 'small') {
        titleStyleObject = {
          padding: '8px 0',
          'font-size': '14px'
        };
      } else if (this.propData.size == 'large') {
        titleStyleObject = {
          padding: '16px 0',
          'font-size': '16px'
        };
      } else {
        titleStyleObject = {
          padding: '12px 0',
          'font-size': '14px'
        };
      }
      if (this.propData.tabPosition == 'bottom') {
        titleStyleObject = {
          ...titleStyleObject,
          bottom: 0
        };
      } else {
        titleStyleObject = {
          ...titleStyleObject,
          top: 0
        };
      }
      if (this.propData.headLineFont) {
        const element = this.propData.headLineFont;
        titleStyleObject['font-family'] = element.fontFamily;
        if (element.fontColors.hex8) {
          titleStyleObject['color'] = element.fontColors.hex8;
        }
        titleStyleObject['font-weight'] = element.fontWeight && element.fontWeight.split(' ')[0];
        titleStyleObject['font-style'] = element.fontStyle;
        titleStyleObject['font-size'] = element.fontSize + element.fontSizeUnit;
        titleStyleObject['line-height'] =
          element.fontLineHeight +
          (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
        titleStyleObject['text-align'] = element.fontTextAlign;
        titleStyleObject['text-decoration'] = element.fontDecoration;
      }
      titleStyleObject['left'] = this.propData.headLineLeft + 'px';
      styleObject = { 'text-shadow': 'none' };
      //ant-tabs-tab  以tab为单位的
      if (
        this.propData.tabLeftPadding &&
        this.propData.tabLeftPadding.inputVal + '' &&
        this.propData.tabLeftPadding.selectVal
      ) {
        styleObject['padding-left'] =
          this.propData.tabLeftPadding.inputVal + this.propData.tabLeftPadding.selectVal;
      }
      if (
        this.propData.tabRightPadding &&
        this.propData.tabRightPadding.inputVal + '' &&
        this.propData.tabRightPadding.selectVal
      ) {
        styleObject['padding-right'] =
          this.propData.tabRightPadding.inputVal + this.propData.tabRightPadding.selectVal;
      }
      if (
        this.propData.tabTopPadding &&
        this.propData.tabTopPadding.inputVal + '' &&
        this.propData.tabTopPadding.selectVal
      ) {
        styleObject['padding-top'] =
          this.propData.tabTopPadding.inputVal + this.propData.tabTopPadding.selectVal;
        titleStyleObject['padding-top'] =
          this.propData.tabTopPadding.inputVal + this.propData.tabTopPadding.selectVal;
      }
      if (
        this.propData.tabBottomPadding &&
        this.propData.tabBottomPadding.inputVal + '' &&
        this.propData.tabBottomPadding.selectVal
      ) {
        styleObject['padding-bottom'] =
          this.propData.tabBottomPadding.inputVal + this.propData.tabBottomPadding.selectVal;
        titleStyleObject['padding-bottom'] =
          this.propData.tabBottomPadding.inputVal + this.propData.tabBottomPadding.selectVal;
      }
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .ant-tabs-nav .ant-tabs-tab',
        styleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          ' .ant-tabs-extra-content .idm_itodotabslist_tabbarextra_box .idm_itodotabslist_headline',
        titleStyleObject
      );
      //当前选中的tab
      styleObject = {};
      if (this.propData.tabActiveBold) {
        styleObject['font-weight'] = 'bold';
      }
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .ant-tabs-nav .ant-tabs-tab-active',
        styleObject
      );

      //角标
      styleObject = {};
      if (this.propData.remindOffsetX) {
        styleObject['right'] = this.propData.remindOffsetX + 'px';
      }
      if (this.propData.remindOffsetY) {
        styleObject['top'] = this.propData.remindOffsetY + 'px';
      }
      if (this.propData.remindBgColor && this.propData.remindBgColor.hex8) {
        styleObject['background-color'] = this.propData.remindBgColor.hex8;
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ant-tabs-tab-remind', styleObject);

      //分割线
      if (this.propData.tabShowDivider) {
        styleObject = {};
        if (this.propData.dividerHeightNumber + '') {
          styleObject['height'] = this.propData.dividerHeightNumber + '%';
        }
        if (this.propData.dividerTopNumber + '') {
          styleObject['top'] = this.propData.dividerTopNumber + '%';
        }
        if (this.propData.dividerRightNumber + '') {
          styleObject['right'] = this.propData.dividerRightNumber + 'px';
        }
        if (this.propData.dividerBgColor && this.propData.dividerBgColor.hex8) {
          styleObject['background-color'] = this.propData.dividerBgColor.hex8;
        }
        window.IDM.setStyleToPageHead(
          this.moduleObject.id + ' .ant-tabs-tab-divider::before',
          styleObject
        );
      }
      //整个tab容器的
      styleObject = {};
      let innerStyleObject = {},
        extraBtnStyleObject = {},
        extraBtnSvgStyleObject = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'extraBtnGutter':
              extraBtnStyleObject['padding-left'] = parseInt(element) / 2 + 'px';
              extraBtnStyleObject['padding-right'] = parseInt(element) / 2 + 'px';
              break;
            case 'extraBtnFontColor':
              if (element.hex8) {
                extraBtnStyleObject['color'] = element.hex8;
              }
              break;
            case 'extraBtnFontSize':
              extraBtnStyleObject['font-size'] = element + 'px';
              extraBtnSvgStyleObject['font-size'] = element + 'px';
              extraBtnSvgStyleObject['max-height'] = element + 'px';
              extraBtnSvgStyleObject['width'] = element + 'px';
              break;
            case 'innerBox':
              if (element.marginTopVal) {
                innerStyleObject['margin-top'] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                innerStyleObject['margin-right'] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                innerStyleObject['margin-bottom'] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                innerStyleObject['margin-left'] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                innerStyleObject['padding-top'] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                innerStyleObject['padding-right'] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                innerStyleObject['padding-bottom'] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                innerStyleObject['padding-left'] = `${element.paddingLeftVal}`;
              }
              break;
            case 'tabFont':
              styleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject['color'] = element.fontColors.hex8;
              }
              styleObject['font-weight'] = element.fontWeight && element.fontWeight.split(' ')[0];
              styleObject['font-style'] = element.fontStyle;
              styleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              styleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              styleObject['text-align'] = element.fontTextAlign;
              styleObject['text-decoration'] = element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .ant-tabs .ant-tabs-nav-container',
        styleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .idm_itodotabslist_list_box',
        innerStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          ' .idm_itodotabslist_tabbarextra_box>*:not(.idm_itodotabslist_headline)',
        extraBtnStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          ' .idm_itodotabslist_tabbarextra_box>*:not(.idm_itodotabslist_headline) svg',
        extraBtnSvgStyleObject
      );
    },
    /**
     * 列表样式转换
     */
    convertListAttrToStyleObject() {
      let diverseStyleObject = {},
        diverseBoxStyleObject = {},
        diverseHoverStyleObject = {},
        diverseLoadStyleObject = {},
        tableBodyStyleObject = {},
        tableTitleStyleObject = {};

      if (this.propData.diverseDefaultLineHeight) {
        diverseStyleObject['height'] = this.propData.diverseDefaultLineHeight + 'px';
        diverseStyleObject['line-height'] = this.propData.diverseDefaultLineHeight + 'px';
        tableBodyStyleObject['height'] =
          'calc(100% - ' + this.propData.diverseDefaultLineHeight + 'px)';
      }
      if (this.propData.diverseDefaultBox) {
        let element = this.propData.diverseDefaultBox;
        if (element.marginTopVal) {
          diverseBoxStyleObject['margin-top'] = `${element.marginTopVal}`;
        }
        if (element.marginRightVal) {
          diverseBoxStyleObject['margin-right'] = `${element.marginRightVal}`;
        }
        if (element.marginBottomVal) {
          diverseBoxStyleObject['margin-bottom'] = `${element.marginBottomVal}`;
        }
        if (element.marginLeftVal) {
          diverseBoxStyleObject['margin-left'] = `${element.marginLeftVal}`;
        }
        if (element.paddingTopVal) {
          diverseBoxStyleObject['padding-top'] = `${element.paddingTopVal}`;
        }
        if (element.paddingRightVal) {
          diverseBoxStyleObject['padding-right'] = `${element.paddingRightVal}`;
        }
        if (element.paddingBottomVal) {
          diverseBoxStyleObject['padding-bottom'] = `${element.paddingBottomVal}`;
        }
        if (element.paddingLeftVal) {
          diverseBoxStyleObject['padding-left'] = `${element.paddingLeftVal}`;
        }
      }
      if (this.propData.diverseHoverBgColor && this.propData.diverseHoverBgColor.hex8) {
        diverseHoverStyleObject['background-color'] = this.propData.diverseHoverBgColor.hex8;
      }
      if (this.propData.diverseHoverShadow) {
        diverseHoverStyleObject['box-shadow'] = this.propData.diverseHoverShadow;
      }
      if (this.propData.diverseHoverBox) {
        let element = this.propData.diverseHoverBox;
        if (element.marginTopVal) {
          diverseHoverStyleObject['margin-top'] = `${element.marginTopVal}`;
        }
        if (element.marginRightVal) {
          diverseHoverStyleObject['margin-right'] = `${element.marginRightVal}`;
        }
        if (element.marginBottomVal) {
          diverseHoverStyleObject['margin-bottom'] = `${element.marginBottomVal}`;
        }
        if (element.marginLeftVal) {
          diverseHoverStyleObject['margin-left'] = `${element.marginLeftVal}`;
        }
        if (element.paddingTopVal) {
          diverseHoverStyleObject['padding-top'] = `${element.paddingTopVal}`;
        }
        if (element.paddingRightVal) {
          diverseHoverStyleObject['padding-right'] = `${element.paddingRightVal}`;
        }
        if (element.paddingBottomVal) {
          diverseHoverStyleObject['padding-bottom'] = `${element.paddingBottomVal}`;
        }
        if (element.paddingLeftVal) {
          diverseHoverStyleObject['padding-left'] = `${element.paddingLeftVal}`;
        }
      }
      if (this.propData.diverseLoadingFont) {
        let element = this.propData.diverseLoadingFont;
        diverseLoadStyleObject['font-family'] = element.fontFamily;
        if (element.fontColors.hex8) {
          diverseLoadStyleObject['color'] = element.fontColors.hex8;
        }
        diverseLoadStyleObject['font-weight'] =
          element.fontWeight && element.fontWeight.split(' ')[0];
        diverseLoadStyleObject['font-style'] = element.fontStyle;
        diverseLoadStyleObject['font-size'] = element.fontSize + element.fontSizeUnit;
        diverseLoadStyleObject['line-height'] =
          element.fontLineHeight +
          (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
        diverseLoadStyleObject['text-align'] = element.fontTextAlign;
        diverseLoadStyleObject['text-decoration'] = element.fontDecoration;
      }
      if (this.propData.tableTitleBgColor && this.propData.tableTitleBgColor.hex8) {
        tableTitleStyleObject['background-color'] = this.propData.tableTitleBgColor.hex8;
      }
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .idm-diverse-list-module-box .idm-dlm-item-static',
        diverseStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .idm-diverse-list-module-box',
        diverseBoxStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .idm-diverse-list-module-box .idm-dlm-item-body',
        tableBodyStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .idm-diverse-list-module-row .idm-dlm-item-hover',
        diverseHoverStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .idm-diverse-list-module-box .idm-dlm-load-style',
        diverseLoadStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .idm-diverse-list-module-box>.idm-dlm-item-flex',
        tableTitleStyleObject
      );
    },
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject() {
      var themeList = this.propData.themeList;
      if (!themeList) {
        return;
      }
      const themeNamePrefix =
        IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
          ? IDM.setting.applications.themeNamePrefix
          : 'idm-theme-';
      for (var i = 0; i < themeList.length; i++) {
        var item = themeList[i];
        //item.key：为主题样式的key
        //item.mainColor：主要颜色值
        //item.minorColor：次要颜色值
        // if(item.key!=IDM.theme.getCurrentThemeInfo()){
        //     //此处比对是不渲染输出不用的样式，如果页面会刷新就可以把此处放开
        //     continue;
        // }
        let cssObject_color_main = {
          color: item.mainColor ? item.mainColor.hex8 : ''
        };
        let cssObject_border_main = {
          'border-color': item.mainColor ? item.mainColor.hex8 : ''
        };
        let cssObject_background_main = {
          'background-color': item.mainColor ? item.mainColor.hex8 : ''
        };
        let cssObject_background_minor = {
          'background-color': item.minorColor ? item.minorColor.hex8 : ''
        };
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .ant-tabs-nav .ant-tabs-tab-active,.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .ant-tabs-nav .ant-tabs-tab:hover',
          cssObject_color_main
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .ant-tabs-ink-bar',
          cssObject_background_main
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .idm-diverse-list-module-box .idm-dlm-item-body .idm-diverse-list-module-row:hover',
          cssObject_background_minor
        );
        //layer的主题
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' .itodotabslist-layer-skin .idm-layer-btn .idm-layer-btn0',
          {
            ...cssObject_border_main,
            ...cssObject_background_main
          }
        );
      }
    },
    /**
     * 切换面板的回调
     */
    changeCallback(key) {
      let that = this;
      this.activeTab = key;
      this.extraBtnShowStatusHandle('changeTab');
      this.dragContainerShowStatusHandle('changeTab');
      this.changeEventFunHandle('changeFunction');
    },
    /**
     * next 按钮被点击的回调
     */
    nextClickCallback() {
      this.changeEventFunHandle('nextClickFunction');
    },
    /**
     * prev 按钮被点击的回调
     */
    prevClickCallback() {
      this.changeEventFunHandle('prevClickFunction');
    },
    /**
     * tab 被点击的回调
     */
    tabClickCallback() {
      this.changeEventFunHandle('tabClickFunction');
    },
    /**
     * 通用自定义函数
     * name:属性名，会根据此属性名去propData中获取
     * customFunctionList：忽略name直接传自定义函数集合
     */
    changeEventFunHandle(name, customFunctionList) {
      let that = this;
      var customHandle = customFunctionList || that.propData[name];
      customHandle &&
        customHandle.forEach(item => {
          window[item.name] &&
            window[item.name].call(this, {
              ...that.commonParam(),
              customParam: item.param,
              _this: that,
              activeKey: that.activeTab,
              allKey: that.allTabList,
              allTabDataList: that.getAllTabDataList()
            });
        });
    },
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam() {
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : '',
        urlData: JSON.stringify(urlObject)
      };
      return params;
    },
    /**
     * 根据属性HeightType确定是使用固定高度还是自动适应外层的高度
     * 如果使用固定高度则取设置的固定高度
     * 如果使用自适应外层高度则需要外层传过来高度
     * 不管上述使用哪种高度都需要去减去tab的高度外加外层容器的padding、margin和内层列表的margin、padding、注意重叠计算
     * @param {Number} wrapperHeight 为外层容器的实际高度值
     */
    resizeContentWrapperHeight(wrapperHeight) {
      let moduleHeight = this.propData.moduleHeight;
      if (this.propData.HeightType == 'adaptive' && wrapperHeight) {
        //自适应父级容器
        moduleHeight = wrapperHeight;

        //如果自适应则要减去上margin和下margin(因为margin、padding百分比都是相对父级宽度，所以要计算出实际的宽度值)
        //父级宽度值未知的，因为组件的宽度是100%显示的
        //所以计算公式为：(当前组件的宽度+左右margin实际数值)/(100-左右margin百分比总和)*100=实际宽度
        let iAttrArray = ['marginLeftVal', 'marginRightVal'];
        let marginNumber = 0,
          marginRatio = 0;
        iAttrArray.forEach(item => {
          if (
            this.propData.box &&
            this.propData.box[item] &&
            this.propData.box[item].indexOf('%') > -1
          ) {
            //用宽度计算出实际的px
            marginRatio += parseFloat(this.propData.box[item].replace('%', ''));
          } else if (this.propData.box && this.propData.box[item]) {
            marginNumber += parseFloat(this.propData.box[item].replace('px', ''));
          }
        });
        let module_width = this.$refs.module_ref.offsetWidth;
        //实际的100%的宽度
        const module_width_100 = ((module_width + marginNumber) / (100 - marginRatio)) * 100;

        let moduleTBMarginNumber = 0;
        iAttrArray = ['marginTopVal', 'marginBottomVal'];
        iAttrArray.forEach(item => {
          if (this.propData.box && this.propData.box[item]) {
            if (this.propData.box[item].indexOf('%') > -1) {
              //用宽度计算出实际的px
              moduleTBMarginNumber =
                moduleTBMarginNumber +
                (parseFloat(this.propData.box[item].replace('%', '')) / 100) * module_width_100;
            } else {
              moduleTBMarginNumber =
                moduleTBMarginNumber + parseFloat(this.propData.box[item].replace('px', ''));
            }
          }
        });
        moduleHeight = moduleHeight - moduleTBMarginNumber;
      }
      this.moduleHeight = moduleHeight;
      this.$nextTick(function() {
        //moduleHeight已经确定了固定的高度了
        let tabs_el = this.$refs.idm_module_tabs_wrapper.$el;
        //tabs的整体高度
        const tabHeight = tabs_el.offsetHeight;
        //获取tabbar的高度
        let tabbarHeight = 0,
          topTabBar = tabs_el.querySelector('.ant-tabs-top-bar'),
          bottomTabBar = tabs_el.querySelector('.ant-tabs-bottom-bar');
        if (topTabBar) {
          tabbarHeight = topTabBar.offsetHeight;
        } else if (bottomTabBar) {
          tabbarHeight = bottomTabBar.offsetHeight;
        }
        //tab内容高度
        let tabContentHeight = tabHeight - tabbarHeight,
          tabContentDom = tabs_el.querySelector('.ant-tabs-content');
        tabContentDom.style.height = tabContentHeight + 'px';
        //tab内容宽度
        const tabContentWidth = tabContentDom.offsetWidth;

        //tabContent容器外边距
        let contentTBMarginNumber = 0; //内容容器的占用的高度数
        let attrArray = ['marginTopVal', 'marginBottomVal'];
        attrArray.forEach(item => {
          if (this.propData.innerBox && this.propData.innerBox[item]) {
            if (this.propData.innerBox[item].indexOf('%') > -1) {
              //用宽度计算出实际的px
              contentTBMarginNumber =
                contentTBMarginNumber +
                (parseFloat(this.propData.innerBox[item].replace('%', '')) / 100) * tabContentWidth;
            } else {
              contentTBMarginNumber =
                contentTBMarginNumber + parseFloat(this.propData.innerBox[item].replace('px', ''));
            }
          }
        });
        //tabContent容器的内边距
        let contentTBPaddingNumber = 0;
        attrArray = ['paddingTopVal', 'paddingBottomVal'];
        attrArray.forEach(item => {
          if (this.propData.innerBox && this.propData.innerBox[item]) {
            if (this.propData.innerBox[item].indexOf('%') > -1) {
              //用宽度计算出实际的px
              contentTBPaddingNumber =
                contentTBPaddingNumber +
                (parseFloat(this.propData.innerBox[item].replace('%', '')) / 100) * tabContentWidth;
            } else {
              contentTBPaddingNumber =
                contentTBPaddingNumber + parseFloat(this.propData.innerBox[item].replace('px', ''));
            }
          }
        });
        //添加内容容器的高度样式(拿父容器的高度-本身的上外边距和下外边距=tab下的内容容器的高度)
        let itodolistHeight = tabContentHeight - contentTBMarginNumber;
        window.IDM.setStyleToPageHead(
          this.moduleObject.id + ' .idm_itodotabslist_list_box,.idm_empty_classname',
          {
            height: itodolistHeight + 'px'
          }
        );
        //计算内容容器的宽度值(提供给列表组件容器使用计算各个实际值)
        let tabInnerContentWidth = tabContentWidth;
        attrArray = ['marginLeftVal', 'marginRightVal', 'paddingLeftVal', 'paddingRightVal'];
        attrArray.forEach(item => {
          if (this.propData.innerBox && this.propData.innerBox[item]) {
            if (this.propData.innerBox[item].indexOf('%') > -1) {
              //用宽度计算出实际的px
              tabInnerContentWidth =
                tabInnerContentWidth -
                (parseFloat(this.propData.innerBox[item].replace('%', '')) / 100) * tabContentWidth;
            } else {
              tabInnerContentWidth =
                tabInnerContentWidth - parseFloat(this.propData.innerBox[item].replace('px', ''));
            }
          }
        });

        //列表组件容器的最外围的内外边距

        //要减去自身的margintop、和bottom以及tab内容容器的上下padding才是列表组件里面的容器高度
        let tabInnerMarginNumber = 0;
        attrArray = ['marginTopVal', 'marginBottomVal'];
        attrArray.forEach(item => {
          if (this.propData.diverseDefaultBox && this.propData.diverseDefaultBox[item]) {
            if (this.propData.diverseDefaultBox[item].indexOf('%') > -1) {
              //用宽度计算出实际的px
              tabInnerMarginNumber =
                tabInnerMarginNumber +
                (parseFloat(this.propData.diverseDefaultBox[item].replace('%', '')) / 100) *
                  tabInnerContentWidth;
            } else {
              tabInnerMarginNumber =
                tabInnerMarginNumber +
                parseFloat(this.propData.diverseDefaultBox[item].replace('px', ''));
            }
          }
        });
        //还需要减去上述的contentTBPaddingNumber才是列表组件内的高度
        let tabInnerListHeight = itodolistHeight - tabInnerMarginNumber - contentTBPaddingNumber;
        window.IDM.setStyleToPageHead(
          this.moduleObject.id + ' .idm-diverse-list-module-box,.idm_empty_classname',
          {
            height: tabInnerListHeight + 'px'
          }
        );
      });
    },
    /**
     * 组件通信：接收消息的方法
     * @param {
     *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
     *  message:{发送的时候传输的消息对象数据}
     *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
     *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
     * } object
     */
    receiveBroadcastMessage(object) {
      //一定要注释，因为收到消息可能是会很频繁的，这里可以选择防抖，但实际效果可能不太好（因为改变窗口要停止了元素才会变化，所以体验效果不好，但是节约了性能）
      // console.log("组件收到消息", object,this.moduleObject.id);
      if (
        object &&
        object.type == 'regionResize' &&
        object.message &&
        object.message.gridEleTarget
      ) {
        let gridEleTarget = object.message.gridEleTarget;
        if (gridEleTarget && gridEleTarget.offsetHeight) {
          // console.log("🚀 ~ file: ITodoTabsList.vue ~ line 1757 ~ receiveBroadcastMessage ~ gridEleTarget", gridEleTarget.offsetHeight+"")
          this.resizeContentWrapperHeight(gridEleTarget.offsetHeight);
        }
      }
    },
    /**
     * 组件通信：发送消息的方法
     * @param {
     *  type:"自己定义的，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）",
     *  message:{实际的消息对象},
     *  rangeModule:"为空发送给全部，根据配置的属性中设定的值（值的内容是组件的packageid数组），不取子表的，比如直接 this.$root.propData.compositeAttr["attrKey"]（注意attrKey是属性中定义的bindKey）,这里的格式为：['1','2']"",
     *  className:"指定的组件类型，比如只给待办组件发送，然后再去过滤上面的值"
     *  globalSend:如果为true则全站发送消息，注意全站rangeModule是无效的，只有className才有效，默认为false
     * } object
     */
    sendBroadcastMessage(object) {
      window.IDM.broadcast && window.IDM.broadcast.send(object);
    },
    /**
     * 交互功能：设置组件的上下文内容值
     * @param {
     *  type:"定义的类型，已知类型：pageCommonInterface（页面统一接口返回值）、"
     *  key:"数据key标识，页面每个接口设置的数据集名称，方便识别获取自己需要的数据"
     *  data:"数据集，内容为：字符串 or 数组 or 对象"
     * }
     */
    setContextValue(object) {
      // console.log("统一接口设置的值", object);
      if (object.type != 'pageCommonInterface') {
        return;
      }
      //这里使用的是子表，所以要循环匹配所有子表的属性然后再去设置修改默认值
      if (object.key == this.propData.dataName) {
      }
    },
    /**
     * 根据结果集来执行表达式的结果
     * dataName：结果集名，建议直接data即可
     * dataFiled：表达式
     * resultData：要查下的结果集
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if (dataFiled) {
        var filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths('[') ? '' : '.') + filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject);
      }
      return _defaultVal;
    },
    /**
     * 字符串表达式替换
     */
    getReplaceExpressString(expressString, resultData) {
      var _defaultVal = '';
      if (expressString) {
        _defaultVal = window.IDM.express.replace.call(this, expressString, resultData);
      }
      return _defaultVal;
    }
  }
};
</script>
<style lang="scss">
.idm_itodotabslist {
  height: 100%;
  // .ant-tabs-content .ant-tabs-tabpane{
  //   height: 100%;
  // }
  .ant-tabs-tab-remind {
    position: absolute;
    top: 0px;
    right: 0px;
    border-radius: 10px;
    padding: 0 6px;
    width: auto;
    height: 20px;
    line-height: 18px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
    background-color: #ec4519;
    font-size: 12px;
    color: #fff;
    transform: translate(100%, 0);
    -webkit-transform: translate(100%, 0);
    -moz-transform: translate(100%, 0);
    transition: all linear 0.2s;
    &.ant-tabs-tab-remind-reddot {
      width: 8px;
      height: 8px;
      color: transparent;
      border-radius: 50%;
      padding: 0;
    }
  }
  &.ant-tabs-vertical .ant-tabs-tab-remind,
  &.ant-tabs-card .ant-tabs-tab-remind {
    transform: none;
    -webkit-transform: none;
    -moz-transform: none;
  }
  .ant-tabs-tab-divider {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0px;
      width: 1px;
      height: 50%;
      background-color: #e8e8e8;
      pointer-events: none;
      // transform: translate(0,50%);
      // -webkit-transform: translate(0,50%);
      // -moz-transform: translate(0,50%);
    }
  }
  .ant-tabs-nav .ant-tabs-tab:last-child .ant-tabs-tab-divider {
    &::before {
      display: none;
    }
  }
  .ant-tabs-bar,
  .ant-tabs-bottom .ant-tabs-bottom-bar {
    margin: 0 !important;
  }
  &.ant-tabs .ant-tabs-left-content {
    padding-left: 0px;
  }
  &.ant-tabs .ant-tabs-right-content {
    padding-right: 0px;
  }
  .idm_itodotabslist_tabbarextra_box {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
    & > *:not(.idm_itodotabslist_headline) {
      padding: 0px 10px;
      cursor: pointer;
      user-select: none;
      transition: opacity linear 0.2s;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    }
    .idm_button_svg_icon {
      font-size: 14px;
      max-height: 14px;
      width: 14px;
      fill: currentColor;
      vertical-align: -0.15em;
      margin-right: 3px;
      outline: none;
    }
    .idm_itodotabslist_headline {
      position: absolute;
      left: 0;
      line-height: 1.5;
      font-size: 14px;
      font-weight: bold;
      padding: 12px 0;
    }
  }
  .idm_itodotabslist_search_box {
    input {
      display: none;
    }
  }
  .idm_itodotabslist_search_box.open-search {
    width: 180px;
    height: 30px;
    border: 1px solid #e3e4e5;
    background-color: #f1f1f1;
    border-radius: 15px;
    line-height: initial;
    margin-top: -1px;
    position: relative;
    .idm-icon-searchOutline {
      position: absolute;
      right: 3px;
      top: 3px;
      font-size: 20px !important;
      max-height: 20px !important;
      width: 20px !important;
    }
    input {
      display: block;
      height: 100%;
      outline: none;
      width: calc(100% - 20px);
      border: none;
      background: transparent;
      color: #333333 !important;
    }
  }
}
.idm_itodotabslist_drag_container {
  position: absolute;
  top: 0;
  left: 0;
}
//子组件通用样式

.idm-diverse-list-module-box {
  width: 100%;
  min-height: 50px;
  height: 100%;
  // height: 300px;
  .idm-dlm-loading-info,
  .idm-dlm-nodata-info {
    text-align: center;
    padding: 20px;
  }
  // overflow: auto;
  .idm-dlm-opbutton-vertical {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: auto;
    & > * {
      display: block;
      line-height: normal;
    }
  }
}
.idm_filed_svg_icon {
  font-size: 14px;
  max-height: 14px;
  width: 14px;
  fill: currentColor;
  vertical-align: -0.15em;
  // margin-right: 3px;
  outline: none;
}
</style>
