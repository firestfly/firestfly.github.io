define(["views/sidebar/index"], function(sidebar) {
    var hasInit = false;
    var model = avalon.define({
        $id: "contentnewtask",
        show: function(partName) {
            // model.visibleIndex = partName;
            avalon.router.redirect("/contentnewtask/" + partName);
        },
        visibleIndex: "taskinput",
        src_task: "",
        src_taskinput: "",
        src_tasklist: "",
        src_taskquery: "",
        src_tasknotice: "",

        sidebarVisible: false,

        toggleSidebar: function() {
            model.sidebarVisible = !model.sidebarVisible;
        },
        sidebarRendered: function() {
            require(["views/sidebar/index"], function(sidebar) {
                sidebar.active();
            })
        }
    });
    model.$watch("visibleIndex", function(newValue, oldValue) {
        if (newValue != 'taskinput') {
            model.sidebarVisible = false;
        }
    });

    function init(param) {
        if (hasInit) {
            return;
        }
        hasInit = true;
        // avalon.templateCache["views/contenttask/index.html"] = modelHtml;
        // avalon.vmodels.root.taskSrc = "views/contenttask/index.html";
        setTimeout(function() {
            avalon.scan(null, model);
            if (param && param.callid && param.callnumber) {
                sidebar.active(param.callid, param.callnumber);
            }
            bindEvent();
        });
    }

    function bindEvent() {
      $("#toggleSidebar").bind("click",function(){
          model.sidebarVisible = !model.sidebarVisible;
      });
    }

    function active(param) {
        init(param);
    }


    return {
        active: active
    }
});
