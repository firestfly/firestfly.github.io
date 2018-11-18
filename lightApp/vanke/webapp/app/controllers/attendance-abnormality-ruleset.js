'use strict';

VkrmsApp.controller('AttendanceAbnormalityRulesetController',['$scope', '$http', function ($scope, $http) {
    $scope.title = "万科资源管理信息系统 - 异常出勤判定设置";
    $http.get(apiBaseUrl + "/attendance-abnormality-rules")
        .success(function (response) {
            $scope.rules = response;
        });

    $scope.checkDurationInMinutes = function (data) {
        var reg = new RegExp("^(0|([1-9][0-9]{0,5}))$");
        if (!reg.test(data)) {
            return ("请输入0~999999之间的整数!");
        }
    };

    $scope.saveRule = function (data, id) {
        angular.extend(data, {id: id});
        return $http.put(apiBaseUrl + "/attendance-abnormality-rules/" + id, data).success(function(){
            alert('保存数据成功！');
        });
    };
}]);
