require.config({
    baseUrl: './',
    paths: {
        mmRouter: "static/dep/avalon/mmRouter",
        text: 'static/dep/require/text',
        domReady: 'static/dep/require/domReady',
        css: 'static/dep/require/css',
        // plugs
        validate: 'static/dep/validate/validate',
        datepicker: "static/dep/datepicker/WdatePicker",
        // avalon plugs
        choose: "static/js/avalon/choose/widget"

    },
    priority: ['text', 'css'],
    shim: {
        datepicker: {
            exports: "datepicker"
        },
        jquery: {
            exports: "jQuery"
        },
        avalon: {
            exports: "avalon"
        }
    }
});

(function() {
    var RegExpHook = {
        number: /[^\d]/g,
        mobile: /[^\d#\*]/g,
        content: /[^a-z|A-Z|0-9|\u4e00-\u9fa5|\uFF0C\u3002\uFF1F\uFF01\u201C\u201D\uFF08\uFF09\uFF1B\u300A\u300B\u0025\u3001|+-:@|\u0020\u000A]/g
    }
    avalon.duplexHooks["mobile"] = {
        set: function(str, vm) {
            return str.replace(RegExpHook["mobile"], '');
        }
    }
    avalon.duplexHooks["digit"] = {
        set: function(str, vm) {
            return str.replace(RegExpHook["number"], '');
        }
    }
    avalon.duplexHooks["content"] = {
        set: function(str) {
            var s = str.replace(RegExpHook["content"], '');
            return s;
        }
    }
})();

require(["domReady!", "mmRouter", "choose"], function() {
    avalon.templateCache.empty = " ";
    var md_root = avalon.define({
        $id: "root",
        visibleIndex: '',
        src_base: 'empty',
        src_customer: 'empty',
        src_car: 'empty',
        src_pet: 'empty',
        src_quality: 'empty',
        src_cusupdate: 'empty',
        src_grupdate: 'empty',
        src_callintask: 'empty',
        src_callinrecord: 'empty',
        src_callincharts: 'empty',
        src_calloutdetail: 'empty',
        src_calloutcharts: 'empty',
        src_calloutstatus: 'empty',
        src_sfdetail: 'empty',
        src_sfprogress: 'empty',
        src_sfamass: 'empty',
        src_prjdetail: 'empty',

        sidebarVisible: false,
        toggleSidebar: function() {
            model.sidebarVisible = !model.sidebarVisible;
        },
        sidebarRendered: function() {}
    });
    md_root.$watch("visibleIndex", function(newValue, oldValue) {
        if (newValue) {
            require(["views/content" + newValue + '/index'], function(obj) {
                obj.active && obj.active();
            })
        }
        if (oldValue) {
            require(["views/content" + oldValue + '/index'], function(obj) {
                obj.inactive && obj.inactive();
            })
        }
    });

    // 左侧菜单列表
    $(".left").on("click", "li", function() {
        var data_type = $(this).attr("data-type");
        avalon.router.navigate(data_type);
        return;
        /*var data_type = $(this).attr("data-type");
        switch (data_type) {
            // 基础信息统计报表
            case "base":
                // 客户信息查询
            case "customer":
                // 车辆信息查询
            case "car":
                // 宠物信息查询
            case "pet":
                // 客户数据质量检查报表
            case "quality":
                // 客户修改纪录报表
            case "cusupdate":
                // 客房关系修改纪录报表
            case "grupdate":
                // 呼入-任务清单报表
            case "callintask":
                // 呼入-话务清单报表
            case "callinrecord":
                // 呼入-呼入组排行榜
            case "callincharts":
                // 外呼-外呼工作明细
            case "calloutdetail":
                // 外呼-外呼组排行榜
            case "calloutcharts":
                // 外呼-人员工作状态
            case "calloutstatus":
                // 满意度明细表
            case "sfdetail":
                // 调查进度
            case "sfprogress":
                // 进度积累
            case "sfamass":
                md_root.visibleIndex = data_type;
                break;
            default:
                break;
        }*/
    });

    /*
     * init
     */
    // md_root.visibleIndex = "callintask";
    avalon.scan(document.body);
    /**
     * router
     */
    function routerCallback() {
        var moduleName = this.params["module"] || Config["baseModule"],
            viewName = "content" + moduleName

        require(["text!views/" + viewName + "/index.html", "views/" + viewName + "/index"],
            function(html, obj) {
                /* 模版缓存 */
                avalon.templateCache[viewName] = html;
                md_root["src_" + moduleName] = viewName;

                md_root.visibleIndex = moduleName;
                obj.active();
            });
    }
    avalon.router.get("/", routerCallback);
    avalon.router.get("/:module", routerCallback);
    avalon.router.error(function() {
        avalon.router.navigate(Config["baseModule"]);
    });
    avalon.history.start({
        html5Mode: false
    });
});