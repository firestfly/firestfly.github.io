define([], function() {
    var hasInit = false;
    var pager = null;
    var model = avalon.define({
        $id: "queslist",
        list: [],
        isloading: false
    })

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = false;
        // DOM渲染后执行，如事件绑定
        pager = new Pagination({
            selector: "#queslist_pager",
            onchange: function(pageinfo) {
                getQuestions_ajax(pageinfo.curpage);
            }
        })
        bindEvent();
        getQuestions_ajax();
    }
    var getQuestions_handle = null;

    function getQuestions_ajax(pageIndex) {
        if (getQuestions_handle) {
            getQuestions_handle.abort();
        }
        model.isloading = true;
        getQuestions_handle = Common.ajax({
            url: Config.ajaxPaths["getQuestions"] + (pageIndex || 1) + '/10',
            type: "GET",
            success: function(res) {
                model.list = res.list;
                var pi = res.pagination;
                pager.render({
                    curpage: pi["curPage"],
                    totalpage: pi["totalPage"]
                })
            },
            error: function() {},
            complete: function() {
                model.isloading = false;
            }
        })
    }

    function bindEvent() {
        // $("#queslistList").on("click", "a", function() {
        //     var that = $(this),
        //         action = that.attr("data-action");
        //     isDisabled = that.hasClass("disabled")
        //     if (isDisabled) {
        //         return;
        //     }
        //     switch (action) {
        //         case "answer":
        //             // 抽调问卷
        //             var id = $(this).attr("data-id");
        //             if (id) {
        //                 avalon.router.redirect("quescall?id=" + id)
        //             };
        //             break;
        //         case "edit":
        //             // 编辑问卷
        //             break;
        //         case "delete":
        //             // 删除问卷
        //             break;
        //     }
        // })

    }

    function active() {
        init();
    }

    function inactive() {

    }
    return {
        active: active,
        inactive: inactive
    }
});