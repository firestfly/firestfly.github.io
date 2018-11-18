require.config({ //第一块，配置
  baseUrl: './',
  paths: {
    mmRouter: "static/js/avalon/mmRouter",
    text: 'static/js/require/text',
    domReady: 'static/js/require/domReady',
    css: 'static/js/require/css.js',
    // plugs
    clock: 'static/js/plugs/clock/clock.js',
    validate: 'static/js/plugs/validate/validate.js',
    datepicker: "static/js/plugs/datepicker/WdatePicker.js",
    widget_businessType: "static/js/avalon/plugs/businesstype/widget.js"
  },
  priority: ['text', 'css'],
  shim: {
    datepicker: {
      exports: "datepicker"
    },
    jquery: {
      exports: "jQuery"
    },
    avalon: {
      exports: "avalon"
    }
  }
});
(function() {
  var RegExpHook = {
    number: /[^\d]/g,
    mobile: /[^\d#\*]/g,
    name: /[^a-zA-Z|\u4e00-\u9fa5]/g,
    /*
    a-z
    A-Z
    0-9
    +-:@    英文符合
    \u4e00-\u9fa5  中文
    \uFF0C  ，
    \u3002  。
    \uFF1F  ？
    \uFF01  ！
    \u201C  “
    \u201D  ”
    \uFF08  （
    \uFF09  ）
    \uFF1B  ；
    \u300A  《
    \u300B  》
    \u0025  %
    \u3001  、
    //\u0020  空格
    //\u000A  回车
    */
    content: /[^a-z|A-Z|0-9|\s|\u4e00-\u9fa5|+|\-|:|@|\uFF1A\uFF0C\u3002\uFF1F\uFF01\u201C\u201D\uFF08\uFF09\uFF1B\u300A\u300B\u0025\u3001]/g
  }
  avalon.duplexHooks["mobile"] = {
    get: function(str, vm) {
      var s = (str + '').replace(RegExpHook["mobile"], '');
      if(s != str) {
        // 通过判断是否字符串相等，避免IE中死循环
        return vm.element.value = s;
      }
      return s;
    }
  }
  avalon.duplexHooks["name"] = {
    get: function(str, vm) {
      var s = (str + '').replace(RegExpHook["name"], '');
      if(s != str) {
        return vm.element.value = s;
      }
      return s;
    }
  }
  avalon.duplexHooks["digit"] = {
    get: function(str, vm) {
      var s = (str + '').replace(RegExpHook["number"], '');
      if(s != str) {
        return vm.element.value = s;
      }
      return s;
    }
  }
  avalon.duplexHooks["content"] = {
    get: function(str, vm) {
      var s = (str + '').replace(RegExpHook["content"], '');
      if(s != str) {
        return vm.element.value = s;
      }
      return s;
    }
  }
  avalon.filters.appTaskStatus = function(str) {
    return Config.objs["AppTaskStatus"][str] || '';
  }
  avalon.filters.taskLevelType = function(str) {
    return Config.objs["TaskLevelType"][str] || '';
  }
  avalon.filters.taskSource = function(str) {
    return Config.objs["TaskSource"][str] || '';
  }
  avalon.filters.taskAbnormalStatus = function(str) {
    if(str == '1') {
      return "无类型";
    } else if(str == '2') {
      return "超时未处理";
    }
  }
  avalon.filters.taskCompleteStatus = function(str) {
    if(str == '0') {
      return "未完成";
    } else if(str == '1') {
      return "已完成";
    }
  }
})();
// avalon.config({debug: false})
require(["domReady!", "mmRouter"], function() {
  /*
   * model
   */
  avalon.templateCache.empty = " ";
  var md_root = avalon.define({
    $id: "root",
    taskSrc: "",
    reportSrc: "",
    noticeSrc: "",
    systemSrc: "",
    abnormal: {
      count: ''
    },
    visibleIndex: "",
    show: function(type) {
      avalon.router.navigate("/" + type)
    },
    src_contenttask: "",
    src_contentnotice: "",
    src_contenthouse: "",
    src_contentsystem: "",
    // header
    headerboxVisible: false,
    headerboxToggle: function() {
      md_root.headerboxVisible = !md_root.headerboxVisible;
    }
  });
  /*
   * router
   */
  function requireObj(parentModel, module, query, callback) {
    require(["text!views/" + module + "/index.html", "views/" + module + "/index"], function(html, obj) {
      avalon.templateCache[module] = html;
      avalon.vmodels[parentModel]["src_" + module] = module;
      avalon.vmodels[parentModel].visibleIndex = module;
      setTimeout(function() {
        obj.active && obj.active(query);
        callback && callback();
      })
    })
  }

  function callback() {
    var moduleName = this.params["module"],
      submoduleName = this.params["submodule"],
      thirdmoduleName = this.params["thirdmodule"],
      query = this.query;
    if(!moduleName) {
      moduleName = "contenttask";
      submoduleName = "tasklist";
    }
    requireObj("root", moduleName, query, function() {
      if(!submoduleName) {
        return;
      }
      requireObj(moduleName, submoduleName, query, function() {
        if(!thirdmoduleName) {
          return;
        }
        requireObj(submoduleName, query, thirdmoduleName)
      })
    });
  }
  /*
   * ajax
   */
  // 获取超时任务数量
  var getAbnormalTask_handle = null

  function getAbnormalTask_ajax() {
    if(getAbnormalTask_handle) {
      getAbnormalTask_handle.abort()
    }
    getAbnormalTask_handle = Common.ajax({
      url: servicePath.task + "/v1/callcenter/task/allAbnormalTask",
      type: "GET",
      success: function(res) {
        if(res) {
          md_root.abnormal.count = res[0] + ' / ' + res[1];
        }
      },
      error: function() {},
      complete: function() {}
    });
    setTimeout(getAbnormalTask_ajax, Config.abnormalTask.interval)
  }
  // 获取任务字典
  function getTaskDictionary_ajax() {
    var codes = ["AppTaskStatus", //APP任务状态
      "ProcessingWay#monitorcenter", // 任务处理方式
      "TaskLevelType", //任务级别
      "Duty", //责任方
      "TaskSource#monitorcenter", 
      "FinishType" //关闭任务原因
    ].join(",");
    // 获取数据字典
    return Common.ajax({
      url: servicePath.task + "/v1/dict/items",
      type: "POST",
      data: {
        'codes': codes
      },
      success: function(data) {
        Config.keys["TaskLevelType"] = data["TaskLevelType"]
        Config.keys["ProcessingWay"] = data["ProcessingWay"]
        Config.keys["TaskSource"] = data["TaskSource"]
        Config.keys["Duty"] = data["Duty"]
        Config.keys["FinishType"] = data["FinishType"]
        Config.keys["AppTaskStatus"] = data["AppTaskStatus"]
        var statusObj = Config.objs["AppTaskStatus"] = {},
          levelObj = Config.objs["TaskLevelType"] = {},
          sourceObj = Config.objs["TaskSource"] = {},
          d;
        for(var i = 0; i < data["AppTaskStatus"].length; i++) {
          d = data["AppTaskStatus"][i];
          statusObj[d.code] = d.value;
        };
        for(var i = 0; i < data["TaskLevelType"].length; i++) {
          d = data["TaskLevelType"][i]
          levelObj[d.code] = d.value;
        }
        for(var i = 0; i < data["TaskSource"].length; i++) {
          d = data["TaskSource"][i]
          sourceObj[d.code] = d.value;
        }
      },
      error: function() {},
      complete: function() {}
    })
  }
  // 呼入采集
  function getCallCollection_ajax() {
    return Common.ajax({
      url: servicePath.tel + "/v1/telrecord/callreason/get",
      type: "GET",
      data: {
        type: 0
      },
      success: function(res) {
        if(!res) {
          return;
        }
        var list = res;
        var callinReason = [],
          calloutReason = [];
        for(var i = 0; i < list.length; i++) {
          if(list[i].type == 1) {
            callinReason.push(list[i])
          } else if(list[i].type == 2) {
            calloutReason.push(list[i])
          }
        };
        Config.callReason = {
          callin: callinReason,
          callout: calloutReason
        }
      },
      error: function() {},
      complete: function() {}
    })
  }
  // 任务类型
  function getBusinesstype_ajax() {
    return Common.ajax({
      url: servicePath.task + "/v1/callcenter/task/businesstype",
      type: "GET",
      success: function(res) {
        var obj = {},
          arr = [],
          d, parentObj;
        for(var i = 0; i < res.length; i++) {
          d = res[i];
          d["children"] = [];
          obj[d["businessCode"]] = d;
          parentObj = obj[d["parentCode"]]
          if(parentObj) {
            parentObj["children"].push(d)
          } else {
            arr.push(d);
          }
        };
        Config.businessType = {
          list: arr,
          obj: obj
        }
      },
      error: function() {},
      complete: function() {}
    })
  }
  // 获取满意度选项
  function getTaskSatisfaction_ajax() {
    return Common.ajax({
      url: servicePath.task + "/v1/callcenter/task/getTaskSatisfaction",
      type: "GET",
      success: function(res) {
        if(res) {
          var obj = {},
            arr = [],
            o;
          for(var i = 0; i < res.length; i++) {
            o = res[i];
            obj[o.code] = o;
            if(!o.parentCode) {
              arr.push(o)
            } else if(obj[o.parentCode]) {
              if(!obj[o.parentCode].children) {
                obj[o.parentCode].children = [];
              }
              obj[o.parentCode].children.push(o)
            }
          };
          Config.evaluation = {
            list: arr,
            obj: obj
          }
        }
      },
      error: function() {},
      complete: function() {}
    })
  }
  /*
   * init
   */
  $.when(getBusinesstype_ajax(), getTaskDictionary_ajax(), getCallCollection_ajax(), getTaskSatisfaction_ajax()).fail(function() {
    alert("加载失败");
  }).done(function() {
    avalon.scan(document.body)
    $("#basecover").remove();
    /**
     * 设置路由
     */
    avalon.router.get("/", callback)
    avalon.router.get("/:module", callback)
    avalon.router.get("/:module/:submodule", callback)
    avalon.router.get("/:module/:submodule/:thirdmodule", callback)
    avalon.history.start({
      html5Mode: false
    });
  })
});
