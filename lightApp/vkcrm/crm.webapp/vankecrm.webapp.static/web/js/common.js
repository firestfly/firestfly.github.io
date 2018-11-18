window.Common = {};

/*
 * 页面头部
 */
(function () {
    var jq_headerMenu = $("#headerMenu"),
        jq_headerMenuBox = $("#headerMenuBox");
    jq_headerMenu.on("click", function () {
        jq_headerMenuBox.toggleClass("on");
    })
    jq_headerMenuBox.on("click", function () {
        jq_headerMenuBox.removeClass("on");
    })

})();

(function (console) {
    console.log = console.log || function () {
        };
    console.error = console.error || function () {
        };
    console.dir = console.dir || function () {
        };
})(window.console = window.console || {});

var isIE = function (ver) {
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
};

/**
 * 滚动条，需要配合 unLoading
 * @param {} opt opt[0] 显示文本，opt[1] 滚动div class
 * @return {}
 */
var loadingNeedUnloadDiv;
var loadingNeedUnloadSpan;
Common.loadingNeedUnload = function (opt) {
    return new function () {
        var opts = opt || {}
        loadingNeedUnloadDiv = document.createElement("div");
        loadingNeedUnloadSpan = document.createElement("span");
        loadingNeedUnloadDiv.className = "loadcover";
        loadingNeedUnloadDiv.appendChild(loadingNeedUnloadSpan);
        if (opts.text) {
            loadingNeedUnloadSpan.innerHTML = opts.text;
        }
        if (opts.container) {
            $(opts.container).append(loadingNeedUnloadDiv);
        }
    }
};
/**
 * 取消 unLoading
 * @return {}
 */
Common.unLoading = function () {
    return new function () {
        if (loadingNeedUnloadDiv && loadingNeedUnloadDiv.parentNode) {
            loadingNeedUnloadDiv.parentNode.removeChild(loadingNeedUnloadDiv);
            loadingNeedUnloadDiv = null;
            loadingNeedUnloadSpan = null;
        }
    }
};


/*(function($) {
 $.ajaxSetup({
 statusCode: {
 "500": function(res) {
 console.log("500", res["responseJSON"]||res["responseText"]);
 }
 }
 })
 })(jQuery);*/

Common.ajax = function (opt) {
    /*
     * 因为IE8下的跨域请求数据返回Access Defined,所以IE8需要在跨域情况下使用XDomainRequest,
     * jQuery默认不支持,所以需要额外引用jquery.xdomainrequest.min.js
     * 貌似跨域请求时Header的Authorization的认证信息带不过去,所以需要将access_token放在URL参数中
     * 后续可能需要改进
     * */
    opt.crossDomain = true;
    if (opt.crossDomain && isIE(8)) {
        if (opt.url.indexOf('?') < 0) {
            opt.url = opt.url + "?";
        } else {
            opt.url = opt.url + "&";
        }
        opt.url = opt.url + "access_token=" + Common.cookie("access_token");
        opt.url = opt.url + "&_=" + new Date().getTime();
        if (opt.type == 'POST' || opt.type == 'post') {
            return $.ajax({
                url: opt.url,
                data: opt.data,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                type: 'POST',
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                    opt.success && opt.success(data, textStatus, jqXHR)
                },
                error: function (XHR, TS, ER) {
                    var data = XHR.responseJSON || {};
                    opt.error && opt.error(data);
                    console.error(XHR.statusText);
                },
                complete: function (XHR, TS) {
                    opt.complete && opt.complete(XHR, TS)
                }
            });
        } else if (opt.type == 'GET' || opt.type == 'get') {
            if (opt.data) {
                opt.url = opt.url + '&' + $.param(opt.data, true);
            }
            return $.getJSON(opt.url).done(function (data) {
                opt.success && opt.success(data);
            });
        } else {
            console.error("当前浏览器不支持该请求");
            return false;
        }
    }
    return $.ajax({
        url: opt.url,
        type: opt.type,
        beforeSend: function (XHR) {
            var access_token = Common.cookie("access_token");
            XHR.setRequestHeader("Authorization", "Bearer " + access_token);
            if (opt.beforeSend) {
                return opt.beforeSend(XHR)
            }
        },
        cache: false,
        //content
        contents: opt.contents,
        context: opt.context,
        contentType: opt.contentType,
        converters: opt.converters,
        crossDomain: true,
        // data
        dataFilter: opt.dataFilter,
        data: opt.data,
        dataType: opt.dataType,
        global: opt.global,
        // mimeType
        mimeType: opt.mimeType,
        processData: opt.processData,
        // statusCode;
        statusCode: opt.statusCode,
        timeout: opt.timeout,
        success: function (data, textStatus, jqXHR) {
            opt.success && opt.success(data, textStatus, jqXHR)
        },
        error: function (XHR, TS, ER) {
            var data = XHR.responseJSON || {};
            opt.error && opt.error(data);
            console.error(XHR.statusText);
            // XMLHttpRequest, textStatus, errorThrown
        },
        complete: function (XHR, TS) {
            // XMLHttpRequest, textStatus
            opt.complete && opt.complete(XHR, TS)
        }
    })

}
/*
 * 导航设定
 */
