/*
 * 置忙    busy
 * 空闲    free
 * 振铃    ring
 * 话后整理 arrang
 * 咨询    consult
 * 保持    hangon
 * 转接    transfer
 * 通话IN  callin
 * 等待接起 wait
 * 通话OUT callout
 */
define(['clock'], function(Clock) {
    var _userData = 'udcount=1;udkey0=AgentID;udvalue0=3009',
        _currentCallRecord = null,
        _isStaffHangUp = 0;
    /* model */
    var statusHash = {
        "busy": "置忙",
        "free": "空闲",
        "ring": "振铃",
        "arrang": "话后",
        "hangon": "保持",
        "callin": "通话",
        "wait": "外呼",
        "callout": "通话"
    }
    var Timer = new Clock();
    var model = avalon.define({
        $id: "callctrl",
        /* data */
        // AgentId: '84213', //工号
        // AgentStation: '72229', //分机
        teluserOptions: [], //工号列表
        AgentId: '', //工号
        AgentStation: '', //分机

        callType: 0,

        /* view */
        phoneNumber: '',
        callId: '',
        callRecordId: '',
        phoneAddress: '',
        phoneTime: '--:--:--',
        status: "",
        infoActive: false,
        hasLogined: false,
        change: function(btnName) {
            if (model[btnName] && model[btnName].disable === false && model[btnName].change) {
                model[btnName].change()
            }
        },
        calloutReason: Config.callReason && Config.callReason.callout || [],
        reasons: [],
        /* button */
        callout: getHandlenumer_ajax,
        btnLogin: {
            disable: false,
            visible: false,
            change: function() {
                model.btnLogin.visible = !model.btnLogin.visible;
            },
            logout: function() {
                if (model.hasLogined && window.confirm("确认注销？")) {
                    if (SoftPhone.objectX.actionLogout()) {
                        model.AgentId = '';
                        model.AgentStation = '';
                        model.status = false;
                        //注销
                        avalon.vmodels['quescall'].canSaveExam = false; // 注销后不能提交答卷
                        avalon.vmodels['quescall'].hasNext = false; // 注销后不能下一题
                        avalon.vmodels['quescall'].hasPrev = false; // 注销后不能上一题
                        SoftPhone.objectX.AgentId = '';
                        SoftPhone.objectX.AgentStation = '';
                    } else {
                        alert("注销失败")
                    }
                    model.btnLogin.visible = false;
                }
            },
            login: function() {
                if (!model.AgentId) {
                    alert("请选择工号")
                    return;
                };
                if (!Common.trim(model.AgentStation)) {
                    alert("请填写分机")
                    return;
                };
                if (SoftPhone.objectX.AgentId == model.AgentId) {
                    model.btnLogin.visible = false;
                    return;
                }
                if (model.hasLogined) {
                    SoftPhone.objectX.actionLogout();
                }
                //登录
                SoftPhone.objectX.AgentId = model.AgentId;
                SoftPhone.objectX.AgentStation = model.AgentStation;
                // 查询状态
                // if (Config.local.phone) {
                //     isoffline_ajax()
                // } else {
                // 不查询状态
                if (SoftPhone.objectX.actionInit()) {} else {}
                if (SoftPhone.objectX.actionLogin()) {
                    // model.currentCallText = $("#callctrl_teluser option:selected").text();
                    model.btnLogin.visible = false;
                } else {
                    alert("登录失败")
                };
                // }
            },
            cancel: function() {
                model.btnLogin.visible = false;
            }
        },
        //挂机
        btnHangUp: {
            disable: true,
            change: function() {
                _isStaffHangUp = 1;
                if (SoftPhone.objectX.actionReleaseCall()) {
                    //挂机成功,自动转话后状态
                    model.btnLogin.disable = false; // 挂机后可注销
                } else {

                }
            }
        },
        //保持
        btnHangOn: {
            disable: true,
            holding: false,
            change: function() {
                if (model.btnHangOn.holding) {
                    if (SoftPhone.objectX.actionRetrieveCall()) {
                        model.btnHangOn.holding = false;
                    }
                } else {
                    if (SoftPhone.objectX.actionHoldCall()) {
                        model.btnHangOn.holding = true;
                    }

                }
            }
        },
        $computed: {
            statusText: {
                get: function() {
                    return statusHash[this.status] || '';
                }
            },
            // 登录
            btnLoginText: {
                get: function() {
                    return this.hasLogined ? '注销' : '登录'
                }
            }
        }
    });
    /* model end*/
    /* CallRecord */
    var CallRecord = function(opt) {
            var that = this;
            this.id = '';
            this.beginTime = '';
            this.endTime = '';
            this.isConnect = false;
            this.handle = Common.ajax({
                url: Config.ajaxPaths["addCallRecord"],
                data: {
                    source: "2", //呼叫中心为1， 满意度调查为2
                    callId: opt.callId,
                    recordId: opt.recordId,
                    callNumber: opt.callNumber,
                    callTime: Common["formatDate"](new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    // type: opt.callType,
                    // typeText: opt.callType == 1 ? "呼入" : "呼出"
                    type: 2,
                    typeText: "呼出"
                },
                type: "POST",
                success: function(recordid) {
                    that.id = recordid;
                    that.callRecordId = recordid;
                    avalon.vmodels['quescall'].callRecordId = recordid;
                    // 新增问卷调查答卷中间表
                    avalon.vmodels['quescall'].addQuesRecord_ajax(recordid);
                },
                error: function() {},
                complete: function() {}
            });

            this.end = function(data) {
                that.handle.done(function() {
                    Common.ajax({
                        url: Config.ajaxPaths["updateCallRecord"],
                        // id,beginTime,endTime,isConnect
                        data: {
                            id: that.id,
                            beginTime: that.beginTime,
                            endTime: Common["formatDate"](new Date(), 'yyyy-MM-dd HH:mm:ss'),
                            hangUp: _isStaffHangUp, //true为员工挂机，false为客户挂机
                            isConnect: that.isConnect
                        },
                        type: "POST",
                        success: function() {

                        },
                        error: function() {

                        },
                        complete: function() {

                        }
                    })
                })
            }
        }
        /* CallRecord end */
        /* Status */
    var Status = (function() {
        var map = {};

        function func(name, status) {
            if (!name) {
                return;
            }
            this.name = name;
            this.status = status;
            map[name] = this;
        }
        func.change = function(status) {
            var enableObj = map[status] && map[status].status,
                allDisable = false;

            if (!status) {
                allDisable = true;
            }
            model.infoActive = allDisable ? false : !!enableObj['infoActive']; //信息状态
            model.btnLogin.disable = allDisable ? false : !enableObj["enable"]['btnLogin']; //登录注销
            model.btnHangUp.disable = allDisable || !enableObj["enable"]['btnHangUp']; //挂机
            model.btnHangOn.disable = allDisable || !enableObj["enable"]['btnHangOn']; //保持

            model.status = status;
            Status.name = allDisable ? "" : map[status].name;
            Timer[allDisable ? "stop" : "start"](0)
        }
        return func;
    })();
    /* Status end */
    /* register status */
    (function() {

        //置忙busy
        new Status("busy", {
            enable: {
                btnLogin: true
            }
        });
        //空闲free
        new Status("free", {
                enable: {
                    btnLogin: true,
                }
            })
            //话后整理arrang
        new Status("arrang", {
                infoActive: true, //信息状态
                enable: {}
            })
            //保持hangon
        new Status("hangon", {
                infoActive: true, //信息状态
                enable: {
                    btnHangUp: true, //挂机
                    btnHangOn: true //取消保持
                }
            })
            //等待接起wait
        new Status("wait", {
                infoActive: true, //信息状态
                enable: {
                    btnHangUp: true //挂机
                }
            })
            //通话OUTcallout
        new Status("callout", {
            infoActive: true, //信息状态
            enable: {
                btnHangUp: true, //挂机
                btnHangOn: true //保持
            }
        })
    })();
    /* register status end */

    /* SoftPhone event */

    (function() {
        SoftPhone.addEventListener("EvtWillLogin", function(strEvtMsg, param, eventQueue, callType) {
            Common.tip.add({
                text: "正在登陆",
                type: "info"
            })
        })
        SoftPhone.addEventListener("EvtDidLogin", function(strEvtMsg, param, eventQueue, callType) {
            // 登录
            model.hasLogined = true;
            Common.tip.add({
                text: "登录成功",
                type: "info"
            });
        });
        SoftPhone.addEventListener("EvtWillLogout", function(strEvtMsg, param, eventQueue, callType) {
            Common.tip.add({
                text: "正在注销",
                type: "info"
            })
        });
        SoftPhone.addEventListener("EvtDidLogout", function(strEvtMsg, param, eventQueue, callType) {
            // 注销
            model.hasLogined = false;
            Status.change("");
            model.phoneNumber = '';
            model.phoneTime = '--:--:--';
            Common.tip.add({
                text: "注销成功",
                type: "info"
            });
        });
        SoftPhone.addEventListener("EvtDidIdle", function(strEvtMsg, param, eventQueue, callType) {
            // 置闲
            Status.change("free");
            model.phoneNumber = '';
            model.callId = '';
        });
        SoftPhone.addEventListener("EvtDidNotReady", function(strEvtMsg, param, eventQueue, callType) {
            // 置忙
            Status.change("busy")
        });
        SoftPhone.addEventListener("EvtDidWrapup", function(strEvtMsg, param, eventQueue, callType) {
            // 话后处理
            Status.change("arrang");
            // 调用
            if (_currentCallRecord) {
                _currentCallRecord.end();
            }
            if (getAttribution_handle) {
                getAttribution_handle.abort()
            }
            model.phoneAddress = '';
            calloutTaskNo = '';
            calloutTaskId = '';
            calloutAction = '';
            calloutName = '';
        });
        SoftPhone.addEventListener("EvtDidActive", function(strEvtMsg, param, eventQueue, callType) {
            _isStaffHangUp = 0;
            // 接听
            model.callType = callType;
            Status.change(callType == 1 ? 'callin' : 'callout');
            // 调用
            var prevStatue = eventQueue[eventQueue.length - 2];
            if ((prevStatue == 'EvtDidAlerting' || prevStatue == 'EvtDidDial') && _currentCallRecord) {
                _currentCallRecord.isConnect = true;
                _currentCallRecord.beginTime = Common["formatDate"](new Date(), 'yyyy-MM-dd HH:mm:ss');
            }
        });
        SoftPhone.addEventListener("EvtDidDial", function(strEvtMsg, param, eventQueue, callType) {
            var phoneNumber = param["otherDN"],
                callId = param["callId"];
            model.phoneNumber = phoneNumber;
            model.callId = callId;
            Status.change("wait");
            calloutTime = Common["formatDate"](new Date(), 'yyyy-MM-dd HH:mm:ss');
        });
        SoftPhone.addEventListener("EvtScreenPopDataArrival", function(strEvtMsg, param, eventQueue, callType) {
            // 弹屏
            var phoneNumber = param["otherDN"],
                recordId = param["ucid"],
                callId = param["callId"] || param["callid"];

            _currentCallRecord = new CallRecord({
                callId: callId,
                recordId: recordId,
                callNumber: phoneNumber,
                callType: callType
            });
            getAttribution_ajax(phoneNumber);
        });

        SoftPhone.addEventListener("EvtDidHold", function(strEvtMsg, param, eventQueue, callType) {
            // 保持
            Status.change("hangon");
        });
    })()
    /* SoftPhone event end */


    /* ajax */

    var getHandlenumer_handle = null;

    function getHandlenumer_ajax(num) {
        if (getHandlenumer_handle) {
            getHandlenumer_handle.abort();
        }
        getHandlenumer_handle = Common.ajax({
            url: servicePath.tel + "/v1/" + num + "/process",
            type: "GET",
            data: {
                phonenum: num
            },
            success: function(res) {
                if (res) {
                    SoftPhone.data["phoneNumber"] = num;
                    SoftPhone.objectX.actionMakeCall(res)
                }
            }
        });
    }
    var getAttribution_handle = null;

    function getAttribution_ajax(phoneNumber) {
        if (getAttribution_handle) {
            getAttribution_handle.abort();
        }
        getAttribution_handle = Common.ajax({
            url: servicePath.tel + "/v1/" + phoneNumber + "/attribution",
            type: "GET",
            success: function(res) {
                if (res) {
                    model.phoneAddress = res["mobileArea"];
                }
            }
        });
        return getAttribution_handle;
    }

    function getTelUser_ajax() {
        Common.ajax({
            url: Config.ajaxPaths["getTelUser"],
            type: "GET",
            success: function(res) {
                model.teluserOptions = res || [];
            }
        })
    }


    window.onbeforeunload = function() {
        if (model.hasLogined) {
            return "还未注销，确认退出？"
        } else {
            return "请注意！注销后务必关闭所有IE页面，才能再次正常签入系统！确认退出？"
        }
    }


    var hasInit = false;

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = false;
        /* init */
        avalon.scan(null, model);
        Timer.onchange(function(index, timeStr) {
            model.phoneTime = timeStr;
        })
        SoftPhone.init("TestActiveX1Ctrl");
        getTelUser_ajax();
        /* init end */
    }

    function active() {
        init();

    }
    return {
        active: active,
        model: model
    };
});
