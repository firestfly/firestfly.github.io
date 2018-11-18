'use strict';

VkrmsApp.controller('EmployeeCreateController', ['$scope', 'EmployeeService', 'CommonService', '$filter', 'UserService', function ($scope, employeeService, commonService, $filter, userService) {
    $scope.pageTitle = "新增人员信息";
    $scope.showValidationMessages = false;
    $scope.disabledAlertState = false;
    $scope.data = {
        showAdjustInformationsTip: false,
        approvalStatuses: employeeService.getApprovalStatuses(),
        identityTypes: employeeService.getIdentityTypes(),
        jobStatuses: employeeService.getJobStatuses(),
        contractTypes: employeeService.getContractTypes(),
        primaryWorkGroups: employeeService.getPrimaryWorkGroups(),
        jobRanks: employeeService.getJobRanks(),
        relationShips: employeeService.getRelationships(),
        highestDegrees: employeeService.getEducationDegrees(),
        educationDegrees: employeeService.getEducationDegrees(),
        maritalStatuses: employeeService.getMaritalStatuses(),
        politicalIdentities: employeeService.getPoliticalIdentities(),
        nationalities: employeeService.getNationalities(),
        educationExperiences: [],
        familyInformations: [],
        relationships: employeeService.getRelationships(),
        personnelSubareas: employeeService.getPersonnelSubareas(),
        entryDate: null,
        leaveDate: null,
        contractStartDate: null,
        contractEndDate: null,
        domicile: {},
        oSalaryTypes: employeeService.getOSalaryType()
    };
    $scope.isOuter = true;
    $scope.dataValues = {
        oSalaryType: "",
        gender: 0,
        active: true,
        idType: "01",
        originalSapId: null,
        contractTypeId: null,
        nationality: null,
        politicalIdentity: null,
        maritalStatus: null,
        domicileType: null,
        jobStatus: "01",
        primaryWorkGroup: null,
        personnelSubarea: null,
        salaryType: null,
        jobRank: null,
        highestDegree: null,
        jobExperienceValue: null,
        jobLevel: "",
        educationExperiences: [],
        familyInformations: [],
        domicile: {},
        //workGroup: {},
        skillIds: [],
        loginMobile: null,
        workingHours: null,
        isVankeStaff: 2
    };

    bindEvent();
    getEducationAndFamily();
    getValidWorkJobs();
    init();

    $scope.loadDepartment = loadDepartment;
    $scope.saveInfo = saveInfo;
    $scope.adjustJobLevel = adjustJobLevel;
    $scope.regIdTypeCheckr = regIdTypeChecker;
    $scope.updateEmergencyContact = updateEmergencyContact;
    $scope.selectWorkDepartments = selectWorkDepartments;
    $scope.isModifySalaryType = true;
    //修改职位
    $scope.selectWorkJobs = selectWorkJobs;
    //保存职位
    $scope.saveWorkJobs = saveWorkJobs;
    //取消保存职位
    $scope.cancelWorkJobs = cancelWorkJobs;

    function init() {
        $(".selectpicker").selectpicker();
        $("#jobExperienceValue").attr("disabled", false);
        employeeService.refreshSelectPicker("#id-type, #domicile-province, #nationality, #political-identity, " +
            "#marital-status, #job-rank, #highest-degree, " +
            "#job, #work-job, #primary-work-group, #contractTypeId, #job-status, #personnel-subarea");
    }

    function getValidWorkJobs() {
        commonService.getValidWorkJobs().then(function (data) {
            $scope.data.workJobs = data;
            employeeService.refreshSelectPicker("#work-job");

            $scope.data.jobs = data;
            employeeService.refreshSelectPicker("#job");
        });
    }

    $scope.limitModifyState = true
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
    $scope.limitModify = function () {
        if (!$scope.limitModifyState) {
            commonService.alert({
                content: "暂无权限修改工时制！",
                icon: "fa-exclamation-circle"
            });
        }
    }
    //修改工作项目
    watchWorkDepartments();

    function loadDepartment(company) {
        angular.forEach($scope.data.companyDepartments, function (item) {
            if (item.company_id == company.company_id) {
                $scope.data.departments = item.departments;
            }
        });
        employeeService.refreshSelectPicker("#department");
    }

    function saveInfo(form) {
        $scope.showValidationMessages = true;
        $scope.dataValues.educationExperiences = angular.copy($scope.data.educationExperiences);
        $scope.dataValues.familyInformations = $scope.data.familyInformations;

        var inputStartPicker = $("#education-experience-table").find("input.education-start-time"),
            inputEndPicker = $("#education-experience-table").find("input.education-end-time"),
            educationExperiences = $scope.data.educationExperiences,
            educationExperiences2 = $scope.dataValues.educationExperiences;

        angular.forEach(educationExperiences, function (item, index) {
            educationExperiences[index].educationStartTime = inputStartPicker.eq(index).val();
            educationExperiences[index].educationEndTime = inputEndPicker.eq(index).val();

            var item = educationExperiences2[index];
            item.educationStartTime = transferDateTo(item.educationStartTime || "");
            item.educationEndTime = transferDateTo(item.educationEndTime || "");
        });
        // if ($scope.dataValues.salaryType == "05" && $scope.dataValues.oSalaryType == "") {
        //     $("#oSalaryType").focus();
        //     commonService.alert({
        //         content: "O序列为必选信息，请补充完整",
        //         icon: "fa-exclamation-circle"
        //     });
        //     return;
        // }
        if (($scope.dataValues.salaryType == "05" && $scope.dataValues.oSalaryType == "") || form.$invalid || regDomicileChecker() || regFamilyInformationsChecker() || regEducationExperiencesChecker()) {
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

        $scope.dataValues.jobExperienceValue = Number($scope.dataValues.jobExperienceValue || 0);
        $scope.dataValues.approvalStatus = $scope.data.approvalStatus ? $scope.data.approvalStatus.value : null;
        $scope.dataValues.job = $scope.data.job ? $scope.data.job.workJobId : null;
        $scope.dataValues.postId = $scope.dataValues.job;
        $scope.dataValues.entryDate = utils.formatDate($("#entry-date").datepicker("getDate") || null);
        $scope.dataValues.leaveDate = utils.formatDate($("#leave-date").datepicker("getDate") || null);
        $scope.dataValues.entryOrgDate = utils.formatDate($("#entry-org-date").datepicker("getDate") || null);
        $scope.dataValues.leaveOrgDate = utils.formatDate($("#leave-org-date").datepicker("getDate") || null);
        $scope.dataValues.contractStartDate = utils.formatDate($('#contract-start-date').datepicker("getDate") || null);
        $scope.dataValues.contractEndDate = utils.formatDate($("#contract-end-date").datepicker("getDate") || null);
        $scope.dataValues.skill = $scope.data.skill ? $scope.data.skill.value : null;
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

        $scope.dataValues.domicile.province = $scope.data.domicile.province ? $scope.data.domicile.province.value : null;
        $scope.dataValues.domicile.city = $scope.data.domicile.city ? $scope.data.domicile.city.value : null;
        $scope.dataValues.domicile.county = $scope.data.domicile.county ? $scope.data.domicile.county.value : null;
        $scope.dataValues.workDepartmentIds = [];
        angular.forEach($scope.data.workDepartment, function (item) {
            $scope.dataValues.workDepartmentIds.push(item.department_id);
        });

        $scope.dataValues.workJobIds = [];
        angular.forEach($scope.data.workJob, function (item) {
            $scope.dataValues.workJobIds.push(item.workJobId);
        });
        $("#job-level").removeAttr("disabled");

        createSave();

    }

    function createSave() {
        employeeService.save($scope.dataValues).then(function (data) {
            var status = data.status;
            var errorType = data.exceptionType || "";
            if (status === "success") {
                commonService.alert({
                    content: "保存成功",
                    icon: "fa-exclamation-circle"
                });
                window.location = "#/employees";
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

    function getEducationAndFamily() {
        for (var i = 0; i < 5; i++) {
            $scope.data.educationExperiences.push({
                educationStartTime: "",
                educationEndTime: "",
                educationSchool: "",
                educationDegree: "",
                educationMajor: ""
            });
            $scope.data.familyInformations.push({
                //familiesId: i,
                familiesName: "",
                familiesMobile: "",
                relationship: "",
                isEmergencyContact: false
            });
        }
        $scope.data.familyInformations[0].isEmergencyContact = true;
    }

    function switchDomicile() {
        commonService.getCityData().then(function (data) {
            $scope.data.cityData = data;
            employeeService.refreshSelectPicker("#domicile-province");
            var domicile = $scope.data.domicile;
            domicile.provinces = $scope.data.cityData || null;
            // 更换省的时候清空城市
            $scope.$watch('data.domicile.province', function (province) {
                domicile.city = null;
                domicile.county = null;
                employeeService.refreshSelectPicker("#domicile-city");
                employeeService.refreshSelectPicker("#domicile-county");
            });
            // 更换城市的时候清空县区
            $scope.$watch('data.domicile.city', function (city) {
                domicile.county = null;
                employeeService.refreshSelectPicker("#domicile-county");
            });
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
                    return $scope.data.workDepartment;
                }
            }
        });

        selectDepartmentModal.result.then(function (selectedItems) {
            $scope.data.workDepartment = selectedItems || [];
            watchWorkDepartments();
        }, function () {
        });
    }

    function transferDateTo(entryDate) {
        return utils.transferDateTo(entryDate);
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


    function watchWorkDepartments() {
        var workDepartments = $scope.dataValues.workDepartments || [],
            workDepartment = $scope.data.workDepartment || [];
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

    function adjustJobLevel() {
        $("#job-level").removeAttr("disabled").next().find("button").removeClass("disabled");
    }

    function bindEvent() {
        $("body").delegate(".education-start-time,.education-end-time", "focusin", function () {
            $(this).selectpicker();
        });
        $scope.$watch("dataValues.contractTypeId", function (newValue, oldValue) {
            if (newValue == "01" || newValue == "12") {
                commonService.alert({
                    content: "该员工子组为“全日制/非全日制”，此信息需人事共享平台更改同步",
                    icon: "fa-exclamation-circle"
                });
                $scope.dataValues.contractTypeId = oldValue;
                $("#contractTypeId").selectpicker("val", oldValue);
            }
        });
        $('#entry-date').on("changeDate", function () {
            $scope.data.entryDate = $filter("date")($(this).val() || null, "yyyy年MM月dd日");
        });
        //点击收起/展开项目
        $(".panel-heading").click(function () {
            if ($(this).siblings().hasClass("hide")) {
                $(this).removeClass("down").addClass("up").siblings().removeClass("hide");
            } else {
                $(this).removeClass("up").addClass("down").siblings().addClass("hide");
            }
        });
        $("#domicile-province").on("show.bs.select", function () {
            switchDomicile();
            $(this).off("show.bs.select");
        });
        $("#company").on("show.bs.select", function () {
            commonService.getCompanies().then(function (data) {
                $scope.data.companyDepartments = data;
                employeeService.refreshSelectPicker("#company");
            });
            $(this).off("show.bs.select");
        });

        $("#work-group").on("show.bs.select", function () {
            commonService.getAllWorkGroups().then(function (data) {
                $scope.data.workGroups = data;
                employeeService.refreshSelectPicker("#work-group");
            });
            $(this).off("show.bs.select");
        });
        $("#job-level").on("show.bs.select", function () {
            getJobLevels();
            $(this).off("show.bs.select");
        });
        $("#skill").on("show.bs.select", function () {
            commonService.getSkills().then(function (data) {
                $scope.data.skills = data;
                employeeService.refreshSelectPicker("#skill");
            });
            $(this).off("show.bs.select");
        });
    }
}]);