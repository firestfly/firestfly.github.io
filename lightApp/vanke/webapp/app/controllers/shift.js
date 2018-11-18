'use strict';

VkrmsApp.controller('ShiftController', ['$scope', '$filter', '$routeParams', '$http', '$timeout', 'CommonService', function ($scope, $filter, $routeParams, $http, $timeout, commonService) {
    $scope.title = "万科资源管理信息系统 - 班次设置";
    $scope.shifts = [];
    $scope.allShifts = [{label: '请选择'}];
    commonService.applySearchStatus($scope);
    var shiftGroupId = $routeParams.shiftGroupId;
    $scope.shiftGroupIdFlag = shiftGroupId;
    $scope.saveShift = saveShift;
    $scope.selectableShifts = [{id: '', value: '请选择'}];
    $scope.isEditState = false;
    var otherKeywords = {}
    $scope.datalist = [];
    $scope.shiftTypes = [{
        id: 0,
        value: '常规班次'
    }, {
        id: 1,
        value: '常规加班'
    }, {
        id: 2,
        value: '值班经理值班'
    }, {
        id: 5,
        value: '维修普通值班'
    }, {
        id: 3,
        value: '维修夜间值班'
    }, {
        id: 4,
        value: '其他夜班'
    }];

    $scope.effectiveTypes = [
        {
            id: 1,
            value: '有效'
        },
        {
            id: 2,
            value: '无效'
        }
    ];
    $timeout(function () {
        $('.selectpicker').selectpicker('refresh');
    });
    $scope.selectedShiftEffective = 1;
    $scope.$watch('selectedShiftEffective', function (v) {
        console.log(v)
    });

    // ['常规班次', '常规加班', '值班经理值班', '维修普通值班', '维修夜间值班', '其他夜班']
    $scope.changeShiftType = changeShiftType;
    $scope.removeShift = removeShift;
    $scope.addShift = addShift;
    $scope.computeShiftTime = computeShiftTime;
    $scope.search = searchShift;
    $scope.edite = edite;
    $scope.checkData = checkData;
    $scope.shiftChange = shiftChange;
    $scope.selectShift = selectShift;
    $scope.timeCut = timeCut;
    $scope.checkCutTime = checkCutTime;
    $scope.changeShift = function (id) {
        for (var k in $scope.shiftTypes) {
            if ($scope.shiftTypes[k].id == id) {
                return $scope.shiftTypes[k].value;
                break;
            }
        }
    }

    $scope.changeEffective = function (id) {
        for (var k in $scope.effectiveTypes) {
            if ($scope.effectiveTypes[k].id == id) {
                return $scope.effectiveTypes[k].value;
                break;
            }
        }
    }
    function checkCutTime(isAlert, tip) {
        tip = tip == 1 ? "优先按照休息时长划分半班次" : "有半班次划分时间点则无需填写休息时长";
        if (isAlert) {
            commonService.alert({'content': tip});
        }
    }
    function checkData(data) {
        if (!data) return '请选择班次是否有效'
    }

    function edite(shift, rowform) {
        if ($scope.isEditState) {
            commonService.alert({'content': '请保存后再编辑该列！'});
            return
        }
        $scope.isEditState = true;
        $scope.datalist = [];
        shift.isEffective = parseInt(shift.isEffective);
        getSelectableRelatedShift();
        shift.diningStartDatetime = shift.diningStartDatetime;
        shift.diningEndDatetime = shift.diningEndDatetime;
        shift.offDutyTime = shift.offDutyTime;
        shift.onDutyTime = shift.onDutyTime;
        rowform.$show();
    }

    function saveShift(data, id, form, item) {
        if (!item.label) {
            commonService.alert({'content': '请输入班次名称'});
            setTimeout(function () {
                $scope.datalist = []
                form.$show();
            }, 10);
            return
        }
        $scope.selectedLabel = null
        $scope.selectableShifts = [{id: '', value: '请选择'}];
        data.relatedShiftId = parseInt(data.relatedShiftId);
        if (!$scope.inserted || $scope.inserted.id !== id) {
            angular.extend(data, {shiftId: id});
        } else {
            $scope.inserted = null;
        }
        if (data.diningDuration == null) {
            data.diningDuration = 0;
        }
        data.onDutyTime = item.onDutyTime ? item.onDutyTime + ':00' : null;
        data.offDutyTime = item.offDutyTime ? item.offDutyTime + ':00' : null;
        data.diningStartDatetime = item.diningStartDatetime ? item.diningStartDatetime + ':00' : null;
        data.diningEndDatetime = item.diningEndDatetime ? item.diningEndDatetime + ':00' : null;
        if (item.shiftCutTime && !item.diningEndDatetime && !item.diningEndDatetime) {
            data.diningStartDatetime = item.shiftCutTime + ':00';
            data.diningEndDatetime = item.shiftCutTime + ':00';
        }
        if (data.onDutyTime == data.offDutyTime) {
            commonService.alert({'content': '上下班时间填写有误'});
            setTimeout(function () {
                form.$show();
            }, 10);
            return;
        }
        if (data.shiftType == 1) {
            data.diningStartDatetime = null;
            data.diningEndDatetime = null
        }

        if (data.diningStartDatetime && data.diningEndDatetime && data.shiftType != 1 && !isInTimeRange(data.onDutyTime, data.offDutyTime, data.diningStartDatetime, data.diningEndDatetime)) {
            if (data.diningStartDatetime == data.diningEndDatetime) {
                commonService.alert({'content': '半班次划分时间点填写有误'});
            } else {
                commonService.alert({'content': '休息时间段填写有误'});
            }
            setTimeout(function () {
                form.$show();
            }, 10);
            return;
        }
        data.label = item.label;
        data.switchShiftLabel = data.switchShiftLabel == '请选择' ? null : data.switchShiftLabel;

        angular.extend(data, {shiftGroupId: shiftGroupId});
        $http.post(apiBaseUrl + '/shift-group/shift', data, {
            headers: utils.generateHeaders()
        }).success(function (result) {
            $scope.inserted = null;
            if (result.status == 'fail') {
                commonService.alert({'content': result.errorMessage, 'icon': 'fa-exclamation-circle'});
                form.$show();
            } else {
                $scope.isEditState = false;
                searchShift();
            }
        }).error(function (data, status, headers, config) {
            commonService.alert({'content': '保存失败，请重新刷新页面.', 'icon': 'fa-exclamation-circle'});
        });
    }

    function getSelectableRelatedShift () {
        commonService.progress('start');
        $http.get(apiBaseUrl + '/selectable-on-duty-shift', {params: {shiftGroupId: shiftGroupId, shiftType: 2}})
            .success(function (result) {
                commonService.progress('end');
                var data = result.data;
                for (var i = 0; i < data.length; i++) {
                    $scope.selectableShifts.push({
                        id: data[i].id,
                        value: data[i].label
                    })
                }
            });
    }

    function isInTimeRange(t1, t2, timeBegin, timeEnd) {
        if (t1 && t2 && timeBegin && timeEnd) {
            var t1Arr = t1.split(":");
            var t2Arr = t2.split(":");
            var timeBeginArr = timeBegin.split(":");
            var timeEndArr = timeEnd.split(":");
            if (t1 > t2) {
                t2 = (+t2Arr[0] + 24) + ":" + t2Arr[1] + ":00";
                if (timeBeginArr[0] < t1Arr[0]) {
                    timeBegin = (+timeBeginArr[0] + 24) + ":" + timeBeginArr[1] + ":00";
                }
                if (timeEndArr[0] < t1Arr[0]) {
                    timeEnd = (+timeEndArr[0] + 24) + ":" + timeEndArr[1] + ":00";
                }
            }
            return timeBegin <= timeEnd && timeBegin >= t1 && timeBegin < t2 && timeEnd > t1 && timeEnd <= t2;
        }
    }

    function changeShiftType(data, shift) {
        shift.shiftType = data;
        if (shift.label.length > 1) {
            shiftChange(shift, shift.label)
        }
    }

    function removeShift(index, shiftId) {
        $scope.selectedLabel = null;
        var config = {
            "title": "删除提示",
            "icon": "fa-exclamation-circle",
            "content": "您确认删除此条常规班次设置吗？",
            "callback": function () {
                $scope.shifts.splice(index, 1);
                $http.delete(apiBaseUrl + "/shift-group/" + shiftGroupId + '/shift/' + shiftId, {headers: utils.generateHeaders()});
            }
        };
        commonService.confirm(config);
    }

    function addShift() {
        if ($scope.isEditState) {
            commonService.alert({'content': '请保存后再新增班次！'});
            return;
        }
        if ($scope.inserted) {
            return;
        }
        $scope.inserted = {
            shiftGroupId: shiftGroupId,
            label: '',
            name: '',
            relatedShiftId: '',
            shiftType: 0,
            diningDuration: 0,
            isEffective: 1
        };
        $scope.shifts.push($scope.inserted);
        $timeout(function () {
            $scope.shown = $scope.inserted;
            $('.table-bordered tr:last-child .link').trigger('click');
        }, 10);
    }

    function computeShiftTime(shift) {
        if (!shift.diningDuration) {
            shift.diningDuration = 0;
        }
        var oneHour = 1000 * 60 * 60;
        var day = $filter('date')(new Date(), 'yyyy/MM/dd');
        var ond = day + ' ' + shift.onDutyTime;
        var offd = day + ' ' + shift.offDutyTime;
        var result;
        if (new Date(ond) > new Date(offd)) {
            result = new Date(offd) - new Date(ond);
            result = 24 + (result / oneHour)
        } else {
            result = new Date(offd) - new Date(ond);
            result = result / oneHour
        }
        shift.onLineTimeLong = result - shift.diningDuration
        shift.onDutyTime = timeCut(shift.onDutyTime);
        shift.offDutyTime = timeCut(shift.offDutyTime);
        if (shift.diningStartDatetime == shift.diningEndDatetime) {
            shift.shiftCutTime = shift.diningEndDatetime;
            shift.diningStartDatetime = null;
            shift.diningEndDatetime = null;
        }
        shift.diningStartDatetime = timeCut(shift.diningStartDatetime);
        shift.diningEndDatetime = timeCut(shift.diningEndDatetime);
        shift.shiftCutTime = timeCut(shift.shiftCutTime);
    }

    $scope.removeTempShift = function () {
        $scope.isEditState = false;
        $scope.selectedLabel = null
        $scope.selectableShifts = [{id: '', value: '请选择'}];
        searchShift();
        $scope.inserted = null;
    };

    $scope.checkName = function (data) {
        if (!data) {
            return "班次说明不能为空!";
        }
        if (data.length >= 20) {
            return "班次说明长度最多为20！"
        }
    };
    $scope.checkType = function (data) {
        if (typeof data == 'undefined') {
            return "班次类型不能为空!";
        }
    };
    $scope.checkLabel = function (data) {
        if (!data) {
            return "班次名称不能为空!";
        }
        if (data.length >= 10) {
            return "班次名称长度最多为10！"
        }
    };

    $scope.checkOnDutyTime = function (data) {
        if (!data) {
            return "上班时间填写有误！";
        }
    };
    $scope.checkDiningStartDatetime = function (data) {
        if (!data) {
            return "休息开始时间填写有误！";
        }
        var diningStartDatetime = $filter('date')(data, 'HH:mm:00');
        if (diningStartDatetime.slice(3, 5) != '00' && diningStartDatetime.slice(3, 5) != '30') {
            return '休息时间最小单位为30分钟';
        }
    };
    $scope.checkDiningEndDatetime = function (data) {
        if (!data) {
            return "休息结束时间填写有误！";
        }
        var diningEndDatetime = $filter('date')(data, 'HH:mm:00');
        if (diningEndDatetime.slice(3, 5) != '00' && diningEndDatetime.slice(3, 5) != '30') {
            return '休息时间最小单位为30分钟';
        }
    };
    $scope.checkOffDutyTime = function (data) {
        if (!data) {
            return "下班时间填写有误！";
        }
    };

    $scope.checkDiningDuration = function (data) {
        if (data && !utils.checkNumber(data)) {
            return "中途休息时长为正数且最多两位小数！";
        }
    };

    function getDate(time) {
        if (!time) {
            return;
        }
        var d = new Date(),
            month = parseInt(d.getMonth()),
            dd = parseInt(d.getDate()),
            yyyy = parseInt(d.getFullYear()),
            hms = time.split(":"),
            hh = hms[0],
            mm = hms[1],
            ss = hms[2];

        return new Date(yyyy, month, dd, hh, mm, ss, 0);
    }

    $timeout(function () {
        $scope.$broadcast("selectpicker-loaded");
        // searchShift();
    }, 50);
    function getSearchParams() {
        return {
            "length": $scope.page || 10,
            "start": ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            "search[value]": {
                keywords: $scope.keywords,
                isEffective: $scope.selectedShiftEffective
            }
        }
    }

    function searchShift() {
        $http.get(apiBaseUrl + "/shift-group/" + shiftGroupId, {params: getSearchParams()})
            .success(function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    computeShiftTime(result.data[i])
                }
                $scope.selectedLabel = null
                $scope.shifts = result.data;
                $scope.inserted = null;
                $scope.isEditState = false;
                $scope.otherKeywords = [];
                $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
                $scope.allShifts = [{label: '请选择'}];
                $scope.allShifts = $scope.allShifts.concat($scope.shifts);
            });
        commonService.storageSearchStatus($scope, {
            keywords: $scope.keywords
        })
    }

    $scope.searchFromEnterKey = function (e) {
        if (e.keyCode === 13) {
            searchShift();
        }
    };
    $scope.clear = function () {
        $scope.keywords = "";
    };

    function shiftChange(data, item) {
        if (item.length > 1) {
            commonService.progress('start')
            $http.get(apiBaseUrl + "/fast-search-shift?keyword=" + item + '&shiftType=' + data.shiftType)
                .success(function (result) {
                    commonService.progress('start')
                    $scope.datalist = result.data;
                    otherKeywords = {}
                    angular.forEach($scope.datalist, function (item) {
                        item.onDutyTime = timeCut(item.onDutyTime);
                        item.offDutyTime = timeCut(item.offDutyTime);
                        item.diningStartDatetime = timeCut(item.diningStartDatetime);
                        item.diningEndDatetime = timeCut(item.diningEndDatetime);
                        item.show = true;
                    })
                });
        }
    }

    function selectShift(item, data, index) {
        if ($scope.selectedLabel == index) {
            // $scope.selectedLabel = null
            return
        }
        $scope.selectedLabel = index;
        data.label = item.label;
        data.onDutyTime = timeCut(item.onDutyTime);
        data.offDutyTime = timeCut(item.offDutyTime);
        data.diningStartDatetime = timeCut(item.diningStartDatetime);
        data.diningEndDatetime = timeCut(item.diningEndDatetime);
        // data.diningDuration = item.diningDuration;
    }

    $scope.timeBlur = function (item, type, shift) {
        if (!item) {
            switch (type) {
                case 'onDutyTime':
                    otherKeywords.onDutyTime = false;
                    break;
                case 'offDutyTime':
                    otherKeywords.offDutyTime = false;
                    break;
                case 'diningStartDatetime':
                    otherKeywords.diningStartDatetime = false;
                    break;
                case 'diningEndDatetime':
                    otherKeywords.diningEndDatetime = false;
                    break;
                case 'shiftCutTime':
                    otherKeywords.shiftCutTime = false;
                    break;
                default:
                    break;
            }
            return
        }
        if (item.indexOf(':') != -1) return;
        var hour = item.length >= 2 ? hourFunc(item.substr(0, 2)) : 0 + item;
        var minter = item.length >= 3 ? item.substr(2, 2) : '00';
        switch (item.length) {
            case 1:
            case 2:
                item = hour + minter
                break;
            case 3:
                minter = minter >= 3 ? '30' : '00'
                item = hour + minter
                break;
            case 4:
                if (item >= 2330) {
                    item = '2330'
                } else {
                    item = hour + minterFunc(minter)
                }
                break;
            default:
                break;
        }
        var arr = item.split("");
        arr.splice(2, 0, ':');
        item = arr.join('');
        switch (type) {
            case 'offDutyTime':
                shift.offDutyTime = item;
                if ($scope.datalist.length > 1) {
                    otherKeywords.offDutyTime = item;
                    angular.forEach($scope.datalist, function (data) {
                        getParams(data)
                    })
                }
                break;
            case "onDutyTime":
                shift.onDutyTime = item;
                if ($scope.datalist.length > 1) {
                    otherKeywords.onDutyTime = item;
                    angular.forEach($scope.datalist, function (data) {
                        getParams(data)
                    })
                }
                break;
            case 'diningStartDatetime':
                shift.diningStartDatetime = item;
                if ($scope.datalist.length > 1) {
                    otherKeywords.diningStartDatetime = item;
                    angular.forEach($scope.datalist, function (data) {
                        getParams(data)
                    })
                }
                break;
            case "diningEndDatetime":
                shift.diningEndDatetime = item;
                if ($scope.datalist.length > 1) {
                    otherKeywords.diningEndDatetime = item;
                    angular.forEach($scope.datalist, function (data) {
                        getParams(data)
                    })
                }
                break;
            case "shiftCutTime":
                shift.shiftCutTime = item;
                if ($scope.datalist.length > 1) {
                    otherKeywords.shiftCutTime = item;
                    angular.forEach($scope.datalist, function (data) {
                        getParams(data)
                    })
                }
                break;
            default:
                break
        }
    }

    function hourFunc(num) {
        return num > 23 ? 23 : num
    }

    function minterFunc(num) {
        return num >= 30 ? '30' : '00';
    }
    function getParams(data) {
        var a = otherKeywords.onDutyTime ? otherKeywords.onDutyTime : data.onDutyTime,
            b = otherKeywords.offDutyTime ? otherKeywords.offDutyTime : data.offDutyTime,
            c = otherKeywords.diningStartDatetime ? otherKeywords.diningStartDatetime : data.diningStartDatetime,
            d = otherKeywords.diningEndDatetime ? otherKeywords.diningEndDatetime : data.diningEndDatetime,
            e = otherKeywords.shiftCutTime ? otherKeywords.shiftCutTime : data.shiftCutTime;
        if (data.onDutyTime == a && data.offDutyTime == b && data.diningStartDatetime == c && data.diningEndDatetime == d && data.shiftCutTime == e) {
            data.show = true
        } else {
            data.show = false
        }
    }

    function timeCut(item) {
        if (item) {
            return item.substr(0, 5);
        } else {
            return item
        }
    }

}]);


