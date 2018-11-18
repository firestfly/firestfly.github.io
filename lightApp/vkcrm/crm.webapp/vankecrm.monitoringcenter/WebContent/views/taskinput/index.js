define(['validate', 'widget_businessType'], function(validate, widget_businessType) {
    var hasInit = false,
        isClearDataLoop = false,
        isTaskModel = false,
        currentAgentId = '',
        callStartTime = '',
        activeStartTime = '';


    var jq_taskForm = null,
        jq_custDialog = null,
        jq_relaDialog = null,
        jq_autoList = {
            "project": null,
            "building": null,
            "house": null
        }
    var callCollection = [];
    var model = avalon.define({
        $id: "taskinput",
        draftId: '',
        waiting: false,
        currentCallId: '',
        currentCallNumber: '',
        newTaskHidden: {
            get: function() {
                return !this.currentCallId;
            }
        },
        draftList: [],
        /* 任务表单 */
        form: {
            id: '', //任务id
            // taskNo: '', //任务流水号
            callNo: '', //通话流水号callId
            content: '', //任务描述
            taskdeal: '4', //任务处理 - 项目处理
            source: '4', // 4： 指挥中心
            levelType: '1', // 1: 普通

            // reportUserMobile: '', //任务来源(call in)人的手机号

            contactsName: '', //处理时联系人姓名/称呼
            contactsMobile: '', //处理时联系人手机

            projectId: '', //项目ID
            projectName: '', //项目名称
            projectCode: '', //项目编码

            buildingId: "",
            buildingName: '',
            buildingCode: '', //楼栋编码

            houseId: '', //房屋ID
            houseName: '', //房屋名称
            houseCode: '', //房屋编码
            businessType: "",
            businessTypeFullText: "",
            businessTypeFullCode: "",
            appointmentStartTime: '' //期望开始处理时间
        },
        /*管家信息*/
        isout: false, //是否外盘

        /* 任务来源 */
        taskSourceOptions: Config.keys && Config.keys["TaskSource"] || [],
        /* 任务优先级 */
        taskLevelOptions: Config.keys && Config.keys["TaskLevelType"] || [],
        /* 任务处理 */
        taskdealOptions: Config.keys && Config.keys["ProcessingWay"] || [],
        /* 公告 */
        notice: {
            isLoading: false,
            data: []
        },
        project_auto: {
            list: [],
            loading: false,
            visible: false
        },
        building_auto: {
            list: [],
            loading: false,
            visible: false
        },
        house_auto: {
            list: [],
            loading: false,
            visible: false
        },
        autoinput: autoinput,
        submitTask: submitTask,
        resetTask: clearData,
        eventQueryAuto: function(target) {
            var that = $(this);
            /*setTimeout(function() {
                model[target + '_auto'].visible = true;
                that.prev().prev().prev().focus();
            }, 210);*/
            that.prev().prev().prev().focus();
            inputChange(target, model.form[target + "Name"], true);
            if (event) {
                event.stopPropagation && event.stopPropagation();
                event.preventDefault && event.preventDefault();
                event.cancelBubble = true;
                event.returnValue = false;
            }
        }
    });

    var curAutoOption = {
        project: null,
        building: null,
        house: null
    }
    var autoinput_exclude = /^(9|16|17|18|20|37|39)$/

    function autoinput(evt) {
        // 37 left
        // 38 up
        // 39 right
        // 40 down
        // 13 enter
        var target = this.getAttribute("data-target");
        if (evt.keyCode == 40 || evt.keyCode == 38) {

            var cur = curAutoOption[target],
                next = null,
                dirt = evt.keyCode == 40 ? "next" : "prev"

            if (cur) {
                next = cur[dirt]();

                if (next.length) {
                    curAutoOption[target] = next
                    cur.removeClass("on")
                    next.addClass("on");
                    // next[0]["scrollIntoView"]();
                }
            } else {
                curAutoOption[target] = jq_autoList[target].find("li:first");
                curAutoOption[target].addClass("on");
            }
            evt.preventDefault();
            evt.returnValue = false;
        } else if (evt.keyCode == 13) {
            if (!curAutoOption[target]) {
                curAutoOption[target] = jq_autoList[target].find("li:first");
                curAutoOption[target].addClass("on");
            }
            inputSelect(curAutoOption[target], target)
        } else if (autoinput_exclude.test(evt.keyCode)) {
            return;
        } else {
            inputChange(target, this.value)
        }
        return;
    }

    function inputSelect(dom, target) {
        var li = $(dom),
            id = li.attr("data-id"),
            code = li.attr("data-code"),
            text = li.attr("data-text")
        isClearDataLoop = true;
        model[target + "_auto"].visible = false;
        model.form[target + "Id"] = id;
        model.form[target + "Code"] = code;
        model.form[target + "Name"] = text;
        isClearDataLoop = false;
    }

    function inputChange(target, value, search) {
        var name = Common.trim(value || '');
        if (!search) {
            model.form[target + "Name"] = name;
            model.form[target + "Code"] = '';
            model.form[target + "Id"] = '';
        }
        if (!search && name === '') {
            model[target + "_auto"].visible = false;
            model[target + "_auto"].loading = false;
            return;
        }
        curAutoOption[target] = null;
        autofunc["get" + target + "_ajax"](name);
    }
    /*
     * 监测
     */
    model.form.$watch("projectCode", function(newValue, oldValue) {
        if (!isClearDataLoop) {
            model.form.buildingName = "";
            model.form.buildingCode = "";
            model.form.buildingId = "";
            model.form.houseName = "";
            model.form.houseCode = "";
            model.form.houseId = "";
        }
        if (newValue) {
            //获取公告
            getNotice_ajax(newValue)
        } else {
            model["notice"].data = [];
        }
    });
    model.form.$watch("buildingId", function(newValue, oldValue) {
        if (!isClearDataLoop) {
            model.form.houseName = "";
            model.form.houseCode = "";
            model.form.houseId = "";
        }
    });
    model.form.$watch("houseId", function(value) {
        model["isout"] = false; //是否外盘
        if (value) {
            // 获取管家
            getManagerInfo_ajax(value);
        }
    });
    /*
     * 自动搜索项目房屋
     */
    var autofunc = {};
    // 搜索项目
    var getProject_handle = null;

    autofunc.getproject_ajax = function(projectName) {
        if (getProject_handle) {
            getProject_handle.abort();
        }
        model.project_auto.visible = true;
        model.project_auto.loading = true;
        getProject_handle = Common.ajax({
            url: servicePath.house + "/v1/roleprojects",
            type: "GET",
            data: {
                projectName: projectName
            },
            success: function(res) {
                model.project_auto.list = res;
            },
            error: function() {

            },
            complete: function() {
                model.project_auto.loading = false;
            }
        })
    }
    // 楼栋搜索
    var getBuilding_handle = null,
        getBuilding_result = {};

    function filterBuilding(res, name) {
        var i = 0,
            l = res.length,
            arr = [],
            str;
        for (i; i < l; i++) {
            var bname = res[i]["name"].toLowerCase();
            if (bname.indexOf(name.toLowerCase()) > -1) {
                arr.push(res[i]);
            }
        }
        return arr;
    }

    autofunc.getbuilding_ajax = function(buildName) {
        if (getBuilding_handle) {
            getBuilding_handle.abort();
        }
        var projectId = model.form.projectId;
        model.building_auto.list = [];
        model.building_auto.visible = true;
        model.building_auto.loading = true;
        if (getBuilding_result[projectId]) {
            var arr = filterBuilding(getBuilding_result[projectId], buildName);
            model.building_auto.list = arr;
            model.building_auto.loading = false;
            return;
        }
        getBuilding_handle = Common.ajax({
            url: servicePath.house + "/v1/project/" + projectId + "/buildings",
            type: "GET",
            data: {
                buildName: buildName
            },
            success: function(res) {
                getBuilding_result[projectId] = res;
                var arr = filterBuilding(getBuilding_result[projectId], buildName);
                model.building_auto.list = arr;
            },
            error: function() {

            },
            complete: function() {
                model.building_auto.loading = false;
            }
        })
    }
    // 房屋搜索
    var getHouse_handle = null;

    autofunc.gethouse_ajax = function(houseName) {
        if (getHouse_handle) {
            getHouse_handle.abort();
        }
        model.house_auto.visible = true;
        model.house_auto.loading = true;
        var projectId = model.form.projectId,
            buildingId = model.form.buildingId
        getHouse_handle = Common.ajax({
            url: servicePath.house + "/v1/project/" + projectId + "/" + buildingId + "/houses",
            type: "GET",
            data: {
                houseName: houseName
            },
            success: function(res) {
                model.house_auto.list = res;
            },
            error: function() {

            },
            complete: function() {
                model.house_auto.loading = false;
            }
        })
    }
    /*
     * function
     */
    // 清除校验提示
    function clearErrorTip() {
        jq_taskForm.find(".errortip").removeClass("on").tooltip("destroy");
    }
    // 提交表单
    function submitTask() {
        /* 开始校验 */
        clearErrorTip();
        var validateResult = validate(jq_taskForm[0], {
            validateAll: true,
            onerror: function(caller, text) {
                $(caller).closest("td").find(".errortip").addClass("on").tooltip({
                    title: text,
                    placement: "bottom"
                })
            }
        })
        if (validateResult) {
            Common.tip.add({
                text: Config.tips["taskValidateError"],
                type: "warning"
            });
            return;
        }
        /* 设置参数 */
        var draftId = model.draftId;

        if(model.form.taskdeal == '4' && !confirm('此单将标记为完成，不会派单给员工，确定提交任务吗？')){
          return;
        }

        /* 提交请求 */
        model.waiting = true;

        var data = $.extend({
            status: 2 //submit
        }, model.form.$model);
        data["id"] = data["id"] || Common.guid();
        data["reportUserMobile"] = data["contactsMobile"];
        Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/addTaskRecord",
            type: "POST",
            data: data,
            success: function(res) {
                Common["tip"].add({
                    text: "提交成功",
                    type: "success"
                });
                // 清空任务表单
                model.resetTask();
            },
            error: function() {
                Common["tip"].add({
                    text: "提交失败",
                    type: "error"
                });
            },
            complete: function() {
                model.waiting = false;

            }
        });

    }


    /*
     * ajax
     */
    // 获取管家信息(管家信息为房屋信息内容)
    var getManagerInfo_handle = null;

    function getManagerInfo_ajax(houseId) {
        if (getManagerInfo_handle) {
            getManagerInfo_handle.abort();
        }
        getManagerInfo_handle = Common.ajax({
            url: servicePath.house + "/v1/grid/" + houseId,
            type: "GET",
            success: function(res) {
                model["isout"] = res && res["outer"];
            },
            error: function() {

            },
            complete: function() {

            }
        });
    }
    // 获取任务信息
    function getTask_ajax(taskId) {
        if (!taskId) {
            return;
        }
        Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/taskdetail",
            type: "GET",
            data: {
                id: taskId
            },
            success: function(res) {

            },
            error: function() {

            },
            complete: function() {

            }
        })
    }
    // 获取公告
    var getNotice_handle = null;

    function getNotice_ajax(projectCode) {
        if (getNotice_handle) {
            getNotice_handle.abort();
        }
        model.notice.isLoading = true;

        getNotice_handle = Common.ajax({
            url: servicePath.task + "/v1/notices",
            type: "GET",
            data: {
                approveStatus: 2, //通过
                noticeStatus: 2, //发布状态
                projectCode: projectCode,
                curPage: 1,
                pageSize: 10
            },
            success: function(res) {
                model["notice"].data = res.list;
            },
            error: function() {

            },
            complete: function() {
                model.notice.isLoading = false;
            }

        })
    }

    /*
     *   exports
     */
    function clearData(data) {
        var d = data || {},
            m = model.form.$model;
        clearErrorTip();
        isClearDataLoop = true;

        model.form["id"] = ''; //任务id
        model.form["callNo"] = ''; //通话流水号callId
        model.form["content"] = ''; //任务描述
        model.form["taskdeal"] = '4'; //任务处理 - 项目处理
        model.form["source"] = '4'; // 4： 指挥中心
        model.form["levelType"] = '1'; // 1: 普通
        model.form["contactsName"] = ''; //处理时联系人姓名/称呼
        model.form["contactsMobile"] = ''; //处理时联系人手机
        model.form["projectId"] = ''; //项目ID
        model.form["projectName"] = ''; //项目名称
        model.form["projectCode"] = ''; //项目编码
        model.form["buildingId"] = "";
        model.form["buildingName"] = '';
        model.form["buildingCode"] = ''; //楼栋编码
        model.form["houseId"] = ''; //房屋ID
        model.form["houseName"] = ''; //房屋名称
        model.form["houseCode"] = ''; //房屋编码
        model.form["businessType"] = "";
        model.form["businessTypeFullText"] = "";
        model.form["businessTypeFullCode"] = "";
        model.form["appointmentStartTime"] = ''; //期望开始处理时间
        isClearDataLoop = false;
    }

    function getData() {
        return $.extend({}, model.form.$model);
    }

    function setData(data) {
        isClearDataLoop = true;
        clearErrorTip();
        for (var i in data) {
            if (model.form.hasOwnProperty(i)) {
                model.form[i] = data[i];
            }
        }
        isClearDataLoop = false;
    }

    window.vali_buildinginput = function(caller, eventType) {
        var value = Common.trim(caller.value);
        return validator_input("building", "楼栋", value);
    }
    window.vali_houseinput = function(caller, eventType) {
        var value = Common.trim(caller.value);
        return validator_input("house", "房屋", value);
    }

    function validator_input(type, typeName, value) {
        if (value && !model.form[type + "Id"] && !model.form[type + 'Code']) {
            return {
                isError: true,
                errorInfo: "请正确输入客户的" + typeName + "信息"
            }
        } else {
            return {
                isError: false
            }
        }
    }

    function bindEvent() {
        // 自动完成
        $("#taskinput_taskform .autocomplete").each(function() {
            var that = $(this);
            var target = that.attr("target");
            that.on("click", "li", function() {
                inputSelect(this, target);
            }).on("mouseenter", "li", function() {
                var li = $(this);
                li.addClass("on").siblings().removeClass("on");
                curAutoOption[target] = li;
            });

            $(document).on("click", function() {
                model[target + "_auto"].visible = false;
            });
        })
        // 公告列表
        $("#index_noticelist").on("click", "a", function() {
            var id = $(this).attr("data-id");
            avalon.router.redirect("/contentnotice/noticelist?noticeid=" + id);
        })
    }

    function init(param) {
        if (hasInit) {
            return;
        }

        hasInit = true;

        setTimeout(function() {
            bindEvent();
            jq_taskForm = $("#taskinput_taskform");
            jq_autoList["project"] = $("#project_auto_list");
            jq_autoList["building"] = $("#building_auto_list");
            jq_autoList["house"] = $("#house_auto_list");

            avalon.scan(null, model);

            if (avalon.vmodels.taskinputBusinessWidget) {
                var widget = avalon.vmodels.taskinputBusinessWidget;
                widget.$watch("businessType", function(newValue) {
                    model.form.businessType = newValue;
                    var arr = [];
                    widget.businessType0 && arr.push(widget.businessType0);
                    widget.businessType1 && arr.push(widget.businessType1);
                    widget.businessType2 && arr.push(widget.businessType2);
                    model.form.businessTypeFullCode = arr.join(".");
                })
            }
            model.form.$watch("businessTypeFullCode", function(newValue) {
                var widget = avalon.vmodels.taskinputBusinessWidget;
                var arr = (newValue || '').split(".");
                if (widget) {
                    widget.businessType0 = arr[0];
                    widget.businessType1 = arr[1];
                    widget.businessType2 = arr[2];
                    widget.businessType = arr[2] || arr[1] || arr[0];
                }
            });
        });
    }

    function view(param) {
        if (param && param.from == "taskquery") {
            var data = Common["cache"].get("taskqueryData");
            if (!data) {
                return;
            }
            setData({
                id: '', //任务id
                callNo: '', //通话流水号callId
                content: '', //任务描述
                taskdeal: '4', //任务处理
                source: '4', // 4： 指挥中心
                levelType: '1', // 1: 普通

                contactsName: data["fullName"] || '', //处理时联系人姓名/称呼
                contactsMobile: data["mainMobile"] || '', //处理时联系人手机

                projectId: data["projectId"] || '', //项目ID
                projectName: data["projectName"] || '', //项目名称
                projectCode: data["projectCode"] || '', //项目编码

                buildingId: data["buildingId"] || "",
                buildingName: data["buildingName"] || '',
                buildingCode: data["buildingCode"] || '', //楼栋编码

                houseId: data["houseId"] || '', //房屋ID
                houseName: data["houseName"] || '', //房屋名称
                houseCode: data["houseCode"] || '', //房屋编码
                businessType: "",
                businessTypeFullText: "",
                businessTypeFullCode: "",
                appointmentStartTime: "" //期望开始处理时间
            });
        }
    }


    function active(param) {
        init(param);
        setTimeout(function() {
            view(param);
        })
    }

    function inactive() {
        getCustomer_handle && getCustomer_handle.abort();
        getNotice_handle && getNotice_handle.abort();
        getHouse_handle && getHouse_handle.abort();
        getBuilding_handle && getBuilding_handle.abort();
        getProject_handle && getProject_handle.abort();
        getCallReason_handle && getCallReason_handle.abort();
        getCallReason_handle && getCallReason_handle.abort();
        getManagerInfo_handle && getManagerInfo_handle.abort();
    }
    return {
        active: active,
        setData: setData,
        clearData: clearData
    };
});
