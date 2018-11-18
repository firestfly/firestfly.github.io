(function (window) {

    'use strict';

    angular.module('rmMobile')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$rootScope', '$scope', '$location', 'CommonService', '$q'];

    function MainCtrl($rootScope, $scope, $location, commonService, $q) {
        var main = this;

        main.title = "我的资源服务";
        main.showBack = false;
        main.showClose = true;
        main.backPage = '/';
        main.back = historyBack;
        main.close = close;
        main.calendar = calendar;
        main.ok = closeDialog;
        main.filterSelect = filterSelect;

        window.SSID = {};

        window.getSSID = function () {
            var deferred = $q.defer();
            var ssidObj = {
                "method": "getSSid",
                "content": "",
                "success": "SSID.success",
                "error": "SSID.error"
            };

            // {"success":"SSID.success","content":"ssid:vk-mobile,bssid:cc:46:d6:b6:cb:de", "method":"getSSid","error":"SSID.error"}
            window.location.href = '/native_service?data=' + JSON.stringify(ssidObj);

            window.SSID.success = function (ssidResult) {
                var resultObj = JSON.parse(ssidResult);
                var content = resultObj.content.split(',');
                window.SSID.ssid = content[0].split(':')[1];
                window.SSID.bssid = content[1].split(':').splice(1).join(':');
                deferred.resolve(ssidResult);
            };

            window.SSID.error = function (response) {
                deferred.reject(response);
            };

            //window.SSID = {
            //    ssid: 'vk-wifi',
            //    bssid: 'aa:aa:aa:aa:aa:aa'
            //};
            //deferred.resolve(window.SSID);

            return deferred.promise;

        };


        function historyBack() {
            if (window.getQueryString('fromPage') == 'sign-card') {
                close();
                return false;
            }
            if (main.backPage == 'back') {
                window.history.back();
            } else if (main.backPage == 'close') {
                close();
            } else if (main.backPage) {
                $location.path(main.backPage);
            } else {
                $location.path('/');
            }
        }

        function close() {
            window.location.href = '/native_service?data={"method":"closeWeb"}';
        }

        function calendar() {
            $location.path("/calendar/" + commonService.getCalendarTarget());
        }

        function closeDialog() {
            $rootScope.modelBox = false;
        }

        function filterSelect() {
            if (main.rightBtnHref) {
                $location.path(main.rightBtnHref);
            } else {
                $scope.$broadcast('opModelYear');
            }
        }

        $scope.$on("refreshNav", function (event, args) {
            main.title = args.title;
            main.showBack = args.showBack;
            main.showClose = args.showClose;
            main.showCalendar = args.showCalendar;
            main.refresh = args.refresh;
            main.backPage = args.backPage;
            main.rightBtnText = args.rightBtnText;
            main.backBtnText = args.backBtnText || "返回";
            main.rightBtnHref = args.rightBtnHref;
        });
        $scope.reFreshDay = function (e) {
            $scope.$broadcast('to-child');
        }
    }

})(window);
