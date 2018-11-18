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
        +-:@    英文符号
        \u4e00-\u9fa5  中文
        \uFF1A  ：
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
            if (s != str) {
                // 通过判断是否字符串相等，避免IE中死循环
                return vm.element.value = s;
            }
            return s;
        }
    }
    avalon.duplexHooks["name"] = {
        get: function(str, vm) {
            var s = (str + '').replace(RegExpHook["name"], '');
            if (s != str) {
                return vm.element.value = s;
            }
            return s;
        }
    }
    avalon.duplexHooks["digit"] = {
        get: function(str, vm) {
            var s = (str + '').replace(RegExpHook["number"], '');
            if (s != str) {
                return vm.element.value = s;
            }
            return s;
        }
    }
    avalon.duplexHooks["content"] = {
        get: function(str, vm) {
            var s = (str + '').replace(RegExpHook["content"], '');
            if (s != str) {
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
        return Config.objs["TaskSource"][str] || str || '';
    }
    avalon.filters.taskAbnormalStatus = function(str) {
        if (str == '1') {
            return "无类型";
        } else if (str == '2') {
            return "超时未处理";
        }
    }
    avalon.filters.taskCompleteStatus = function(str) {
        if (str == '0') {
            return "待跟进";
        } else if (str == '1') {
            return "已跟进";
        }
    };
    avalon.filters.notificationType = function(str) {
            if (str == '1') {
                return "签入/签出"
            } else if (str == '2') {
                return "公告审批提醒"
            }
        }
        /*编号掩码*/
    avalon.filters.numberMask = function(str) {
        // return str.replace(/(.{0,8})(?=.{4}$)/g, function($0) {
        //     return new Array($0.length + 1).join("*");
        // });
        return str.replace(/(.{0,8})(?=.{4}$)/g, function($0) {
            return $0.replace(/./g, "*")
        })
    }
})();
// avalon.config({debug: false})
require(["domReady!", "mmRouter", "datepicker"], function() {
    var SIMPLEMODEL = window["SIMPLEMODEL"];

    avalon.templateCache.empty = " ";
    var md_root = avalon.define({
        $id: "root",
        callctrl_rendered: function() {
            require(['views/callctrl/index'], function(obj) {
                obj.active();
            })
        },
        ctrl: {
            abnormal: window["hasCallcenterIndexTaskAbnormal"],
            systemmanage: window["hasCallcenterIndexManage"]
        },
        visibleIndex: "",
        src_contenttask: "",
        src_contentreport: "",
        src_contentnotice: "",
        src_contentsystem: "",
        src_contentnewtask: "",
        src_contentsort: "", // 排行榜
        // 超时任务
        abnormal: {
            count: ''
        },
        // 通知中心
        notification: {
            count: ''
        },
        contentGo: function(src) {
            avalon.router.redirect("/" + src);
        },
        // header
        headerboxVisible: false,
        headerboxToggle: function() {
            md_root.headerboxVisible = !md_root.headerboxVisible;
        },
        // 点击超时任务
        eventAbnormalTask: function() {
            if (!md_root.abnormal.count) {
                return;
            }
            var tip = Common.tip.add(Config.tips.gettingAbnormalTask)
                // require(["views/taskquery/index"], function(obj) {
                // obj.active();
            Common.ajax({
                    url: servicePath.task + "/v1/callcenter/task/allotAbnormalTask",
                    type: "GET",
                    success: function(res) {
                        if (res) {
                            avalon.router.redirect("/contenttask/taskquery?id=" + res.taskNo + "&abtype=" + res.abnormal_type + "&islocal=false");
                            // avalon.router.navigate("/contenttask/taskquery?id=" + res.taskNo + "&abtype=" + res.res.abnormal_type + "&islocal=false");
                            // obj.view({
                            //     id: res.taskNo,
                            //     abtype: res.abnormal_type,
                            //     isLocal: false
                            // });
                            Common.tip.add({
                                text: Config.tips.getAbnormalTaskSuccess,
                                type: "success"
                            });
                            Common.log("getTask", {
                                taskNo: res.taskNo
                            })

                        }
                    },
                    error: function() {
                        Common.tip.add({
                            text: Config.tips.getAbnormalTaskError,
                            type: "error"
                        })
                    },
                    complete: function() {
                        // tip.remove();
                    }
                })
                // })
        }
    });

    /*
     * router
     */
    function requireObj(parentModel, moduleName, query, submoduleName) {
        require(["text!views/" + moduleName + "/index.html", "views/" + moduleName + "/index"], function(html, obj) {
            avalon.templateCache[moduleName] = html;
            avalon.vmodels[parentModel]["src_" + moduleName] = moduleName;
            avalon.vmodels[parentModel].visibleIndex = moduleName;
            setTimeout(function() {
                obj.active && obj.active(query);
                var subname = submoduleName || avalon.vmodels[moduleName].visibleIndex || "";
                if (subname) {
                    requireObj(moduleName, subname, query);
                }
            })
        })
    }

    function callback() {
        var moduleName = this.params["module"] || 'contenttask',
            submoduleName = this.params["submodule"],
            thirdmoduleName = this.params["thirdmodule"],
            query = this.query;
        requireObj("root", moduleName, query, submoduleName);
    }
    /*
     * router end
     */
    // 获取通知中心未读总数
    var getNotifyCount_handle = null;

    function getNotifyCount_ajax() {
        if (getNotifyCount_handle) {
            getNotifyCount_handle.abort();
        }
        getNotifyCount_handle = Common.ajax({
            url: servicePath.tel + "/v1/notify/unread/count",
            // url: "http://10.39.230.152:8080/s.tel/api/v1/notify/unread/count",
            type: "GET",
            success: function(res) {
                md_root.notification.count = res;
            }
        });
        setTimeout(getNotifyCount_ajax, Config.notification.interval);
    }
    // 获取超时任务数量
    var getAbnormalTask_handle = null

    function getAbnormalTask_ajax() {
        if (getAbnormalTask_handle) {
            getAbnormalTask_handle.abort()
        }
        getAbnormalTask_handle = Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/allAbnormalTask",
            type: "GET",
            success: function(res) {
                if (res) {
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
        var codes = [
            "AppTaskStatus", //APP任务状态
            "ProcessingWay#callcenter", // 任务处理方式
            "TaskSource", //任务来源
            "TaskLevelType", //任务级别
            "Duty", //责任方
            "FinishType", //关闭任务原因
            "AppTaskSource", // app 任务来源
            "TaskSource" // crm 任务来源
        ].join(",");
        // 获取数据字典
        return Common.ajax({
            url: servicePath.task + "/v1/dict/items",
            type: "POST",
            data: {
                'codes': codes
            },
            success: function(data) {
                // for (var i in data) {
                // Config.keys[i] = data[i];
                // }
                Config.keys["TaskSource"] = data["TaskSource"]
                Config.keys["TaskLevelType"] = data["TaskLevelType"]
                Config.keys["ProcessingWay"] = data["ProcessingWay"]
                Config.keys["Duty"] = data["Duty"]
                Config.keys["FinishType"] = data["FinishType"]
                Config.keys["AppTaskStatus"] = data["AppTaskStatus"];
                // 任务来源
                Config.keys["AppTaskSource"] = data["AppTaskSource"];
                Config.keys["TaskSource"] = data["TaskSource"];
                var statusObj = Config.objs["AppTaskStatus"] = {},
                    sourceObj = Config.objs["TaskSource"] = {},
                    levelObj = Config.objs["TaskLevelType"] = {},
                    wayObj = Config.objs["ProcessingWay"] = {},
                    // 任务来源
                    appTaskSourceObj = Config.objs["AppTaskSource"] = {},
                    taskSourceObj = Config.objs["TaskSource"] = {},
                    d;
                for (var i = 0; i < data["ProcessingWay"].length; i++) {
                    d = data["ProcessingWay"][i];
                    wayObj[d.code] = d.value;
                };
                for (var i = 0; i < data["AppTaskStatus"].length; i++) {
                    d = data["AppTaskStatus"][i];
                    statusObj[d.code] = d.value;
                };
                for (var i = 0; i < Config.keys["TaskSource"].length; i++) {
                    d = Config.keys["TaskSource"][i];
                    sourceObj[d.code] = d.value;
                }
                for (var i = 0; i < data["TaskLevelType"].length; i++) {
                    d = data["TaskLevelType"][i]
                    levelObj[d.code] = d.value;
                }
                // 任务来源
                for (var i = 0; i < data["AppTaskSource"].length; i++) {
                    d = data["AppTaskSource"][i]
                    appTaskSourceObj[d.code] = d.value;
                }
                for (var i = 0; i < data["TaskSource"].length; i++) {
                    d = data["TaskSource"][i]
                    taskSourceObj[d.code] = d.value;
                }
            },
            error: function() {

            },
            complete: function() {

            }
        })
    }

    // 获取用户字典
    function getCustDictionary_ajax() {
        var codes = [
            "CustomerSex", //用户性别
            "CustomerRelationType", //业主关系
            "HouseCustomerRelationType", //房屋关系
            "CustomerHobbies", //用户兴趣
            "CustomerIdentity" //用户身份
        ].join(",");
        // 获取数据字典
        return Common.ajax({
            url: servicePath.customer + "/v1/dict/items",
            type: "POST",
            data: {
                'codes': codes
            },
            success: function(data) {
                for (var i in data) {
                    Config.keys[i] = data[i];
                }
            },
            error: function() {

            },
            complete: function() {

            }
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
                if (!res) {
                    return;
                }
                var list = res;
                var callinReason = [],
                    calloutReason = [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].type == 1) {
                        callinReason.push(list[i])
                    } else if (list[i].type == 2) {
                        calloutReason.push(list[i])
                    }
                };
                Config.callReason = {
                    callin: callinReason,
                    callout: calloutReason
                }
            },
            error: function() {},
            complete: function() {

            }
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
                for (var i = 0; i < res.length; i++) {
                    d = res[i];
                    d["children"] = [];
                    obj[d["businessCode"]] = d;
                    parentObj = obj[d["parentCode"]]
                    if (parentObj) {
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
            error: function() {

            },
            complete: function() {

            }
        })
    }
    // 获取满意度选项
    function getTaskSatisfaction_ajax() {
        return Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/getTaskSatisfaction",
            type: "GET",
            success: function(res) {
                if (res) {
                    var obj = {},
                        arr = [],
                        o;
                    for (var i = 0; i < res.length; i++) {
                        o = res[i];
                        obj[o.code] = o;

                        if (!o.parentCode) {
                            arr.push(o)
                        } else if (obj[o.parentCode]) {
                            if (!obj[o.parentCode].children) {
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
    };

    var heartBeat_handle = null;

    function heartBeat_Ajax() {
        if (heartBeat_handle) {
            heartBeat_handle.abort()
        }
        heartBeat_handle = Common.ajax({
            url: path.server + "/heart/beat",
            type: "GET",
            success: function(res) {},
            error: function() {},
            complete: function() {}
        });
        setTimeout(heartBeat_Ajax, Config['interval'].heartBeat);
    }

    /*
     * init
     */

    $.when(getTaskDictionary_ajax(),
        getCustDictionary_ajax(),
        getCallCollection_ajax(),
        getBusinesstype_ajax(),
        getTaskSatisfaction_ajax()
    ).fail(function() {
        alert("加载失败");
    }).done(function() {
        avalon.scan(document.body)
        $("#basecover").remove();

        avalon.router.get("/", callback)
        avalon.router.get("/:module", callback)
        avalon.router.get("/:module/:submodule", callback)
            // avalon.router.error(function(){
            //     avalon.router.navigate("/contenttask/taskinput");
            // })

        avalon.history.start({
            html5Mode: false
        });
        avalon.history.stop();
        // 如果有权限，获取超时任务信息
        if (window["hasCallcenterIndexTaskAbnormal"] && !SIMPLEMODEL) {
            getAbnormalTask_ajax();
        }
        // 获取通知中心未读总数
        if (!SIMPLEMODEL) {
            getNotifyCount_ajax();
        }
        // 如果是来自满意度调查，则转跳
        if (SIMPLEMODEL) {
            avalon.router.redirect("contentnewtask/taskinput" + location.search);
        }
        // 获取心跳
        heartBeat_Ajax();
    })
});
