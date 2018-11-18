define([], function() {
    var hasInit = false;
    var data_questionlist,
        data_answerlist,
        cur_quesId,
        cur_answerId,
        cur_customerId,
        cur_houseId,
        cur_subjectId,
        cur_querstion,
        cur_startTime,
        cur_endTime,
        cur_mobileNumber,
        ques_stateObj = ["before", "active", "complete", "error"],
        option_mode = ["", "radio", "checkbox", "input", "text"]

    // 项目名称、物业地址、用户名、登录用户名
    var cur_projectName,
        cur_projectId,
        cur_address,
        cur_userName,
        cur_loginName = Config.local.userName;

    var quesHistory = [];
    var quesHistoryTemp = [];
    var model = avalon.define({
        $id: "quescall",
        quesState: 0, //0:未开始,1:正答题,2:已完成
        custState: avalon.vmodels.callctrl.hasLogined ? 2 : 4, //1:正接听,2:已挂机,3:未接听,4:未登录
        index: 0,
        title: "",
        callRecordId: "",
        canSaveExam: false, // 能否保存问卷
        currentCallOutNumber: "", //当前拨打号码
        description: "",
        phoneNumberList: [],
        // quesHistory: [],
        question: {
            size: 0,
            sequence: "",
            title: "",
            optionMode: 0,
            optionModeText: ""
        },
        customerAbnormal: [], //客户异常
        answerAbnormal: [], //答卷异常
        options: [], //答卷选项
        // 问卷类型
        questionType: "",
        questionTypeRadio: "questemp_radio",
        questionTypeCheckbox: "questemp_checkbox",
        questionTypeInput: "questemp_input",
        questionTypeText: "questemp_text",
        customer: {
            customerId: "",
            customerName: "",
            houseId: "",
            houseName: "",
            houseCode: "",
            mainMobile: "",
            standbyMobile: "",
            homeTel: "",
            officeTel: "",
            sexText: "",
            // 项目名称
            projectName: "",
            projectId: "",
            projectCode: "",
            // 剩余可预约量
            date1: "",
            date1subscribe: "",
            date2: "",
            date2subscribe: "",
            date3: "",
            date3subscribe: "",
            date4: "",
            date4subscribe: "",
            date5: "",
            date5subscribe: ""
        },
        newTask: function() {
            if (!model.canNewTask) {
                return;
            }
            var param = [];
            if (!avalon.vmodels.callctrl.phoneNumber) {
                return;
            }
            var _callRecordId_ = model.callRecordId;
            param.push('callnumber=' + avalon.vmodels.callctrl.phoneNumber);
            param.push('callRecordId=' + _callRecordId_);
            param.push('callno=' + avalon.vmodels.callctrl.callId);
            param.push('houseId=' + model.customer.houseId);
            param.push('houseName=' + model.customer.houseName);
            param.push('houseCode=' + model.customer.houseCode);
            param.push('projectId=' + model.customer.projectId);
            param.push('projectName=' + model.customer.projectName);
            param.push('projectCode=' + model.customer.projectCode);
            param.push('contactsName=' + model.customer.customerName);
            var url = Config.local.callCenterNewTaskPath + "?" + param.join("&");
            window.open(url);
        },
        newCustomer: function() {

            if (!model.canNewCustomer) {
                return;
            }
            //如果有下个号码
            if (model.isNextNumber) {
                //判断是否提交号码异常
                if (model.canSaveExam) {
                    Common.tip.add({
                        type: "warning",
                        text: "请先提交，再拨打下一个号码"
                    });
                    return;
                }
                //呼出下一个号码
                cur_answerId=Common.guid().replace(/-/g,'');
                callout()
            } else {
                //判断是否提交号码异常
                if (model.canSaveExam) {
                    Common.tip.add({
                        type: "warning",
                        text: "请先提交，再抽取下一个客户"
                    });
                    return;
                }
                getCustomer_ajax();
            }
            // if (callout()) {
            //   if (model.canSaveExam) {
            //     Common.tip.add({
            //       type: "warning",
            //       text: "请先提交答案，再抽取下一个客户"
            //     });
            //     return;
            //   }
            //   getCustomer_ajax();
            // }
        },
        errorCode: "", //异常编码
        errorRemark: "", //异常备注
        errorSubscribeTime: "", // 预约时间
        errorBoxOk: function() {
            if (!model.errorCode) {
                Common.tip.add({
                    text: "请选择异常原因",
                    type: "warning"
                })
                return;
            };
            // 备注
            if (model.errorRemark.length > 100) {
                Common.tip.add({
                    text: "内容过长，请精简到100字以内!",
                    type: "warning"
                });
                return;
            }
            if ((model.custState == 1 || model.custState == 2) && model.errorCode == 2 && !model.errorSubscribeTime) {
                Common.tip.add({
                    text: "请选择预约时间",
                    type: "warning"
                })
                return;
            }
            // jq_quesErrorBox.modal("hide");
            $(".backdrop,#quescall_errorbox").hide();
            if (model.custState == 1 || model.custState == 2) {
                // 已接通状态
                saveExamination_ajax();
            } else {
                model.quesState = 0;
                // 未接通状态
                saveNotConnectError_ajax();
            }
        },

        hasPrev: false,
        hasNext: false,
        isSaveing: true,
        saveExam: function() {
            if ((model.quesState == 2 || model.custState == 2 || model.custState == 3) && !model.isSaveing) {
                var answer = getAnswer();
                var o = getMode(answer);
                pushIntoQuesHistory(answer);
                if (o.mode == '3') {
                    saveExamination_ajax();
                } else {
                    mode_error();
                }
            }
        },
        saveError: function() {
            mode_error();
        },
        prev: function() {
            if (!model.hasPrev) {
                return;
            }
            model.hasNext = true;
            if (quesHistory.length < 1) {
                return;
            }
            if (quesHistory.length == 1) {
                model.hasPrev = false;
            }
            //  var data = quesHistory.pop();
            //  renderQuestion(data.question, data.answer);

            for (var i = 0; i < quesHistoryTemp.length; i++) {
                if (quesHistoryTemp[i].question.id == cur_querstion.id)
                    quesHistoryTemp.pop();
            }
            mode_pre();
        },
        next: function() {
            if (!model.hasNext) {
                return;
            }
            var answer = getAnswer(true);
            var o = getMode(answer),
                mode = o.mode,
                leap = o.leap;

            if (mode == '4' && !window.confirm("选择该选项，将结束答题")) {
                return;
            }
            // 缓存答案
            pushIntoQuesHistory(answer);
            // 下一题处理逻辑
            if (mode == '1') {
                // 下一题
                mode_next();
            } else if (mode == '2') {
                // 转跳
                mode_leap(leap);
            } else if (mode == '3') {
                // 结束
                mode_over();
            } else if (mode == '4') {
                // 异常
                mode_error();
            }
        },
        $computed: {
            isNextNumber: {
                get: function() {
                    return this.quesState != 2 && this.phoneNumberList.size();
                }
            },
            unableAnswer: {
                get: function() {
                    var c = this.custState,
                        q = this.quesState;
                    return c != 1 || q != 1;
                }
            },
            canNewTask: {
                get: function() {
                    return this.custState == 1;
                }
            },
            canNewCustomer: {
                get: function() {
                    return this.custState == 2 || this.custState == 3;
                }
            }
            /*,
             canSaveExam: {
             get: function() {
             return this.quesState == 2 || this.custState == 2 || this.custState == 3;
             }
             }*/
        },
        //掉线重拨
        offlineCallOut: function() {
            var phoneNumber = avalon(this).data("number");
            if (phoneNumber && window.confirm('您确定要挂断，且重新拨打?')) {
                Common.tip.add({
                    type: "info",
                    text: "正在拨打号码:" + phoneNumber + "..."
                });
                avalon.vmodels.callctrl.callout(phoneNumber)
                return false;
            }
            return true;
        },
        //隐藏模态窗
        hide: function() {
            $(".backdrop,#quescall_errorbox").hide();
        },
        // 获取通话记录id
        addQuesRecord_ajax: function(callId) {
            Common.ajax({
                url: Config.ajaxPaths["addQuesRecord"],
                type: "POST",
                data: {
                    answerId: cur_answerId,
                    callRecordId: callId
                },
                success: function() {},
                error: function() {},
                complete: function() {}
            })
        }
    });
    /**
     * watch
     */
    model.$watch("quesState", function(n, o) {
        model.canSaveExam = model.isSaveing === false && (n == 2 || model.custState == 2 || model.custState == 3);
    });
    model.$watch("custState", function(n, o) {
        model.canSaveExam = model.isSaveing === false && (model.quesState == 2 || n == 2 || n == 3);
    });
    model.$watch("isSaveing", function(n, o) {
        model.canSaveExam = n === false && (model.quesState == 2 || model.custState == 2 || model.custState == 3);
    });

    /**
     * 把答案存入客户答案队列里
     * @param  {[type]} answer [description]
     * @return {[type]}        [description]
     */
    function pushIntoQuesHistory(answer) {

        var lastQues = quesHistoryTemp[quesHistoryTemp.length - 1];
        if (!lastQues || lastQues.question.id != cur_querstion.id) {
            quesHistoryTemp.push({
                question: cur_querstion,
                answer: answer
            });
        };

        var ishasHistory = false;
        for (var i = 0; i < quesHistory.length; i++) {
            if (cur_querstion.id === quesHistory[i].question.id) {
                quesHistory[i].answer = answer;
                ishasHistory = true;
                break;
            }
        }
        if (!ishasHistory) {
            var lastQues = quesHistory[quesHistory.length - 1];
            if (!lastQues || lastQues.question.id != cur_querstion.id) {
                quesHistory.push({
                    question: cur_querstion,
                    answer: answer
                });
            };
        }

        // 将缓存的quesHistory历史答案同步至quesHistoryTemp（保存）数据队列
        for (var j = 0; j < quesHistoryTemp.length; j++) {
            var id = quesHistoryTemp[j].question.id;
            for (var k = 0; k < quesHistory.length; k++) {
                if (id === quesHistory[k].question.id) {
                    quesHistoryTemp[j].answer = quesHistory[k].answer;
                }
            }
        }
    }

    /**
     * 获取选项选择后的模式
     * @param  {[type]} answer [description]
     * @return {[type]}        [description]
     */
    function getMode(answer) {

        if (!answer) {
            return {};
        }
        var id = answer.optionId,
            quesIndex = parseInt(model.index),
            quesLength = data_questionlist.length,
            mode, leap
        for (var i = 0; i < model.options.length; i++) {
            if (model.options[i].id == id) {
                leap = model.options[i].gotoTopic;
                mode = model.options[i].processMode;
                break;
            }
        }
        // 根据问题是否最后一题判断答题是否结束
        if (mode == '1' && quesIndex == (quesLength - 1)) {
            mode = '3'
        } else if (mode == '2' && leap > quesLength) {
            mode = '3'
        }
        return {
            mode: mode,
            leap: leap
        }
    }

    /**
     * 下一题模式
     * @return void [description]
     */
    function mode_next() {
        /*
          model.hasPrev = true;
          renderQuestion(data_questionlist[parseInt(model.index) + 1])
          */
        model.hasPrev = true;
        var ishasHistroy = false;
        var data = data_questionlist[parseInt(model.index) + 1];
        var id = data.id;
        for (var i = 0; i < quesHistory.length; i++) {
            if (id === quesHistory[i].question.id) {
                renderQuestion(quesHistory[i].question, quesHistory[i].answer);
                ishasHistroy = true;
                break;
            }
        };
        if (!ishasHistroy) {
            renderQuestion(data_questionlist[parseInt(model.index) + 1])
        }
    }

    /**
     * 上一题模式
     * @return void [description]
     */
    function mode_pre() {
        model.hasNext = true;
        model.canSaveExam = false;
        var ishasHistroy = false;
        var _index_ = model.index;
        do {
            var data = data_questionlist[parseInt(_index_) - 1];
            var id = data.id;
            for (var i = 0; i < quesHistory.length; i++) {
                if (id === quesHistory[i].question.id) {
                    if (i == 0) model.hasPrev = false;
                    renderQuestion(quesHistory[i].question, quesHistory[i].answer);
                    ishasHistroy = true;
                    break;
                }
            }
            if (!ishasHistroy) {
                _index_--;
                model.index = _index_;
            }
        } while (!ishasHistroy);
    }

    /**
     * 转跳模式
     * @param  int leap 转跳题目索引
     * @return void      [description]
     */
    function mode_leap(leap) {
        /*
          model.hasPrev = true;
          renderQuestion(data_questionlist[leap - 1])
          */

        model.hasPrev = true;
        var data = data_questionlist[leap - 1];
        var id = data.id;
        var ishasHistroy = false;
        for (var i = 0; i < quesHistory.length; i++) {
            if (id === quesHistory[i].question.id) {
                renderQuestion(quesHistory[i].question, quesHistory[i].answer);
                ishasHistroy = true;
                break;
            }
        }
        if (!ishasHistroy) {
            renderQuestion(data_questionlist[leap - 1]);
        }
    }

    /**
     * 结束模式
     * @return void [description]
     */
    function mode_over() {
        /*
          model.hasNext = false;
          model.hasPrev = false;
          model.quesState = 2;
          Common.tip.add({
              type: "success",
              text: "答题结束"
          });
          */

        model.quesState = 2;
        model.hasNext = false;
        model.hasPrev = true;
        model.canSaveExam = true;
        mode_answer_before();
        Common.tip.add({
            type: "success",
            text: "答题结束"
        });
    }

    /**
     * 控制上一题、下一题按钮状态
     * 在挂机和提交答卷之前，依然可修改答案
     */
    function mode_answer_before() {
        if (quesHistory.length == 1) {
            model.hasPrev = false;
            model.hasPrev = false;
            return;
        }
        for (var i = 0; i < quesHistory.length; i++) {
            if (cur_querstion.id == quesHistory[i].question.id) {
                if (i == 0) {
                    model.hasPrev = false;
                    model.hasNext = true;
                }
                if (i == quesHistory.length - 1) {
                    model.hasPrev = true;
                    model.hasNext = false;
                }
            }
        }
    }

    /**
     * 异常模式
     * @return void [description]
     */
    function mode_error() {
        model.hasNext = false;
        model.hasPrev = false;
        model.quesState = 2;
        model.errorCode = "";
        model.errorRemark = "";
        model.errorSubscribeTime = Common.formatDate(new Date(), "yyyy-MM-dd HH:mm");

        // jq_quesErrorBox.modal("show");
        $(".backdrop,#quescall_errorbox").show();
    }

    function callout() {
        // if (model.canSaveExam) {
        //   Common.tip.add({
        //     type: "warning",
        //     text: "请先提交异常，再拨打下一个号码"
        //   });
        //   return;
        // }
        var s, t;
        while (model.phoneNumberList.size()) {
            s = model.phoneNumberList.shift();
            if (s) {
                t = s;
                break;
            }
        }
        if (t) {

            //下一个号码，清除相关信息
            model.isSaveing = false;
            model.errorCode = "";

            quesHistory = [];
            quesHistoryTemp = [];

            cur_mobileNumber = t;
            model.currentCallOutNumber = cur_mobileNumber;
            Common.tip.add({
                type: "info",
                text: "正在拨打号码:" + cur_mobileNumber + "..."
            });
            avalon.vmodels.callctrl.callout(cur_mobileNumber);
            return false;
        }
        return true;
    }

    /**
     * 替换题目中的占位符
     * @param  {string} str 源题目
     * @return {string}     转换后的题目
     */
    var questionSymbol = /%项目%|%物业%|%姓名%|%用户名%/g;

    function replaceQuestionSymbol(str) {
        var w = '';
        return (str + "").replace(questionSymbol, function(r) {
            switch (r) {
                case "%项目%":
                    w = cur_projectName;
                    break;
                case "%物业%":
                    w = cur_address;
                    break;
                case "%姓名%":
                    w = cur_userName;
                    break;
                case "%用户名%":
                    w = cur_loginName;
                    break;
                default:
                    ""
            };
            return w;
        })
    }

    /**
     * 渲染题目
     * @param  object data   题目
     * @param  object result 答案
     * @return {[type]}        [description]
     */
    function renderQuestion(data, result) {
        if (!data) {
            return;
        }
        var obj = result || {},
            t, o;
        cur_querstion = data;
        model.index = data["sequence"] - 1;
        model.question["sequence"] = data["sequence"];
        model.question["title"] = replaceQuestionSymbol(data["title"]);
        model.question["optionModeText"] = data["optionModeText"];
        model.question["optionMode"] = data["optionMode"];
        // model.question["basicContent"] = data["basicContent"];
        model.questionType = option_mode[data["optionMode"]]
        var arr = [],
            opts = data["optionList"];
        for (var i = 0; i < opts.length; i++) {
            o = opts[i];
            t = obj[o.id];
            arr.push({
                id: o.id,
                category: o.category,
                score: o.score,
                content: o.content,
                basicContent: o.basicContent,
                processMode: o.processMode,
                gotoTopic: o.gotoTopic,
                remark: t && t.remark || '',
                checked: t && t.checked || false,
            })
        };
        model.options = [];
        model.options = arr;
    }

    /**
     * 渲染客户
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    var DAY_TIME = 86400000; //1000*60*60*24
    function renderCustomer(data) {
        var date = new Date().getTime();
        model.customer["customerId"] = data["customerId"] || '';
        model.customer["customerName"] = data["customerName"] || '';
        model.customer["houseId"] = data["houseId"] || '';
        model.customer["houseName"] = data["houseName"] || '';
        model.customer["houseCode"] = data["houseCode"] || '';
        model.customer["projectId"] = data["projectId"] || '';
        model.customer["projectName"] = data["projectName"] || '';
        model.customer["projectCode"] = data["projectCode"] || '';
        model.customer["mainMobile"] = data["mainMobile"] || '';
        model.customer["standbyMobile"] = data["standbyMobile"] || '';
        model.customer["homeTel"] = data["homeTel"] || '';
        model.customer["officeTel"] = data["officeTel"] || '';
        model.customer["sexText"] = data["sexText"] || '';
        model.customer["date1"] = avalon.filters.date(date + (DAY_TIME * 1), "MM月dd日");
        model.customer["date2"] = avalon.filters.date(date + (DAY_TIME * 2), "MM月dd日");
        model.customer["date3"] = avalon.filters.date(date + (DAY_TIME * 3), "MM月dd日");
        model.customer["date4"] = avalon.filters.date(date + (DAY_TIME * 4), "MM月dd日");
        model.customer["date5"] = avalon.filters.date(date + (DAY_TIME * 5), "MM月dd日");
        model.customer["date1subscribe"] = '（' + (data["date1subscribe"] || '0') + '）';
        model.customer["date2subscribe"] = '（' + (data["date2subscribe"] || '0') + '）';
        model.customer["date3subscribe"] = '（' + (data["date3subscribe"] || '0') + '）';
        model.customer["date4subscribe"] = '（' + (data["date4subscribe"] || '0') + '）';
        model.customer["date5subscribe"] = '（' + (data["date5subscribe"] || '0') + '）';
    }

    /**
     * ajax
     */
    // 获取字典
    function getDictionary_ajax() {
        var dictionary = ["AnswerAbnormalCode", "AnomalousErrorCategory"];
        Common.ajax({
            url: Config.ajaxPaths["getDictionary"] + dictionary.join(",") + '/items',
            type: "GET",
            success: function(res) {
                if (res) {
                    model.customerAbnormal = res["AnomalousErrorCategory"];
                    model.answerAbnormal = res["AnswerAbnormalCode"];
                }
            },
            error: function() {},
            complete: function() {}
        })
    }

    // 抽取用户
    function getCustomer_ajax() {
        var tipHandle = Common.tip.add({
                type: "info",
                text: "正在抽取客户...",
                delay: -1 //不自动隐藏
            })
            // var res = customerInfo;

        Common.ajax({
            url: Config.ajaxPaths["getCustomerForExamination"],
            type: "GET",
            data: {
                questionnaireId: cur_quesId
            },
            success: function(res) {
                tipHandle.remove();
                Common.tip.add({
                    type: "success",
                    text: "抽取到客户"
                });
                if (res) {
                    var answer = res["answer"],
                        customer = res["customer"];
                    // 赋值
                    cur_answerId = answer["answerId"];
                    cur_customerId = customer["customerId"];
                    cur_houseId = customer["houseId"];
                    cur_projectId = customer["projectId"];
                    cur_projectName = customer["projectName"];
                    cur_address = customer["houseName"];
                    cur_userName = customer["customerName"];


                    model.phoneNumberList = [];
                    if (customer.mainMobile) {
                        model.phoneNumberList.push(customer.mainMobile);
                    }
                    if (customer.standbyMobile) {
                        model.phoneNumberList.push(customer.standbyMobile);
                    }
                    if (customer.homeTel) {
                        model.phoneNumberList.push(customer.homeTel);
                    }
                    if (customer.officeTel) {
                        model.phoneNumberList.push(customer.officeTel);
                    }

                    // 渲染
                    renderCustomer(customer);
                    initQuestion();
                    callout();
                }
            },
            error: function(res) {
                tipHandle.remove();
                Common.tip.add({
                    type: "warning",
                    text: "无客户"
                });
                model.canNewCustomer = true;
            },
            complete: function() {}
        })
    }

    // 新增问卷调查答卷中间表
    function addQuesRecord_ajax(callId) {
        /*
          Common.ajax({
              url: Config.ajaxPaths["addQuesRecord"],
              type: "POST",
              data: {
                  answerId: cur_answerId,
                  callRecordId: callId
              },
              success: function() {},
              error: function() {},
              complete: function() {}
          })*/
    }

    var getExamination_handle = null;
    // 获取试题
    function getExamination_ajax(id) {
        if (getExamination_handle) {
            getExamination_handle.abort();
        }
        getExamination_handle = Common.ajax({
            url: Config.ajaxPaths["getExaminationById"] + id,
            type: "GET",
            data: {},
            success: function(res) {
                cur_quesId = res["id"];
                cur_subjectId = res["subjectId"];
                data_questionlist = res["topicList"];
                model.description = res["description"];
                model.title = res["title"]
                model.question.size = data_questionlist.length;
            },
            error: function() {},
            complete: function() {}
        })
    }

    // 保存答案
    function saveExamination_ajax() {
        model.isSaveing = true;
        var tiphandle = Common.tip.add({
            type: "info",
            text: "正在提交...",
            delay: -1 // 不自动隐藏
        });
        var data = {
            answerId: cur_answerId,
            questionnaireId: cur_quesId,
            projectId: cur_projectId,
            customerId: cur_customerId,
            houseId: cur_houseId,
            projectId: cur_projectId,
            subjectId: cur_subjectId,
            startTime: cur_startTime,
            endTime: cur_endTime,
            completed: !model.errorCode,
            subscribeTime: model.errorSubscribeTime, //预约时间（预约客户异常时传）
            abnormalCode: model.errorCode || 0, //异常编号
            abnormalContent: model.errorRemark //异常编号内容（“其他”选项的内容，选择“其他”的时候才传）

        };
        for (var i = 0; i < quesHistoryTemp.length; i++) {
            var d = quesHistoryTemp[i];
            if (d["answer"]) {
                data["answerItemList[" + i + "].topicId"] = d["question"]["id"];
                data["answerItemList[" + i + "].content"] = d["answer"]["content"];
            }
        };
        Common.ajax({
            url: Config.ajaxPaths["saveExamination"],
            type: "POST",
            data: data,
            success: function() {
                tiphandle.remove();
                Common.tip.add({
                    type: "success",
                    text: "提交成功"
                });
                //掉线，不接受调查，清空号码列表，防止拨出
                model.phoneNumberList = [];
                $(".backdrop,#quescall_errorbox").hide();
                //model.isSaveing = false;
                // model.quesState = 2;

                // 提交答卷结束后，不能操作上一题、下一题逻辑
                model.canSaveExam = false;
                model.hasNext = false;
                model.hasPrev = false;
                quesHistory = [];
                quesHistoryTemp = [];
            },
            error: function() {
                tiphandle.remove();
                Common.tip.add({
                    type: "error",
                    text: "提交失败"
                });
                model.isSaveing = false;
                $(".backdrop,#quescall_errorbox").hide();
            },
            complete: function() {}
        })
    }

    // 保存未接通异常
    function saveNotConnectError_ajax() {
        model.isSaveing = true;
        Common.tip.add({
            type: "info",
            text: "正在提交..."
        });
        Common.ajax({
            url: Config.ajaxPaths["saveNotConnectError"],
            type: "POST",
            data: {
                answerId: cur_answerId, //答卷id
                questionnaireId: cur_quesId, //问卷id
                projectId: cur_projectId, //项目id
                houseId: cur_houseId, // 房屋id
                customerId: cur_customerId, //客户id
                tagCategory: "1", //标签类型：1、联系电话 2、客户名称
                tagValue: cur_mobileNumber, //标签内容
                errorCategory: model.errorCode, //异常编码
                errorContent: model.errorRemark, //异常内容（其他 选项内容）
                isLast: model.phoneNumberList.size() == 0 //是否本用户最后一通电话，如果用户最后一通电话后台需要增加今天拨打名额
            },
            success: function() {
                Common.tip.add({
                    type: "success",
                    text: "提交成功"
                });
                $(".backdrop,#quescall_errorbox").hide();
                // model.quesState = 2;
            },
            error: function() {
                Common.tip.add({
                    type: "error",
                    text: "提交失败"
                });
                model.isSaveing = false;
                $(".backdrop,#quescall_errorbox").hide();
            },
            complete: function() {}
        })
    }

    /**
     * @return {{optionId}:{optionObj}
     *      /.../
     *      optionId:optionId,
     *      content:"{optionId}|{remark};/.../"
     * }
     */
    function getAnswer(checkComplete) {

        var option, remark, elem, optionId,
            optionType = model.question.optionMode,
            // arr = [];
            content = [],
            obj = {},
            isComplete;
        var jq_quesContent = $("#quescall_content");
        // 获取 optionId 和 content
        if (optionType == '1' || optionType == '2') {
            // radio || checkbox
            option = jq_quesContent.find("input:checked");
            option.each(function() {
                elem = $(this);
                optionId = elem.attr("data-id");
                obj[optionId] = {
                    checked: true
                };
                content.push(optionId + "|");
            })
            isComplete = !!option.length;
        } else if (optionType == '3') {
            // input
            option = jq_quesContent.find("input:checked");
            var hasContent = false,
                isOther = false;
            option.each(function() {
                elem = $(this);
                optionId = elem.attr("data-id");
                var topicConent = elem.attr("data-content");
                remark = elem.next().next().val();
                obj[optionId] = {
                    checked: true,
                    remark: remark
                };
                if (topicConent === "其他" || topicConent === "其它") {
                    isOther = true;
                    //判断其它，其他选项是否填写备注
                    if (remark) {
                        hasContent = true;
                    }
                }
                //去除特殊符号
                content.push(optionId + "|" + remark.replace(";", " "));
            });
            if (!isOther && !hasContent) {
                isComplete = !!option.length;
            } else {
                isComplete = !!option.length && (isOther && hasContent);
            }
        } else if (optionType == '4') {
            // textarea
            option = jq_quesContent.find("textarea");
            optionId = option.attr("data-id");
            remark = option.val();
            obj[optionId] = {
                remark: remark
            };
            //去除特殊符号
            content.push(optionId + "|" + remark.replace(";", " "));
            isComplete = !!Common.trim(option.val());
        }
        obj.optionId = optionId;
        obj.content = content.join(";");
        // 获取 mode 和 leap

        var quesIndex = parseInt(model.index),
            quesLength = data_questionlist.length,
            mode, leap
        for (var i = 0; i < model.options.length; i++) {
            if (model.options[i].id == optionId) {
                leap = model.options[i].gotoTopic;
                mode = model.options[i].processMode;
                break;
            }
        }
        // 根据问题是否最后一题判断答题是否结束
        if (mode == '1' && quesIndex == (quesLength - 1)) {
            mode = '3'
        } else if (mode == '2' && leap > quesLength) {
            mode = '3'
        }

        if (!isComplete) {
            checkComplete && Common.tip.add({
                text: "请填写答案",
                type: "error"
            })
            return false;
        }
        // return arr;
        return obj;
    }

    /**
     * 初始化问卷
     * @return {[type]} [description]
     */
    function initQuestion() {
        model.isSaveing = false;
        // model.abnormalCode = "";
        // model.abnormalContent = "";
        // model.subscribeTime = "";
        model.errorCode = ""; //异常编码
        model.errorRemark = ""; //异常备注
        model.errorSubscribeTime = Common.formatDate(new Date(), "yyyy-MM-dd HH:mm"); // 预约时间
        model.options = [];
        quesHistory = [];
        renderQuestion(data_questionlist[0]);
    }

    /*
     * base
     */
    function init() {
        if (hasInit) {
            return;
        }
        hasInit = false;
        getDictionary_ajax();
        avalon.scan(null, model)
            // DOM渲染后执行，如事件绑定
        bindEvent();
    }

    var jq_quesContent, jq_quesErrorBox, jq_labels

    function bindEvent() {
        jq_labels = $("#quescall_labels");
        jq_quesErrorBox = $("#quescall_errorbox");
        jq_quesContent = $("#quescall_content");
        jq_quesContent.on("click", ".qt-bloom-checkbox", function() {
            $(this).parent()[this.checked ? "addClass" : "removeClass"]("on")
        })
    }

    function active(param) {
        init(param);

        if (param.id && param.id != cur_quesId) {
            cur_quesId = param.id;
            getExamination_ajax(param.id);
            // getCustomer_ajax(param.id);
        }
    }

    function inactive() {

    }

    if (window.SoftPhone) {
        // 登录
        SoftPhone.addEventListener("EvtDidLogin", function() {
            model.custState = 2;
        });
        // 弹屏
        SoftPhone.addEventListener("EvtScreenPopDataArrival", function(strEvtMsg, param, eventQueue, callType) {
            model.custState = 0;
            model.quesState = 0;
            var callId = param["callId"] || param["callid"];
            var callRecordId = avalon.vmodels['callctrl'].callRecordId;
        });
        // 接听
        SoftPhone.addEventListener("EvtDidActive", function() {
            //model.phoneNumberList = [];
            //如果呼出之后，客户接听，则修改状态为1，则为正常状态
            model.custState = 1;
            model.quesState = 1;
            model.hasNext = true;
            cur_startTime = Common.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
        });
        // 结束
        SoftPhone.addEventListener("EvtDidWrapup", function() {
            cur_endTime = Common.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
            //如果手动挂机时，状态不为1，则客户未接听，当前为异常状态，既空号，错号？
            model.custState = model.custState == 1 ? 2 : 3;
            // model.quesState = 2;
            //model.hasNext = false;
            //model.hasPrev = true;
            mode_answer_before();
        });
    }
    return {
        active: active,
        inactive: inactive
    }
});
