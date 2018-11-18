/**
 * Created by deepsky on 2017/1/3.
 */
(function () {

    'use strict';

    angular.module('rmMobile.Leave', [])
        .controller('LeaveHomeCtrl', LeaveHomeCtrl);

    LeaveHomeCtrl.$inject = ['$rootScope', 'CommonService'];

    function LeaveHomeCtrl($rootScope, commonService) {
        var lh = this;
        console.log('leave')
    }
})();