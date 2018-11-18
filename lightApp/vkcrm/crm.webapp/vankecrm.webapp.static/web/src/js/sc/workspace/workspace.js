window.Page_taskList = {};
var dicData = []; //字典数据

//主页TAB切换
jQuery(document).ready(function() {
    $("#WorkbenchTab li").on("click", function() {
        var order = $("#WorkbenchTab li").index(this);
        $("#WorkbenchTab").find(".active").removeClass("active");
        $(this).addClass("active");
        $(".ly-panel.on").removeClass("on");
        $(".ly-panel").eq(order).addClass("on");
    });
});

//任务列表
window.Page_taskList["taskList"] = (function() {
    var cs_dialog,
        task_btn_edit,
        dictionaryCode = "approveStatus4Tmp,operator,from,CustomerRelationType,HouseCustomerRelationType,Sex,CustomerCertificateType#CRMv2,CustomerTags,CustomerHobbies",
        dic_approveStatus4Tmp = [],
        dic_operator = [],
        dic_from = [],
        curPage = 1,
        pageSize = 10,
        hasInit = false;

    var data_temp_taskList,
        jq_customerTable,
        jq_manageTabs,
        jq_housechoose_dialog,
        jq_housechoose_houseId,
        jq_housechoose_customerId,
        jq_housechoose_houseName,
        jq_housechoose_organization,
        jq_housechoose_project;

    var config = {
        url_getTaskdictionaryCode: servicePath.customer + '/v1/dict/items', //获取任务数据字典url
        taskListTemplate: "#taskListTemplate" //任务列表模板ID
    }
    var getPendingTaksList_ajaxHandle = null, //待办任务列表GET
        getProcessedTaksList_ajaxHandle = null, //已办任务列表GET
        getTaskdictionaryCode_ajaxHandle = null, //字典GET
        getBaseData_ajaxHandle = null, //已储存数据GET
        getPendingData_ajaxHandle = null; //临时数据GET

    //----------------查询字典ajax开始
    function getTaskdictionaryCode(data) {
        if (getTaskdictionaryCode_ajaxHandle) {
            getTaskdictionaryCode_ajaxHandle.abort();
        }
        getTaskdictionaryCode_ajaxHandle = Common.ajax({
            url: config.url_getTaskdictionaryCode,
            type: "POST",
            data: {
                'codes': dictionaryCode
            },
            success: function(res) {
                if (res.success) {
                    dicData = res.details;
                    $("#steward-search-from").html(template("SearchFromTemplate", dicData)); //查询条件：数据来源
                    $("#steward-search-operator").html(template("SearchOperatorTemplate", dicData)); //查询条件：类型
                }
            },
            error: function() {

            },
            complete: function() {

            }
        });
    }

    //----------------查询字典ajax结束


    //----------------待办任务列表ajax开始
    var _getPendingTaskList_curPage,
        _getPendingTaskList_pageSize,
        _getPendingTaskList_data;

    function getPendingTaksList(curPage, pageSize, data) {
        var _curPage = curPage || _getPendingTaskList_curPage,
            _pageSize = pageSize || _getPendingTaskList_pageSize,
            _data = data || _getPendingTaskList_data;
        var url_getTask = servicePath.customer + "/v1/customers/pending/" + _curPage + "/" + _pageSize; //获取任务列表URL
        if (getPendingTaksList_ajaxHandle) {
            getPendingTaksList_ajaxHandle.abort();
        }
        _getPendingTaskList_curPage = _curPage;
        _getPendingTaskList_pageSize = _pageSize;
        _getPendingTaskList_data = _data;
        getPendingTaksList_ajaxHandle = Common.ajax({
            url: url_getTask,
            type: "get",
            data: _data,
            success: function(res) {
                if (res.success) {
                    var Tasks = res.details,
                        pageInfo = Tasks.pagination,
                        length = Tasks.list.length;
                    //add by liaochao 20160123 begin
                    window.pendingTaskListData = Tasks.list;
                    //add by liaochao 20160123 end
                    render(Tasks);

                    Page.render({
                        curpage: pageInfo.curPage,
                        pagesize: pageInfo.pageSize,
                        totalpage: pageInfo.totalPage,
                        totalsize: pageInfo.totalSize
                    })
                }
            },
            error: function() {

            },
            complete: function() {

            }
        });
        Common.loading({
            text: "",
            container: "#customerTable",
            handle: getPendingTaksList_ajaxHandle
        });
    }

    //----------------待办任务列表ajax结束
    //
    //
    //----------------已办任务列表ajax开始
    function getProcessedTaksList(curPage, pageSize, data) {
        var url_getTask = servicePath.customer + "/v1/customers/pending/approved/" + curPage + "/" + pageSize; //获取任务列表URL
        //alert(JSON.stringify(data_from));
        if (getProcessedTaksList_ajaxHandle) {
            getProcessedTaksList_ajaxHandle.abort();
        }
        getProcessedTaksList_ajaxHandle = Common.ajax({
            url: url_getTask,
            type: "get",
            data: data,
            success: function(res) {
                if (res.success) {
                    var Tasks = res.details,
                        pageInfo = Tasks.pagination,
                        length = Tasks.list.length;
                    //console.log(JSON.stringify(res));
                    Tasks.stata = "已办";
                    render(Tasks);

                    Page.render({
                        curpage: pageInfo.curPage,
                        pagesize: pageInfo.pageSize,
                        totalpage: pageInfo.totalPage,
                        totalsize: pageInfo.totalSize
                    })
                }
            },
            error: function() {

            },
            complete: function() {

            }
        });
        Common.loading({
            text: "",
            container: "#customerTable",
            handle: getProcessedTaksList_ajaxHandle
        });
    }

    //----------------已办任务列表ajax结束
    //
    //
    //----------------BaseDataAjax开始
    function getBaseData(data, id, callback) {
        if (getBaseData_ajaxHandle) {
            getBaseData_ajaxHandle.abort();
        }
        getBaseData_ajaxHandle = Common.ajax({
            url: servicePath.customer + '/v1/customer/' + id + '/info',
            type: "get",
            data: data,
            success: function(res) {
                if (res.success) {
                    ModalEditTask.params.basedata = res;
                    // 获取临时数据的回调 by cp
                    callback && callback();
                }
            },
            error: function() {

            },
            complete: function() {

            }
        });
        Common.loading({
            text: "",
            container: ".modal_wrap",
            handle: getBaseData_ajaxHandle
        });
    } //----------------BaseDataAjax结束

    //----------------临时数据Ajax开始
    function getPendingData(data, id) {
        if (getPendingData_ajaxHandle) {
            getPendingData_ajaxHandle.abort();
        }
        getPendingData_ajaxHandle = Common.ajax({
            url: servicePath.customer + '/v1/customer/' + id + '/pending',
            type: "get",
            data: data,
            success: function(res) {
                if (res.success) {
                    ModalEditTask.params.pendingdata = res.details;
                    // 讲此方法放在获取完基础信息之后的ajax回调里执行 by cp
                    ModalEditTask();
                }
            },
            error: function() {

            },
            complete: function() {

            }
        });
    }
    // 渲染任务列表
    function render(data) {
        var html_taskList = data_temp_taskList(data);
        jq_customerTable.html(html_taskList); //任务列表模板渲染
    }

    // 绑定 房屋自动完成
    function bindChooseHouseOptions() {
        var housequery_handle;
        var housequery_data;
        jq_housechoose_houseName.typeahead({
            items: 10,
            source: function(query, process) {
                if (housequery_handle) {
                    housequery_handle.abort();
                }
                var serarchName = jq_housechoose_houseName.val();
                housequery_handle = Common.ajax({
                    url: window.servicePath["house"] + '/v1/organization/house',
                    type: "get",
                    data: {
                        projectId: jq_housechoose_project.val(),
                        // projectId: jq_housechoose_projectId.val(),
                        houseName: jq_housechoose_houseName.val()
                    },
                    success: function(res) {
                        var arr = [];
                        if (res && res.details) {
                            housequery_data = res.details;
                            for (var i = 0; i < housequery_data.length; i++) {
                                arr.push(housequery_data[i].id);
                            };
                        } else {
                            housequery_data = [];
                        }
                        process(arr);
                    }
                })
            },
            matcher: function() {
                return true;
            },
            highlighter: function(id) {
                //format 渲染控件下拉内容
                var obj;
                for (var i = 0; i < housequery_data.length; i++) {
                    if (housequery_data[i].id == id) {
                        obj = housequery_data[i];
                        return obj.name;
                    }
                };
            },
            updater: function(id) {
                //拿取id，赋值与hidden，返回 控件内容
                var obj;
                for (var i = 0; i < housequery_data.length; i++) {
                    if (housequery_data[i].id == id) {
                        obj = housequery_data[i];
                        jq_housechoose_houseId.val(obj.id);
                        return obj.name;
                    }
                };
            }
        });
    }
    // 绑定 房屋-项目选项
    function bindChooseProjectOptions(data) {
        //---------------选项目自动完成
        /*var projectquery_handle;
        var projectquery_data = data.details,
            source = {};
        for (var i = 0; i < projectquery_data.length; i++) {
            source[projectquery_data[i].id] = projectquery_data[i];
        };
        jq_housechoose_project.typeahead({
            items: 10,
            source: function(query, process) {
                var arr = [],
                    item
                for (var i = 0; i < projectquery_data.length; i++) {
                    item = projectquery_data[i];
                    if (item.name.indexOf(query) > -1) {
                        arr.push(item.id);
                    }
                };
                process(arr);
            },
            matcher: function() {
                eventChooseProjectChange("");
                return true;
            },
            highlighter: function(id) {
                //format 渲染控件下拉内容
                var obj = source[id];
                return obj && obj.name;
            },
            updater: function(id) {
                //拿取id，赋值与hidden，返回 控件内容
                var obj = source[id];
                eventChooseProjectChange(obj.id);
                return obj.name;
            }
        });*/
        //---------------选项目自动完成 结束
        //---------------选项目 select
        var projectquery_data = data.details || [];
        var html = '';
        for (var i = 0; i < projectquery_data.length; i++) {
            var d = projectquery_data[i];
            html += '<option value="' + d["id"] + '">' + d["name"] + '</option>';
        };
        jq_housechoose_project.html(html).removeAttr("disabled");
    }
    // 放弃审批
    function abandonCustomerApprove(customerId, item) {
        Common.ajax({
            url: window.servicePath["customer"] + "/v1/customer/approveStatus",
            type: "POST",
            data: {
                customerId: customerId
            },
            success: function(res) {
                // 成功后获取列表
                getPendingTaksList();
            },
            error: function() {
                item.addClass("j_abandon");
            },
            complete: function() {
                item = null;
            }
        })
    }
    // 获取项目选项
    function getChooseProjectOptions() {
        jq_housechoose_project.attr("disabled", true).html("<option>==正在加载项目==</option>");
        Common.ajax({
            url: window.servicePath["house"] + '/v1/organization/project',
            type: "get",
            success: function(res) {
                bindChooseProjectOptions(res);
            },
            complete: function() {}
        })
    }
    // 弹出 房屋选项
    function eventChooseDialogShow(houseId, houseName, projectId, customerId) {
        jq_housechoose_project.val(projectId);
        // jq_housechoose_projectId.val("");
        jq_housechoose_houseName.val(houseName).attr("disabled", true);
        jq_housechoose_houseId.val(houseId);
        jq_housechoose_customerId.val(customerId);

        jq_housechoose_dialog.modal("show");
    }
    // 弹出 房屋修改
    function eventEdittaskDialogShow(houseId, houseName, customerId, crmCustomerId) {
        ModalEditTask.params.houseName = houseName;
        // 讲原来的两个ajax异步请求处理为另一个为回调 by cp
        getBaseData({
            houseId: houseId
        }, crmCustomerId, function(){
              getPendingData({
                  houseId: houseId
              }, customerId);
        });
        cs_dialog.modal("show");
    }
    // 房屋项目变更事件
    function eventChooseProjectChange(value) {
        // jq_housechoose_projectId.val(value);
        jq_housechoose_houseName.val("");
        jq_housechoose_houseId.val("");
        if (value) {
            jq_housechoose_houseName.removeAttr("disabled");
        } else {
            jq_housechoose_houseName.attr("disabled", true);
        }
    }
    // 调整列表高度
    function eventResizeTable() {
        var h = $(window).height() - 340;
        jq_customerTable.height(h > 0 ? h : 0);
    }
    //----------------分页开始
    var PageObj = {
        // 获取待办
        getPendingTaksListPage: getPendingTaksList,
        // 获取已办
        getProcessedTaksListPage: getProcessedTaksList
    }
    var _currentType = "getPendingTaksListPage";

    var Page = new Pagination({
        template: "#paginationtmpl",
        selector: "#TasksListPagination",
        onchange: function(pageInfo) {
            curPage = pageInfo.curpage;
            pageSize = pageInfo.pagesize;
            PageObj[_currentType](curPage, pageSize); //数据渲染任务列表方法
        }
    });
    //----------------分页结束

    function bindEvent() {
        //点击查询按钮
        $("#task_searchBtn").on("click", function() {
            var startTime = $("#steward-search-startTime").val(),
                endTime = $("#steward-search-endTime").val(),
                from = $("#steward-search-from option:selected").attr("data-code"),
                operator = $("#steward-search-operator option:selected").attr("data-code");
            jq_customerTable.html("");
            PageObj[_currentType](1, 10, {
                startTime: startTime,
                endTime: endTime,
                from: from,
                operator: operator
            });

        });
        //点击待办||已办切换
        jq_manageTabs.on("click", function() {
            // var order = $("#manage-tab li").index(this);
            var that = $(this),
                curTabId = that.attr("id");
            jq_manageTabs.removeClass("active")
            that.addClass("active");
            if (curTabId == "nopass-list") {
                // 待办
                _currentType = "getPendingTaksListPage";
            } else if (curTabId == "pass-list") {
                // 已办
                _currentType = "getProcessedTaksListPage";
            }
            jq_customerTable.html("");
            PageObj[_currentType](curPage, pageSize);
        });


        // 点击处理
        jq_customerTable.on("click", ".j_handle", function() {
            //add by liaochao 20160123 begin
            var hou_id = $(this).attr('data-houseid');
            var cus_id = $(this).attr('data-customerid');
            hou_id = hou_id == "" ? null : hou_id;
            cus_id = cus_id == "" ? null : cus_id;
            var data;
            if (window.pendingTaskListData) {
                for (var i = 0; i < window.pendingTaskListData.length; i++) {
                    console.log(window.pendingTaskListData[i].customerId + " - " + window.pendingTaskListData[i].houseId);
                    if (window.pendingTaskListData[i].customerId == cus_id && window.pendingTaskListData[i].houseId == hou_id) {
                        data = window.pendingTaskListData[i];
                        break;
                    }
                }
                var json_data = JSON.stringify(data);
                //用于传输数据到新增客户页面
                window.onePendingTaskData = escape(json_data);
            }
            //add by liaochao 20160123 end
            var that = $(this),
                crmCustomerId = that.attr("data-crmCustomerId"),
                customerId = that.attr("data-customerId"),
                houseId = that.attr("data-houseId"),
                projectId = that.attr("data-projectId"),
                houseName = that.parent().parent().find(".houseName").text();
            if (crmCustomerId) {
                // 如果有crmCustomerId，则弹出编辑框
                eventEdittaskDialogShow(houseId, houseName, customerId, crmCustomerId);
            } else {
                eventChooseDialogShow(houseId, houseName, projectId, customerId);
            }
        });
        // 点击放弃
        jq_customerTable.on("click", ".j_abandon", function() {
            var that = $(this),
                customerId = that.attr("data-customerId");
            if (customerId && window.confirm("确定放弃？")) {
                that.removeClass("j_abandon");
                abandonCustomerApprove(customerId, that);
            }
        });
        // 绑定房屋选择自动完成控件
        bindChooseHouseOptions();
        // 绑定项目选择变更
        jq_housechoose_project.on("change", function() {
            eventChooseProjectChange(this.value);
        });
        // 绑定点击房屋选择下拉按钮
        $("#housechoose_houseclick").on("click", function() {
            if (jq_housechoose_houseName.attr("disabled") == undefined) {
                jq_housechoose_houseName.focus().typeahead("show");
            }
        });
        // 房屋选择确认点击
        $("#housechoose_ok").on("click", function() {
            // 校验是否有houseId
            var houseId = jq_housechoose_houseId.val(),
                customerId = jq_housechoose_customerId.val(),
                href = "";
            if (houseId) {
                href = path.server + '/page/house/' + houseId + '/customer';
                if (customerId) {
                    href += '?pendingId=' + customerId;
                    //add by liaochao 20160125 begin
                    href += "&customerInfo=" + window.onePendingTaskData;
                    //add by liaochao 20160125 end
                } else {
                    //add by liaochao 20160125 begin
                    href += "?customerInfo=" + window.onePendingTaskData;
                    //add by liaochao 20160125 end
                }
                location.href = href;
            } else {
                alert("请确认房屋信息");
            }
            return false;
        });
        $(window).on("resize", eventResizeTable);
        eventResizeTable();
    }

    function bindVariable() {
        jq_manageTabs = $("#manage-tab li"); //任务列表tab栏
        jq_customerTable = $("#customerTable"); //任务列表
        cs_dialog = $("#modal_edittask"); //修改任务弹出框ID
        jq_housechoose_dialog = $("#modal_housechoose");
        jq_housechoose_houseId = $("#housechoose_houseId");
        jq_housechoose_customerId = $("#housechoose_customerId");
        jq_housechoose_houseName = $("#housechoose_houseName");
        jq_housechoose_organization = $("#housechoose_organization");
        jq_housechoose_project = $("#housechoose_project");
        // jq_housechoose_projectId = $("#housechoose_projectId");

        data_temp_taskList = template.compile($(config.taskListTemplate).html()); //任务列表模板
        // 初始化 房屋确认[弹出框]-管理中心 选项
        getChooseProjectOptions();

    }

    function active(opt) {

    }

    function init(opt) {
        if (!hasInit) {
            hasInit = true;
            bindVariable();
            bindEvent();
        }
        active(opt);
        getTaskdictionaryCode();
        getPendingTaksList(1, 10); //数据渲染任务列表方法
    }

    init();

    return {
        init: init,
        getPendingTaksList: getPendingTaksList
    }
})();

