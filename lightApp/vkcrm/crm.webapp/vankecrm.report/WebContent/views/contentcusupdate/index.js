define([], function() {

    /* avalon */
    var hasInit = false;
    var vmcusupdate = avalon.define({
        $id: "cusupdate",
        // 当前页码
        curPage: 1,
        pageSize: 10,
        totalSize: 0,
        paginationLoad: false,
        form: {
            // 查询时间段
            start_time: "",
            end_time: "",
            // 创建人
            userName: "",
            // 管理中心
            organizationId: "",
            organizationText: "点击选择管理中心",
            // 项目
            projectId: "",
            // 网格
            gridId: "",
            // 修改字段
            modifyField: "",
            // 客户姓名
            customerName: ""
        },
        // 列表数据
        data: {
            isLoading: true,
            list: []
        },
        // 管理中心
        organization_vis: false,
        organization: {
            list: []
        },
        // 项目
        project: {
            list: []
        },
        // 网格
        grid: {
            list: []
        },
        // 修改字段
        modifyField:{
            list: []
        },
        // 查询按钮事件
        search_event: function(e) {
            vmcusupdate.curPage = 1;
            cus_data_helper.getCusupdateData();
        },
        // 重置
        reset_event: function(e) {
            // 查询时间段
            $('.Wdate').val('');
            vmcusupdate.form.start_time = '';
            vmcusupdate.form.end_time = '';
            // 创建人
            vmcusupdate.form.userName = '';
            // 修改字段
            vmcusupdate.form.modifyField = '';
            vmcusupdate.form.customerName = '';
            // 管理中心、项目、网格
            vmcusupdate.cleanOrganization();
            // 重载数据
            vmcusupdate.curPage = 1;
            cus_data_helper.getCusupdateData();
        },
        // '管理中心' - 逻辑控制
        close: function() {
            vmcusupdate.organization_vis = false;
        },
        cleanOrganization: function() {
            // 管理中心
            vmcusupdate.form.organizationId = '';
            vmcusupdate.form.organizationText = '点击选择管理中心';
            // 项目
            vmcusupdate.form.projectId = '';
            vmcusupdate.project.list = [];
            // 网格
            vmcusupdate.form.gridId = '';
            vmcusupdate.grid.list = [];
            // 隐藏当前选择区域
            vmcusupdate.organization_vis = false;
        },
        organizationControl: function() {
            var menu_left = $("#left").width(),
                menu_top = $(".header").height();
            var that = $(this),
                target = that.attr('target'),
                top = $("input[name='" + target + "']").offset().top,
                left = $("input[name='" + target + "']").offset().left;
            // 设置选择管理中心界面的位置
            $("#cus_choose").css({
                "top": (top - menu_top) + 'px',
                "left": (left - menu_left) + 'px'
            });
            // 显示｜隐藏
            vmcusupdate.organization_vis = !vmcusupdate.organization_vis;
        },
        // 导出
        export_event: function() {
            cus_data_helper.export_event();
        }
    });

    /* 获取数据类  列表|管理中心|项目|网格 */
    var cusup_pageInfo = null;
    var cus_data_helper = {

        // 获取管理中心数据
        getOrganization: function() {
            Common.ajax({
                url: Config["newAjaxUrl"].getOrganization,
                type: "GET",
                success: function(data) {
                    vmcusupdate.organization.list = data;
                    // 获取列表数据
                    cus_data_helper.getCusupdateData();
                    // 处理页面高度
                    // cus_data_helper.resizeHeight();
                    // 选择管理中心
                    cus_data_helper.bindEvent();
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 查询项目by管理中心
        getProject: function() {
            if (vmcusupdate.form.organizationId == '') return;
            Common.ajax({
                url: Config["newAjaxUrl"].getProject,
                type: "GET",
                data: {
                    parentId: vmcusupdate.form.organizationId
                },
                success: function(data) {
                    vmcusupdate.form.projectId = '';
                    vmcusupdate.project.list = data;
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 查询网格by项目
        getGrid: function() {
            if (vmcusupdate.form.projectId == '') return;
            Common.ajax({
                url: Config["newAjaxUrl"].getGrid,
                type: "GET",
                data: {
                    projectId: vmcusupdate.form.projectId
                },
                success: function(data) {
                    vmcusupdate.grid.list = data;
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 获取字典(修改字段)
        getDictionary: function() {
            Common.ajax({
                url: Config["newAjaxUrl"].getModifyField,
                type: "GET",
                data: {},
                success: function(data) {
                  vmcusupdate.modifyField.list = data;
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 获取列表数据
        getCusupdateData: function() {
            if (!vmcusupdate.curPage) {
                vmcusupdate.curPage = 1;
            }
            if (vmcusupdate.curPage < 1) return;
            vmcusupdate.data.isLoading = true;
            vmcusupdate.data.list = [];
            Common.ajax({
                url: Config["ajaxUrl"].getReport_customerModify,
                type: "GET",
                cache: false,
                data: {
                    curPage: vmcusupdate.curPage,
                    pageSize: vmcusupdate.pageSize,
                    modifyDateBegin: vmcusupdate.form.start_time,
                    modifyDateEnd: vmcusupdate.form.end_time,
                    userName: vmcusupdate.form.userName,
                    modifyField: vmcusupdate.form.modifyField,
                    customerName: vmcusupdate.form.customerName,
                    organizationId: vmcusupdate.form.organizationId,
                    projectId: vmcusupdate.form.projectId,
                    gridId: vmcusupdate.form.gridId
                },
                success: function(data) {
                    vmcusupdate.data.isLoading = false;
                    vmcusupdate.data.list = data.list;
                    if (!vmcusupdate.paginationLoad) {
                        vmcusupdate.paginationLoad = true;
                        // 绑定分页
                        cus_data_helper.bindPageInfo();
                    }
                    /* 更新分页控件 */
                    var tlpinfo = data.pagination;
                    cusup_pageInfo.render({
                        curpage: tlpinfo.curPage,
                        pagesize: tlpinfo.pageSize,
                        totalpage: tlpinfo.totalPage,
                        totalsize: tlpinfo.totalSize
                    });
                    vmcusupdate.curPage = tlpinfo.curPage;
                    vmcusupdate.totalSize = tlpinfo.totalSize;
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 导出excel
        export_event: function() {
            var _this = $(this);
            var exportUrl = Config["ajaxUrl"].export_customerModify +
                "?userName=" + vmcusupdate.form.userName +
                "&modifyField=" + vmcusupdate.form.modifyField +
                "&modifyDateBegin=" + vmcusupdate.form.start_time +
                "&modifyDateEnd=" + vmcusupdate.form.end_time +
                "&customerName=" + vmcusupdate.form.customerName +
                "&access_token=" + Common.cookie('access_token');
            $('#cusupdate_export').attr('src', exportUrl);
        },

        // 设置分页信息
        bindPageInfo: function() {
            cusup_pageInfo = new Pagination({
                // template: "#paginationtmpl",
                selector: "#cc_pagination",
                onchange: function(pageInfo) {
                    vmcusupdate.curPage = pageInfo.curpage;
                    cus_data_helper.getCusupdateData();
                }
            });
        },

        // 绑定事件
        bindEvent: function() {
            // 选择管理中心
            $("#cus_choose").on("click", 'li', function() {
                var text = $(this).attr('data-text'),
                    code = $(this).attr('data-id');
                if (!code) return;
                vmcusupdate.form.organizationText = text;
                vmcusupdate.form.organizationId = code;
                // 隐藏当前选择区域
                vmcusupdate.organization_vis = false;
                // 查询项目by管理中心
                cus_data_helper.getProject();
            });
            // 项目变更时事件
            $("#cs_project").on("change", function() {
                // 获取选择项目下的网格
                vmcusupdate.form.gridId = '';
                vmcusupdate.form.projectId = $(this).val();
                cus_data_helper.getGrid();
            });

            // 浏览器大小改变事件
            /*window.onresize = function() {
                cus_data_helper.resizeHeight();
            };*/
        }

        // 处理页面高度
        /*resizeHeight: function() {
            var page_h = $(window).height();
            var obj = $('#custable');
            var top_h = obj.offset().top;
            obj.height(page_h - top_h - 55); // 55: 分页和页面间距的高度
        }*/
    }

    /* 初始化 */
    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        /* 模版缓存 */
        //avalon.templateCache["contentcusupdate"] = modelHtml;
        //avalon.vmodels["root"].src_contentcusupdate = "contentcusupdate";
        setTimeout(function() {
            // 加载管理中心
            cus_data_helper.getOrganization();
            // 修改字段
            cus_data_helper.getDictionary();
        });
    }

    /* 清除表单 */
    function clearData(data) {
        var d = data || {},
            m = vmcusupdate.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmcusupdate.form[i] = d[i];
            } else {
                vmcusupdate.form[i] = null;
            }
        }
    }

    /* active */
    function active() {
        init();
        //avalon.vmodels.root.visibleIndex = 'cusupdate';
    }

    return {
        active: active,
        clearData: clearData
    }
});
