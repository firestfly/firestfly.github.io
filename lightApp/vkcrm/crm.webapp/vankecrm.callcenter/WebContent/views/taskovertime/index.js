define(['text!views/taskovertime/index.html'], function(modelHtml) {
    var hasInit = false;


    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        avalon.templateCache["taskovertime"] = modelHtml;
        avalon.vmodels["contenttask"].src_taskovertime = "taskovertime";
        // dom绑定
        setTimeout(function() {
        })
    }

    function active() {
        init();
        avalon.vmodels.contenttask.visibleIndex = 'taskovertime';
        view();
    }

    function view(opt) {}
    return {
        active: active,
        view: view
    }
});