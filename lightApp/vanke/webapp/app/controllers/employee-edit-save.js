'use strict';

VkrmsApp.controller('EmployeeEditController', ['$scope', '$routeParams', 'EmployeeService', 'CommonService', '$filter', 'UserService', function ($scope, $routeParams, employeeService, commonService, $filter, userService) {
    $scope.pageTitle = "修改人员信息";
    $scope.showValidationMessages = false;
    $scope.dataValues = {};
    var workingHours, workHoursEffectDate;
    $scope.vertifyContractTypeId = vertifyContractTypeId;
    $scope.data = {
        showAdjustInformationsTip: true,
        showAdjustComment: false,
        identityTypes: employeeService.getIdentityTypes(),
        jobStatuses: employeeService.getJobStatuses(),
        contractTypes: employeeService.getContractTypes(),
        primaryWorkGroups: employeeService.getPrimaryWorkGroups(),
        jobRanks: employeeService.getJobRanks(),
        highestDegrees: employeeService.getEducationDegrees(),
        educationDegrees: employeeService.getEducationDegrees(),
        nationalities: employeeService.getNationalities(),
        politicalIdentities: employeeService.getPoliticalIdentities(),
        maritalStatuses: employeeService.getMaritalStatuses(),
        relationships: employeeService.getRelationships(),
        personnelSubareas: employeeService.getPersonnelSubareas(),
        educationExperiences: [],
        familyInformations: [],
        domicile: {
            provinces: null
        },
        oSalaryTypes: employeeService.getOSalaryType()
    };
    $scope.regIdTypeCheckr = regIdTypeChecker;
    $scope.saveInfo = saveInfo;
    $scope.loadDepartment = loadDepartment;
    $scope.getExperienceLevelLogs = getExperienceLevelLogs;
    $scope.updateEmergencyContact = updateEmergencyContact;
    $scope.selectWorkDepartments = selectWorkDepartments;
    //修改职位
    $scope.selectWorkJobs = selectWorkJobs;
    $scope.alertMsg = alertMsg;
    //取消保存职位
    $scope.cancelWorkJobs = cancelWorkJobs;
    //保存职位
    $scope.saveWorkJobs = saveWorkJobs;
    $scope.adjustJobLevel = adjustJobLevel;
    $scope.disabledAlert = disabledAlert;
    $scope.changeIsVankeStaff = changeIsVankeStaff;
    $scope.changeIsCooperationStaff = changeIsCooperationStaff;
    $scope.limitModifyState = true;
    $scope.tipVankeStaff = tipVankeStaff;
    $scope.disabledAlertState = false;
    employeeService.loadEmployee($routeParams.id).then(function (data) {
        $scope.dataValues = data;
        if ($scope.dataValues.originalSapId) { // 同步 sap 数据均不可修改
            $scope.disabledAlertState = true;
            $('#entry-date').attr('disabled', 'disabled')
        }
        $scope.initSalaryType = $scope.dataValues.salaryType;
        workingHours = JSON.parse(JSON.stringify(data)).workingHours;
        workHoursEffectDate = data.workHoursEffectDate && $filter("date")(new Date(data.workHoursEffectDate), "yyyy年MM月dd日");
        $scope.dataValues.oSalaryType = data.oSalaryType || "";
        $scope.data.entryDate = data.entryDate && $filter("date")(new Date(data.entryDate), "yyyy年MM月dd日");
        $scope.data.leaveDate = data.leaveDate && $filter("date")(new Date(data.leaveDate), "yyyy年MM月dd日");
        $scope.data.entryOrgDate = data.entryOrgDate && $filter("date")(new Date(data.entryOrgDate), "yyyy年MM月dd日");
        $scope.data.leaveOrgDate = data.leaveOrgDate && $filter("date")(new Date(data.leaveOrgDate), "yyyy年MM月dd日");
        $scope.data.contractStartDate = data.contractStartDate && $filter("date")(new Date(data.contractStartDate), "yyyy年MM月dd日");
        $scope.data.contractEndDate = data.contractEndDate && $filter("date")(new Date(data.contractEndDate), "yyyy年MM月dd日");
        $scope.data.workHoursEffectDate = workHoursEffectDate;
        $scope.dataValues.cooperationCity = data.cooperationCity || "";
        $scope.dataValues.cooperationCompany = data.cooperationCompany || "";
        data.isVankeStaff = data.isVankeStaff == undefined ? 2 : data.isVankeStaff;
        $scope.isOuter = data.isVankeStaff == 2;
        $scope.isChangeVankeStaff = [data.isVankeStaff, data.isCooperationStaff, data.cooperationCity, data.cooperationCompany];
        getEducationAndFamily();
        getIsEmergencyContact();
        getDomicile();
        getCompanyandDepartment();
        getWorkGroups();
        getSkills();
        getWorkJobs();
        getValidWorkJobs();
        watchSelectChange();
        employeeService.refreshSelectPicker("#id-type, #domicile-province, #nationality, #political-identity, #marital-status, #job-rank, " +
            "#highest-degree, #job, #work-job, #primary-work-group, #contractTypeId, #job-status, #personnel-subarea, #cooperationCity, #cooperationCompany");
        $scope.dataValues.job = $scope.data.job ? $scope.data.job.workJobId : null;
        $(".selectpicker").selectpicker();
        employeeService.getCooperationCompany().then(function (result) {
            $scope.cooperationCompanys = result || [];
            employeeService.refreshSelectPicker("#cooperationCompany");
        });
        //$("#entry-date").datepicker('setDate', transferDate(data.entryDate));
    });
    getCooperationCity();

    function getCooperationCity() {
        employeeService.getCooperationCity().then(function (result) {
            $scope.cooperationCitys = result || [];
            employeeService.refreshSelectPicker("#cooperationCity");
        });
    }

    function disabledAlert(id, initSalaryType) {
        var txt = [
            '此员工信息不可编辑。如确有变更请联系人事共享在E-HR系统修改.',
            '此员工信息不可编辑。如确有变更请联系人事共享执行调动/调薪/离职流程'
        ]
        if ($scope.disabledAlertState && !initSalaryType) {
            commonService.alert({
                content: txt[id],
                icon: "fa-exclamation-circle"
            });
        }
    }

    function changeIsVankeStaff() {
        if ($scope.dataValues.isVankeStaff == 1) {
            $scope.dataValues.isCooperationStaff = null;
            $scope.dataValues.cooperationCity = "";
            $scope.dataValues.cooperationCompany = "";
            employeeService.refreshSelectPicker("#cooperationCity, #cooperationCompany");
        }
    }

    function changeIsCooperationStaff() {
        if ($scope.dataValues.isCooperationStaff == 1) {
            $scope.dataValues.cooperationCity = "";
            $scope.dataValues.cooperationCompany = "";
            employeeService.refreshSelectPicker("#cooperationCity, #cooperationCompany");
        }
    }
    // 撤销 task
    userService.getUserEmployee().then(function (res) {
        if (!_.isEmpty(res.authorizedPage)) {
            res.authorizedPage.forEach(function (item) {
                if (item.indexOf('employee-edit:edit') != -1) {
                    $scope.limitModifyState = true
                }
            })
        } else {
            $scope.limitModifyState = false
        }
    });
    $scope.stopSalaryType = function () {
        // task268回滚
        // if ($scope.dataValues.contractTypeId == '01') {
        //     commonService.alert({
        //         content: "该员工员工子组为“全日制/非全日制”，此信息需人事共享平台更改同步",
        //         icon: "fa-exclamation-circle"
        //     });
        // }
    }
    $scope.limitModify = function () {
        if (!$scope.limitModifyState) {
            commonService.alert({
                content: "如需修改工时制，请联系城市公司薪酬岗操作。",
                icon: "fa-exclamation-circle"
            });
        }
    }
    $scope.limitModifySalaryType = function () {
        if (!$scope.isModifySalaryType) {
            commonService.alert({
                content: "如需更改工资类别，请联系人事共享在SAP进行修改",
                icon: "fa-exclamation-circle"
            });
        }
    }

    function alertMsg() {
        $scope.isSalaryType && commonService.alert({
            content: "此员工信息不可编辑。如确有变更请联系人事共享执行调动/调薪/离职流程",
            icon: "fa-exclamation-circle"
        });
    }

    function tipVankeStaff() {
        !$scope.isOuter && commonService.alert({
            content: "员工是否万科编制以EHR为准，请联系共享修改",
            icon: "fa-exclamation-circle"
        });
    }
    function vertifyContractTypeId() {
        if (($scope.dataValues.contractTypeId == '01' || $scope.dataValues.contractTypeId == '12') && $scope.dataValues.jobStatus == '01') {
            commonService.alert({
                content: "此员工信息不可编辑。如确有变更请联系人事共享执行调动/调薪/离职流程",
                icon: "fa-exclamation-circle"
            });
        }
    }
    function watchSelectChange() {
        $scope.isSalaryType = ($scope.dataValues.contractTypeId == '01' || $scope.dataValues.contractTypeId == '12')
        $scope.$watch("dataValues.contractTypeId", function (newValue, oldValue) {
            if (newValue == oldValue) return
            if (newValue == "01" || newValue == "12") {
                commonService.alert({
                    content: "此员工信息不可编辑。如确有变更请联系人事共享执行调动/调薪/离职流程",
                    icon: "fa-exclamation-circle"
                });
                // $scope.dataValues.contractTypeId = oldValue;
                // $("#contractTypeId").selectpicker("val", oldValue);
            }
            $scope.isSalaryType = ($scope.dataValues.contractTypeId == '01' || $scope.dataValues.contractTypeId == '12')
        });

        $scope.$watch("dataValues.workingHours", function (newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            $scope.employeeForm.workHoursEffectDate = {};
            var hasChangeWorkingHours = workingHours && (newValue == "COMPREHENSIVE_WORKING_HOURS" || workingHours == "COMPREHENSIVE_WORKING_HOURS") && newValue != workingHours;
            if (!hasChangeWorkingHours) {
                $scope.data.workHoursEffectDate = workHoursEffectDate;
            }
            $scope.isWorkHourEffectRequired = hasChangeWorkingHours;
            $scope.employeeForm.workHoursEffectDate.$invalid = hasChangeWorkingHours;

        });
    }
    function saveInfo(form) {
        $scope.showValidationMessages = true;
        $scope.data.showAdjustComment = false;
        var educationExperiences = $scope.data.educationExperiences,
            educationExperiences2 = angular.copy(educationExperiences);
        $scope.isOuter = false;
        angular.forEach(educationExperiences, function (item, index) {
            var item = educationExperiences[index], item2 = educationExperiences2[index];
            item2.educationStartTime = transferDateTo(item.educationStartTime || "");
            item2.educationEndTime = transferDateTo(item.educationEndTime || "");
        });
        $scope.dataValues.educationExperiences = educationExperiences2;
        $scope.dataValues.familyInformations = $scope.data.familyInformations;
        if ($scope.data.jobLevels.length == 0) {
            getJobLevels();
        }
        // if ($scope.dataValues.salaryType == "05" && $scope.dataValues.oSalaryType == "") {
        //     $("#oSalaryType").focus();
        //     commonService.alert({
        //         content: "O序列为必选信息，请补充完整",
        //         icon: "fa-exclamation-circle"
        //     });
        //     return;
        // }
        if (($scope.dataValues.salaryType == "05" && $scope.dataValues.oSalaryType == "") || form.idNumber.$invalid || form.$invalid || regDomicileChecker() || regFamilyInformationsChecker() || regEducationExperiencesChecker() || adjustCommonChecker()) {
            setTimeout(function () {
                var inputInvalid = $("input.ng-invalid");
                var textInvalid = $(".text-danger:visible");
                if (inputInvalid.length) {
                    inputInvalid.eq(0).focus();
                } else if (textInvalid.length){
                    textInvalid.closest("div")[0].scrollIntoView(false);
                } else {
                    return;
                }
                var messageArr = [];
                textInvalid.each(function () {
                    messageArr.push($(this).closest(".col-xs-12").find("label").text())
                });
                commonService.alert({
                    content: messageArr + "为必填信息，请补充完整",
                    icon: "fa-exclamation-circle"
                });
            }, 20);
            return;
        }
        $scope.dataValues.job = $scope.data.job ? $scope.data.job.workJobId : null;
        $scope.dataValues.postId = $scope.dataValues.job;
        $scope.dataValues.domicile.province = $scope.data.domicile.province ? $scope.data.domicile.province.value : null;
        $scope.dataValues.domicile.city = $scope.data.domicile.city ? $scope.data.domicile.city.value : null;
        $scope.dataValues.domicile.county = $scope.data.domicile.county ? $scope.data.domicile.county.value : null;
        $scope.dataValues.entryDate = utils.transferDateTo($scope.data.entryDate);
        $scope.dataValues.leaveDate = $scope.data.leaveDate && utils.transferDateTo($scope.data.leaveDate);
        $scope.dataValues.entryOrgDate = utils.transferDateTo($scope.data.entryOrgDate);
        $scope.dataValues.leaveOrgDate = $scope.data.leaveOrgDate && utils.transferDateTo($scope.data.leaveOrgDate);
        $scope.dataValues.contractStartDate = $scope.data.contractStartDate && utils.transferDateTo($scope.data.contractStartDate);
        $scope.dataValues.contractEndDate = $scope.data.contractEndDate && utils.transferDateTo($scope.data.contractEndDate);
        $scope.dataValues.workHoursEffectDate = $scope.data.workHoursEffectDate && utils.transferDateTo($scope.data.workHoursEffectDate);
        $scope.dataValues.company = {
            company_id: $scope.data.company ? $scope.data.company.company_id : null,
            company_name: $scope.data.company.company_name || "",
            departments: null
        };
        $scope.dataValues.companyId = $scope.dataValues.company.company_id;
        $scope.dataValues.department = {
            company: null,
            department_id: $scope.data.department ? $scope.data.department.department_id : null,
            department_name: $scope.data.department.department_name || "",
            jobRule: null,
            taskRule: null
        };
        $scope.dataValues.departmentId = $scope.data.department ? $scope.data.department.department_id : null;
        $scope.dataValues.workGroupId = $scope.dataValues.workGroup ? $scope.dataValues.workGroup.work_group_id : null;

        $scope.dataValues.workDepartmentIds = [];
        angular.forEach($scope.data.workDepartment, function (item) {
            $scope.dataValues.workDepartmentIds.push(item.department_id);
        });

        $scope.dataValues.workJobIds = [];
        angular.forEach($scope.data.workJob, function (item) {
            $scope.dataValues.workJobIds.push(item.workJobId);
        });
        if (!$scope.dataValues.contractTypeId) {
            commonService.alert({
                content: "请选择员工子组",
                icon: "fa-exclamation-circle"
            });
            return
        }
        var config = {
            "title": "请确认以下操作",
            "icon": "fa-exclamation-circle",
            "content": "是否确认修改此员工的编制相关信息？",
            "callback": function () {
                editSave();
            }
        };
        if ($scope.dataValues.isVankeStaff != $scope.isChangeVankeStaff[0] || $scope.dataValues.cooperationCity != $scope.isChangeVankeStaff[2] ||
            $scope.dataValues.isCooperationStaff != $scope.isChangeVankeStaff[1] || $scope.isChangeVankeStaff[3] != $scope.dataValues.cooperationCompany) {
            commonService.confirm(config);
        } else {
            editSave();
        }
    };

    function editSave() {
        employeeService.editSave($routeParams.id, $scope.dataValues).then(function (data) {
            var status = data.status;
            var errorType = data.exceptionType || "";
            if (status === "success") {
                commonService.alert({
                    content: "保存成功",
                    icon: "fa-exclamation-circle"
                });
                $scope.isWorkHourEffectRequired = false;
                $scope.showValidationMessages = false;
                workingHours = JSON.parse(JSON.stringify($scope.dataValues)).workingHours;
                workHoursEffectDate = $scope.data.workHoursEffectDate;
                $scope.initSalaryType = $scope.dataValues.salaryType;
                $scope.isChangeVankeStaff = [$scope.dataValues.isVankeStaff, $scope.dataValues.isCooperationStaff, $scope.dataValues.cooperationCity, $scope.dataValues.cooperationCompany];
                //window.location = "#/employees";
            } else {
                var content = "保存失败, 您录入的信息有误, 请核查后重新输入。";
                if (errorType === "IdentityNumberExistException") {
                    content = "保存失败, 您输入的身份证号与已存在的身份证号数据重复，请核查后重新输入。"
                }

                commonService.alert({
                    content: content,
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
            }
        });
    }


    function loadDepartment(company) {
        if (company === null) {
            return;
        }
        angular.forEach($scope.data.companyDepartments, function (item) {
            if (item.company_id == company.company_id) {
                $scope.data.departments = item.departments;
            }
        });
        $scope.data.department = $scope.data.departments[0];
        employeeService.refreshSelectPicker("#department");
    }

    function getCompanyandDepartment() {
        commonService.getCompanies().then(function (data) {
            $scope.data.companyDepartments = data;
            employeeService.refreshSelectPicker("#company");
            $scope.data.company = employeeService.findItem($scope.data.companyDepartments, "company_id", $scope.dataValues.companyId);
            $scope.loadDepartment($scope.data.company);
            if ($scope.data.departments) {
                $scope.data.department = employeeService.findItem($scope.data.departments, "department_id", $scope.dataValues.departmentId);
            }
            getJobLevels();
            adjustJobLevelChecker();
        });
        commonService.getCompanies().then(function (data) {
            var arr = [];
            angular.forEach(data, function (authorizedCompanies) {
                angular.forEach(authorizedCompanies.departments, function (department) {
                    if (department.department_id.indexOf($scope.dataValues.workDepartmentIds) >= 0) {
                        arr.push(department);
                    }
                })
            });
            $scope.data.workDepartment = arr;
            employeeService.refreshSelectPicker("#work-department");
        });
    }

    function getWorkGroups() {
        commonService.getAllWorkGroups().then(function (data) {
            $scope.data.workGroups = data;
            employeeService.refreshSelectPicker("#work-group");
        });
    }

    function getSkills() {
        commonService.getSkills().then(function (data) {
            $scope.data.skills = data;
            employeeService.refreshSelectPicker("#skill");
        });
    }

    function getWorkJobs() {
        commonService.getValidWorkJobs().then(function (data) {
            $scope.data.jobs = data;
            $scope.data.job = employeeService.findItem($scope.data.jobs, "workJobId", $scope.dataValues.postId);
            employeeService.refreshSelectPicker("#job");
            getJobLevels();
            adjustJobLevelChecker();
        });
    }

    function getValidWorkJobs() {
        commonService.getValidWorkJobs().then(function (data) {
            $scope.data.workJobs = data;
            $scope.data.workJob = employeeService.findItems($scope.data.workJobs, "workJobId", $scope.dataValues.workJobIds);
            employeeService.refreshSelectPicker("#work-job");
        });
    }

    function getEducationAndFamily() {
        for (var i = 0; i < 5; i++) {
            if (!$scope.dataValues.educationExperiences[i]) {
                $scope.data.educationExperiences.push({
                    educationId: i.toString(),
                    educationStartTime: "",
                    educationEndTime: "",
                    educationSchool: "",
                    educationDegree: "",
                    educationMajor: ""
                })
            } else {
                $scope.data.educationExperiences[i] = angular.copy($scope.dataValues.educationExperiences[i]);
                $scope.data.educationExperiences[i].educationId = i.toString();
            }
            if (!$scope.dataValues.familyInformations[i]) {
                $scope.data.familyInformations.push({
                    familiesId: i.toString(),
                    familiesName: "",
                    familiesMobile: "",
                    relationship: "",
                    isEmergencyContact: false
                });
            } else {
                $scope.data.familyInformations[i] = angular.copy($scope.dataValues.familyInformations[i]);
                $scope.data.familyInformations[i].familiesId = i.toString();
            }
        }
        for (var i = 0; i < 5; i++) {
            $scope.data.educationExperiences[i].educationStartTime = transferToDate($scope.data.educationExperiences[i].educationStartTime);
            $scope.data.educationExperiences[i].educationEndTime = transferToDate($scope.data.educationExperiences[i].educationEndTime);
        }
    }

    function getIsEmergencyContact() {
        var isEmergencyContact = false;
        for (var i = 0; i < $scope.data.familyInformations.length; i++) {
            if ($scope.data.familyInformations[i].isEmergencyContact == true) {
                isEmergencyContact = true;
                break;
            }
        }
        if (isEmergencyContact == false) {
            $scope.data.familyInformations[0].isEmergencyContact = true;
        }
    }


    function getExperienceLevelLogs() {
        var employeeId = $scope.dataValues.id;
        commonService.getExperienceLevelLogs(employeeId).then(function (data) {
            $scope.data.adjustInformations = data;
            if (data.length <= 0) {
                $scope.data.showAdjustInformationsTip = false;
            } else {
                for (var i = 0; i < data.length; i++) {
                    $scope.data.adjustInformations[i].operationTime = getLocalTime(data[i].operationTime);
                }
            }
        });
    }

    function switchDomicile() {
        employeeService.refreshSelectPicker("#domicile-province");
        // 更换省的时候清空城市
        $("#domicile-province").on("change.bs.select", function () {
            $scope.data.domicile.city = null;
            $scope.data.domicile.county = null;
            $scope.$digest();
            employeeService.refreshSelectPicker("#domicile-city, #domicile-county");
        });
        $("#domicile-city").on("change.bs.select", function () {
            $scope.data.domicile.county = null;
            $scope.$digest();
            employeeService.refreshSelectPicker("#domicile-county");
        });
    }

    function getDomicile() {
        commonService.getCityData().then(function (data) {
            $scope.data.cityData = data;
            $scope.data.domicile.province = employeeService.findObj($scope.data.cityData, $scope.dataValues.domicile.province) || $scope.data.cityData[0];
            $scope.data.domicile.city = employeeService.findObj($scope.data.domicile.province.cities, $scope.dataValues.domicile.city) || $scope.data.domicile.province.cities[0];
            $scope.data.domicile.county = employeeService.findObj($scope.data.domicile.city.counties, $scope.dataValues.domicile.county) || $scope.data.domicile.city.counties[0];

            var domicile = $scope.data.domicile;
            domicile.provinces = $scope.data.cityData;
            employeeService.refreshSelectPicker("#domicile-province, #domicile-city, #domicile-county");
            switchDomicile();
        });
    }

    function updateEmergencyContact(familiesId) {
        angular.forEach($scope.data.familyInformations, function (item, $index) {
            var attr = $scope.data.familyInformations[$index];
            $scope.data.familyInformations[$index].isEmergencyContact = attr.familiesId == familiesId;
        });
    }

    function selectWorkDepartments() {
        var selectDepartmentModal = commonService.createModal({
            'templateUrl': baseUrl + '/partials/common/common-select-departments.html',
            'controller': 'CommonSelectDepartmentController',
            'resolve': {
                selectedDepartment: function () {
                    return $scope.dataValues.workDepartment;
                }
            }
        });

        selectDepartmentModal.result.then(function (selectedItems) {
            $scope.data.workDepartment = selectedItems || [];
            watchWorkDepartments();
        }, function () {
        });
    }

    function transferDate(entryOrgDate) {
        return employeeService.transferDate(entryOrgDate);
    }

    function transferToDate(entryOrgDate) {
        return employeeService.transferToDate(entryOrgDate);
    }

    function transferDateTo(entryOrgDate) {
        return utils.transferDateTo(entryOrgDate);
    }

    function regIdTypeChecker() {
        var idNumber = $scope.dataValues.idNumber;
        var idType = $scope.dataValues.idType;
        var idNumberInvalid = employeeService.regIdTypeChecker(idNumber, idType);
        $scope.employeeForm.idNumber.$invalid = idNumberInvalid;
    }

    function regDomicileChecker() {
        var domicile = employeeService.regDomicileChecker();
        $scope.employeeForm.domicile = domicile;
    }

    function regFamilyInformationsChecker() {
        var familyInformations = $scope.dataValues.familyInformations,
            familyInformationInvalid;
        familyInformationInvalid = employeeService.regFamilyInformationsChecker(familyInformations);
        $scope.employeeForm.familyInformation = {};
        $scope.employeeForm.familyInformation.$invalid = familyInformationInvalid;
        if (familyInformationInvalid) {
            return true;
        }
    }

    function regEducationExperiencesChecker() {
        var educationExperiences = $scope.dataValues.educationExperiences,
            educationExperienceInvalid;
        educationExperienceInvalid = employeeService.regEducationExperiencesChecker(educationExperiences, $scope);
        $scope.employeeForm.educationExperience = {};
        $scope.employeeForm.educationExperience.$invalid = educationExperienceInvalid;
        if (educationExperienceInvalid) {
            return true;
        }
    }

    //修改工作项目
    function watchWorkDepartments() {
        var workDepartments = $scope.dataValues.workDepartments || [];
        var workDepartment = $scope.data.workDepartment || [];
        if ((workDepartments.length == 0 && workDepartment.length == 0) || (workDepartments.length != 0 && workDepartment.length == 0)) {
            return;
        } else if (workDepartments.length == 0) {
            $scope.dataValues.workDepartments = [];
            for (var i = 0; i < workDepartment.length; i++) {
                $scope.dataValues.workDepartments.push({
                    departmentId: workDepartment[i].department_id,
                    departmentName: workDepartment[i].department_name
                });
            }
        } else {
            var newWorkDepartments = employeeService.watchWorkDepartments(workDepartments, workDepartment, $scope);
            $scope.dataValues.workDepartments = newWorkDepartments;
        }
        employeeService.refreshSelectPicker(".work-job");
    }

    function selectWorkJobs(workDepartment, $event) {
        var workDepartments = $scope.dataValues.workDepartments;
        var modelTmp = employeeService.selectWorkJobs(workDepartments, workDepartment, $event);
        $scope.data.modifyWorkJob = modelTmp.length == 0 ? "" : modelTmp;
        employeeService.refreshSelectPicker(".work-job");
    }

    function saveWorkJobs($event) {
        var workDepartments = $scope.dataValues.workDepartments,
            workJobs = $scope.data.workJobs,
            index = $($event.target).closest("tr").index();
        workDepartments[index].workJobs = $scope.data.modifyWorkJob;
        employeeService.saveWorkJobs($event, workDepartments, workJobs);
    }

    function cancelWorkJobs($event) {
        employeeService.cancelWorkJobs($event);
    }
    //点击收起/展开项目
    $(".panel-heading").click(function () {
        if ($(this).siblings().hasClass("hide")) {
            $(this).removeClass("down").addClass("up").siblings().removeClass("hide");
        } else {
            $(this).removeClass("up").addClass("down").siblings().addClass("hide");
        }
    });

    $scope.$watch('data.job || data.department', function () {
        if (!$scope.data.job || !$scope.data.department || !$scope.dataValues.jobExperienceValue) {
            $scope.data.jobLevels = [];
            return;
        } else {
            var postId = $scope.data.job.workJobId || "";
            for (var i = 0; i < $scope.data.workJobs.length; i++) {
                if (postId == $scope.data.workJobs[i].workJobId) {
                    getJobLevels();
                    adjustJobLevelChecker();
                }
            }
        }
    });

    $scope.$watch('dataValues.jobExperienceValue', function () {
        if (jobExperienceValueChecker()) {
            adjustJobLevelChecker();
        }
    });
    $scope.$watch('data.jobLevel', function () {
        if ($scope.dataValues.jobExperienceValue && $scope.dataValues.jobExperienceValue != "") {
            adjustJobLevelChecker();
        }
    });
    function jobExperienceValueChecker() {
        if ($scope.dataValues.jobExperienceValue && $scope.dataValues.jobExperienceValue != "") {
            employeeForm.jobExperienceValue.$invalid = false;
            return true;
        } else {
            employeeForm.jobExperienceValue.$invalid = true;
            $scope.data.isAdjustJobLevel = "0";
            $("#job-level").next().css("width", "100%");
            return false;
        }
    }

    //修改级别时校验
    function adjustJobLevelChecker() {
        var jobLevel = $scope.data.jobLevel,
            experienceValue = $scope.dataValues.jobExperienceValue,
            index = $("#job-level").find("option:selected").index() - 1,
            jobLevels = $scope.data.jobLevels;
        $scope.employeeForm.jobLevel = {};
        if ($scope.data.adjustNewLevel) {
            $scope.data.isAdjustJobLevel = "1";
            return true;
        }
        if (!$scope.data.jobLevel || ($scope.data.jobLevel && $scope.data.jobLevel == "0")) {  //经验值改变，级别为空
            $scope.data.isAdjustJobLevel = "0";
            //$("#job-level").next().css({"width": "calc(100% - 80px)", "margin-right": "5px"});
            $scope.employeeForm.jobLevel.$invalid = false;
            return false;
        } else if ($scope.data.jobLevel) {
            var invalid = employeeService.adjustJobLevelChecker(index, jobLevel, jobLevels, experienceValue);
            $scope.employeeForm.jobLevel.$invalid = invalid;
            if (invalid == true) {
                $scope.data.isAdjustJobLevel = "1";
            } else {
                $scope.data.isAdjustJobLevel = "0";
            }
            return invalid;
        }
    }

    function getJobLevels() {
        if (!$scope.data.job || !$scope.data.department) {
            return;
        }
        var postId = $scope.data.job.workJobId || [];
        var departmentId = $scope.data.department.department_id || [];
        commonService.getJobLevels(postId, departmentId).then(function (data) {
            $scope.data.jobLevels = data;
            if ($scope.data.jobLevel == $scope.dataValues.jobLevel) {
                $scope.data.jobLevel = employeeService.findItem($scope.data.jobLevels, "levelId", Number($scope.dataValues.jobLevel));
            }
            employeeService.refreshSelectPicker("#job-level");
            var experienceValue = Number($scope.dataValues.jobExperienceValue),
                levels = $scope.data.jobLevels,
                adjustNewLevel;
            if (!experienceValue || !levels) {
                $scope.data.isAdjustJobLevel = "0";
                return;
            }
            if (levels.length > 0 && experienceValue < levels[0].experienceValueBegin) {
                adjustNewLevel = levels[0];
            } else if (levels.length > 0 && experienceValue > levels[levels.length - 1].experienceValueEnd) {
                adjustNewLevel = levels[levels.length - 1];
            } else if (levels.length > 0) {
                for (var i = 0; i < levels.length; i++) {
                    if (experienceValue >= levels[i].experienceValueBegin && experienceValue <= levels[i].experienceValueEnd) {
                        adjustNewLevel = levels[i];
                    }
                }
            }
            if (adjustNewLevel) {
                $scope.data.adjustNewLevel = adjustNewLevel;
                $scope.data.isAdjustJobLevel = "1";
            } else {

            }

        });
    }

    function adjustJobLevel() {
        if ($scope.data.adjustNewLevel) {
            var newJobLevelId = $scope.data.adjustNewLevel.levelId;
            $scope.data.jobLevel = employeeService.findItem($scope.data.jobLevels, "levelId", newJobLevelId);
            employeeService.refreshSelectPicker("#job-level");
            $scope.data.showAdjustComment = true;
            $scope.data.isAdjustJobLevel = "0";
            $scope.data.adjustNewLevel = null;
        }

    }

    function adjustCommonChecker() {
        if ($scope.dataValues.jobLevel && $scope.dataValues.jobLevel != $scope.dataValues.jobLevel.levelId && !$scope.dataValues.adjustComment) {
            $scope.employeeForm.adjustComment = {};
            $scope.employeeForm.adjustComment.$invalid = true;
            return true;
        }
    }

    function getLocalTime(nS) {
        return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
    }

}]);
VkrmsApp.directive('dateResponse', ['$filter', 'safeApply', function ($filter, safeApply) {
    return {
        restrict: "AC",
        require: "^?ngModel",
        scope: {
            dateConfig: "=datePicker",
            val: "=ngModel"
        },
        link: link
    };
    function link(scope, element, attrs, $ngModel) {
        var defaults = {
            language: 'zh-CN',
            todayHighlight: true,
            clearBtn: true,
            autoclose: true,
            format: "yyyy年mm月dd日"
        };
        var config = scope.dateConfig ? angular.extend({}, defaults, scope.dateConfig) : defaults;
        $(element).datepicker(config);
        $(element).on('changeDate', function (e) {
            if (e && e.date) {
                safeApply(scope, function () {
                    $ngModel.$setViewValue($filter('date')(e.date, "yyyy年MM月dd日"));
                });
            }
        }).on("clearDate", function () {
            safeApply(scope, function () {
                $ngModel.$setViewValue("");
            });
        }).on("focus", function () {
            // 避免失去焦点时，输入框为空
            if (!$(element).data("triggerFocusCount")) {
                $(element).datepicker("setDate", scope.val);
            }
            $(element).data("triggerFocusCount", "1");
        })
    }
}])
    .factory('safeApply', function () {
        return function (scope, fn) {
            var phase = scope.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && ( typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        }
    });