/************
 ***********
 弹出框编辑模块开始
 *************
 ***********/
function ModalEditTask(data) {
    ModalEditTask.DataMerge();
    // ModalEditTask.ExchangeTo();
    ModalEditTask.BindEvent();
}

ModalEditTask.params = {
    basedata: [], //原始数据
    pendingdata: [], //临时数据
    mergedata: {} //合并对比数据
}
ModalEditTask.BindEvent = function() {
    if (ModalEditTask.BindEvent.hasInit) {
        return;
    }
    ModalEditTask.BindEvent.hasInit = true;
    $("#modal_edittask").on("click", ".btn-editinfo", function() {
        var thisOne = $(this),
            order; //编辑单条字段序号
        if (thisOne.hasClass("edit")) {
            //order = $(".btn-editinfo.edit").index(this);
            order =$(this).parents(".edit-info").index();
            thisOne.removeClass("editstate");
            thisOne.next(".cencel").show();
            ModalEditTask.EditTo(order);
        } //开始编辑
        else {
            order =$(this).parents(".edit-info").index();
            thisOne.hide();
            thisOne.prev(".edit").addClass("editstate");
            ModalEditTask.CencelEditTo(order);
        } //取消编辑

    }); //点击编辑单条数据

    //.replace(/\B(?=(?:\d{2})+\b)/g, ',')
    $("#Edit_OK").on("click", function() {
        if ($("#ModalEditTaskBar").find(".error").length == "0") {
            if (!window.confirm("确定要审核通过该客户信息吗？")) {
                return;
            }
            var crmCustomerId = $("#base_name").attr("data-id") || '',
                customerId = $("#pending_name").attr("data-id") || '',
                houseId = $("#task_housename").attr("data-id") || '',
                name = $("#base_name input").val(),
                sex = $("#base_sex").attr("data-code") || '',
                mainMobile = $("#base_mainMobile input").val(),
                standbyMobile = $("#base_standbyMobile input").val(),
                homeTel = $("#base_homeTel input").val(),
                officeTel = $("#base_officeTel input").val(),
                cardType = $("#base_certificateType").attr("data-code") || '',
                cardNo = $("#base_certificateId input").val(),
                hobbyIds = $("#base_hobbies").attr("data-code") || '';
            // console.log(hobbyIds.charAt(hobbyIds.length - 1));

            if (hobbyIds.charAt(hobbyIds.length - 1) == ",") {
                hobbyIds = hobbyIds.substring(0, hobbyIds.length - 1);
            }

            ModalEditTask.CustomerDataPost({
                cardNo: cardNo,
                cardType: cardType,
                customerId: customerId,
                crmCustomerId: crmCustomerId,
                hobbyIds: hobbyIds,
                houseId: houseId,
                mainMobile: mainMobile,
                standbyMobile: standbyMobile,
                homeTel: homeTel,
                officeTel: officeTel,
                name: name,
                sex: sex
            }, customerId)
        } else {
            alert("请填写正确信息！");
        }
    }); //点击保存

    $("#Edit_GiveUp").on("click", function() {
        var pendingId = $("#task_housename").attr("data-pendingId");
        ModalEditTask.GiveUpEditPost({
            pendingId: pendingId
        });
    }); //点击放弃

    $("#ModalEditTaskBar").on("click", ".btn_exchange", function() {
        var divFrist = $(this).parent().prev().find("div");
        var divLast = $(this).parent().next().find("div");
        var temobj1 = $("<div></div>");
        var temobj2 = $("<div></div>");
        temobj1.insertBefore(divFrist);
        temobj2.insertBefore(divLast);
        divFrist.insertAfter(temobj2);
        divLast.insertAfter(temobj1);
        temobj1.remove();
        temobj2.remove();
    }); //数据交换
}


