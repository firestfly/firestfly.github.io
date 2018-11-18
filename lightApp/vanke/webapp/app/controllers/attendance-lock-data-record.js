(function(){
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('AttendanceLockDataRecordController',AttendanceLockDataRecordController);

    AttendanceLockDataRecordController.$inject = ['$scope','$http'];

    function AttendanceLockDataRecordController($scope,$http){
        var dr = this;

        dr.search2001 = search2001;
        dr.search2010 = search2010;
        dr.search0015 = search0015;

        init();

        function init(){
            dr.objData = JSON.parse(sessionStorage["searchState_attendance-lock-data-record"]);
            search2001();
            search2010();
            search0015();
            $scope.tabs = [
                { title:'Dynamic Title 1', content:'Dynamic content 1' },
                { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
            ];
        }

        function getParams(){
            return {
                'lockId': dr.objData.attendanceLockId,
                'departmentId': dr.objData.departmentId
            }
        }

        function search2001() {
            $http.get(apiBaseUrl + '/check-lock/2001',{params:getParams()}).then(function(res){
                dr.list2001 = res.data;
                console.log(res)
            },errorHandle)
        }

        function search2010() {
            $http.get(apiBaseUrl + '/check-lock/2010',{params:getParams()}).then(function(res){
                dr.list2010 = res.data;
            },errorHandle)
        }

        function search0015() {
            $http.get(apiBaseUrl + '/check-lock/0015',{params:getParams()}).then(function(res){
                dr.list0015 = res.data;
            },errorHandle)
        }

        function errorHandle(){

        }

    }
})();