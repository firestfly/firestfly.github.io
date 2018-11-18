var initData = {
    effectDate: currentDate,
    department: "departmentdd", // 部门
    startTime: currentDate, // 日期
    roomNum: "roomNum", // 房号
    houseProperty: "houseProperty", // 房屋性质
    bidPerson: "bidPerson", // 申办人
    idNum: "idNum", // 证件号码
    serialNumber: "serialNumber", // 序列号
    materialList: [{
        sortNum: "1",
        materialName: "铝合金材料",
        num: "23",
        model: "黑热",
        remark: "该物品很好"
    }],
    carNum: "carNum",
    carModels: "carModels",
    driverLicense: "driverLicense",
    archivesNum: "archivesNum",
    authority: "authority",
    carColor: "carColor",
    otherNum: "otherNum",
    handlingDepartment: "handlingDepartment",
    cashier: "cashier",
    securityOfficer: "securityOfficer",
    remark: "remark",
    isprint: 0,
    moveReason: "装修完成"
};
for (var i = 0; i < 6; i++) {
    initData.materialList.push({
        sortNum: "",
        materialName: "",
        num: "",
        model: "",
        remark: ""
    })
}
var vm = avalon.define({
    $id: "material",
    data: initData,
    tocri: function () {
        var data = JSON.stringify(vm.$model.data);
        localStorage.constrCertificate = data;
        location.href = "prove.html?editeList=1";
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
        console.log(vm.$model.data)
        console.log(datajson)
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
                contentType: "application/json",
                processData: false,
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
                contentType: "application/json",
                processData: false,
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
