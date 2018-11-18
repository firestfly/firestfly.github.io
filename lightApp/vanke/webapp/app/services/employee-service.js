'use strict';

(function (w) {
    w.VkrmsApp.factory('EmployeeService', ['$http', '$q', '$timeout', 'CommonService', function ($http, $q, $timeout, commonService) {
        var indexSelectWorkJob;
        return {
            exportEmployeeDetail: function (params) {
                var url = baseUrl + "/file/export-employee-detail";
                commonService.downloadFile(url, params);
            },
            exportTemplate: function (params) {
                var url = baseUrl + "/file/export-employee-template";
                commonService.downloadFile(url, params);
            },
            save: function (data) {
                var deferred = $q.defer();

                $http.post(apiBaseUrl + '/employee', data).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            },
            deleteEmployee: function (empId) {
                var deferred = $q.defer();
                $http.delete(apiBaseUrl + '/employee/' + empId).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            editSave: function (empId, data) {
                var deferred = $q.defer();

                $http.put(apiBaseUrl + '/employee/' + empId, data).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            },
            getCooperationCity: function () {
                var deferred = $q.defer();
                $http.get(apiBaseUrl + '/cooperation-city').success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getCooperationCompany: function () {
                var deferred = $q.defer();
                $http.get(apiBaseUrl + '/cooperation-company').success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            refreshSelectPicker: function (selector) {
                $timeout(function () {
                    $(selector).selectpicker('refresh');
                }, 0, false);
            },
            loadEmployee: function (empId) {
                var deferred = $q.defer();

                $http.get(apiBaseUrl + '/employee/' + empId).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            },
            getApprovalStatuses: function () {
                return ['待审批', '通过', '不通过'];
            },
            getIdentityTypes: function () {
                return {
                    '01': '居民身份证',
                    '02': '护照',
                    'Z3': '港澳通行证',
                    'Z4': '暂住/居住证',
                    'Z5': '香港身份证',
                    'ZA': '台胞证'
                };
            },
            getJobStatuses: function () {
                return {
                    '01': '在职',
                    '02': '离职'
                };
            },
            getContractTypes: function () {
                return {
                    '01': '全日制',
                    '02': '实习',
                    '03': '业务外包员工',
                    '05': '乐邦',
                    '10': '其他',
                    '12': '非全日制',
                    '21': '劳务派遣员工',
                    '31': '退休返聘',
                    '32': '顾问（非返聘）',
                    '41': '合资方派遣人员',
                    '51': '家属',
                    '52': '董监事',
                    '53': '残障人员'
                };
            },
            getMaritalStatuses: function () {
                return ['未婚', '已婚', '丧偶', '离异'];
            },
            getDomicileTypes: function () {
                return {'0': '城市', '1': '农村'};
            },
            getRelationships: function () {
                return {
                    '1': '配偶',
                    '10': '离异双方',
                    '11': '父亲',
                    '12': '母亲',
                    '2': '子女',
                    '3': '法定监护人',
                    '90': '兄弟姐妹',
                    '9': '其他',
                    '8': '相关人员'
                };
            },
            getOSalaryType: function () {
                return ["OA", "OB", "OC", "OD", "OE", "OF", "OG", "OH", "OI"];
            },
            getNationalities: function () {
                return {
                    '01': '汉族',
                    '02': '蒙古族',
                    '03': '回族',
                    '04': '藏族',
                    '05': '维吾尔族',
                    '06': '苗族',
                    '07': '彝族',
                    '08': '壮族',
                    '09': '布依族',
                    '10': '朝鲜族',
                    '11': '满族',
                    '12': '侗族',
                    '13': '瑶族',
                    '14': '白族',
                    '15': '土家族',
                    '16': '哈尼族',
                    '17': '哈萨克族',
                    '18': '傣族',
                    '19': '黎族',
                    '20': '傈僳族',
                    '21': '佤族',
                    '22': '畲族',
                    '23': '高山族',
                    '24': '拉祜族',
                    '25': '水族',
                    '26': '东乡族',
                    '27': '纳西族',
                    '28': '景颇族',
                    '29': '柯尔克孜族',
                    '30': '土族',
                    '31': '达斡尔族',
                    '32': '仫佬族',
                    '33': '羌族',
                    '34': '布朗族',
                    '35': '撒拉族',
                    '36': '毛难族',
                    '37': '仡佬族',
                    '38': '锡伯族',
                    '39': '阿昌族',
                    '40': '普米族',
                    '41': '塔吉克族',
                    '42': '怒族',
                    '43': '乌孜别克族',
                    '44': '俄罗斯族',
                    '45': '鄂温克族',
                    '46': '德昂族',
                    '47': '保安族',
                    '48': '裕固族',
                    '49': '京族',
                    '50': '塔塔尔族',
                    '51': '独龙族',
                    '52': '鄂伦春族',
                    '53': '赫哲族',
                    '54': '门巴族',
                    '55': '珞巴族',
                    '56': '基诺族',
                    '57': '其他',
                    '58': '外国血统中国籍人士'
                };
            },
            getPoliticalIdentities: function () {
                return {
                    '01': '中国共产党党员',
                    '02': '中国共产党预备党员',
                    '03': '中国共产主义青年团团员',
                    '04': '台湾民主自治同盟盟员',
                    '05': '中国国民党革命委员会会员',
                    '06': '中国民主促进会会员',
                    '07': '中国民主建国会会员',
                    '08': '中国民主同盟盟员',
                    '09': '中国农工民主党党员',
                    '10': '中国致公党党员',
                    '11': '九三学社社员',
                    '12': '无党派民主人士',
                    '13': '群众'
                };
            },
            getEducationDegrees: function () {
                return {
                    '02': '博士研究生',
                    '03': '硕士研究生',
                    '04': '相当研究生',
                    '05': '本科',
                    '07': '大专',
                    '10': '中专',
                    '12': '技校',
                    '13': '职高',
                    '14': '高中',
                    '16': '初中',
                    '17': '初中以下'
                };
            },
            getPersonnelSubareas: function () {  //人事子范围
                return {
                    '1010': 'BD-市场拓展',
                    '1011': 'BS-数信',
                    '1012': 'BD-万物成长',
                    '1013': 'BD-智慧社区',
                    '1014': 'BU-楼宇服务',
                    '1015': 'BD-社区房屋',
                    '1016': 'BU-生活服务',
                    '1017': 'BD-社区仓储',
                    '1018': 'BU-资产服务',
                    '1019': 'BS-财务管理',
                    '1020': 'BS-城市管理层',
                    '1021': 'BS-人力资源',
                    '1022': 'BS-规划发展',
                    '1023': 'BS-综合管理',
                    '1024': 'BU-开发商服务',
                    '1025': 'BU-商写物业',
                    '1026': 'BU-住宅物业',
                    '1027': 'BS-业务支持管理',
                    '1100': '其它'
                };
            },
            getPrimaryWorkGroups: function () {
                return {
                    '1': '合同制员工',
                    '2': '非合同制员工',
                    '3': '协议制人员',
                    '4': '合资方派遣人员',
                    '5': '挂靠人员'
                };
            },
            getJobRanks: function () {
                return {
                    '10201101': '物业-市场-集团高层',
                    '10201102': '物业-市场-总经理',
                    '10201103': '物业-市场-副总经理',
                    '10201104': '物业-市场-总监',
                    '10201105': '物业-市场-经理',
                    '10201106': '物业-市场-主管',
                    '10201107': '物业-市场-职员',
                    '10202101': '物业-专业-集团高层',
                    '10202102': '物业-专业-总经理',
                    '10202103': '物业-专业-副总经理',
                    '10202104': '物业-专业-总监',
                    '10202105': '物业-专业-经理',
                    '10202106': '物业-专业-主管',
                    '10202107': '物业-专业-职员',
                    '10203101': '物业-互联网-集团高层',
                    '10203102': '物业-互联网-总经理',
                    '10203103': '物业-互联网-副总经理',
                    '10203104': '物业-互联网-总监',
                    '10203105': '物业-互联网-经理',
                    '10203106': '物业-互联网-主管',
                    '10203107': '物业-互联网-职员',
                    '10204101': '物业-操作-职员',
                    '10205101': '物业-储备-职员',
                    '60000000': '物业-储备-总监',
                    '60000001': '物业-储备-经理',
                    '60000002': '物业-储备-主管'
                };
            },
            findObj: function (array, key) {
                if (key || key > -1) {
                    for (var i = 0; i < array.length; i++) {
                        if (key === array[i].value) {
                            return array[i];
                        }
                    }
                }
                return null;
            },
            findObjText: function (array, key) {
                if (!this.findObj(array, key)) {
                    return "";
                }
                return this.findObj(array, key).text;
            },
            findItem: function (array, columnName, key) {
                if (key || key > -1) {
                    for (var i = 0; i < array.length; i++) {
                        if (key === array[i][columnName]) {
                            return array[i];
                        }
                    }
                }
                return null;
            },
            findItems: function (array, columnName, keys) {
                var items = [];
                if (keys) {
                    for (var j = 0; j < keys.length; j++) {
                        for (var i = 0; i < array.length; i++) {
                            if (keys[j] === array[i][columnName]) {
                                items.push(array[i]);
                            }
                        }
                    }
                }
                return items;
            },
            mergeValues: function (array, columnName) {
                var values = [];
                angular.forEach(array, function (item) {
                    values.push(item[columnName]);
                });
                return values;
            },
            selectWorkJobs: function (workDepartments, workDepartment, $event) {
                var departmentId = workDepartment.departmentId,
                    target = $event.target,
                    modelTmp = '';
                angular.forEach(workDepartments, function (item, $index) {
                    if (item.departmentId == departmentId) {
                        indexSelectWorkJob = $index;
                        modelTmp = workDepartments[$index].workJobs || [];
                    }
                });
                $(target).parents(".vk-spaced-row").siblings().removeClass("hide");
                return modelTmp;
            },
            saveWorkJobs: function ($event, workDepartments, workJobs) {
                var target = $event.target,
                    index = $($event.target.closest("tr")).index(),
                    selectedLi = $(".work-job").find("ul").eq(index).find("li.selected");
                workDepartments[indexSelectWorkJob].workJobs = [];
                for (var i = 0; i < selectedLi.length; i++) {
                    var index = $($(selectedLi)[i].outerHTML).attr("data-original-index");
                    workDepartments[indexSelectWorkJob].workJobs.push(workJobs[index]);
                }
                $(target).parents(".vk-spaced-row").addClass("hide");
            },
            cancelWorkJobs: function ($event) {
                var target = $event.target;
                $(target).parents(".vk-spaced-row").addClass("hide");
            },
            watchWorkDepartments: function (workDepartments, workDepartment) {
                var newWorkDepartments = [];
                for (var j = 0; j < workDepartment.length; j++) {
                    for (var i = 0; i < workDepartments.length; i++) {
                        if (workDepartment[j].department_id && workDepartments[i] && workDepartments[i].departmentId && workDepartment[j].department_id == workDepartments[i].departmentId) {
                            newWorkDepartments.push({
                                "departmentId": workDepartment[j].department_id,
                                "departmentName": workDepartment[j].department_name,
                                "workJobs": workDepartments[i].workJobs,
                                "workJobIds": workDepartments[i].workJobIds
                            });
                            break;
                        } else if (workDepartment[j].department_id) {
                            newWorkDepartments.push({
                                "departmentId": workDepartment[j].department_id,
                                "departmentName": workDepartment[j].department_name,
                                "workJobs": [],
                                "workJobIds": []
                            });
                            break;
                        } else if (!workDepartment[j].department_id && workDepartments[i].departmentId) {
                            break;
                        }
                    }
                }
                return newWorkDepartments;
            },
            regDomicileChecker: function () {
                var domicile;
                if (!$("#sapDomicile").val() && !$("#domicile-province option:selected").val()) {
                    domicile = true;
                } else if (!$("#domicile-province option:selected").val() || !$("#domicile-city option:selected").val() || !$("#domicile-county option:selected").val()) {
                    domicile = true;
                } else {
                    domicile = false;
                }
                return domicile;
            },
            regFamilyInformationsChecker: function (familyInformations) {
                var info = familyInformations, familyInformationInvalid, fmob;
                familyInformationInvalid = false;
                for (var i = 0; i < info.length; i++) {
                    fmob = info[i].familiesMobile;
                    if (info[i].familiesName || fmob || info[i].relationship) {
                        if (!(info[i].familiesName && fmob && info[i].relationship)) {
                            familyInformationInvalid = true;
                            break;
                        } else {
                            //var reg = /^((1[3|4|5|7|8]\d{9}|\-|\(\)\+)+)|(0(((10|2[0-5|7-9])\-{0,1}\d{8})|[3-9][0-9]{2}\-{0,1}\d{7,8}))$/;
                            var reg = /(^0\d{9,11}$)|(^1\d{10}$)/;
                            if (fmob && !reg.test(fmob)) {
                                familyInformationInvalid = true;
                                break;
                            }
                        }
                    }
                }
                return familyInformationInvalid;
            },
            regEducationExperiencesChecker: function (educationExperiences) {
                var info = educationExperiences, educationExperienceInvalid;
                educationExperienceInvalid = false;
                for (var i = 0; i < info.length; i++) {
                    if (info[i].educationStartTime || info[i].educationEndTime || info[i].educationSchool || info[i].educationDegree) {
                        if (!(info[i].educationStartTime && info[i].educationEndTime && info[i].educationSchool && info[i].educationDegree)) {
                            educationExperienceInvalid = true;
                            break;
                        }
                    }
                }
                return educationExperienceInvalid;
            },
            regIdTypeChecker: function (idNumber, idType) {
                if (idNumber) {
                    var optionVal = idType;
                    var reg = /^\S/, optionTag = idNumber.toUpperCase();
                    if (optionVal == "01") {  //居民身份证
                        reg = /^[1-9]\d{5}((19|20)[0-9]{2})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                    } else if (optionVal == "02") {  //护照
                        reg = /^[G|P|S|D]\d{8}$/;
                    } else if (optionVal == "Z3") {  //港澳通行证
                        reg = /^[C|G]\d{8}&/;
                    } else if (optionVal == "Z5") {  //香港身份证
                        reg = /^[A-Za-z]\d{6}\(\d\)$/;
                    } else if (optionVal == "ZA") {  //台胞证
                        reg = /^\d{8,10}(\([A-Za-z]\)){0,1}$/;
                    }
                    return !reg.test(optionTag);
                } else {
                    return true;
                }
            },
            adjustJobLevelChecker: function (index, jobLevel, jobLevels, experienceValue) {
                var invalid = false;
                if (index < 0) {
                    invalid = false;
                } else if (index >= 0 && jobLevels && Number(experienceValue) >= jobLevels[index].experienceValueBegin && Number(experienceValue) <= jobLevels[index].experienceValueEnd) {
                    invalid = false;
                } else if (index == 0 && jobLevels && Number(experienceValue) < jobLevels[0].experienceValueBegin) {
                    invalid = false;
                } else if (index == jobLevels.length - 1 && jobLevels && Number(experienceValue) > jobLevels[0].experienceValueEnd) {
                    invalid = false;
                } else if (index >= 0) {
                    invalid = true;
                }
                return invalid;
            },
            transferDate: function (entryDate) {
                if (null != entryDate) {
                    var dataArr = entryDate.split("/"),
                        newDate;
                    return newDate = dataArr[2] + "/" + dataArr[0] + "/" + dataArr[1];
                }
                return newDate;
            },
            transferToDate: function (entryDate) {
                if (null != entryDate && "" != entryDate) {
                    var dataArr = entryDate.split("/"),
                        newDate;
                    return newDate = dataArr[2] + "年" + (dataArr[0] < 10 ? ('0' + dataArr[0]) : dataArr[0]) + "月" + (dataArr[1] < 10 ? ('0' + dataArr[1]) : dataArr[1]) + "日";
                }
                return newDate;
            }
        };
    }]);
})(window);