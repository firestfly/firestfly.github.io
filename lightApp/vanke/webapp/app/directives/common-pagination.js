(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .directive('commonPagination', commonPagination);

    commonPagination.$inject = ['$timeout', 'CommonService'];

    function commonPagination($timeout, CommonService) {
        return {
            templateUrl: baseUrl + '/partials/common/common-pagination.html',
            restrict: 'A',
            replace: 'true',
            link: link
        };

        function link(scope) {

            scope.$on("selectpicker-loaded", paginationInit);

            scope.paginationInit = paginationInit;
            scope.gotoPreviousPage = gotoPreviousPage;
            scope.gotoNextPage = gotoNextPage;

            function paginationInit() {
                var cacheObj = sessionStorage["searchState_" + location.hash];
                try {
                    if (cacheObj) {
                        cacheObj = JSON.parse(cacheObj);
                    }
                } catch (e) {
                    console.error(e);
                }

                var defaultConfig = {
                    pageOptions: [10, 30, 50, 100],
                    currentPage: (!CommonService.isEmpty(cacheObj) && !CommonService.isEmpty(cacheObj.currentPage)) ? cacheObj.currentPage : 1,
                    isShowOptions: false,
                    autoSearch: true,
                    page: 10,
                };

                scope.config = angular.extend(defaultConfig, scope.paginationConfig);
                scope.currentPage = scope.config.currentPage;
                scope.page = scope.config.pageOptions[0] || 10;
                scope.totalPage = scope.config.totalPage;
                scope.isShowOptions = scope.config.isShowOptions;
                $timeout(function () {
                    $('.selectJob').selectpicker();
                }, 0);

                if (scope.config.autoSearch) {
                    scope.search();
                }

                scope.$watch('page', function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        scope.search();
                    }
                });

                scope.$watch('currentPage', function (newValue, oldValue) {
                    if (newValue && newValue != oldValue) {
                        scope.search();
                    }
                });

                scope.$watch('totalPage', function () {
                    if (!scope.totalPage) return;
                    if (scope.totalPage < scope.currentPage) {
                        scope.currentPage = scope.totalPage || 1;
                    }
                });
            }

            function gotoPreviousPage() {
                scope.currentPage--;
            }

            function gotoNextPage() {
                scope.currentPage++;
            }
        }
    }

})();