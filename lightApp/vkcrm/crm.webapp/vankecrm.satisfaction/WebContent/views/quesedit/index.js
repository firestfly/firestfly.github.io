define([], function() {
    var hasInit = false;
    var jq_dialog;
    var model = avalon.define({
        $id: "quesedit",
        questionList: [{}, {}],
        // event
        addQuest: function() {
            jq_dialog.modal("show");
        }
    })

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        setTimeout(function() {
            // DOM渲染后执行，如事件绑定
            avalon.scan(null, model);
            // 变量绑定
            jq_dialog = $("#questionEditDialog");
        });
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