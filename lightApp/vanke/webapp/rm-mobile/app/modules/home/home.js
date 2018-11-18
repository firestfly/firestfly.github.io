(function (window) {

    'use strict';

    angular.module('rmMobile.home')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$rootScope', 'CommonService', 'WealthService', '$q', '$http'];

    function HomeCtrl($rootScope, commonService, wealthService, $q, $http) {
        var rmUser = commonService.getRMUser(),
            authorityJobIdArr = [50320825, 50388811, 50388093],
            authorityJobArr = ['公共维修', '班长（公共维修）', '设备监控'],
            authorityHrArr = ['人力资源'],
            home = this;
        init();
        getPoints();

        function init() {
            $rootScope.$broadcast('refreshNav', {
                title: '我的资源服务',
                showBack: false,
                showClose: true,
                showCalendar: false
            });
        }

        function getPoints() {
            console.log('environment==' + environment);
            var queryPointsObj = commonService.getPointDefaultDateQuery();
            var env = environment;
            var linkPage = null, linkPage2;
            if (env == 'sit') {
                linkPage = 'http://rmsit.owl1024.com/?loginMobile=' + rmUser.loginMobile + '#/attendance/'
            } else {
                linkPage = 'https://yosemite.vankeservice.com/?loginMobile=' + rmUser.loginMobile + '#/attendance/'
            }
            if (env == 'sit') {
                linkPage2 = '/mobile-apply-vacation/post?loginMobile=' +
                    rmUser.loginMobile;
            } else {
                linkPage2 = '/mobile-apply-vacation/post?loginMobile=' +
                    rmUser.loginMobile;
            }
            commonService.getAuthority().then(function (result) {
                home.mainItems = [{
                    mainLeft: '考勤结果',
                    linkage: '#/myattendance'
                }, {
                    mainLeft: '排班信息',
                    linkage: '#/schedule'
                }, {
                    mainLeft: '签到信息',
                    linkage: '#/sign-in'
                }, {
                    mainLeft: '考勤汇总',
                    // linkage: '#/attendance'
                    linkage: linkPage
                }];
                $rootScope.departments = result.departments;
                if (result.isPostAuthority) {
                    home.mainItems.push({
                        mainLeft: '按岗查看',
                        cellSeprate: true,
                        linkage: linkPage2
                    });
                }
                wealthService.getWealthValue(result.id).then(function (data) {
                    /*angular.forEach(authorityJobIdArr, function (v) {
                        if (v == result.jobId || v == result.sapJobId) {
                            //维修财富值
                            home.mainItems.unshift({
                                mainLeft: '我的财富值',
                                mainRight: (data && data.wealthValue) || 0,
                                cellSeprate: true,
                                linkage: '?from=h5#/wealth'
                            });
                            home.showWealthValue = true;
                        }
                     });*/
                    if (result.jobName.indexOf(authorityHrArr[0]) > -1 || result.sapJobName.indexOf(authorityHrArr[0]) > -1) {
                        //考勤Wi-Fi管理
                        home.mainItems.unshift({
                            mainLeft: '考勤Wi-Fi管理',
                            cellSeprate: true,
                            linkage: '#/wifi/add'
                        });
                    }
                })
            });
        }
    }

})(window);
