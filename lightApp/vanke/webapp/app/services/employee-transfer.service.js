/**
 * Created by wangq34 on 2017/7/26.
 */
(function(){
    'use strict';

    angular
        .module('vkrmsApp')
        .service('EmployeeTransferService',EmployeeTransferService);

    EmployeeTransferService.$inject = ['CommonService', '$http', '$q'];

    function EmployeeTransferService(CommonService, $http, $q) {
        var service = {
            getWeekBetween: getWeekBetween,
            getWorkSchedules: getWorkSchedules,
            getDefaultDate: getDefaultDate
        }

        return service;

        function getWeekBetween(){
            var today = new Date();
            var beginDate = CommonService.datePlus(today,-7);
            var endDate = CommonService.datePlus(today,7);
            return {
                beginDate: beginDate,
                endDate: endDate
            }
        }

        function getWorkSchedules(){
            return {
                STANDARD_WORKING_HOURS: '标准工时制',
                COMPREHENSIVE_WORKING_HOURS: '综合工时制',
                UNTIME_WORKING_HOURS: '不定时工时制'
            }
        }

        function getDefaultDate() {
            return $http.get(apiBaseUrl + '/lock-cycle-nowdate')
        }
    }
})();