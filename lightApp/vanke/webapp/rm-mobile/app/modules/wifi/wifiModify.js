/**
 * Created by wangq34 on 2016/7/19.
 */

(function () {
    'use strict';

    angular
        .module('rmMobile.wifi')
        .controller('WifiModifyCtrl', WifiModifyCtrl);

    WifiModifyCtrl.$inject = ['$rootScope', 'WifiService', 'CommonService'];

    function WifiModifyCtrl($rootScope, WifiService, commonService) {
        var wm = this;
        commonService.getAuthority().then(function (result) {
            wm.employeeInfo = result;
        });
        init();

        function init() {
            $rootScope.$broadcast('refreshNav', {
                title: '考勤Wi-Fi管理',
                showBack: true,
                showClose: false,
                backPage: '/'
            });

            wm.departments = $rootScope.departments;
            wm.department = wm.departments[0];
            wm.fixedPostList = [];
            wm.departmentModal = false;
            wm.fixedPostModal = false;
            wm.SSID = {
                ssid: 'wk-mobile',
                bssid: 'cc:ds:34:78:df:cc:ds:34:78:df'
            };

            if ($rootScope.WifiInfoFormAdd) {
                wm.wifiInfo = $rootScope.WifiInfoFormAdd
            } else {
                wm.wifiInfo = $rootScope.wifiInfoFromSearch;
            }

            if (wm.wifiInfo) {
                wm.department = wm.wifiInfo.department;
                wm.fixedPostList = wm.wifiInfo.fixedPosts;
                wm.SSID = {
                    ssid: wm.wifiInfo.ssid,
                    bssid: wm.wifiInfo.bssid
                };
                wm.wifiId = wm.wifiInfo.id;
                wm.attendancePlace = wm.wifiInfo.attendancePlace;
            }

            $rootScope.department = wm.department;
            //wm.SSID = window.getSSID();
        }

        wm.save = function () {
            var params = {
                attendancePlace: wm.attendancePlace,
                id: wm.wifiId,
                fixedPostIds: getFixedPostIds()
            };
            WifiService.updateWifiInfo(params);
        };

        WifiService
            .getFixedPosts(wm.department.id)
            .then(function (response) {
                wm.fixedPosts = response;
            });

        wm.sigleSelect = function (obj) {
            angular.forEach(wm.departments, function (department) {
                department.selected = false;
            });
            obj.selected = true;
        };

        wm.fixedPostSelected = function () {
            wm.fixedPostList = [];
            angular.forEach(wm.fixedPosts, function (fixedPost) {
                if (fixedPost.selected == true) {
                    wm.fixedPostList.push(fixedPost);
                }
            });
            wm.fixedPostModal = !wm.fixedPostModal
        };

        wm.departmentSelected = function () {
            angular.forEach(wm.departments, function (department) {
                if (department.selected == true) {
                    wm.department = department;
                }
            });
            wm.departmentModal = !wm.departmentModal;
        };

        function getFixedPostIds() {
            return wm.fixedPostList.map(function (fixedPost) {
                return fixedPost.fixedPostId
            })
        }

    }

})();