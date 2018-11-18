/**
 * Created by wangq34 on 2016/7/19.
 */

(function () {
    'use strict';

    angular
        .module('rmMobile.wifi')
        .controller('WifiAddCtrl', WifiAddCtrl);

    WifiAddCtrl.$inject = ['$rootScope', 'WifiService', '$location', 'CommonService', '$scope'];

    function WifiAddCtrl($rootScope, WifiService, $location, CommonService, $scope) {
        var wa = this;

        wa.getSSID = getSSID;
        wa.save = save;
        wa.sigleSelect = sigleSelect;
        wa.fixedPostMultiselect = fixedPostMultiselect;
        wa.showFixedPostModal = showFixedPostModal;
        wa.fixedPostDeselect = fixedPostDeselect;
        wa.departmentSelected = departmentSelected;
        wa.numberPattern = '^[^:/]+$'; //^[\u4e00-\u9fa5_a-zA-Z0-9-]+$

        init();

        function init() {
            $rootScope.$broadcast('refreshNav', {
                title: '考勤Wi-Fi管理',
                showBack: true,
                showClose: false,
                backPage: '/'
            });
            CommonService.getAuthority().then(function (result) {
                wa.employeeInfo = result;
            });
            wa.fixedPostSelectedArray = [];
            wa.allowDepartmentSelect = true;
            wa.departmentModal = false;
            wa.fixedPostModal = false;

            //获取user的项目列表（$rootScope参见home.js定义）
            wa.departments = $rootScope.departments;
            wa.SSID = {};

            initPage();
        }

        function initPage() {
            if (isFromSearch($rootScope.wifiInfoFromSearch)) {
                isActive();
                checkThenJump(undefined);
            } else {
                getSSID();
            }
        }

        //判断是否是修改页面
        function isFromSearch(wifiInfo) {
            if (wifiInfo && !isEmptyObject(wifiInfo)) {
                wa.SSID.ssid = wifiInfo.ssid;
                wa.SSID.bssid = wifiInfo.bssid;
                $rootScope.wifiInfoFromSearch = {};
                return true;
            }
            return false;
        }

        //判断当前wifi
        function isActive() {
            if (wa.SSID && !isEmptyObject(wa.SSID)) {
                wa.activeWifi = (wa.SSID.bssid == window.SSID.bssid);
            } else {
                wa.SSID = window.SSID;
                wa.activeWifi = true;
            }
        }


        //判断bssid是否设置过
        function checkThenJump(department) {
            if (!isCorrectSSID()) {
                return;
            }
            WifiService.getWifiInfo({
                bssid: wa.SSID.bssid
            }).then(function (response) {
                if (response.status == "fail") {
                    CommonService.alert(response.errorMessage);
                    return;
                }
                if (response.id != null && !department) {
                    wa.wifiId = response.id;
                    wa.attendancePlace = response.attendancePlace;
                    wa.fixedPostSelectedArray = response.fixedPosts;
                    wa.allowDepartmentSelect = true;
                    wa.department = {
                        id: response.departmentId,
                        name: response.departmentName
                    };
                } else {
                    wa.department = department || $rootScope.departments[0];
                    clean();
                }
                $rootScope.department = wa.department;
                return WifiService.getFixedPosts(wa.department.id)
            })
                .then(function (response) {
                    wa.fixedPosts = response;
                    angular.forEach(wa.fixedPosts, function (fixedPost) {
                        angular.forEach(wa.fixedPostSelectedArray, function (fixedPostSelect) {
                            if (fixedPost.fixedPostId == fixedPostSelect.fixedPostId) {
                                fixedPost.selected = true;
                            }
                        })
                    });
                });
        }

        //从乐邦获取SSID
        function getSSID() {
            window
                .getSSID()
                .then(function () {
                    if (!isCorrectSSID()) {
                        CommonService.alert("无法获取wifi信息，请重新获取！" + "(ssid:" + window.SSID.ssid + ")" + "(bssid:" + window.SSID.bssid + ")");
                        wa.isShowWifiAdding = true;
                        return;
                    }
                    wa.SSID = window.SSID;
                    wa.SSID.activeWifi = true;
                    if (wa.SSID && wa.SSID.bssid) {
                        checkThenJump(undefined);
                        wa.isShowWifiAdding = false;
                    } else {
                        wa.isShowWifiAdding = true;
                    }
                }, function () {
                    wa.isShowWifiAdding = true;
                });
        }


        //保存
        function save() {
            if (!checkParams()) {
                return false;
            }
            var params = {
                attendancePlace: wa.attendancePlace,
                departmentId: wa.department.id,
                fixedPostIds: getFixedPostIds(),
                ssid: wa.SSID.ssid,
                bssid: wa.SSID.bssid
            };
            if (wa.wifiId) {
                params.id = wa.wifiId;
                WifiService
                    .updateWifiInfo(params)
                    .then(function (response) {
                        if (response.status == "fail") {
                            CommonService.alert(response.errorMessage);
                            return;
                        }
                        CommonService.alert("保存成功！");
                    });
            } else {
                WifiService
                    .saveWifiInfo(params)
                    .then(function (response) {
                        if (response.status == "fail") {
                            CommonService.alert(response.errorMessage);
                            return;
                        }
                        wa.wifiId = response.data;
                        CommonService.alert("保存成功！");
                    });
            }
        }

        function checkParams() {
            if (!wa.department.id || wa.department.id == "" || wa.department.id == null) {
                CommonService.alert("您没有项目权限，保存失败！");
                return false;
            }
            if (!$scope.myForm.attendancePlace.$valid) {
                CommonService.alert("考勤地点输入有误，请重新输入！");
                return false;
            }
            if (wa.attendancePlace == "" || wa.attendancePlace == null) {
                CommonService.alert("请输入考勤地点！");
                return false;
            }
            if (!isCorrectSSID()) {
                CommonService.alert("无法获取wifi信息，保存失败！");
                return false;
            }
            return true;
        }

        //项目单选事件
        function sigleSelect(obj) {
            angular.forEach(wa.departments, function (department) {
                department.selected = false;
            });
            obj.selected = true;
        }

        //固定岗位多选 确定按钮事件
        function fixedPostMultiselect() {
            wa.fixedPostSelectedArray = [];
            angular.forEach(wa.fixedPosts, function (fixedPost) {
                if (fixedPost.selected == true) {
                    wa.fixedPostSelectedArray.push(fixedPost);
                }
            });
            wa.fixedPostModal = !wa.fixedPostModal
        }

        //点击显示固定岗位modal
        function showFixedPostModal() {
            wa.fixedPostModal = (wa.fixedPosts.length > 0);
        }

        //删除固定岗位
        function fixedPostDeselect(obj) {
            wa.fixedPostSelectedArray.splice(wa.fixedPostSelectedArray.indexOf(obj), 1);
            angular.forEach(wa.fixedPosts, function (fixedPost) {
                if (obj.fixedPostId == fixedPost.fixedPostId) {
                    fixedPost.selected = false;
                }
            });
        }

        //部门选择事件
        function departmentSelected() {
            angular.forEach(wa.departments, function (department) {
                if (department.selected == true) {
                    wa.department = department;
                    $rootScope.department = department;
                    checkThenJump(department);
                }
            });
            wa.departmentModal = !wa.departmentModal;
        }

        //获取所有岗位地点的ID集合  用于传参
        function getFixedPostIds() {
            if (wa.fixedPostSelectedArray && !isEmptyObject(wa.fixedPostSelectedArray)) {
                return wa.fixedPostSelectedArray.map(function (fixedPost) {
                    return fixedPost.fixedPostId
                })
            }
            return [];
        }

        function clean() {
            wa.fixedPostSelectedArray = [];
            wa.attendancePlace = "";
        }

        function isCorrectSSID() {
            if (!(window.SSID && window.SSID.bssid && window.SSID.bssid.toString().indexOf(":") > -1 && window.SSID.bssid.toString().split(':').length == 6 && window.SSID.bssid != "00:00:00:00:00:00")) {
                return false;
            }
            return true;
        }

        function isEmptyObject(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        }

    }

})();
