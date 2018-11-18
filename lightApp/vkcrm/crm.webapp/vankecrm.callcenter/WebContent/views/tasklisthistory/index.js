define(["text!views/tasklisthistory/index.html","views/taskquery/index"], function(modelHtml,taskquery) {
    var vmtasklisthis;
    avalon.templateCache["views/tasklisthistory/index.html"] = modelHtml;

    var hasInit = false;
    vmtasklisthis = avalon.define({
        $id: "tasklisthistory",
        curPage: 1,
        pageSize: 10,
        form: {
            // 标题
            title: "",
            // 任务流水号
            taskNo: "",
            // 查询时间段
            start_time_his: "",
            end_time_his: "",
            businessType: {
                get: function() {
                    var obj = avalon.vmodels.taskinputBusinessWidget || {};
                    return obj.businessType;
                }
            },
            businessTypeFullText: "",
            businessTypeFullCode: {
                get: function() {
                    var obj = avalon.vmodels.taskinputBusinessWidget || {};
                    return [obj.businessType0,
                        obj.businessType1,
                        obj.businessType
                    ].join(".")
                },
                set: function(val) {
                    if (val) {
                        var arr = (val + '').split(".");
                        var obj = avalon.vmodels.taskinputBusinessWidget;
                        obj["businessType0"] = arr[0] || '';
                        obj["businessType1"] = arr[1] || '';
                        obj["businessType"] = arr[2] || '';
                    }
                }
            },

            projectId: '', //项目ID
            projectName: '', //项目名称
            projectCode: '', //项目编码

            buildingId: "",
            buildingName: '',
            buildingCode: '', //楼栋编码

            houseId: '', //房屋ID
            houseName: '', //房屋名称
            houseCode: '', //房屋编码

            // 任务级别
            levelType: "",
            // 房屋编码
            houseCode: "",
            // 任务来源
            taskSource: "",
            // 报事人手机
            mobile: "",
            // 状态
            status: ""
        },

        task: {
            isLoading: false,
            data: []
        },
        taskSource: {
            isLoading: false,
            data: []
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
            vmtasklisthis.form[target + "Name"] = name;
            vmtasklisthis.form[target + "Code"] = '';
            vmtasklisthis.form[target + "Id"] = '';
            if (name === '') {
                vmtasklisthis[target + "_auto"].visible = false;
                vmtasklisthis[target + "_auto"].loading = false;
                return;
            }
            autofunc["get" + target + "_ajax"](name);
        },
        autoblur: function(target) {
            setTimeout(function() {
                vmtasklisthis[target + '_auto'].visible = false;
            }, 200);
        },

        // 查询按钮事件
        searchclick: function (event) {
            vmtasklisthis.curPage = 1;
            getTaskListHistory();
        },

        // 重置按钮事件
        resetclick: function (event) {
            $("#start_time_his,#end_time_his").val("");
            vmtasklisthis.form.start_time_his = "";
            vmtasklisthis.form.end_time_his = "";
            vmtasklisthis.form.title = "";
            vmtasklisthis.form.taskNo = "";
            vmtasklisthis.form.status = "";
            vmtasklisthis.form.businessType = "";
            vmtasklisthis.form.levelType = "",
            vmtasklisthis.form.projectCode = "";
            vmtasklisthis.form.houseCode = "";
            vmtasklisthis.form.taskSource = "";
            vmtasklisthis.form.mobile = "";
            // 设置为首页
            vmtasklisthis.curPage = 1;
            getTaskListHistory();
        }
    });

    /* 设置分页信息 */
    var tasklistPageInfo = null;
    function bindPageInfo(){
        tasklistPageInfo = new Pagination({
            selector: "#paginationhis",
            onchange: function(pageInfo){
                vmtasklisthis.curPage = pageInfo.curpage;
                getTaskListHistory();
            }
        });
        resize_tasklisthis();
    }

    // 处理页面高度
    function resize_tasklisthis(){
        var page_h = $(window).height();
        var obj = $("#" + avalon.vmodels.contenttask.visibleIndex);
        if (obj.attr("class")) {
            var top_h = obj.offset().top;
            obj.height(page_h - top_h - 55); //55: 页面间距 & 分页
        }
    }

    function clearData(data) {
        var d = data || {},
            m = vmtasklisthis.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmtasklisthis.form[i] = d[i];
            } else {
                vmtasklisthis.form[i] = null;
            }
        }
    }

    /* ajax取数 */
    function getTaskListHistory(){
        if(!vmtasklisthis.curPage){
            vmtasklisthis.curPage = 1;
        }
        if (vmtasklisthis.curPage < 1) return;
        Common.ajax({url: servicePath.task + '/v1/callcenter/task/local/list', type: "GET",
             data:{
                 taskNo: vmtasklisthis.form.taskNo,
                 title: vmtasklisthis.form.title,
                 startTime: vmtasklisthis.form.start_time_his,
                 endTime: vmtasklisthis.form.end_time_his,
                 businessType: vmtasklisthis.form.businessType,
                 levelType: vmtasklisthis.form.levelType,
                 projectCode: vmtasklisthis.form.projectCode,
                 houseCode: vmtasklisthis.form.houseCode,
                 mobile: vmtasklisthis.form.mobile,
                 source: vmtasklisthis.form.taskSource,
                 status: vmtasklisthis.form.status,
                 curPage: vmtasklisthis.curPage,
                 pageSize: vmtasklisthis.pageSize
             },
             success: function(data) {
                var html = "<tr class='nothing'><td colspan='20'>暂无数据</td></tr>";
                /* 渲染table */
                if(data.list != undefined)
                {
                    if(data.list.length > 0)
                    {
                        html = template('tasklistdatahis', { list: data.list} );
                    }
                    /* 更新分页控件 */
                    var pinfo = data.pagination;
                    tasklistPageInfo.render({
                        curpage: pinfo.curPage,
                        pagesize: pinfo.pageSize,
                        totalpage: pinfo.totalPage,
                        totalsize: pinfo.totalSize
                    });
                    tasklistPageInfo.pagesize = pinfo.pageSize;
                }
                $('#tbody_tasklisthis').html(html);
            },
            error: function() {
            },
            complete: function() {
            }
        });
    }

    function bindEvent() {
        // 自动完成
        $(".autocomplete-min").each(function() {
            var that = $(this);
            var target = that.attr("target");
            that.on("click", "li", function() {
                var li = $(this),
                    id = li.attr("data-id"),
                    code = li.attr("data-code"),
                    text = li.attr("data-text");
                vmtasklisthis[target + "_auto"].visible = false;
                vmtasklisthis.form[target + "Id"] = id;
                vmtasklisthis.form[target + "Code"] = code;
                vmtasklisthis.form[target + "Name"] = text;
            })
        });

        // 项目名称 － 行点击
        $("#tbody_tasklisthis").on("click","a",function(){
            var id = $(this).attr("data-id");
            taskquery.active();
            taskquery.view({
                id: id,
                isLocal: true
            });
        });
    }
    
    /*
     * 自动搜索项目房屋
     */
    var autofunc = {};
    var getProject_handle = null;
    autofunc.getproject_ajax = function(projectName) {
        if (getProject_handle) {
            getProject_handle.abort();
        }
        vmtasklisthis.project_auto.visible = true;
        vmtasklisthis.project_auto.loading = true;
        getProject_handle = Common.ajax({
            url: servicePath.house + "/api/v1/projects",
            type: "GET",
            data: {
                projectName: projectName
            },
            success: function(res) {
                vmtasklisthis.project_auto.list = res;
            },
            error: function() {

            },
            complete: function() {
                vmtasklisthis.project_auto.loading = false;
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
            if (res[i]["name"].indexOf(name) > -1) {
                arr.push(res[i]);
            }
        }
        return arr;
    }

    autofunc.getbuilding_ajax = function(buildName) {
        if (getBuilding_handle) {
            getBuilding_handle.abort();
        }
        var projectId = vmtasklisthis.form.projectId;
        vmtasklisthis.building_auto.list = [];
        vmtasklisthis.building_auto.visible = true;
        vmtasklisthis.building_auto.loading = true;
        if (getBuilding_result[projectId]) {
            var arr = filterBuilding(getBuilding_result[projectId], buildName);
            vmtasklisthis.building_auto.list = arr;
            vmtasklisthis.building_auto.loading = false;
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
                vmtasklisthis.building_auto.list = arr;
            },
            error: function() {

            },
            complete: function() {
                vmtasklisthis.building_auto.loading = false;
            }
        })
    }

    // 房屋搜索 
    var getHouse_handle = null;
    autofunc.gethouse_ajax = function(houseName) {
        if (getHouse_handle) {
            getHouse_handle.abort();
        }
        vmtasklisthis.house_auto.visible = true;
        vmtasklisthis.house_auto.loading = true;
        var projectId = vmtasklisthis.form.projectId,
            buildingId = vmtasklisthis.form.buildingId
        getHouse_handle = Common.ajax({
            url: servicePath.house + "/v1/project/" + projectId + "/" + buildingId + "/houses",
            type: "GET",
            data: {
                houseName: houseName
            },
            success: function(res) {
                vmtasklisthis.house_auto.list = res;
            },
            error: function() {

            },
            complete: function() {
                vmtasklisthis.house_auto.loading = false;
            }
        })
    }

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        avalon.vmodels["contenttask"].src_tasklisthistory = "views/tasklisthistory/index.html";
        setTimeout(function(){
            getTaskListHistory();
            getTaskLevelType();
            bindPageInfo();
            bindEvent();
        });

        // 窗口改变大小事件
        window.onresize = function(){
            resize_tasklisthis();
        };
    }

    // 加载任务级别字典数据
    function getTaskLevelType(){
        Common.ajax({
            url: servicePath.task + '/v1/dict/TaskLevelType/items',
            type: "GET",
            data: { },
            success: function(data) {
                vmtasklisthis.task.data = data;
            },
            error: function() {},
            complete: function() {}
        });

        Common.ajax({
            url: servicePath.task + '/v1/dict/TaskSource/items',
            type: "GET",
            data: { },
            success: function(data) {
                vmtasklisthis.taskSource.data = data;
            },
            error: function() {},
            complete: function() {}
        });
    }

    function active() {
        init();
    }

    return {
        active: active,
        clearData: clearData
    }
});