'use strict';

(function ($, $w) {
    $(function () {
        $('#side-menu').metisMenu();

        $($w).bind("load resize", function () {
            var sidebar = $("#vk-sidebar");
            var topOffset = parseInt($(".vk-navbar").outerHeight());
            var pageWrapperMarginTop = parseInt($("#page-wrapper").css("margin-top"));

            var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
            if (width < 768) {
                $('div.navbar-collapse').addClass('collapse');
                topOffset = parseInt($(".vk-navbar").height()) + 6;
            } else {
                $('div.navbar-collapse').removeClass('collapse');
            }

            var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $("#page-wrapper").css("min-height", (height - pageWrapperMarginTop * 2) + "px");
                $("#vk-sidebar").css("min-height", (height) + "px");
            }
        });

        var element = $('ul.nav a.item').filter(function () {
            var url_path = this.href.split(/#\/|\?/)[1],
                href_path = $w.location.href.split(/#\/|\?/)[1],
                links = $(this).attr("links");

            if (href_path && links) {
                links = links.split(" ");
                for (var i = 0; i < links.length; i++) {
                    if (links[i] == href_path) {
                        return true;
                    }
                }
            }
            return url_path && href_path && url_path == href_path;

        }).addClass('active').parent().parent().addClass('in').parent();
        if (element.is('li')) {
            element.addClass('active');
        }
        $('ul.nav a.item, ul.nav a.switch').click('click', function () {
            $('ul.nav a').removeClass('active');
            if ($(this).hasClass("item")) {
                $(this).addClass('active');
            }
        });
    });

    $w.utils = {};
    utils.generateHeaders = function () {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        var headers = {};
        headers[header] = token;
        return headers;
    };
    utils.formatDate = function (date) {
        if (date) {
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            return month + "/" + day + "/" + year;
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
    utils.checkNumber = function (data) {
        var reg = /^(\+)?[0-9]+(\.[0-9]{1,2})?$/;
        return reg.test(data);
    };
    utils.decimalAdjust = function (type, value, exp) {
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    };
    utils.round = function (value, exp) {
        return utils.decimalAdjust('round', value, exp);
    };
    utils.getArrayIds = function (data) {
        var arr = [];
        angular.forEach(data, function (item) {
            arr.push(item.id);
        });
        return arr;
    };
    utils.compareDelDepartment = function (data, initSelectedDepartment) {
        var delDepartment = []
        angular.forEach(initSelectedDepartment, function (item) {
            if (data.indexOf(item) == -1) {
                delDepartment.push(item)
            }
        });
        return delDepartment;
    };

    utils.compareUpdateDepartment = function (data, initSelectedDepartment) {
        var updateDepartment = []
        angular.forEach(data, function (item) {
            if (initSelectedDepartment.indexOf(item) == -1) {
                updateDepartment.push(item)
            }
        });
        return updateDepartment;
    };
    utils.transferDateTo = function (entryDate) {
        if (null != entryDate && "" != entryDate) {
            var dataArr0 = entryDate.split("年"),
                dataArr1 = dataArr0[1].split("月"),
                dataArr2 = dataArr1[1].split("日");
            return dataArr1[0] + "/" + dataArr2[0] + "/" + dataArr0[0];
        }
        return entryDate;
    };

    utils.transferDateToCN = function (entryDate, sign) {
        if (null != entryDate && "" != entryDate) {
            var dataArr = entryDate.split(sign);
            return dataArr[0] + "年" + dataArr[1] + "月" + dataArr[2] + "日";
        }
        return entryDate;
    };

    $(document).ajaxComplete(function (event, xhr) {
        var httpStatus = xhr.status;
        var errorPageHash;
        if (httpStatus === 200) {
            return;
        } else if (httpStatus === 403) {
            errorPageHash = "/403";
        } else {
            errorPageHash = "/home#/system-error";
        }

        window.location.href = baseUrl + errorPageHash;
    });

})(jQuery, window);


