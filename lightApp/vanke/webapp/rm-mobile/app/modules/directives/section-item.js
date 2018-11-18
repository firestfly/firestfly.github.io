(function () {

    'use strict';

    angular.module('rmMobile.directive')
        .directive('sectionItem', sectionItem);

    function sectionItem() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: baseUrl + '/rm-mobile/app/modules/directives/section-item.html',
            scope: {},
            link: function (scope, element, attrs) {
                scope.fontColor1 = (attrs.fontColor1 === 'true');
                scope.fontColor2 = (attrs.fontColor2 === 'true');
                scope.secondRow = (attrs.secondRow === 'true');
                if (attrs.mainLeft != null) {
                    scope.mainLeft = attrs.mainLeft;
                }
                if (attrs.mainRight != null) {
                    scope.mainRight = attrs.mainRight;
                }
                if (attrs.infoLeft != null) {
                    scope.infoLeft = attrs.infoLeft;
                }
                if (attrs.infoRight != null) {
                    scope.infoRight = attrs.infoRight;
                }
                if (attrs.infoLeft2 != null) {
                    scope.infoLeft2 = attrs.infoLeft2;
                }
                if (attrs.infoRight2 != null) {
                    scope.infoRight2 = attrs.infoRight2;
                }
            }
        };
    }

})();
