define([], function() {

    /* avalon */
    var hasInit = false;
    var vmgrupdate = avalon.define({
        $id: "grupdate",
        // 当前页码
        curPage: 1,
        pageSize: 10,
        totalSize: 0,
        paginationLoad: false,
        form: {
            // 查询时间段
            st_time: "",
            e_time: "",
            // 创建人
            gr_userName: "",
            // 管理中心
            gr_organizationId: "",
            gr_organizationText: "点击选择管理中心",
            // 项目
            gr_projectId: "",
            // 网格
            gr_gridId: "",
            // 操作类型
            changeType: ""
        },
        // 列表数据
        gr_data: {
            isLoading: true,
            list: []
        },
        // 管理中心
        gr_organization_vis: false,
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
        // 查询按钮事件
        search_event: function(e) {
            vmgrupdate.curPage = 1;
            gr_data_helper.getGrupdateData();
        },
        // 重置
        reset_event: function(e) {
            // 查询时间段
            $('.Wdate').val('');
            vmgrupdate.form.st_time = '';
            vmgrupdate.form.e_time = '';
            // 创建人
            vmgrupdate.form.gr_userName = '';
            // 操作类型
            vmgrupdate.form.changeType = '',
                // 管理中心、项目、网格
                vmgrupdate.cleanOrganization();
            // 重载数据
            vmgrupdate.curPage = 1;
            gr_data_helper.getGrupdateData();
        },
        // '管理中心' - 逻辑控制
        close: function() {
            vmgrupdate.gr_organization_vis = false;
        },
        cleanOrganization: function() {
            // 管理中心
            vmgrupdate.form.gr_organizationId = '';
            vmgrupdate.form.gr_organizationText = '点击选择管理中心';
            // 项目
            vmgrupdate.form.gr_projectId = '';
            vmgrupdate.project.list = [];
            // 网格
            vmgrupdate.form.gr_gridId = '';
            vmgrupdate.grid.list = [];
            // 隐藏当前选择区域
            vmgrupdate.gr_organization_vis = false;
        },
        organizationControl: function() {
            var menu_left = $("#left").width(),
                menu_top = $(".header").height();
            var that = $(this),
                target = that.attr('target'),
                top = $("input[name='" + target + "']").offset().top,
                left = $("input[name='" + target + "']").offset().left;
            // 设置选择管理中心界面的位置
            $("#gr_choose").css({
                "top": top - menu_top,
                "left": left - menu_left
            });
            // 显示｜隐藏
            vmgrupdate.gr_organization_vis = !vmgrupdate.gr_organization_vis;
        },
        export_event: function() {
            gr_data_helper.export_event();
        }
    });

    /* 获取数据类  列表|管理中心|项目|网格 */
    var cusup_pageInfo = null;
    var gr_data_helper = {

        // 获取管理中心数据
        getOrganization: function() {
            Common.ajax({
                url: Config["newAjaxUrl"].getOrganization,
                type: "GET",
                success: function(data) {
                    vmgrupdate.organization.list = data;
                    // 获取列表数据
                    gr_data_helper.getGrupdateData();
                    // 处理页面高度
                    // gr_data_helper.resizeHeight();
                    // 选择管理中心
                    gr_data_helper.bindEvent();
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 查询项目by管理中心
        getProject: function() {
            if (vmgrupdate.form.gr_organizationId == '') return;
            Common.ajax({
                url: Config["newAjaxUrl"].getProject,
                type: "GET",
                data: {
                    parentId: vmgrupdate.form.gr_organizationId
                },
                success: function(data) {
                    vmgrupdate.form.gr_projectId = '';
                    vmgrupdate.project.list = data;
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 查询网格by项目
        getGrid: function() {
            if (vmgrupdate.form.gr_projectId == '') return;
            Common.ajax({
                url: Config["newAjaxUrl"].getGrid,
                type: "GET",
                data: {
                    projectId: vmgrupdate.form.gr_projectId
                },
                success: function(data) {
                    vmgrupdate.grid.list = data;
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 获取列表数据
        getGrupdateData: function() {
            if (!vmgrupdate.curPage) {
                vmgrupdate.curPage = 1;
            }
            if (vmgrupdate.curPage < 1) return;
            vmgrupdate.gr_data.isLoading = true;
            vmgrupdate.gr_data.list = [];
            Common.ajax({
                url: Config["ajaxUrl"].getReport_relationChange,
                type: "GET",
                cache: false,
                data: {
                    curPage: vmgrupdate.curPage,
                    pageSize: vmgrupdate.pageSize,
                    modifyDateBegin: vmgrupdate.form.st_time,
                    modifyDateEnd: vmgrupdate.form.e_time,
                    userName: vmgrupdate.form.gr_userName,
                    changeType: vmgrupdate.form.changeType,
                    organizationId: vmgrupdate.form.gr_organizationId,
                    projectId: vmgrupdate.form.gr_projectId,
                    gridId: vmgrupdate.form.gr_gridId
                },
                success: function(data) {
                    vmgrupdate.gr_data.isLoading = false;
                    vmgrupdate.gr_data.list = data.list;
                    if (!vmgrupdate.paginationLoad) {
                        vmgrupdate.paginationLoad = true;
                        // 绑定分页
                        gr_data_helper.bindPageInfo();
                    }
                    /* 更新分页控件 */
                    var tlpinfo = data.pagination;
                    cusup_pageInfo.render({
                        curpage: tlpinfo.curPage,
                        pagesize: tlpinfo.pageSize,
                        totalpage: tlpinfo.totalPage,
                        totalsize: tlpinfo.totalSize
                    });
                    vmgrupdate.curPage = tlpinfo.curPage;
                    vmgrupdate.totalSize = tlpinfo.totalSize;
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 设置分页信息
        bindPageInfo: function() {
            cusup_pageInfo = new Pagination({
                //template: "#paginationtmpl",
                selector: "#grupdate_pagination",
                onchange: function(pageInfo) {
                    vmgrupdate.curPage = pageInfo.curpage;
                    gr_data_helper.getGrupdateData();
                }
            });
        },
        // 导出excel
        export_event: function() {
            var _this = $(this);

            var exportUrl = Config["ajaxUrl"].export_relationChange +
                "?userName=" + vmgrupdate.form.gr_userName +
                "&changeType=" + vmgrupdate.form.changeType +
                "&modifyDateBegin=" + vmgrupdate.form.st_time +
                "&modifyDateEnd=" + vmgrupdate.form.e_time +
                "&access_token=" + Common.cookie('access_token');

            $('#grupdate_export').attr('src', exportUrl);

        },
        // 绑定事件
        bindEvent: function() {
            // 选择管理中心
            $("#gr_choose").on("click", 'li', function() {
                var text = $(this).attr('data-text'),
                    code = $(this).attr('data-id');
                if (!code) return;
                vmgrupdate.form.gr_organizationText = text;
                vmgrupdate.form.gr_organizationId = code;
                // 隐藏当前选择区域
                vmgrupdate.gr_organization_vis = false;
                // 查询项目by管理中心
                gr_data_helper.getProject();
            });

            // 项目变更时事件
            $("#gr_project").on("change", function() {
                // 获取选择项目下的网格
                vmgrupdate.form.gr_gridId = '';
                vmgrupdate.form.gr_projectId = $(this).val();
                gr_data_helper.getGrid();
            });

            // 浏览器大小改变事件
            /*window.onresize = function() {
                gr_data_helper.resizeHeight();
            };*/
        }

        // 处理页面高度
        /*resizeHeight: function() {
            var page_h = $(window).height();
            var obj = $('#grtable');
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
        //avalon.templateCache["contentgrupdate"] = modelHtml;
        //avalon.vmodels["root"].src_contentgrupdate = "contentgrupdate";
        setTimeout(function() {
            // 加载管理中心
            gr_data_helper.getOrganization();
        });
    }

    /* 清除表单 */
    function clearData(data) {
        var d = data || {},
            m = vmgrupdate.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmgrupdate.form[i] = d[i];
            } else {
                vmgrupdate.form[i] = null;
            }
        }
    }

    /* active */
    function active() {
        init();
        //avalon.vmodels.root.visibleIndex = 'grupdate';
    }

    return {
        active: active,
        clearData: clearData
    }
});
