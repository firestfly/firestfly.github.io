define(['validate',
    'static/js/avalon/plugs/businesstype/widget'
], function(validate, businesstypeWidget) {
    var hasInit = false;
    var _taskNo = '',
        _taskId = "",
        _viewOption;
    var model = avalon.define({
        $id: "taskinfo",
        isLoading: false,
        // 刷新
        refresh: function() {
            // view(_viewOption);
            // 获取任务详情
            getTask_ajax(_viewOption);
            // 获取本地时间线
            getLocalTimeLine_ajax();
        },
        //追加
        supplement: {
            visible: false,
            dialog: function() {
                clearValidate(remark_form);
                model.supplement.remark = '';
                remark_dialog.modal({
                    backdrop: true
                });
            },
            close: function() {
                remark_dialog.modal('hide');
            },
            remark: "",
            submit: function() {
                clearValidate(remark_form);
                if (validateForm(remark_form)) {
                    Common.tip.add({
                        text: "请检查所填写的追加内容",
                        type: "warning"
                    })
                } else {
                    remark_dialog.modal("hide");
                    submitSupTask_ajax(model.supplement.remark);
                }
            }
        },
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
            timeline: [],
            imglist: [] //图片列表
        },
        localTimeLine: {
            list: [],
            loading: false
        }
    });

    /*
     * ajax
     */
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
                    if (result["crm_source"]) {
                        model.form["sourceText"] = result["crm_source"];
                    }
                    if (result["crm_priority"]) {
                        model.form["levelTypeText"] = result["crm_priority"];
                    }
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
                    model["supplement"].visible = true;
                }

            },
            error: function() {

            },
            complete: function() {
                model.isLoading = false;
            }
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

    /*
     * 定义方法
     */
    function validateForm(jqForm) {
        return validate(jqForm[0], {
            validateAll: true,
            onerror: function(caller, text) {
                $(caller).parent().find(".errortip").addClass("on").tooltip({
                    title: text,
                    placement: "bottom"
                })
            }
        })
    }

    function clearValidate(jqForm) {
        jqForm.find(".errortip").removeClass("on").tooltip("destroy");
    }


    // 定义变量
    var remark_dialog,
        remark_form;

    function init() {

        if (hasInit) {
            return;
        }
        hasInit = true;

        // dom绑定
        setTimeout(function() {
            remark_dialog = $("#taskinfo_remarkdialog");
            remark_form = $("#taskinfo_remarkform");
        })
    }

    function active(opt) {
        init();
        view(opt)
    }

    function view(opt) {
        _viewOption = opt;
        if (opt && opt.id) {
            opt.islocal = !opt.islocal == "false";
            model["supplement"].visible = false;
            if (opt.islocal) {
                _taskId = opt.id;
                _taskNo = '';
            } else {
                _taskNo = opt.id;
                _taskId = '';
            }
            // 获取任务详情
            getTask_ajax(opt);
            // 获取本地时间线
            getLocalTimeLine_ajax();
        }
    }
    return {
        active: active,
        view: view
    }
});