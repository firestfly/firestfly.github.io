(function () {

    'use strict';

    angular.module('rmMobile.directive')
        .directive('tableItemCollapse', tableItemCollapse);

    function tableItemCollapse() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: baseUrl + '/rm-mobile/app/modules/directives/table-item-collapse.html',
            scope: {},
            link: function (scope, element, attrs) {
                if (attrs.mainLeft != null) {
                    scope.mainLeft = attrs.mainLeft;
                }
                if (attrs.mainRight != null) {
                    scope.mainRight = attrs.mainRight;
                }
                if (attrs.collapseUpLeft != null) {
                    scope.collapseUpLeft = attrs.collapseUpLeft;
                }
                if (attrs.collapseUpRight != null) {
                    scope.collapseUpRight = attrs.collapseUpRight;
                }
                if (attrs.collapseDownLeft != null) {
                    scope.collapseDownLeft = attrs.collapseDownLeft;
                }
                if (attrs.collapseDownRight != null) {
                    scope.collapseDownRight = attrs.collapseDownRight;
                }


                scope.isCollapsed = true;
                scope.chevronUp = false;
                scope.chevronDown = true;

                scope.toogle = toogle;

                function toogle() {
                    scope.isCollapsed = !scope.isCollapsed;
                    scope.chevronUp = !scope.chevronUp;
                    scope.chevronDown = !scope.chevronDown;
                }

            }
        };
    }

})();
