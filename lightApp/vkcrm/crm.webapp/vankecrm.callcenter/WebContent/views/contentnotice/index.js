define(["text!views/contentnotice/index.html"], function(modelHtml) {
    var hasInit = false;
    var d = new Date();
    var df_form_endtime = avalon.filters.date(d, "yyyy-MM-dd 23:59:59"),
        df_form_starttime = avalon.filters.date(new Date(d - 604800000), "yyyy-MM-dd 00:00:00") //一周 = 7*24*60*60*1000 毫秒

    var model = avalon.define({
        $id: "contentnotice",
        index: "unread",
        form: {
            starttime: df_form_starttime,
            endtime: df_form_endtime,
            type: "",
            content: ""
        },
        unreadlist: {
            loading: false,
            data: []
        },
        readlist: {
            loading: false,
            data: []
        },
        searchclick: function() {
            ajax_getData();
        },
        resetclick: function() {
            model.form.starttime = df_form_starttime;
            model.form.endtime = df_form_endtime;
            model.form.type = "";
            model.form.content = "";
        },
        changeTab: function(index) {
            model.index = index;
        },
        markclick: ajax_markRead
    })
    var pager = {
            unread: null,
            read: null
        },
        handle_getData = {
            unread: null,
            read: null
        };
    /**
     * 标记为已阅
     * @return {undefined} [description]
     */
    var handle_markRead = null;

    function ajax_markRead() {
        if (handle_markRead) {
            handle_markRead.abort();
        }
        var data = {
            startTime: model.form["starttime"],
            endTime: model.form["endtime"],
            type: model.form["type"],
            content: model.form["content"]
        };
        Common.tip.add({
            text: "正在置为已阅",
            type: "success"
        });
        handle_markRead = Common.ajax({
            url: servicePath.tel + "/v1/notify/readAll",
            type: "POST",
            data: data,
            success: function(res) {
                //add by liaochao 20160216 begin
                model.unreadlist.data=[];
                //add by liaochao 20160216 end
                Common.tip.add({
                    text: "置为已阅",
                    type: "success"
                });
            },
            error: function() {
                Common.tip.add({
                    text: "设置失败",
                    type: "error"
                });
            }
        })
    }
    /**
     * 获取数据列表
     * @param  {int} pageIndex 分页索引
     * @return {undefined}           [description]
     */
    function ajax_getData(pageIndex) {
        if (handle_getData[index]) {
            handle_getData[index].abort();
        }
        var index = model.index;

        model[index + "list"].data = [];
        model[index + "list"].loading = true;
        var data = {
            startTime: model.form["starttime"],
            endTime: model.form["endtime"],
            type: model.form["type"],
            content: model.form["content"],
            pageIndex: pageIndex || '1',
            pageSize: 10
        };
        handle_getData[index] = Common.ajax({
            url: servicePath.tel + "/v1/notify/" + index,
            // url: "http://10.39.230.152:8080/s.tel/api/v1/notify/" + index,
            type: "GET",
            data: data,
            success: function(res) {
                model[index + "list"].loading = false;
                if (res) {
                    model[index + "list"].data = res["list"] || [];
                    var pinfo = res["pagination"];
                    // 暂无分页渲染
                    // return;
                    pager[index].render({
                        curpage: pinfo.curPage,
                        pagesize: pinfo.pageSize,
                        totalpage: pinfo.totalPage,
                        totalsize: pinfo.totalSize
                    });
                }

            },
            error: function() {
                model[index + "list"].loading = false;
            }
        })
    }

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;

        setTimeout(function() {
            avalon.scan(null, model);

            pager["unread"] = new Pagination({
                selector: "#contentnotice_unread_pager",
                onchange: function(pageInfo) {
                    ajax_getData(pageInfo.curpage);
                }
            });
            pager["read"] = new Pagination({
                selector: "#contentnotice_read_pager",
                onchange: function(pageInfo) {
                    ajax_getData(pageInfo.curpage);
                }
            });
        })
    }

    function active() {
        init();
    }


    return {
        active: active
    }
});