define([], function() {
    var hasInit = false;
    var model = avalon.define({
        $id: "contentnotice",
        visibleIndex: "",
        show: function(type) {
            avalon.router.navigate("/contentnotice/" + type);
        },
        src_noticeinput: "",
        src_noticelist: ""
    });

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        setTimeout(function() {
            avalon.scan(null, model);
        })
    }

    function view(opts) {
        
    }

    function active(opts) {
        init(opts || {});
        view(opts || {});
    }


    return {
        active: active
    }
});