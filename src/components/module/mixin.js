
import demo from "./demo.json";
import vuescroll from "vuescroll";
export default {
  components: {
    "vue-scroll": vuescroll,
  },
  props: {
    //所有组件的属性
    propData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    //当前tab的对象
    tabObject: {
      type: Object,
      default: function () {
        return {};
      },
    },
    //当前组件的对象
    moduleObject: {
      type: Object,
      default: function () {
        return {};
      },
    },
    //所有tab集合
    allTabList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //所有动态属性集合
    allDynamicAttrList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //当前tab的key
    currentKey: {
      type: String,
    },
    //传递过来的参数
    searchText: {
      type: String,
    },
  },
  data() {
    return {
      scrollOps: {
        scrollPanel: {
          scrollingX: false,
        },
        bar: {
          background: "#e8e8e8",
        },
        vuescroll: {
          wheelScrollDuration: 100,
        },
      },
      //图标字段显示集合
      iconDataList: [],
      //多样化表格字段显示
      diverseFiledList: [],
      //传统表格字段显示
      tableFiledList:[],
      //操作按钮集合
      buttonDataList: [],
      //列表数据
      listData: [
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
        JSON.parse(JSON.stringify(demo[0])),
      ],
      pageIndex: 1,
      pageSize: 20,
      loading: false,
      loadingEnd: false,
      lastLoadDataCount: 0,
      //后续传递的内部搜索结果
      innerSearchText: undefined,
    }
  },
  created() {
    this.initPropDataList();
    this.reloadCurrentTabList();
  },
  methods: {
    /**
     * 滚动条滚动完成函数，也就是停止的函数
     */
    handleComplete(vertical, horizontal) {
      // console.log(vertical, horizontal)
    },
    /**
     * 滚动触发
     */
    handleScroll(vertical, horizontal, nativeEvent) {
      // console.log(vertical, horizontal, nativeEvent)
      let scrollBottom =
        nativeEvent.srcElement.scrollHeight -
        nativeEvent.srcElement.scrollTop -
        nativeEvent.srcElement.offsetHeight;
      if (scrollBottom < 100) {
        //小于100触发加载事件
        this.initCurrentTabList();
      }
    },
    /**
     * 给图标对象赋值
     */
    initPropDataList() {
      this.iconDataList = this.propData.iconOptionList;
      this.diverseFiledList = this.propData.diverseFiledList;
      this.tableFiledList = this.propData.tableFiledList;
      this.buttonDataList = this.propData.buttonOptionList;
    },
    btnClickEventFunHandle(btnItem,fobj,item){
      switch (btnItem.buttonHandleType) {
        case "send":
          //发送
          break;
        case "sendBack":
          //退回
          break;
        case "readed":
          //阅毕
          break;
        case "favorite":
          //收藏
          break;
        case "unfavorite":
          //取消收藏
          break;
        case "custom":
          //自定义函数
          break;
      }
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
      let allDynamicAttrObject = {};
      this.allDynamicAttrList &&
        this.allDynamicAttrList.forEach((item) => {
          try {
            allDynamicAttrObject[item.attrCode] = JSON.parse(item.attrData);
          } catch (error) {
            allDynamicAttrObject[item.attrCode] = item.attrData;
          }
        });
      return {
        //所有tab的逗号隔开
        allTabTypes: this.getAllTabKeyArray().join(","),
        //当前tab
        currentTabType: currentTab || this.currentKey,
        startIndex: (this.pageIndex - 1) * this.pageSize,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        allDynamicAttrObject: allDynamicAttrObject,
        tabObject: this.tabObject,
        searchText:
          this.innerSearchText === undefined
            ? this.searchText
            : this.innerSearchText,
      };
    },
    /**
     * 查询列表
     */
    searchList(searchText) {
      this.innerSearchText = searchText;
      this.reloadCurrentTabList();
    },
    /**
     * 重新加载数据
     */
    reloadCurrentTabList() {
      //非组件模式下不清空示例数据
      if (this.moduleObject.env == undefined) {
        return;
      }
      this.loadingEnd = false;
      this.pageIndex = 1;
      this.listData = [];
      this.initCurrentTabList();
    },
    /**
     * 加载当前tab的列表
     */
    initCurrentTabList() {
      let that = this;
      //防止频繁触发多次加载
      if (that.loading || that.loadingEnd) {
        return;
      }
      that.loading = true;
      if (!that.propData.listUrl) {
        return;
      }
      let platformlistUrl = that.getReplaceExpressString(
        that.propData.listUrl,
        that.getUseUrlAllObjectData()
      );
      IDM.http
        .get(platformlistUrl)
        .then((res) => {
          if (res && res.data && res.data.data && res.data.data.tabs) {
            var tabs = res.data.data.tabs;
            var datalist =
              tabs[that.getUseUrlAllObjectData().currentTabType].data;
            if (that.listUrlExtend) {
              //如果有扩展接口在扩展接口里面接着获取数据并且合并数据
              that.initExtendCurrentTabList(datalist);
            } else {
              that.interfaceLaterHandle(datalist);
            }
          } else if (that.listUrlExtend) {
            //如果有扩展接口在扩展接口里面接着获取数据并且合并数据
            that.initExtendCurrentTabList();
          } else {
            that.interfaceLaterHandle();
          }
        })
        .catch((err) => {
          //加载出现错误，应该要提示的
          that.loading = false;
          console.log(err);
        });
    },
    /**
     * 加载当前tab的列表
     */
    initExtendCurrentTabList(platformDataList) {
      let that = this;
      let extendlistUrlExtend = that.getReplaceExpressString(
        that.propData.listUrlExtend,
        that.getUseUrlAllObjectData()
      );
      IDM.http
        .get(extendlistUrlExtend)
        .then((res) => {
          //每个用户的定制结果
          if (res && res.data && res.data.data && res.data.data.tabs) {
            var tabObject =
              res.data.data.tabs[that.getUseUrlAllObjectData().currentTabType];
            if (!tabObject || (tabObject && !tabObject.data)) {
              //没有返回结果，需要把上一次的追加
              that.interfaceLaterHandle(platformDataList);
            } else {
              var datalist = tabObject.data;
              that.interfaceLaterHandle(datalist);
            }
          } else {
            that.interfaceLaterHandle(platformDataList);
          }
        })
        .catch((err) => {
          //加载出现错误，应该要提示的
          that.loading = false;
          console.log(err);
        });
    },
    /**
     * 接口返回结果处理函数
     */
    interfaceLaterHandle(datalist) {
      let that = this;
      //在数据追加之前要调用自定义，allList不包含当前要加载的
      that.commonEventFunHandle(that.listLoadedFunction, {
        allList: that.listData,
        currentList: datalist,
      });

      datalist &&
        datalist.forEach((item) => {
          item["idm_checkbox_status"] = false;
          that.listData.push(item);
        });
      //设置最后一次加载的数量
      that.lastLoadDataCount = datalist ? datalist.length : 0;
      if (that.lastLoadDataCount < that.pageSize) {
        that.loadingEnd = true;
      }
      //加载完毕
      that.loading = false;
      that.pageIndex = that.pageIndex + 1;
    },
    /**
     * 获取字段自定义字体和宽度
     */
    getFieldCustomFont(fobj, itemObject) {
      let styleObject = {
        width:
          fobj.width && fobj.width.inputVal && fobj.width.selectVal
            ? fobj.width.inputVal + fobj.width.selectVal
            : "auto",
      };
      const isRead = this.getExpressData(
        "data",
        fobj.readExpression,
        itemObject
      );
      if(fobj.iconType == 'button'){
        styleObject["display"]="flex";
        styleObject["align-items"]="center";
        styleObject["justify-content"]= "flex-start";
      }
      const element = isRead ? fobj.readFont : fobj.defaultFont;
      if (element) {
        styleObject["font-family"] = element.fontFamily;
        if (element.fontColors && element.fontColors.hex8) {
          styleObject["color"] = element.fontColors.hex8;
        }
        styleObject["font-weight"] =
          element.fontWeight && element.fontWeight.split(" ")[0];
        styleObject["font-style"] = element.fontStyle;
        styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
        styleObject["line-height"] =
          element.fontLineHeight +
          (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
        styleObject["text-align"] = element.fontTextAlign;
        styleObject["text-decoration"] = element.fontDecoration;
        if(fobj.iconType == 'button'){
          switch (element.fontTextAlign) {
            case "left":
              styleObject["justify-content"]= "flex-start";
              break;
            case "center":
              styleObject["justify-content"]= "center";
              break;
            case "right":
              styleObject["justify-content"]= "flex-end";
              break;
          }
        }
      }
      if (fobj.clickCustomFunction && fobj.clickCustomFunction.length > 0) {
        styleObject["cursor"] = "pointer";
      }
      if(fobj.fieldLeftPadding||fobj.fieldLeftPadding===0){
        styleObject["padding-left"] = fobj.fieldLeftPadding+"px";
      }
      if(fobj.fieldRightPadding||fobj.fieldRightPadding===0){
        styleObject["padding-right"] = fobj.fieldRightPadding+"px";
      }
      return styleObject;
    },
    /**
     * 获取字段标题自定义字体和宽度
     */
    getFieldTitleCustomFont(fobj) {
      let styleObject = {
        width:
          fobj.width && fobj.width.inputVal && fobj.width.selectVal
            ? fobj.width.inputVal + fobj.width.selectVal
            : "auto",
      };
      let element = fobj.defaultFont
      if (element) {
        styleObject["text-align"] = element.fontTextAlign;
      }
      element = this.propData.tableTitleFont;
      if (element) {
        styleObject["font-family"] = element.fontFamily;
        if (element.fontColors && element.fontColors.hex8) {
          styleObject["color"] = element.fontColors.hex8;
        }
        styleObject["font-weight"] =
          element.fontWeight && element.fontWeight.split(" ")[0];
        styleObject["font-style"] = element.fontStyle;
        styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
        styleObject["line-height"] =
          element.fontLineHeight +
          (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
        styleObject["text-decoration"] = element.fontDecoration;
      }
      if(fobj.fieldLeftPadding||fobj.fieldLeftPadding===0){
        styleObject["padding-left"] = fobj.fieldLeftPadding+"px";
      }
      if(fobj.fieldRightPadding||fobj.fieldRightPadding===0){
        styleObject["padding-right"] = fobj.fieldRightPadding+"px";
      }
      return styleObject;
    },
    /**
     * 获取字段自定义图标的大小
     */
    getFieldSvgIconCustomFont(fobj, itemObject) {
      let styleObject = {};
      const isRead = this.getExpressData(
        "data",
        fobj.readExpression,
        itemObject
      );
      const element = isRead ? fobj.readFont : fobj.defaultFont;
      if (element) {
        styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
        styleObject["max-height"] = element.fontSize + element.fontSizeUnit;
        styleObject["width"] = element.fontSize + element.fontSizeUnit;
      }
      return styleObject;
    },
    /**
     * 获取操作列按钮自定义图标的大小
     */
    getButtonSvgIconCustomFont(fobj, fontAttr,issvg) {
      let styleObject = {};
      const element = fobj[fontAttr];
      if (element) {
        styleObject["font-family"] = element.fontFamily;
        if (element.fontColors && element.fontColors.hex8) {
          styleObject["color"] = element.fontColors.hex8;
        }
        styleObject["font-weight"] =
          element.fontWeight && element.fontWeight.split(" ")[0];
        styleObject["font-style"] = element.fontStyle;
        styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
        styleObject["line-height"] =
          element.fontLineHeight +
          (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
        styleObject["text-align"] = element.fontTextAlign;
        styleObject["text-decoration"] = element.fontDecoration;
        if(issvg){
          styleObject["max-height"] = element.fontSize + element.fontSizeUnit;
          styleObject["width"] = element.fontSize + element.fontSizeUnit;
        }
      }
      return styleObject;
    },
    /**
     * 获取其他根属性下自定义函数处理后的结果
     */
    getOtherCustomRender(configObject, name) {
      return (
        window[configObject[name][0].name] &&
        window[configObject[name][0].name].call(this, {
          customParam: configObject[name][0].param,
          currentKey: this.currentKey,
          tabObject: this.tabObject,
        })
      );
    },
    /**
     * 获取自定义函数处理后的结果
     */
    getFieldCustomRender(configObject, itemObject) {
      return (
        window[configObject.customShowFunction[0].name] &&
        window[configObject.customShowFunction[0].name].call(this, {
          customParam: configObject.customShowFunction[0].param,
          currentKey: this.currentKey,
          configObject,
          itemObject,
          tabObject: this.tabObject,
        })
      );
    },
    /**
     * 获取图标信息提示自定义函数处理后的结果
     */
    getIconFunCustomRender(
      configObject,
      itemObject,
      funname,
      fieldConfigObject
    ) {
      return (
        window[configObject[funname][0].name] &&
        window[configObject[funname][0].name].call(this, {
          customParam: configObject[funname][0].param,
          currentKey: this.currentKey,
          configObject,
          fieldConfigObject,
          itemObject,
          tabObject: this.tabObject,
        })
      );
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
        filedExp = dataName + (filedExp.startsWiths("[") ? "" : ".") + filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
      }
      return _defaultVal;
    },
    /**
     * 通用自定义函数
     * customFunctionList：忽略name直接传自定义函数集合
     * otherObject：其他参数对象
     */
    commonEventFunHandle(customFunctionList, otherObject) {
      let that = this;
      var customHandle = customFunctionList;
      customHandle &&
        customHandle.forEach((item) => {
          window[item.name] &&
            window[item.name].call(this, {
              customParam: item.param,
              that: this,
              currentKey: this.currentKey,
              tabObject: this.tabObject,
              ...otherObject,
            });
        });
    },
    /**
     * 字符串表达式替换
     */
    getReplaceExpressString(expressString, resultData) {
      var _defaultVal = "";
      if (expressString) {
        _defaultVal = window.IDM.express.replace.call(
          this,
          expressString,
          resultData
        );
      }
      return _defaultVal;
    },
  },
  mounted() {
  },
  watch: {
    propData: {
      handler(newVal, oldVal) {
        this.initPropDataList();
      },
      deep: true,
    },
  },
}
