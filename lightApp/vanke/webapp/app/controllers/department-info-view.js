'use strict';

VkrmsApp.controller('DepartmentInfoViewController', ['$scope', 'UserService', 'CommonService', '$timeout', 'DepartmentInfoViewService', '$filter', function ($scope, userService, commonService, $timeout, divs, $filter) {
    $scope.title = "万科资源管理信息系统 - 部门信息查看";
    $(".selectpicker").selectpicker();
    $scope.isEdite = false;
    $scope.editedepartmentInfo = editedepartmentInfo;
    $scope.dockingWageDates = {};
    $scope.dockingWageDates2 = {"-": "-"};
    $scope.datePickerConfig = {
        changeYear: true,
        changeMonth: true
    };
    $scope.isValidArr = ["否", "是"];
    $scope.buTypes = divs.getBU();
    $scope.departmentAttrIds = ["万地盘", "全资", "控股", "参股", "全委", "睿服务"];
    var departmentInfos;
    $scope.removeTempRule = removeTempRule;
    $scope.saveDepartmentInfo = saveDepartmentInfo;
    $scope.export = exportSheet;
    $scope.search = search;
    $scope.openDatePicker = openDatePicker;
    $scope.updateDate = updateDate;
    $scope.showSelectpicker = showSelectpicker;
    $scope.changeIsDockingWage = changeIsDockingWage;
    $scope.checkValid = checkValid;
    $scope.checkDockingWage = checkDockingWage;
    $scope.changeDockingWageDate = changeDockingWageDate;
    $scope.checkOnLineRMDate = checkOnLineRMDate;
    $scope.changeDepartmentAttrId = changeDepartmentAttrId;
    $scope.changeDockingPartner = changeDockingPartner;
    $scope.uploads = uploads;
    $scope.importTemplate = importTemplate;
    init();

    function init() {
        $scope.$on('selectpicker-loaded', function () {
            $timeout(function () {
                $("#input-search-field").attr("placeholder", "请输入部门名称");
            }, 200);
        });
        getPageLimit();
        getEffectAttendanceList();
    }

    function importTemplate() {
        var url = baseUrl + "/file/department-info-model-exporting";
        commonService.downloadFile(url)
    }

    function uploads(item) {
        var self = item;
        if (!self.files.length) {
            return false;
        }
        if (self.files[0].type.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') == '-1') {
            commonService.alert({
                content: '只能导入Excel文件!',
                icon: 'fa-exclamation-circle'
            });
            return false;
        }
        $scope.$apply(function () {
            $scope.initFiles.loadingState = true;
        });
        var formData = new FormData();
        formData.append("file", document.getElementById("file").files[0]);
        $.ajax({
            url: baseUrl + '/file/import-department-info',
            type: 'POST',
            data: formData,
            processData: false,  // 告诉jQuery不要去处理发送的数据
            contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
            beforeSend: function () {
                $('#commonLoadingModal').modal('show');
            },
            success: function (response) {
                $('#commonLoadingModal').modal('hide');
                commonService.alert({
                    content: response.message
                });
                self.value = '';
            }
        })
    }
    function changeIsDockingWage(data, item) {
        if (data == 0) {
            item.dockingWageDateId = '0';
            item.isDockingWage = "0";
        } else {
            item.isDockingWage = "1";
        }
        $timeout(function () {
            $("tr select").selectpicker("refresh");
        }, 30);
    }

    $scope.changeIsOnLineRM = changeIsOnLineRM;

    function checkIsOnLineRM() {
        divs.checkIsOnLineRM().then(function (result) {

        });
    }

    function changeIsOnLineRM(data, item) {
        if (data == 0) {
            item.isOnLineRM = "0";
            item.onLineRMDate = null;
        } else {
            item.onLineRMDate = null;
            item.isOnLineRM = "1";
            divs.checkIsOnLineRM({
                departmentId: item.departmentId
            }).then(function (result) {
                if (result == 1) {
                    commonService.confirm({
                        "title": "提示",
                        "icon": "fa-exclamation-circle",
                        "content": "该项目未与战图建立关系，是否确认上线？",
                        "okText": "确定",
                        "cancelText": "取消",
                        "cancel": function () {
                            item.isOnLineRM = "0";
                            $timeout(function () {
                                $("tr select").selectpicker("refresh");
                            }, 110);
                        }
                    });
                } else if (result == 2) {
                    commonService.confirm({
                        "title": "提示",
                        "icon": "fa-exclamation-circle",
                        "content": "该项目未建立出入口信息，是否确认上线？",
                        "okText": "确定",
                        "cancelText": "取消",
                        "cancel": function () {
                            item.isOnLineRM = "0";
                            $timeout(function () {
                                $("tr select").selectpicker("refresh");
                            }, 110);
                        }
                    });
                }
            });
        }
    }

    function changeDockingWageDate(data, item) {
        item.dockingWageDateId = data;
        $timeout(function () {
            $("tr select").selectpicker("refresh");
        }, 0);
    }

    function changeDockingPartner(data, item) {
        item.dockingPartnerId = data;
        $timeout(function () {
            $("tr select").selectpicker("refresh");
        }, 0);
    }

    function changeDepartmentAttrId(data, item) {
        item.departmentAttrId = data;
        $timeout(function () {
            $("tr select").selectpicker("refresh");
        }, 0);
    }

    function getPageLimit() {
        userService.getUserEmployee().then(function (res) {
            return res.id;
        }).then(function (id) {
            var params = {
                employeeId: id,
                pageId: "department-info-setting"
            }
            divs.getPageLimit(params).then(function (result) {
                $scope.pageLimit = result;
                if (isNaN(result)) {
                    $scope.pageLimit = 2;
                }
            })
        });
    }

    function getPartner(companyId, buType) {
        $scope.dockingPartnerIds = {};
        divs.getPartner(companyId, buType).then(function (result) {
            if (result) {
                result.forEach(function (v) {
                    $scope.dockingPartnerIds['' + v.id] = v.name;
                })
            }
        });
    }

    $scope.extend = function () {
        if ($scope.isEdite) {
            return;
        }
        var inserted = {
            "department": "",
            "company": "",
            "regionName": "",
            "isValid": null,
            "invalidDate": null,
            "isOnLineRM": null,
            "onLineRMDate": "",
            "isDockingWage": "0",
            "dockingWageDate": null,
            "dockingWageDateId": "0",
            "dockingPartner": null,
            "dockingPartnerId": null,
            "buType": null,
            "datePicker": {
                opened: false
            },
            "datePicker2": {
                opened: false
            },
            "datePicker3": {
                opened: false
            },
        };
        $scope.departmentInfos.push(inserted);
        $timeout(function () {
            $('.table-bordered tr:last-child').find(".editeRow").trigger('click');
        }, 10);
    }
    function search() {
        divs.getDepartmentInfo(getSearchParams()).then(function (result) {
            $scope.noData = result.data.length == 0;
            departmentInfos = JSON.parse(JSON.stringify(result.data));
            result.data && result.data.forEach(function (v) {
                v.isValid = v.isValid || "0";
                v.buType = v.buType ? (v.buType + "") : '0';
                v.isDockingWage = v.isDockingWage || "0";
                if (v.invalidDate && v.invalidDate <= $filter("date")(new Date(), "yyyy-MM-dd")) {
                    v.isValid = "0";
                }
                if (v.offLineRMDate && v.offLineRMDate <= $filter("date")(new Date(), "yyyy-MM-dd")) {
                    v.isValid = "0";
                }
                v.dockingWageDateId = v.dockingWageDateId ? ("" + v.dockingWageDateId) : "0";
                v.dockingPartnerId += "";
                v.departmentAttrId = v.departmentAttrId ? (v.departmentAttrId + "") : (v.departmentAttrId === 0 ? "0" : v.departmentAttrId);
                v.datePicker = {
                    opened: false
                };
                v.datePicker2 = {
                    opened: false
                };
                v.datePicker3 = {
                    opened: false
                };
            });
            $scope.departmentInfos = result.data;
            $scope.isEdite = false;
            $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
        });
        commonService.storageSearchStatus($scope);
    }

    function checkValid(data) {
        if (!data) {
            return "必选项";
        }
    }

    function checkOnLineRMDate(data, isOnLineRM) {
        if (isOnLineRM == 1 && !data) {
            return "必选项";
        }
    }

    function checkDockingWage(data, item) {
        if ($scope.pageLimit == 1 && item.isDockingWage == "1") {
            if (!data && item.isDockingWage == "1") {
                return "必选项";
            }
            if (data == "null") {
                return "必选项";
            }
        }
    }

    function getEffectAttendanceList() {
        divs.getEffectAttendanceList()
            .then(function (res) {
                var data = res.data;
                for (var i = 0; i < data.length; i++) {
                    $scope.dockingWageDates["" + data[i].attendance_lock_id] = data[i].name;
                }
                $scope.dockingWageDates["0"] = "请选择";
            });
    }

    function exportSheet() {
        var params = {
            departments: _.pluck($scope.selectedDepartments, 'department_id'),
            isValid: $scope.isValid || "",
            isDockingWage: $scope.isDockingWage || "",
            keywords: $scope.keywords || ""
        };
        divs.exportSheet(params);
    }

    function showSelectpicker(companyId, item) {
        console.log(item)
        var config = {
            // dropupAuto: false,
            noneSelectedText: "请选择",
            width: "100%",
            container: "body"
        };
        var select = $("tr select");
        if (companyId) {
            config.liveSearch = true;
        }
        select.selectpicker(config);
        if (item) {
            $timeout(function () {
                item.isValid = item.isValid || "1";
                item.isDockingWage = item.isDockingWage || "0";
            }, 0).then(function () {
                select.selectpicker("refresh");
            });
        }
        if (companyId) {
            // getPartner(companyId, item.buType);
            $scope.dockingPartnerIds = {};
            divs.getPartner(companyId, item.buType).then(function (result) {
                if (result) {
                    result.forEach(function (v) {
                        $scope.dockingPartnerIds['' + v.id] = v.name;
                    })
                }
            }).then(function () {
                setTimeout(function () {
                    select.selectpicker("refresh");
                }, 100);
            });
        } else {
            setTimeout(function () {
                select.selectpicker("refresh");
            }, 100);
        }
    }

    function saveDepartmentInfo(data, item) {
        var params = data || {};
        if (params.dockingWageDateId == "0") {
            params.dockingWageDateId = null;
        }
        $timeout(function () {
            params.invalidDate = item.invalidDate && $filter("date")(new Date(item.invalidDate), "yyyy-MM-dd");
            params.onLineRMDate = item.onLineRMDate && $filter("date")(new Date(item.onLineRMDate), "yyyy-MM-dd");
            params.offLineRMDate = item.offLineRMDate && $filter("date")(new Date(item.offLineRMDate), "yyyy-MM-dd");
            params.id = item.id;
            params.departmentId = item.departmentId;
            params.isDockingWage = item.isDockingWage;
            params.dockingPartnerId = item.dockingPartnerId == "null" ? null : item.dockingPartnerId;
            params.isValid = item.isValid;
            params.buType = item.buType;
            params.isEhrInvalidDate = item.isEhrInvalidDate;
            params.departmentAttrId = item.departmentAttrId;
            if (item.isOnLineRM == 0) {
                params.isDockingWage = "0";
            }
            divs.saveDepartmentInfo({
                departmentInfoDTOList: [params]
            }).then(function (result) {
                if (result.status == 'success') {
                    search();
                }
                $scope.isEdite = false;
            });
        }, 100);
    }

    function openDatePicker(data) {
        $timeout(function () {
            data.opened = true;
        }, 0);
    }

    function updateDate(data, day, item) {
        day = new Date(data).getTime();
        if (item && day < new Date()) {
            item.isOnLineRM = "0";
        }
    }

    function removeTempRule() {
        $("body").trigger("click");
        // $scope.isEdite = false;
        // $timeout(function () {
        //     $("tr select").selectpicker("refresh");
        // }, 330);
        // $scope.departmentInfos = JSON.parse(JSON.stringify(departmentInfos));
        search();
    }

    function editedepartmentInfo(form) {
        if (!$scope.isEdite) {
            form.$show();
        } else {
            commonService.alert({
                content: '请先保存后再修改！',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        }
        $scope.isEdite = true;
    }

    function getSearchParams() {
        return {
            length: $scope.page,
            start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            "search[value]": {
                departments: _.pluck($scope.selectedDepartments, 'department_id'),
                isValid: $scope.isValid || "",
                isDockingWage: $scope.isDockingWage || "",
                keywords: $scope.keywords || "",
                isOnLineRM: $scope.isOnLineRM
            }
        };
    }
}]);
