define([], function() {
    var hasInit = false;
    var df_form_completed = "0", // 默认待跟进
        df_form_followName = Config.local.userName; // 默认处理人
    var model = avalon.define({
        $id: "taskovertimelist",
        search: function() {
            getFollowAbnormalTask_ajax();
        },
        reset: function() {
            model.form.taskNo = "";
            model.form.type = "";
            model.form.completed = df_form_completed;
            model.form.followName = df_form_followName;
        },
        form: {
            taskNo: '',
            type: '',
            completed: df_form_completed,
            followName: df_form_followName
        },
        list: [],
        listloading: false
    })
    var pager = null;
    // ajax
    var getFollowAbnormalTask_handle = null;

    function getFollowAbnormalTask_ajax(curPage) {
        if (getFollowAbnormalTask_handle) {
            getFollowAbnormalTask_handle.abort();
        }
        model.listloading = true;
        getFollowAbnormalTask_handle = Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/getFollowAbnormalTask/" + (curPage || 1) + "/10",
            type: "GET",
            data: {
                taskNo: model.form.taskNo,
                abnormal_type: model.form.type,
                completed: model.form.completed,
                followupName: model.form.followName
            },
            success: function(res) {
                if (res) {
                    model.list = [];
                    model.list = res.list;
                    var p = res["pagination"];
                    pager.render({
                        curpage: p["curPage"],
                        pagesize: p["pageSize"],
                        totalpage: p["totalPage"]
                    });
                }

            },
            error: function() {},
            complete: function() {
                model.listloading = false;
            }
        })
    }

    function bindEvent() {
        $("#taskovertimelist").on("click", "a", function() {
            var that = $(this),
                taskNo = that.attr("data-taskno"),
                cmp = that.attr("data-cmp"),
                // type = 0,已完成; 1,无类型; 2,超时未处理;
                type = cmp == '1' ? '0' : that.attr("data-abtype");
            avalon.router.redirect("/contenttask/taskquery?id=" + taskNo + "&abtype=" + type);
            // taskquery.active();
            // taskquery.view({
            // id: taskNo,
            // abtype: type
            // })
        })
    }

    // 处理页面高度
    function resize_tasklist() {
        var page_h = $(window).height();
        var obj = $("#" + avalon.vmodels.contenttask.visibleIndex);
        if (obj.attr("class")) {
            var top_h = obj.offset().top;
            obj.height(page_h - top_h - 55); //55: 页面间距 & 分页
        }
    }
    // 窗口改变大小事件
    window.onresize = function() {
        resize_tasklist();
    };

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        // dom绑定
        setTimeout(function() {
            pager = new Pagination({
                selector: "#taskovertimelist_pager",
                onchange: function(pageInfo) {
                    getFollowAbnormalTask_ajax(pageInfo.curpage)
                }
            })
            // getFollowAbnormalTask_ajax();
            bindEvent();
            resize_tasklist();
        })
    }

    function active() {
        init();
    }

    function view(opt) {}
    return {
        active: active,
        view: view
    }
});