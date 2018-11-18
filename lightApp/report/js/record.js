var initData = {
    effectDate: currentDate, // 生效日期
    emprAutoDate: currentDate, //  签署日期
    decorationBeginDate: currentDate, // 装修开始日期
    decorationEndDate: currentDate, // 装修结束
    deUnAurDate: currentDate, // 装修施工单位签字日期
    propAuraDate: currentDate, // 物业服务中心签字日期
    serialNumber: "", // 序列号
    employerName: "", // 业主姓名
    roomNumber: "", // 房号
    employerPhone: "", // 手机号
    introducer: "",
    decorationPerson: "", // 装修负责人
    decorationUnit: "", // 装修单位
    decorationPhone: "", // 联系电话
    incoherenceOfRecords: "", // 施工延迟记录：
    employerAutograph: "", // 业主签字
    constructionUnit: "", // 装修施工单位
    decorUnitAuraph: "", // 装修施工单位签字
    propertyService: "", // 物业服务中心
    propertyAuraph: "", // 物业服务中心经办人
    remarks: "", // 备注
    donstructionContent: "",
    isprint: 0
};
var vm = avalon.define({
    $id: "decorationRecord",
    popShow: 0,
    donstructionShow: 0,
    passValidate: 1,
    data: initData,
    popTable: [],
    showSearching: 0, //显示正在搜索
    noSearchData: 0,
    showItem: function (item) {
        vm[item] = 1;
    },
    hideItem: function (item) {
        setTimeout(function () {
            vm[item] = 0;
        }, 300)
    },
    fillRow: function (el) {
        vm.data.employerName = el.fullName;
        vm.data.roomNumber = el.contactAddr;
        vm.data.employerPhone = el.mainMobile;
        vm.hideItem("popShow");
    },
    tocri: function () {
        var data = JSON.stringify(vm.$model.data);
        localStorage.constrCertificate = data;
        location.href = "prove.html?editeList=1";
    },
    hidePopTable: function () {
        setTimeout(function () {
            vm.popShow = 0;
        }, 300)
    },
    vertify: function () {
        var data = $("form").serializeArray();
        var datajson = {};
        for (var i = 0; i < data.length; i++) {
            datajson[data[i].name] = data[i].value;
        }
        if ($("body").find("div.input-invalidate").length) {
            //alert("请填写正确的值");
            require(["../../vk.modal"], function (modal) {
                modal("alert", "请填写所有必填项");
            })
            return false;
        }
        if ($("body").find("input.input-invalidate").length) {
            //alert("请填写正确的值");
            require(["../../vk.modal"], function (modal) {
                modal("alert", "请填写正确的值");
            })
            return false;
        }
        return datajson;
    },
    save: function (isprint) {
        var flag = vm.vertify();
        if (!flag) {
            return;
        }
        if (location.search.indexOf("editeList=1") >= 0 && flag.serialNumber) {
            $.ajax({
                method: "PUT",
                url: ajaxUrlConfig.initCecoRecor,
                dataType: "json",
                data: flag,
                success: function (data) {
                    if (data.code == "200" && !isprint) {
                        //alert("修改成功");
                        require(["../../vk.modal"], function (modal) {
                            modal("alert", {
                                text: "修改成功",
                                ok: function () {
                                    location.href = "index.html";
                                }
                            })
                        })
                    }
                }
            }).fail(function () {
                if (!isprint)
                    require(["../../vk.modal"], function (modal) {
                        modal("alert", "修改失败");
                    })
            })
        } else {
            $.ajax({
                method: "POST",
                url: ajaxUrlConfig.initCecoRecor,
                dataType: "json",
                data: flag,
                success: function (data) {
                    if (data.code == "201" && !isprint) {
                        //alert("新建成功");
                        require(["../../vk.modal"], function (modal) {
                            modal("alert", {
                                text: "保存成功",
                                ok: function () {
                                    location.href = "index.html";
                                }
                            })
                        })
                    }
                }
            }).fail(function () {
                if (!isprint)
                    require(["../../vk.modal"], function (modal) {
                        modal("alert", "保存失败");
                    })
            })
        }
    },
    validate: validate,
    print: function () {
        vm.data.isprint = 1;
        window.print();
        setTimeout(function () {
            vm.save(1);
        }, 400)
    }
})

var watchEn = watchEmployerName();

function watchEmployerName() {
    return vm.$watch("data.employerName", function (v) {
        if (v) {
            vm.showSearching = 1;
            vm.noSearchData = 0;
            vm.popShow = 1;
            $.ajax({
                method: "POST",
                url: ajaxUrlConfig.initCecoRecor + "/getPerson",
                dataType: "json",
                data: {
                    employerName: v
                },
                success: function (data) {
                    vm.popTable = data.data.slice(0, 15);
                    if (!vm.popTable.size()) {
                        vm.noSearchData = 1;
                    }
                    vm.showSearching = 0;
                }
            })
        } else {
            vm.hideItem("popShow");
        }
    })
}

$(function () {
    var serialNumber = localStorage.serialNumber;
    if (serialNumber) {
        $.get("/DecorationForm/initCecoRecor", {
            serialNumber: serialNumber
        }, function (data) {
            if (data.code === "200") {
                watchEn();
                vm.data = data.data[0];
                var filters = avalon.filters.date;
                if (vm.data.isprint === null) vm.data.isprint = 0;
                vm.data.decorationBeginDate = vm.data.decorationBeginDate ? filters(vm.data.decorationBeginDate, "yyyy-M-d") : currentDate;
                vm.data.decorationEndDate = vm.data.decorationEndDate ? filters(vm.data.decorationEndDate, "yyyy-M-d") : currentDate;
                vm.data.propAuraDate = vm.data.propAuraDate ? filters(vm.data.propAuraDate, "yyyy-M-d") : currentDate;
                vm.data.emprAutoDate = vm.data.emprAutoDate ? filters(vm.data.emprAutoDate, "yyyy-M-d") : currentDate;
                vm.data.deUnAurDate = vm.data.deUnAurDate ? filters(vm.data.deUnAurDate, "yyyy-M-d") : currentDate;
                vm.data.effectDate = vm.data.effectDate ? filters(vm.data.effectDate, "yyyy-M-d") : currentDate;
            }
            watchEmployerName();
            localStorage.removeItem("serialNumber");
        }, "json")
    }
})
