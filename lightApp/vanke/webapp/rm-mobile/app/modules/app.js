(function () {

    'use strict';

    angular
        .module('rmMobile', [
            'ngRoute',
            'ngTouch',
            'pickadate',
            'rmMobile.common',
            'rmMobile.directive',
            'rmMobile.home',
            'rmMobile.point',
            'rmMobile.schedule',
            'rmMobile.attendance',
            'rmMobile.signIn',
            'rmMobile.MyAttendance',
            'rmMobile.description',
            'rmMobile.wifi',
            'rmMobile.wealth'
        ])
        .config(routeConfig)
        .run(init);

    routeConfig.$inject = ['$routeProvider', '$httpProvider'];

    function routeConfig($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'rm-mobile/app/modules/home/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'home'
            })
            .when('/description/:desType', {
                templateUrl: 'rm-mobile/app/modules/description/index.html',
                controller: 'DescriptionCtrl',
                controllerAs: 'des'
            })
            .when('/point', {
                templateUrl: 'rm-mobile/app/modules/point/point.html',
                controller: 'PointCtrl',
                controllerAs: 'point'
            })
            .when('/calendar/:target', {
                templateUrl: 'rm-mobile/app/modules/home/calendar.html',
                controller: 'CalendarCtrl',
                controllerAs: 'calendar'
            })
            .when('/myattendance', {
                templateUrl: 'rm-mobile/app/modules/myattendance/index.html',
                controller: 'MyAttendanceCtrl',
                controllerAs: 'myattendance'
            })
            .when('/attendance', {
                templateUrl: 'rm-mobile/app/modules/attendance/attendance.html',
                controller: 'AttendanceCtrl',
                controllerAs: 'attendance'
            })
            .when('/attendance/holidays', {
                templateUrl: 'rm-mobile/app/modules/attendance/attendance-holidays.html',
                controller: 'AttendanceHolidaysCtrl',
                controllerAs: 'attendanceHolidays'
            })
            .when('/attendance/holidays/:type', {
                templateUrl: 'rm-mobile/app/modules/attendance/attendance-rest.html',
                controller: 'AttendanceRestCtrl',
                controllerAs: 'attendanceRest'
            })
            .when('/attendance-detail/:type', {
                templateUrl: 'rm-mobile/app/modules/attendance/attendance-detail.html',
                controller: 'AttendanceDetailCtrl',
                controllerAs: 'attendanceDetail'
            })
            .when('/attendance-rest/:type', {
                templateUrl: 'rm-mobile/app/modules/attendance/attendance-rest.html',
                controller: 'AttendanceRestCtrl',
                controllerAs: 'attendanceRest'
            })
            .when('/schedule', {
                templateUrl: 'rm-mobile/app/modules/schedule/schedule.html',
                controller: 'ScheduleCtrl',
                controllerAs: 'schedule'
            })
            .when('/sign-in', {
                templateUrl: 'rm-mobile/app/modules/sign-in/sign-in.html',
                controller: 'SignInCtrl',
                controllerAs: 'signIn'
            })
            .when('/wifi/update', {
                templateUrl: 'rm-mobile/app/modules/wifi/wifiUpdate.html',
                controller: 'WifiUpdateCtrl',
                controllerAs: 'wu'
            })
            .when('/wifi/add', {
                templateUrl: 'rm-mobile/app/modules/wifi/wifiAdd.html',
                controller: 'WifiAddCtrl',
                controllerAs: 'wa'
            })
            .when('/wifi/modify', {
                templateUrl: 'rm-mobile/app/modules/wifi/wifiModify.html',
                controller: 'WifiModifyCtrl',
                controllerAs: 'wm'
            })
            .when('/wifi/search', {
                templateUrl: 'rm-mobile/app/modules/wifi/wifiSearch.html',
                controller: 'WifiSearchCtrl',
                controllerAs: 'ws'
            })
            .when('/wealth', {
                templateUrl: 'rm-mobile/app/modules/wealth/index.html',
                controller: 'MyWealthCtrl',
                controllerAs: 'mw'
            })
            .when('/wealth/details/:isTaskWealth', {
                templateUrl: 'rm-mobile/app/modules/wealth/details.html',
                controller: 'MyWealthDetailsCtrl',
                controllerAs: 'mwd'
            })
            .when('/wealth/history', {
                templateUrl: 'rm-mobile/app/modules/wealth/history.html',
                controller: 'MyWealthHistoryCtrl',
                controllerAs: 'mwh'
            })
            .otherwise({
                redirectTo: '/'
            });

        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {}
        }
        $httpProvider.defaults.headers.common["X-Requested-WITH"] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }

    function init() {
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function () {
                FastClick.attach(document.body);
            }, false);
        }
    }

})();
