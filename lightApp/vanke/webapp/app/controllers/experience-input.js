/**
 * Created by deepsky on 2016/11/15.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('ExperienceInputController', ExperienceInputController);

    ExperienceInputController.$inject = ['$scope', '$http', 'CommonService', '$timeout', 'ExperienceInputService'];

    function ExperienceInputController($scope, $http, commonService, $timeout, ExperienceInputService) {
        var exi = this;
        exi.delPerson = delPerson;
        exi.addPerson = addPerson;
        exi.addMoreFiles = addMoreFiles;
        exi.delFile = delFile;
        exi.save = save;

        $scope.topbarRight = true;
        $('.top-bar-right').append($(".operation-buttons"));
        $scope.commonSearchBarConfig = {
            isCompanySelectpickerMultiple: false,
            isDepartmentSelectpickerMultipe: false,
            isEmployeeSapSelectpickerMultipe: false,
            isStandardWorkJobsOneMultipe: false
        };
        // $scope.isEmployeeSapSelectpickerMultipe = true;
        init();
        $scope.$on('selectpicker-loaded', function () {
            $("#selected-standardWorkJobs-one").on("changed.bs.select", function () {
                exi.showNames = [];
                var jobId = $scope.selectedStandardWorkJobs && $scope.selectedStandardWorkJobs[0].workJobId;
                jobId && ExperienceInputService
                    .getOneLevelTarget(jobId)
                    .then(function (response) {
                        exi.OneLevelTarget = response.targetTypes;
                        $timeout(function () {
                            $('#targetModelOne').selectpicker('refresh');
                        }, 2);
                    })
            });
        });
        function init() {
            $timeout(function () {
                $('.selectpicker').selectpicker();
            }, 0);
            exi.showNames = [];
            exi.targetOne = null;
            exi.targetTwo = null;
            $scope.uploadsFiles = []
            $scope.isShowTargetTwo = false;
            $scope.isShowTargetThree = false;
            $scope.isShowSituation = false;
            exi.expValue = 0;
            exi.targetParams = {
                oneLevelNumber: '',
                twoLevelNumber: '',
                threeLevelNumber: ''
            };
            exi.initFiles = [
                {id: 1, isUpload: false, loadingState: false},
                {id: 2, isUpload: false, loadingState: false},
                {id: 3, isUpload: false, loadingState: false}
            ];
        }

        $('#targetModelOne').on('changed.bs.select', function (e) {
            if (exi.targetOne) {
                ExperienceInputService
                    .getTwoLevelTarget(exi.targetOne.targetNumber)
                    .then(function (response) {
                        exi.TwoLevelTarget = response.targetTypes;
                        exi.targetParams.oneLevelNumber = exi.targetOne.targetNumber;
                        if (exi.TwoLevelTarget == null) {
                            getExperienceValue(exi.targetParams)
                            $scope.isShowTargetTwo = false;
                            $scope.isShowTargetThree = false;
                            exi.targetParams.twoLevelNumber = '';
                            exi.targetParams.threeLevelNumber = '';

                        } else {
                            exi.targetTwo = null;
                            $scope.isShowTargetTwo = true;
                            $scope.isShowSituation = false;
                            exi.expValue = 0;
                            $timeout(function () {
                                $('#targetModelTwo').selectpicker('refresh');
                            }, 2);


                        }

                    })
            } else {
                $scope.$apply(function () {
                    $scope.isShowTargetTwo = false;
                    $scope.isShowTargetThree = false;
                    $scope.isShowSituation = false;
                    exi.expValue = 0;
                })

            }
        });

        $('#targetModelTwo').on('changed.bs.select', function (e) {
            if (exi.targetTwo) {
                ExperienceInputService
                    .getThreeLevelTarget(exi.targetTwo.targetNumber)
                    .then(function (response) {
                        exi.ThreeLevelTarget = response.targetTypes;
                        exi.targetParams.twoLevelNumber = exi.targetTwo.targetNumber;
                        if (response.targetTypes == null) {
                            getExperienceValue(exi.targetParams)
                            $scope.isShowTargetThree = false;
                        } else {
                            exi.targetThree = exi.ThreeLevelTarget[0];
                            $scope.isShowTargetThree = true;
                            $timeout(function () {
                                $("#targetModelThree").selectpicker('refresh');
                            }, 2);

                        }
                    })
            } else {
                $scope.$apply(function () {
                    $scope.isShowTargetThree = false;
                    $scope.isShowSituation = false;
                    exi.expValue = 0;
                })
            }
        });

        $scope.$watch('exi.targetThree', function (v) {
            if (v) {
                exi.targetParams.threeLevelNumber = v.targetNumber;
                getExperienceValue(exi.targetParams);
            }
        });

        function getExperienceValue(params) {
            ExperienceInputService
                .getExperienceFromTarget(params)
                .then(function (response) {
                    $scope.situations = response.situations;
                    exi.situation = $scope.situations[0];
                    $scope.isShowSituation = true;
                    $timeout(function () {
                        $("#situationModel").selectpicker('refresh');
                    }, 2);
                })
        }

        $scope.$watch('exi.situation', function (v) {
            if (v) {
                exi.expValue = v.expValue;
            }
        })


        function delPerson(index) {
            exi.showNames.splice(index, 1);
        }

        function addPerson() {
            var flag = false;
            if (!$scope.selectedEmployeeSap || $scope.selectedEmployeeSap.length == 0) {
                commonService.alert({
                    content: '请选择人员！',
                    icon: "fa-exclamation-circle"
                });
                return false;
            }
            if (!$scope.selectedStandardWorkJobs || !$scope.selectedStandardWorkJobs.length) {
                commonService.alert({
                    content: "请选择标准职位"
                });
                return;
            }
            if (exi.showNames.length == 0) {
                exi.showNames.push($scope.selectedEmployeeSap[0])
            } else {
                for (var i = 0; i < exi.showNames.length; i++) {
                    if (exi.showNames[i].employeeId == $scope.selectedEmployeeSap[0].employeeId) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    exi.showNames.push($scope.selectedEmployeeSap[0])
                }
            }
        }

        function addMoreFiles() {
            if (exi.initFiles.length == 10) {
                commonService.alert({
                    content: '最多只能添加10个附件!',
                    icon: 'fa-exclamation-circle'
                });
                return false;
            }
            var ids = exi.initFiles[exi.initFiles.length - 1].id;
            exi.initFiles.push({
                id: ids + 1,
                isUpload: false
            })
        }

        $scope.uploads = function (item) {
            var self = item;
            if (self.files[0].type.indexOf('image/') == '-1') {
                commonService.alert({
                    content: '附件只能上传JPGE，JPG，PNG，GIF格式图片!',
                    icon: 'fa-exclamation-circle'
                });
                return false;
            }
            $scope.$apply(function () {
                exi.initFiles[self.id].loadingState = true;
            })
            var formData = new FormData();
            formData.append("file", document.getElementById(self.id).files[0]);
            $.ajax({
                url: baseUrl + '/file/saveFile',
                type: 'POST',
                data: formData,
                processData: false,  // 告诉jQuery不要去处理发送的数据
                contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
                success: function (response) {
                    var result = JSON.parse(response)
                    $scope.uploadsFiles.push(self.id + '@' + result.fileUrl);
                    $timeout(function () {
                        $scope.$apply(function () {
                            exi.initFiles[self.id].isUpload = true;
                            exi.initFiles[self.id].loadingState = false;
                            exi.initFiles[self.id].name = self.files[0].name;
                        })
                    }, 1000)
                },
                error: function (res) {
                    commonService.alert({
                        content: '网络可能有问题，请检查网络连接',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                }
            });


        }

        function delFile(index) {
            exi.initFiles[index].isUpload = false;
            var delFlag = null;
            angular.forEach($scope.uploadsFiles, function (item, key) {
                if (item.indexOf(index + '@') != -1) {
                    delFlag = key
                }
            });
            $scope.uploadsFiles.splice(delFlag, 1);

        }

        function save() {
            if (validaSave()) {
                return false;
            }
            var saveParams = {}
            saveParams.files = filterUploadsFiles($scope.uploadsFiles);
            angular.extend(saveParams, exi.targetParams);
            saveParams.employeeIds = [];
            angular.forEach(exi.showNames, function (item) {
                saveParams.employeeIds.push(item.employeeId);
            })
            saveParams.situationId = parseInt(exi.situation.situationId);
            commonService.confirm({
                content: '提交后将无法撤回或更改，是否提交审核？',
                callback: function () {
                    $http.post(apiBaseUrl + "/experience-setting", saveParams, {
                        headers: utils.generateHeaders()
                    })
                        .success(function (response) {
                            if (response.status == 'success') {
                                commonService.alert({
                                    content: '保存成功!',
                                    icon: "fa-exclamation-circle",
                                });
                                init();
                            } else {
                                commonService.alert({
                                    content: response.errorMessage,
                                    icon: 'fa-exclamation-circle'
                                });
                            }
                        })
                        .error(function (response) {
                            commonService.alert({
                                content: '网络可能有问题，请检查网络连接',
                                icon: "fa-exclamation-circle",
                                iconColor: "icon-red"
                            });
                        });
                },
                cancel: function () {

                }
            });
        }

        function filterUploadsFiles(item) {
            var result = []
            angular.forEach(item, function (obj) {
                result.push(obj.split('@')[1]);
            })
            return result;
        }

        function validaSave() {
            if (exi.showNames.length == 0) {
                alertText('人员')
                return true
            } else if (exi.targetOne == null) {
                alertText('指标')
                return true
            } else if (exi.targetOne && $scope.isShowTargetTwo && exi.targetTwo == null) {
                alertText('指标')
                return true
            } else if ($scope.uploadsFiles.length == 0) {
                alertText('附件')
                return true
            }
        }

        function alertText(txt) {
            commonService.alert({
                content: '录入信息不完整,请检查完善后再提交审核!（请添加' + txt + ')',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        }
    }

})();
