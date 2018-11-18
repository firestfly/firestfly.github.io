var initData = {
    effectDate: currentDate,
    serialNumber: "serialNumber", // 序列号
    number: "VK-WY / TX08-K04-F2",
    version: "V1.0",
    registerTables: [{
        entryExitNum: "",
        roomNum: "1222",
        constructionName: "司法所",
        periodStartDate: currentDate,
        periodEndDate: currentDate,
        delayRecord: "无",
        recoveryDate: currentDate
    }],
    isprint: 0
};
for (var i = 0; i < 7; i++) {
    initData.registerTables.push({
        entryExitNum: "",
        roomNum: "",
        constructionName: "",
        periodStartDate: currentDate,
        periodEndDate: currentDate,
        delayRecord: "无",
        recoveryDate: currentDate
    })
}
var vm = avalon.define({
    $id: "register",
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
        console.log(datajson, vm.data)
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
            //vm.save(1);
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
