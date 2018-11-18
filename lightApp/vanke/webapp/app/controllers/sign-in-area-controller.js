'use strict';

VkrmsApp.controller('SignInAreaController', ['$scope', '$http', '$routeParams', 'CommonService', 'SignInAreaTaskservice', function ($scope, $http, $routeParams, commonService, signInAreaTaskservice) {

    var departmentId,
        isNewProject = true,
        myPositionLng = 116.404068,     //默认经度
        myPositionLat = 39.914887,      //默认维度
        mapZoom = 17,
        myValue,                        //搜索关键字
        companyName,
        map,
        departmentAreas,                //绘制区域
        overlays = [],                  //绘制结果
        currentCity,
        calcCenterLng,
        calcCenterLat,//绘制区域中心点
        isFirst = true;   //浏览器定位

    //保存绘制记录
    var initialAreas = [],              //绘制区域坐标点缓存数据
        newRusult = [],                 //新组装的地图坐标点数组
        lnglatarr = [];                 //绘制区域坐标点数组

    $scope.title = "万科资源管理信息系统 - 签到范围设置";
    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false,
        isDepartmentSelectpickerMultipe: false
    };
    $scope.clearArea = clearArea;
    $scope.save = save;
    $scope.edit = edit;
    $scope.searchMap = searchMap;
    $scope.search = search;
    //初始化获取项目区域
    //getDepartment();
    $scope.$on('selectpicker-loaded', getDepartment);

    function search() {
        isNewProject = true;
        myPositionLng = 116.404068;     //默认经度
        myPositionLat = 39.914887;      //默认维度
        mapZoom = 17;
        myValue = null;                        //搜索关键字
        companyName = null;
        map = null;
        departmentAreas = null;                //绘制区域
        overlays = [];                  //绘制结果
        currentCity = null;
        calcCenterLng = null;
        calcCenterLat = null;   //绘制区域中心点

        //保存绘制记录
        initialAreas = [];              //绘制区域坐标点缓存数据
        newRusult = [];                 //新组装的地图坐标点数组
        lnglatarr = [];              //绘制区域坐标点数组
        isFirst = true;
        getDepartment();
    }

    function getDepartment() {
        departmentId = _.pluck($scope.selectedDepartments, 'department_id');
        if (!departmentId.length) {
            return false;
        } else {
            departmentId = departmentId[0];
        }
        $http({
            url: 'internal/api/department-area-collect/' + departmentId,
            method: 'get'
        }).success(function (data) {  //响应成功
            departmentAreas = data.areas;
            $scope.personalInfoList = [
                {filterCompanyName: data.companyName}, {filterCompanyName: data.departmentName}
            ];
            var height = $(window).height() - 250 + "px";
            $("#map").css({"wdith": "100%", "height": height});
            companyName = data.companyName;
            searchMap(data.companyName);
            getMapCenter(data);     //获取地图中心点
            commonService.storageSearchStatus($scope, {
                selectedCompanies: $scope.selectedCompanies,
                selectedDepartments: $scope.selectedDepartments,
                departments: $scope.departments
            });
        }).error(function () {   //处理响应失败
            commonService.alert({
                content: '获取项目区域失败，请重试',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        });
    }

    //搜索
    function searchMap(value) {
        myValue = value || $("#suggestId").val().replace(/\s+/g, "");
        var local = new BMap.LocalSearch(currentCity, {
            renderOptions: {
                map: map,
                autoViewport: true,
                selectFirstResult: false
            },
            pageCapacity: 8
        });
        local.search(myValue);
    }

    function getMapCenter(data) {
        if (JSON.parse(data.areas) != null && JSON.parse(data.areas) != "" && JSON.parse(data.areas).mapPoints != "" && JSON.parse(data.areas).mapPoints.length > 0) {  //计算绘制区域中心点
            var mapPoints = JSON.parse(data.areas).mapPoints;
            if (sessionStorage.getItem("initialAreas") == null || sessionStorage.getItem("initialAreas") == "") {
                sessionStorage.setItem("initialAreas", JSON.stringify(mapPoints));
            }
            isNewProject = false;
            for (var i = 0; i < JSON.parse(data.areas).mapPoints.length; i++) {
                var str = JSON.parse(data.areas).mapPoints[i];
                for (var j = 0; j < str.length; j++) {
                    lnglatarr.push(str[j]);
                }
            }
            signInAreaTaskservice.calculateCenter(lnglatarr).then(function (data) {
                calcCenterLng = data[0];
                calcCenterLat = data[1];
                loadMap();
                map.addEventListener('tilesloaded', tilesloaded);  //监听地图加载完成事件
            });
        } else {
            isNewProject = true;
            loadMap();
            map.addEventListener('tilesloaded', tilesloaded);  //监听地图加载完成事件
        }
    }

    function tilesloaded() {
        addOverlay(JSON.parse(departmentAreas));       //添加绘制区域
        loadDrawingTool();
    }

    //加载地图及搜索+绘图工具栏
    function loadMap() {
        var point, myPositionLng = calcCenterLng || 116.404068, myPositionLat = calcCenterLat || 39.914887;
        // 百度地图API
        map = new BMap.Map('map', {enableMapClick: false}, {vectorMapLevel: 99});  //关闭底图可点功能
        point = new BMap.Point(myPositionLng, myPositionLat);  //默认坐标
        map.centerAndZoom(point, mapZoom);
        map.enableScrollWheelZoom();
        loadMapAutocomplete();
    }

    function addOverlay(departmentAreas) {
        if (overlays.length > 0) {  //禁止重复绘制
            return;
        }
        if (departmentAreas != null && departmentAreas != "" && departmentAreas.mapPoints != "" && departmentAreas.mapPoints.length > 0) {
            var mapPoints = departmentAreas.mapPoints;
            if (sessionStorage.getItem("initialAreas") == null || sessionStorage.getItem("initialAreas") == "") {
                sessionStorage.setItem("initialAreas", JSON.stringify(departmentAreas));
            }
            for (var i = 0; i < mapPoints.length; i++) {
                var NewPoints = [], everyPoints = "", str = mapPoints[i];
                for (var j = 0; j < str.length; j++) {
                    everyPoints = new BMap.Point(Number(str[j].lng), Number(str[j].lat));
                    NewPoints.push(everyPoints);
                }
                var polygon = new BMap.Polygon(
                    NewPoints,
                    {strokeColor: "red", strokeWeight: "2", strokeOpacity: "0.5", fillOpacity: 0.0, fillColor: "none"}
                );
                map.addOverlay(polygon);
                overlays.push(polygon);
            }
        } else if (isNewProject) {  //没有绘制区域时获取当前位置
            geolocation();
        }
        getCurrentCity();
    }


    function geolocation() {
        if (!isFirst) {
            return;
        }
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                if (calcCenterLng != null && calcCenterLat != null) {
                    var mk = new BMap.Marker(calcCenterLng, calcCenterLat);
                } else {
                    var mk = new BMap.Marker(r.point);
                    calcCenterLng = r.point.lng;
                    calcCenterLat = r.point.lat;
                }
                map.panTo(r.point);
                map.addOverlay(mk);
            }
            else {
                commonService.alert({
                    content: '定位失败请重试',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-green"
                });
            }
        }, {enableHighAccuracy: true});
        isFirst = false;
    }

    //绘制工具
    function loadDrawingTool() {
        var styleOptions = {
                strokeColor: "red",     //边线颜色。
                fillColor: "none",       //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 2,        //边线的宽度，以像素为单位。
                strokeOpacity: 1,     //边线透明度，取值范围0 - 1。
                fillOpacity: 0,       //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid'    //边线的样式，solid或dashed。
            },
        //实例化鼠标绘制工具
            drawingManager = new BMapLib.DrawingManager(map, {
                isOpen: false,                      //是否开启绘制模式
                enableDrawingTool: true,            //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT,  //位置
                    offset: new BMap.Size(5, 5)     //偏离值
                },
                polygonOptions: styleOptions,       //多边形的样式
                rectangleOptions: styleOptions      //矩形的样式
            });

        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);

        function overlaycomplete(e) {
            $(".BMapLib_Drawing_panel").show();
            var overlay = e.overlay;
            overlays.push(e.overlay);
            e.overlay.enableEditing();
            computeAreaByArray(overlay);
        }

        //点击工具栏，将所有绘制区域变为不可编辑状态，并禁用工具条
        $(document).on("click", ".BMapLib_box", function (e) {
            var className = $(this).get(0).className;
            if (className.indexOf("BMapLib_polygon_hover") > 0 || className.indexOf("BMapLib_rectangle_hover") > 0) {
                $(".BMapLib_Drawing_panel").hide();
            }
            for (var i = 0; i < overlays.length; i++) {
                overlays[i].disableEditing();
            }
        })
    }

    function getCurrentCity() {
        var point = new BMap.Point(Number(calcCenterLng), Number(calcCenterLat));
        var geoc = new BMap.Geocoder();
        geoc.getLocation(point, function (rs) {
            var addComp = rs.addressComponents;
            currentCity = addComp.city;
        });
    }

    function save() {
        newRusult = [];
        //将所有绘制区域变为不可编辑状态
        for (var i = 0; i < overlays.length; i++) {
            overlays[i].disableEditing();
        }

        //判断是否超过最大范围
        for (var i = 0; i < overlays.length; i++) {
            if (!computeAreaByArray(overlays[i])) {
                return false;
            }
        }

        //获取所有区域+坐标的数组
        for (var i = 0; i < overlays.length; i++) {
            var ro = overlays[i].getPath();
            newRusult.push([]);
            for (var j = 0; j < ro.length; j++) {
                var everypoint = "{'lng':" + Number(ro[j].lng) + ",'lat':" + Number(ro[j].lat) + "}";
                newRusult[i].push(eval('(' + everypoint + ')'));
            }
        }
        newRusult = JSON.stringify(newRusult);  //将JSON对象转化为JSON字符
        if (sessionStorage.getItem("initialAreas") && sessionStorage.getItem("initialAreas") == newRusult) {
            newRusult = [];
            commonService.alert({
                content: '你尚未绘制新的签到区域',
                icon: "fa-exclamation-circle",
                iconColor: "icon-green"
            });
            return false;
        } else if (JSON.parse(newRusult).length > 0) {
            initialAreas = '{"mapPoints":' + newRusult + '}';
            sessionStorage.setItem("initialAreas", newRusult);
        } else if (JSON.parse(newRusult).length == 0) {
            initialAreas = '';
        }

        //是否新建项目
        if (isNewProject) {  //新建项目
            if (initialAreas == "[]" || JSON.parse(initialAreas).mapPoints.length == 0) {
                commonService.alert({
                    content: '你尚未绘制签到区域',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-green"
                });
                return false;
            } else {
                $http({
                    url: 'internal/api/department-area',
                    method: 'post',
                    data: {
                        departmentId: departmentId,
                        areas: initialAreas
                    }
                }).success(function (data) {  //响应成功
                    if (data) {
                        isNewProject = false;
                        commonService.alert({
                            content: '签到区域保存成功',
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-green"
                        });
                        myPositionLng = map.getCenter().lng;
                        myPositionLat = map.getCenter().lat;
                        mapZoom = Number(map.getZoom());
                    } else {
                        commonService.alert({
                            content: '签到区域保存失败，请重试',
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                }).error(function (data) {   //处理响应失败
                    commonService.alert({
                        content: '签到区域保存失败，请重试',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                });
            }
        } else {   //更新项目
            if (initialAreas.length == 0 || initialAreas == "[]") {
                commonService.confirm({
                    "title": "删除提示",
                    "icon": "fa-exclamation-circle",
                    "content": "你尚未绘制签到区域，确认提交吗？",
                    "callback": function () {
                        initialAreas == "[]" ? initialAreas = "" : initialAreas;
                        update();
                    }
                });
            } else {
                update();
            }
        }
    }

    //计算面积
    function computeAreaByArray(overlay) {
        return signInAreaTaskservice.computeAreaByArray(overlay);
    }

    //清除绘制记录
    function clearArea() {
        var config = {
            "title": "删除提示",
            "icon": "fa-exclamation-circle",
            "content": "确认清除所有绘制区域吗？",
            "callback": function () {
                for (var i = 0; i < overlays.length; i++) {
                    map.removeOverlay(overlays[i]);
                }
                overlays.length = 0;
                overlays = [];
                departmentAreas = null;
                sessionStorage.removeItem("initialAreas");
            }
        };
        commonService.confirm(config);
    }

    //创建检索控件
    function loadMapAutocomplete() {
        var autocomplete = new BMap.Autocomplete(    //建立一个自动完成的对象
            {
                "input": "suggestId"
                , "location": map
            });

        autocomplete.addEventListener("onhighlight", onhighlight);
        autocomplete.addEventListener("onconfirm", onconfirm);

        function onhighlight(e) {  //鼠标放在下拉列表上的事件
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            $("#searchResultPanel").html(str);
        }

        function onconfirm(e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            $("#searchResultPanel").html("onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue);
            setPlace(myValue);
        }

        function setPlace(myValue) {
            map.clearOverlays();    //清除地图上所有覆盖物
            function myFun() {
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp));    //添加标注
            }

            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }
    }

    //绑定键盘回车键事件
    $('#suggestId').bind('keyup', function (event) {
        if (event.keyCode == "13") {
            //回车执行查询
            searchMap();
        }
    });

    function update() {
        $http({
            url: 'internal/api/department-area/' + departmentId,
            method: 'put',
            data: {'areas': initialAreas},
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {  //响应成功
            if (initialAreas.length == 0 || initialAreas == "[]") {
                isNewProject = true;
            } else {
                isNewProject = false;
            }
            commonService.alert({
                content: '签到区域修改成功',
                icon: "fa-exclamation-circle",
                iconColor: "icon-green"
            });
            myPositionLng = map.getCenter().lng;
            myPositionLat = map.getCenter().lat;
            mapZoom = Number(map.getZoom());
        }).error(function (data) {   //处理响应失败
            commonService.alert({
                content: '签到区域修改失败，请重试',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        });
    }

    //编辑绘制记录
    function edit() {
        for (var i = 0; i < overlays.length; i++) {
            overlays[i].enableEditing();
        }
    }
}]);