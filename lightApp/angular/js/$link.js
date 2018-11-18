angular.module('compilation', [])
    .directive('tag1', ['$rootScope', function ($rootScope) {
        $rootScope.log = $rootScope.log === undefined ? "" : $rootScope.log;
        var controller = function ($scope, $element, $attrs, $transclude) {
            $rootScope.log = $rootScope.log + "tag1 controller\n";
        };
        var compile = function ($element, $attrs, $link) {
            $rootScope.log = $rootScope.log + "tag1 compile\n";
            return {
                pre: function ($scope, $element, $attrs, controller) {
                    $rootScope.log = $rootScope.log + "tag1 prelink\n";
                },
                post: function ($scope, $element, $attrs, controller) {
                    $rootScope.log = $rootScope.log + "tag1 postlink\n";
                }
            };
        };
        return {
            controller: controller,
            compile: compile,
            restrict: "E",
            require: '?tag1',
            replace: false,
            transclude: true,
            template: '<div ng-transclude=""></div>'
        };
    }])
    .directive('tag2', ['$rootScope', function ($rootScope) {
        $rootScope.log = $rootScope.log === undefined ? "" : $rootScope.log;

        var controller = function ($scope, $element, $attrs, $transclude) {
            $rootScope.log = $rootScope.log + "tag2 controller\n";
        };
        var compile = function ($element, $attrs, $link) {
            $rootScope.log = $rootScope.log + "tag2 compile\n";
            return {
                pre: function ($scope, $element, $attrs, controller) {
                    $rootScope.log = $rootScope.log + "tag2 prelink\n";
                },
                post: function ($scope, $element, $attrs, controller) {
                    $rootScope.log = $rootScope.log + "tag2 postlink\n";
                }
            };
        };

        return {
            controller: controller,
            compile: compile,
            restrict: "E",
            require: '?tag2',
            replace: false,
            transclude: true,
            template: '<div ng-transclude=""></div>'
        };
    }])
    .directive('tag3', ['$rootScope', function ($rootScope) {
        $rootScope.log = $rootScope.log === undefined ? "" : $rootScope.log;

        var controller = function ($scope, $element, $attrs, $transclude) {
            $rootScope.log = $rootScope.log + "tag3 controller\n";
        };

        var compile = function ($element, $attrs, $link) {
            $rootScope.log = $rootScope.log + "tag3 compile\n";
            return {
                pre: function ($scope, $element, $attrs, controller) {
                    $rootScope.log = $rootScope.log + "tag3 prelink\n";
                },
                post: function ($scope, $element, $attrs, controller) {
                    $rootScope.log = $rootScope.log + "tag3 postlink\n";
                }
            };
        };
        return {
            controller: controller,
            compile: compile,
            restrict: "E",
            require: '?tag3',
            replace: false,
            transclude: true,
            template: '<div ng-transclude=""></div>'
        };
    }]);