ModalEditTask.DataMerge = function() {
    //原始数据和临时数据JSON对象拼接开始
    var basedata = ModalEditTask.params.basedata.details,
        pendingdata = ModalEditTask.params.pendingdata,
        mergedata = ModalEditTask.params.mergedata;
    mergedata.basedata = [];
    mergedata.pendingdata = [];
    mergedata.basedata = basedata;
    mergedata.pendingdata = pendingdata;
    //原始数据和临时数据JSON对象拼接结束
    var basehobbylength = mergedata.basedata.hobby.length,
        pendinghobbylength = mergedata.pendingdata.hobby.length,
        baseRelationlength = mergedata.basedata.houseRelation.length,
        pendingRelationlength = mergedata.pendingdata.houseRelation.length,
        basehobbyArray = [],
        basehobbyText = "",
        pendinghobbyArray = [],
        pendinghobbyText = "",
        baseRelationArray = [],
        baseRelationText = "",
        pendingRelationArray = [],
        pendingRelationText = "";
    for (var i = 0; i < basehobbylength; i++) {
        basehobbyArray.push(mergedata.basedata.hobby[i].contentText);
    } //拼base兴趣爱好
    for (var i = 0; i < pendinghobbylength; i++) {
        pendinghobbyArray.push(mergedata.pendingdata.hobby[i].contentText);
    } //拼pending兴趣爱好
    for (var i = 0; i < baseRelationlength; i++) {
        baseRelationArray.push(mergedata.basedata.houseRelation[i].relationType);
    } //拼base房屋关系
    for (var i = 0; i < pendingRelationlength; i++) {
        pendingRelationArray.push(mergedata.pendingdata.houseRelation[i].relationType);
    } //拼pending房屋关系

    basehobbyText = basehobbyArray.join(",");
    pendinghobbyText = pendinghobbyArray.join(",");
    baseRelationText = baseRelationArray.join(",");
    pendingRelationText = pendingRelationArray.join(",");

    mergedata.basedata.hobbyTo = basehobbyText;
    mergedata.pendingdata.hobbyTo = pendinghobbyText;
    mergedata.basedata.houseRelationTo = baseRelationText;
    mergedata.pendingdata.houseRelationTo = pendingRelationText;
    mergedata.hasEditPermission = window["hasEditPermission"] || false;

    //console.log(JSON.stringify(mergedata));
    //console.log(mergedata.pendingdata.houseRelationTo);
    var html = template("ModalEditTaskTemplate", mergedata);
    $("#ModalEditTaskBar").html(html);

} //原始数据与临时数据拼接

