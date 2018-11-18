define(["avalon", "text!./aaa.html"], function (avalon, aaa) {

    avalon.templateCache.bbb = aaa
    avalon.define({
        $id: "aaa",
        username: "司徒正美"
    })
    avalon.vmodels.root.page = "bbb"

})
