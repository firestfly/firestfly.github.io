(function () {

    'use strict';

    angular.module('rmMobile.wealth')
        .controller('MyWealthHistoryCtrl', MyWealthHistoryCtrl);

    MyWealthHistoryCtrl.$inject = ['$rootScope', 'CommonService', '$scope', '$filter', 'WealthService'];

    function MyWealthHistoryCtrl($rootScope, commonService, $scope, $filter, wealthService) {
        var mwh = this,
            today = new Date(),
            rmUser = commonService.getCurrentUser();
        mwh.NumberToFixed = NumberToFixed;
        mwh.toFixed = commonService.toFixed;
        //beginDate = $filter("date")(new Date().setMonth(today.getMonth() - 1), "MM/21/yyyy"),
        //endDate = $filter("date")(today, "MM/20/yyyy");

        var param = {
            loginMobile: rmUser.loginMobile,
            beginDate: null,
            endDate: null
        };
        var params = {
            "search": JSON.stringify(param)
        };
        var winW = window.innerWidth || document.body.scrollWidth,
            wealthFontSize = winW / 16;
        mwh.smallFont = wealthFontSize > 28 ? "16px" : wealthFontSize / 80 + "rem";
        wealthFontSize = wealthFontSize > 28 ? "28px" : wealthFontSize / 45 + "rem";
        mwh.horizontalStepWidth = horizontalStepWidth;
        mwh.horizontalStepColor = horizontalStepColor;
        mwh.colorArray = ['#128B39', '#F3D726', '#E9A161', '#DA6467'];
        init();

        function init() {
            $rootScope.$broadcast('refreshNav', {
                title: '兑换历史',
                showBack: true,
                showClose: false,
                backPage: '/wealth',
                rightBtnText: "筛选"
            });
            getWealthValueHistory();
        }

        $scope.$on('getYear', function (event, data) {
            var m = data.getMonth(),
                y = data.getFullYear();
            param.beginDate = (m || 12) + "/21/" + (m ? y : y - 1);
            param.endDate = m + 1 + "/20/" + y;
            params = {
                "search": JSON.stringify(param)
            };
            getWealthValueHistory();
        });
        function getWealthValueHistory() {
            wealthService.getWealthValueHistory(params).then(function (data) {
                mwh.wealthValueHistorys = data;
            });
        }

        function horizontalStepWidth(item, value) {
            var result = {};
            angular.forEach(item, function (obj, key) {
                if (value > obj.start && value <= obj.end) {

                    var a = obj.end - obj.start;
                    var b = value - obj.start
                    result = {
                        'width': counts(b / a, key),
                        'color': mwh.colorArray[key]
                    }

                }
            });
            return result;
        }

        function NumberToFixed(item) {
            if (item) {
                return item.toFixed(2);
            } else {
                return 0;
            }
        }
        function horizontalStepColor(item, value) {

            var result = {};
            angular.forEach(item, function (obj, key) {
                if (value > obj.start && value <= obj.end) {
                    var a = obj.end - obj.start;
                    var b = value - obj.start
                    result = {
                        'font-size': wealthFontSize,
                        'color': mwh.colorArray[key]
                    }

                }
            });
            return result;
        }

        function counts(item, key) {
            var before = 0.25 * key;
            var after = item / 4;
            return Math.round((before + after) * 10000) / 100.00 + "%"
        }
    }

})();