/*ModalEditTask.ExchangeTo = function() {
    $(".btn_exchange").on("click", function() {
        var divFrist = $(this).parent().prev().find("div");
        var divLast = $(this).parent().next().find("div");
        var temobj1 = $("<div></div>");
        var temobj2 = $("<div></div>");
        temobj1.insertBefore(divFrist);
        temobj2.insertBefore(divLast);
        divFrist.insertAfter(temobj2);
        divLast.insertAfter(temobj1);
        temobj1.remove();
        temobj2.remove();
    });
} //数据交换*/

ModalEditTask.EditTo = function(order) {
    var alone_Editinfo = $(".edit-info").eq(order), //当前编辑字段所在元素
        dic_type = alone_Editinfo.attr("data-type"), //当前编辑字段字典关键词
        EditType = alone_Editinfo.attr("edit-type"); //当前编辑字段编辑类型
    //type:text----input[type="text"]编辑类型
    //type:check----input[type="check/radio"]编辑类型
    if (dic_type != "inputedit") {
        ModalEditTask.CheckBoxDataGet(dic_type); //渲染字段编辑选项
    }

    if (EditType == "text") {
        alone_Editinfo.find(".tempdata .info-div,.task_info_exchange").hide();
        alone_Editinfo.find(".info-input").removeClass("info-input-unedit").removeAttr("disabled");
    } else if (EditType == "check") {
        var checkboxval = '',
            checkboxvcode = '',
            checkedArray = [],
            checkedCodeArray = [];
        alone_Editinfo.addClass("noborder");
        alone_Editinfo.find(".tempdata>.info-div,.task_info_exchange").hide();
        alone_Editinfo.find(".info_checkbar").show();

        alone_Editinfo.on("click", "input", function() {
            if ($(this).attr("type") == "radio") {
                checkboxval = $(this).parent().text();
            } else if ($(this).attr("type") == "checkbox") {
                var tmpCheckBox = $(this);
                if ($(this).prop("checked")) {
                    checkedArray.push($(this).val());
                    checkedCodeArray.push($(this).attr("data-code"));
                } else {
                    $.each(checkedArray, function(index, item) {
                        checkedArray[index] = tmpCheckBox.val() == item ? "" : item;
                    });
                    $.each(checkedCodeArray, function(index, item) {
                        checkedCodeArray[index] = tmpCheckBox.attr("data-code") == item ? "" : item;
                    });
                }
                checkboxval = $.grep(checkedArray, function(n) {
                    return $.trim(n).length > 0;
                }).join("，");
                checkboxvcode = $.grep(checkedCodeArray, function(n) {
                    return $.trim(n).length > 0;
                }).join(",");
            }
            alone_Editinfo.find(".basedata>.info-div").text(checkboxval);
            alone_Editinfo.find(".basedata").attr("data-code", checkboxvcode);
        }); //元素text和input选中联动
    }
} //编辑单条数据

