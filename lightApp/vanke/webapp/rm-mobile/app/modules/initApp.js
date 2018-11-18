(function ($w) {

    'use strict';

    function getProjectPath() {
        var pathName = window.document.location.pathname;
        var projectPath = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return projectPath;
    }


    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    $w.utils = {};
    utils.formatDate = function (date) {
        if (date) {
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            return month + "/" + day + "/" + year;
        }
        return null;
    };
    utils.formatApiDate = function (date) {
        if (date) {
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            return year + "-" + month + "-" + day;
        }
        return null;
    };
    utils.dateForShow = function (date) {
        if (date) {
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            return year + '.' + month + '.' + day;
        }
        return null;
    };
    utils.formatTime = function (time) {
        var result = false, m;
        var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
        if ((m = time.match(re))) {
            result = (m[1].length == 2 ? "" : "0") + m[1] + ":" + m[2];
        }
        return result;
    };
    //写cookies
    utils.setCookie = function (name, value, day) {
        var Days = day || 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    };
    //读取cookies
    utils.getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    };
    // 跨天换算
    utils.hourOverDay = function (startTime, endTime) {
        // 时间跨天超过24小时
        var arg = arguments.length;
        if (arg == 2) {
            var StartTime = parseInt(startTime.substr(0, 2));
            var EndTime = parseInt(endTime.substr(0, 2));
            if (EndTime < StartTime) {
                // 已跨天
                return '次日' + endTime.substr(0, 5);
            } else {
                // 未跨天，原值返回
                return endTime.substr(0, 5);
            }
        } else {
            if (startTime == '-' || startTime == null) {
                return startTime;
            } else {
                var str = startTime.substr(0, 2)
                if (parseInt(str) < 24) {
                    return startTime.substr(0, 5);
                } else {
                    var newStr = str - 24;
                    newStr = newStr < 10 ? '次日0' + newStr : '次日' + newStr;
                    return newStr + startTime.substr(2, 3);
                }
            }
        }

    };
    utils.switchType = function (type) {
        var data = ['0', '加班|OFF_DAY_OVERTIME,REGULAR_WITH_OVERTIME', '调休假|ADJUSTABLE', '班次|REGULAR', '出差|EVENCTION', '外勤|TRIP', '月休|HOLIDAY', '额外带薪年休假|PAY_ANNUAL', '法定年休假|STATUTORY_ANNUAL',
            '春节调休假|SPRING_FESTIVAL', '结转年休假|CARRY_OVER', '婚假|MARRIAGE', '丧假|FUNERAL', '产假|MATERNITY', '护理假|NURSING', '节育假|CONTRACEPTION', '计划生育假|FAMILY_PLANNING', '普通病假或医疗期外|ORDINARY_SICK', '法定病假医疗期|STATUTORY_SICK', '法定工伤医疗期|INDUSTRIAL_INJURY',
            '事假|PRIVATE_AFFAIR', '其他带薪假|OTHER_PAY', '脱产学习假|DAY_RELEASE', '探亲假|HOME'];
        var result = null;
        for (var i in data) {
            var str = data[i].split('|');
            if (str.length == 2 && str[1] == type) {
                result = str[0];
                break;
            }
        }
        return result;
    };
    $w.projectPath = getProjectPath();
    $w.getQueryString = getQueryString;

})(window);
