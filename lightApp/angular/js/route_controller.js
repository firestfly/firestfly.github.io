/**
 * Created by Administrator on 13-11-6.
 */
//Create a module for our core AMail services
var aMailServices = angular.module('Amail', ["ngRoute"]);
//Set up our mappings between URLs, tempaltes. and controllers
aMailServices.factory("srvLibrary", function () {
    return {
        getBooks: function () {
            return "books";
        }
    }
})

function emailRouteConfig($routeProvider, $locationProvider) {
    $routeProvider.when('/view1', {
        controller: 'ListController',
        templateUrl: '../temp/routeProvider_list.html',
        resolve: {
            books: function (srvLibrary) {
                return srvLibrary.getBooks();
            },
            // $q
            accommodation: function ($q, $timeout) {
                var myFriend = $q.defer();
                $timeout(function () {
                    myFriend.resolve({
                        hotelName: function () {
                            return "My Friend's friend's hotel";
                        },
                        roomNo: function () {
                            return "404";
                        }
                    });
                }, 50);
                return myFriend.promise;
            }
        }
    }).// Notice that for the detail view, we specify a parameterized URL component by placing a colon in front of the id
    when('/view/:id', {
        controller: 'DetailController',
        templateUrl: '../temp/routeProvider_detail.html'
    }).otherwise({
        redirectTo: '/view1'
    });
    if (window.history && window.history.pushState) {
        //$locationProvider.html5Mode(true);
    }
}

//Set up our route so the AMailservice can find it
aMailServices.config(emailRouteConfig);


/*aMailServices.config(["$routeProvider", function ($routeProvider) {
 $routeProvider
 .when('/', {
 templateUrl: '../temp/routeProvider_list.html',
 controller: 'ListController'
 })
 .when('/view/:id', {
 templateUrl: '../temp/routeProvider_detail.html',
 controller: 'DetailController'
 })
 .otherwise({ redirectTo: '/' });
 }]);*/

//Some take emails
messages = [
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
// Publish our messages for the list template
/*function ListController($scope) {
    $scope.messages = messages;
    console.log("ok");
}*/
//ListController=['$scope',function(s){s.messages=messages;}];
/*function ListController(scope, books, movies) {
    scope.messages = messages;
    scope.books = books();
    scope.movies = movie();
}
ListController.$inject=['$scope', 'books', 'movies'];*/
aMailServices.controller("ListController", ['$scope', 'books', 'accommodation', function (scope, books, accommodation) {
    scope.messages = messages;
    scope.books = books;
    scope.hotel = accommodation.hotelName();
    scope.roomno = accommodation.roomNo();
}]);

//Get the message id fron the route (parsed from the URL) and use it to find the right message object.

function DetailController($scope, $routeParams) {
    $scope.message = messages[$routeParams.id];
}
