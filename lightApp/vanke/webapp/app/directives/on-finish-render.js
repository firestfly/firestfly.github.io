/**
 * Created by wangq34 on 2016/12/7.
 */
(function () {
    angular
        .module('vkrmsApp')
        .directive('onFinishRender', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$emit(attr.broadcasteventname ? attr.broadcasteventname : 'ngRepeatFinished');
                        });
                    }
                }
            }
        }]);
})();