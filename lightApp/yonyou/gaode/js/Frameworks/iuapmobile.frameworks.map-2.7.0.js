(function (root) {
    function Map(selector, options) {
        this.$element = $(selector);
        this.instance = null;
        this._events = new UM.EventMgr();
        this.init(options);
    };

    Map.prototype.init = function (options) {
        var _id = this.$element.attr("id");
        var _defaultOptions = {
            center: [116.39, 39.9],
            zoom: 12, // 缩放级别
        };

        if (this.$element.length == 0 || !(_id)) {
            console.warn("页面中必须存在存放地图的区域，且该区域要有一个唯一的id值！");
            return;
        }

        options = $.extend(true, {}, _defaultOptions, options);

        //创建地图实例
        this.map = new AMap.Map(_id, options);

        //设置地图高度
        this.$element.parent().css("position", "relative").end().addClass("um-map-wrap");
    };

    //获取地图实例
    Map.prototype.getInstance = function () {
        return this.map;
    }
    //添加基础插件
    Map.prototype.addBasicFuncs = function (funcs) {
        var _self = this;
        if (funcs == undefined) {
            funcs = ["ToolBar", "Scale", "AutoFocus", "MapType"];
        } else if (typeof funcs == "string") {
            funcs = [funcs];
        }

        Array.isArray(funcs) && funcs.forEach(function (func) {
            switch (func) {
                case "ToolBar":
                    _self.addToolBar();
                    break;
                case "Scale":
                    _self.addScale();
                    break;
                case "MapType":
                    _self.addMapType();
                    break;
                case "AutoFocus":
                    _self.addAutoFocus();
                    break;
            }
        });
    }

    Map.prototype.addToolBar = function (options) {
        var _self = this;
        if (typeof options !== "object")
            options = {};
        this.map.plugin(["AMap.ToolBar"], function () {
            var _toolBar = new AMap.ToolBar(options);
            _self.map.addControl(_toolBar);
        });
    }

    Map.prototype.addScale = function (options) {
        var _self = this;
        if (typeof options !== "object")
            options = {};
        this.map.plugin(["AMap.Scale"], function () {
            var _scale = new AMap.Scale();
            _self.map.addControl(_scale);
        });
    }
    Map.prototype.addMapType = function (options) {
        var _self = this;
        if (typeof options !== "object")
            options = {};
        this.map.plugin(["AMap.MapType"], function () {
            var _mapType = new AMap.MapType();
            _self.map.addControl(_mapType);
        });
    }

    Map.prototype.addAutoFocus = function () {
        var _self = this;
        var _autoFocus = new AMap.AutoFocusControl(this.map);
        this.map.addControl(_autoFocus);

        this.map.plugin('AMap.Geolocation', function () {
            _self._geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 10000, //超过10秒后停止定位，默认：无穷大
                maximumAge: 0, //定位结果缓存0毫秒，默认：0
                convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: false, //显示定位按钮，默认：true
                buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            _self.map.addControl(_self._geolocation);
        });

        AMap.event.addDomListener(_autoFocus.container, "click", function () {
            _self.getCurPos();
        });

    };
    /**
     * 设置及获取地图缩放级别和中心点
     *
     * @param position
     *            位置可为city(字符串)或者经纬度数组，如 [116.205467, 39.907761]
     * @param city
     *            城市名称
     * @param zoom
     *            缩放级别
     */
    Map.prototype.setZoom = function (zoom) {
        zoom = parseInt(zoom);
        if (zoom) {
            this.map.setZoom(zoom);
        }
    };

    Map.prototype.getZoom = function () {
        var _zoom;
        try {
            _zoom = this.map.getZoom();
        } catch (e) {
            console.warn(e.name + e.message);
            return;
        }
        return _zoom;
    };

    Map.prototype.setCity = function (city) {
        if (city && typeof city == "string") {
            this.map.setCity(city);
        }
    };

    Map.prototype.getCity = function (callback) {
        if (typeof callback == "function") {
            this.map.getCity(callback);
        }
    };

    Map.prototype.setCenter = function (center) {
        if (Array.isArray(center) && center.length == 2) {
            this.map.setCenter(center);
        }
    }

    Map.prototype.getCenter = function () {
        var _center;
        try {
            _center = this.map.getCenter();
        } catch (e) {
            console.warn(e.name + e.message);
            return;
        }
        return _center;
    };

    /**
     * 定位
     *
     */
    //平移到指定中心点
    Map.prototype.panTo = function (LngLat) {
        if (LngLat && Array.isArray(LngLat) && LngLat.length == 2) {
            this.map.panTo(LngLat);
        }
    }

    Map.prototype.getCurPosAPP = function (options, callback) {
        var _self = this;

        if ($device.getLocation) {
            $device.getLocation({
                "bindfield": "mylocation", //位置信息回写的绑定字段
                "callback": function () {
                    var _location = $ctx.getJSONObject("mylocation");
                    var longitude = _location.longitude;
                    var latitude = _location.latitude;
                    var _LngLat = [longitude, latitude];
                    if (options.autoFocus) {
                        _self.map.setZoomAndCenter(12, _LngLat);
                        _self.clearAllMarkers();
                        _self.createMarker({
                            icon: options.icon,
                            position: _LngLat
                        }, true);
                    }
                    (typeof callback == "function") && callback({
                        longitude: longitude,
                        latitude: latitude
                    });
                }, //回调执行的JS方法
                "single": "true", //是否只获取1次
                "isgetaddress": "true", //是否需要获取地址
                "network": "true" //是否使用wifi定位
            });
        }
    }

    Map.prototype.getCurPosBrowser = function (options, callback) {
        var _self = this;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var longitude = position.coords.longitude;
                var latitude = position.coords.latitude;
                var _LngLat = [longitude, latitude];
                if (options.autoFocus) {
                    _self.map.setZoomAndCenter(12, _LngLat);
                    _self.clearAllMarkers();
                    _self.createMarker({
                        icon: options.icon,
                        position: _LngLat
                    }, true);
                }
            }, function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.warn("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.warn("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        console.warn("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.warn("An unknown error occurred.");
                        break;
                }
            });
        }

    }

    Map.prototype.getCurPos = function (options, callback) {
        var _env = "browser"; //根据环境，设置不同的值，调用不同的地理定位方法

        if (typeof options !== "object") {
            callback = options;
            options = null;
        }
        options = $.extend({}, {
            icon: "http://js.webapi.amap.com/theme/v1.3/markers/b/loc.png",
            autoFocus: true
        }, options);

        switch (_env) {
            case "app":
                this.getCurPosAPP(options, callback);
                break;
            case "browser":
                this.getCurPosBrowser(options, callback);
                break;
        }

    }
    /**
     * 地理编码与地理逆编码
     *
     */
    Map.prototype.getLocation = function (address, callback) {
        //address为地址，比如"北京市海淀区苏州街"
        if (!address || (typeof address !== "string"))
            return false;
        AMap.service("AMap.Geocoder", function () {//回调函数
            var _geocoder = new AMap.Geocoder();
            _geocoder.getLocation(address, callback);
        });
    };

    Map.prototype.getAddress = function (location, callback) {
        //location为经纬度数组，比如 [116.205467, 39.907761]
        if (!Array.isArray(location) || (location.length !== 2))
            return false;
        AMap.service("AMap.Geocoder", function () {//回调函数
            var _geocoder = new AMap.Geocoder();
            _geocoder.getAddress(location, callback);
        });
    }
    /**
     * 地图上添加标记，删除标记
     *
     */
    Map.prototype.createMarker = function (markerObj, ifFitView) {
        /* markerObj结构：
         {
         icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png",
         position: [116.205467, 39.907761],
         title:"鼠标滑过时标记提示内容",
         content:"设置标注标签"
         }
         */
        if (typeof markerObj !== "object") {
            console.warn("addMarker方法的第一个参数必须存在，而且为对象！");
            return false;
        }
        if (!Array.isArray(markerObj.position) || (markerObj.position.length !== 2)) {
            console.warn("请设置标注经纬度数组！");
            return false;
        }
        var _marker = new AMap.Marker({
            map: this.map,
            icon: markerObj.icon,
            position: [markerObj.position[0], markerObj.position[1]],
            offset: new AMap.Pixel(-12, -36)
        });
        _marker.setMap(this.map);

        markerObj.title && _marker.setTitle(markerObj.title);

        markerObj.content && _marker.setContent(markerObj.content);

        ifFitView && this.map.setFitView();

        return _marker;
    }

    Map.prototype.clearMarker = function (marker) {
        marker && this.map.clearMap(marker);
    }

    Map.prototype.createMarkers = function (markersArr, ifFitView) {
        /* markersArr结构：
         [{
         icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png",
         position: [116.205467, 39.907761],
         title:"鼠标滑过时标记提示内容",
         label:"设置标注标签"
         }]
         */
        var _self = this;
        var _marker = null;
        var _markers = [];

        Array.isArray(markersArr) && markersArr.forEach(function (markerObj) {
            try {
                _marker = _self.createMarker(markerObj);
            } catch (e) {
                console.warn(e.name + e.message);
            }
            _marker && _markers.push(_marker);
        });

        ifFitView && this.map.setFitView();

        return _markers;
    }

    Map.prototype.clearAllMarkers = function () {
        this.map.clearMap(null);
    }

    Map.prototype.getAllMarkers = function () {
        var _markers = [];
        try {
            _markers = this.map.getAllOverlays("marker");
        } catch (e) {
            console.warn(e.name + e.message);
            return false;
        }
        return _markers;
    }
    /**
     * 地图事件，包括添加和移除事件监听
     *
     */

    Map.prototype.onComplete = function (callback) {
        if (typeof callback == "function") {
            this.map.on("complete", callback)
        }
    }

    Map.prototype.onClick = function (callback) {
        if (typeof callback == "function") {
            this.map.on("click", callback)
        }
    }

    Map.prototype.onDClick = function (callback) {
        if (typeof callback == "function") {
            this.map.on("dbclick", callback)
        }
    }

    Map.prototype.onZoomChange = function (callback) {
        if (typeof callback == "function") {
            this.map.on("zoomchange", callback)
        }
    }

    Map.prototype.onDragStart = function (callback) {
        if (typeof callback == "function") {
            this.map.on("dragstart", callback)
        }
    }

    Map.prototype.onDraging = function (callback) {
        if (typeof callback == "function") {
            this.map.on("draging", callback)
        }
    }

    Map.prototype.onDragEnd = function (callback) {
        if (typeof callback == "function") {
            this.map.on("dragend", callback)
        }
    }
    /**
     * 地图服务，比如天气预报，驾车导航等等
     *
     */
    //实时天气状况查询
    Map.prototype.getLive = function (district, callback) {
        var me = this;
        if (district && typeof district == "string") {
            AMap.service('AMap.Weather', function () {
                var weather = new AMap.Weather();
                weather.getLive(district, function (ErrorStatus, WeatherLiveResult) {
                    if (ErrorStatus === null && typeof callback == "function") {
                        callback(ErrorStatus, WeatherLiveResult);
                    }
                });
            });
        }
    }
    //未来四天天气预报（包括今天）
    Map.prototype.getForecast = function (district, callback) {

        if (district && typeof district == "string") {
            AMap.service('AMap.Weather', function () {
                var weather = new AMap.Weather();
                weather.getForecast(district, function (ErrorStatus, WeatherForecastResult) {
                    if (ErrorStatus === null && typeof callback == "function") {
                        callback(ErrorStatus, WeatherForecastResult);
                    }
                });
            });
        }
    }
    //POI搜索(关键字搜索， 周边搜索)
    Map.prototype.search = function (keyword, options, callback) {
        if (!keyword || typeof keyword !== "string")
            return;
        if (typeof options !== "object") {
            callback = options;
            options = {};
        }

        var _self = this;
        options = $.extend({}, {
            pageSize: 5,
            pageIndex: 1,
            city: "北京市",
            panel: ""
        }, options);

        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({//构造地点查询类
                pageSize: options.pageSize,
                pageIndex: options.pageIndex,
                city: options.city,
                map: _self.map,
                panel: options.panel
            });
            _self.clearAllMarkers();
            placeSearch.search(keyword, callback);
        });

    }

    Map.prototype.searchNearBy = function (keyword, options, callback) {
        if (!keyword || typeof keyword !== "string")
            return;
        if (typeof options !== "object") {
            callback = options;
            options = {};
        }

        var _self = this;
        options = $.extend({}, {
            pageSize: 5,
            pageIndex: 1,
            center: [116.396574, 39.992706],
            radius: 1000,
            panel: ""
        }, options);

        Array.isArray(options.center) && (options.center.length == 2) && this.getAddress(options.center, function (status, result) {
            var city = "";
            if (result.info == "OK") {
                city = result.regeocode.addressComponent.city || "北京市";
                AMap.service(["AMap.PlaceSearch"], function () {
                    var placeSearch = new AMap.PlaceSearch({//构造地点查询类
                        pageSize: options.pageSize,
                        pageIndex: options.pageIndex,
                        city: city,
                        map: _self.map,
                        panel: ""
                    });
                    _self.clearAllMarkers();
                    placeSearch.searchNearBy(keyword, options.center, options.radius, callback);
                });
            }
        });
    }
    //创建高德地图自定义插件
    AMap.AutoFocusControl = function () {
    };
    AMap.AutoFocusControl.prototype = {
        constructor: AMap.AutoFocusControl,
        addTo: function (map, dom) {
            dom.appendChild(this._getHtmlDom(map));
        },
        _getHtmlDom: function (map) {
            this.map = map;

            // 创建一个能承载控件的元素
            var controlUI = this.container = document.createElement("div");
            controlUI.className = "um-map-autoFocusControl";

            return controlUI;
        }
    }

    root.UM.Map = Map;
    root.UM.map = function (selector, opts) {
        return new Map(selector, opts);
    };
})(this);
