/**
 * Created by Administrator on 2014/6/25.
 */
var app = angular.module('plunker', [
    'ngRoute',
    'ngAnimate'
]);

app.run(function ($rootScope, $window) {
    // publish current transition direction on rootScope
    $rootScope.direction = 'ltr';
    // listen change start events
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        $rootScope.direction = 'rtl';
        // console.log(arguments);
        if (current && next && (current.depth > next.depth)) {
            $rootScope.direction = 'ltr';
        }
        // back
        $rootScope.back = function () {
            $window.history.back();
        }
    });
});

app.controller('MainCtrl', function ($scope) {

});

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home.html',
        depth: 1
    }).when('/products', {
        templateUrl: 'products.html',
        depth: 2
    }).when('/products/category', {
        templateUrl: 'category.html',
        depth: 3
    })
});