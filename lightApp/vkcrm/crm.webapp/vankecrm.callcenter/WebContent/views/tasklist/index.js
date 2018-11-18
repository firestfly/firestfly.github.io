define([], function() {

    var ajaxTaskListData_handle = null;
    var hasInit = false;
    var vmtasklist = avalon.define({
        $id: "tasklist",
        curPage: 1,
        pageSize: 10,
        totalSize: 0,
        statusOptions: Config.keys && Config.keys.AppTaskStatus || [],
        // 任务来源
        sourceOptions: Config.keys && Config.keys.AppTaskSource || [],
        crmSourceOptions: Config.keys && Config.keys.TaskSource || [],
        // 是否显示CRM任务来源
        crmSource: false,
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

            // 报事人手机
            mobile: "",

            // 任务来源
            source: '',
            crm_source: ''
        },

        tasklists: {
            data: [],
            isLoading: false
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

        autoinput: function(target) {
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
        searchclick: function(event) {
            vmtasklist.curPage = 1;
            ajaxGetTaskListData();
        },
        // 重置按钮事件
        resetclick: function(event) {
            vmtasklist.form.start_time_list = "";
            vmtasklist.form.end_time_list = "";
            vmtasklist.form.title = "";
            vmtasklist.form.taskNo = "";
            vmtasklist.form.status = "";
            vmtasklist.form.source = "";
            vmtasklist.form.crm_source = "";
            // 隐藏之类
            vmtasklist.crmSource = false;

            resetTime();

            vmtasklist.form.projectName = "";
            vmtasklist.form.projectCode = "";
            vmtasklist.form.houseName = "";
            vmtasklist.form.houseCode = "";
            vmtasklist.form.buildingCode = "";
            vmtasklist.form.buildingName = "";

            vmtasklist.form.businessType = "";
            if (avalon.vmodels.taskinputBusinessWidget) {
                avalon.vmodels.taskinputBusinessWidget["businessType"] = "";
            }
            vmtasklist.form.businessTypeFullText = "";
            vmtasklist.form.mobile = "";
            // 设置为首页
            vmtasklist.curPage = 1;
            // ajaxGetTaskListData();
        },

        // 任务来源改变事件
        TaskSource_event: function(va) {
            if (va.toLowerCase() == "crm") {
                vmtasklist.crmSource = true;
            } else {
                vmtasklist.crmSource = false;
                vmtasklist.form.crm_source = "";
            }
        }
    });

    // crm任务来源过滤器
    avalon.filters.crmsource = function(status) {
        var statusTo = '';
        var source = Config.keys && Config.keys.TaskSource;
        for (var i = 0; i < source.length; i++) {
            if (source[i].code == status) {
                statusTo = source[i].value;
                break;
            }
        }
        if (statusTo == '') return status;
        return statusTo;
    };

    /* 设置分页信息 */
    var tasklistPageInfo = null;

    function bindPageInfo() {
        tasklistPageInfo = new Pagination({
            selector: "#pagination",
            onchange: function(pageInfo) {
                vmtasklist.curPage = pageInfo.curpage;
                ajaxGetTaskListData();
            }
        });
        resize_tasklist();
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

    /* 获取任务列表 */
    function ajaxGetTaskListData() {
        if (!vmtasklist.curPage) {
            vmtasklist.curPage = 1;
        }
        if (vmtasklist.curPage < 1) return;
        if (ajaxTaskListData_handle) {
            ajaxTaskListData_handle.abort();
        }
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
                source: vmtasklist.form.source,
                crm_source: vmtasklist.form.crm_source,
                curPage: vmtasklist.curPage,
                pageSize: vmtasklist.pageSize
            },
            success: function(data) {
                vmtasklist.tasklists.data = [];
                vmtasklist.tasklists.data = data.list || [];
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
            error: function() {},
            complete: function() {
                vmtasklist.tasklists.isLoading = false;
            }
        });

        /*Common.loading({
            text: "",
            container: "#tasklist",
            handle: ajaxTaskListData_handle
        });*/
    }

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
        vmtasklist.project_auto.visible = true;
        vmtasklist.project_auto.loading = true;
        getProject_handle = Common.ajax({
            url: servicePath.house + "/v1/projects",
            type: "GET",
            data: {
                projectName: projectName
            },
            success: function(res) {
                vmtasklist.project_auto.list = res;
            },
            error: function() {

            },
            complete: function() {
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

    autofunc.getbuilding_ajax = function(buildName) {
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
            success: function(res) {
                getBuilding_result[projectId] = res;
                var arr = filterBuilding(getBuilding_result[projectId], buildName);
                vmtasklist.building_auto.list = arr;
            },
            error: function() {

            },
            complete: function() {
                vmtasklist.building_auto.loading = false;
            }
        })
    }

    // 房屋搜索
    var getHouse_handle = null;

    autofunc.gethouse_ajax = function(houseName) {
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
            success: function(res) {
                vmtasklist.house_auto.list = res;
            },
            error: function() {

            },
            complete: function() {
                vmtasklist.house_auto.loading = false;
            }
        })
    }

    // 处理页面高度
    function resize_tasklist() {
        var page_h = $(window).height();

        if (avalon.vmodels.contenttask) {
            var obj = $("#" + avalon.vmodels.contenttask.visibleIndex);
        } else if (avalon.vmodels.contentnewtask) {
            var obj = $("#" + avalon.vmodels.contentnewtask.visibleIndex);
        }
        if (obj.attr("class")) {
            var top_h = obj.offset().top;
            obj.height(page_h - top_h - 55); //55: 页面间距 & 分页
        }
    }

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        setTimeout(function() {
            resetTime();

            bindPageInfo();
            // ajaxGetTaskListData();
            bindEvent();
        });
    }

    // 窗口改变大小事件
    window.onresize = function() {
        resize_tasklist();
    };

    function active() {
        init();
    }

    function inactive() {
        if (ajaxTaskListData_handle)
            ajaxTaskListData_handle.abort();
    }

    function resetTime() {
        var q = new Date();
        vmtasklist.form.end_time_list = Common.formatDate(q, "yyyy-MM-dd 23:59:59");
        q.setDate(q.getDate(), q.setDate(0))
        vmtasklist.form.start_time_list = Common.formatDate(q, "yyyy-MM-dd 00:00:00");
    }

    function bindEvent() {

        if (avalon.vmodels.tasklistBusinessWidget) {
            avalon.vmodels.tasklistBusinessWidget.$watch("businessType", function(newValue) {
                vmtasklist.form.businessType = newValue;
            })
        };
        // 自动完成
        $("#tasklist_searchform .autocomplete-min").each(function() {
            var that = $(this);
            var target = that.attr("target");
            that.on("click", "li", function() {
                var li = $(this),
                    id = li.attr("data-id"),
                    code = li.attr("data-code"),
                    text = li.attr("data-text");
                vmtasklist[target + "_auto"].visible = false;
                vmtasklist.form[target + "Id"] = id;
                vmtasklist.form[target + "Code"] = code;
                vmtasklist.form[target + "Name"] = text;
            })
            $(document).on("click", function() {
                vmtasklist[target + "_auto"].visible = false;
            })
        });

        // 项目名称 － 行点击
        $("#tbody_tasklist").on("click", "a", function() {
            var id = $(this).attr("data-id");
            if (window.SIMPLEMODEL) {
                if (avalon.vmodels.contentnewtask) {
                    avalon.router.redirect("/contentnewtask/taskquery?islocal=false&id=" + id);
                }
            } else {
                if (avalon.vmodels.contenttask) {
                    avalon.router.redirect("/contenttask/taskquery?islocal=false&id=" + id);
                }
            }

            //avalon.router.redirect("/contenttask/taskquery?islocal=false&id=" + id);
        });
    }

    return {
        active: active,
        inactive: inactive,
        clearData: clearData
    }
});
