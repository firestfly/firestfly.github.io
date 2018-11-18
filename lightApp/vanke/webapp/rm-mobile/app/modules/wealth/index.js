(function () {

    'use strict';

    angular.module('rmMobile.wealth', ['rmMobile.common'])
        .controller('MyWealthCtrl', MyWealthCtrl);

    MyWealthCtrl.$inject = ['$rootScope', 'CommonService', 'WealthService'];

    function MyWealthCtrl($rootScope, commonService, wealthService) {
        var mw = this;
        var wealthStep = [
            {
                ruleName: '基础财富值',
                start: 0,
                end: 1800
            },
            {
                ruleName: '1.05倍加速',
                start: 1800,
                end: 2800
            },
            {
                ruleName: '1.2倍加速',
                start: 2800,
                end: 4000
            },
            {
                ruleName: '1.5倍加速',
                start: 4000,
                end: 10000
            }
        ];
        init();
        function init() {
            var backPage;
            if (location.search.indexOf("from=h5") >= 0) {
                backPage = "/"
            } else {
                backPage = "close";
            }
            mw.wealthValueColor = {
                color: '#128B39'
            };
            $rootScope.$broadcast('refreshNav', {
                title: '我的财富值',
                showBack: true,
                showClose: false,
                backBtnText: '首页',
                backPage: backPage,
                rightBtnText: '历史',
                rightBtnHref: '/wealth/history'
            });

            commonService.getAuthority().then(function (result) {
                wealthService.getWealthValue(result.id).then(function (data) {
                    mw.res = data;
                    if (!mw.res) {
                        mw.res = {}
                        mw.res.exchangeRule = wealthStep;
                        mw.res.wealthValue = 0;
                    }
                    angular.forEach(mw.res.exchangeRule, function (obj, key) {
                        obj.isActive = false;
                        obj.showWealthValue = false;
                        obj.stepWidth = {
                            'width': '100%'
                        };
                        if (mw.res.wealthValue > obj.start) {
                            obj.isActive = true;
                            if (mw.res.wealthValue <= obj.end) {
                                mw.wealthValueColor = {
                                    'color': ['#128B39', '#F3D726', '#E9A161', '#DA6467'][key]
                                };
                                var a = obj.end - obj.start;
                                var b = mw.res.wealthValue - obj.start;
                                obj.showWealthValue = true;
                                obj.stepWidth = {
                                    'width': Math.round(b / a * 10000) / 100.00 + "%"
                                }
                            }
                        }
                    })
                });
            });
        }
    }

})();
