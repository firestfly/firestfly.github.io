/**
 * Created by deepsky on 2016/10/19.
 */
(function () {

    'use strict';

    angular.module('rmMobile.directive')
        .directive('pickerYear', pickerYear);

    function pickerYear() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: baseUrl + '/rm-mobile/app/modules/directives/picker-year.html',
            scope: {},
            link: function (scope, element, attrs) {
                scope.onTouchstart = onTouchstart;
                scope.onTouchmove = onTouchmove;
                scope.onTouchend = onTouchend;
                scope.yearCancel = yearCancel;
                scope.yearOk = yearOk;
                scope.DivHeight = 35;
                scope.modelYearBox = false;
                scope.touchTimeType = null;
                scope.currentHeight = 0;
                var now = new Date();
                var fullYear = now.getFullYear();
                var month = now.getMonth() + 1;
                scope.initScroll = {
                    year: 0,
                    month: 0
                }
                scope.transclateScroll = {
                    year: null,
                    month: null
                }

                scope.touchEnd = false;

                scope.transclateScroll.year = {
                    'transform': 'translate3d(0px, ' + scope.currentHeight + 'px, 0px)',
                    '-webkit-transform': 'translate3d(0px, ' + scope.currentHeight + 'px, 0px)'
                }
                scope.transclateScroll.month = {
                    'transform': 'translate3d(0px, ' + scope.currentHeight + 'px, 0px)',
                    '-webkit-transform': 'translate3d(0px, ' + scope.currentHeight + 'px, 0px)'
                }
                scope.range = {
                    start: 0,
                    end: 0
                }
                scope.initDate = {
                    years: [],
                    months: []
                }
                for (var i = 0; i < 3; i++) {
                    scope.initDate.years.push({
                        id: fullYear,
                        name: fullYear + '年'
                    })
                    fullYear--;
                }

                for (var i = 1; i < 13; i++) {
                    scope.initDate.months.push({
                        name: i + '月',
                        id: i,
                    })

                }
                scope.initHeight = {
                    year: (scope.initDate.years.length - 1) * scope.DivHeight,
                    month: (scope.initDate.months.length - 1) * scope.DivHeight
                }
                scope.currentMonthIndex = 0;
                scope.currentMonth = scope.initDate.months[scope.currentMonthIndex].id;
                scope.currentYearIndex = 0;
                scope.currentYear = scope.initDate.years[scope.currentYearIndex].id;

                scope.$on('opModelYear', function (event) {
                    scope.modelYearBox = true;
                });
                function onTouchstart(event, type) {
                    scope.touchTimeType = type;
                    var touch = event.touches[0];
                    scope.range.start = touch.pageY;
                }

                function onTouchmove(event) {

                    var touch = event.touches[0];
                    scope.range.end = touch.pageY - scope.range.start;
                    if (scope.touchTimeType == 'year') {
                        scope.currentHeight = scope.initScroll.year;
                    } else {
                        scope.currentHeight = scope.initScroll.month;
                    }
                    var a = scope.currentHeight + scope.range.end;
                    if (!isContinue(a, scope.touchTimeType)) {
                        return false;
                    }

                    if (scope.touchTimeType == 'year') {
                        scope.aaaY = a;
                        scope.transclateScroll.year = {
                            'transform': 'translate3d(0px, ' + scope.aaaY + 'px, 0px)',
                            '-webkit-transform': 'translate3d(0px, ' + scope.aaaY + 'px, 0px)'
                        }
                    } else {
                        scope.aaaM = a;
                        scope.transclateScroll.month = {
                            'transform': 'translate3d(0px, ' + scope.aaaM + 'px, 0px)',
                            '-webkit-transform': 'translate3d(0px, ' + scope.aaaM + 'px, 0px)'
                        }
                    }

                }

                function onTouchend(event) {
                    scope.touchEnd = true;
                }

                scope.$watch('touchEnd', function (event) {
                    if (scope.touchEnd) { //
                        corrected(scope.touchTimeType);
                        scope.touchEnd = false;
                    }

                })

                function corrected() {


                    if (scope.touchTimeType == 'year') {
                        scope.currentHeight = scope.aaaY || 0;
                    } else {
                        scope.currentHeight = scope.aaaM || 0;
                    }
                    var result = scope.currentHeight % scope.DivHeight;
                    if (-(result) > 18) {
                        var cacheH = -(scope.DivHeight) + -(result);
                        scope.currentHeight = scope.currentHeight + cacheH;
                    } else {
                        scope.currentHeight = scope.currentHeight - result

                    }
                    if (scope.touchTimeType == 'year') {
                        scope.transclateScroll.year = {
                            'transform': 'translate3d(0px, ' + scope.currentHeight + 'px, 0px)',
                            '-webkit-transform': 'translate3d(0px, ' + scope.currentHeight + 'px, 0px)'
                        }
                        scope.currentYearIndex = -(scope.currentHeight) / scope.DivHeight;
                        if (!scope.initDate.years[scope.currentYearIndex]) {
                            scope.currentYear = scope.initDate.years[0].id;
                        } else {
                            scope.currentYear = scope.initDate.years[scope.currentYearIndex].id;
                        }

                        scope.initScroll.year = scope.currentHeight;
                    } else {
                        scope.transclateScroll.month = {
                            'transform': 'translate3d(0px, ' + scope.currentHeight + 'px, 0px)',
                            '-webkit-transform': 'translate3d(0px, ' + scope.currentHeight + 'px, 0px)'
                        }
                        scope.currentMonthIndex = -(scope.currentHeight) / scope.DivHeight;
                        scope.currentMonth = scope.initDate.months[scope.currentMonthIndex].id;
                        scope.initScroll.month = scope.currentHeight;
                    }
                    scope.range = {
                        start: 0,
                        end: 0
                    }
                }

                function yearCancel() {
                    scope.modelYearBox = false;
                }

                function yearOk() {
                    var msg = scope.currentYear + '/' + scope.currentMonth + '/01';
                    scope.$emit('getYear', new Date(msg));
                    scope.modelYearBox = false;
                }

                function isContinue(height, type) {

                    if (height > 0) {
                        return false;
                    } else {
                        if (type == 'month') {
                            if (height < -(scope.initHeight.month)) {
                                return false;
                            } else {
                                return true;
                            }
                        } else if (type == 'year') {
                            if (height < -(scope.initHeight.year)) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }


                }
            }
        }
    }

})();