ModalEditTask.CencelEditTo = function(order) {
    var alone_Editinfo = $(".edit-info").eq(order), //当前编辑字段所在元素
        EditType = alone_Editinfo.attr("edit-type"), //当前编辑字段编辑类型
        basedata_data_text = alone_Editinfo.find(".basedata").attr("data-text"),
        tempdata_data_text = alone_Editinfo.find(".tempdata").attr("data-text");

    alone_Editinfo.find(".info-div>i").remove();
    //type:text input[type="text"]编辑类型
    //type:check input[type="check/radio"]编辑类型
    if (EditType == "text") {
        alone_Editinfo.find(".tempdata>.info-div,.task_info_exchange").show();
        alone_Editinfo.find(".info-input").addClass("info-input-unedit").attr("disabled", "true");
        alone_Editinfo.find(".basedata .info-input").val(basedata_data_text);
        alone_Editinfo.find(".tempdata .info-input").val(tempdata_data_text);
    } else if (EditType == "check") {
        alone_Editinfo.removeClass("noborder");
        alone_Editinfo.find(".tempdata>.info-div,.task_info_exchange").show();
        alone_Editinfo.find(".info_checkbar").hide();
        alone_Editinfo.find(".basedata .info-div").text(basedata_data_text);
        alone_Editinfo.find(".tempdata .info-div").text(tempdata_data_text);
    }
} //取消编辑

