(function (window) {

    'use strict';

    angular.module('rmMobile.signIn')
        .controller('SignInCtrl', SignInCtrl);

    SignInCtrl.$inject = ['$rootScope', 'CommonService', 'SignInService', '$scope', '$filter'];

    function SignInCtrl($rootScope, commonService, signInService, $scope, $filter) {
        var signIn = this,
            today = new Date(),
            currentDate = today,
            rmUser = commonService.getCurrentUser(),
            isWatch = true,
            todayFormat = $filter('date')(today, 'yyyy/MM/dd');
        commonService.getAuthority().then(function (result) {
            signIn.employeeInfo = result;
        });
        signIn.signInCollection = [];
        signIn.dateForShow = today;
        signIn.hideNextDay = true;
        signIn.maxdate = today;
        signIn.mindate = new Date(new Date(todayFormat).getTime() - (4 * 7 - 1 + today.getDay()) * 24 * 60 * 60 * 1000);
        signIn.updateDay = updateDay;
        signIn.refreshSignInLocation = refreshSignInLocation;
        signIn.currentWeek = $filter('date')(currentDate, 'EEE');
        init();
        $scope.$watch('signIn.date', function () {
            if (signIn.date && isWatch) {
                currentDate = Date.parse(signIn.date.replace(/-/g, "/"));
                getMySignIn();
            }
        });
        function init() {
            $rootScope.$broadcast('refreshNav', {
                title: '签到信息',
                showBack: true,
                showClose: false,
                showCalendar: false,
                refresh: true
            });
            getSignInRecord($filter('date')(currentDate, 'yyyy-MM-dd'));
        }

        //getMySignIn();
        function getMySignIn() {
            var day = $filter('date')(currentDate, 'yyyy-MM-dd'),
                day2 = $filter('date')(currentDate, 'yyyy/MM/dd');
            signIn.hideNextDay = day == $filter('date')(today, 'yyyy-MM-dd');
            signIn.currentWeek = $filter('date')(currentDate, 'EEE');
            signIn.dateForShow = signIn.date = day;
            getSignInRecord(day);

            if ((new Date(todayFormat).getTime() - new Date(day2)) >= (4 * 7 - 1 + today.getDay()) * 24 * 60 * 60 * 1000) {
                $scope.lastDayDisabled = true;
                return;
            } else {
                $scope.lastDayDisabled = false;
            }
        }

        $scope.$on('to-child', function (e) {
            signIn.updateDay('today')
        });
        function getSignInRecord(queryDate) {
            signIn.signInCollection = [];
            var querySignInObj = {
                loginMobile: rmUser.loginMobile,
                attendanceDate: queryDate
            };
            signInService.getSignInByDate(querySignInObj).then(
                function (signInResult) {
                    var attendances = signInResult.result.attendances,
                        tmpDate,
                        isValid,
                        attendanceSpot;
                    for (var index in attendances) {
                        var attendance = {};
                        tmpDate = new Date(attendances[index].attendanceTime.replace(/-/g, "/"));
                        isValid = attendances[index].isValid;
                        attendanceSpot = attendances[index].attendanceSpot;
                        applyColor(attendance, isValid, attendanceSpot);

                        attendance.attendanceDetailId = attendances[index].attendanceDetailId;
                        attendance.attendanceTime = tmpDate.getHours() + ':' + (tmpDate.getMinutes() > 9 ? tmpDate.getMinutes() : '0' + tmpDate.getMinutes());
                        attendance.attendanceSpot = attendanceSpot;
                        attendance.attendanceValid = attendanceArea(isValid);
                        attendance.attendanceType = attendanceTypes(attendances[index].attendanceType);
                        signIn.signInCollection.push(attendance);
                    }
                },
                function (error) {
                    commonService.alert('网络异常，请稍后再试');
                }
            );
        }

        function attendanceTypes(type) {
            // 0:助这儿，1：手动校正，2：补签到
            var typeName;
            switch (type) {
                case 0:
                    typeName = '助这儿GPS签到';
                    break;
                case 1:
                    typeName = '手动校正';
                    break;
                case 2:
                    typeName = '补签到';
                    break;
                /*                case 3:
                    typeName = '系统补签到';
                 break;*/
                case 4:
                    typeName = '助这儿WIFI签到';
                    break;
                case 5:
                    typeName = '拍照打卡';
                    break;
                default :
                    break;
            }
            return typeName
        }

        function attendanceArea(type) {
            // 0:区域外，1：区域内，2：-
            var address;
            switch (type) {
                case 0:
                    address = '区域外';
                    break;
                case 4:
                case 1:
                case 2:
                case 3:
                    address = '区域内';
                    break;
                default :
                    break;
            }
            return address
        }

        function updateDay(direction) {
            if (direction == 'lastDay') {
                if ((new Date(todayFormat).getTime() - currentDate) >= (4 * 7 - 1 + today.getDay()) * 24 * 60 * 60 * 1000) {
                    $scope.lastDayDisabled = true;
                    return false;
                }
                currentDate = currentDate - 86400000;
            } else if (direction == 'nextDay') {
                currentDate = currentDate + 86400000;
                $scope.lastDayDisabled = false;
            } else {
                return;
            }
            var timeDiff = today.getTime() - currentDate;
            signIn.hideNextDay = timeDiff == 0;
            signIn.dateForShow = $filter('date')(currentDate, 'yyyy-MM-dd');
            signIn.date = $filter('date')(currentDate, 'yyyy-MM-dd');
        }

        function refreshSignInLocation(attendanceToUpdate) {
            signInService.getSignInRecord(attendanceToUpdate.attendanceDetailId).then(
                function (attendanceResult) {
                    var attendance = attendanceResult.result,
                        tmpDate;

                    applyColor(attendanceToUpdate, attendance.isValid, attendance.attendanceSpot);

                    tmpDate = new Date(attendance.attendanceTime.replace(/-/g, "/"));
                    attendanceToUpdate.attendanceTime = tmpDate.getHours() + ':' + (tmpDate.getMinutes() > 9 ? tmpDate.getMinutes() : '0' + tmpDate.getMinutes());
                    attendanceToUpdate.attendanceSpot = attendance.attendanceSpot;
                    attendanceToUpdate.attendanceValid = attendanceArea(attendance.isValid);
                    attendanceToUpdate.attendanceType = attendanceTypes(attendance.attendanceType);
                },
                function (error) {
                    commonService.alert('网络异常，请稍后再试');
                }
            );
        }

        function applyColor(attendance, isValid, attendanceSpot) {
            if (isValid) {
                attendance.fontNormal = true;
                attendance.fontLoading = false;
                attendance.fontFail = false;
            } else {
                attendance.fontNormal = false;
                if (attendanceSpot == '位置正在获取中...') {
                    attendance.fontLoading = true;
                    attendance.fontFail = false;
                } else {
                    attendance.fontLoading = false;
                    attendance.fontFail = true;
                }
            }
        }

    }

})(window);
