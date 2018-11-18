define([], function() {
    var hasInit = false;
    var model = avalon.define({
        $id: "quesquery",
        form: {
            fromTime: "",
            toTime: "",
            callNumber: "",
            telephonist: "",
            tapeCode: "",
            // 项目
            projectId: "",
            projectName: "",
            projectCode: "",
            // 楼栋
            buildingId: "",
            buildingName: "",
            buildingCode: "",
            // 房屋
            houseId: "",
            houseName: "",
            houseCode: "",
            //通话时长
            fromDuration: "",
            toDuration: "",
            //问卷名称
            questionnaireName: "",
            //异常原因
            answerAbnormal: "",
            //客户异常
            anomalousErrorCategory: "",
            //是否已完成调查
            isComplete: ""
        },
        anomalousErrorCategory: [],
        answerAbnormal: [],
        project_auto: {
            list: [],
            isout: true,
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
        autoinput: function(target) {
            var name = Common.trim(this.value || '');
            model.form[target + "Name"] = name;
            model.form[target + "Code"] = '';
            model.form[target + "Id"] = '';
            if (name === '') {
                model[target + "_auto"].visible = false;
                model[target + "_auto"].loading = false;
                return;
            }
            autofunc["get" + target + "_ajax"](name);
        },
        eventQueryList: function() {
            getCallRecord_ajax();
        },
        eventQueryReset: function() {
            model.form.fromTime = "";
            model.form.toTime = "";
            model.form.callNumber = "";
            model.form.telephonist = "";
            model.form.tapeCode = "";
            // 项目
            model.form.projectId = "";
            model.form.projectName = "";
            model.form.projectCode = "";
            // 楼栋
            model.form.buildingId = "";
            model.form.buildingName = "";
            model.form.buildingCode = "";
            // 房屋
            model.form.houseId = "";
            model.form.houseName = "";
            model.form.houseCode = "";
            //通话时长
            model.form.fromDuration = "";
            model.form.toDuration = "";
            //问卷名称
            model.form.questionnaireName = "";
            //异常原因
            model.form.answerAbnormal = "";
            //客户异常
            model.form.anomalousErrorCategory = "";
            //是否已完成调查
            model.form.isComplete = "";
        },
        onAction: function() {
            var that = avalon(this),
                name = that.attr("name");
            switch (name) {
                case "record":
                    {
                        var recordId = that.attr("data-record");
                        getRecordUrl_ajax(recordId);
                        break;
                    }
                case "newTask":
                    {
                        var callId = that.attr("data-id"),
                            callnumber = that.attr("data-number"),
                            projectId = that.attr("data-projectId"),
                            projectName = that.attr("data-projectName"),
                            projectCode = that.attr("data-projectCode"),
                            houseId = that.attr("data-houseId"),
                            houseName = that.attr("data-houseName"),
                            houseCode = that.attr("data-houseCode"),
                            customerName = that.attr("data-customerName"),
                            callRecordId = that.attr("data-callRecordId");
                        openNewTask(callId, callRecordId, callnumber, houseId, houseCode, houseName, projectId, projectName, projectCode, customerName);
                        break;
                    }
                case "viewAnswer":
                    {
                        var questionnaireId = that.attr("data-questionnaireId"),
                            answerId = that.attr("data-answerId");
                        viewAnswer(questionnaireId, answerId);
                        break;
                    }
            }
        },
        rendered: function() {
            var customerName = model.questionAnswerList[0].customerName;
            if (customerName) {
                $("#cusName").text(customerName);
            }
        },
        questionAnswerList: [],
        isLoadingQuestionAndAnswer: false,
        noQuestionAndAnswer: false,
        list: [],
        isLoading: false,
        imgPath: window.path["staticWeb"] + "/img/sf_icon.png",
    });

    /**
     * ajax
     */
    function getRecordUrl_ajax(recordId) {
        Common.tip.add({
            type: "info",
            text: "正在加载录音[" + recordId + "]"
        })
        Common.ajax({
            url: Config.ajaxPaths["getRecordFile"] + recordId + "/listen",
            type: "GET",
            success: function(res) {
                window.open(res);
            },
            error: function() {
                Common.tip.add({
                    type: "error",
                    text: "加载录音[" + recordId + "]失败"
                })
            },
            complete: function() {}
        })
    }

    var getCallRecord_handle = null;

    function getCallRecord_ajax(curPage) {
        model.isLoading = true;
        if (getCallRecord_handle) {
            getCallRecord_handle.abort();
        }
        getCallRecord_handle = Common.ajax({
            url: servicePath.questionnaire + "/v1/callrecord/get",
            type: "POST",
            data: {
                fromTime: model.form.fromTime,
                toTime: model.form.toTime,
                callNumber: model.form.callNumber,
                telephonist: model.form.telephonist,
                tapeCode: model.form.tapeCode,
                curPage: curPage || 1,
                pageSize: 10,
                // 项目
                projectId: model.form.projectId,
                projectName: model.form.projectName,
                projectCode: model.form.projectCode,
                // 楼栋
                buildingId: model.form.buildingId,
                buildingName: model.form.buildingName,
                buildingCode: model.form.buildingCode,
                // 房屋
                houseId: model.form.houseId,
                houseName: model.form.houseName,
                houseCode: model.form.houseCode,
                //通话时长
                fromDuration: model.form.fromDuration,
                toDuration: model.form.toDuration,
                //问卷名称
                questionnaireName: model.form.questionnaireName,
                //异常原因
                answerAbnormal: model.form.answerAbnormal,
                //客户异常
                anomalousErrorCategory: model.form.anomalousErrorCategory,
                //是否已完成调查
                isComplete: model.form.isComplete,
            },
            success: function(res) {
                //model.list = [];
                if (res) {
                    model.list = res.list;
                    var pi = res.pagination;
                    listPager.render({
                        curpage: pi.curPage,
                        totalpage: pi.totalPage
                    })
                }
            },
            error: function() {
                model.list = [];
            },
            complete: function() {
                model.isLoading = false;
            }
        })
    }

    /*
     * base
     */

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

    var ajaxGetDictonariesHandle = null;

    function ajaxGetDictonaries() {
        if (ajaxGetDictonariesHandle != null) {
            ajaxGetDictonariesHandle.abort();
        }
        ajaxGetDictonariesHandle = Common.ajax({
            url: servicePath.questionnaire + "/v1/batch/dict/AnswerAbnormalCode,AnomalousErrorCategory/items",
            type: "GET",
            success: function(res) {
                model.answerAbnormal = res["AnswerAbnormalCode"];
                model.anomalousErrorCategory = res["AnomalousErrorCategory"];
            },
            error: function(error) {
                console.log(error);
            },
            complete: function() {}
        })
    }

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = false;
        avalon.scan(null, model);
        // DOM渲染后执行，如事件绑定
        bindEvent();
        ajaxGetDictonaries();
    }

    function active() {
        init();
    }

    var listPager = null;

    function openNewTask(callId, callRecordId, callNumber, houseId, houseCode, houseName, projectId, projectName, projectCode, customerName) {
        var param = [];
        param.push('callnumber=' + callNumber);
        param.push('callRecordId=' + callRecordId);
        param.push('callno=' + callId);
        param.push('houseId=' + houseId);
        param.push('houseName=' + houseName);
        param.push('houseCode=' + houseCode);
        param.push('projectId=' + projectId);
        param.push('projectName=' + projectName);
        param.push('projectCode=' + projectCode);
        param.push('contactsName=' + customerName);
        param.push('calltime=' + Common["formatDate"](new Date(), "yyyy-MM-dd HH:mm:ss"));
        var url = Config.local.callCenterNewTaskPath + "?" + param.join("&");
        window.open(url);
    }

    function viewAnswer(questionnaireId, answerId) {
        //alert("问卷ID:" + questionnaireId + " 答案ID:" + answerId);
        console.log("问卷ID:" + questionnaireId + " 答案ID:" + answerId);
        //TODO:根据传递的问卷ID，答案ID，通过Ajax请求，获取相关信息，展示问卷的答案列表.
        model.isLoadingQuestionAndAnswer = true;
        model.noQuestionAndAnswer = false;
        $("#modal_question").modal("show");
        Common.ajax({
            url: servicePath.questionnaire + "/v1/questionnaires/" + questionnaireId + "/answers/" + answerId,
            type: "GET",
            success: function(res) {
                if (res.length <= 0) {
                    model.noQuestionAndAnswer = true;
                }
                model.questionAnswerList = res;
            },
            error: function(error) {
                console.log(error);
            },
            complete: function() {
                model.isLoadingQuestionAndAnswer = false;
            }
        })
    }

    function bindEvent() {
        listPager = new Pagination({
            selector: "#quesquery_pager",
            onchange: function(pi) {
                getCallRecord_ajax(pi.curpage)
            }
        });
        // $("#quesquery_tbody").on("click", "a", function () {
        //     var that = $(this),
        //         name = that.attr("name");
        //     switch (name) {
        //         case "record":
        //         {
        //             var recordId = that.attr("data-record");
        //             getRecordUrl_ajax(recordId);
        //             break;
        //         }
        //         case "newTask":
        //         {
        //             var callId = that.attr("data-id"),
        //                 callnumber = that.attr("data-number"),
        //                 projectId = that.attr("data-projectId"),
        //                 projectName = that.attr("data-projectName"),
        //                 projectCode = that.attr("data-projectCode"),
        //                 houseId = that.attr("data-houseId"),
        //                 houseName = that.attr("data-houseName"),
        //                 houseCode = that.attr("data-houseCode"),
        //                 customerName = that.attr("data-customerName");
        //             openNewTask(callId, callnumber, houseId, houseCode,houseName, projectId, projectName,projectCode,customerName);
        //             break;
        //         }
        //         case "viewAnswer":
        //         {
        //             var questionnaireId = that.attr("data-questionnaireId"),
        //                 answerId = that.attr("data-answerId");
        //             viewAnswer(questionnaireId, answerId);
        //             break;
        //         }
        //     }
        // });

        // 自动完成
        $("#task .autocomplete-min").each(function() {
            var that = $(this);
            var target = that.attr("target");
            that.on("click", "li", function() {
                var li = $(this),
                    id = li.attr("data-id"),
                    code = li.attr("data-code"),
                    text = li.attr("data-text");
                model[target + "_auto"].visible = false;
                model.form[target + "Id"] = id;
                model.form[target + "Code"] = code;
                model.form[target + "Name"] = text;
            })
            $(document).on("click", function() {
                model[target + "_auto"].visible = false;
            })
        });
    }

    return {
        active: active
    }
});
