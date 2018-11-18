(function () {

    'use strict';

    angular.module('rmMobile.directive')
        .directive('tableItemDetail', tableItemDetail);

    function tableItemDetail() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: baseUrl + '/rm-mobile/app/modules/directives/table-item-detail.html',
            scope: {},
            link: function (scope, element, attrs) {
                if (attrs.leftUp != null) {
                    scope.leftUp = attrs.leftUp;
                }
                if (attrs.leftDown != null) {
                    scope.leftDown = attrs.leftDown;
                }
                if (attrs.middleLeft != null) {
                    scope.middleLeft = attrs.middleLeft;
                }
                if (attrs.middleRight != null) {
                    scope.middleRight = attrs.middleRight;
                }
                if (attrs.rightt != null) {
                    scope.rightt = attrs.rightt;
                }
            }
        };
    }

})();
