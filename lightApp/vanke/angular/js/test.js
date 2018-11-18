/**
 * Created by Administrator on 13-11-5.
 */
angular.module('customControl', []).directive('contenteditable', function () {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function () {
                scope.$apply(read);
            });
            read(); // initialize

            // Write data to the model
            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html == '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
});
var myModule = angular.module(...
    )
;
myModule.directive('directiveName', function factory(injectables) {
    var directiveDefinitionObject = {
        priority: 0,
        template: '<div></div>',
        templateUrl: 'directive.html',
        replace: false,
        transclude: false,
        restrict: 'A',
        scope: false,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) { ...
                },
                post: function postLink(scope, iElement, iAttrs, controller) { ...
                }
            }
        },
        link: function postLink(scope, iElement, iAttrs) { ...
        }
    };
    return directiveDefinitionObject;
});
