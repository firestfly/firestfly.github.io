define(['validate', 'widget_businessType'], function(validate, businesstypeWidget) {
    var SIMPLEMODEL = window["SIMPLEMODEL"] || false;
    var hasInit = false;
    var taskObj = {},
        _taskNo = '',
        _messageRegStr = "",
        _viewOption,
        _messageList;
    var model = avalon.define({
        $id: "taskquery",
        isLoading: false,
        // visible
        processType: null, // 超时任务类型
        reasonList: [],
        managers: [],
        simpleModel: SIMPLEMODEL,
        form: {
            address: "",
            appointmentStartTime: "",
            businessType: "",
            businessTypeText: "",
            callNo: "",
            contactsMobile: "",
            contactsName: "",
            content: "",
            createTime: "",
            creator: "",
            houseName: "",
            levelTypeText: "",
            evaluationText: "",
            projectName: "",
            reportUserMobile: "",
            sourceText: "",
            status: "",
            statusText: "",
            taskId: "",
            taskNo: "",
            title: "",
            projectMobile: "",
            projectFullname: "",
            dutytext: "",
            timeline: [],
            imglist: [] //图片列表
        },
        localTimeLine: {
            list: [],
            loading: false
        },
        addTaskVisible: {
            get: function() {
                return !!this.form.taskNo;
            }
        },
        backdrop: function(status) {
            if (status == 'show') {
                $("#tab-taskquery").find('.cover').addClass('on');
                $("#tab-taskquery").parent('.task-tab').removeClass('scrollable');
            } else if (status == 'hide') {
                $("#tab-taskquery").find('.cover').removeClass('on');
                $("#tab-taskquery").parent('.task-tab').addClass('scrollable');
            }
        },
        callout: function() {
            // 呼出
            var number = $(this).attr("data-number")
            avalon.vmodels.callctrl.btnCallout.dnis = number;
            avalon.vmodels.callctrl.btnCallout.change("", model.form.taskNo)
        },
        // 刷新
        refresh: function() {
            // view(_viewOption);
            // 获取任务详情
            getTask_ajax(_viewOption);
            // 获取本地时间线
            getLocalTimeLine_ajax();
        },
        //定责
        responsible: {
            visible: false,
            dialog: function() {
                model.responsible.value = '项目';
                model.backdrop('show');
                responsible_dialog.modal({
                    backdrop: false
                });
            },
            close: function() {
                model.backdrop('hide');
                responsible_dialog.modal('hide');
            },
            options: Config.keys["Duty"] || [],
            value: '',
            submit: function() {
                model.backdrop('hide');
                responsible_dialog.modal("hide");
                responsible_ajax(model.responsible.value);
            }
        },
        // 关闭/取消
        close: {
            visible: false,
            dialog: function() {
                model.close.value = '';
                model.backdrop('show');
                close_dialog.modal({
                    backdrop: false
                });
            },
            close: function() {
                model.backdrop('hide');
                close_dialog.modal('hide');
            },
            value: '',
            options: Config.keys["FinishType"] || [],
            submit: function() {
                var remark = model.close.value;
                if (remark) {
                    model.backdrop('hide');
                    close_dialog.modal("hide");
                    closeTask_ajax(remark);
                } else {
                    Common.tip.add({
                        text: Config.tips["taskCloseIsEmptyError"],
                        type: "warning"
                    })
                }
            }
        },
        // 点击取消
        cancel: {
            visible: false,
            click: function() {
                clearFormModel()
            }
        },
        //追加
        supplement: {
            visible: false,
            dialog: function() {
                clearValidate(remark_form);
                model.supplement.remark = '';
                model.backdrop('show');
                remark_dialog.modal({
                    backdrop: false
                });
            },
            close: function() {
                model.backdrop('hide');
                remark_dialog.modal('hide');
            },
            remark: "",
            submit: function() {
                clearValidate(remark_form);
                if (validateForm(remark_form)) {
                    Common.tip.add({
                        text: Config.tips["taskAppendValidateError"],
                        type: "warning"
                    })
                } else {
                    model.backdrop('hide');
                    remark_dialog.modal("hide");
                    submitSupTask_ajax(model.supplement.remark);
                }
            }
        },
        //评价
        evaluation: {
            visible: false,
            dialog: function() {
                model.evaluation.val0 = "";
                model.evaluation.val1 = "";
                model.evaluation.phoneNo = model.form.contactsMobile || "";
                model.backdrop('show');
                evaluation_dialog.modal({
                    backdrop: false
                });
            },
            close: function() {
                model.backdrop('hide');
                evaluation_dialog.modal('hide');
            },
            phoneNo: "",
            val0: "",
            val1: "",
            options: Config.evaluation && Config.evaluation.list || [],
            suboptions: [],
            submit: function() {
                // 满意度父类
                var o = Config.evaluation.obj,
                    v0 = model.evaluation.val0,
                    v1 = model.evaluation.val1;
                var radioText0 = o[v0] && o[v0].content || '';
                var radioText1 = o[v1] && o[v1].content || '';

                if (radioText0 && radioText1) {
                    model.backdrop('hide');
                    evaluation_dialog.modal("hide");
                    evaluationTask_ajax(radioText0 + '/' + radioText1);
                } else {
                    Common.tip.add({
                        text: Config.tips["checkEvaluationTaskError"],
                        type: "warning"
                    });
                }
            },
            call: function() {

                var number = $(this).attr("data-phone")
                avalon.vmodels.callctrl.btnCallout.dnis = number;
                avalon.vmodels.callctrl.btnCallout.change(null, model.form.taskNo, {
                    reasons: "69",
                    action: "revisit"
                });
                avalon.vmodels.callctrl.btnCallout.sure();
                // evaluation_dialog.modal("hide");
            }
        },
        // 超时处理
        process: {
            visible: false,
            dialog: function() {
                clearValidate(call_form);
                if (model.processType == '1') {
                    // 无类型
                    model.process.businesstype = "";
                    if (avalon.vmodels["taskqueryBusinessWidget"]) {
                        avalon.vmodels["taskqueryBusinessWidget"].businessType = "";
                    }
                    model.backdrop('show');
                    business_dialog.modal({
                        backdrop: false
                    });
                } else if (model.processType == '2') {
                    // 无人处理
                    model.process.remark = "";
                    model.backdrop('show');
                    call_dialog.modal({
                        backdrop: false
                    });
                }
            },
            close: function() {
                model.backdrop('hide');
                if (model.processType == '1') {
                    business_dialog.modal('hide');
                } else if (model.processType == '2') {
                    call_dialog.modal('hide');
                }
                model.backdrop('hide');
            },
            phonelist: [],
            businesstype: "",
            remark: "",
            call: function() {
                var number = $(this).attr("data-number");
                var name = $(this).attr("data-name");
                avalon.vmodels.callctrl.btnCallout.dnis = number;
                avalon.vmodels.callctrl.btnCallout.change(null, model.form.taskNo, {
                    action: "abnormalDial",
                    name: name
                });
            },
            businessSubmit: function() {
                var code = avalon.vmodels["taskqueryBusinessWidget"].businessType;
                if (code) {
                    model.backdrop('hide');
                    business_dialog.modal("hide");
                    editAbnormalTaskType_ajax(code);
                } else {
                    Common.tip.add({
                        text: Config.tips["addTaskBusinessTypeError"],
                        type: "warning"
                    });
                }
            },
            remarkSubmit: function() {
                clearValidate(call_form);
                if (validateForm(call_form)) {
                    Common.tip.add({
                        text: Config.tips["taskAppendProcessError"],
                        type: "warning"
                    });
                } else {
                    model.backdrop('hide');
                    call_dialog.modal("hide");
                    editAbnormalTaskRemark_ajax(model.process.remark);
                }
            }
        },
        message: {
            name: "", //模板名称
            number: "", //号码
            tempId: "", //模板id
            tempType: "", //模板类型
            list: [], //查询结果
            loading: false, //查询加载中
            visible: false, //查询显隐
            show: function() {
                // model.message.content = "";
                // model.message.template = "";
                // model.message.name = "";
                model.message.number = $(this).attr("data-number");
                msg_templateBox.find("input").val("");
                model.backdrop('show');
                msg_dialog.modal({
                    backdrop: false
                })
            },
            close: function() {
                model.backdrop('hide');
                msg_dialog.modal('hide');
            },
            send: function() {
                clearValidate(msg_form);
                if (validateForm(msg_form)) {
                    Common.tip.add({
                        text: Config.tips["taskSendMessageError"],
                        type: "warning"
                    })
                } else {
                    model.backdrop('hide');
                    msg_dialog.modal("hide");
                    submitMessage_ajax(model.message.number, transTemplate(msg_templateBox.find("input")));
                }
            },
            search: function(evt) {
                if (this.value) {
                    autoinput(evt, this.value);
                } else {
                    model.message.visible = false;
                }
            },
            searchClick: function() {
                autoinput(null, msg_input.val())
                if (event) {
                    event.stopPropagation && event.stopPropagation();
                    event.preventDefault && event.preventDefault();
                    event.cancelBubble = true;
                    event.returnValue = false;
                }
            }
        },
        errorCallout: function() {
            alert("满意度调查新建任务不支持拨打电话.")
        }
    });
    /**
     * function
     */
    // 清除详情模型
    function clearFormModel() {
        model.form["address"] = "";
        model.form["appointmentStartTime"] = "";
        model.form["businessType"] = "";
        model.form["businessTypeText"] = "";
        model.form["callNo"] = "";
        model.form["contactsMobile"] = "";
        model.form["contactsName"] = "";
        model.form["content"] = "";
        model.form["createTime"] = "";
        model.form["creator"] = "";
        model.form["houseName"] = "";
        model.form["levelTypeText"] = "";
        model.form["evaluationText"] = "";
        model.form["projectName"] = "";
        model.form["reportUserMobile"] = "";
        model.form["sourceText"] = "";
        model.form["status"] = "";
        model.form["statusText"] = "";
        model.form["taskId"] = "";
        model.form["taskNo"] = "";
        model.form["title"] = "";
        model.form["projectMobile"] = "";
        model.form["projectFullname"] = "";
        model.form["timeline"] = [];
        model.form["imglist"] = [];
    }

    var autoinput_exclude = /^(9|13|16|17|18|20|37|38|39|40)$/

    function autoinput(evt, value) {
        if (evt && autoinput_exclude.test(evt.keyCode)) {
            return;
        } else {
            getMsgTemplate_ajax(value)
        }
    }

    /*
     * ajax
     */
    var getMsgTemplate_handle = null;

    function getMsgTemplate_ajax(name) {
        if (getMsgTemplate_handle) {
            getMsgTemplate_handle.abort();
        }
        model.message.loading = true;
        model.message.visible = true;
        getMsgTemplate_handle = Common.ajax({
            url: servicePath.tel + "/v1/message/querytemplate",
            type: "POST",
            data: {
                name: name,
                curPage: 1,
                pageSize: 50
            },
            success: function(res) {
                model.message.list = [];
                model.message.list = res.list.slice();
                _messageList = res.list;
            },
            complete: function() {
                model.message.loading = false;

            }
        })
    }
    var getTask_handle = null;
    // 获取任务详情
    function getTask_ajax(opts) {
        if (!opts.id) {
            return
        }
        var url = '',
            data = {
                curPage: 1,
                pageSize: 1
            }
        if (opts.islocal) {
            url = servicePath.task + '/v1/callcenter/task/local/list'
            data["taskId"] = opts.id;
        } else {
            url = servicePath.task + '/v1/callcenter/task/app/list'
            data["taskNo"] = opts.id;
        }
        model.isLoading = true;
        if (getTask_handle) {
            getTask_handle.abort();
        }
        getTask_handle = Common.ajax({
            url: url,
            type: "GET",
            data: data,
            success: function(res) {
                if (res && res["list"][0]) {
                    /**
                     * 渲染任务详情
                     */
                    var result = res["list"][0],
                        _businessType,
                        _hasEvaluated,
                        _hasDuty,
                        _projectCode;
                    model.form["taskId"] = result["taskId"] || result["task_id"]
                    model.form["taskNo"] = result["taskNo"] || result["task_no"]
                    model.form["title"] = result["title"]
                    model.form["address"] = result["address"]
                    model.form["projectName"] = result["projectName"] || result["project_name"]
                    model.form["appointmentStartTime"] = result["appointmentStartTime"] || result["appointment_start_time"]
                    model.form["businessType"] = _businessType = result["businessType"] || result["business_type"]
                    model.form["businessTypeText"] = result["businessTypeText"] || result["business_name"]
                    model.form["contactsMobile"] = result["contactsMobile"] || result["mobile"]
                    model.form["contactsName"] = result["contactsName"] || result["contact"]
                    model.form["content"] = result["content"]
                    model.form["createTime"] = result["createTime"]
                    model.form["creator"] = result["creator"]
                    model.form["reportUserMobile"] = result["reportUserMobile"] || result["report_user_mobile"]
                    model.form["statusText"] = result["status"];
                    model.form["evaluationText"] = result["crm_evaluation"] != 'null' ? result["crm_evaluation"] : "";
                    model.form["dutytext"] = result["crm_duty"] != 'null' ? result["crm_duty"] : "";
                    /*if (result["crm_source"]) {
                        model.form["sourceText"] = result["crm_source"];
                    }*/
                    if (result["source"]) {
                        model.form["sourceText"] = result["source"];
                    }
                    if (result["crm_priority"]) {
                        model.form["levelTypeText"] = result["crm_priority"];
                    }
                    _hasDuty = result["crm_duty"] && result["crm_duty"] != 'null';
                    _hasEvaluated = result["crm_evaluation"] && result["crm_evaluation"] != 'null';
                    _projectCode = result["project_code"];
                    /**
                     * 合并详情的图片和
                     */
                    var imglist = result["images"] || [],
                        timeline = result["timeline"] || [],
                        imgs;
                    for (var i = 0; i < timeline.length; i++) {
                        imgs = timeline[i] && timeline[i].images;
                        if (imgs && imgs.length) {
                            imglist = imglist.concat(imgs);
                        }
                    };
                    model.form["imglist"] = imglist;

                    /**
                     * 根据任务情况，展示显示任务操作按钮
                     * 任务列表展示
                     * 追加：没有权限控制，其他任何状态都可以追加，超时列表不显示
                     * 定责：任务已经关闭(1010、1011)，必须是投诉类（判断条件是已BUCR04开头的业务类型，而不是==BUCR04），超时列表不显示
                     * 取消/结束：状态1001到1008都可以。超时列表不显示
                     * 评价：状态1009、1010、1011，且评价后不可以出现改按钮，有权限控制，超时列表不显示
                     *
                     * 超时列表进入展示
                     * 取消：超时列表显示（功能：清空页面数据，不掉任何接口）
                     * 处理：超时列表显示，根据不同的任务类型，弹出不同的模态窗。
                     */
                    // 最新状态
                    // var r = result["status"] + '',
                    var r = parseInt(result["status"]),
                        processType = model.processType,
                        // type = 0,已完成; 1,无类型; 2,超时未处理;false,非超时任务
                        isNotAbnormalTask = !processType;
                    if (isNotAbnormalTask && !_hasDuty && window["hasCcallcenterTaskDetailResponsibleRole"] && (r == 1010 || r == 1011) && /^BUCR04/i.test(_businessType)) {
                        // 定责
                        model["responsible"].visible = true;
                    }
                    if (isNotAbnormalTask && !_hasEvaluated && window["hasCcallcenterTaskDetailEvaluationRole"] && (r == 1009 || r == 1010 || r == 1011)) {
                        // 评价
                        model["evaluation"].visible = true;
                    }
                    if (isNotAbnormalTask && window["hasCallcenterTaskDetailCancel"] && r >= 1001 && r <= 1008) {
                        // 取消、关闭
                        model["close"].visible = true;
                    }
                    if (isNotAbnormalTask) {
                        // 追加
                        model["supplement"].visible = true;
                    } else if (processType == '1' || processType == '2') {
                        // 处理
                        model["process"].visible = true;
                        model["cancel"].visible = true;
                    }
                    if (processType == "2") {
                        getStaffsInfo_ajax(_projectCode);
                    }
                }

            },
            error: function() {

            },
            complete: function() {
                model.isLoading = false;
            }
        })
    }
    // 提交 评价任务
    function evaluationTask_ajax(content) {
        Common.tip.add({
            text: "正在提交评价",
            type: "info"
        })
        model.evaluation.visible = false;
        Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/evaluationTask",
            type: "POST",
            data: {
                taskNo: _taskNo,
                content: content
            },
            success: function(res) {
                Common.tip.add({
                    text: "评价提交成功",
                    type: "success"
                });
            },
            error: function() {
                Common.tip.add({
                    text: "评价提交失败",
                    type: "error"
                })
                model.evaluation.visible = true;
            },
            complete: function() {}
        })
    }
    // 提交 定责
    function responsible_ajax(content) {
        Common.tip.add({
            text: "正在提交定责",
            type: "info"
        })
        model.responsible.visible = false;
        Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/dutyTask",
            type: "POST",
            data: {
                taskNo: _taskNo,
                content: content
            },
            success: function(res) {
                Common.tip.add({
                    text: "定责提交成功",
                    type: "success"
                })
            },
            error: function() {
                Common.tip.add({
                    text: "定责提交失败",
                    type: "error"
                })
                model.responsible.visible = true;
            },
            complete: function() {}
        })
    }
    // 提交 取消/关闭
    function closeTask_ajax(remark) {
        Common.tip.add({
            text: "正在取消/结束任务",
            type: "info"
        })
        model.close.visible = false;
        var data = {
            taskNo: _taskNo,
            remark: remark
        }
        Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/finishTask",
            type: "POST",
            data: data,
            success: function(res) {
                Common.tip.add({
                    text: "任务已取消/结束",
                    type: "success"
                })
                Common.log("overTask", {
                    taskId: _taskId,
                    taskNo: _taskNo
                }).success(function() {
                    view(_viewOption);
                })
            },
            error: function() {
                Common.tip.add({
                    text: "任务取消/结束失败",
                    type: "error"
                })
                model.close.visible = true;
            },
            complete: function() {}
        })
    }
    // 提交 修改任务类型
    function editAbnormalTaskType_ajax(code) {
        Common.tip.add({
            text: "正在提交任务类型",
            type: "info"
        })
        model.process.visible = false;
        model.cancel.visible = false;
        var data = {
            taskNo: _taskNo,
            businessType: code
        }
        Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/deal/abnormalTaskRecord/noType",
            data: data,
            type: "POST",
            success: function(res) {
                model.form.businessTypeText = Config.businessType.obj[code]["businessName"]
                Common.tip.add({
                    text: "提交任务类型成功",
                    type: "success"
                });
                Common.log("abnormalTaskType", {
                    taskNo: _taskNo,
                    taskId: _taskId
                }).success(function() {
                    // 把超时异常类型设置为：已完成
                    _viewOption["abtype"] = 0;
                    view(_viewOption)
                })
            },
            error: function() {
                Common.tip.add({
                    text: "提交任务类型失败",
                    type: "error"
                });
                model.process.visible = true;
                model.cancel.visible = true;
            },
            complete: function() {}
        })
    }
    // 根据任务流水号获取本地timeLine
    function getLocalTimeLine_ajax() {
        model.localTimeLine.loading = true;
        Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/timeline/local/" + _taskNo,
            type: "GET",
            success: function(res) {
                if (res) {
                    model.localTimeLine.list = res;
                }
            },
            error: function() {},
            complete: function() {
                model.localTimeLine.loading = false;
            }
        })
    }
    // 提交追加
    function submitSupTask_ajax(content) {
        // model.supplement.visible = false;
        Common.tip.add({
            text: "正在追加",
            type: "info"
        })
        Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/addTaskRemark",
            type: "POST",
            data: {
                "taskNo": _taskNo,
                "remark": content
            },
            success: function() {
                Common["tip"].add({
                    text: "追加成功",
                    type: "success"
                });
                Common.log("supTask", {
                    taskNo: _taskNo,
                    taskId: _taskId,
                    content: content
                }).success(function() {
                    view(_viewOption)
                })
            },
            error: function() {
                Common["tip"].add({
                    text: "追加失败",
                    type: "error"
                });
                // model.supplement.visible = true;
            },
            complete: function() {}
        })
    }
    // 提交 超时处理
    function editAbnormalTaskRemark_ajax(content) {

        Common.tip.add({
            text: "正在提交处理",
            type: "info"
        });
        model.cancel.visible = false;
        model.process.visible = false;
        Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/deal/abnormalTaskRecord/unattendedProcessing",
            type: "POST",
            data: {
                taskNo: _taskNo,
                remark: content
            },
            success: function(res) {
                Common.tip.add({
                    text: "处理提交成功",
                    type: "success"
                })
                _viewOption["abtype"] = '0';
            },
            error: function() {
                Common.tip.add({
                    text: "处理提交失败",
                    type: "error"
                })
                model.cancel.visible = true;
                model.process.visible = true;
            },
            complete: function() {}
        })
    }
    // 发送短息
    function submitMessage_ajax(numbers, content) {
        Common.tip.add({
            text: "正在发送短息",
            type: "info"
        });
        Common.ajax({
            url: servicePath.tel + "/v1/message/send",
            type: "POST",
            data: {
                // extCode:"",
                // dstime:"",
                numbers: numbers,
                content: content,
                templateId: model.message.tempId,
                type: model.message.tempType
            },
            success: function(res) {
                Common.tip.add({
                    text: "短息发送成功",
                    type: "success"
                });
                Common.log("sendMsg", {
                    taskNo: _taskNo,
                    taskId: _taskId,
                    phoneNo: numbers,
                    content: content
                }).success(function() {
                    view(_viewOption)
                })
            },
            error: function() {
                Common.tip.add({
                        text: "短息发送失败",
                        type: "error"
                    })
                    // model.process.visible = true;
            },
            complete: function() {}
        })
    }
    var getStaffsInfo_handle = null;
    // 获取项目联系人信息
    function getStaffsInfo_ajax(projectCode) {
        if (getStaffsInfo_handle) {
            getStaffsInfo_handle.abort();
        }
        getStaffsInfo_handle = Common.ajax({
            url: servicePath.task + '/v1/projects/' + projectCode + '/managers',
            type: "GET",
            success: function(res) {
                if (res) {
                    model.managers = res;
                }
            }
        })
    }

    function makeTemplate(str) {
        var reg = /×+/g,
            index = 0,
            index2 = 0,
            temp = str.replace(reg, function($0) {
                var lengthOfPlace = $0.length;
                return '<input class="task-msginput" data-validator="required{请填写模板}" type="text"' +
                    ' style="width:' + lengthOfPlace + '.3em;"' +
                    ' name="&' + (index++) + '&"' +
                    ' maxlength="' + lengthOfPlace + '">'
            });
        _messageRegStr = str.replace(reg, function($0) {
            return '&' + (index2++) + '&'
        });

        return temp;
    }

    function transTemplate(inputGroup) {
        var obj = {};
        for (var i = 0; i < inputGroup.length; i++) {
            obj[inputGroup[i].name] = inputGroup[i].value;
        };
        return _messageRegStr.replace(/&\d+&/g, function($0) {
            return obj[$0];
        })

    }

    /*
     * 定义方法
     */

    // 定义变量
    var remark_dialog,
        evaluation_dialog,
        responsible_dialog,
        business_dialog,
        close_dialog,
        call_dialog,
        msg_dialog,
        remark_form,
        call_form,
        msg_form,
        msg_templateBox,
        msg_input

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        // dom绑定
        setTimeout(function() {
            remark_dialog = $("#taskquery_remarkdialog");
            remark_form = $("#taskquery_remarkform");
            evaluation_dialog = $("#taskquery_evaluationdialog");
            responsible_dialog = $("#taskquery_responsibledialog")
            business_dialog = $("#taskquery_businessdialog")
            close_dialog = $("#taskquery_closedialog")
            call_dialog = $("#taskquery_calldialog")
            call_form = $("#taskquery_callform")
            msg_dialog = $("#taskquery_msgdialog")
            msg_form = $("#taskquery_msgform")
            msg_templateBox = $("#taskquery_msgtemplate")
            msg_input = $("#taskquery_msginput")

            /*$watch*/
            model.evaluation.$watch("val0", function(newValue, oldvalue) {
                model.evaluation.val1 = '';
                model.evaluation.suboptions = [];
                model.evaluation.suboptions = Config.evaluation.obj[this.val0] && Config.evaluation.obj[this.val0].children || [];

            });

            $("#supplement_dialog").on("click", function() {
                clearValidate(remark_form);
                model.supplement.remark = '';
                model.backdrop('show');
                remark_dialog.modal({
                    backdrop: false
                });
            });

            $("#supplement_submit").on("click", function() {
                clearValidate(remark_form);
                if (validateForm(remark_form)) {
                    Common.tip.add({
                        text: Config.tips["taskAppendValidateError"],
                        type: "warning"
                    })
                } else {
                    model.backdrop('hide');
                    remark_dialog.modal("hide");
                    submitSupTask_ajax(model.supplement.remark);
                }
            });

            $("#taskquery_msgtemplist").on("click", "li", function() {
                var jqLi = $(this),
                    id = jqLi.attr("data-id");
                for (var i = 0; i < _messageList.length; i++) {
                    var m = _messageList[i];
                    if (m.id == id) {
                        model.message.name = m.name;
                        model.message.tempId = m.id;
                        model.message.tempType = m.type;
                        // 渲染模板
                        msg_templateBox.html(makeTemplate(m.content))
                        setTimeout(function() {
                            msg_templateBox.find("input").each(function() {
                                var that = $(this),
                                    maxlengthOfInput = parseInt(that.attr("maxlength"));
                                that.on("keyup", function() {
                                    if (this.value > maxlengthOfInput) {
                                        this.value = this.value.slice(0, maxlengthOfInput);
                                    }
                                })
                            })
                        })
                        return;
                    }
                };
                return;
            }).on("mouseenter", "li", function() {
                var li = $(this);
                li.addClass("on").siblings().removeClass("on");
            });
            $(document).on("click", function() {
                model.message.visible = false;
            });
        })
    }

    function validateForm(jqForm) {
        return validate(jqForm[0], {
            // validateAll: true,
            onerror: function(caller, text) {
                $(caller).parent().parent().find(".errortip").addClass("on").tooltip({
                    title: text,
                    placement: "top"
                })
            }
        })
    }

    function clearValidate(jqForm) {
        jqForm.find(".errortip").removeClass("on").tooltip("destroy");
    }

    function active(query) {
        init();
        setTimeout(function() {
            view(query);
        })
    }
    /**
     * 任务操作权限
     * 任务详情.任务定责
     * var hasCcallcenterTaskDetailResponsibleRole = false;
     * 任务详情.任务评价
     * var hasCcallcenterTaskDetailEvaluationRole = false;
     * 任务详情.任务取消
     * var hasCallcenterTaskDetailCancel = false;
     */

    function view(opts) {
        _viewOption = opts;
        if (opts && opts.id) {
            /**
             * 隐藏弹出框
             */
            remark_dialog.attr && remark_dialog.attr("aria-hidden") && remark_dialog.modal("hide");
            evaluation_dialog.attr && evaluation_dialog.attr("aria-hidden") && evaluation_dialog.modal("hide");
            responsible_dialog.attr && responsible_dialog.attr("aria-hidden") && responsible_dialog.modal("hide");
            business_dialog.attr && business_dialog.attr("aria-hidden") && business_dialog.modal("hide");
            close_dialog.attr && close_dialog.attr("aria-hidden") && close_dialog.modal("hide");
            call_dialog.attr && call_dialog.attr("aria-hidden") && call_dialog.modal("hide");
            msg_dialog.attr && msg_dialog.attr("aria-hidden") && msg_dialog.modal("hide");
            model.backdrop('hide');

            /**
             * 初始化数据
             */
            opts.islocal = !opts.islocal === "false";

            model["responsible"].visible = false;
            model["evaluation"].visible = false;
            model["close"].visible = false;
            model["supplement"].visible = false;
            model["process"].visible = false;
            model["cancel"].visible = false;
            if (opts.islocal) {
                _taskId = opts.id;
                _taskNo = '';
            } else {
                _taskNo = opts.id;
                _taskId = '';
            }
            // if (opts.abtype) {
            model["processType"] = opts.abtype || false;
            // } else {
            // model.processType = false;
            // }
            // 获取任务详情
            getTask_ajax(opts);
            // 获取本地时间线
            getLocalTimeLine_ajax();
        }

    }
    return {
        active: active,
        view: view
    }
});
