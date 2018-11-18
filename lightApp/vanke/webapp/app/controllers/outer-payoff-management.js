/**
 * Created by ushio on 2017/9/29.
 */
'use strict';

VkrmsApp.controller('OuterPayoffManagementController', ['$scope', '$modal', '$compile', 'CommonService', 'OuterPayoffManagementService', function ($scope, $modal, $compile, commonService, outerPayoffManagementService) {
    $scope.title = "万科资源管理信息系统 - 外盘发薪管理";
    $scope.isPayoff = [
        {id: 1, value: '是'},
        {id: 0, value: '否'}
    ];
    $scope.payoffRanges = [
        {id: 0, value: '全部'},
        {id: 1, value: '仅以下非万科编制人员'}
    ];
    $scope.showRangeInputs = false;
    $scope.showStaffSelect = false;
    $scope.staffList = {};
    $scope.payoffList = [];

    var openAlertModal = function (data) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'outer-payoff-modal.html',
            controller: 'outerPayoffModalController',
            size: 'sm',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        return modalInstance;
    }
    var openDetailModal = function (data) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'outer-payoff-list-Modal.html',
            controller: 'outerPayoffListModalController',
            size: 'lg',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        return modalInstance;
    }
    var getSearchParams = function () {
        return {
            "length": $scope.page || 10,
            "start": ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            "search[value]": {
                keywords: $scope.keywords,
                departments: _.pluck($scope.selectedDepartments, 'department_id')
            }
        }
    }

    $scope.search = function () {
        outerPayoffManagementService.searchPayoffList(getSearchParams())
            .then(function (result) {
                $scope.listData = [];
                $scope.searchResult = result.data || [];
                if ($scope.searchResult.length) {
                    $scope.searchResult.map(function (item) {
                        $scope.listData.push(_.clone(item, true))
                    })
                }
                $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
            })
    }
    // 显示范围单选框
    $scope.showRangeColumn = function (data, item) {
        if (data == 1) {
            $scope.showRangeInputs = true;
        } else {
            $scope.showRangeInputs = false;
        }
        item.payoff = data;
    }
    // 显示范围具体人员下拉列表
    $scope.showStaffSelectColumn = function (data, item) {
        if (data == 0) {
            $scope.showStaffSelect = false;
        } else {
            $scope.showStaffSelect = true;
        }
        item.range = data
    }
    // 展示范围
    $scope.displayRange = function (item) {
        if (!item.range || item.range == 'null' || item.range == 0) {
            return ''
        } else {
            if (item.payoffList && item.payoffList.length) {
                var range = [], rangeString = '';
                range = item.payoffList.map(function (item) {
                    return item.name
                });
                rangeString = range.join('、');
                rangeString = rangeString.length > 10 ? rangeString.slice(0, 10) + '...' : rangeString;
                return rangeString;
            }
            return ''
        }
    }
    // 初始化选择菜单样式
    $scope.showSelectpicker = function (departmentId, item) {
        var select = $("tr select");
        var config = {
            noneSelectedText: "请选择",
            width: "280px",
            container: "body"
        };
        if (departmentId) {
            config.liveSearch = true;
            config.actionsBox = true;
        }
        select.selectpicker(config);
        $scope.loadDepartmentStaffs(select, departmentId, item)
    }
    // 加载部门员工列表
    $scope.loadDepartmentStaffs = function (select, departmentId, item) {
        if (departmentId) {
            var params = {
                "departments": [departmentId],
            };
            params = {
                "search[value]": JSON.stringify(params)
            };
            outerPayoffManagementService.searchOuterStaff(params).then(function (result) {
                if (result) {
                    $scope.staffList[departmentId] = result
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
    // 更新应用发薪员工范围数组
    $scope.changePayoffRange = function (data, item) {
        var newList = []
        $scope.staffList[item.departmentId].forEach(function (staff) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (staff.employeeId == data[i]) {
                    newList.push(staff)
                }
            }
        });
        item.payoffList = newList;
    }
    // 保存
    $scope.save = function (item, rowForm) {
        if (item.payoff == 1 && (!item.range || item.range == 'null')) {
            openAlertModal({
                message: '请设置发薪范围!'
            });
            return;
        }
        if (item.payoff == 1 && item.range != 0 && item.payoffList && !item.payoffList.length) {
            openAlertModal({
                message: '请设置发薪范围具体人员!'
            });
            return;
        }
        if (item.payoff == 0) {
            item.range = null;
            item.payoffList = [];
        } else {
            if (item.range == 0) {
                item.payoffList = [];
            } else {
                var newPayoffList = [];
                newPayoffList = item.payoffList.map(function (item) {
                    return {
                        employeeId: item.employeeId
                    }
                })
                item.payoffList = newPayoffList;
            }
        }
        var params = {
            employeeId: sessionStorage["searchState_employeeId"],
            departmentId: item.departmentId,
            payoff: item.payoff,
            range: item.range,
            payoffList: item.payoffList
        }
        outerPayoffManagementService.setPayoffRange(params)
            .then(function (res) {
                if (res.status == 'success') {
                    openAlertModal({
                        message: '保存成功!'
                    });
                    rowForm.$cancel();
                } else {
                    openAlertModal({
                        message: res.errorMessage
                    });
                }
                $scope.search();
            })
    }
    // 查看详情
    $scope.viewRangeList = function (item) {
        openDetailModal(item.payoffList)
    }
    $scope.cancel = function (item, rowForm) {
        $scope.listData.forEach(function (record) {
            if (item.departmentId == record.departmentId) {
                item.payoff = record.payoff;
                item.payoffList = record.payoffList;
                item.range = record.range;
            }
        })
        $('#wrapper').siblings('.btn-group').find('.dropdown-menu').hide()
        rowForm.$cancel();
    }

}]).controller('outerPayoffModalController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
    $scope.data = data;
    $scope.data.type = $scope.data.type || 'warning';
    $scope.ok = function () {
        $modalInstance.close();
    };
}]).controller('outerPayoffListModalController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
    $scope.data = data;
    $scope.keywords = '';
    $scope.searchFromEnterKey = function (e) {
        if (e.key === 'Enter') {
            $scope.search()
        }
    }
    $scope.search = function () {
        if ($scope.keywords.length > 0) {
            $scope.data = data.filter(function (item) {
                if (item.name.indexOf($scope.keywords) > -1 || item.sapId.indexOf($scope.keywords) > -1) {
                    return item
                }
            })
        } else {
            $scope.data = data
        }
    }
    $scope.clear = function () {
        $scope.keywords = "";
        $scope.search();
    };
    $scope.ok = function () {
        $modalInstance.close();
    };
}]);
