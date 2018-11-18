;
(function() {
    var initData = {
        effectDate: currentDate, // 生效日期
        beginDate: currentDate, // 装修开始日期
        endDate: date2str(new Date(+new Date + 24 * 60 * 60 * 1000 * 3), "yyyy-M-d"), // 装修结束
        serialNumber: "", // 序列号
        customerName: "", // 业主姓名
        houseName: "", // 房号
        mobilePhone: "", // 手机号
        referrals: "",
        decorationName: "", // 装修负责人
        decorationUnit: "", // 装修单位
        decorationPhone: "", // 联系电话
        delayRecord: "", // 施工延迟记录：
        constructionUnit: "", // 装修施工单位
        serviceCenter: "", // 物业服务中心
        remarks: "", // 备注
        decorationContent: "",
        isPrint: 0
    };
    var vm = avalon.define({
        $id: "decorationRecord",
        data: initData,
        localDecoration: ["卧室", "客厅", "餐厅", "厨房", "卫生间", "书房", "阳台"],
        wallRenovation: ["全屋翻新", "卧室", "客厅", "餐厅", "厨房", "卫生间", "书房", "阳台", "其他区域翻新"],
        houseList: [],
        showSearching: 0, //显示正在搜索
        noSearchData: 0,
        searchHouse: function() {
            var v = vm.data.houseName;
            vm.showSearching = 1;
            $.ajax({
                method: "GET",
                url: ajaxUrlConfig.decorationRecord,
                dataType: "json",
                data: {
                    houseName: v
                },
                success: function(data) {
                    vm.houseList = data || [];
                    if(data.length === 0) {
                        vm.noSearchData = 1;
                    }
                    vm.showSearching = 0;
                }
            }).fail(function(){
                vm.noSearchData = 1;
                vm.showSearching = 0;
            })
        },
        fillRow: function(){
            vm.data.customerName = "周俊涛";
            vm.data.mobilePhone = "13044384462";
            vm.houseList = [];
        },
        donstructionInput1: "", // 绑定装修备案内容第一个输入框
        donstructionInput2: "", // 绑定装修备案内容第二个输入框
        decorationContent: [], //包含装修内容数据的数组
        removeArrayItem: function(arr, item) {
            var index = arr.indexOf(item);
            arr.removeAt(index);
        },
        checkItem: function(index, ev, item) {
            if (+vm.data.isPrint != 0) return;

            var siblingsDecorationItem = $(this).siblings(".decorationItem");
            var $target = $(ev.target);
            val = $target.data("val");
            if (!val || !$target.hasClass("icon-check-empty")) return;

            //通过给i元素添加checked样式类标志是否选中
            $target.toggleClass("checked");
            var hasChecked = $target.hasClass("checked");
            if (index == 0) {
                // 第一项和另外2项互斥
                if (hasChecked) {
                    vm.decorationContent = [val + "____" + index];
                } else {
                    vm.removeArrayItem(vm.decorationContent, "全屋装修____0");
                }
            } else {
                vm.removeArrayItem(vm.decorationContent, "全屋装修____0");
                if (hasChecked) {
                    if (val === "全屋翻新") {
                        $.each(["卧室", "客厅", "餐厅", "厨房", "卫生间", "书房", "阳台", "其他区域翻新"], function(i, v) {
                            vm.removeArrayItem(vm.decorationContent, v + "____2");
                        })
                        vm.decorationContent.push(val + "____" + index);
                    } else {
                        vm.removeArrayItem(vm.decorationContent, "全屋翻新____2");
                        vm.decorationContent.push(val + "____" + index);
                    }
                } else {
                    vm.removeArrayItem(vm.decorationContent, val + "____" + index);
                }
            }
        },
        verify: function() {
            var data = $("#decorationForm").serializeArray();
            var datajson = {};
            for (var i = 0; i < data.length; i++) {
                datajson[data[i].name] = data[i].value;
            }
            datajson.decorationContent = vm.decorationContent.join("#");

            if (vm.donstructionInput1) {
                datajson.decorationContent += "#INPUT1#" + vm.donstructionInput1;
            }
            if (vm.donstructionInput2) {
                datajson.decorationContent += "#INPUT2#" + vm.donstructionInput2;
            }
            vm.data.decorationContent = datajson.decorationContent;
            if ($("body").find("div.input-invalidate").length) {
                $.prompt("请填写所有必填项", {
                    title: "提示",
                    timeout: 2000,
                    buttons: { "确定": false }
                });
                return false;
            }
            if ($("body").find("input.input-invalidate").length) {
                $.prompt("请填写正确的值!", {
                    title: "提示",
                    timeout: 2000,
                    buttons: { "确定": false }
                });
                return false;
            }
            return datajson;
        },
        save: function(isPrint) {
            var flag = vm.verify();
            if (!flag) {
                return false;
            }
            if (isPrint == 1) {
                $.ajax({
                    method: "POST",
                    url: ajaxUrlConfig.printLog,
                    dataType: "json",
                    data: {
                        mode: "print",
                        form: "decorationRecord",
                        serialNumber: vm.data.serialNumber
                    },
                    success: function(data) {}
                })
                if (flag.isPrint == 1 || flag.isPrint == 3) {
                    // 已打印的就不能继续下面的修改和新增请求，返回true
                    vm.data.isPrint = flag.isPrint;
                    return true;
                }
                flag.isPrint = flag.isPrint > 1 ? 3 : 1;
                vm.data.isPrint = flag.isPrint;
            }

            if (location.search.indexOf("editeList=1") >= 0 && flag.serialNumber) {
                $.ajax({
                    method: "PUT",
                    url: ajaxUrlConfig.decorationRecord,
                    dataType: "json",
                    data: flag,
                    success: function() {
                        if (!isPrint) {
                            $.prompt("修改成功!", {
                                title: "提示",
                                buttons: { "确&nbsp;定": true },
                                submit: function(e, v, m, f) {
                                    if (v) {
                                        location.href = path.server;
                                    }
                                }
                            });
                        }
                    }
                }).fail(function() {
                    if (!isPrint)
                        $.prompt("保存失败!", {
                            title: "提示",
                            timeout: 2000,
                            buttons: { "确定": false }
                        });
                })
            } else {
                $.ajax({
                    method: "POST",
                    url: ajaxUrlConfig.decorationRecord,
                    dataType: "json",
                    data: flag,
                    success: function(data) {
                        if (!isPrint) {
                            $.prompt("保存成功", {
                                title: "提示",
                                buttons: { "确&nbsp;定": true },
                                submit: function(e, v, m, f) {
                                    if (v) {
                                        location.href = path.server;
                                    }
                                }
                            });
                        }
                    }
                }).fail(function() {
                    if (!isPrint)
                        $.prompt("保存失败!", {
                            title: "提示",
                            timeout: 2000,
                            buttons: { "确定": false }
                        });
                })
            }
            localStorage.removeItem("serialNumber");
            return true;
        },
        validateTextLength: function(len) {
            if (sizeof(this.value) > len) {
                $.prompt("文字输入过长", {
                    title: "提示",
                    timeout: 2000,
                    buttons: { "确定": false }
                });
                $(this).addClass("input-invalidate");
            } else {
                $(this).removeClass("input-invalidate");
            }
        },
        validate: validate,
        print: function() {
            if (!vm.save(1)) return;
            setTimeout(function() {
                window.print();
            }, 500)
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

    function initDate() {
        var filters = avalon.filters.date;
        if (vm.data.isPrint === null) vm.data.isPrint = 0;
        vm.data.beginDate = vm.data.beginDate ? filters(vm.data.beginDate, "yyyy-M-d") : currentDate;
        vm.data.endDate = vm.data.endDate ? filters(vm.data.endDate, "yyyy-M-d") : currentDate;
        vm.data.effectDate = vm.data.effectDate ? filters(vm.data.effectDate, "yyyy-M-d") : currentDate;
    }

    function init() {
        initDecorationContent();
        initDate();
    }
    $(function() {
        var serialNumber = localStorage.serialNumber;
        if (serialNumber) {
            $.ajax({
                method: "GET",
                url: ajaxUrlConfig.decorationRecord + "/" + serialNumber,
                dataType: "json",
                success: function(data) {
                    vm.data = data;
                    init();
                    //watchEmployerName(); 
                }
            })
            localStorage.removeItem("serialNumber");
        }
    })
})();
