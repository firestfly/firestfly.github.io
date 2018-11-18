var data = {
    effectDate: currentDate,
    beginDate: currentDate,
    endDate: date2str(new Date(+new Date + 24 * 60 * 60 * 1000 * 3), "yyyy-M-d"),
    propAuraDate: currentDate,
    serialNumber: "",
    decorationUnit: "",
    houseName: "",
    delayRecord: "",
    propertyAuraph: "",
    autographForm: "",
    decorationContent: "",
    isPrint: 0
}
var vm = avalon.define({
    $id: "decoration",
    data: data,
    donstructionInput1: "",
    donstructionInput2: "",
    decorationContent: [],
    localDecoration: ["卧室","客厅","餐厅","厨房","卫生间","书房","阳台"],
    wallRenovation:["全屋翻新","卧室","客厅","餐厅","厨房","卫生间","书房","阳台","其他区域翻新"],
    print: function() {
        var second = $(".card").clone();
        $("body").append(second);
        //isprint: 0都未打印
        // 1只打印装修备案表
        // 2只打印施工证
        // 3都打印了
        $.ajax({
            method: "POST",
            url: ajaxUrlConfig.printLog,
            dataType: "json",
            data: {
                mode: "print",
                form: "constructionCard",
                serialNumber: vm.data.serialNumber
            },
            success: function(data) {}
        })
        window.print();
        second.remove();
        if (vm.data.isPrint == 2 || vm.data.isPrint == 3) {
            return;
        }
        vm.data.isPrint = (vm.data.isPrint % 2 == 1) ? 3 : 2;
        $.ajax({
            method: "PUT",
            url: ajaxUrlConfig.decorationRecord,
            dataType: "json",
            data: vm.data.$model,
            success: function(data) {}
        })

    },
    back: function() {
        location.href = path.server;
    }
})

function initDecorationContent() {
    var hasInput = vm.data.decorationContent.indexOf("#INPUT");
    var index = hasInput > -1 ? hasInput : vm.data.decorationContent.length;
    vm.decorationContent = vm.data.decorationContent.slice(0, index).split("#");
    var inputValueArr = vm.data.decorationContent.slice(hasInput + 8).split("#INPUT1#")[0].split("#INPUT2#");
    if (hasInput > -1) {
        vm.donstructionInput1 = inputValueArr[0] || "";
        vm.donstructionInput2 = inputValueArr[1] || "";
    }
}
$(function() {
    if (sessionStorage.constructionCertificate) {
        vm.data = JSON.parse(sessionStorage.constructionCertificate);
        var filters = avalon.filters.date;
        vm.data.beginDate = filters(vm.data.beginDate, "yyyy-M-d");
        vm.data.endDate = filters(vm.data.endDate, "yyyy-M-d");
        vm.data.effectDate = vm.data.effectDate ? filters(vm.data.effectDate, "yyyy-M-d") : currentDate;
        initDecorationContent();
    }
})
