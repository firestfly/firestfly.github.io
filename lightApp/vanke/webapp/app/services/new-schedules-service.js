/**
 * Created by wangq34 on 2016/5/12.
 */

(function () {

    'use strict';

    angular
        .module('vkrmsApp')
        .factory('NewScheduleService', NewScheduleService);

    NewScheduleService.$inject = ['$rootScope', '$q', '$http', '$filter', '$timeout', 'CommonService', 'UserService'];

    function NewScheduleService($scope, $q, $http, $filter, $timeout, commonService, userService) {

        var service = {
            getSchedules: getSchedules,
            applyScheduleTable: applyScheduleTable,
            getShiftsFromServer: getShiftsFromServer,
            getPostOptionsFromServer: getPostOptionsFromServer,
            getAllType: getAllType,
            getDateStr: getDateStr,
            getEmptyScheduleCell: getEmptyScheduleCell,
            copyPreviousFail: copyPreviousFail
        };

        return service;
        function applyScheduleTable(obj) {
            console.log(obj)
        }

        function getSchedules(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/schedule-sheet", {
                    params: {search: params}
                })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getPostOptionsFromServer(departmentId) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/department-fixed-post-collect/" + departmentId)
                .success(function (fixedPosts) {
                    deferred.resolve(fixedPosts);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getShiftsFromServer(departmentId) {
            var deferred = $q.defer();
            $http.post(apiBaseUrl + "/view-switch-shift", departmentId)
                .success(function (shifts) {
                    deferred.resolve(shifts);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
            /*$http.get(apiBaseUrl + "/shifts").success(function (shifts) {
             $scope.shifts = $scope.shifts.concat(shifts);
             });*/
        }

        function getAllType() {
            var allType = ['加班|REGULAR_WITH_OVERTIME', '加班|OFF_DAY_OVERTIME', '|REGULAR', '出差|EVENCTION', '外勤|TRIP', '月休|HOLIDAY', '调休假|ADJUSTABLE', '额外带薪年休假|PAY_ANNUAL', '法定年休假|STATUTORY_ANNUAL',
                '春节调休假|SPRING_FESTIVAL', '结转年休假|CARRY_OVER', '婚假|MARRIAGE', '丧假|FUNERAL', '产假|MATERNITY', '护理假|NURSING', '节育假|CONTRACEPTION', '计划生育假|FAMILY_PLANNING', '普通病假或医疗期外|ORDINARY_SICK', '法定病假医疗期|STATUTORY_SICK', '法定工伤医疗期|INDUSTRIAL_INJURY',
                '事假|PRIVATE_AFFAIR', '其他带薪假|OTHER_PAY', '脱产学习假|DAY_RELEASE', '探亲假|HOME'];
            return allType;
        }

        //day---基准天    addDayCount---与基准天相差的天数，例如：-1前一天，1后一天
        function getDateStr(day, addDayCount) {
            var result;
            var dateArr = new Date(day.replace(/-/g, "/"));
            result = $filter('date')(dateArr.setDate(dateArr.getDate() + addDayCount), 'yyyy-MM-dd');
            return result;
        }

        function getEmptyScheduleCell(object, day) {
            var emptyShift = {
                beforeShiftOvertimeDuration: 0,
                afterShiftOvertimeDuration: 0,
                countDuration: 0,
                departmentId: object.departmentId,
                diningDuration: 0,
                diningDurationAddition: null,
                employeeId: object.employeeId,
                fragmentBeginTime: null,
                fragmentEndTime: null,
                id: null,
                label: null,
                labelAddition: null,
                labelFixedPostAdditionId: null,
                labelFixedPostAdditionName: null,
                labelFixedPostId: null,
                labelFixedPostName: null,
                lieuLeaveBeginTime: null,
                lieuLeaveEndTime: null,
                name: object.name,
                offDutyTime: null,
                offDutyTimeAddition: null,
                onDutyDay: day,
                onDutyTime: null,
                onDutyTimeAddition: null,
                sapId: object.sapId || null,
                timeDuration: null,
                type: null
            };
            return emptyShift;
        }

        function copyPreviousFail() {
            commonService.alert({
                content: '网络异常，请重新连接网络',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        }

    }

    String.prototype.concatTime = function () {
        var str = this;
        if (str.indexOf(':') != -1 && str.split(':').length < 3) {
            str = str + ':00';
        }
        return str;
    };

    String.prototype.subTime = function () {
        if (this.indexOf(':') == -1) {
            return this;
        }
        var arr = this.split(':'),
            result;
        if (arr.length > 2) {
            result = arr[0] + ':' + arr[1];
        } else {
            result = this;
        }
        return result;
    };

    String.prototype.toPrompt = function () {
        var arr = this.split('-');
        return arr[0] + '年' + arr[1] + '月' + arr[2] + '日';
    };

    String.prototype.timeToNum = function () {
        return this && this.toString().indexOf(':') != -1 ? parseInt(this.subTime().split(':').join('')) : this;
    };

    $.extend({
        isEmpty: function (value, allowEmptyString) {
            return (value == null) || (value == undefined) || (!allowEmptyString ? value === '' : false) || ($.isArray(value) && value.length === 0) || (value === '-') || (value === '-|null|null|null') || (value == 'null');
        }
    });

    //json数组按值删除一项
    Array.prototype.del = function (key, value) {
        for (var i = 0; i < this.length; i++) {
            if (eval('(' + 'this[' + i + '].' + key + "=='" + value + "')")) {
                this.splice(i, 1);
            }
        }
        return this;
    };

    Array.prototype.hasString = function (str) {
        return (this.toString().indexOf(str) > -1);
    };

    Array.prototype.deleteDuplication = function () {
        var result = [],
            hash = {},
            arr = this;
        for (var i = 0, elem;
             (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }

})();
