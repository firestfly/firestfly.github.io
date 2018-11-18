define([], function() {
    var hasInit = false;
    var model = avalon.define({
        $id: "contenttask",
        show: function(partName) {
            // model.visibleIndex = partName;
            avalon.router.redirect("/contenttask/" + partName);
        },
        visibleIndex: 'taskinput',
        src_task: '',
        src_taskinput: '',
        src_tasklist: '',
        src_taskquery: '',
        src_tasknotice: '',
        src_taskcall: '',
        src_custquery: '',
        src_taskovertimelist: '',

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
    })


    function init(wrap) {
        if (hasInit) {
            return;
        }
        hasInit = true;

        // avalon.templateCache["views/contenttask/index.html"] = modelHtml;
        // avalon.vmodels.root.taskSrc = "views/contenttask/index.html";
        setTimeout(function() {
            avalon.scan(null, model);
            bindEvent();
        })
    }

    function bindEvent() {
      $("#toggleSidebar").bind("click",function(){
          model.sidebarVisible = !model.sidebarVisible;
      });
    }

    function active(wrap) {
        init(wrap);
    }


    return {
        active: active
    }
});
