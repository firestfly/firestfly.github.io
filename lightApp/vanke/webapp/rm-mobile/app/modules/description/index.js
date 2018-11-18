(function (window) {

    'use strict';

    angular.module('rmMobile.description', [])
        .controller('DescriptionCtrl', DescriptionCtrl);

    DescriptionCtrl.$inject = ['$rootScope', '$routeParams'];

    function DescriptionCtrl($rootScope, $routeParams) {
        var des = this,
            refreshNav = {
                showBack: true,
                showClose: false,
                showCalendar: false,
                backPage: "back"
            };
        des.desType = $routeParams.desType;

        if (des.desType == 1) {
            refreshNav.title = "财富值说明";
        }
        if (des.desType == 2) {
            refreshNav.title = "考勤说明";
        }

        init();
        function init() {
            $rootScope.$broadcast('refreshNav', refreshNav);
        }
    }

})(window);
