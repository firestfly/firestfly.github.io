'use strict';

VkrmsApp.controller('SignInAreaListController', ['$scope', '$http', 'DataTableService', 'CommonService', function ($scope, $http, dataTableFactory, commonService) {
    $scope.title = "万科资源管理信息系统 - 签到范围设置";
    $scope.selectedCompanies = [];
    $scope.selectedDepartments = [];

    /*
     window.dataTable = $('#' + 'area-table');

     window.dataTable.DataTable({
     "data": [{
     "departmentId": "00001",
     "companyName": "Company A",
     "departmentName": "Department A",
     "areaStatus": 0
     },
     {
     "departmentId": "00002",
     "companyName": "Company B",
     "departmentName": "Department B",
     "areaStatus": 1
     },
     {
     "departmentId": "00003",
     "companyName": "Company C",
     "departmentName": "Department C",
     "areaStatus": 0
     }
     ],
     "columnDefs": [
     {
     "targets": 0,
     "data": "companyName"
     },
     {
     "targets": 1,
     "data": "departmentName"
     },
     {
     "targets": 2,
     "data": "areaStatus",
     "render": function (data, type, row) {
     if (data == 0) {
     return "未设置";
     } else {
     return "已设置";
     }
     }
     },
     {
     "targets": 3,
     "data": null,
     "defaultContent": '<a href="#">设置签到范围</a>'
     }
     ]
     });

     window.dataTable.on('draw.dt', function () {
     //bindLink();
     });
     */

    $scope.$on('$viewContentLoaded', function () {
        var config = {
            "ajax": {
                "url": "department-area-collect",
                "type": "POST",
                "headers": utils.generateHeaders()
            },
            "columnDefs": [
                {
                    "targets": 0,
                    "visible": false
                },
                {
                    "targets": 3,
                    "render": function (data, type, row) {
                        if (data == "0") {
                            return "未设置";
                        } else {
                            return "已设置";
                        }
                    }
                },
                {
                    "targets": 4,
                    "data": null,
                    "defaultContent": '<a href="#" type="view">设置签到区域</a>'
                }
            ]
        };
        dataTableFactory.initDataTable("area-table", config);
        window.dataTable.on('draw.dt', function () {
            bindLink();
        });
    });


    $scope.search = function () {
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id')
        };
        dataTableFactory.dataTableSearch("area-table", data);
        commonService.storageSearchStatus($scope, {
            selcompanies: $scope.selectedCompanies,
            seldepartments: $scope.selectedDepartments,
            departments: $scope.departments
        })
    };

    function bindLink() {
        var areaTable = $('#area-table');
        areaTable.find('a').each(function (index, value) {
            var hash = "#/sign-in-area/",
                search = window.dataTable.row($(this).parents('tr')).data()[0];
            $(this).attr('href', hash + search);
        });
    }

}]);
