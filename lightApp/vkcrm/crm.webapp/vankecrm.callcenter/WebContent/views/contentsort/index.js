define(["text!views/contentsort/index.html"], function(modelHtml) {
    var hasInit = false;

    var pager = {
        callin: null,
        callout: null
    };
    var handle_getData = {
        callin: null,
        callout: null
    };

    // 排名
    var contentsort = avalon.define({
        $id: "contentsort",
        // 如果group.class == callin , 则index ＝ callin
        // 如果group.class == callout , 则index ＝ callout
        // 如果group.class == all , 则index ＝ callin
        index: 'callin',
        // 当前用户所属组别
        group: {
            calssName: window["groupClassNameText"],
            class: window["hasGroupClassOperation"] // callin: 呼入组  callout: 呼出组  all: 呼入、呼出组
        },
        // 选项卡切换
        changeTab: function(index) {
            contentsort.index = index;
        }
    });

    // 呼入
    var callin = avalon.define({
        $id: "callin",
        form: {
            timeType: "1", // 时间类型
            sortType: "1" // 排行类型
        },
        callinlist: {
            loading: false,
            data: []
        },
        searchclick: function() {
            callin.getCallInListData();
        },
        resetclick: function() {
            callin.form.timeType = "1";
            callin.form.sortType = "1";
        },
        // 获取
        getCallInListData: function(pageIndex) {
            if (handle_getData.callin) {
                handle_getData.callin.abort();
            }
            var data = {
                timeType: callin.form["timeType"],
                sortType: callin.form["sortType"],
                pageIndex: pageIndex || '1',
                pageSize: 10
            };
            var _url_ = ""; // servicePath.tel + "/v1/notify/callin";
            if (_url_ == '') {
                alert("请求接口地址为空,请对_url_变量进行赋值，开发时使用这段提示！");
                return;
            }
            // 设置查询状态
            callin.callinlist.data = [];
            callin.callinlist.loading = true;
            // 发起请求
            handle_getData.callin = Common.ajax({
                url: _url_,
                type: "GET",
                data: data,
                success: function(res) {
                    callin.callinlist.loading = false;
                    if (res) {
                        callin.callinlist.data = res["list"] || [];
                        var pinfo = res["pagination"];
                        pager.callin.render({
                            curpage: pinfo.curPage,
                            pagesize: pinfo.pageSize,
                            totalpage: pinfo.totalPage,
                            totalsize: pinfo.totalSize
                        });
                    }
                },
                error: function() {
                    callin.callinlist.data = [];
                    callin.callinlist.loading = false;
                }
            })
        }
    });

    // 呼出
    var callout = avalon.define({
        $id: "callout",
        form: {
            timeType: "1", // 时间类型
            sortType: "1", // 排行类型
            skill: "1" // 技能组
        },
        calloutlist: {
            loading: false,
            data: []
        },
        searchclick: function() {
            callout.getCallOutListData();
        },
        resetclick: function() {
            callout.form.timeType = "1";
            callout.form.sortType = "1";
            callout.form.skill = "1";
        },
        // 获取呼出列表数据
        getCallOutListData: function(pageIndex) {
            if (handle_getData.callout) {
                handle_getData.callout.abort();
            }
            var data = {
                timeType: callout.form["timeType"],
                sortType: callout.form["sortType"],
                skill: callout.form["skill"],
                pageIndex: pageIndex || '1',
                pageSize: 10
            };
            var _url_ = ""; // servicePath.tel + "/v1/notify/callout";
            if (_url_ == '') {
                alert("请求接口地址为空,请对_url_变量进行赋值，开发时使用这段提示！");
                return;
            }
            // 设置查询状态
            callout.calloutlist.data = [];
            callout.calloutlist.loading = true;
            // 发起请求
            handle_getData.callout = Common.ajax({
                url: _url_,
                type: "GET",
                data: data,
                success: function(res) {
                    callout.calloutlist.loading = false;
                    if (res) {
                        callout.calloutlist.data = res["list"] || [];
                        var pinfo = res["pagination"];
                        pager.callout.render({
                            curpage: pinfo.curPage,
                            pagesize: pinfo.pageSize,
                            totalpage: pinfo.totalPage,
                            totalsize: pinfo.totalSize
                        });
                    }
                },
                error: function() {
                    callout.calloutlist.data = [];
                    callout.calloutlist.loading = false;
                }
            })
        }
    });

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        setTimeout(function() {
            avalon.scan(null, contentsort);
            avalon.scan(null, callin);
            avalon.scan(null, callout);
            pager["callin"] = new Pagination({
                selector: "#contentsort_callin_pager",
                onchange: function(pageInfo) {
                    callin.getCallInListData(pageInfo.curpage);
                }
            });
            pager["callout"] = new Pagination({
                selector: "#contentsort_callout_pager",
                onchange: function(pageInfo) {
                    callout.getCallOutListData(pageInfo.curpage);
                }
            });
            // 当前组别选项卡
            var type = window["hasGroupClassOperation"];
            switch (type) {
                case "all":
                    contentsort.index = 'callin';
                    callin.getCallInListData();
                    break;
                case "callin":
                    contentsort.index = 'callin';
                    callin.getCallInListData();
                    break;
                case "callout":
                    contentsort.index = 'callout';
                    callout.getCallOutListData();
                    break;
            }
        });
    }

    function active() {
        init();
    }
    return {
        active: active
    }
});
