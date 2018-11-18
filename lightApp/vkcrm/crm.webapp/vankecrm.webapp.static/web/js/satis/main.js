require.config({ //第一块，配置
    baseUrl: './',
    paths: {
        mmRouter: "static/js/avalon/mmRouter",
        text: 'static/js/require/text',
        domReady: 'static/js/require/domReady',
        css: 'static/js/require/css.js',
        // plugs
        clock: 'static/js/plugs/clock/clock.js',
        validate: 'static/js/plugs/validate/validate.js',
        datepicker: "static/js/plugs/datepicker/WdatePicker.js"

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
// avalon.config({debug: false})
require(["domReady!", "mmRouter"], function() {
    var RegExpHook = {
        number: /[^\d]/g,
        mobile: /[^\d#\*]/g,
        /*
        a-z
        A-Z
        0-9
        +-:@    英文符合
        \u4e00-\u9fa5  中文
        \uFF0C  ，
        \u3002  。
        \uFF1F  ？
        \uFF01  ！
        \u201C  “
        \u201D  ”
        \uFF08  （
        \uFF09  ）
        \uFF1B  ；
        \u300A  《
        \u300B  》
        \u0025  %
        \u3001  、
        \u0020  空格
        \u000A  回车
        */
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

    avalon.templateCache.empty = " "
    var model = avalon.define({
        $id: "root",
        visibleIndex: "",
        view: function(target) {
            avalon.router.redirect(target);
        },
        // header
        headerboxVisible: false,
        headerboxToggle: function() {
            model.headerboxVisible = !model.headerboxVisible;
        }
    });
    /*
     * router
     */
    function requireObj(parentModel, module, query, callback) {
        require(["text!views/" + module + "/index.html", "views/" + module + "/index"], function(html, obj) {
            avalon.templateCache[module] = html;
            // avalon.vmodels[parentModel]["src_" + module] = module;
            avalon.vmodels[parentModel].visibleIndex = module;
            setTimeout(function() {
                obj.active && obj.active(query);
                callback && callback();
            })
        })
    }

    function callback() {
        var moduleName = this.params["module"],
            submoduleName = this.params["submodule"],
            thirdmoduleName = this.params["thirdmodule"],
            query = this.query;
        if (!moduleName) {
            moduleName = "queslist";
        }
        requireObj("root", moduleName, query, function() {
            if (!submoduleName) {
                return;
            }
            requireObj(moduleName, submoduleName, query, function() {
                if (!thirdmoduleName) {
                    return;
                }
                requireObj(submoduleName, query, thirdmoduleName)
            })
        });
    }
    avalon.router.get("/", callback);
    avalon.router.get("/:module", callback);
    avalon.router.get("/:module/:submodule", callback);
    // avalon.router.get("/:module/:submodule/:thirdmodule", callback);

    avalon.history.start({
        html5Mode: false
    });
    avalon.history.stop();
    /*
     * router end
     */
    /*
     * init
     */

    avalon.scan(document.body)
    $("#basecover").remove();
});