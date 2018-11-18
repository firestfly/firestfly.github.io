/**
 * Created by deepsky on 2017/5/2.
 */
;
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('otherHolidayBalanceController', otherHolidayBalanceController);

    otherHolidayBalanceController.$inject = ['$filter', '$rootScope', '$routeParams', '$scope', '$http', 'CommonService', 'OtherHolidayBalanceService'];

    function otherHolidayBalanceController($filter, $rootScope, $routeParams, $scope, $http, commonService, otherHolidayBalanceService) {
        var ohb = this;

        init();
        $scope.search = search;
        $scope.add = add;
        $scope.extend = add;
        $scope.edit = edit;
        $scope.del = del;
        $scope.modify = modify;
        $scope.cancel = cancel;
        $scope.export = exportData;
        $scope.uploads = uploads;
        $scope.download = download;
        $scope.initFiles = {isUpload: false, loadingState: false};
        $scope.isCheck = $routeParams.check == '1' ? true : false;
        $scope.isEdite = false;
        function init() {
            $scope.title = "万科资源管理信息系统 - 休假额度设置";
            $scope.commonSearchBarConfig = {
                isCompanySelectpickerMultiple: false,
                companySelecterLabel: "公司范围",
                departmentSelecterLabel: "部门/项目",
                workgroupSelecterLabel: "岗位专业分类"
            };
            $scope.paginationConfig = {
                pageOptions: [10, 30, 50],
                isShowOptions: false
            };
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
            formData.append("file", document.getElementById("OtherHolidayBalanceFile").files[0]);
            $.ajax({
                url: baseUrl + '/file/import-holiday-check',
                type: 'POST',
                data: formData,
                processData: false,  // 告诉jQuery不要去处理发送的数据
                contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
                beforeSend: function () {
                    $('#commonLoadingModal').modal('show');
                },
                success: function (response) {
                    $('#commonLoadingModal').modal('hide');
                    if (response.status == 0) {
                        //检验数据失败
                        commonService.confirm({
                            content: response.message,
                            okText: '导出原表格',
                            cancelText: '',
                            callback: function () {
                                window.location.href = response.fileUrl;
                            },
                            cancel: function () {

                            }
                        });
                    } else if (response.status == 1) {
                        //检验数据成功
                        commonService.confirm({
                            content: response.message,
                            okText: '确定',
                            cancelText: '取消',
                            callback: function () {
                                $.ajax({
                                    url: baseUrl + '/file/import-holiday',
                                    type: 'POST',
                                    data: formData,
                                    processData: false,  // 告诉jQuery不要去处理发送的数据
                                    contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
                                    success: function (res) {
                                        if (res.status == 1) {
                                            commonService.confirm({
                                                content: res.message,
                                                icon: "fa-exclamation-circle",
                                                iconColor: "icon-red",
                                                showCloseBtn: false
                                            });
                                            setTimeout(function () {
                                                $scope.$apply(function () {
                                                    $scope.initFiles.isUpload = true;
                                                    $scope.initFiles.loadingState = false;
                                                    $scope.initFiles.name = self.files[0].name;
                                                });
                                            }, 10)
                                        }
                                    },
                                    error: function (res) {
                                        commonService.alert({
                                            content: '网络可能有问题，请检查网络连接',
                                            icon: "fa-exclamation-circle",
                                            iconColor: "icon-red"
                                        });
                                    }
                                })
                            },
                            cancel: function () {

                            }
                        });
                    }
                    self.value = '';
                },
                error: function (res) {
                    commonService.alert({
                        content: '网络可能有问题，请检查网络连接',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                }
            });
        }

        function download() {
            var url = baseUrl + "/file/otherHolidayBalanceModel";
            commonService.downloadFile(url);
        }

        function exportData() {
            var type = _.pluck($scope.selectedOtherHolidayType, 'code')
            if (_.isEmpty(type)) {
                type = ["HOLIDAY_NURSING", "HOLIDAY_INDUSTRIAL_INJURY", "HOLIDAY_CARRY_OVER", "HOLIDAY_MATERNITY", "HOLIDAY_FUNERAL", "HOLIDAY_MARRIAGE", "HOLIDAY_STATUTORY_SICK", "HOLIDAY_OTHER_PAY", "HOLIDAY_PAY_ANNUAL", "HOLIDAY_FAMILY_PLANNING", "HOLIDAY_CONTRACEPTION", "HOLIDAY_STATUTORY_ANNUAL"];
            }
            var url, data = {
                "departments": _.pluck($scope.selectedDepartments, 'department_id'),
                "keywords": $scope.keywords,
                "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
                "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
                "holidayTypeId": type
            };
            url = baseUrl + "/file/otherHolidayBalanceExport";
            commonService.downloadFile(url, data);
        }
        function search() {
            otherHolidayBalanceService.getOtherHolidayBalanceList(getParams())
                .then(function (res) {
                    ohb.lists = res.data;
                    $scope.totalPage = Math.ceil(res.recordsTotal / $scope.page) || 1
                    if (_.isEmpty(res.data)) {
                        $scope.noData = true
                    } else {
                        $scope.noData = false
                    }
                })
            commonService.storageSearchStatus($scope);
        }

        $scope.$watch('reloadOtherHoliday', function () {
            if ($rootScope.reloadOtherHoliday) {
                search();
                $rootScope.reloadOtherHoliday = false;
            }
        });

        function getParams() {
            var type = _.pluck($scope.selectedOtherHolidayType, 'code')
            if (_.isEmpty(type)) {
                type = ["HOLIDAY_NURSING", "HOLIDAY_INDUSTRIAL_INJURY", "HOLIDAY_CARRY_OVER", "HOLIDAY_MATERNITY", "HOLIDAY_FUNERAL", "HOLIDAY_MARRIAGE", "HOLIDAY_STATUTORY_SICK", "HOLIDAY_OTHER_PAY", "HOLIDAY_PAY_ANNUAL", "HOLIDAY_FAMILY_PLANNING", "HOLIDAY_CONTRACEPTION", "HOLIDAY_STATUTORY_ANNUAL"];
            }
            return {
                "search[value]": {
                    "departments": _.pluck($scope.selectedDepartments, 'department_id'),
                    "keywords": $scope.keywords,
                    "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
                    "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
                    "holidayTypeId": type
                },
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
            }
        }

        $scope.opened1 = {};
        $scope.opened2 = {};
        $scope.open1 = function ($event, elementOpened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened1[elementOpened] = !$scope.opened1[elementOpened];
        };

        $scope.open2 = function ($event, elementOpened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened2[elementOpened] = !$scope.opened2[elementOpened];
        };
        function add() {
            commonService.createModal({
                'templateUrl': 'addHolidayBalance.html',
                'controller': 'addHolidayBalanceModalController',
                'size': 'lg'
            })
        }

        function edit(item, rowform) {
            // if (!item.isModify) {
            //     commonService.alert({
            //         content: item.name + ',' + item.holidayType + item.effectiveDate + '--' + item.expiryDate + '，该假期额度已被使用，不可修改！',
            //         icon: "fa-exclamation-circle"
            //     });
            // } else {
            //     if (!$scope.isEdite) {
            //         rowform.$show();
            //     } else {
            //         commonService.alert({
            //             content: '请先保存后再修改！',
            //             icon: "fa-exclamation-circle",
            //             iconColor: "icon-red"
            //         });
            //     }
            //     $scope.isEdite = true;
            // }
            if (!$scope.isEdite) {
                rowform.$show();
            } else {
                commonService.alert({
                    content: '请先保存后再修改！',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
            }
            $scope.isEdite = true;
        }

        function cancel(rowform) {
            $scope.isEdite = false;
            rowform.$cancel();
        }

        function del(item, index) {
            if (item.isDelete) {
                commonService.confirm({
                    content: '确定删除该休假额度？',
                    callback: function () {
                        commonService.progress('start')
                        $http.delete(apiBaseUrl + '/other-holiday-balance/' + item.id)
                            .then(function (res) {
                                commonService.progress('end')
                                if (res.data.status == 'success') {
                                    ohb.lists.splice(index, 1);
                                    commonService.alert({
                                        content: '删除成功'
                                    })
                                }
                            })
                    }
                });
            } else {
                commonService.alert({
                    content: item.name + ',' + item.holidayType + item.effectiveDate + '--' + item.expiryDate + '，该假期额度已被使用，不可删除！',
                    icon: "fa-exclamation-circle"
                });
            }
        }

        function modify(data, form, id, usedQuota, list) {
            if ((new Date(data.expiryDate) - new Date(data.effectiveDate)) < -28800000) {
                commonService.alert({
                    content: '失效时间必须大于生效时间',
                    icon: 'fa-exclamation-circle'
                });
                setTimeout(function () {
                    form.$show();
                }, 10);
                return false
            }
            var params = {
                quota: data.quota,
                effectiveDate: $filter('date')(new Date(data.effectiveDate), 'yyyy-MM-dd'),
                expiryDate: $filter('date')(new Date(data.expiryDate), 'yyyy-MM-dd'),
                usedQuota: usedQuota
            };
            otherHolidayBalanceService.updateBalance(id, params)
                .then(function (res) {
                    if (res.status == 'success') {
                        commonService.alert({
                            content: ' 修改成功',
                            icon: 'fa-exclamation-circle'
                        });
                        $scope.isEdite = false;
                        list.leftQuota = data.quota - usedQuota;
                    } else {
                        commonService.alert({
                            content: res.errorMessage,
                            icon: 'fa-exclamation-circle'
                        });
                        setTimeout(function () {
                            form.$show();
                        }, 10);
                    }
                })
        }

        $scope.checkEffectiveDate = function (data) {
            if (!data) {
                return '生效日期不能为空';
            }
        }
        $scope.checkExpiryDate = function (data) {
            if (!data) {
                return '失效日期不能为空';
            }
        }
        $scope.checkQuota = function (data, usedQuota) {
            if (data < usedQuota) {
                return '总额度不能小于已使用额度'
            }
            if (!data) {
                return '总额度不能为空';
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('addHolidayBalanceModalController', addHolidayBalanceModalController);

    addHolidayBalanceModalController.$inject = ['$rootScope', '$scope', 'UserService', 'CommonService', '$modalInstance', '$timeout', '$filter', 'OtherHolidayBalanceService'];

    function addHolidayBalanceModalController($rootScope, $scope, userService, commonService, $modalInstance, $timeout, $filter, OtherHolidayBalanceService) {

        $scope.openTime = 0;
        $scope.usedQuota = 0;
        $scope.selectedEmployeeSap = {};
        $scope.selectedOtherHolidayType = {}
        $scope.employeeSap = [];
        $scope.departments = [];
        $timeout(function () {
            $('.selectpicker').selectpicker();
            $('.input-daterange').datepicker({
                language: "zh-CN",
                autoclose: true,
                format: "yyyy-mm-dd"
            });
        }, 10, false);
        var defaultState = JSON.parse(sessionStorage.getItem("searchState_#/other-holiday-balance"));
        $scope.selectedCompanies = defaultState.selectedCompanies[0];
        $scope.selectedDepartments = defaultState.selectedDepartments[0]
        commonService.getOtherHolidayType()
            .then(function (res) {
                var newData = []
                angular.forEach(res.data, function (item) {
                    // 去掉计划生育假新增额度
                    if (item.code !== 'HOLIDAY_FAMILY_PLANNING') {
                        newData.push(item)
                    }
                })
                $scope.otherHolidayType = newData;
                $scope.selectedOtherHolidayType = newData[1]
                $timeout(function () {
                    $('#holidayType').selectpicker('refresh');
                });
            })
        userService.getCurrentUser().then(function (selectData) {
            $scope.organizations = selectData.authorizedCompanies
        });
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.$watch('selectedCompanies', function (v) {
            if (!$.isEmptyObject(v)) {
                if ($scope.openTime == 0) {
                    $scope.departments = v.departments;
                    $timeout(function () {
                        $("#selectDepartment").selectpicker('refresh');
                    }, 150, false);
                } else {
                    $scope.departments = v.departments;
                    $scope.selectedDepartments = v.departments[0]
                    $timeout(function () {
                        $("#selectDepartment").selectpicker('refresh');
                    }, 150, false);
                }
                $scope.openTime++
            }
        });
        $scope.$watch('selectedDepartments', function (v) {
            if (!$.isEmptyObject(v)) {
                getEmployeeSap(v.department_id)
            }
        });
        $scope.$watch('employeeSap', function (v) {
            if (!$.isEmptyObject(v)) {
                $timeout(function () {
                    $("#employeeSap").selectpicker("refresh");
                }, 150, false);
            }
        });

        $scope.$watch('selectedOtherHolidayType', function (v) {
            $scope.quotaUnit = v.remark
        })

        function getEmployeeSap(id) {
            var params = {
                "departments": [id],
                "workingGroups": [],
                "standardWorkJobs": []
            };
            params = {
                "search[value]": JSON.stringify(params)
            };
            commonService.getEmployeeSap(params).then(function (result) {
                $scope.employeeSap = result;
                $scope.selectedEmployeeSap = result[0];
            })
        }

        $scope.actionSave = function () {
            if ($scope.usedQuota > $scope.quota) {
                commonService.alert({
                    content: '总额度不能小于已使用额度!',
                });
                return
            }
            if (!$scope.selectedEmployeeSap.employeeId) {
                $scope.alertText = '人员'
                return false
            } else if (!$scope.selectedOtherHolidayType.code) {
                $scope.alertText = '休假类型'
                return false
            } else if (!$scope.effectiveDate) {
                $scope.alertText = '生效日期'
                return false
            } else if (!$scope.expiryDate) {
                $scope.alertText = '失效日期'
                return false
            } else if (!$scope.quota) {
                $scope.alertText = '额度'
                return false
            } else {
                $scope.alertText = null
            }
            var params = {
                employeeId: $scope.selectedEmployeeSap.employeeId,
                holidayType: $scope.selectedOtherHolidayType.code,
                effectiveDate: $scope.effectiveDate,
                expiryDate: $scope.expiryDate,
                quota: parseFloat($scope.quota),
                usedQuota: parseFloat($scope.usedQuota),
            }
            var holidayHtml = '<p>为' + $scope.selectedDepartments.department_name + '的' + $scope.selectedEmployeeSap.name + '(' + $scope.selectedEmployeeSap.employeeId + ')添加：</p><br />';
            holidayHtml += '<p>休假类型：<span class="color-red" >' + $scope.selectedOtherHolidayType.value + '</span><br />';
            holidayHtml += '有效期：<span class="color-red" >' + $scope.effectiveDate + '至' + $scope.expiryDate + '</span><br />';
            holidayHtml += '额度：<span class="color-red" >' + $scope.quota + $scope.quotaUnit + '</span>';
            commonService.confirm({
                icon: 'unshow-icon',
                content: holidayHtml,
                callback: function () {
                    OtherHolidayBalanceService.saveBalance(params)
                        .then(function (res) {
                            $modalInstance.dismiss('cancel');
                            $rootScope.reloadOtherHoliday = true
                        }, function () {
                            $modalInstance.dismiss('cancel');
                        })
                }
            })

        }

    }
})();