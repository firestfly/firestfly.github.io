(function () {

    'use strict';

    angular.module('rmMobile.point')
        .controller('PointCtrl', PointCtrl);

    PointCtrl.$inject = ['$rootScope', 'CommonService'];

    function PointCtrl($rootScope, commonService) {
        var point = this,
            taskList = commonService.getTaskList('point');
        commonService.getAuthority().then(function (result) {
            point.employeeInfo = result;
        });
        init();

        fillData();

        function init() {
            point.noPoint = false;
            commonService.setCalendarTarget("point");
            $rootScope.$broadcast('refreshNav', {
                title: '维修财富值',
                showBack: true,
                showClose: false,
                showCalendar: true
            });
        }

        function fillData() {
            var fromDate = new Date(taskList.beginDate),
                toDate = new Date(taskList.endDate),
                tasks = taskList.tasks;

            point.headText = toDate.getFullYear() + '年' + (toDate.getMonth() + 1) + '月财富值（' +
                (fromDate.getMonth() + 1) + '.' + fromDate.getDate() + '-' + (toDate.getMonth() + 1) + '.' + toDate.getDate() + '）';
            point.number = taskList.totalPoints;
            if (point.number == 0) point.noPoint = true;
            point.unit = "分";
            for (var i in tasks) {
                if (isNaN(tasks[i].totalPoint)) {
                    break;
                }
                tasks[i].evalDate = tasks[i].evalDate.substr(0, 10);
                tasks[i].totalPoint = tasks[i].totalPoint ? '＋' + parseFloat(tasks[i].totalPoint).toFixed(2) + '分' : '＋0分';
            }
            point.pointList = tasks;
        }

    }

})();
