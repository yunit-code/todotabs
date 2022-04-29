
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
      tableFiledList: [],
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
      this.pageSize = this.propData.listPageSize||30;
      this.iconDataList = this.propData.iconOptionList;
      this.diverseFiledList = this.propData.diverseFiledList;
      this.tableFiledList = this.propData.tableFiledList;
      this.buttonDataList = this.propData.buttonOptionList;
    },
    async btnClickEventFunHandle(btnItem, fobj, item) {
      let that = this;
      switch (btnItem.buttonHandleType) {
        case "send":
          //发送
          await this.btnClickAction_send(item, btnItem);
          break;
        case "sendBack":
          //退回
          this.btnClickAction_sendBack(item, btnItem);
          break;
        case "readed":
          //阅毕
          this.btnClickAction_readed(item, btnItem);
          break;
        case "favorite":
          //收藏
          this.btnClickAction_favorite(1, item, btnItem);
          break;
        case "unfavorite":
          //取消收藏
          this.btnClickAction_favorite(-1, item, btnItem);
          break;
        case "enroll":
          //报名
          await this.btnClickAction_enroll(item, btnItem);
          break;
        case "custom":
          //自定义函数
          this.commonEventFunHandle(btnItem.buttonCustomFunction, {
            configObject: btnItem,
            fieldConfigObject: fobj,
            itemObject:item,
            callback:function(reloadTabKeys){
              that.$emit('reloadTabInfo', reloadTabKeys);
            }
          });
          break;
      }
    },
    diverseHoverClickHandle(item){
      if(this.propData.diverseHoverClickToDo){
        //是否使用通用点击事件打开
        this.openToDo(item);
      }
      this.commonEventFunHandle(this.propData.diverseHoverClickCustomFunction, {
        itemObject: item,
      })
    },
    /**
     * 通用的点击打开待办处理函数
     * @param {Object} fobj 列配置
     * @param {Object} item 每条数据对象
     */
    commonClickOpenToDoHandle(fobj,item){
      if(fobj.clickToDo){
        //是否使用通用点击事件打开
        this.openToDo(item);
      }
      this.commonEventFunHandle(fobj.clickCustomFunction, {
        configObject: fobj,
        itemObject: item,
      })
    },
    /**
     * 报名
     * @param {*} item 
     * @param {*} btnItem 
     */
    async btnClickAction_enroll(item, btnItem){
      
      //报名
      var pk = item.infoId
      var hylx = 0 //0个人   1部门   2单位
      var nodeId = item.nodeId
      if (nodeId != 11) {
        await IDM.http.get('ctrl/meetingApply/getHytzToType', {
          pk: pk,
        }).then((result)=>{
          if(result&&result.data){
            hylx = result.data.message
          }
        }).catch(error=>{

        })
      }
      var url = ''
      if (hylx == 1) {
        url = 'ctrl/formControl/sysForm?moduleId=190813144418OyeMDrjBj1ytos8cARM&formId=2008281640301T3Rmfp4Zgg9W0fE7WX&nodeId=12&fid=' + pk + '&hylx=' + hylx
      } else if (hylx == 2) {
        url = 'ctrl/formControl/sysForm?moduleId=190813144418OyeMDrjBj1ytos8cARM&formId=200909203004SmGVh5JEaQhQu0qk5np&nodeId=12&fid=' + pk + '&hylx=' + hylx
      } else {
        url = 'ctrl/formControl/sysForm?moduleId=190813144418OyeMDrjBj1ytos8cARM&formId=190813144549zioVr5C0aPAnLMU1Hu7&nodeId=11&fid=' + pk
      }
      await IDM.http.get('ctrl/meeting/getCurUserInfoId', {
        pk: pk,
      }).then(result=>{
        if (result&&result.data&&result.data.type == 'success') {
          url = url + '&pk=' + result.data.message
        }
      }).catch(error=>{

      })
      this.openWinView(this, {
        type: 2,
        title: '报名会议',
        shadeClose: false, //点击遮罩关闭层
        resize: false,
        area: '1050,550',
        url: url,
      })
    },
    /**
     * 退回
     * @param {Object} item 数据对象
     * @param {Object} btnItem 按钮配置信息对象 
     */
    async btnClickAction_send(item, btnItem) {
      let that = this;
      await IDM.http
        .get(that.propData.sendBackApiUrl || 'ctrl/officeInfo/getTodo', {
          todoId: item.id,
        })
        .then(async (res) => {
          if (res && res.data && res.data.type == "success") {
            let resultData = res.data.data;
            await that.flowSendOld(resultData,item, btnItem);
          } else {
            //失败
            IDM.message.error('查询文件失败！');
          }
        })
        .catch((err) => {
          IDM.message.error(btnItem.buttonText + '失败！');
          console.log(err);
        });
    },
    /**
     * 退回
     * @param {Object} item 数据对象
     * @param {Object} btnItem 按钮配置信息对象 
     */
    btnClickAction_sendBack(item, btnItem) {
      let that = this;
      IDM.http
        .get(that.propData.sendBackApiUrl || 'ctrl/officeInfo/getTodo', {
          todoId: item.id,
        })
        .then((res) => {
          if (res && res.data && res.data.type == "success") {
            let resultData = res.data.data;
            //sendBackRange 为DreamWeb的public.js中的方法
            if (typeof window.sendBackRange == "function") {
              let { infoId, moduleId, pnid, pid, flowId } = resultData;
              window.sendBackRange(infoId, moduleId, pnid, pid, flowId, function () {
                //根据配置重新加载
                if (btnItem.isReloadTabInfo) {
                  that.$emit('reloadTabInfo', btnItem.reloadTabKeys);
                }
              })
            } else {
              IDM.message.error(btnItem.buttonText + '失败！');
            }
          } else {
            //失败
            IDM.message.error('查询文件失败！');
          }
        })
        .catch((err) => {
          IDM.message.error(btnItem.buttonText + '失败！');
          console.log(err);
        });
    },
    /**
     * 阅毕
     * @param {Object} item 数据对象
     * @param {Object} btnItem 按钮配置信息对象 
     */
    btnClickAction_readed(item, btnItem) {
      let that = this;
      IDM.layer.confirm('是否确认' + btnItem.buttonText + '?', { icon: 3, title: '提示', skin: "itodotabslist-layer-skin" }, function (index) {
        //do something
        IDM.http
          .post(that.propData.readedApiUrl || 'ctrl/shareRead/readedIds', {
            distribIds: item.id,
          })
          .then((res) => {
            if (res && res.data && res.data.type == "success") {
              //成功
              IDM.message.success(btnItem.buttonText + '成功！');
              //根据配置重新加载
              if (btnItem.isReloadTabInfo) {
                that.$emit('reloadTabInfo', btnItem.reloadTabKeys);
              }
            } else {
              //失败
              IDM.message.error(btnItem.buttonText + '失败！');
            }
          })
          .catch((err) => {
            IDM.message.error(btnItem.buttonText + '失败！');
            console.log(err);
          });
        IDM.layer.close(index);
      });
    },
    /**
     * 收藏与取消收藏
     * @param {Number} type -1:取消收藏，1：收藏 
     * @param {Object} item 数据对象
     * @param {Object} btnItem 按钮配置信息对象 
     */
    btnClickAction_favorite(type, item, btnItem) {
      let that = this;
      IDM.http
        .post(this.propData.favoriteApiUrl || 'ctrl/favorite/enshrine', {
          infoId: item.infoId,
          type: type,
        })
        .then((res) => {
          if (res && res.data && res.data.type == "success") {
            //成功
            IDM.message.success(btnItem.buttonText + '成功！');
            //这里写死了 isFavorite ，后面其实可以增加配置的，但考虑配置已经很多，所以暂时写死
            item.isFavorite = type;
            //根据配置重新加载
            if (btnItem.isReloadTabInfo) {
              that.$emit('reloadTabInfo', btnItem.reloadTabKeys);
            }
          } else {
            //失败
            IDM.message.error(btnItem.buttonText + '失败！');
          }
        })
        .catch((err) => {
          IDM.message.error(btnItem.buttonText + '失败！');
          console.log(err);
        });
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
      if (fobj.iconType == 'button') {
        styleObject["display"] = "flex";
        styleObject["align-items"] = "center";
        styleObject["justify-content"] = "flex-start";
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
        if (fobj.iconType == 'button') {
          switch (element.fontTextAlign) {
            case "left":
              styleObject["justify-content"] = "flex-start";
              break;
            case "center":
              styleObject["justify-content"] = "center";
              break;
            case "right":
              styleObject["justify-content"] = "flex-end";
              break;
          }
        }
      }
      if (fobj.clickCustomFunction && fobj.clickCustomFunction.length > 0) {
        styleObject["cursor"] = "pointer";
      }
      if (fobj.fieldLeftPadding || fobj.fieldLeftPadding === 0) {
        styleObject["padding-left"] = fobj.fieldLeftPadding + "px";
      }
      if (fobj.fieldRightPadding || fobj.fieldRightPadding === 0) {
        styleObject["padding-right"] = fobj.fieldRightPadding + "px";
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
      if (fobj.fieldLeftPadding || fobj.fieldLeftPadding === 0) {
        styleObject["padding-left"] = fobj.fieldLeftPadding + "px";
      }
      if (fobj.fieldRightPadding || fobj.fieldRightPadding === 0) {
        styleObject["padding-right"] = fobj.fieldRightPadding + "px";
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
    getButtonSvgIconCustomFont(fobj, fontAttr, issvg) {
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
        if (issvg) {
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
    /**
     * 后端调用的
     * @param {*} obj 
     * @param {*} mid 
     * @param {*} istrue 
     * @param {*} url 
     */
    openTodoAjax(obj, mid, istrue, url) {
      let that = this
      if (top.window.simpleWin) {
        top.window.simpleWin(1, {
          url: that.addItionalParam(url),
          name: that.reConvert(this.currentClickObject.title || this.currentClickObject.bt) || '',
        })
      } else {
        window.open(that.addItionalParam(url), that.addItionalParam(url))
      }
    },
    /**
     * 打开通知公告
     * @param {*} pk 
     * @param {*} noticeId 
     * @param {*} read 
     */
    openNotice(pk, noticeId, read) {
      let that = this
      if (read == 1){
        this.markRead(pk, noticeId)
      }

      let bodyHeight = document.body.clientHeight - 90
      var area="1000,"+bodyHeight;
      var url = "ctrl/formControl/form?listId=1808061608052gwg6wWGsNdiXr1yOCx&moduleId=180805175628RK7ixI1IyrjDuG4njD5&method=view&pk=" + noticeId;
      that.openWinView(this, {"url": url, "isfresh": true,"area":area})
    },
    /**
     * 标记公告已读
     * @param {*} pk 
     * @param {*} noticeId 
     */
    markRead(pk, noticeId) {
      //标记已读
      var url = 'ctrl/notice/markRead' //已读
      var data = {
        pks: pk,
        moduleId: '180805175628RK7ixI1IyrjDuG4njD5',
        noticeId: noticeId,
      }
      IDM.http.post(url, data).then(res=>{

      })
    },
    /**
     * 待办组件通用的点开方法
     * @param {*} item 
     * @param {*} paramData 
     */
    openToDo(item,paramData) {
      let that = this
      this.currentClickObject = {...item};
      console.log('点击的待办对象', item)
      this.dbObj = { ...item }
      if (item && item.itemType == 'toremind') {
        IDM.layer.alert(item.title,{
          skin: "itodotabslist-layer-skin"
        }, function(index){
          //do something
          IDM.http.post('ctrl/remind/read',{
            ids: item.id
          }).then(result=>{
            if(result&&result.data&&result.data.type == 'success'){
              that.$emit('reloadTabInfo', that.tabObject.key);
            }
          })
          IDM.layer.close(index);
        });   
        return
      } else if (item && item.itemType == 'notice' && !item.titleOut && !item.url) {
        this.openNotice(item.id, item.noticeId, item.readStatus)
      }
      let newUrl = that.addItionalParam(item.url);
      if (item.titleTarget && item.titleTarget == '_blank') {
        window.open(newUrl, newUrl)
      } else if (newUrl) {
        if (top.window.simpleWin) {
          top.window.simpleWin(1, {
            url: newUrl,
            name: that.reConvert(item.title || item.bt) || '',
          })
        } else {
          window.open(newUrl,newUrl)
        }
      } else {
        (item.titleOut && this.outFn(item.titleOut, item)) || eval('this.' + item.titleUrl)
      }
    },
    /**
     * 追加额外的参数
     * @param {string} url 原url参数
     * @returns 
     */
    addItionalParam(url) {
      if (url) {
        let finalurl = url.replace('../../', "")
        if (this.propData.isDingDingApp) {
          var spliceR = url.indexOf('?') > -1 ? '&' : '?'
          if (finalurl.indexOf('ddtab') == -1) {
            finalurl = finalurl + spliceR + 'ddtab=true'
          }
        }
        return IDM.url.getWebPath(finalurl)
      }
      return ''
    },
    /**
     * 执行外部函数
     * @param {*} titleOut 方法名称
     * @param {*} item 当前数据对象
     */
    outFn(titleOut, item) {
      try {
        window[titleOut].call(this, item)
      } catch (error) {
        console.log('error', error)
      }
    },
    /**
     * 标题转换
     * @param {*} str 
     * @returns 
     */
    reConvert(str) {
      if (!str) {
        return ''
      }
      str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%5Cu)(\w{1,4})/g, '$2'), 16))
      })
      str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, '$2'), 16))
      })
      str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, '$2')))
      })
      // str = this.escape2Html(str)

      return str
    },
    /**
     * DreamWeb的发送逻辑代码
     * @param {Object} paramData todo查询的返回结果
     */
    async flowSendOld(paramData, itemObject,btnItem) {
      window.flowPage = 2;
      let that = this
      var sendData = {
        sendType: "SR_SEND",
        pk: itemObject.infoId,
        bt: itemObject.title,
        pId: paramData.pid,
        pnId: paramData.pnid,
        todoId: itemObject.id,
        flowId: paramData.flowId,
        nodeId: paramData.nodeId,
        nextLineId: '',
        direction: '',
        moduleId: itemObject.moduleId,
        moduleName: itemObject.moduleName,
        agencyType: itemObject.agencyType,
        determineUser: "",
        userId: "",
        hasReceive: true,
      }

      var exInfoObj = {
        mj: "",
      }
      sendData.exInfo = JSON.stringify(exInfoObj)

      var validateParam = {
        pk: sendData.pk,
        moduleId: sendData.moduleId,
        flowId: sendData.flowId,
        nodeId: sendData.nodeId,
        pId: sendData.pId,
        pnId: sendData.pnId,
      }

      var lockMsg = ''
      await IDM.http.get('ctrl/officeInfo/checkLock', { pk: validateParam.pk })
        .then((res) => {
          if (res && res.data && res.data.type == "success") {
            var isExe = res.data.data.isExe
            if (isExe && isExe == 1) {
              lockMsg = ''
            } else {
              lockMsg = '该文件正在被他人处理,如需处理请稍后重试'
            }
          } else {
            //失败
            IDM.message.error('查询文件状态失败！');
          }
        })
        .catch((err) => {
          IDM.message.error('查询文件状态失败！');
          console.log(err);
        });


      if (lockMsg && lockMsg != null && lockMsg != null) {
        IDM.message.error(lockMsg);
        return false
      }
      //验证文件
      let validateSuccess = false;
      await IDM.http.get('ctrl/xform/validate', validateParam)
        .then((res) => {
          if (res && res.data && res.data.type == "success") {
            validateSuccess = true;
          } else {
            IDM.layer.confirm(res.data.message + "，是否打开表单处理？", {
              icon: 3,
              title: '提示',
              btn: ['确认', '取消'],
              skin: "itodotabslist-layer-skin"
            }, function (index) {
              //使用通用的表单打开方法
              that.openToDo(itemObject,paramData);
              IDM.layer.close(index);
            })
          }
        })
        .catch((err) => {
          IDM.message.error('查询文件状态失败！');
          console.log(err);
        });
      //验证成功
      if (validateSuccess) {
        IDM.http.post('ctrl/opinionSignCheck/controlCheck', {
          todoId: sendData.todoId,
          nodeName: itemObject.nodeName,
          pk: sendData.pk,
        }).then((res) => {
          if (res && res.data && res.data.type == "success") {
            var checkVal = res.data.data.checkVal
            if (checkVal == 1) {
              IDM.layer.confirm('当前环节未签名，是否自动签名？', {
                icon: 3,
                title: '提示',
                btn: ['自动签名', '不签名'],
                skin: "itodotabslist-layer-skin"
              }, function (dindex) {
                IDM.layer.close(dindex);
                that.todoUpdSign(1, sendData, paramData, itemObject,btnItem);
              }, function (dindex) {
                IDM.layer.close(dindex);
                that.todoUpdSign(0, sendData, paramData, itemObject,btnItem);
              })
            } else {
              that.Flowsend(sendData, function () {
                //判断重新加载待办
                if (btnItem.isReloadTabInfo) {
                  that.$emit('reloadTabInfo', btnItem.reloadTabKeys);
                }
              })
            }
          } else {
            IDM.message.error(res.data.message);
          }
        }).catch((err) => {
          IDM.message.error('查询文件状态失败！');
          console.log(err);
        });
      }
    },
    /**
     * 修改签名
     * @param {Number} type 是否需要签名
     * @param {*} sendData 发送参数
     * @param {*} paramData 待办查询出来的参数
     * @param {*} itemObject 当前整条待办数据的参数
     * @param {*} btnItem 按钮设置的属性对象
     */
    todoUpdSign(type, sendData, paramData, itemObject,btnItem) {
      let that = this;
      IDM.http.post('ctrl/opinionSignCheck/todoUpdSign',
        {
          pid: sendData.pId,
          pnid: sendData.pnId,
          isSign: type,
          pk: sendData.pk,
        }
      ).then((result) => {
        if (result && result.data && result.data.type == 'success') {
          that.Flowsend(sendData, function () {
            //判断重新加载待办
            if (btnItem.isReloadTabInfo) {
              that.$emit('reloadTabInfo', btnItem.reloadTabKeys);
            }
          })
        }
      }).catch((err) => {
        IDM.message.error('签名处理失败！');
        console.log(err);
      })
    },
    Flowsend(data, success) {
      let that = this
      data.bt = data.bt.replace(/\s*/g, '')
      //发送前
      IDM.http.post('ctrl/flow/beforeSend',data)
      .then((result) => {
        if (result && result.data && result.data.type == 'success') {
          
          window.top.selectedLines = []
          window.top.SendRequestID = ''
          window.top.sendData = data
          window.top.afterSendSuccess = success

          var sendData = window.top.sendData
          //批量发送类型，batchSendType: 2根据流程配置发送，其他使用第一个接收人默认发送
          if (window.top.batchSendFlow && window.top.batchSendFlow == 1) {
            if (window.top.batchSendType == 2) {
              sendData.disableAutoSend = -2
            }
          }

          IDM.http.post('ctrl/flow/sendRequest',sendData).then((result) => {
            if (result && result.data && result.data.type == 'success') {
              var data = result.data.data
              window.top.ResponseObject = data.ResponseObject[0]
              var SendRequestID = window.top.ResponseObject.SendRequestID
              window.top.SendRequestID = SendRequestID

              if (window.top.ResponseObject && window.top.ResponseObject.NextNodes && window.top.ResponseObject.NextNodes.Line) {
                window.top.selectedLines = window.top.ResponseObject.NextNodes.Line
              } else {
                window.top.selectedLines = []
              }

              that._parseResult()
            }else{
              IDM.message.error(result.data.message);
            }
          }).catch((err) => {
            IDM.message.error('发送请求失败！');
            console.log(err);
          })
        }else{
          //移除禁用按钮状态
        }
      }).catch((err) => {
        IDM.message.error('发送前失败！');
        console.log(err);
      })

    },
    _parseResult(lines) {
      let that = this
      var Status = window.top.ResponseObject.Status

      if (Status.startsWith('1000')) {
        IDM.message.success('发送成功');
        that._afterSend()
      } else if (Status.startsWith('3000')) {
        that.sendInView()
      } else if (Status.startsWith('4000')) {
        if (window.location.href.indexOf('SR_EXSEND') > 0) {
          window.location.href = window.location.href.replace('SR_EXSEND', 'SELECT_USER')
        } else if (window.top.sendData.sendType == 'SR_EXSEND') {
          window.top.sendData.oldSendType = window.top.sendData.sendType
          window.top.sendData.sendType = 'SR_SEND'
          that.sendInView(0)
        } else if (lines && lines.length > 0) {
          // if(window.location.href.indexOf("SR_JUMPSEND") > 0){
          //     init();
          // }else if(window.top && window.top && window.top.flowPage && window.top.flowPage > 1){
          //     if(window.top.flowPage == 2){
          //         init();
          //     }
          // }else{
          //     window.location.href=window.location.href.replace("SR_SEND","SELECT_USER");
          // }
        } else {
          that.sendInView()
        }
      } else if (Status.startsWith('5000')) {
        IDM.message.success('发送成功');
        that._afterSend()
      } else if (Status.startsWith('5100')) {
        IDM.message.success('办理成功');
        that._afterSend()
      } else if (Status.startsWith('6000')) {
        IDM.message.success('办结成功');
        that._afterSend()
      } else if (Status.startsWith('8100')) {
        //_autoProcessingBranch();
        that.sendInView()
      } else if (Status.startsWith('9000')) {
        var errorMessage = '发送失败，请检查后再次发送'
        if (window.top.ResponseObject.ErrorMessage) {
          errorMessage = window.top.ResponseObject.ErrorMessage
        }
        IDM.message.error(errorMessage);
        return
      }
    },
    _afterSend() {
      let that = this
      var data = window.top.sendData
      var success = window.top.afterSendSuccess
      //解除锁定
      IDM.http.post('ctrl/lock/form/unlock',
        {
          pk: data.pk,
          type: 2,
          pId: data.pId,
          pnId: data.pnId,
        }
      ).then((result) => {
        if (typeof success == 'function') {
          success()
          window.top.afterSendSuccess = ''
        }
      }).catch((err) => {
        IDM.message.error('解除锁定失败！');
        console.log(err);
      })
    },
    sendInView(isBack) {
      let that = this

      var data = window.top.sendData
      var success = window.top.afterSendSuccess
      var sendUrl = 'ctrl/flow/sendIndex'
      window.DSF&&window.DSF.Utils.serverLog('Flow.send()', 'request openWinView,sendUrl=' + sendUrl)

      window.top.flowPage = window.flowPage
      sendUrl += '?flowPage=' + window.flowPage + '&pk=' + data.pk + '&moduleId=' + data.moduleId + '&sendType=' + data.sendType
      
      if (isBack && isBack == 1) {
        window.location.href = sendUrl
        return
      }

      var config = {
        url: sendUrl,
        closeBtn: 0,
        title: '选择发送范围',
        success: function (layero, index) {
          if (typeof window.top.afterOpenSendView == 'function') {
            window.top.afterOpenSendView()
          }
        },
        callback: function () {
          if (typeof success == 'function') {
            success()
          } else {
            
          }
        },
      }

      //获取项目自定义的发送界面大小
      if (typeof window.setSendArea == 'function') {
        var result = window.setSendArea(data.sendType)
      }

      if (data.sendType == 'SR_JUMPSEND') {
        //跳转，使用web的界面
        config.area = '1000,540'
        if (result) {
          config.area = result
        }
      } else if (data.sendType == 'SR_SEND' || data.sendType == 'SR_ADDITION' || data.sendType == 'SR_COPY' || (data.sendType == 'SR_SPECIAL' && data.nextNodeId != '')) {
        if (window.flowPage == 2) {
          config.area = '1000,540'
          if (result) {
            config.area = result
          }
        } else {
          config.area = '800,540'
          if (result) {
            config.area = result
          }
        }
      } else {
        config.closeBtn = 1
      }

      that.openWinView(this, config)

      //解除锁定
    },
    openWinView(target, opts) {
      top.openViewModel = target
      top.openViewWindow = window
      top.openViewOpts = opts

      var reloadGrid = !opts || opts['reloadGrid'] !== false

      var maxWidth = $(top.window).width() - 20
      var maxHeight = $(top.window).height() - 20

      var isfresh = opts.isfresh

      var _area = ['auto', 'auto']
      if (opts.area) {
        _area = opts.area.split(',')
        var width = parseInt(_area[0])
        if (width > maxWidth) {
          _area[0] = maxWidth
        }

        var height = parseInt(_area[1])

        if (height > maxHeight) {
          _area[1] = maxHeight
        }
      } else {
        _area[0] = maxWidth - 80
        _area[1] = maxHeight - 80
      }

      _area[0] = _area[0] + 'px;'
      _area[1] = _area[1] + 'px;'

      opts.url = window.supplyParam?window.supplyParam(opts.url):opts.url

      //外层top不是DreamWeb系统时，相对路径可能不正确
      if (window !== window.top && opts.url && opts.url.startsWith('../../ctrl')) {
        opts.url = IDM.url.getWebPath(opts.url.substring('../../'.length))
      }else{
        opts.url = IDM.url.getWebPath(opts.url)
      }

      var config = {
        type: 2,
        fixed: false,
        resize: true,
        area: _area,
        success: function (layero, index) {},
        end: function () {
          if (top) {
            var openViewWindow = top.openViewWindow
            if (top.openViewOpts && top.openViewOpts.callback) {
              top.openViewOpts.callback()
            }
            if (top.openViewWindow && isfresh) {
              top.openViewWindow.location.reload()
            }
            if ((opts.reloadGrid == undefined || opts.reloadGrid) && openViewWindow) {
              openViewWindow.closeWinView({
                reloadGrid: reloadGrid,
              })
            }
          }
        },
      }

      $.extend(config, opts || {})

      config.title = opts.title === false ? false : opts.title || ' '
      config.content = opts.url || ''
      config.closeBtn = opts.closeBtn === undefined ? 1 : opts.closeBtn
      config.area = _area

      top.openViewIndex = top.layer.open(config)
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
