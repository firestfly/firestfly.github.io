/**
 * Created by wangq34 on 2016/11/21.
 */
(function() {
  'use strict';

  angular
    .module('vkrmsApp')
    .controller('LieuQuotaController', LieuQuotaController);

    LieuQuotaController.$inject = ['$scope', '$rootScope', 'LieuQuotaService', 'CommonService', '$location', '$routeParams'];

    function LieuQuotaController($scope, $rootScope, LieuQuotaService, CommonService, $location, $routeParams) {
    var lqc = this;
    $scope.isCheck = $routeParams.check == '1' ? true : false;
    $scope.search = search;
    lqc.open = open;
    lqc.openPreLiquidate = openPreLiquidate;
    $scope.quotaLockStatus = 1;

    function search() {
      LieuQuotaService
        .getLieuQuotaList(getParams())
        .then(function(response) {
          lqc.lieuQuotaList = response.data;
          $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
        });
      CommonService.storageSearchStatus($scope);
    }

    function getParams() {
      return {
        "search[value]": {
          departments: _.pluck($scope.selectedDepartments, 'department_id'),
          "keywords": $scope.keywords,
          'lockStatus': $scope.quotaLockStatus,
          'lockCycleId': $scope.selectedOnlyLockCycle.map(function(a) {
            return a.lockCycleId
          }),
          'holidayTypeId': $scope.selectedLeaveType
        },
        length: $scope.page,
        start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
      }
    }

    function open(lieuQuota, type, obj, str) {
      lieuQuota.type = type;

        if (str && (lieuQuota.prevBalanceSum == '-' || lieuQuota.expireBalance == '-')) {
          return false
        }
        if ($scope.isCheck) {
            sessionStorage["searchState_#/lieu-detail?check=1"] = JSON.stringify(lieuQuota);
            $location.path("/lieu-detail").search({check: '1'});
        } else {
            sessionStorage["searchState_#/lieu-detail"] = JSON.stringify(lieuQuota);
            $location.path("/lieu-detail").search({id: obj.id,leaveType: obj.holidayTypeName });
        }
    }

    function openPreLiquidate(lieuQuota) {
      LieuQuotaService
        .getDetail({
          id: lieuQuota.id
        })
        .then(function(response) {
          CommonService.createModal({
              'templateUrl': 'lieuQuotaPreLiquidateModal.html',
              'controller': 'lieuQuotaPreLiquidateModalController',
              'size': 'lg',
              'resolve': {
                'lieuQuota': function() {
                  return lieuQuota;
                },
                'response': function() {
                  return response;
                }
              }
            })
            .result
            .then(function() {
              search();
            });

        });
    }

  }
})();

(function() {
  'use strict';

  angular
    .module('vkrmsApp')
    .controller('lieuQuotaPreLiquidateModalController', lieuQuotaPreLiquidateModalController);

  lieuQuotaPreLiquidateModalController.$inject = ['$scope', 'CommonService', '$modalInstance', 'lieuQuota', 'response', 'LieuQuotaService'];

  function lieuQuotaPreLiquidateModalController($scope, CommonService, $modalInstance, lieuQuota, response, LieuQuotaService) {
    $scope.cancel = cancel;
    $scope.lieuQuota = lieuQuota;
    $scope.detailList = response;
    $scope.ok = ok;

    function ok() {
      CommonService.confirm({
        "content": "到" + response[response.length - 1].lockCycleName + "本定案周期结束时，" + lieuQuota.employeeName + "的结余调休额度将全部以加班费方式清算。",
        "callback": function() {
          LieuQuotaService
            .preLiquidate({
              employeeId: lieuQuota.employeeId
            })
            .then(function(response) {
              if (response.status == 'fail') {
                CommonService.alert({
                  icon: 'fa-exclamation-circle',
                  content: response.errorMessage
                });
                return null;
              } else {
                $modalInstance.close();
              }
            }, function() {
              CommonService.alert({
                icon: 'fa-exclamation-circle',
                content: "网络超时，清算失败!"
              });
              return null;
            })
        }
      });


    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

  }
})();