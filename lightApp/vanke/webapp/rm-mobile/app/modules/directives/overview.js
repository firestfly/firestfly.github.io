(function () {

    'use strict';

    angular.module('rmMobile.directive')
        .directive('overview', overview);

    function overview() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: baseUrl + '/rm-mobile/app/modules/directives/overview.html',
            link: function (scope, element, attrs) {
                scope.styleNumber = false;
                scope.styleText = false;
                scope.green = false;
                scope.red = false;
                scope.orange = false;

                if (attrs.showHead != null) {
                    scope.showHead = (attrs.showHead === 'true');
                    ;
                }
                if (attrs.showStyle == 'styleNumber') {
                    scope.styleNumber = true;
                } else if (attrs.showStyle == 'styleText') {
                    scope.styleText = true;
                }
                if (attrs.headText != null) {
                    scope.headText = attrs.headText;
                }
                if (attrs.number != null) {
                    scope.number = attrs.number;
                }
                if (attrs.unit != null) {
                    scope.unit = attrs.unit;
                }
                if (attrs.fontColor == 'green') {
                    scope.green = true;
                } else if (attrs.fontColor == 'red') {
                    scope.red = true;
                } else if (attrs.fontColor == 'orange') {
                    scope.orange = true;
                }
                if (attrs.mainInfo != null) {
                    scope.mainInfo = attrs.mainInfo;
                }
                if (attrs.subInfo != null) {
                    scope.subInfo = attrs.subInfo;
                }
            }
        };
    }

})();
