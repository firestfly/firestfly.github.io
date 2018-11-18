(function () {

    'use strict';

    angular.module('rmMobile.directive')
        .directive('tableItem', tableItem);

    function tableItem() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: baseUrl + '/rm-mobile/app/modules/directives/table-item.html',
            scope: {},
            link: function (scope, element, attrs) {
                scope.disableLink = false;
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
                scope.showInfoLeft = (attrs.showInfoLeft === 'true');
                scope.showInfoRight = (attrs.showInfoRight === 'true');
                scope.showChevron = (attrs.showChevron === 'true');

                scope.largeStyle = false;
                scope.mediumStyle = false;
                scope.smallStyle = false;
                var itemStyle = attrs.itemStyle;
                if (itemStyle == 'large') {
                    scope.largeStyle = true;
                } else if (itemStyle == 'medium') {
                    scope.mediumStyle = true;
                } else if (itemStyle == 'small') {
                    scope.smallStyle = true;
                }


                scope.linkage = attrs.linkage;
                if (scope.linkage == 'javascript:void(0)') {
                    scope.disableLink = true;
                }
            }
        };
    }

})();
