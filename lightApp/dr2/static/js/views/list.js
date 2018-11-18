;
(function () {
    var vm = avalon.define({
        $id: "dataTable",
        page: 1, // 页码
        pageSize: 10, // 每页显示多少条数据
        pageStartIndex: 1, // 起始页，初始为1
        pageNumber: [1], // 页码数组
        allItems: 0, // 数据总数
        dataArray: [], //绑定数据
        searchText: "", //搜索字段值
        searchOption: "customerName", //搜索参数
        changePageSize: function () {
            vm.page = 1;
            // 更改显示记录条数
            getData(ajaxUrlConfig.decorationRecord, vm.page, this.value, vm.searchText);
            vm.pageSize = this.value;
        },
        pageIndex: function (index) {
            // 分页查询
            if (index !== vm.page && index <= vm.pageNumber[vm.pageNumber.size() - 1] && index > 0) {
                vm.page = index;
                getData(ajaxUrlConfig.decorationRecord, vm.page, vm.pageSize, vm.searchText);
            }
        },
        produce: function (index, ev) {
            // 生成装修施工证
            ev.stopPropagation();
            var data = JSON.stringify(vm.$model.dataArray[index], ["effectDate", "beginDate", "endDate", "serialNumber", "customerName", "houseName", "mobilePhone", "referrals", "decorationName", "decorationUnit", "decorationPhone", "delayRecord", "constructionUnit", "serviceCenter", "remarks", "decorationContent", "createDate", "updateDate", "isPrint"]);
            sessionStorage.constructionCertificate = data;
            location.href = path.server + "/views/prove.jsp";
        },
        sortBy: function (item) {
            // 排序函数
            var _this = this;
            _this._clickCount = _this._clickCount ? 0 : 1;
            vm.dataArray.sort(function (a, b) {
                if (_this._clickCount) {
                    $(_this).find("i").removeClass("icon-caret-down").addClass("icon-caret-up");
                    return a[item] > b[item];
                } else {
                    $(_this).find("i").removeClass("icon-caret-up").addClass("icon-caret-down");
                    return a[item] <= b[item];
                }
            })
        },
        check: function (index, isPrint, ev) {
            // 查看单个表单数据
            ev.stopPropagation();
            var txt;
            if (document.selection) {
                txt = document.selection.createRange().text;
            } else {
                txt = window.getSelection() + '';
            }
            if (txt) {
                // 解决选择每行文本导致页面跳转问题
                return;
            }
            if (isPrint != 0) {
                $.prompt("该表格已打印,无法编辑,点击该行可以查看", {
                    title: "提示",
                    timeout: 2000,
                    buttons: {
                        "确定": false
                    }
                });
                return;
            }
            window.localStorage.serialNumber = vm.$model.dataArray[index]["serialNumber"];
            location.href = path.server + "/views/record.jsp?editeList=1";
        },
        remove: function (index, rem, ev, isPrint) {
            ev.stopPropagation();
            if (+isPrint != 0) {
                $.prompt("该表格已打印,无法删除", {
                    title: "提示",
                    buttons: {
                        "确定": false
                    },
                    timeout: 2000
                });
                return;
            }
            var serialNumber = vm.$model.dataArray[index].serialNumber;
            if (serialNumber) {
                $.prompt("是否确认删除？", {
                    title: "删除提示",
                    buttons: {
                        "确&nbsp;定": true,
                        "取&nbsp;消": false
                    },
                    submit: function (e, v, m, f) {
                        if (v) {
                            $.ajax({
                                method: "DELETE",
                                url: ajaxUrlConfig.decorationRecord + "/" + serialNumber,
                                dataType: "json",
                                success: function (data) {
                                    rem();
                                    vm.allItems--;
                                    $.prompt("删除成功", {
                                        title: "提示",
                                        timeout: 2000,
                                        buttons: {
                                            "确定": false
                                        }
                                    });
                                }
                            })
                        }
                    }
                });
            }
        }
    })

    // 初始化页面数据
    function init() {
        getData(ajaxUrlConfig.decorationRecord, 1, 10, "");

        // 监听搜索字段
        vm.$watch("searchText", function (v) {
            getData(ajaxUrlConfig.decorationRecord, 1, vm.pageSize, $.trim(v));
        })
    }

    init();
    // 获取数据
    /*
     ** url:请求地址
     ** page：页码
     ** pageSize：每页记录条数
     ** searchText: 搜索内容
     */
    function getData(url, page, pageSize, searchText) {
        vm.page = page;
        var startIndex = (page - 1) * pageSize + 1;
        url = url + "/" + startIndex + "/" + pageSize + "/" + pageSize;
        var data = {};
        if (vm.searchOption && searchText) {
            data = "{" + "'" + vm.searchOption + "'" + ":" + "'" + searchText + "'" + "}";
        }
        //url += "?" + vm.searchOption + "=" + encodeURIComponent(encodeURIComponent(searchText));
        $.ajax({
            method: "GET",
            url: url,
            dataType: "json",
            data: {
                "search[value]": data
            },
            success: function (data) {
                vm.dataArray = data["data"];
                pageIndexSort(7, Math.ceil(data.recordsFiltered / vm.pageSize), vm.page);
                vm.allItems = /*Math.min(data.rowCount, vm.pageSize, vm.dataArray.size()) + "条 / 共" + */ data.recordsFiltered;
            }
        })
    }

    /*
     setPageNum: 最大页数
     pageSum: 请求的数据页
     index: 点击索引
     */
    function pageIndexSort(setPageNum, pageSum, index) {
        var middle;
        if (pageSum > setPageNum) {
            middle = Math.floor(setPageNum / 2) + vm.pageStartIndex;
            vm.pageStartIndex = vm.pageStartIndex + index - middle;
            if (vm.pageStartIndex < 1) vm.pageStartIndex = 1;
            if (vm.pageStartIndex > pageSum + 1 - setPageNum) vm.pageStartIndex = pageSum - setPageNum + 1;
            vm.pageNumber = avalon.range(vm.pageStartIndex, vm.pageStartIndex + setPageNum);
        } else {
            vm.pageStartIndex = 1;
            vm.pageNumber = avalon.range(vm.pageStartIndex, pageSum + 1);
        }
    }
})();
