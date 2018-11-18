'use strict';

VkrmsApp.directive('authCommonTopBanner', [function () {

    return {
        restrict: 'A',
        scope: {
            personalInfo: "=",
            saveFunction: "&",
            topBannerConfig: "=",
            search: "&"
        },
        templateUrl: baseUrl + '/partials/authority/auth-common-top-banner.html',
        link: function ($scope) {

        }
    };

}]);
