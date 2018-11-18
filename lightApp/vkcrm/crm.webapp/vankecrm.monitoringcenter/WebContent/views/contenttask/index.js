define(["datepicker"], function() {
    var hasInit = false;
    var model = avalon.define({
        $id: "contenttask",
        visibleIndex: '',
        show: function(type) {
            avalon.router.navigate("/contenttask/" + type);
        },
        src_tasklist: "",
        src_taskinfo: "",
        src_taskinput: "",
        src_taskquery: ""
    });

    function view(opts) {
        var moduleName = opts.module || 'tasklist';
        model.visibleIndex = moduleName;
    }

    function init(opts) {
        if (hasInit) {
            return;
        }
        hasInit = true;
        setTimeout(function() {
            avalon.scan(null, model);
        })
    }

    function active(opts) {
        init(opts || {});
        view(opts || {});
    }


    return {
        active: active,
        view: view
    }
});