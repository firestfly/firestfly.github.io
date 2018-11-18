(function (Common) {
    Common["trim"] = (function () {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        return function (str) {
            return (str + "").replace(rtrim, '');
        }
    })();
    Common["encode"] = function (str) {
        return encodeURIComponent(str);
    }
    Common["alert"] = function (str) {
        alert(str)

    }
    Common["error"] = (function () {
        return function (text) {
            console.error(text);
        }
    })
    Common["each"] = function (arr, callback) {
        var l = arr.length,
            i = 0;
        if (arr.each) {
            arr.each(callback);
            return;
        }
        if (l) {
            while (i < l) {
                if (callback(arr[i], i) === false) {
                    return;
                }
                i++;
            }
            return;
        }
    }
    Common["cookie"] = function (key, value, options) {
        if (key !== undefined && value !== undefined) {
            //set
            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', value,
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));

        } else {
            //get
            var str = document.cookie,
                search = str.split(/;\s*/g),
                obj = {};
            for (var i = 0; i < search.length; i++) {
                var kv = search[i].split("=");
                if (kv[0]) {
                    obj[kv[0]] = kv[1];
                }
            }
            ;
            return key ? obj[key] : obj;
        }
    };
    Common["setFormData"] = (function () {

        var config = {
            space: ','
        }
        var regStart = '(^|' + config.space + ')',
            regEnd = '($|' + config.space + ')'

        function getFormType(dom) {
            var type = String.prototype.toLowerCase.call(dom.nodeName);
            if (type === "input") {
                return String.prototype.toLowerCase.call(dom.type);
            } else {
                return type;
            }
        }

        return function (form, data, opt) {
            if (form && form.elements) {
                var elems = form.elements;
                for (var i = 0; i < elems.length; i++) {
                    var elem = elems[i],
                        type = getFormType(elem),
                        name = elem.name;
                    if (data === null || data[name] === null) {
                        if (type == 'checkbox' || type == 'radio') {
                            elem.checked = false;
                        } else {
                            elem.value = "";
                        }
                    } else if (data[name] !== undefined) {
                        if (type == 'select' && type.multiple) {
                            // {select:'1,2,3,4,5'}
                            var arr = (data[name] + '').split(config.space);
                            var options = elem.options;
                            var optionsArr = [];
                            for (var z = 0; z < options.length; z++) {
                                optionsArr.push({
                                    value: options[z].value,
                                    option: options[z]
                                })
                            }
                            ;
                            for (var x = 0; x < arr.length; x++) {
                                var val = arr[x];
                                for (var y = 0; y < optionsArr.length; y++) {
                                    if (val == optionsArr[y].value) {
                                        optionsArr[y].option["selected"] = true;
                                    }
                                }
                                ;
                            }
                            ;
                        } else if (type == 'checkbox' || type == 'radio') {
                            var reg = RegExp(regStart + elem.value + regEnd);
                            if (data[name].search(reg) > -1) {
                                elem.checked = true;
                            } else {
                                elem.checked = false;
                            }
                        } else {
                            elem.value = data[name];
                        }
                    }

                }
            }
        }
    })();
    Common["getFormData"] = (function () {
        function get(obj, name, value) {
            if (!name) {
                return;
            }
            if (obj[name] !== undefined) {
                //非数组类型
                obj[name] += (',' + value);
            } else {
                obj[name] = value;
            }
        }

        function getFormType(dom) {
            var type = String.prototype.toLowerCase.call(dom.nodeName);
            if (type === "input") {
                return String.prototype.toLowerCase.call(dom.type);
            } else {
                return type;
            }
        }

        return function (form) {
            var resultObj = {};
            if (form && form.elements) {
                var elems = form.elements;
                for (var i = 0; i < elems.length; i++) {
                    var elem = elems[i],
                        name = elem["name"],
                        type = getFormType(elem),
                        value = null;
                    if ((type == 'checkbox' || type == 'radio') && !elem.checked) {
                        continue;
                    } else if (type == 'select' && elem.multiple) {
                        var options = elem.options;
                        for (var j = 0; j < options.length; j++) {
                            if (options[j].selected) {
                                value = options[j].value;
                                get(resultObj, name, value);
                            }
                        }
                        ;
                        continue;
                    }

                    value = elem["value"];
                    get(resultObj, name, value);
                }
                ;
            }
            return resultObj;
        }
    })();
    Common["localdata"] = {};

    Common["ajax"] = function (opt) {
        return jQuery.ajax({
            url: opt.url,
            type: opt.type,
            beforeSend: function (XHR) {
                XHR.setRequestHeader("Authorization", "Bearer " + Config.accessToken);
                if (opt.beforeSend) {
                    return opt.beforeSend(XHR)
                }
            },
            async: opt.async || true,
            cache: opt.cache || false,
            //content
            contents: opt.contents,
            context: opt.context,
            contentType: opt.contentType,
            converters: opt.converters,
            crossDomain: opt.crossDomain,
            // data
            dataFilter: opt.dataFilter,
            data: opt.data,
            dataType: opt.dataType,
            global: opt.global,
            // mimeType
            mimeType: opt.mimeType,
            processData: opt.processData,
            // statusCode
            statusCode: opt.statusCode,
            timeout: opt.timeout,
            success: function (data, textStatus, jqXHR) {
                if (data.success) {
                    opt.success && opt.success(data.details, textStatus, jqXHR)
                } else {
                    this.error(jqXHR, textStatus, data.message)
                }
            },
            error: function (XHR, TS, ER) {
                // XMLHttpRequest, textStatus, errorThrown
                var errorInfo = ER || XHR.responseObj && XHR.responseObj.message;
                opt.error && opt.error(errorInfo)
            },
            complete: function (XHR, TS) {
                // XMLHttpRequest, textStatus
                opt.complete && opt.complete(XHR, TS)
            }
        })

    }
    Common["guid"] = (function () {
        var hexDigits = "0123456789abcdef";
        return function (splice) {
            var s = [];
            for (var i = 0; i < 32; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            if (splice) {
                var p = "-"
                s.splice(8, 0, p)
                s.splice(13, 0, p)
                s.splice(18, 0, p)
                s.splice(23, 0, p)
            }
            return s.join("");
        }
    })();
    Common["tip"] = (function () {
        var hasInit = false,
            wrap = null,
            index = 1,
            cache = {};
        /*
         *  opt={
         *      content:'',
         *      delay:2000
         *  }
         */
        function divTip(opt) {
            opt = opt || {};
            var id = index++;
            if (typeof opt == 'string') {
                opt = {
                    text: opt
                }
            }

            param = {
                delay: opt.delay || 2600,
                type: opt.type || "info",
                text: opt.text || ''
            }
            cache[id] = this;
            var that = this,
                timeoutHandle = null,
                div = document.createElement("div"),
                content = document.createElement("div"),
                close = document.createElement("em");
            div.className = "tip tip-" + param.type;
            content.className = "tip-content";
            close.className = "tip-close";
            close.setAttribute("data-id", id);
            div.appendChild(close);
            div.appendChild(content);
            wrap.prepend(div);
            this.remove = function () {
                clearTimeout(timeoutHandle);
                div.parentNode.removeChild(div);
                div = null;
                content = null;
                close = null;
                delete cache[id];
            };
            this.content = function (str) {
                content.innerHTML = str;
            }
            // init
            if (param.text) {
                this.content(param.text)
            }
            if (param.delay !== -1) {
                timeoutHandle = setTimeout(function () {
                    that.remove();
                }, param.delay);
            }
        }

        function init() {
            if (hasInit) {
                return;
            }
            hasInit = true;
            wrap = $("#tipsBox");
            wrap.on("click", ".tip-close", function () {
                var id = this.getAttribute("data-id");
                cache[id].remove();
            })
        }

        return {
            add: function (opt) {
                init();
                return new divTip(opt)
            }
        }
    })();
    Common["formatDate"] = (function () { // jshint ignore:line
        function toInt(str) {
            return parseInt(str, 10) || 0
        }

        function padNumber(num, digits, trim) {
            var neg = ""
            if (num < 0) {
                neg = '-'
                num = -num
            }
            num = "" + num
            while (num.length < digits)
                num = "0" + num
            if (trim)
                num = num.substr(num.length - digits)
            return neg + num
        }

        function dateGetter(name, size, offset, trim) {
            return function (date) {
                var value = date["get" + name]()
                if (offset > 0 || value > -offset)
                    value += offset
                if (value === 0 && offset === -12) {
                    value = 12
                }
                return padNumber(value, size, trim)
            }
        }

        function dateStrGetter(name, shortForm) {
            return function (date, formats) {
                var value = date["get" + name]()
                var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
                return formats[get][value]
            }
        }

        function timeZoneGetter(date) {
            var zone = -1 * date.getTimezoneOffset()
            var paddedZone = (zone >= 0) ? "+" : ""
            paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
            return paddedZone
        }

        //取得上午下午

        function ampmGetter(date, formats) {
            return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
        }

        var DATE_FORMATS = {
            yyyy: dateGetter("FullYear", 4),
            yy: dateGetter("FullYear", 2, 0, true),
            y: dateGetter("FullYear", 1),
            MMMM: dateStrGetter("Month"),
            MMM: dateStrGetter("Month", true),
            MM: dateGetter("Month", 2, 1),
            M: dateGetter("Month", 1, 1),
            dd: dateGetter("Date", 2),
            d: dateGetter("Date", 1),
            HH: dateGetter("Hours", 2),
            H: dateGetter("Hours", 1),
            hh: dateGetter("Hours", 2, -12),
            h: dateGetter("Hours", 1, -12),
            mm: dateGetter("Minutes", 2),
            m: dateGetter("Minutes", 1),
            ss: dateGetter("Seconds", 2),
            s: dateGetter("Seconds", 1),
            sss: dateGetter("Milliseconds", 3),
            EEEE: dateStrGetter("Day"),
            EEE: dateStrGetter("Day", true),
            a: ampmGetter,
            Z: timeZoneGetter
        }
        var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/
        var raspnetjson = /^\/Date\((\d+)\)\/$/

        var locate = {
            AMPMS: {
                0: "上午",
                1: "下午"
            },
            DAY: {
                0: "星期日",
                1: "星期一",
                2: "星期二",
                3: "星期三",
                4: "星期四",
                5: "星期五",
                6: "星期六"
            },
            MONTH: {
                0: "1月",
                1: "2月",
                2: "3月",
                3: "4月",
                4: "5月",
                5: "6月",
                6: "7月",
                7: "8月",
                8: "9月",
                9: "10月",
                10: "11月",
                11: "12月"
            },
            SHORTDAY: {
                "0": "周日",
                "1": "周一",
                "2": "周二",
                "3": "周三",
                "4": "周四",
                "5": "周五",
                "6": "周六"
            },
            fullDate: "y年M月d日EEEE",
            longDate: "y年M月d日",
            medium: "yyyy-M-d H:mm:ss",
            mediumDate: "yyyy-M-d",
            mediumTime: "H:mm:ss",
            "short": "yy-M-d ah:mm",
            shortDate: "yy-M-d",
            shortTime: "ah:mm"
        }
        return function (date, format) {
            var text = "",
                parts = [],
                fn, match
            format = format || "mediumDate"
            format = locate[format] || format
            if (typeof date === "string") {
                if (/^\d+$/.test(date)) {
                    date = toInt(date)
                } else if (raspnetjson.test(date)) {
                    date = +RegExp.$1
                } else {
                    var trimDate = date.trim()
                    var dateArray = [0, 0, 0, 0, 0, 0, 0]
                    var oDate = new Date(0)
                    //取得年月日
                    trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function (_, a, b, c) {
                        var array = c.length === 4 ? [c, a, b] : [a, b, c]
                        dateArray[0] = toInt(array[0]) //年
                        dateArray[1] = toInt(array[1]) - 1 //月
                        dateArray[2] = toInt(array[2]) //日
                        return ""
                    })
                    var dateSetter = oDate.setFullYear
                    var timeSetter = oDate.setHours
                    trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function (_, a, b, c, d) {
                        dateArray[3] = toInt(a) //小时
                        dateArray[4] = toInt(b) //分钟
                        dateArray[5] = toInt(c) //秒
                        if (d) { //毫秒
                            dateArray[6] = Math.round(parseFloat("0." + d) * 1000)
                        }
                        return ""
                    })
                    var tzHour = 0
                    var tzMin = 0
                    trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function (z, symbol, c, d) {
                        dateSetter = oDate.setUTCFullYear
                        timeSetter = oDate.setUTCHours
                        if (symbol) {
                            tzHour = toInt(symbol + c)
                            tzMin = toInt(symbol + d)
                        }
                        return ""
                    })

                    dateArray[3] -= tzHour
                    dateArray[4] -= tzMin
                    dateSetter.apply(oDate, dateArray.slice(0, 3))
                    timeSetter.apply(oDate, dateArray.slice(3))
                    date = oDate
                }
            }
            if (typeof date === "number") {
                date = new Date(date)
            }
            if (avalon.type(date) !== "date") {
                return
            }
            while (format) {
                match = rdateFormat.exec(format)
                if (match) {
                    parts = parts.concat(match.slice(1))
                    format = parts.pop()
                } else {
                    parts.push(format)
                    format = null
                }
            }
            parts.forEach(function (value) {
                fn = DATE_FORMATS[value]
                text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            })
            return text
        }
    })();
    Common["query"] = (function () {
        return new function () {
            var that = this;
            this.get = function (queryStr, name) {

                var obj = {};
                var str = decodeURI(queryStr)
                var search = str.split("&");
                for (var i = 0; i < search.length; i++) {
                    var kv = search[i].split("=");
                    if (kv[0]) {
                        obj[kv[0]] = kv[1];
                    }
                }
                ;
                return name ? obj[name] : obj;
            }
            this.set = function (name, value) {
                var obj = that.get(),
                    hashStr = [];
                if (typeof name == 'string') {

                    obj[name] = value;
                } else if (typeof name == 'object') {
                    for (var i in name) {
                        obj[i] = name[i];
                    }
                } else {
                    return
                }
                for (var i in obj) {
                    hashStr.push(i + '=' + obj[i]);
                }
                // location.hash = hashStr.join("&");
                return hashStr.join("&");

            }
        }

    })();

    Common["log"] = (function () {
        /**
         * 插入本地timeLine日志表，动作说明
         * type说明：
         * 动作名称     动作编码    动作说明             参数格式*/
        var hash = {
            "receive": 1, //接听电话动作       来电号码：phoneNo
            "addCust": 2, //新增客户          客户名称： name，联系电话：phoneNo
            "editCust": 3, //修改客户          客户名称：name
            "dial": 4, //拨打电话          拨打电话的号码：phoneNo
            "saveDraft": 5, //保存草稿         （无需传参）
            "submitTask": 6, //提交任务         创建来源source(传选中的文字内容)，处理方法processingWay（checkbox的文字内容）
            "sendMsg": 7, //发送短信         发送的号码：phoneNo，短信内容content
            "revisit": 8, //回访动作         回访号码phoneNo
            "overTask": 9, //任务完成/取消     （无需传参）
            "supTask": 10, //任务追加         追加内容content
            "getTask": 11, //获取任务         （无需传参）
            "abnormalDial": 12, //任务升级拨打电话动作  被呼叫人姓名name,呼叫号码phoneNo
            "abnormalTaskType": 13, //任务升级后修改任务类型 （无需传参）
        }
        /* 通用参数为cTime(动作发生时间)
         * 例如1号动作，参数格式为cTime,phoneNo
         * 5号动作，参数格式为cTime
         */
        return function (action, param) {
            var actCode = hash[action],
                data = param || {}
            if (!actCode) {
                return;
            }
            if (window.console) {
                console.log(action, data);
            }

            data.cTime = Common.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
            data.actCode = actCode
            return Common.ajax({
                url: Config.ajaxPath + '',
                type: "POST",
                data: data,
                success: function () {
                },
                error: function () {
                },
                complete: function () {
                }
            })
        }
    })();
    Common["event"] = (function () {
        var cache = {};

        function add(eventName, callback, once) {
            if (!cache[eventName]) {
                cache[eventName] = [];
            }
            cache[eventName].push(callback);
            callback.once = !!once;
        }

        function trigger(eventName, data) {
            if (cache[eventName]) {
                var len = cache[eventName].length;
                var func = null,
                    once = false;
                for (var i = 0; i < len; i++) {
                    func = cache[eventName][i];
                    func(data);
                    if (func.once) {
                        cache[eventName].splice(i, 1); //delete event callback
                        len--;
                    }
                }
            }
        }

        return {
            add: add,
            trigger: trigger
        }
    })();
    Common["cache"] = (function () {
        var cache = {};

        function set(key, value) {
            cache[key] = value;
        }

        function get(key) {
            return cache[key];
        }

        return {
            get: get,
            set: set
        }
    })();
})(window.Common = window.Common || {});