Common.navigation = function (wrapId, onchange, opt) {
    var jq_wrap = $(wrapId),
        onchange = onchange,
        activeClass = opt && opt.activeClass || 'active',
        trigger = opt && opt.trigger || 'a' //触发标签

    jq_wrap.on("click", trigger, function (event) {
        var that = $(this),
            li = that.parent(),
            liSibling = li.siblings(),
            href = that.attr("href"),
            target = $(href),
            siblings = target.siblings();
        if (li.hasClass(activeClass)) {
            return false;
        }
        liSibling.removeClass(activeClass);
        li.addClass(activeClass);
        siblings.removeClass(activeClass);
        target.addClass(activeClass);
        onchange && onchange(event, this);
        return false;
    })

    function fire(index) {
        index = index || 0;
        jq_wrap.find("a:first").trigger("click");
    }

    return {
        fire: fire
    }
};
Common.cookie = function (key, value, options) {
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

Common.hash = (function () {
    return new function () {
        var that = this;
        this.get = function (name) {

            var obj = {};
            var str = decodeURI(location.hash)
            var index = str.lastIndexOf("#");
            var search = str.substr(index + 1).split("&");
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
            location.hash = hashStr.join("&");

        }
    }

})();
Common.getFormData = (function () {
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
Common.setFormData = (function () {

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
                    data[name] = data[name] + '';
                    if (type == 'select' && type.multiple) {
                        // {select:'1,2,3,4,5'}
                        var arr = data[name].split(config.space);
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
Common.loading = function (opt) {
    return new function () {

        var opts = opt || {}
        var div = document.createElement("div"),
            span = document.createElement("span");
        div.className = "loadcover";
        div.appendChild(span);

        function removeCover() {
            if (div && div.parentNode) {
                div.parentNode.removeChild(div);
                div = null;
                span = null;
            }
        }

        if (opts.text) {
            span.innerHTML = opts.text;
        }
        if (opts.container) {
            $(opts.container).append(div);
        }
        if (opts.handle && opts.handle.always) {
            opts.handle.always(removeCover)
        }
        this.remove = removeCover;
    }
};
Common.tip = (function () {
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
        var param = {
            delay: opt.delay || 3500,
            type: opt.type || "info",
            text: opt.text || ''
        }
        cache[id] = this;
        var that = this,
            timeoutHandle = null,
            div = document.createElement("div"),
            content = document.createElement("div"),
            close = document.createElement("i"),
            labelContent = document.createElement("span");
        div.className = "tip tip-" + param.type;
        content.className = "tip-content";
        close.className = "tip-close";
        close.setAttribute("data-id", id);
        content.appendChild(close);
        content.appendChild(labelContent)
        div.appendChild(content);
        wrap.prepend(div);
        this.remove = function () {
            clearTimeout(timeoutHandle);
            if (div && div.parentNode) {
                div.parentNode.removeChild(div);
                div = null;
                content = null;
                close = null;
                delete cache[id];
            }
        };
        this.content = function (str) {
            labelContent.innerText = str;
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
        if (wrap.length == 0) {
            $("body").append("<div class='tips-box' id='tipsBox'></div>");
            wrap = $("#tipsBox");
        }
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
Common.pagination = (function ($) {
    /*
     *  pagination
     *   (function() {
     *      if (window.Pagination) {
     *          var p = new Pagination({
     *              template: "#paginationtmpl",
     *              selector: "#pagination",
     *              onchange: function(pageInfo) {
     *                  console.log(pageInfo)
     *              }
     *          });
     *          p.render({
     *              curpage: 12,
     *              pagesize: 2,
     *              totalpage: 20,
     *              totalsize: 2
     *          })
     *      }
     *  });
     */

    var leftCount = 1,
        rightCount = 1,
        centerCount = 2;

    function pager(opt) {
        this.selector = $(opt.selector);
        this.startpage = opt.startpage || 1;
        this.curpage = opt.curpage || this.startpage;
        this.totalpage = opt.totalpage || 1;
        this.onchange = opt.onchange;
        this._bindEvent();
        this._tempFunc = template.compile($(opt.template).html())
    }

    pager.prototype.change = function () {
        var that = this;
        this.onchange && this.onchange({
            curpage: that.curpage,
            pagesize: that.pagesize
        })
    }
    pager.prototype.render = function (page) {
        var that = this;
        that.pagesize = page.pagesize;
        that.curpage = page.curpage;
        that.totalpage = page.totalpage;
        var data = {
            hasRight: page.curpage + centerCount < page.totalpage - rightCount ? (page.curpage + centerCount + 1) : false,
            hasLeft: page.curpage - centerCount > leftCount + 1 ? (page.curpage - centerCount - 1) : false,
            hasPrev: page.curpage == that.startpage,
            hasNext: page.curpage == page.totalpage,
            left: [],
            right: [],
            center: []
        };

        var leftEnd = (page.curpage - centerCount - 1) > leftCount ? leftCount : (page.curpage - centerCount - 1),
            rightStart = (page.curpage + centerCount) < (page.totalpage - rightCount) ? (page.totalpage - rightCount + 1) : (page.curpage + centerCount + 1),
            centerStart = (page.curpage - centerCount) > 0 ? (page.curpage - centerCount) : 1,
            centerEnd = (page.curpage + centerCount) < page.totalpage ? (page.curpage + centerCount) : page.totalpage;

        for (var i = 1; i <= leftEnd; i++) {
            data.left.push({
                index: i
            });
        }
        ;
        for (var i = rightStart; i <= page.totalpage; i++) {
            data.right.push({
                index: i
            });
        }
        ;
        for (var i = centerStart; i <= centerEnd; i++) {
            data.center.push({
                index: i,
                isCurrent: i == page.curpage
            })
        }
        ;
        var htmlStr = this._tempFunc(data);
        this.selector.html(htmlStr);

    }

    pager.prototype._bindEvent = function () {
        var that = this;
        this.selector.on("click", "li", function () {
            var li = $(this),
                index = li.attr("data-index");
            if (index == '-1') {
                that.curpage--;
            } else if (index == '+1') {
                that.curpage++;
            } else {
                that.curpage = parseInt(index);
            }
            if (that.curpage < that.startpage) {
                that.curpage == that.startpage;
            }
            if (that.curpage > that.totalpage) {
                that.curpage = that.totalpage;
            }
            that.change();
            return false;
        })

    }
    return pager;
})(jQuery);