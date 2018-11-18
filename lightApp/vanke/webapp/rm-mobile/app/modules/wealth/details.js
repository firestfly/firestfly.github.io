(function () {

    'use strict';

    angular.module('rmMobile.wealth')
        .controller('MyWealthDetailsCtrl', MyWealthDetailsCtrl);

    MyWealthDetailsCtrl.$inject = ['$rootScope', 'CommonService', '$scope', '$filter', 'WealthService', '$routeParams'];

    function MyWealthDetailsCtrl($rootScope, commonService, $scope, $filter, wealthService, $routeParams) {
        var mwd = this,
        // today = new Date(),
            rmUser = commonService.getCurrentUser();
        mwd.showTask = $routeParams.isTaskWealth == 1;
        mwd.showLoading = true;
        var param = {
            loginMobile: rmUser.loginMobile,
            beginDate: null,
            endDate: null
        };
        init();

        mwd.generateArr = generateArr;
        mwd.getNotWealthValueDetails = getNotWealthValueDetails;
        mwd.getWealthValueDetails = getWealthValueDetails;
        mwd.taskTitleOverflow = taskTitleOverflow;
        mwd.toFixed2 = commonService.toFixed;

        function getNotWealthValueDetails() {
            var params = {
                "search": JSON.stringify(param)
            };
            wealthService.getNotWealthValueType().then(function (result) {
                mwd.notWealthValueTypeObj = result;
                wealthService.getNotWealthValueDetails(params).then(function (data) {
                    mwd.notWealthValueDetails = data;
                    mwd.showLoading = false;
                    mwd.noData = !data || !data.length;
                });
            });
        }

        $scope.$watch("calendarQueryObj", function (data) {
            param = data || param;
            if (mwd.showTask) {
                getWealthValueDetails();
            } else {
                getNotWealthValueDetails();
            }
        });
        function generateArr(data) {
            return new Array(+data);
        }

        function taskTitleOverflow(data) {
            return data.length > 6 ? data.slice(0, 6) + "..." : data;
        }

        function init() {
            commonService.setCalendarTarget("wealthDetail");
            $rootScope.$broadcast('refreshNav', {
                title: '财富值明细',
                showBack: true,
                showClose: false,
                backPage: '/wealth',
                showCalendar: true
            });
            //getWealthValueDetails();
        }

        function getWealthValueDetails() {
            var params = {
                "search": JSON.stringify(param)
            };
            wealthService.getWealthValueDetails(params).then(function (data) {
                mwd.wealthValueDetails = data;
                mwd.showLoading = false;
                mwd.noData = !data || !data.length;
            })
        }
    }

})();