ModalEditTask.CheckBoxDataGet = function(dic_type) {
    //dic_type为.edit-info[data-type]的值
    var html;
    if (dic_type == "Sex") {
        html = template("EditSexTemplate", dicData);
        $("#SexBar").html(html);
    } //性别选项
    else if (dic_type == "certificateType") {
        html = template("EditcertificateTypeTemplate", dicData);
        $("#certificateTypeBar").html(html);
    } //证件类型选项
    else if (dic_type == "CustomerHobbies") {
        html = template("CustomerHobbiesBarTemplate", dicData);
        $("#CustomerHobbiesBar").html(html);
    } //兴趣爱好选项
    else if (dic_type == "CustomerRelationType") {
        html = template("EditCustomerRelationTypeTemplate", dicData);
        $("#CustomerRelationBar").html(html);
    } //与客户关系选项
    else if (dic_type == "HouseCustomerRelationType") {
        html = template("EditHouseCustomerRelationTypeTemplate", dicData);
        $("#HouseCustomerRelationBar").html(html);
    } //与房屋关系选项

} //读取字典渲染字段checkbox/radio

ModalEditTask.CustomerDataPost = function(data, customerId) {
    var ajaxPostCustomerRel_ajaxHandle = null;

    if (ajaxPostCustomerRel_ajaxHandle) {
        ajaxPostCustomerRel_ajaxHandle.abort();
    }
    ajaxPostCustomerRel_ajaxHandle = Common.ajax({
        url: window.servicePath["customer"] + "/v1/customer/" + customerId,
        type: "post",
        data: data,
        success: function(res) {
            if (res.success) {
                window.Page_taskList["taskList"].getPendingTaksList(1, 10);
                alert("修改成功");
            } else {
                alert(res.message);
            }
        },
        error: function(error) {
            alert("保存失败：" + error.message);
        },
        complete: function() {}
    })
} //录入修改信息

