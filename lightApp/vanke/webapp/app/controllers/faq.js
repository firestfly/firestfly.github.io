'use strict';

VkrmsApp
    .factory('getFaqData', ['$http', function ($http) {
        return $http.get('jsons/faqData.json');
    }])
    .controller('FaqController', ['$scope', '$rootScope', 'getFaqData', function ($scope, $rootScope, getFaqData) {
        getFaqData.success(function (data) {
            $scope.categories = data;
        });
    }])
    .controller('FaqCategoryController', ['$scope', '$rootScope', '$routeParams', 'getFaqData', function ($scope, $rootScope, $routeParams, getFaqData) {
        $scope.cateId = $routeParams.cateId;
        $scope.cateIndex = $scope.cateId.slice(3) - 1;
        getFaqData.success(function (data) {
            $scope.data = data;
        }).then(function () {
            var thisCate = $scope.data[$scope.cateIndex];
            $scope.cateTitle = thisCate.name;
            $scope.questions = thisCate.questions;
            $rootScope.pageTitle = '常见问题#/faq-' + $scope.cateTitle;
        });
    }])
    .controller('FaqDetailController', ['$scope', '$rootScope', '$routeParams', 'getFaqData', function ($scope, $rootScope, $routeParams, getFaqData) {
        $scope.cateId = $routeParams.cateId;
        $scope.cateIndex = $scope.cateId.slice(3) - 1;
        $scope.faqIndex = $routeParams.faqId - 1;
        getFaqData.success(function (data) {
            $scope.data = data;
            //console.log($scope.data);
        }).then(function () {
            var thisCate = $scope.data[$scope.cateIndex],
                thisQuestion = thisCate.questions[$scope.faqIndex];
            $scope.cateTitle = thisCate.name;
            $scope.faqTitle = thisQuestion.title;
            $scope.question = thisQuestion.q;
            $scope.answer = thisQuestion.a;
            $scope.qImages = thisQuestion.qImages;
            $scope.aImages = thisQuestion.aImages;
            $rootScope.pageTitle = '常见问题#/faq-' + $scope.cateTitle + '#/faq/' + $scope.cateId + '-' + $scope.faqTitle;
            typeof $scope.answer === 'string' ? $scope.answerRepeat = false : $scope.answerRepeat = true;
        });
    }]);