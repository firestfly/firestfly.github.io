/**
 * Created by Administrator on 2016/6/11.
 */
var aMailServices = angular.module('Amail', ["ngRoute"]);
aMailServices.factory("messages", function () {
    return [
        {
            id: 0, sender: 'jean@somecompany.com',
            subject: 'Hi there, old friend',
            date: 'Dec 7, 2013 12:32:00',
            recipients: ['greg@somecompany.com'],
            message: 'Hey, we should get together for lunch somet ime and catch up. There are many things we should collaborate on this year.'
        },
        {
            id: 1, sender: 'maria@somecompany.com',
            subject: 'Where did you leave my laptop?',
            date: 'Dec 7, 2013 8:15:12',
            recipients: ['greg@somecompany.com'],
            message: 'I thought you were going to put it in my desk drawer. But i t does not seem to be there. '
        },
        {
            id: 2, sender: 'bill@somecompany.com',
            subject: 'Lost python',
            date: 'Dec 6, 2013 20:35:02',
            recipients: ['greg@somecompany.com'],
            message: "Nobody panic, but my pet python is missing from her cage.She doesn't move too fast, so just call me if you see her."
        }
    ];
});

function emailRouteConfig($routeProvider, $compileProvider, $controllerProvider) {
    aMailServices.registerCtrl = $controllerProvider.register;
    aMailServices.resolveScriptDeps = function (dependencies) {
        return function ($q, $rootScope) {
            var deferred = $q.defer();
            $script(dependencies, function () {
                $rootScope.$apply(function () {
                    deferred.resolve();
                });
            });
            return deferred.promise;
        }
    };
    $routeProvider.when('/test', {
        controller: 'ListController',
        templateUrl: 'list/index.html',
        publicAccess: true,
        resolve: {
            deps: aMailServices.resolveScriptDeps([
                'list/service.js',
                'list/controller.js',
                'list/directive.js'
            ])
        }
    }).when('/view/:id', {
        controller: 'DetailController',
        templateUrl: 'detail/index.html',
        resolve: {
            deps: aMailServices.resolveScriptDeps([
                'detail/service.js',
                'detail/controller.js',
                'detail/directive.js'
            ])
        }
    }).otherwise({
        redirectTo: '/view1'
    });
}

aMailServices.config(emailRouteConfig);

//Get the message id fron the route (parsed from the URL) and use it to find the right message object.

/*function DetailController($scope, $routeParams) {
 $scope.message = messages[$routeParams.id];
 }
 aMailServices.controller("ListController", ['$scope',"message1", function(scope, messages){
 scope.messages = messages;
 }]);*/