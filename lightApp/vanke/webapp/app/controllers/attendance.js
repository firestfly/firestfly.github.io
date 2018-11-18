/**
 * Modified by ushio on 2017/11/10.
 */
'use strict';

VkrmsApp.controller('AttendanceController', ['$scope', '$rootScope', '$http', 'DataTableService', 'CommonService', '$location', 'AttendanceService', 'SignInAreaTaskservice', '$timeout', '$filter', 'AttendanceFillService', function ($scope, $rootScope, $http, dataTableFactory, commonService, $location, attendanceService, signInAreaTaskservice, $timeout, $filter, attendanceFillService) {
    $scope.title = "万科资源管理信息系统 - 出勤表";
    $(".selectpicker").selectpicker();
    $scope.showValidArea = true;
    $scope.showAttendanceType = true;
    $scope.showIsAttendanceTime = true;
    $scope.showSwitchTableOrMap = true;
    $scope.switchTableOrMapValue = "0";
    var switchTableSelected = $scope.switchTableOrMapValue == "0", //是否选择表格
        switchMapSelected = $scope.switchTableOrMapValue == "1", //是否选择地图
        config = attendanceService.getConfigurationByType($location.path()),
        map,
        calcCenterLng,
        calcCenterLat,
        mapAreas, //签到区域
        attendanceDetails, //重新组装的出勤数组
        imgPath = window.location.href.split("/home#/")[0],
        approvalDetailCache = {};
    config.isNewAttendance = location.hash.indexOf("new-") >= 0;
    var tableName = "attendance-table";

    $scope.toNewttendanceFill = config.isNewAttendance ? "new-" : "";
    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false,
        isDepartmentSelectpickerMultipe: false
    };
    $scope.shortSelect = true;
    $scope.search = search;
    init();

    $scope.export = exportExcel;

    function exportExcel() {
        var url, data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "beginDate": $filter('date')($('input[name=start]').datepicker('getDate'), 'MM/dd/yyyy'),
            "endDate": $filter('date')($('input[name=end]').datepicker('getDate'), 'MM/dd/yyyy')
        };
        if (data.departments.length == 0) {
            commonService.alert({
                content: '请选择部门',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return false
        } else if (!data.beginDate) {
            commonService.alert({
                content: '请选择导出开始时间',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return false
        }
        url = baseUrl + "/file/attendance-abnormal-exporting";
        commonService.downloadFile(url, data);
    }

    function init() {
        $scope.$on('selectpicker-loaded', function () {
            var settings = attendanceService.dataTableConfig();
            if (location.hash.indexOf("sign-in-check") >= 0) {
                settings.columns.pop();
                settings.columnDefs.pop();
            }
            dataTableFactory.initDataTable(tableName, settings, getParams());
            dealDatatableAjaxLoading();
            listenEvent();
        });
        watchChange();
        getImportAttendanceRes();
    }

    function dealDatatableAjaxLoading() {
        $timeout(function () {
            window.dataTable.on('xhr', function () {
                $timeout(function () {
                    $rootScope.loading = false;
                }, 0);
                var json = window.dataTable.ajax.json();
                if (json) {
                    initNewArray(json.data);
                }
            });
            $(document).ajaxStart(function () {
                $rootScope.loading = true;
            });
        }, 0);
    }

    function getImportAttendanceRes() {
        $http.get(apiBaseUrl + "/import-attendance-result").success(function (result) {
            var messageToShow = "",
                returnMessage;
            if (result) {
                for (var i = 0; i < result.length; i++) {
                    returnMessage = result[i].resultMessage;
                    messageToShow += returnMessage + "<br/>"
                }
                if ($.trim(messageToShow !== '')) {
                    commonService.alert({
                        content: messageToShow,
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });

                }
            }
        });
    }

    function getParams() {
        if (!$scope.selectedDepartments || $scope.selectedDepartments.length < 1) {
            return false;
        }
        var params = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "isValidArea": $scope.isValidArea || null,
            "attendanceType": $scope.attendanceType || null,
            "isAttendanceTime": $scope.isAttendanceTime || null,
            "keywords": $scope.keywords,
            "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
            "switchTableOrMapValue": $scope.switchTableOrMapValue
        };
        var selectedDates;
        if ($scope.switchTableOrMapValue == 0) {
            selectedDates = commonService.getSelectedDates();
            params.beginDate = selectedDates.beginDate;
            params.endDate = selectedDates.endDate;
        } else {
            params.beginDate = utils.transferDateTo($scope.selectedDate);
            params.endDate = params.beginDate;
        }
        return params;
    }

    function search() {
        var defaultSetting = {
            selectedCompanies: $scope.selectedCompanies,
            departments: $scope.departments,
            selectedDepartments: $scope.selectedDepartments
        };

        sessionStorage["searchState_" + '#/new-attendance-fill'] = JSON.stringify(defaultSetting);

        if (!$scope.selectedDepartments || $scope.selectedDepartments.length < 1) {
            commonService.alert({
                content: "请选择查询部门",
                icon: "fa-exclamation-circle"
            });
            return false;
        }
        var params = getParams();
        if (params.beginDate == null || params.endDate == null) {
            commonService.alert({
                content: "日期不能为空",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }
        $rootScope.loading = true;
        dealDatatableAjaxLoading();
        if (switchMapSelected) {
            // 加载地图
            // 使用原来的前端分页加载方式
            loadAttendances(params);
        } else {
            // 加载表格
            // 使用后端分页的方式
            loadGridAttendances(params);
        }
        commonService.storageSearchStatus($scope);
    }

    // 加载签到列表
    function loadGridAttendances(condition) {
        dataTableFactory.dataTableSearch(tableName, condition);
    }


    function watchChange() {
        $scope.$watch('switchTableOrMapValue', function () {
            $scope.attendanceDetails = [];
            switchTableSelected = $scope.switchTableOrMapValue == "0";
            switchMapSelected = $scope.switchTableOrMapValue == "1";
            $scope.showOnlyOneDay = switchMapSelected;
            $scope.hideDateRange = switchMapSelected;
        });
        $scope.$watch('window.dataTable.page.info().length', function () {
            $rootScope.loading = true;
        });
    }

    function listenEvent() {
        $('#importAttendanceExcelFile').fileinput({
            language: 'zh',
            allowedFileExtensions: ['xls', 'xlsx']
        });

        $('#txtAdd').click(function () {
            $("input[name='type']").val(['add']);
        });

        $('#txtDel').click(function () {
            $("input[name='type']").val(['delete']);
        });

        $('#importAttendanceForm').submit(function () {
            var type = $("input[name='type']:checked").val();
            if (type == undefined) {
                commonService.alert({
                    content: '请选择新增或删除出勤',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return false;
            }
        });
        $('#attendance-table').on('page.dt', function () {
            $timeout(function () {
                $rootScope.loading = true;
            }, 0);
        });
        $(document)
            .off("click", "#attendance-table a.attendanceDetail")
            .off("click", "#attendance-table a.openAttendanceFill")
            .off("click", "#attendance-table a.approvalDetail");
        $(document).on("click", "#attendance-table a.openAttendanceFill", function () {
            var id = $(this).data("id"),
                name = $(this).data("name");
            attendanceService.openAttendanceFillDialog(id, name);
        });
        $(document).on("click", "#attendance-table a.attendanceDetail", function (event) {
            var attendanceDetailId = $(event.target).closest("tr").find("a").attr("data-id"),
                attendanceDetailDate = $(event.target).closest("tr").find("a").attr("data-date"),
                operationType, isValidArea, attendanceType, indexSelected;
            var departmentId = _.pluck($scope.selectedDepartments, 'department_id');
            attendanceFillService.getOnlineRmTime(departmentId[0]).then(function (result) {
                if (result && result > attendanceDetailDate) {
                    commonService.alert({
                        content: "该项目" + utils.transferDateToCN(result, "-") + "上线RM，之前日期无法校正签到区域",
                        icon: "fa-exclamation-circle"
                    });
                } else {
                    for (var i = 0; i < $scope.attendanceDetails.length; i++) {
                        if ($scope.attendanceDetails[i].attendanceDetailId == attendanceDetailId) {
                            operationType = $scope.attendanceDetails[i].operationType;
                            isValidArea = $scope.attendanceDetails[i].isValidArea;
                            attendanceType = $scope.attendanceDetails[i].attendanceType;
                            indexSelected = i;
                        }
                    }
                    if (isValidArea == "是") {
                        return;
                    } else {
                        switch (operationType) {
                            case "0":
                                $scope.adjustTitle = "校正";
                                break;
                            case "1":
                                $scope.adjustTitle = "取消校正";
                                break;
                            case "2":
                                $scope.adjustTitle = "校正详情";
                                break;
                            default :
                                break;
                        }
                    }
                    sessionStorage.setItem("currentAttendanceDetailId", attendanceDetailId);
                    var adjustTitle = $scope.adjustTitle.replace(/[^\u4e00-\u9fa5]/gi, "");
                    // var adjustTitle = getData(indexSelected, 15).replace(/[^\u4e00-\u9fa5]/gi, "");
                    sessionStorage.setItem("adjustTitle", adjustTitle);
                    sessionStorage.setItem("indexSelected", indexSelected);
                    attendanceService.openAddDialog(config.api, config.authorityUrl, config.configUrl, config.dto, config.isNewAttendance);
                }
            });
            return false;
        });
        // 增加查看拍照打卡审核详情
        $(document).on("click", "#attendance-table a.approvalDetail", function (event) {
            var attendanceDetailId = $(this).attr("data-id");
            if (approvalDetailCache[attendanceDetailId]) {
                openApprovalDetailModel(approvalDetailCache[attendanceDetailId]);
            } else {
                attendanceService.getPhotoSignApprovalDetail({
                    id: attendanceDetailId
                }).then(function (res) {
                    approvalDetailCache[attendanceDetailId] = res.data;
                    openApprovalDetailModel(approvalDetailCache[attendanceDetailId]);
                }).catch(function (res) {
                    commonService.alert({
                        content: res.errorMessage,
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    })
                });
            }
        })
    }

    function openApprovalDetailModel(data) {
        commonService.createModal({
            'templateUrl': 'approval-detail-modal.html',
            'controller': 'approvalDetailModalController',
            'resolve': {
                'data': function () {
                    return data
                }
            }
        })
    }

    function loadAttendances(param) {
        var newParam = {
            "search[value]": JSON.stringify(param)
        };
        $http({
            url: apiBaseUrl + '/attendances',
            method: 'POST',
            data: $.param(newParam),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            initNewArray(data.data);
        }).error(function () {
            commonService.alert({
                content: "获取出勤记录失败，请重试",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        });
    }

    function initNewArray(data) {
        if (switchTableSelected && (data == null || data.length < 0)) {
            return;
        }

        $scope.attendanceDetails = [];
        var isValid, attendanceType;
        for (var i = 0; i < data.length; i++) {
            $scope.attendanceDetails[i] = {
                employeeName: data[i][2],
                employeeId: data[i][0],
                sapId: data[i][1],
                company: data[i][3],
                department: data[i][4],
                workGroup: data[i][5],
                postName: data[i][6],
                attendanceDetailId: data[i][7],
                attendanceDateTime: data[i][8].substring(0, data[i][8].length - 2),
                attendanceAddress: data[i][9],
                isAttendanceTime: data[i][12] == "1" ? "是" : "否",
                attendanceLongitude: data[i][10],
                attendanceLatitude: data[i][11],
                operationType: data[i][15]
            };

            switch (data[i][13]) {
                case '0':
                    isValid = '否';
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                    isValid = '是';
                    break;
                default:
                    isValid = '是';
                    break;
            }
            $scope.attendanceDetails[i].isValidArea = isValid;

            switch (data[i][14]) {
                case '0':
                    attendanceType = '助这儿GPS签到';
                    break;
                case '1':
                    attendanceType = '手动校正';
                    break;
                case '2':
                    attendanceType = '手动补签';
                    break;
                case '3':
                    attendanceType = '系统补签到';
                    break;
                case '4':
                    attendanceType = '助这儿WIFI签到';
                    break;
                case '5':
                    attendanceType = '拍照打卡';
                    break;
                default :
                    break;
            }
            $scope.attendanceDetails[i].attendanceType = attendanceType;
        }
        for (var i = 0; i < $scope.attendanceDetails.length; i++) {
            var isValidArea = $scope.attendanceDetails[i].isValidArea;
            if (isValidArea == "是" || data[i][13] == '3' || data[i][13] == '4') {
                $scope.attendanceDetails[i].edit = '--';
            } else if (data[i][13] == '2') {
                $scope.attendanceDetails[i].edit = '<a href="javascript:;" class="openAttendanceFill" data-id="' +
                    $scope.attendanceDetails[i].attendanceDetailId +
                    '" data-name="' + $scope.attendanceDetails[i].employeeName +
                    '">补签详情</a>';
            } else {
                var edit;
                switch ($scope.attendanceDetails[i].operationType) {
                    case "0":
                        edit = "校正";
                        break;
                    case "1":
                        edit = "取消校正";
                        break;
                    case "2":
                        edit = "校正详情";
                        break;
                    default :
                        break;
                }
                $scope.attendanceDetails[i].edit = '<a href="javascript:;" class="attendanceDetail" data-id="' +
                    $scope.attendanceDetails[i].attendanceDetailId +
                    '" data-date="' +
                    $scope.attendanceDetails[i].attendanceDateTime.split(" ")[0] +
                    '">' + edit + '</a>'; //ng-click="openDialog()"
            }
        }

        if (switchMapSelected) {
            getDepartment();
        }

        // if (switchMapSelected) {
        //     getDepartment();
        // } else if (switchTableSelected) {
        //     initAttendanceTable();
        // }
    }

    function getData(row, col) {
        // var data = dataTable.data(row, col).data();
        var data = window.dataTable.data()[row][col];
        return data == "-" ? "" : data;
    }


    function getDepartment() {
        attendanceDetails = $scope.attendanceDetails;
        var height = $(window).height() - 250 + "px";
        $("#map").css({
            "wdith": "100%",
            "height": height
        });
        getOverlaies(); //获取项目考勤区域
    }

    function tilesloaded() {
        addOverlay(); //添加绘制区域
        addEmployeeMarker(attendanceDetails); //增加人员标识
        addPlaceMarker(); //增加地点标识
    }

    function getMapCenter() {
        var lnglatarr = [];
        if (mapAreas != null && mapAreas != "" && mapAreas.mapPoints.length > 0) { //计算绘制区域中心点
            var mapVertexs = mapAreas.mapPoints;
            for (var i = 0; i < mapVertexs.length; i++) {
                for (var j = 0; j < mapVertexs[i].length; j++) {
                    lnglatarr.push(mapVertexs[i][j]);
                }
            }
            calculateCenter(lnglatarr);
        } else {
            loadMap();
            tilesloaded();
            // map.addEventListener('tilesloaded', tilesloaded); //监听地图加载完成事件
        }

    }

    function loadMap() {
        var point,
            myPositionLng = calcCenterLng || 114.067477,
            myPositionLat = calcCenterLat || 22.546245;
        map = new BMap.Map('map', {
            enableMapClick: false
        }, {
            vectorMapLevel: 99
        });
        point = new BMap.Point(myPositionLng, myPositionLat);
        map.centerAndZoom(point, 18);
        map.enableScrollWheelZoom(true);
    }

    function addOverlay() {
        if (mapAreas != null && mapAreas != "" && mapAreas.mapPoints != null && mapAreas.mapPoints.length > 0) {
            var mapPoints = mapAreas.mapPoints;
            for (var i = 0; i < mapPoints.length; i++) {
                var NewPoints = [],
                    everyPoints = "",
                    str = mapPoints[i];
                for (var j = 0; j < str.length; j++) {
                    everyPoints = new BMap.Point(Number(str[j].lng), Number(str[j].lat));
                    NewPoints.push(everyPoints);
                }
                var polygon = new BMap.Polygon(
                    NewPoints, {
                        strokeColor: "red",
                        strokeWeight: "2",
                        strokeOpacity: "0.5",
                        fillOpacity: 0.0,
                        fillColor: "none"
                    }
                );
                map.addOverlay(polygon);
            }
        } else { //没有绘制区域时获取当前位置
            geolocation();
        }
    }

    function getOverlaies() {
        var department = $scope.selectedDepartments;
        attendanceService.getOverlaies(department[0].department_id).then(function (data) {
            mapAreas = eval("(" + data.areas + ")");
            getMapCenter();
        });
    }

    //浏览器定位
    var isFirst = true;

    function geolocation() {
        if (!isFirst) {
            return;
        }
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            var mk;
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                if (calcCenterLng != null && calcCenterLat != null && !isNaN(calcCenterLng) && !isNaN(calcCenterLat)) {
                    mk = new BMap.Marker(calcCenterLng, calcCenterLat);
                } else {
                    mk = new BMap.Marker(r.point);
                }
                map.addOverlay(mk);
                map.panTo(r.point);
            } else {
                commonService.alert({
                    content: '定位失败请重试',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-green"
                });
            }
        }, {
            enableHighAccuracy: true
        });
        isFirst = false;
    }

    function calculateCenter(lnglatarr) {
        signInAreaTaskservice.calculateCenter(lnglatarr).then(function (data) {
            calcCenterLng = data[0];
            calcCenterLat = data[1];
            loadMap();
            tilesloaded();
            // map.addEventListener('tilesloaded', tilesloaded); //监听地图加载完成事件
        });
    }

    function addEmployeeMarker(attendanceDetails) {
        if (attendanceDetails == null || attendanceDetails.length == 0) {
            return;
        }
        var point, marker,
            myIcon1, myIcon2, myIcon3, myIcon4;
        myIcon1 = new BMap.Icon(imgPath + "/images/map-marker-1.png", new BMap.Size(20, 30));
        myIcon2 = new BMap.Icon(imgPath + "/images/map-marker-2.png", new BMap.Size(20, 30));
        myIcon3 = new BMap.Icon(imgPath + "/images/map-marker-3.png", new BMap.Size(20, 30));
        myIcon4 = new BMap.Icon(imgPath + "/images/map-marker-4.png", new BMap.Size(20, 30));

        for (var i = 0; i < attendanceDetails.length; i++) {
            point = new BMap.Point(attendanceDetails[i].attendanceLongitude, attendanceDetails[i].attendanceLatitude);
            marker = new BMap.Marker(point);
            if (attendanceDetails[i].isAttendanceTime == "是") { //考勤时间
                marker = new BMap.Marker(point, {
                    icon: myIcon4
                });
            } else if (attendanceDetails[i].isValidArea == "是") { //区域内
                marker = new BMap.Marker(point, {
                    icon: myIcon2
                });
            } else if (attendanceDetails[i].isValidArea == "否" && attendanceDetails[i].operationType == "1") { //手动校正
                marker = new BMap.Marker(point, {
                    icon: myIcon3
                });
            } else if (attendanceDetails[i].isValidArea == "否" && attendanceDetails[i].operationType != "1") { //区域外
                marker = new BMap.Marker(point, {
                    icon: myIcon1
                });
            }
            map.addOverlay(marker);
            var label = new BMap.Label("<div class='map-infoWin-lg'>" +
                "<div class='name'>姓名</div><div class='attr'>" + attendanceDetails[i].employeeName + "</div>" +
                "<div class='name'>职位</div><div class='attr'>" + attendanceDetails[i].postName + "</div>" +
                "<div class='name'>签到时间</div><div class='attr'>" + attendanceDetails[i].attendanceDateTime + "</div>" +
                "<div class='name'>签到地点</div><div class='attr'>" + attendanceDetails[i].attendanceAddress + "</div>" +
                "<div class='name'>有效区域内外</div><div class='attr'>" + attendanceDetails[i].isValidArea + "</div>" +
                "<div class='name'>是否考勤时间</div><div class='attr'>" + attendanceDetails[i].isAttendanceTime + "</div>" +
                "<div class='name'>签到类型</div><div class='attr'>" + attendanceDetails[i].attendanceType + "</div></div>", {
                offset: new BMap.Size(-150, -258)
            });
            marker.setLabel(label);
            label.setStyle({
                display: "none"
            });
            addClickHandler(marker, label);
        }
    }

    function addPlaceMarker() {
        attendanceService.getDepartmentMarkers($scope.selectedDepartments[0].department_id).then(function (data) {
            if (data == null || data.data.length == 0) {
                return;
            }
            var departmentMarkers = data.data;
            var point, marker,
                myIcon1, myIcon2, myIcon3;
            myIcon1 = new BMap.Icon(imgPath + "/images/map-place-1.png", new BMap.Size(33, 44));
            myIcon2 = new BMap.Icon(imgPath + "/images/map-place-2.png", new BMap.Size(33, 44));
            myIcon3 = new BMap.Icon(imgPath + "/images/map-place-3.png", new BMap.Size(33, 44));

            for (var i = 0; i < departmentMarkers.length; i++) {
                point = new BMap.Point(departmentMarkers[i][2], departmentMarkers[i][3]);
                marker = new BMap.Marker(point);
                switch (departmentMarkers[i][0]) {
                    case "01":
                    {
                        marker = new BMap.Marker(point, {
                            icon: myIcon1
                        });
                        break;
                    }
                    case "02":
                    {
                        marker = new BMap.Marker(point, {
                            icon: myIcon2
                        });
                        break;
                    }
                    case "03":
                    {
                        marker = new BMap.Marker(point, {icon: myIcon3});
                        break;
                    }
                    default :
                        break;
                }
                map.addOverlay(marker);
                var label = new BMap.Label("<div class='map-infoWin-sm'>" + departmentMarkers[i][1] + "</div>", {
                    offset: new BMap.Size(-40, -40)
                });
                marker.setLabel(label);
                label.setStyle({
                    "display": "none",
                    "word-wrap": "break-word",
                    "word-break": "break-all",
                    "white-space": "inherit"
                });
                addMouseHandler(marker, label);
            }
        });
    }

    function addMouseHandler(marker, label) {
        marker.addEventListener("mouseover", function () {
            label.setStyle({
                display: "block"
            });
        });
        marker.addEventListener("mouseout", function () {
            label.setStyle({
                display: "none"
            });
        });
    }

    function addClickHandler(marker, label) {
        marker.addEventListener("click", function () {
            label.setStyle({
                display: "block"
            });
            marker.addEventListener("mouseout", function () {
                setTimeout(function () {
                    label.setStyle({
                        display: "none"
                    });
                }, 300);
            });
        });
    }

}]);
VkrmsApp.controller('AttendanceFillViewController', ['$scope', '$http', '$modalInstance', 'api', 'dto', 'CommonService', 'AttendanceService', function ($scope, $http, $modalInstance, api, dto, commonService, attendanceService) {
    attendanceService.checkAttendanceFillInfo(api).then(function (result) {
        $scope.attendanceFillViewData = result || {};
        $scope.attendanceFillViewData.name = dto;
    });
    $scope.ok = function () {
        $modalInstance.dismiss();
    };
}]);

VkrmsApp.controller('AdjustAttendanceController', ['$scope', '$http', '$modalInstance', 'api', 'dto', 'CommonService', 'isNewAttendance', function ($scope, $http, $modalInstance, api, dto, commonService, isNewAttendance) {
    var adjustTitle = sessionStorage.getItem("adjustTitle");
    $scope.showAttendanceAdjustCommon = !(adjustTitle == "校正详情");

    var attendanceDetailId = sessionStorage.getItem("currentAttendanceDetailId");
    $scope.adjustTitle = sessionStorage.getItem("adjustTitle");
    getAttendanceAdjustDetails();

    function getAttendanceAdjustDetails() {
        $http.post(apiBaseUrl + '/attendance-adjustHistory/' + attendanceDetailId)
            .success(function (result) {
                if (result.data && result.data.length > 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        result.data.adjustType = result.data.adjustType == "0" ? "校正" : "取消校正";
                    }
                    initAttendanceDetailTable(result.data);
                }
            });
    }

    function initAttendanceDetailTable(result) {
        $scope.attendanceAdjustDetails = [];
        for (var i = 0; i < result.length; i++) {
            $scope.attendanceAdjustDetails.push({});
            $scope.attendanceAdjustDetails[i].adjustId = result[i][0];
            $scope.attendanceAdjustDetails[i].adjustComment = result[i][1];
            $scope.attendanceAdjustDetails[i].adjustPersonName = result[i][2];
            $scope.attendanceAdjustDetails[i].adjustTime = result[i][3];
            $scope.attendanceAdjustDetails[i].adjustType = result[i][4] == "1" ? "取消校正" : "校正";
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };

    function setData(row, col, data) {
        dataTable.cell(row, col).data(data);
    }

    $scope.save = function () {
        var attendanceDetailId = sessionStorage.getItem("currentAttendanceDetailId"),
            indexSelected = sessionStorage.getItem("indexSelected"),
            attendanceAdjustCommon = $("textarea[name=attendanceAdjustCommon]").val() || "";
        if (attendanceAdjustCommon == "" || attendanceAdjustCommon.length > 100) {
            $scope.attendanceAdjustCommonInvalid = true;
            return;
        } else {
            $scope.attendanceAdjustCommonInvalid = false;
        }
        var postHttp = "",
            CommentData = {
                "adjustComment": attendanceAdjustCommon
            };
        if (adjustTitle == "校正") {
            postHttp = apiBaseUrl + '/attendances/' + (isNewAttendance ? 'new-' : '') + 'adjust/attendance-detail-id/';
        } else if (adjustTitle == "取消校正") {
            postHttp = apiBaseUrl + '/attendances/' + (isNewAttendance ? 'new-' : '') + 'cancel-adjust/attendance-detail-id/';
        }
        $http({
            url: postHttp + attendanceDetailId,
            method: 'Post',
            data: CommentData
        }).success(function (data, status) {
            $modalInstance.dismiss();
            if (status == 200 && data.status == "success") {
                $("textarea[name=attendanceAdjustCommon]").val("");
                if (adjustTitle == "校正") {
                    $scope.adjustTitle = "取消校正";
                } else if (adjustTitle == "取消校正") {
                    $scope.adjustTitle = "校正详情";
                    $scope.showAttendanceAdjustCommon = false;
                }
                sessionStorage.setItem("adjustTitle", $scope.adjustTitle);
                var edit = '<a data-id="' + attendanceDetailId + '" class="attendanceDetail">' + $scope.adjustTitle + '</a>';
                // setData(indexSelected, 12, edit);
                window.dataTable.ajax.reload();
            } else {
                commonService.alert({
                    content: data.errorMessage,
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-green"
                });
            }
        }).error(function () {
            commonService.alert({
                content: "保存失败，请重试",
                icon: "fa-exclamation-circle",
                iconColor: "icon-green"
            });
            $modalInstance.dismiss();
        });
    }
}]);

VkrmsApp.controller('approvalDetailModalController', ['$scope', '$http', '$modalInstance', 'CommonService', 'data', function ($scope, $http, $modalInstance, commonService, data) {
    $scope.data = data[0];
    $scope.ok = function () {
        $modalInstance.dismiss();
    };
}]);