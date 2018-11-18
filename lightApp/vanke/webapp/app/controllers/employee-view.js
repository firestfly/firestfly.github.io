'use strict';

VkrmsApp.controller('EmployeeViewController', ['$scope', '$routeParams', 'EmployeeService', 'CommonService', function ($scope, $routeParams, EmployeeService, commonService) {

    $scope.data = {
        approvalStatuses: EmployeeService.getApprovalStatuses(),
        identityTypes: EmployeeService.getIdentityTypes(),
        jobStatuses: EmployeeService.getJobStatuses(),
        contractTypes: EmployeeService.getContractTypes(),
        primaryWorkGroups: EmployeeService.getPrimaryWorkGroups(),
        jobRanks: EmployeeService.getJobRanks(),
        maritalStatuses: EmployeeService.getMaritalStatuses(),
        politicalIdentities: EmployeeService.getPoliticalIdentities(),
        domicileTypes: EmployeeService.getDomicileTypes(),
        highestDegrees: EmployeeService.getEducationDegrees(),
        nationalities: EmployeeService.getNationalities(),
        educationDegrees: EmployeeService.getEducationDegrees(),
        relationships: EmployeeService.getRelationships(),
        personnelSubareas: EmployeeService.getPersonnelSubareas()
    };

    $scope.employee = {};
    $scope.data.showAdjustInformationsTip = true;
    $scope.isOnlySeeEmployees = $routeParams.isOnlySeeEmployees;
    EmployeeService.loadEmployee($routeParams.id).then(function (data) {
        $scope.employee = data;
        $scope.employee.fullName = (data.lastName || "") + (data.firstName || "");
        $scope.employee.approvalStatus = $scope.data.approvalStatuses[data.approvalStatus];
        $scope.employee.idType = $scope.data.identityTypes[data.idType];
        $scope.employee.jobStatus = $scope.data.jobStatuses[data.jobStatus];
        $scope.employee.contractTypeId = $scope.data.contractTypes[data.contractTypeId];
        $scope.employee.primaryWorkGroup = $scope.data.primaryWorkGroups[data.primaryWorkGroup];
        $scope.employee.jobRank = $scope.data.jobRanks[data.jobRank];
        $scope.employee.maritalStatus = $scope.data.maritalStatuses[data.maritalStatus];
        $scope.employee.politicalIdentity = $scope.data.politicalIdentities[data.politicalIdentity];
        $scope.employee.domicileType = $scope.data.domicileTypes[data.domicileType];
        $scope.employee.nationality = $scope.data.nationalities[data.nationality];
        $scope.employee.highestDegree = $scope.data.highestDegrees[data.highestDegree];
        $scope.employee.personnelSubarea = $scope.data.personnelSubareas[data.personnelSubarea];

        $scope.employee.contractStartDate = transferToDate($scope.employee.contractStartDate || "");
        $scope.employee.contractEndDate = transferToDate($scope.employee.contractEndDate || "");
        $scope.employee.entryDate = transferToDate($scope.employee.entryDate || "");
        $scope.employee.leaveDate = transferToDate($scope.employee.leaveDate || "");
        $scope.employee.entryOrgDate = transferToDate($scope.employee.entryOrgDate || "");
        $scope.employee.leaveOrgDate = transferToDate($scope.employee.leaveOrgDate || "");
        $scope.employee.workHoursEffectDate = transferToDate($scope.employee.workHoursEffectDate || "");
        $scope.employee.salaryType = tranforSalaryType(data.salaryType, data.oSalaryType);
        $scope.employee.gender = data.gender == 0 ? "男" : "女";
        $scope.employee.activeName = data.active ? "启用" : "禁用";
        $scope.employee.sapDomicile = data.sapDomicile ? data.sapDomicile : "- -";
        $scope.employee.probation = data.probation ? data.probation : "- -";
        $scope.employee.workDepartmentNames = $scope.employee.workDepartments != [] ? EmployeeService.mergeValues($scope.employee.workDepartments, "department_name").join(" / ") : "";
        $scope.employee.workJobNames = $scope.employee.workJobs != [] ? EmployeeService.mergeValues($scope.employee.workJobs, "workJobName").join(" / ") : "";
        $scope.employee.skillNames = $scope.employee.skillNames != [] ? EmployeeService.mergeValues($scope.employee.skills, "skillName").join(" / ") : "";

        angular.forEach($scope.employee.familyInformations, function (item, $index) {
            $scope.employee.familyInformations[$index].relationship = $scope.data.relationships[data.familyInformations[$index].relationship];
            $scope.employee.familyInformations[$index].isEmergencyContactName = $scope.employee.familyInformations[$index].isEmergencyContact ? "是" : "否";
        });
        angular.forEach($scope.employee.educationExperiences, function (item, $index) {
            $scope.employee.educationExperiences[$index].educationStartTime = transferToDate($scope.employee.educationExperiences[$index].educationStartTime);
            $scope.employee.educationExperiences[$index].educationEndTime = transferToDate($scope.employee.educationExperiences[$index].educationEndTime);
            $scope.employee.educationExperiences[$index].educationDegree = $scope.data.educationDegrees[data.educationExperiences[$index].educationDegree];//EmployeeService.findObjText($scope.data.educationDegrees, data.educationExperiences[$index].educationDegree);
        });

        commonService.getCityData().then(function (results) {
            $scope.data.cityData = results;
            $scope.employee.domicile.province = EmployeeService.findObjText($scope.data.cityData, data.domicile.province);
            angular.forEach($scope.data.cityData, function (item, $index) {
                if ($scope.data.cityData[$index].text == data.domicile.province) {
                    $scope.employee.domicile.city = EmployeeService.findObjText($scope.data.cityData[$index].cities, data.domicile.city);
                    var provinceTmp = $scope.data.cityData[$index];
                    angular.forEach($scope.data.cityData, function (item, $index) {
                        if (provinceTmp.cities[$index] && provinceTmp.cities[$index].text == data.domicile.city) {
                            $scope.employee.domicile.county = EmployeeService.findObjText(provinceTmp.cities[$index].counties, data.domicile.county);
                        }
                    })
                }
            });
        });

        //getJobLevels();

    });

    function tranforSalaryType (salaryType, oSalaryType) {
        if (salaryType == '04') {
            return '非O序列'
        }
        if (salaryType == '05' && oSalaryType) {
            return oSalaryType + '序列'
        }
    }

    function getJobLevels() {
        var jobId = $scope.employee.jobId;
        commonService.getJobLevels(jobId).then(function (data) {
            $scope.data.jobLevels = data;
            $scope.data.jobLevel = employeeService.findItems($scope.data.jobLevels, "levelId", $scope.employee.jobLevels);
        });
    }

    //切换工作项目
    switchWorkDepartments();
    function switchWorkDepartments() {
        $(".nav").delegate("li", "click", function () {
            var index = $(this).index();
            $(".tab-content .vk-spaced-row:first-of-type").removeClass("hide").children(".tab-workDepartment").eq(index).removeClass("hide").siblings().not("a").addClass("hide");
            $(".tab-content .vk-spaced-row:nth-of-type(2)").addClass("hide");
        })
    }

    function transferToDate(entryDate) {
        return EmployeeService.transferToDate(entryDate);
    }

    $scope.getExperienceLevelLogs = function () {
        var employeeId = $scope.employee.id;
        commonService.getExperienceLevelLogs(employeeId).then(function (data) {
            $scope.data.adjustInformations = data;
            if (data.length <= 0) {
                $scope.data.showAdjustInformationsTip = false;
            }
        });
    };

}]);