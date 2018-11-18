define(["text!views/contentsystem/index.html"], function(modelHtml) {
    var hasInit = false;
    var model
    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;

        // avalon.templateCache["views/contentsystem/index.html"] = modelHtml;
        // avalon.vmodels.root.taskSrc = "views/contentsystem/index.html";
        setTimeout(function() {
            // avalon.scan(null, model);
        })
    }

    function active() {
        init();
    }


    return {
        active: active
    }
});