ModalEditTask.GiveUpEditPost = function(data) {
    var ajaxGiveUpEdit_ajaxHandle = null;

    if (ajaxGiveUpEdit_ajaxHandle) {
        ajaxGiveUpEdit_ajaxHandle.abort();
    }
    ajaxGiveUpEdit_ajaxHandle = Common.ajax({
        url: servicePath.customer + "/v1/customers/pending/cancel",
        type: "GET",
        data: data,
        success: function(res) {
            if (res.success) {
                alert("任务已放弃");
                $("#modal_edittask").modal("hide");
                window.Page_taskList["taskList"].getPendingTaksList(1, 10);
            } else {
                alert(res.message);
            }
        },
        error: function(error) {
            alert("任务放弃失败：" + error.message);
        },
        complete: function() {}
    })
} //放弃修改信息

function EditVerify(id, type) {
    var thisOne = $("#" + id),
        val = thisOne.find("input").val();
    thisOne.find(".info-div>i").remove();
    if (type == "notext") {
        if (val == "") {
            thisOne.find(".info-div").append("<i class='error'>不能为空</i>");
        } else {
            thisOne.find(".info-div").append("<i class='OK'>√</i>");
        }
    } else if (type == "IDNumber") {
        var error = validateIdcard(val);
        if (error.isError) {
            thisOne.find(".info-div").append("<i>身份证号输入有误</i>");
        } else {
            thisOne.find(".info-div").append("<i class='OK'>√</i>");
        }
    }
} //验证

// 身份证验证方法
function validateIdcard(val) {
    var code = val;

    if (code == "") {
        return {
            isError: false
        };
    }

    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;

    if (!code || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    // if (!pass) console.log(tip);
    return {
        isError: !pass,
        errorInfo: tip
    };
}
/************
 ***********
 弹出框编辑模块结束
 *************
 ***********/
