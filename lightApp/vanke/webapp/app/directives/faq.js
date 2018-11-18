'use strict';

VkrmsApp.directive('faq', [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/faq-index.html'
    }
}]);
