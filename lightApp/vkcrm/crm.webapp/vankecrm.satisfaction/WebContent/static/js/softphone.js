window.SoftPhone = (function() {
    /* param 
     callInType表示呼叫类型：1为呼入，9为呼出
     otherDN为客户的号码。
     dnis为被叫号码。
     Ucid为录音id。可获取录音。
     Acd为技能组。
    */

    /* obj */
    var initObjectX = function(prop) {
        var objectX = prop;
        returnObj.objectX = objectX;
        objectX.EnableWebServiceRequest = Config.local.serviceEnable || true; //是否连接cm service --------------------------
        objectX.WebServiceIPAddr = Config.local.serviceHost || "cc.crm.vankeservice.com"; //129.1.202.3
        objectX.WebServicePort = Config.local.servicePort || 80;
        objectX.WebServiceMethodName = Config.local.serviceMethod || "tel/services/telCallWebService/receive";

        //发送坐席状态信息至CM SERVICE
        objectX.WebServiceApiAgentStatusChg = "exec=true&methodName=agentStatus&callBack=0&execType=0&methodType=set&agentID=[AgentId]&agentStation=[AgentStation]&agentType=[AgentType]&iPAddress=[IPAddr]&status=[AgentCallStatus]&callID=[CallId]&otherDN=[OtherDN]&callInType=[CallInType]&stateTime=[StateTime]" + "&telephonistId=" + Config.local.userId;
        //软电话心跳
        objectX.WebServiceApiSendHeartBeat = "exec=true&methodName=agentStatus&callBack=0&execType=0&agentID=[AgentId]&methodType=beat";

        // 设置话务及操作相关属性
        objectX.CTIServerIPAddr = "crmrec:Crmrec01#"; //
        objectX.EnableDebugConsole = true;
        objectX.EnableLog = true;
        objectX.LogPath = "c:\\testLogs";
        //是否自动应答
        objectX.EnableAutoAnswer = false;
        objectX.TimeoutThresholdMap = "AS_Wrap=0;ReverseSpan=0;"; //"AS_Idle=10;ReverseSpan=10;";
        //状态后处理倒计时阀值设置，第一个参数AS_Wrap=10，表示当前是话后处理状态下设定就绪了10秒，就开始往外发送阀值提醒事件以及提示窗口，
        //ReverseSpan=10 表示从前一个发送阀值事件开始，就开始倒计时10秒，如果为0，则说明当前不需要倒计时

        //属性XSPhoneActiveXProperty91用来配置外壳向核心传递参数。格式为A=数据值1;B=数据值2;C=数据值3;.....；等
        objectX.XSPhoneActiveXProperty91 = "userdataserver=10.11.15.7:8088;vpc=true;";

        objectX.EnableRecorderAdapter = false; //不使用录音控件

    };
    /* pool */
    var eventPool = {};

    var _config = {
            restIndex: 2
        },
        _data = {};

    function addEventListener(eventName, callback) {
        if (!eventPool[eventName]) {
            eventPool[eventName] = [];
        }
        eventPool[eventName].push(callback);
    }

    function each(arr, callback) {
        if (arr && callback) {
            var i = 0,
                l = arr.length;
            while (i < l) {
                callback(arr[i], i);
                i++;
            }
        }
    }

    function format(str) {
        var obj = {},
            arr = str.split(";"),
            kv;
        each(arr, function(item, i) {
            kv = item.split("=") || {};
            obj[kv[0]] = kv[1];
        })
        return obj;
    }

    var callEventHash = {
        'EvtDidWrapup': true,
        'EvtDidAlerting': true,
        'EvtDidActive': true,
        'EvtDidDial': true,
        'EvtDidHold': true,
        'EvtDidConsult': true
    }
    var callEventQueue = [];
    callType = 0;

    function trigger(eventName, valueStr) {
        if (window.console) {
            console.log(eventName + ':\t' + valueStr + '\t' + new Date().toUTCString());
        }
        var obj = valueStr ? format(valueStr) : {};
        obj["otherDN"] = _data["phoneNumber"] || obj["otherDN"];

        if (callEventHash[eventName]) {
            callEventQueue.push(eventName);
        }
        if (eventName == 'EvtDidAlerting') {
            callType = 1;
        }
        if (eventName == 'EvtDidDial') {
            callType = 2;
        }
        if (eventPool[eventName]) {
            each(eventPool[eventName], function(callback, i) {
                callback(valueStr, obj, callEventQueue, callType);
            })
        }
        if (eventName == 'EvtDidWrapup') {
            callEventQueue = [];
            callType = 0;
            _data["phoneNumber"] = '';
        }
    }

    function msg(phone) {
        return 'ani=72222;dnis=72240;ucid=00020046481442282831;callId=' + Math.floor(Math.random() * 1000000) + ';userData=;callInType=6;otherDN=' + (phone || '18520878238') + ';acd=;';
    }

    function init(SoftPhoneName) {
        // if(false){
        var curMsg = '';
        if (Config.local.phone) {
            var o = {};
            // var strEvtMsg = 'ani=72222;dnis=72240;ucid=00020046481442282831;callId=4648;userData=;callInType=6;otherDN=15325312787;acd=;';
            o.actionInit = function() {
                return true;
            }
            o.actionUninit = function() {
                return true;
            }
            o.actionLogout = function() {
                SoftPhone.trigger("EvtWillLogout", curMsg);
                SoftPhone.trigger("EvtDidLogout", curMsg);
                return true;
            }
            o.actionLogin = function() {
                SoftPhone.trigger("EvtWillLogin", curMsg);
                SoftPhone.trigger("EvtDidLogin", curMsg);
                SoftPhone.trigger("EvtDidNotReady", curMsg);
                return true;
            }
            o.actionAnswerCall = function() {
                SoftPhone.trigger("EvtWillActive", curMsg);
                SoftPhone.trigger("EvtDidActive", curMsg);
                return true;
            }
            o.actionReleaseCall = function() {
                SoftPhone.trigger("EvtWillWrapup", curMsg);
                SoftPhone.trigger("EvtDidWrapup", curMsg);
                // setTimeout(function() {
                SoftPhone.trigger("EvtDidIdle", curMsg);
                // }, 5000)
                return true;
            }
            o.actionRetrieveCall = function() {
                SoftPhone.trigger("EvtDidActive", curMsg);
                return true;
            }
            o.actionHoldCall = function() {
                SoftPhone.trigger("EvtDidHold", curMsg);
                SoftPhone.trigger("EvtWillHold", curMsg);
                return true;
            }
            o.actionTransferCall = function() {
                SoftPhone.trigger("EvtDidWrapup", curMsg);
                // setTimeout(function() {
                SoftPhone.trigger("EvtDidIdle", curMsg);
                // }, 5000)
                return true;
            }
            o.actionConsultCall = function() {
                SoftPhone.trigger("EvtWillConsult", curMsg);
                SoftPhone.trigger("EvtDidHold", curMsg);
                SoftPhone.trigger("EvtDidDial", curMsg);
                SoftPhone.trigger("EvtDidConsult", curMsg);
                return true;
            }
            o.actionSetNotReady = function() {
                SoftPhone.trigger("EvtWillNotReady", curMsg);
                SoftPhone.trigger("EvtDidNotReady", curMsg);
                return true;
            }
            o.actionSetIdle = function() {
                SoftPhone.trigger("EvtWillIdle", curMsg);
                SoftPhone.trigger("EvtDidIdle", curMsg);
                setTimeout(function() {
                    o.ring();
                }, 3000)
                return true;
            }
            o.actionMakeCall = function(phone) {
                curMsg = msg(phone);
                SoftPhone.trigger("EvtWillDial", curMsg);
                SoftPhone.trigger("EvtDidDial", curMsg);
                SoftPhone.trigger("EvtScreenPopDataArrival", curMsg);
                SoftPhone.trigger("EvtDidActive", curMsg);
                // setTimeout(function() {
                    // SoftPhone.trigger("EvtDidWrapup", curMsg);
                // }, 2000)
                return true;
            }
            o.actionAlterWithIvr = function() {
                SoftPhone.trigger("EvtWillWrapup", curMsg);
                SoftPhone.trigger("EvtDidWrapup", curMsg);
                setTimeout(function() {
                    SoftPhone.trigger("EvtDidIdle", curMsg);
                }, 5000)
                return true;
            }
            o.ring = function(phone) {
                curMsg = msg(phone);
                SoftPhone.trigger("EvtDidAlerting", curMsg);
                SoftPhone.trigger("EvtScreenPopDataArrival", curMsg);
            }
            returnObj.objectX = o;
            return true;
        }
        var o = window[SoftPhoneName];
        if (o) {
            initObjectX(o)
            return true;
        }
        return false;
    }

    var returnObj = {
        config: _config,
        data: _data,
        objectX: null,
        addEventListener: addEventListener,
        trigger: trigger,
        init: init
    }
    return returnObj;
})();