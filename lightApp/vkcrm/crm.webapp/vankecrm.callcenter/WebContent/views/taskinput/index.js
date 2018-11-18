define(['validate', 'widget_businessType'], function(validate, widget_businessType) {
    var SIMPLEMODEL = window["SIMPLEMODEL"] || false;
    var hasInit = false,
        isClearDataLoop = false,
        isTaskModel = false,
        currentAgentId = '',
        activeStartTime = '';
    var jq_taskForm = null,
        jq_custDialog = null,
        jq_relaDialog = null,
        jq_autoList = {
            "project": null,
            "building": null,
            "house": null
        }
    var df_form_source = SIMPLEMODEL ? "6" : "5",
        df_form_taskdeal = "3",
        df_form_levelType = "1";
    var callCollection = [];

    var model = avalon.define({
        $id: "taskinput",
        // 当前通话录音
        call: {
            id: '',
            no: '',
            number: '',
            startTime: ''
        },
        // 补录任务 通话开始时间 － 获取之前通话时间，通过参数param获取
        addCall: {
          addCallTime: '',
          fullName: '',
          userMoblie: ''
        },
        // 记录全局通话时间
        callTime: '',
        simpleModel: SIMPLEMODEL,
        draftId: '',
        waiting: false,
        showSidebar: function() {
            if (SIMPLEMODEL) {
                if (avalon.vmodels.contentnewtask) {
                    avalon.vmodels.contentnewtask.sidebarVisible = true;
                }
            } else {
                if (avalon.vmodels.contenttask) {
                    avalon.vmodels.contenttask.sidebarVisible = true;
                }
            }
        },
        newTaskHidden: {
            get: function() {
                return !this.call.id;
            }
        },
        draftList: [],
        /* 任务表单 */
        form: {
            id: '', //任务id
            // taskNo: '', //任务流水号
            callRecordId: '', //通话记录流水号callId
            callNo: '',
            title: '', //任务标题
            content: '', //任务描述
            source: '',
            levelType: '',
            reportUserMobile: '', //任务来源(call in)人的手机号
            contactsUserId: '', //联系人ID
            contactsName: '', //处理时联系人姓名/称呼
            contactsMobile: '', //处理时联系人手机
            projectId: '', //项目ID
            projectName: '', //项目名称
            projectCode: '', //项目编码
            reasons: [], //呼叫采集
            buildingId: "",
            buildingName: '',
            buildingCode: '', //楼栋编码
            fullName: "", //接听人
            callTime: "", //呼叫时间
            houseId: '', //房屋ID
            houseName: '', //房屋名称
            houseCode: '', //房屋编码
            businessType: "",
            businessTypeFullText: "",
            businessTypeFullCode: "",
            taskdeal: "", //任务处理
            appointmentStartTime: '', //期望开始处理时间
            hasApprove: false //是否是大V
        },
        /*管家信息*/
        managerName: "", //管家名
        managerPhone: "", //管家联系方法
        deliverTime: "", //交付时间
        isout: false, //是否外盘
        /* 客户信息 */
        cust: {
            identity: [],
            sex: "",
            relationType: "",
            houseCustomerRelationType: "",
            hobbies: []
        },
        custinfo: {
            fullName: "",
            certificateTypeText: "",
            certificateId: "",
            sexText: "",
            birthday: "",
            mainMobile: "",
            homeTel: "",
            standbyMobile: "",
            customerTypeText: ""
        },
        /* 客户信息选项 */
        custVisible: false,
        custShow: function() {
            model.custVisible = !model.custVisible;
        },
        sexOptions: Config.keys && Config.keys["CustomerSex"] || [],
        relationTypeOptions: Config.keys && Config.keys["CustomerRelationType"] || [],
        houseCustomerRelationTypeOptions: Config.keys && Config.keys["HouseCustomerRelationType"] || [],
        identityOptions: Config.keys && Config.keys["CustomerIdentity"] || [],
        hobbyOptions: Config.keys && Config.keys["CustomerHobbies"] || [],
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
        /* 原因采集 */
        reasonList: Config.callReason && Config.callReason.callin || [],
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
        houseValidator: {
            get: function() {
                if (this.cust.houseCustomerRelationType) {
                    return "required{请正确输入客户所属房屋}"
                } else {
                    return "";
                }
            }
        },
        callout: function(number) {
            // 呼出
            avalon.vmodels.callctrl.btnCallout.dnis = number;
            avalon.vmodels.callctrl.btnCallout.change(model.form.id)
        },
        autoinput: autoinput,
        // autoblur: function() {
        //     var target = this.getAttribute("data-target");
        //     setTimeout(function() {
        //         model[target + '_auto'].visible = false;
        //     }, 200);
        // },
        saveDraft: saveDraft,
        submitTask: submitTask,
        eventQueryAuto: function(target) {
            $(this).prev().prev().prev().focus();
            inputChange(target, model.form[target + "Name"], true);
            // $(this).blur();
            if (event) {
                event.stopPropagation && event.stopPropagation();
                event.preventDefault && event.preventDefault();
                event.cancelBubble = true;
                event.returnValue = false;
            }
        },
        eventNewTask: function() {
            draftBarList.add({
                callId: model.call.id,
                callNo: model.call.no,
                taskType: 'add',  // cp增加一个参数，只要点击新增任务操作即为新增任务，补录任务时不传当前参数即可
                reportUserMobile: model.call.number,
                contactsMobile: model.call.number
            });
        },
        eventShowRelation: function() {
            jq_relaDialog.modal();
            getRelationInfo_ajax(1);
        },
        eventShowCustomer: function(has) {
            jq_custDialog.modal();
            getUserBaseInfo_ajax(model.form.contactsUserId, model.form.hasApprove);
        },
        eventHideRelation: function() {
            jq_relaDialog.modal("hide");
        },
        eventHideCustomer: function() {
            jq_custDialog.modal("hide");
        }
    });

    avalon.filters.pasestatus = function(status) {
        var statusTo = '';
        switch (status) {
            case "0":
                statusTo = "代收登记";
                break;
            case "1":
                statusTo = "代收确认";
                break;
            case "2":
                statusTo = "业主签收";
                break;
            case "3":
                statusTo = "业主拒收";
                break;
            case "4":
                statusTo = "退回快递公司";
                break;
            case "5":
                statusTo = "代发登记";
                break;
            case "6":
                statusTo = "代发确认";
                break;
            case "7":
                statusTo = "快递公司取走";
                break;
            case "8":
                statusTo = "快递公司拒收";
                break;
            case "9":
                statusTo = "业主取回";
                break;
        }
        return statusTo;
    };

    var relationModel = avalon.define({
        $id: "taskinput_relation",
        type: "propertyFee",
        change: function(type) {
            relationModel.type = type;
            getRelationInfo_ajax(1);
        },
        loading: false,
        card: [],
        propertyFee: [],
        parcel: []
    })

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
    model.call.$watch("id", function(newValue, oldValue) {
        if (SIMPLEMODEL) {
            if (avalon.vmodels.contentnewtask) {
                avalon.vmodels.contentnewtask.sidebarVisible = model.call.id == newValue;
            }
        } else {
            if (avalon.vmodels.contenttask) {
                avalon.vmodels.contenttask.sidebarVisible = model.call.id == newValue;
            }
        }
    });
    /*model.form.$watch("contactsName", function(newValue, oldValue) {
     if (!isClearDataLoop) {
     model.form.contactsUserId = '';
     }
     });*/
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
        model["managerName"] = ""; //管家名
        model["managerPhone"] = ""; //管家联系方法
        model["deliverTime"] = ""; //交付时间
        model["isout"] = false; //是否外盘
        if (value) {
            // 获取管家
            getManagerInfo_ajax(value);
        }
    });
    /*
     * 草稿列表
     */
    function eventSelectDraft(newId) {
        if (!newId) {
            return;
        }
        var oldId = model.draftId;
        if (oldId !== newId) {
            var oldData = getData(),
                newData = draftBarList.get(newId);
            draftBarList.set(oldId, oldData);
            model.draftId = newId;
            updateFormVal(newData);
        }
    }
    var draftBarList = (function() {
        var draftHash = {};

        function set(id, data) {
            if (id) {
                draftHash[id] = data;
            }
        }

        function get(id) {
            return draftHash[id];
        }

        function add(data, opts) {
            var opt = opts || {},
                guid = opt.id || Common.guid(); //任务id
            // 根据id判断是否新任务
            if (!opt.id) {
                // 新增任务时，设置表单默认值
                data.taskdeal = df_form_taskdeal;
                data.source = df_form_source; //任务来源 - 呼叫中心-客户来电
                data.levelType = df_form_levelType; //任务优先级 - 普通

                //根据taskType判断是否补录
                if(data.taskType && data.taskType != ''){
                    // 记录接电话日志
                    Common.log("receive", {
                        taskId: guid,
                        //callTime: model.call.startTime,
                        callTime: model.callTime,
                        phoneNo: data.reportUserMobile
                    });
                } else {
                     Common.log("supplementRecive", {
                         taskId: guid,
                         //fullName: data["fullName"],
                         fullName: model.addCall.fullName,
                         //callTime: data["callTime"],
                         callTime: model.addCall.addCallTime,
                         // phoneNo: data["reportUserMobile"]
                         phoneNo: model.addCall.userMoblie
                     });
                }

                /*
                //根据callTime判断是否补录
                if(model.addCall.addCallTime != ''){
                //if (data["callTime"]) {
                    // 记录 任务补录接听电话 日志
                    Common.log("supplementRecive", {
                        taskId: guid,
                        //fullName: data["fullName"],
                        fullName: model.addCall.fullName,
                        //callTime: data["callTime"],
                        callTime: model.addCall.addCallTime,
                        // phoneNo: data["reportUserMobile"]
                        phoneNo: model.addCall.userMoblie
                    })
                } else {
                    // 记录接电话日志
                    Common.log("receive", {
                        taskId: guid,
                        callTime: model.call.startTime,
                        phoneNo: data.reportUserMobile
                    })
                }*/
            };
            data.id = guid;
            if (!draftHash[guid]) {
                draftHash[guid] = data;
                model.draftList.unshift({
                    id: guid,
                    date: opt.createTime || model.call.startTime,
                    isDraft: !!opt.id
                });
            }
            eventSelectDraft(guid);
        };

        function del(id) {
            if (draftHash[id]) {
                delete draftHash[id];
                var arr = model.draftList.$model;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]["id"] == id) {
                        model.draftList.splice(i, 1);
                        break;
                    }
                }
                if (model.draftId == id && model.draftList.length) {
                    model.draftId = model.draftList[0].id;
                    // 加载该单的数据
                    var newData = draftBarList.get(model.draftId);
                    updateFormVal(newData);
                }
            }
        }
        return {
            set: set,
            get: get,
            add: add,
            del: del
        }
    })();
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
                url: servicePath.house + "/v1/projects",
                type: "GET",
                data: {
                    projectName: projectName
                },
                success: function(res) {
                    model.project_auto.list = res;
                },
                error: function() {},
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
                error: function() {},
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
                error: function() {},
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
    // 保存草稿
    function saveDraft() {
        model.waiting = true;
        var draftId = model.draftId;
        Common.tip.add({
            text: "正在保存草稿",
            type: "info"
        });
        addTaskRecord_ajax(false).always(function() {
            model.waiting = false;
        }).success(function() {
            Common.tip.add({
                text: "保存草稿成功",
                type: "success"
            });
            draftBarList.del(draftId);
            if (model.simpleModel) {
                setTimeout(function() {
                    window.opener = null;
                    window.open(' ', '_self', ' ');
                    window.close();
                }, 1000);
            }
        }).error(function() {
            Common.tip.add({
                text: "保存草稿失败",
                type: "error"
            });
        })
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
        /* 提交请求 */
        model.waiting = true;
        addTaskRecord_ajax(true).done(function(res) {
            if (res["success"]) {
                ajaxFunc.addCallReason();
                ajaxFunc.updateCustomer(draftId);
                Common["tip"].add({
                    text: "提交成功",
                    type: "success"
                });
                if (model.simpleModel) {
                    setTimeout(function() {
                        window.opener = null;
                        window.open(' ', '_self', ' ');
                        window.close();
                    }, 1000);
                }
            } else {
                Common["tip"].add({
                    text: "提交失败",
                    type: "error"
                });
            }
        }).fail(function() {
            Common["tip"].add({
                text: "提交失败",
                type: "error"
            });
        }).always(function() {
            model.waiting = false;
        });
        return false;
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
                model["managerName"] = res && res["managerName"];
                model["managerPhone"] = res && res["mobilePhone"];
                model["deliverTime"] = res && res["deliverTime"];
                model["isout"] = res && res["outer"];
            },
            error: function() {},
            complete: function() {}
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
            success: function(res) {},
            error: function() {},
            complete: function() {}
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
            error: function() {},
            complete: function() {
                model.notice.isLoading = false;
            }
        })
    }
    // 获取临时客户信息
    var getCustomer_handle = null;

    function getCustomer_ajax(customerId) {
        if (getCustomer_handle) {
            getCustomer_handle = null;
        }
        getCustomer_handle = Common.ajax({
            url: servicePath.customer + "/v1/callcenter/customer/update",
            data: {
                customerId: customerId
            },
            success: function(res) {
                model.cust["sex"] = res["customerSex"]
                model.cust["relationType"] = res["customerRelationType"]
                model.cust["houseCustomerRelationType"] = res["houseCustomerRelationType"]
            },
            error: function() {},
            complete: function() {}
        })
    }
    var getUserBaseInfo_handle = null;

    function getUserBaseInfo_ajax(customerId, hasApprove) {
        if (getUserBaseInfo_handle) {
            getUserBaseInfo_handle.abort();
        }
        var SUFFIX = hasApprove ? "/info" : "/temp/info"; //不带V的人调用的url需要加temp
        getUserBaseInfo_handle = Common.ajax({
            url: servicePath.customer + "/v1/customer/" + customerId + SUFFIX,
            type: "GET",
            success: function(res) {
                model.custinfo["fullName"] = res.basic["fullName"] || '';
                model.custinfo["certificateTypeText"] = res.basic["certificateTypeText"] || '';
                model.custinfo["certificateId"] = res.basic["certificateId"] || '';
                model.custinfo["sexText"] = res.basic["sexText"] || '';
                model.custinfo["birthday"] = res.details && res.details != null ? res.details["birthday"] || '' : '';
                model.custinfo["mainMobile"] = res.basic["mainMobile"] || '';
                model.custinfo["homeTel"] = res.basic["homeTel"] || '';
                model.custinfo["standbyMobile"] = res.basic["standbyMobile"] || '';
                model.custinfo["customerTypeText"] = res.basic["customerTypeText"] || '';
            },
            error: function() {},
            complete: function() {}
        })
    }
    // 新增任务
    function addTaskRecord_ajax(isSubmit) {
        var data = $.extend({
            status: isSubmit ? 2 : 1,
            jobNo: currentAgentId
        }, model.form.$model);
        if (isSubmit) {
            // 任务处理
            data["callRecordId"] = model.call.id;
            data["callNo"] = model.call.no;
            data["processingWay"] = model.form.taskdeal;
        }
        return Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/addTaskRecord",
            type: "POST",
            data: data,
            success: function(res) {
                // 通过calltime来判断是否来自话务查询的 补录任务,提交时,保存日志
                if (isSubmit && data["callTime"]) {
                    // 记录 任务补录 日志
                    Common.log("supplement", {
                        taskId: data.id,
                        taskNo: res,
                        source: $("#taskinput_source option:selected").text(),
                        processingWay: Config.objs.ProcessingWay[data["processingWay"]]
                    });
                } else {
                    Common.log(isSubmit ? "submitTask" : "saveDraft", isSubmit ? {
                        taskId: data.id,
                        taskNo: res,
                        source: $("#taskinput_source option:selected").text(),
                        processingWay: Config.objs.ProcessingWay[data["processingWay"]]
                    } : {
                        taskId: data.id
                    });
                }
                Common.event.trigger("taskinput_tasksave");
            },
            error: function() {},
            complete: function() {}
        })
    }

    var ajaxFunc = {
            addCallReason: function(opt) {
                var reasons = model.form.reasons.join(",");
                if (!reasons) {
                    return $.Deferred().resolve([{
                        success: true
                    }]);
                }
                return Common.ajax({
                    url: servicePath.tel + "/v1/telrecord/reason",
                    type: "POST",
                    data: {
                        callId: model.call.id,
                        reasonIds: reasons
                    },
                    success: function() {},
                    error: function() {},
                    complete: function() {}
                })
            },
            // 新增or修改临时客户
            updateCustomer: function(draftId) {
                var d = {};
                if (model.form["contactsUserId"]) {
                    d["id"] = model.form["contactsUserId"];
                }
                if (model.form["contactsName"]) {
                    d["fullName"] = model.form["contactsName"];
                }
                if (model.form["contactsMobile"]) {
                    d["mainMobile"] = model.form["contactsMobile"];
                }
                if (model.form["projectId"]) {
                    d["projectId"] = model.form["projectId"];
                }
                if (model.form["houseId"]) {
                    d["houseId"] = model.form["houseId"]
                }
                if (model.cust["houseCustomerRelationType"]) {
                    d["hcRelationTypes"] = model.cust["houseCustomerRelationType"]
                }
                if (model.cust["sex"]) {
                    d["sex"] = model.cust["sex"]
                }
                if (model.cust["hobbies"].length) {
                    d["contentIds"] = '';
                    d["contentIds"] = model.cust["hobbies"].sort().join(",")
                }
                if (model.cust["identity"].length) {
                    d["identity"]='';
                    d["identity"] = model.cust["identity"].sort().join(",")
                }
                return Common.ajax({
                    url: servicePath.customer + "/v1/callcenter/customer/update",
                    type: "POST",
                    data: d,
                    success: function() {
                        var customerInfo = avalon.vmodels['sidebar'].customerInfo;
                        var editLog=true;
                        //判断客户信息是否进行了修改

                        d["contentIds"]=d["contentIds"]?d["contentIds"]:'';
                        d["identity"]=d["identity"]?d["identity"]:'';
                        if(customerInfo.hobbies==d["contentIds"]&&
                            customerInfo.identities== d["identity"]&&
                            customerInfo.fullName==d["fullName"] &&
                            customerInfo.sex==d["sex"]&&
                            customerInfo.mainMobile==d["mainMobile"]){
                            editLog=false;
                        }
                        // 新增修改客户日志
                        if(editLog){
                            Common.log(d.id ? "editCust" : "addCust", {
                                taskId: model.form.id,
                                fullName: d["fullName"],
                                mainMobile: d["mainMobile"]
                            });
                        }
                        // 移除草稿，如果这里在ajax请求时，出现时差，以下两种方案处理
                        // 1、可对一下句代码进行延时执行；
                        // 2、对Common.log方法进行增加一个回调（推荐）
                        setTimeout(function() {
                            draftBarList.del(draftId);
                        }, 300);
                    },
                    error: function() {},
                    complete: function() {}
                })
            }
        }
        // 订阅关系
    var getRelationInfo_handle = null;
    var relationPager = null;

    function getRelationInfo_ajax(pageIndex) {
        if (getRelationInfo_handle) {
            getRelationInfo_handle.abort();
        };
        var type = relationModel.type;
        relationModel[type] = [];
        relationModel["loading"] = true;
        var url = {
            propertyFee: servicePath.house + "/v1/subscription/propertyFee",
            parcel: servicePath.house + "/v1/subscription/parcel",
            card: servicePath.house + "/v1/subscription/card"
        }
        getRelationInfo_handle = Common.ajax({
            url: url[type],
            type: "GET",
            data: {
                houseId: model.form.houseId,
                curPage: pageIndex,
                pageSize: 5
            },
            success: function(res) {
                if (res) {
                    if (type == "card") {
                        relationModel[type] = res.data && res.data.list || [];
                        relationPager.render({
                            curpage: pageIndex,
                            pagesize: 10,
                            totalpage: res.data.totalPage || 1,
                            totalsize: res.data.totalCount || 0
                        })
                    } else if (type == "propertyFee") {
                        var list = res.details;
                        if (list && list.bis) {
                            var _list_ = [];
                            for (var i = 0; i < list.bis.length; i++) {
                                var item = list.bis[i];
                                for (var j = 0; j < item.costs.length; j++) {
                                    var obj = {
                                        mth: item.mth || '',
                                        expenses: item.costs[j].expenses || '',
                                        paid: item.costs[j].paid || '',
                                        expenseName: item.costs[j].expenseName || '',
                                        status: item.costs[j].status == "1" ? "已缴" : "未缴"
                                    }
                                    _list_.push(obj);
                                }
                            }
                            relationModel[type] = _list_;
                        }
                    } else if (type == "parcel") {
                        relationModel[type] = res.list || [];
                        /* 更新分页控件 */
                        var pinfo = res.pagination;
                        relationPager.render({
                            curpage: pinfo.curPage,
                            pagesize: pinfo.pageSize,
                            totalpage: pinfo.totalPage,
                            totalsize: pinfo.totalSize
                        });
                    }
                }
            },
            error: function() {},
            complete: function() {
                relationModel["loading"] = false;
            }
        })
    }

    /*
     *   exports
     */
    function updateFormVal(data, cust) {
        var d = data || {},
            m = model.form.$model;
        clearErrorTip();
        isClearDataLoop = true;
        // if (data["reasons"]) {
        //     debugger;
        //     model["reasons"] = data["reasons"];
        //     delete data["reasons"]
        // }

        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                model.form[i] = d[i];
            } else {
                model.form[i] = '';
            }
        }
        var c = cust || {},
            s = model.cust.$model;
        for (var j in s) {
            if (c.hasOwnProperty(j)) {
                model.cust[j] = c[j];
            } else {
                model.cust[j] = '';
            }
        }

        // 维护更新call对象 - cp
        model.call.no = m.callNo;
        model.call.number = m.reportUserMobile;

        if (m.callRecordId != '') model.call.id = m.callRecordId;
        else m.callRecordId = model.call.id;

        isClearDataLoop = false;
    }

    function getData() {
        return $.extend({}, model.form.$model, {
            "reasons": model.form["reasons"].slice()
                // "businessTypeFullCode": model.form["businessTypeFullCode"],
                // "businessType": model.form["businessType"]
        });
    }

    function setData(data) {
        isClearDataLoop = true;
        for (var i in data) {
            if (model.form.hasOwnProperty(i)) {
                model.form[i] = data[i];
            }
        }
        isClearDataLoop = false;
    }
    function setDataCust(data) {
        isClearDataLoop = true;
        for (var i in data) {
            if (model.cust.hasOwnProperty(i)) {
                model.cust[i] = data[i];
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
                })
            })
            // 草稿列表
        $("#draftBarList").on("click", "i", function() {
                var id = $(this).parent().attr("data-id");
                if (window.confirm(Config.tips.closeDraft)) {
                    draftBarList.del(id);
                }
                return false;
            }).on("click", ".task-tag", function() {
                var newId = $(this).attr("data-id");
                eventSelectDraft(newId);
                return false;
            })
            // 公告列表
        $("#index_noticelist").on("click", "a", function() {
                var id = $(this).attr("data-id");
                if (!model.simpleModel) {
                    avalon.router.redirect("/contenttask/tasknotice?noticeid=" + id);
                } else {
                    avalon.router.redirect("/contentnewtask/tasknotice?noticeid=" + id);
                }
                // tasknotice.active();
                // tasknotice.view({
                // noticeId: id
                // });
            })
            //保存草稿，提交任务
        $("#saveDraft").on("click", function() {
            saveDraft();
        });
        $("#submitTask").on("click", function() {
            submitTask();
        });
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
            jq_custDialog = $("#taskinput_userdialog");
            jq_relaDialog = $("#taskinput_relationdialog");
            relationPager = new Pagination({
                selector: "#taskinput_relation_pager",
                onchange: function(pageInfo) {
                    getRelationInfo_ajax(pageInfo.curpage)
                }
            })
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
        })
    }

    function active(param) {
        init(param);
        setTimeout(function() {
            view(param);
        })
    }

    function view(param) {
        if (param && param.callRecordId && param.callno && param.callnumber) {
            model.call.id = param.callRecordId;
            model.call.no = param.callno;
            draftBarList.add({
                callId: param.callRecordId,
                callNo: param.callno,
                callTime: param.calltime ? decodeURI(param.calltime) : null,
                fullName: Config.local.userName,
                reportUserMobile: param.callnumber,
                contactsMobile: param.callnumber
            }, {
                createTime: decodeURI(param.calltime)
            });
            //  更新补录任务时的通话开始时间
            model.addCall.addCallTime = param.calltime ? decodeURI(param.calltime) : null;
            model.addCall.fullName = Config.local.userName;
            model.addCall.userMoblie = param.callnumber;
            //接收页面传值，赋值
            setData(param);
        }
        if (param && param.todo == "setdata") {
            var data = Common["cache"].get("taskinput");
            data && setData({
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
                houseCode: data["houseCode"] || '' //房屋编码
            });
        }
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
    /* softphone event */
    if (window.SoftPhone) {
        SoftPhone.addEventListener("EvtDidLogin", function(strEvtMsg, param, eventQueue, callType) {
            // 登录
            currentAgentId = SoftPhone.objectX.AgentId;
        });
        SoftPhone.addEventListener("EvtDidLogout", function(strEvtMsg, param, eventQueue, callType) {
            //
        });
        SoftPhone.addEventListener("EvtDidActive", function(strEvtMsg, param, eventQueue, callType) {
            // 接听
            var callRecordId = avalon.vmodels.callctrl.$model.callRecordId;
            model.call.id = callRecordId;
            var prevStatue = eventQueue[eventQueue.length - 2],
                phoneNo = param["otherDN"];
            // 新增任务时记录时间
            if (prevStatue == 'EvtDidAlerting' && model.call.id) {
                avalon.router.redirect("/contenttask/taskinput");
                draftBarList.add({
                    callId: model.call.id,
                    callNo: model.call.no,
                    taskType: 'add', // 新增任务
                    reportUserMobile: model.call.number,
                    contactsMobile: model.call.number
                });
            }

            model.form.callRecordId = callRecordId; // 维护form对象下的callRecordId - cp
            //model.addCall.addCallTime = '';
            //model.addCall.fullName = '';
            //model.addCall.userMoblie = '';

            if (prevStatue == 'EvtDidAlerting' || prevStatue == 'EvtDidDial') {
                activeStartTime = Common.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
            }
        });
        SoftPhone.addEventListener("EvtDidAlerting", function() {
            // 振铃
            model.call.number = '';
            model.call.id = '';
        });
        SoftPhone.addEventListener("EvtDidDial", function() {
            // 外呼
            model.call.number = '';
            model.call.id = '';
        });
        // 弹屏
        SoftPhone.addEventListener("EvtScreenPopDataArrival", function(strEvtMsg, param, eventQueue, callType) {
            // 呼入
            model.call.startTime = Common.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss")
            model.call.no = param["callid"] || param["callId"];
            model.call.number = param["otherDN"];
            model.callTime = Common.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");

        });
    }
    return {
        active: active,
        draftBarList: draftBarList,
        setData: setData,
        setDataCust:setDataCust,
        updateFormVal: updateFormVal
    };
});