VkrmsApp.controller('OvertimeShiftController', ['$scope', '$filter', '$http', 'CommonService', function ($scope, $filter, $http, commonService) {
    $scope.title = "万科资源管理信息系统 - 班次设置";
    $scope.overtimeShifts = [];
    var allOvertimeShifts = [];

    $http.get(apiBaseUrl + "/overtime-shifts")
        .success(function (shifts) {
            $scope.overtimeShifts = shifts;
            allOvertimeShifts = shifts;
        });

    $scope.saveOvertimeShift = function (data, id) {
        if (!$scope.inserted || $scope.inserted.id !== id) {
            angular.extend(data, {id: id});
        } else {
            $scope.inserted = null;
        }
        $http.post(apiBaseUrl + '/overtime-shifts', data, {
            headers: utils.generateHeaders()
        }).error(function (data, status, headers, config) {
            commonService.alert({'content': '保存失败，请重新刷新页面.', 'icon': 'fa-exclamation-circle'});
        });
    };

    $scope.removeOvertimeShift = function (index, overtimeShiftId) {
        var config = {
            "title": "删除提示",
            "icon": "fa-exclamation-circle",
            "content": "您确认删除此加班班次设置吗？",
            "callback": function () {
                $scope.overtimeShifts.splice(index, 1);
                $http.delete(apiBaseUrl + "/overtime-shift/" + overtimeShiftId, {headers: utils.generateHeaders()});
            }
        };
        commonService.confirm(config);
    };

    $scope.addOvertimeShift = function () {
        if ($scope.inserted) {
            return;
        }
        var lastElementId = $scope.overtimeShifts.length - 1 < 0 ? 0 : $scope.overtimeShifts[$scope.overtimeShifts.length - 1].id;
        $scope.inserted = {
            id: lastElementId + 1,
            label: '',
            description: '',
            duration: 0
        };
        $scope.overtimeShifts.push($scope.inserted);
    };

    $scope.removeTempOvertimeShift = function () {
        var index = $scope.overtimeShifts.indexOf($scope.inserted);
        if (index >= 0) {
            $scope.overtimeShifts.splice(index, 1);
        }
        $scope.inserted = null;
    };

    $scope.checkDescription = function (data) {
        if (!data) {
            return "加班说明不能为空!";
        }
        if (data.length >= 20) {
            return "加班说明长度最多为20！";
        }
    };

    $scope.checkLabel = function (data) {
        if (!data) {
            return "加班名称不能为空!";
        }
        if (data.length >= 10) {
            return "加班名称长度最多为10！"
        }
        if (data == "加班") {
            return "加班为系统预留名字，请重命名！";
        }
    };

    $scope.checkDuration = function (data) {
        if (!data) {
            return "加班时长不能为零或空！";
        }
        if (!utils.checkNumber(data)) {
            return "加班时长为正数且最多两位小数！";
        }
    };

    $scope.searchOvertimeShift = function () {
        var keywords = $scope.keywords;
        var filteredShifts;

        filteredShifts = $.grep(allOvertimeShifts, function (shift) {
            var label = shift.label ? shift.label : "";
            return label.indexOf(keywords) > -1;
        });

        $scope.overtimeShifts = filteredShifts;
    };

    $scope.clear = function () {
        $scope.keywords = "";
    };

}]);
