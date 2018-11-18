/**
 * Created by xieft01 on 2016/8/27.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .filter('datetime', ['SuperScheduleService', function (SuperScheduleService) {
            return function (item) {
                var str = SuperScheduleService.timelineOptions();
                return str[item].substr(0, 5);
            }
        }])
        .filter('fragmentType', function () {
            return function (item, label) {
                if (item.indexOf('OVERTIME_FRAGMENT') != -1 && label == null) {
                    return '加班';
                }
                if (label) {
                    return label;
                }
            }
        })
        .filter('holidayTypeFilter', ['SuperScheduleService', function (SuperScheduleService) {
            return function (item) {
                var result = item;
                var str = SuperScheduleService.holidayTypes();
                for (var i = 0; i < str.length; i++) {
                    if (str[i].code == item) {
                        result = str[i].name;
                        break;
                    }
                }
                return result;
            }
        }])
        .filter('dateTransform', function () {
            return function (item) {
                return item.replace(/-/, "月") + "日";
            }
        })
        .filter('cut', function () {
            return function (item) {
                if (item) {
                    return item.substr(0, 5);
                } else {
                    return item
                }
            }
        })

})();