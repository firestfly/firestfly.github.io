/**
 * Created by wangq34 on 2016/7/19.
 */

(function () {
    'use strict';

    angular
        .module('rmMobile.wifi')
        .controller('WifiSearchCtrl', WifiSearchCtrl);

    WifiSearchCtrl.$inject = ['$rootScope', 'WifiService', '$location', 'CommonService'];

    function WifiSearchCtrl($rootScope, WifiService, $location, commonService) {
        var ws = this;
        commonService.getAuthority().then(function (result) {
            ws.employeeInfo = result;
        });
        init();

        function init() {
            $rootScope.$broadcast('refreshNav', {
                title: '考勤Wi-Fi管理',
                showBack: true,
                showClose: false,
                backPage: '/'
            });

            ws.departmentModal = false;

            ws.departments = $rootScope.departments;

            ws.department = ws.department || $rootScope.department;
            ws.department.selected = true;

            search(ws.department.id);
        }

        ws.delete = function (id) {
            WifiService
                .deleteWifiInfo(id)
                .then(function () {
                    search(ws.department.id);
                })
        };

        function search(id) {
            WifiService
                .getWifiLists(id)
                .then(function (response) {
                    ws.totalItems = response.length;
                    ws.wifiInfoLists = response;
                });
        }

        ws.modifyWifiInfo = function (wifiInfo) {
            wifiInfo.department = ws.department;
            $rootScope.wifiInfoFromSearch = wifiInfo;
            $location.path('/wifi/add');
        };

        ws.departmentSelected = function () {
            angular.forEach(ws.departments, function (department) {
                if (department.selected == true) {
                    ws.department = department;
                    $rootScope.department = department;
                    search(department.id);
                }
            });
            ws.departmentModal = !ws.departmentModal;
        };

        ws.sigleSelect = function (obj) {
            angular.forEach(ws.departments, function (department) {
                department.selected = false;
            });
            obj.selected = true;
        };
    }

})();