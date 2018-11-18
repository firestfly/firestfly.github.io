var data = {
    effectDate: currentDate,
    decorationBeginDate: currentDate,
    decorationEndDate: date2str(new Date(+new Date + 24 * 60 * 60 * 1000 * 3), "yyyy-M-d"),
    propAuraDate: currentDate,
    serialNumber: "",
    decorationUnit: "",
    roomNumber: "",
    incoherenceOfRecords: "",
    propertyAuraph: "",
    autographForm: "",
    donstructionContent: ""
}
var vm = avalon.define({
    $id: "decoration",
    year: getCurrentDate.year,
    month: getCurrentDate.month,
    day: getCurrentDate.day,
    data: data,
    print: function () {
        var second = $(".card").clone();
        $("body").append(second);
        window.print();
        second.remove();
    },
    back: function () {
        localStorage.serialNumber = vm.data.serialNumber || "";
        location.href = "record.html";
    }
})
$(function () {
    if (localStorage.constrCertificate) {
        vm.data = JSON.parse(localStorage.constrCertificate);
        var filters = avalon.filters.date;
        vm.data.decorationBeginDate = filters(vm.data.decorationBeginDate, "yyyy-M-d");
        vm.data.decorationEndDate = filters(vm.data.decorationEndDate, "yyyy-M-d");
        vm.data.propAuraDate = filters(vm.data.propAuraDate, "yyyy-M-d");
        localStorage.removeItem("constrCertificate");
    }
})
