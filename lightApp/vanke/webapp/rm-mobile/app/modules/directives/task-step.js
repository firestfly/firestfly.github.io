/**
 * Created by deepsky on 2016/10/17.
 */
(function () {

    'use strict';

    angular.module('rmMobile.directive', ['rmMobile.common'])
        .directive('taskStep', taskStep);

    function taskStep() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: baseUrl + '/rm-mobile/app/modules/directives/task-step.html',
            scope: {},
            link: function (scope, element, attrs) {
                scope.wealthValue = attrs.wealthValue;
                scope.wealthStep = attrs.exchangeRule;
                scope.verticalShow = attrs.verticalShow;
                scope.horizontalShow = attrs.horizontalShow;
                scope.horizontalStepWidth = 0;
                scope.colorArray = ['#128B39', '#F3D726', '#E9A161', '#DA6467']
                scope.wealthStep = [
                    {
                        ruleName: '基础财富值',
                        start: 0,
                        end: 1800
                    },
                    {
                        ruleName: '1.05倍加速',
                        start: 1800,
                        end: 2800
                    },
                    {
                        ruleName: '1.2倍加速',
                        start: 2800,
                        end: 4000
                    },
                    {
                        ruleName: '1.5倍加速',
                        start: 4000,
                        end: 10000
                    }
                ]

                angular.forEach(scope.wealthStep, function (obj, key) {
                    obj.isActive = false;
                    obj.showWealthValue = false;
                    obj.stepWidth = {
                        'width': '100%'
                    };
                    if (scope.wealthValue > obj.start) {
                        obj.isActive = true;
                        if (scope.wealthValue <= obj.end) {
                            var a = obj.end - obj.start;
                            var b = scope.wealthValue - obj.start
                            obj.showWealthValue = true;
                            obj.stepWidth = {
                                'width': Math.round(b / a * 10000) / 100.00 + "%"
                            };
                            scope.horizontalStepWidth = {
                                'width': counts(b / a, key),
                                'color': scope.colorArray[key]
                            }
                        }
                    }
                })

                function counts(item, key) {
                    var before = 0.25 * key;
                    var after = item / 4;
                    return Math.round((before + after) * 10000) / 100.00 + "%"
                }
            }
        }
    }
})();