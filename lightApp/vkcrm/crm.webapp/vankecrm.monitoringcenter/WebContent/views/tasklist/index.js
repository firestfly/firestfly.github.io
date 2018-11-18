define(['widget_businessType'], function (businesstypeWidget) {

    var ajaxTaskListData_handle = null;
    var hasInit = false;
    var vmtasklist = avalon.define({
        $id: "tasklist",
        curPage: 1,
        pageSize: 10,
        totalSize: 0,
        statusOptions: Config.keys && Config.keys.AppTaskStatus || [],
        form: {
            start_time_list: "",
            end_time_list: "",
            // 任务状态
            status: "",
            // 标题
            title: "",
            // 任务流水号
            taskNo: "",
            // 项目
            projectId: '',
            projectName: '',
            projectCode: '',
            // 楼栋
            buildingId: '',
            buildingName: '',
            buildingCode: '',
            // 房屋
            houseId: '',
            houseName: '',
            houseCode: '',
            // 任务类型
            businessType: "",
            businessTypeFullText: "",
            businessTypeFullCode: "",
            // 报事人手机
            mobile: ""
        },

        tasklists: {
            data: [],
            isLoading: false
        },
        // 项目名称
        projectOptions: {
            list: []
        },
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

        autoinput: function (target) {
            var name = Common.trim(this.value || '');
            vmtasklist.form[target + "Name"] = name;
            vmtasklist.form[target + "Code"] = '';
            vmtasklist.form[target + "Id"] = '';
            if (name === '') {
                vmtasklist[target + "_auto"].visible = false;
                vmtasklist[target + "_auto"].loading = false;
                return;
            }
            autofunc["get" + target + "_ajax"](name);
        },

        // 查询按钮事件
        searchclick: function (event) {
            vmtasklist.curPage = 1;
            ajaxGetTaskListData();
        },
        // 重置按钮事件
        resetclick: function (event) {
            $("#start_time_list,#end_time_list").val("");
            vmtasklist.form.start_time_list = "";
            vmtasklist.form.end_time_list = "";
            vmtasklist.form.title = "";
            vmtasklist.form.taskNo = "";
            vmtasklist.form.status = "";

            resetTime();
            var projectOps = vmtasklist.projectOptions.list[0] || {};
            vmtasklist.form.projectName = "";
            vmtasklist.form.projectCode = projectOps["code"];
            vmtasklist.form.projectId = projectOps["id"];
            vmtasklist.form.houseName = "";
            vmtasklist.form.houseCode = "";
            vmtasklist.form.buildingCode = "";
            vmtasklist.form.buildingName = "";

            vmtasklist.form.businessType = "";
            if (avalon.vmodels.tasklistBusinessWidget) {
                avalon.vmodels.tasklistBusinessWidget['businessType'] = '';
            }
            vmtasklist.form.businessTypeFullText = "";
            vmtasklist.form.mobile = "";
            // 设置为首页
            vmtasklist.curPage = 1;
            // ajaxGetTaskListData();
        }
    });

    /* 设置分页信息 */
    var tasklistPageInfo = null;

    function bindPageInfo() {
        tasklistPageInfo = new Pagination({
            selector: "#pagination",
            onchange: function (pageInfo) {
                vmtasklist.curPage = pageInfo.curpage;
                ajaxGetTaskListData();
            }
        });
    }

    function clearData(data) {
        var d = data || {},
            m = vmtasklist.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmtasklist.form[i] = d[i];
            } else {
                vmtasklist.form[i] = null;
            }
        }
    }

    /* ajax取数 */
    function ajaxGetTaskListData() {
        if (!vmtasklist.curPage) {
            vmtasklist.curPage = 1;
        }
        //$("#projectName").find("option:selected").attr("data-code");
        if (vmtasklist.curPage < 1) return;
        vmtasklist.tasklists.isLoading = true;
        ajaxTaskListData_handle = Common.ajax({
            url: servicePath.task + '/v1/callcenter/task/app/list',
            type: "GET",
            data: {
                status: vmtasklist.form.status,
                taskNo: vmtasklist.form.taskNo,
                title: vmtasklist.form.title,
                businessType: vmtasklist.form.businessType,
                startTime: vmtasklist.form.start_time_list,
                endTime: vmtasklist.form.end_time_list,
                projectCode: vmtasklist.form.projectCode,
                houseCode: vmtasklist.form.houseCode,
                mobile: vmtasklist.form.mobile,
                curPage: vmtasklist.curPage,
                pageSize: vmtasklist.pageSize
            },
            success: function (data) {
                vmtasklist.tasklists.data = [];
                vmtasklist.tasklists.data = data.list;
                /* 更新分页控件 */
                var tlpinfo = data.pagination;
                tasklistPageInfo.render({
                    curpage: tlpinfo.curPage,
                    pagesize: tlpinfo.pageSize,
                    totalpage: tlpinfo.totalPage,
                    totalsize: tlpinfo.totalSize
                });
                vmtasklist.totalSize = tlpinfo.totalSize;
                tasklistPageInfo.pagesize = tlpinfo.pageSize;
            },
            error: function () {
            },
            complete: function () {
                vmtasklist.tasklists.isLoading = false;
                resize();
            }
        });

        /*Common.loading({
         container: '#tasklist',
         handle: ajaxTaskListData_handle
         });*/
    }

    /*
     * 自动搜索项目房屋
     */
    var autofunc = {};
    // 搜索项目
    var getProject_handle = null;

    autofunc.getproject_ajax = function (projectName) {
        if (getProject_handle) {
            getProject_handle.abort();
        }
        vmtasklist.project_auto.visible = true;
        vmtasklist.project_auto.loading = true;
        getProject_handle = Common.ajax({
            url: servicePath.house + "/v1/projects",
            type: "GET",
            data: {
                projectName: projectName
            },
            success: function (res) {
                vmtasklist.project_auto.list = res;
            },
            error: function () {

            },
            complete: function () {
                vmtasklist.project_auto.loading = false;
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

    autofunc.getbuilding_ajax = function (buildName) {
        if (getBuilding_handle) {
            getBuilding_handle.abort();
        }
        var projectId = vmtasklist.form.projectId;
        vmtasklist.building_auto.list = [];
        vmtasklist.building_auto.visible = true;
        vmtasklist.building_auto.loading = true;
        if (getBuilding_result[projectId]) {
            var arr = filterBuilding(getBuilding_result[projectId], buildName);
            vmtasklist.building_auto.list = arr;
            vmtasklist.building_auto.loading = false;
            return;
        }
        getBuilding_handle = Common.ajax({
            url: servicePath.house + "/v1/project/" + projectId + "/buildings",
            type: "GET",
            data: {
                buildName: buildName
            },
            success: function (res) {
                getBuilding_result[projectId] = res;
                var arr = filterBuilding(getBuilding_result[projectId], buildName);
                vmtasklist.building_auto.list = arr;
            },
            error: function () {

            },
            complete: function () {
                vmtasklist.building_auto.loading = false;
            }
        })
    }

    // 房屋搜索
    var getHouse_handle = null;

    autofunc.gethouse_ajax = function (houseName) {
        if (getHouse_handle) {
            getHouse_handle.abort();
        }
        vmtasklist.house_auto.visible = true;
        vmtasklist.house_auto.loading = true;
        var projectId = vmtasklist.form.projectId,
            buildingId = vmtasklist.form.buildingId
        getHouse_handle = Common.ajax({
            url: servicePath.house + "/v1/project/" + projectId + "/" + buildingId + "/houses",
            type: "GET",
            data: {
                houseName: houseName
            },
            success: function (res) {
                vmtasklist.house_auto.list = res;
            },
            error: function () {

            },
            complete: function () {
                vmtasklist.house_auto.loading = false;
            }
        })
    }

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        setTimeout(function () {
            getProject_ajax();
        });
    }

    // 获取当前登录人所属项目
    function getProject_ajax() {
        Common.ajax({
            url: servicePath.house + "/v1/roleprojects",
            type: "GET",
            success: function (res) {
                if (res == null || res.length == 0) {
                    Common.tip.add({
                        text: "当前用户下无项目",
                        type: "warning"
                    });
                    return;
                }

                // 列表查询项目
                vmtasklist.form.projectCode = res[0]["code"];
                vmtasklist.form.projectId = res[0]["id"];
                vmtasklist.projectOptions.list = res;

                $("#projectName").on("change", function () {
                    vmtasklist.form.projectCode = $(this).find("option:selected").attr("data-code");
                    vmtasklist.form.buildingId = "";
                    vmtasklist.form.buildingCode = "";
                    vmtasklist.form.buildingName = "";
                    vmtasklist.form.houseId = "";
                    vmtasklist.form.houseCode = "";
                    vmtasklist.form.houseName = "";
                });
                setTimeout(function () {
                    // 绑定数据
                    resetTime();
                    bindPageInfo();
                    // ajaxGetTaskListData();
                    bindEvent();
                }, 100);
            },
            error: function () {
            },
            complete: function () {
            }
        })
    }

    // 窗口改变大小事件
    window.onresize = resize;

    function resize() {
        var page_h = $(window).height();
        var obj = $("#tasklist");
        if (obj.attr("class")) {
            var top_h = obj.offset().top;
            obj.height(page_h - top_h - 50); //50: 页面间距 & 分页
        }
    }

    function active() {
        init();
    }

    function inactive() {
        if (ajaxTaskListData_handle)
            ajaxTaskListData_handle.abort();
    }

    function bindEvent() {
        if (avalon.vmodels.tasklistBusinessWidget) {
            avalon.vmodels.tasklistBusinessWidget.$watch("businessType", function (newValue) {
                vmtasklist.form.businessType = newValue;
            })
        }
        ;
        // 自动完成
        $(".autocomplete-min").each(function () {
            var that = $(this);
            var target = that.attr("target");
            that.on("click", "li", function () {
                var li = $(this),
                    id = li.attr("data-id"),
                    code = li.attr("data-code"),
                    text = li.attr("data-text");
                vmtasklist[target + "_auto"].visible = false;
                vmtasklist.form[target + "Id"] = id;
                vmtasklist.form[target + "Code"] = code;
                vmtasklist.form[target + "Name"] = text;
            })
            $(document).on("click", function () {
                vmtasklist[target + "_auto"].visible = false;
            })
        });

        // 项目名称 － 行点击
        $("#tbody_tasklist").on("click", "a", function () {
            var id = $(this).attr("data-id");
            avalon.router.redirect("/contenttask/taskinfo?islocal=false&id=" + id);
        });
    }

    function resetTime() {
        var q = new Date();
        vmtasklist.form.end_time_list = Common.formatDate(q, "yyyy-MM-dd 23:59:59");
        // q.setDate(q.getDate(), q.setDate(0))
        var p = q - (7 * 24 * 60 * 60 * 1000);
        vmtasklist.form.start_time_list = Common.formatDate(p, "yyyy-MM-dd 00:00:00");
    }

    return {
        active: active,
        inactive: inactive,
        clearData: clearData
    }
});