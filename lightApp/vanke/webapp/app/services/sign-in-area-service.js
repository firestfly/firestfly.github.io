'use strict';
(function (w) {
    w.VkrmsApp.factory('SignInAreaTaskservice', ['$http', '$q', 'CommonService', function ($http, $q, commonService) {
        return {
            calculateCenter: function (lnglatarr) {
                var deferred = $q.defer();
                var X = 0, Y = 0, Z = 0;
                var total = lnglatarr.length;
                for (var i = 0; i < total; i++) {
                    var lng = lnglatarr[i].lng * Math.PI / 180;
                    var lat = lnglatarr[i].lat * Math.PI / 180;
                    var x, y, z;
                    x = Math.cos(lat) * Math.cos(lng);
                    y = Math.cos(lat) * Math.sin(lng);
                    z = Math.sin(lat);
                    X += x;
                    Y += y;
                    Z += z;
                }

                X = X / total;
                Y = Y / total;
                Z = Z / total;

                var Lng = Math.atan2(Y, X);
                var Hyp = Math.sqrt(X * X + Y * Y);
                var Lat = Math.atan2(Z, Hyp);
                var calcCenterLng = Lng * 180 / Math.PI;
                var calcCenterLat = Lat * 180 / Math.PI;
                var calcCenter = [calcCenterLng, calcCenterLat]

                deferred.resolve(calcCenter);
                return deferred.promise;
            },
            computeAreaByArray: function computeAreaByArray(overlay) {
                var str = overlay.getPath()
                var NewPoints = [];
                for (var j = 0; j < str.length; j++) {
                    var everyPoints = new BMap.Point(Number(str[j].lng), Number(str[j].lat));
                    NewPoints.push(everyPoints);
                }
                var ply = new BMap.Polygon(NewPoints);
                var area = BMapLib.GeoUtils.getPolygonArea(ply);
                if (Math.abs(area.toFixed(2)) > 10000000 && Math.abs(area.toFixed(2)) < 10000000000000) {  //1000Wm^2<单个面积<1KWkm^2，避免图形交叉时报错
                    commonService.alert({
                        content: '绘制区域超过最大范围，请重新绘制',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-green"
                    });
                    return false;
                } else {
                    return true;
                }
            }
        }
    }])
})(window);