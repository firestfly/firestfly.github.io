// 模块名：callinrecord
define([], function() {
    var hasInit = false;
    var listPager, getList_handle;

    var vmcallinrecord = avalon.define({
        $id: "callinrecord",
        // 当前页码
        curPage: 1,
        pageSize: 10,
        totalSize: 0,
    		paginationLoad: false,
        form: {
            fromTime: '',
            toTime: ''
        },
        data: {
            list: [],
            loading: false
        },
        // 查询
        search_event: function() {
            helper.ajaxGetList();
        },
        // 重置
        reset_event: function() {
            vmcallinrecord.form.fromTime = '';
            vmcallinrecord.form.toTime = '';
            vmcallinrecord.curPage = 1;
            helper.ajaxGetList();
        },
        // 导出
        export_event: function() {
            helper.export_event();
        }
    });

    var helper = {
        // 事件绑定
        bindEvent: function() {
            listPager = new Pagination({
                //template: "#paginationtmpl",
                selector: "#callinrecord_pager",
                onchange: function(pageInfo) {
                    vmcallinrecord.curPage = pageInfo.curpage;
                    helper.ajaxGetList(pageInfo.curPage);
                }
            });
        },

        // 获取查询列表
        ajaxGetList: function(pageIndex) {
            if (getList_handle) {
                getList_handle.abort();
            }
            if (!vmcallinrecord.curPage) {
                vmcallinrecord.curPage = 1;
            }
            if (vmcallinrecord.curPage < 1) return;
            // 初始化
            vmcallinrecord.data.loading = true;
            vmcallinrecord.data.list = [];
            getList_handle = Common.ajax({
                url: Config["ajaxUrl"].getReport_callinrecordChange,
                type: "GET",
                data: {
                    fromTime: vmcallinrecord.form.fromTime,
                    toTime: vmcallinrecord.form.toTime,
                    curPage: vmcallinrecord.curPage || 1,
                    pageSize: vmcallinrecord.pageSize || 10
                },
                success: function(res) {
                    vmcallinrecord.data.loading = false;
                    vmcallinrecord.data.list = res.list;
                      if (!vmcallinrecord.paginationLoad) {
            						vmcallinrecord.paginationLoad = true;
                        helper.bindEvent();
            					}
                      var pginfo = res.pagination;
                      listPager.render({
                          curpage: pginfo.curPage,
                          pagesize: pginfo.pageSize,
                          totalpage: pginfo.totalPage,
                          totalsize: pginfo.totalSize
                      });
                      vmcallinrecord.curPage = pginfo.curPage;
                      vmcallinrecord.totalSize = pginfo.totalSize;
                },
                complete: function() {
                    vmcallinrecord.data.loading = false;
                }
            })
        },

        // 导出excel
        export_event: function() {
            var _this = $(this);
            var exportUrl = Config["ajaxUrl"].export_callinrecordChange +
                "?fromTime=" + vmcallinrecord.form.fromTime +
                "&toTime=" + vmcallinrecord.form.toTime +
                "&access_token=" + Common.cookie('access_token');
            $('#callinrecord_export').attr('src', exportUrl);
        }
    }

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        setTimeout(function() {
            helper.ajaxGetList();
        });
    }

    function active() {
        init();
    }

    return {
        active: active
    }
})
