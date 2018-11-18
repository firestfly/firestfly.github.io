(function (window) {

    'use strict';

    angular.module('rmMobile.common')
        .factory('CommonService', CommonService);

    CommonService.$inject = ['$rootScope', '$http', '$q', '$filter'];

    function CommonService($rootScope, $http, $q, $filter) {
        var rmUser;
        var factory = {
            calendarTarget: "",
            taskList: {},
            attendanceList: {},
            attendanceType: {},
            holidaysList: {},
            getRMUser: getRMUser,
            getAuthority: getAuthority,
            setCalendarTarget: setCalendarTarget,
            getCalendarTarget: getCalendarTarget,
            setAttendanceType: setAttendanceType,
            getAttendanceType: getAttendanceType,
            setTaskList: setTaskList,
            getTaskList: getTaskList,
            setHolidaysList: setHolidaysList,
            getHolidaysList: getHolidaysList,
            setAttendanceList: setAttendanceList,
            getAttendanceList: getAttendanceList,
            getDefaultDateQuery: getDefaultDateQuery,
            getPointDefaultDateQuery: getPointDefaultDateQuery,
            getCurrentUser: getCurrentUser,
            getScheduleDefaultDateQuery: getScheduleDefaultDateQuery,
            alert: alert,
            showSecondDay: showSecondDay,
            toFixed: toFixed
        };

        return factory;

        function setCalendarTarget(target) {
            factory.calendarTarget = target;
        }

        function toFixed(number, to) {
            var number = parseFloat(number) || 0;
            to = to || 2;
            return !isNaN(number) && !isNaN(to) && number.toFixed(to);
        }
        function setHolidaysList(data) {
            factory.holidaysList = data;
        }

        function getHolidaysList() {
            return factory.holidaysList;
        }

        function showSecondDay(onDate, showDate, currentDate) {
            var H, M, _showDate;
            if (onDate) {
                currentDate = (currentDate || onDate).replace(/-/g, "/");
                currentDate = new Date(currentDate);
                if (showDate) {
                    _showDate = showDate.replace(/-/g, "/");
                    _showDate = new Date(_showDate);
                    if (isNaN(_showDate)) {
                        return showDate;
                    }
                    H = _showDate.getHours();
                    M = _showDate.getMinutes();
                    H = H >= 10 ? H : "0" + H;
                    M = M >= 10 ? M : "0" + M;
                    if (currentDate.getDate() != _showDate.getDate()) {
                        return "次日" + H + ":" + M;
                    }
                    return H + ":" + M;
                } else {
                    onDate = onDate.replace(/-/g, "/");
                    onDate = new Date(onDate);
                    if ((+onDate + 2 * 60 * 60 * 1000) < +new Date()) {
                        return "漏签到";
                    } else {
                        return "";
                    }
                }
            }
        }

//权限管理,人员信息
        function getAuthority() {
            var defer = $q.defer();
            $http.get(baseUrl + '/internal/api/authority/' + getRMUser().loginMobile, {cache: true}).success(function (result) {
                defer.resolve(result);
            }).error(function (error) {

            });
            return defer.promise;
        }

        function getRMUser() {
            var userLoginMobile, accessToken;
            if (rmUser) {
                return rmUser;
            } else {
                userLoginMobile = window.getQueryString('loginMobile');
                accessToken = window.getQueryString('token');
                if (userLoginMobile == null) {
                    rmUser = JSON.parse(utils.getCookie('rmUser'));
                } else {
                    rmUser = {
                        loginMobile: userLoginMobile,
                        token: accessToken
                    };
                    utils.setCookie('rmUser', JSON.stringify(rmUser));
                }
                return rmUser;
            }
        }

        function getCalendarTarget() {
            return factory.calendarTarget;
        }

        function setAttendanceType(attendanceType) {
            factory.attendanceType = attendanceType;
        }

        function getAttendanceType() {
            return factory.attendanceType;
        }

        function setTaskList(taskList) {
            factory.taskList = taskList;
        }

        function getTaskList() {
            return factory.taskList;
        }

        function setAttendanceList(attendanceList) {
            factory.attendanceList = attendanceList;
        }

        function getAttendanceList() {
            return factory.attendanceList;
        }

        function getCurrentUser() {
            return JSON.parse(utils.getCookie('rmUser'));
        }

        function getDefaultDateQuery() {
            var today = new Date(),
                toDate = $filter("date")(today, "MM/dd/yyyy"),
                fromDate = today - (4 * 7 - 1 + today.getDay()) * 24 * 60 * 60 * 1000,
                fromDate = $filter("date")(new Date(fromDate), "MM/dd/yyyy"),
                rmUser = this.getCurrentUser();
            return {
                beginDate: fromDate,
                endDate: toDate,
                loginMobile: rmUser.loginMobile
            };
            /*var today = new Date(),
                year = today.getFullYear(),
                month = today.getMonth() + 1,
                day = today.getDate(),
                fromDate,
                toDate,
                queryPointsObj,
                rmUser = this.getCurrentUser();

            if (day <= 20) {    //上个月21日至今
                if (month == 1) {
                    fromDate = '12/21/' + (year - 1);
                } else {
                    fromDate = month - 1 + '/21/' + year;
                }
            } else {            //本月21日至今
                fromDate = month + '/21/' + year;
            }
            toDate = month + '/' + day + '/' + year;

            queryPointsObj = {
                beginDate: fromDate,
                endDate: toDate,
                loginMobile: rmUser.loginMobile
            };
             return queryPointsObj;*/

        }

        function getPointDefaultDateQuery() {
            var today = new Date(),
                year = today.getFullYear(),
                month = today.getMonth() + 1,
                day = today.getDate(),
                fromDate,
                toDate,
                queryPointsObj,
                rmUser = this.getCurrentUser();
            fromDate = month + '/1/' + year;
            toDate = month + '/' + day + '/' + year;

            queryPointsObj = {
                beginDate: fromDate,
                endDate: toDate,
                loginMobile: rmUser.loginMobile
            };
            return queryPointsObj;

        }

        function getScheduleDefaultDateQuery() {
            var today = new Date(),
                weekday = today.getDay() == 0 ? 7 : today.getDay(),
                weekstart = new Date(today.setDate(today.getDate() - weekday + 1)),
                tmp = new Date(weekstart.getTime()),
                weekend = new Date(tmp.setDate(weekstart.getDate() + 6)),
                queryPointsObj,
                rmUser = this.getCurrentUser();

            queryPointsObj = {
                beginDate: weekstart.getMonth() + 1 + '/' + weekstart.getDate() + '/' + weekstart.getFullYear(),
                endDate: weekend.getMonth() + 1 + '/' + weekend.getDate() + '/' + weekend.getFullYear(),
                loginMobile: rmUser.loginMobile
            };

            return queryPointsObj;
        }

        function alert(msg) {
            $rootScope.modelBox = true;
            $rootScope.msg = msg;
        }
    }

    angular.module('rmMobile')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'msg'];

    function ModalInstanceCtrl($scope, $uibModalInstance, msg) {

        $scope.msg = msg;
        $scope.ok = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    angular.module('rmMobile')
        .filter('hourOver', function () {
            return function (item, miss) {
                if (item == null || item == '-') {
                    if (miss) {
                        return "漏签到";
                    }
                    return '-';
                } else {
                    var str = item.substr(0, 2)
                    if (parseInt(str) < 24) {
                        return item.substr(0, 5);
                    } else {
                        var newStr = str - 24;
                        newStr = newStr < 10 ? '次日 0' + newStr : '次日 ' + newStr;
                        return newStr + item.substr(2, 3);
                    }
                }
            }
        });
})(window);