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
    // 0,客户挂机;1,员工挂
    _isStaffHangUp = 0,
    calloutTaskId = '',
    calloutTaskNo = '',
    calloutTime = '',
    calloutAction = '',
    calloutName = ''
    /* model */
  var statusHash = {
    "busy": "置忙",
    "free": "空闲",
    "ring": "振铃",
    "arrang": "话后",
    "consult": "咨询",
    "hangon": "保持",
    "transfer": "转接",
    "callin": "通话",
    "wait": "外呼",
    "callout": "通话"
  }
  var Timer = new Clock();
  var model = avalon.define({
    $id: "callctrl",
    currentCallText: '',
    /* data */
    // AgentId: '84213', //工号
    // AgentStation: '72229', //分机
    teluserOptions: [], //工号列表
    AgentId: '', //工号
    AgentStation: '', //分机
    callType: 0,
    /* view */
    phoneNumber: '',
    callNo: '',
    callRecordId: '',
    phoneAddress: '',
    phoneTime: '--:--:--',
    status: "",
    statusText: {
      get: function() {
        return statusHash[this.status] || '';
      }
    },
    infoActive: false,
    hasLogined: false,
    change: function(btnName) {
      if(model[btnName] && model[btnName].disable === false && model[btnName].change) {
        model[btnName].change()
      }
    },
    calloutReason: Config.callReason && Config.callReason.callout || [],
    reasons: [],
    /* 咨询界面 */
    consultBox: {
      loading: false,
      leaderName: "",
      leaderState: "",
      groupList: []
    },
    /* button */
    // 登录
    btnLoginText: {
      get: function() {
        return this.hasLogined ? '注销' : '登录'
      }
    },
    btnLogin: {
      disable: false,
      visible: false,
      change: function() {
        model.btnLogin.visible = !model.btnLogin.visible;
      },
      logout: function() {
        if(model.hasLogined && window.confirm("请注意！注销后务必关闭所有IE页面，才能再次正常签入系统！确认注销？")) {
          if(SoftPhone.objectX.actionLogout()) {
            model.btnLogin.notify("checkout");
            model.AgentId = '';
            model.AgentStation = '';
            model.status = false;
            //注销
            SoftPhone.objectX.AgentId = '';
            SoftPhone.objectX.AgentStation = '';
          } else {
            alert("注销失败")
          }
          model.btnLogin.visible = false;
        }
      },
      login: function() {
        if(!model.AgentId) {
          alert("请选择工号")
          return;
        }
        if(!Common.trim(model.AgentStation)) {
          alert("请填写分机")
          return;
        }
        if(SoftPhone.objectX.AgentId == model.AgentId) {
          model.btnLogin.visible = false;
          return;
        }
        if(model.hasLogined) {
          SoftPhone.objectX.actionLogout();
        }
        //登录
        SoftPhone.objectX.AgentId = model.AgentId;
        SoftPhone.objectX.AgentStation = model.AgentStation;
        // 查询状态
        //if (!Config.local.phone) {
        //    isoffline_ajax()
        //} else {
        // 不查询状态
        if(SoftPhone.objectX.actionInit()) {} else {}
        if(SoftPhone.objectX.actionLogin()) {
          // model.currentCallText = $("#callctrl_teluser option:selected").text();
          model.btnLogin.visible = false;
          model.btnLogin.notify("checkin");
        } else {
          alert("登录失败")
        }
        //}
      },
      cancel: function() {
        model.btnLogin.visible = false;
      },
      notify: function(type) {
        var skillName = ''
        for(var i = 0; i < model.teluserOptions.length; i++) {
          if(model.teluserOptions[i].number == model.AgentId) {
            skillName = model.teluserOptions[i].name;
            break;
          }
        }
        Common.ajax({
          url: servicePath.tel + "/v1/notify/tel/publish",
          data: {
            type: type, // checkin/checkout签入签出通知
            skillName: skillName,
            telNo: model.AgentId
          },
          type: "POST",
          success: function() {},
          error: function() {},
          complete: function() {}
        })
      }
    },
    //接听
    btnAnswer: {
      disable: true,
      change: function() {
        if(SoftPhone.objectX.actionAnswerCall()) {
          // 接听成功
        }
      }
    },
    //挂机
    btnHangUp: {
      disable: true,
      change: function() {
        // if (SoftPhone.objectX.actionAlterWithIvr()) {
        // } else if (SoftPhone.objectX.actionReleaseCall()) {
        _isStaffHangUp = 1;
        if(SoftPhone.objectX.actionReleaseCall()) {
          //挂机成功,自动转话后状态
        } else {}
      }
    },
    //保持
    btnHangOn: {
      disable: true,
      holding: false,
      change: function() {
        if(model.btnHangOn.holding) {
          if(SoftPhone.objectX.actionRetrieveCall()) {
            model.btnHangOn.holding = false;
          }
        } else {
          if(SoftPhone.objectX.actionHoldCall()) {
            model.btnHangOn.holding = true;
          }
        }
      }
    },
    //转接
    btnTransfer: {
      disable: true,
      visible: false,
      dnis: '',
      change: function() {
        model.btnTransfer.visible = !model.btnTransfer.visible;
        model.btnConsult.visible = false;
        return false;
      },
      sure: function() {
        var num = model.btnTransfer.dnis;
        if(num) {
          getHandlenumer_ajax(num, function(res) {
            if(res) {
              model.btnTransfer.visible = false;
              SoftPhone.objectX.actionTransferCall(res, _userData)
            }
          });
        } else {
          Common.tip.add({
            "text": "请输入转接号码",
            "type": "warning"
          });
        }
      }
    },
    //咨询
    btnConsult: {
      disable: true,
      visible: false,
      dnis: '',
      change: function() {
        model.btnConsult.visible = !model.btnConsult.visible;
        model.btnTransfer.visible = false;
        /**
         * 由于请求返回结果不包含“分组、组员名称、组员座机号、组员状态”
         * 所有暂时注释改功能
         */
        if(model.btnConsult.visible) {
          ajaxGetIdles();
        }
        return false;
      },
      sure: function() {
        // Status.change('transfer');
        var num = model.btnConsult.dnis;
        if(num) {
          getHandlenumer_ajax(num, function(res) {
            if(res) {
              model.btnConsult.visible = false;
              SoftPhone.objectX.actionConsultCall(res, _userData)
            }
          });
        } else {
          Common.tip.add({
            "text": "请输入咨询号码",
            "type": "warning"
          });
        }
      }
    },
    //置忙
    btnBusy: {
      disable: true,
      change: function() {
        if(SoftPhone.objectX.actionSetNotReady('0')) {
        }
      }
    },
    //置闲
    btnFree: {
      disable: true,
      change: function() {
        if(SoftPhone.objectX.actionSetIdle()) {}
      }
    },
    //呼出
    btnCallout: {
      disable: true,
      visible: false,
      dnis: '',
      change: function(taskId, taskNo, param) {
        if(model.btnCallout.disable) {
          return;
        }
        var opt = param || {};
        calloutTaskId = taskId || '';
        calloutTaskNo = taskNo || '';
        calloutAction = opt.action;
        calloutName = opt.name;
        model.reasons = opt.reasons ? [opt.reasons] : [];
        model.btnCallout.visible = !model.btnCallout.visible;
        return false;
      },
      sure: function() {
        if(model.btnCallout.disable) {
          return;
        }
        if(model.reasons.length == 0) {
          alert("请填写呼出原因");
          return false;
        }
        if(!Common.trim(model.btnCallout.dnis)) {
          alert("请填写外拨号码")
          return false;
        }
        model.btnCallout.visible = false;
        var num = model.btnCallout.dnis;
        getHandlenumer_ajax(num, function(res) {
          if(res) {
            SoftPhone.data["phoneNumber"] = num;
            SoftPhone.objectX.actionSetNotReady('0');
            SoftPhone.objectX.actionMakeCall(res);
          }
        });
        /*Common.ajax({
            url: "/s.tel/api/v1/telrecord/handlenumer",
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
        });*/
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
        url: servicePath.tel + "/v1/telrecord/callrecord/add",
        // callNumber,callTime,type
        data: {
          source: "1", //呼叫中心为1， 满意度调查为2
          callId: opt.callId,
          recordId: opt.recordId,
          callNumber: opt.callNumber,
          type: opt.callType,
          callTime: Common["formatDate"](new Date(), 'yyyy-MM-dd HH:mm:ss'),
          typeText: opt.callType == 1 ? "呼入" : "呼出"
        },
        type: "POST",
        success: function(recordId) {
          that.id = recordId;
          model.callRecordId = recordId;
          if(opt.success && typeof(opt.success) == 'function'){
            opt.success(opt, recordId);
          }
        },
        error: function() {},
        complete: function() {}
      })
      this.end = function(data) {
        that.handle.done(function() {
          Common.ajax({
            url: servicePath.tel + "/v1/telrecord/callrecord/update",
            // id,beginTime,endTime,isConnect
            data: {
              id: that.id,
              beginTime: that.beginTime,
              endTime: Common["formatDate"](new Date(), 'yyyy-MM-dd HH:mm:ss'),
              hangUp: _isStaffHangUp, //true为员工挂机，false为客户挂机
              isConnect: that.isConnect
            },
            type: "POST",
            success: function() {},
            error: function() {},
            complete: function() {}
          })
        })
      }
    }
    /* CallRecord end */
    /* Status */
  var Status = (function() {
    var map = {};

    function func(name, status) {
      if(!name) {
        return;
      }
      this.name = name;
      this.status = status;
      map[name] = this;
    }
    func.change = function(status) {
      var enableObj = map[status] && map[status].status,
        allDisable = false;
      if(!status) {
        allDisable = true;
      }
      model.infoActive = allDisable ? false : !!enableObj['infoActive']; //信息状态
      model.btnLogin.disable = allDisable ? false : !enableObj["enable"]['btnLogin']; //登录注销
      model.btnLogin.visible = false;
      model.btnAnswer.disable = allDisable || !enableObj["enable"]['btnAnswer']; //接听
      model.btnHangUp.disable = allDisable || !enableObj["enable"]['btnHangUp']; //挂机
      model.btnHangOn.disable = allDisable || !enableObj["enable"]['btnHangOn']; //保持
      model.btnTransfer.disable = allDisable || !enableObj["enable"]['btnTransfer']; //转接
      model.btnTransfer.visible = false;
      model.btnConsult.disable = allDisable || !enableObj["enable"]['btnConsult']; //咨询
      model.btnConsult.visible = false;
      model.btnBusy.disable = allDisable || !enableObj["enable"]['btnBusy']; //置忙
      model.btnFree.disable = allDisable || !enableObj["enable"]['btnFree']; //置闲
      model.btnCallout.disable = allDisable || !enableObj["enable"]['btnCallout']; //呼出
      model.btnCallout.visible = false;
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
        btnLogin: true,
        btnFree: true, //置闲
        btnCallout: true //呼出
      }
    });
    //空闲free
    new Status("free", {
        enable: {
          btnLogin: true,
          btnBusy: true, //置忙
          btnCallout: true //呼出
        }
      })
      //振铃ring
    new Status("ring", {
        infoActive: true, //信息状态
        enable: {
          btnAnswer: true, //接听
          btnHangUp: true //挂机
        }
      })
      //话后整理arrang
    new Status("arrang", {
        infoActive: true, //信息状态
        enable: {
          btnFree: true,
          btnCallout: true //呼出
        }
      })
      //咨询consult
    new Status("consult", {
        infoActive: true, //信息状态
        enable: {
          btnHangUp: true //挂机
        }
      })
      //保持hangon
    new Status("hangon", {
        infoActive: true, //信息状态
        enable: {
          // btnAnswer: true, //应答
          btnHangUp: true, //挂机
          btnHangOn: true, //取消保持
          btnTransfer: true, //转接
          btnConsult: true //咨询
        }
      })
      //转接transfer
    new Status("transfer", {
        enable: {
          btnHangUp: true //挂机
        }
      })
      //通话INcallin
    new Status("callin", {
        infoActive: true, //信息状态
        enable: {
          btnHangUp: true, //挂机
          btnHangOn: true, //保持
          btnTransfer: true, //转接
          btnConsult: true //咨询
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
        btnHangOn: true, //保持
        btnTransfer: true, //转接
        btnConsult: true //咨询
      }
    })
  })();
  /* register status end */
  /* SoftPhone event */
  (function() {
    SoftPhone.addEventListener("EvtWillLogin", function(strEvtMsg, param, eventQueue, callType) {
      Common.tip.add({
        text: "正在登录",
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
      avalon.router.redirect("/contenttask/taskinput");
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
      model.callNo = '';
      model.callRecordId = '';
    });
    SoftPhone.addEventListener("EvtDidNotReady", function(strEvtMsg, param, eventQueue, callType) {
      // 置忙
      Status.change("busy")
    });

    SoftPhone.addEventListener("EvtDidWrapup", function(strEvtMsg, param, eventQueue, callType) {
      // 话后处理
      Status.change("arrang");
      // 调用
      if(_currentCallRecord) {
        _currentCallRecord.end();
      }
      if(getAttribution_handle) {
        getAttribution_handle.abort()
      }
      model.phoneAddress = '';
      calloutTaskNo = '';
      calloutTaskId = '';
      calloutAction = '';
      calloutName = '';
    });
    SoftPhone.addEventListener("EvtDidAlerting", function(strEvtMsg, param, eventQueue, callType) {
      // 如果振铃，中断外呼查号码请求
      if(getHandlenumer_handle) {
        getHandlenumer_handle.abort();
      }
      // 响铃
      model.phoneNumber = param["otherDN"];
      model.callNo = param["callId"];
      Status.change("ring");
    });
    SoftPhone.addEventListener("EvtDidActive", function(strEvtMsg, param, eventQueue, callType) {
      _isStaffHangUp = 0;
      // 接听
      model.callType = callType;

      Status.change(callType == 1 ? 'callin' : 'callout');
      // 调用
      var prevStatue = eventQueue[eventQueue.length - 2];
      if((prevStatue == 'EvtDidAlerting' || prevStatue == 'EvtDidDial') && _currentCallRecord) {
        _currentCallRecord.isConnect = true;
        _currentCallRecord.beginTime = Common["formatDate"](new Date(), 'yyyy-MM-dd HH:mm:ss');
        avalon.vmodels['taskinput'].callTime=_currentCallRecord.beginTime;
      }
    });
    SoftPhone.addEventListener("EvtDidDial", function(strEvtMsg, param, eventQueue, callType) {
      model.phoneNumber = param["otherDN"];
      model.callNo = param["callId"];
      Status.change("wait");
      calloutTime = Common["formatDate"](new Date(), 'yyyy-MM-dd HH:mm:ss');
    });
    SoftPhone.addEventListener("EvtScreenPopDataArrival", function(strEvtMsg, param, eventQueue, callType) {
      // 弹屏
      var phoneNumber = param["otherDN"],
        recordId = param["ucid"],
        callNo = param["callId"] || param["callid"];
      _currentCallRecord = new CallRecord({
        callId: callNo,
        recordId: recordId,
        callNumber: phoneNumber,
        callType: callType,
        success: function(opt, recordid){
          if(opt.callType == 2) {
            // 如果呼出，添加通话原因
            addTaskReason_ajax();
          }
        }
      });
      getAttribution_ajax(phoneNumber)
      // 外呼
      if(calloutTaskNo || calloutTaskId) {
        var data = {
          phoneNo: phoneNumber
        }
        if(calloutTaskNo) {
          data.taskNo = calloutTaskNo;
        } else {
          data.taskId = calloutTaskId;
        }
        // if (calloutAction == 'revisit') {
        // 回访
        switch(calloutAction) {
          case "revisit":
            Common.log("revisit", data);
            break;
          case "abnormalDial":
            data["name"] = calloutName;
            Common.log("abnormalDial", data);
            break;
          default:
            Common.log("dial", data);
        }
        // }
      }
    })
    SoftPhone.addEventListener("EvtDidHold", function(strEvtMsg, param, eventQueue, callType) {
      // 保持
      Status.change("hangon");
    });
    SoftPhone.addEventListener("EvtDidConsult", function(strEvtMsg, param, eventQueue, callType) {
      // 咨询
      Status.change("consult");
    });
  })()
  /* SoftPhone event end */
  /* ajax */
  var getHandlenumer_handle = null;

  function getHandlenumer_ajax(num, callback) {
    if(getHandlenumer_handle) {
      getHandlenumer_handle.abort();
    }
    getHandlenumer_handle = Common.ajax({
      url: servicePath.tel + "/v1/" + num + "/process",
      type: "GET",
      success: function(res) {
        callback(res);
      }
    });
  }
  // 新增呼叫采集
  function addTaskReason_ajax() {
    return Common.ajax({
      url: servicePath.tel + "/v1/telrecord/reason",
      type: "POST",
      data: {
        callId: model.callRecordId,
        reasonIds: model.reasons.join(",")
      },
      success: function() {},
      error: function() {},
      complete: function() {}
    })
  }
  var isoffline_handle = null;

  function isoffline_ajax() {
    if(isoffline_handle) {
      isoffline_handle.abort();
    }
    isoffline_handle = Common.ajax({
      url: servicePath.tel + "/v1/telrecord/agent/isoffline",
      type: "GET",
      data: {
        agentId: model.AgentId,
      },
      success: function(res) {
        if(res) {
          Common.tip.add({
            text: "该工号已签出",
            type: "error"
          });
          SoftPhone.objectX.actionLogout();
        } else {
          if(SoftPhone.objectX.actionInit()) {} else {}
          if(SoftPhone.objectX.actionLogin()) {
            model.btnLogin.visible = false;
          } else {
            alert("登录失败")
          };
        }
      },
      error: function() {},
      complete: function() {}
    })
  }
  var getAttribution_handle = null;

  function getAttribution_ajax(phoneNumber) {
    if(getAttribution_handle) {
      getAttribution_handle.abort();
    }
    getAttribution_handle = Common.ajax({
      url: servicePath.tel + "/v1/" + phoneNumber + "/attribution",
      type: "GET",
      success: function(res) {
        if(res) {
          model.phoneAddress = res["mobileArea"];
        }
      }
    });
    return getAttribution_handle;
  }

  function getTelUser_ajax() {
    Common.ajax({
      url: servicePath.tel + "/v1/teluser/get",
      type: "GET",
      success: function(res) {
        model.teluserOptions = res || [];
      }
    })
  }
  /**
   * 获取空闲坐席
   * @return {[type]} [description]
   */
  function ajaxGetIdles() {
    model.consultBox.loading = true;
    model.consultBox.groupList = [];
    Common.ajax({
      url: servicePath.tel + "/v1/telrecord/set/idleGroups",
      type: "GET",
      success: function(res) {
        var data = res;
        model.consultBox.groupList = data;
      },
      complete: function() {
        model.consultBox.loading = false;
      }
    })
  }
  var hasInit = false;

  function init() {
    if(hasInit) {
      return;
    }
    hasInit = false;
    /* init */
    avalon.scan(null, model);
    // 计时器初始化
    Timer.onchange(function(index, timeStr) {
      model.phoneTime = timeStr;
    });
    // 初始化软电话
    SoftPhone.init("TestActiveX1Ctrl");
    // 获取工号选项
    getTelUser_ajax();
    setTimeout(function() {
      // 离开页面事件
      window.onbeforeunload = function() {
        if(model.hasLogined) {
          return "还未注销，确认退出？"
        } else {
          return "请注意！注销后务必关闭所有IE页面，才能再次正常签入系统！确认退出？"
        }
      };
      // 咨询框 事件绑定
      $("#consoutBox").on("click", ".group-title", function() {
        $(this).parent().toggleClass("active");
      }).on("click", "li", function() {
        var li = $(this),
          num = li.attr("data-num") //工号
        if(num) {
          model.btnConsult.dnis = num;
        }
      })
    });
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
