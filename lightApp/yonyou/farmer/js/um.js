$(function () {
    /* 远程调试
    (function(e){
      e.setAttribute("src","http://10.2.112.107:8080/target/target-script-min.js#anonymous");
      document.getElementsByTagName("body")[0].appendChild(e);
    })(document.createElement("script"));*/
    /* 折叠菜单 */
    +function ($) {
        'use strict';
        var openBtn = '.collapse-btn';
        var collapse = function (e) {
            var openList;
            var targetName = $(this).data("target");
            openList = targetName ? $("#" + targetName) : $(this).siblings(".collapse-content");
            if (openList.is(":visible")) {
                openList.slideUp("fast");
                openList.parent().removeClass("um-open");
                openList.trigger("collapse.close");
            } else {
                openList.slideDown("fast");
                openList.parent().addClass("um-open");
                openList.trigger("collapse.open");
            }
            e.preventDefault();
        }
        $(document).on('click', openBtn, collapse);
    }(jQuery);


    /* 搜索框效果
    +function ($) {
          'use strict';
          var input = 'input.um-input-center-icon[type="search"]';
          var act =  'background-position:8px 50%;padding-left:30px;'
          var searchText = function (e) {
                var ab = $("<span></span>",{text:this.placeholder});
                $("body").append(ab);
                var pw = ab.width();
                ab.remove();
                this.style.cssText = this.value?act:'background-position: ' +
                 ($(this).width() / 2 - (pw / 2) + 30) + 'px 50%;padding-left: 0;';
          }
          $(document)
          .on('blur',input,searchText)
          .on("focus",input,function(){
                this.style.cssText = act;
          });
          $(input).blur();
    }(jQuery);
*/
    /* swipe tab bar */
    +function ($) {
        'use strict';
        var tabbar = $('[data-action="swipeTab"]');
        $.each(tabbar, function (i, e) {
            var bar = $(this).find("li");
            var targetName = tabbar.eq(i).data("target");
            var target = document.getElementById(targetName);
            window["swipe" + i] = Swipe(target, {
                // startSlide: 4,
                // auto: 3000,
                // continuous: true,
                // disableScroll: true,
                // stopPropagation: true,
                //transitionEnd: function(index, element) {},
                callback: function (index, element) {
                    bar.removeClass("active").eq(index).addClass("active");
                }
            });
            bar.on("touchstart mousedown", function () {
                var e = $(this).closest("li").index();
                window["swipe" + i].slide(e, 200);
            })
        });
    }(jQuery);

    /* 模态框 */
    +function ($) {
        'use strict';
        var modalBtn = $('[data-action="modal"]');
        $.each(modalBtn, function (i, e) {
            var targetName = $(this).data("target");
            var target = $("#" + targetName);

            var overlay = $('<div class="overlay"></div>');
            $(this).on("click", function () {
                if (!target.length || !target.hasClass("um-modal")) {
                    alert("请设置一个正确的模态框窗口");
                    return;
                }
                $("body").append(overlay);
                target.addClass("um-modal-in");
            });
            overlay.add(target.find(".btn")).click(function () {
                target.removeClass("um-modal-in").addClass("um-modal-out");
                setTimeout(function () {
                    target.removeClass("um-modal-out");
                }, 300)
                overlay.remove();
            });
        });

        function _UModal() {
            var that = this;
            var title = window.location.host || "来自外星的对话";
            this.defaultOptions = {
                title: title,
                text: "觉得咋样？",
                btnText: ["确定", "取消"],
                cancle: function () {
                },
                ok: function (data) {
                }
            }
        }

        _UModal.countWindow = 0;
        _UModal.prototype.modal = function (type, options) {
            _UModal.countWindow++;
            var overlay = $('<div class="overlay"></div>');
            var _opt = $.extend(this.defaultOptions);
            if (!!options) {
                _opt = $.extend(_opt, options);
            }
            var isStr = options.constructor === String;
            var html = '<div class="um-modal"><div class="um-modal-content"><div class="um-modal-title">' +
                (isStr ? "" : _opt.title) + '</div><div class="um-modal-text">' +
                (isStr ? options : _opt.text) + '</div>';
            if (type === "prompt") {
                html += '<div class="um-modal-input">' +
                    '<input type="text" class="form-control"></div>';
            }
            if (type === "login") {
                html += '<div class="um-modal-input">' +
                    '<input type="text" class="form-control">' +
                    '<input type="text" class="form-control"></div>';
            }
            html += '</div><div class="um-modal-btns">';
            if (type === "confirm" || type === "login") {
                html += '<a href="##" class="btn cancle">' + _opt.btnText[1] + '</a>';
            }

            html += '<a href="##" class="btn ok">' + _opt.btnText[0] +
                '</a></div></div>';

            var overlay = overlay.appendTo($("body"));
            var modal = $(html).appendTo($("body"));
            var modalH = modal.outerHeight(),
                wh = window.innerHeight;
            modal.css("top", (wh - modalH - 20) / 2)
            setTimeout(function () {
                modal.addClass("um-modal-in");
            }, 0);

            modal.on("click", ".btn", function (e) {
                e.preventDefault();
                if ($(this).hasClass("cancle")) {
                    _opt.cancle();
                }
                if ($(this).hasClass("ok")) {
                    var input = modal.find(".form-control"), inputLen = input.length, data;
                    if (inputLen > 0) {
                        if (inputLen == 1) data = modal.find(".form-control").val();
                        else {
                            data = [];
                            $.each(input, function () {
                                data.push(this.value);
                            })
                        }
                    }
                    _opt.ok(data);
                }

                modal.removeClass("um-modal-in").addClass("um-modal-out");

                modal.on("webkitTransitionEnd transitionEnd", function () {
                    modal.removeClass("um-modal-out");
                    modal.remove();
                    _UModal.countWindow--;
                })
                // 避免遮罩闪烁
                if (_UModal.countWindow > 0) {
                    overlay.remove();
                }
                return false;
            })
        }
        _UModal.prototype.alert = function (options) {
            this.modal("alert", options || this.defaultOptions);
        }
        _UModal.prototype.confirm = function (options) {
            this.modal("confirm", options || this.defaultOptions);
        }
        _UModal.prototype.prompt = function (options) {
            this.modal("prompt", options || this.defaultOptions);
        }
        _UModal.prototype.login = function (options) {
            this.modal("login", options || this.defaultOptions);
        }
        window.UModal = new _UModal();
        $(".um-header").on("dblclick", function () {
            UModal.alert({
                ok: function (d) {
                    UModal.login({
                        ok: function (data) {
                            console.log(data)
                        }
                    })
                }
            })
        })
    }(jQuery);


    /* 表格 */
    +function ($) {
        var table_container = $(".um-table-container");
        if (table_container.length) {
            var init = function () {
                $.each(table_container, function () {
                    var $this = $(this),
                        row_w = $this.find(".um-tb-data").data("row-width"),
                        parent_w = $this.find(".um-tb-body").innerWidth(),
                        left_w = $this.find(".um-tb-body-left").outerWidth() || 0,
                        data_w = parent_w - left_w;

                    var isRow = $this.hasClass("table-row-scroll"),//固定列，行滚动
                        isCol = $this.hasClass("table-col-scroll");//固定行，列滚动

                    if (isCol) {
                        $this.find(".um-tb-body-left,.um-tb-data").height("auto");
                    }
                    if (isRow) {
                        $this.find(".um-tb-data").css("overflow-x", "hidden");
                    }

                    $this.find(".um-tb-header-title table,.um-tb-data-table").width(Math.max(data_w, row_w));
                })
            }
            init();
            window.addEventListener("resize", init);
            $(".um-tb-data").on("scroll", function () {
                var table_container = $(this).closest(".um-table-container");
                var s1 = table_container.find(".um-tb-body-left")[0],
                    s2 = table_container.find(".um-tb-header-title")[0];

                s1 && (s1.children[0].style.top = "-" + this.scrollTop + "px");
                s2 && (s2.children[0].style.left = "-" + this.scrollLeft + "px");
            })
        }
    }(jQuery);
})


;(function (gb) {
    function UMAPP() {

    }

    window.UMAPP = new UMAPP;
})(window, undefined)


/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
*/

function Swipe(container, options) {

    "use strict";

    // utilities
    var noop = function () {
    }; // simple no operation function
    var offloadFn = function (fn) {
        setTimeout(fn || noop, 0)
    }; // offload a functions execution

    // check browser capabilities
    var browser = {
        addEventListener: !!window.addEventListener,
        touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        transitions: (function (temp) {
            var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
            for (var i in props) if (temp.style[props[i]] !== undefined) return true;
            return false;
        })(document.createElement('swipe'))
    };

    // quit if no root element
    if (!container) return;
    var element = container.children[0];
    var slides, slidePos, width, length;
    options = options || {};
    var index = parseInt(options.startSlide, 10) || 0;
    var speed = options.speed || 300;
    options.continuous = options.continuous !== undefined ? options.continuous : true;

    function setup() {

        // cache slides
        slides = element.children;
        length = slides.length;

        // set continuous to false if only one slide
        if (slides.length < 2) options.continuous = false;

        //special case if two slides
        if (browser.transitions && options.continuous && slides.length < 3) {
            element.appendChild(slides[0].cloneNode(true));
            element.appendChild(element.children[1].cloneNode(true));
            slides = element.children;
        }

        // create an array to store current positions of each slide
        slidePos = new Array(slides.length);

        // determine width of each slide
        width = container.getBoundingClientRect().width || container.offsetWidth;

        element.style.width = (slides.length * width) + 'px';

        // stack elements
        var pos = slides.length;
        while (pos--) {

            var slide = slides[pos];

            slide.style.width = width + 'px';
            slide.setAttribute('data-index', pos);

            if (browser.transitions) {
                slide.style.left = (pos * -width) + 'px';
                move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
            }

        }

        // reposition elements before and after index
        if (options.continuous && browser.transitions) {
            move(circle(index - 1), -width, 0);
            move(circle(index + 1), width, 0);
        }

        if (!browser.transitions) element.style.left = (index * -width) + 'px';

        container.style.visibility = 'visible';

    }

    function prev() {

        if (options.continuous) slide(index - 1);
        else if (index) slide(index - 1);

    }

    function next() {

        if (options.continuous) slide(index + 1);
        else if (index < slides.length - 1) slide(index + 1);

    }

    function circle(index) {

        // a simple positive modulo using slides.length
        return (slides.length + (index % slides.length)) % slides.length;

    }

    function slide(to, slideSpeed) {

        // do nothing if already on requested slide
        if (index == to) return;

        if (browser.transitions) {

            var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

            // get the actual position of the slide
            if (options.continuous) {
                var natural_direction = direction;
                direction = -slidePos[circle(to)] / width;

                // if going forward but to < index, use to = slides.length + to
                // if going backward but to > index, use to = -slides.length + to
                if (direction !== natural_direction) to = -direction * slides.length + to;

            }

            var diff = Math.abs(index - to) - 1;

            // move all the slides between index and to in the right direction
            while (diff--) move(circle((to > index ? to : index) - diff - 1), width * direction, 0);

            to = circle(to);

            move(index, width * direction, slideSpeed || speed);
            move(to, 0, slideSpeed || speed);

            if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place

        } else {

            to = circle(to);
            animate(index * -width, to * -width, slideSpeed || speed);
            //no fallback for a circular continuous if the browser does not accept transitions
        }

        index = to;
        offloadFn(options.callback && options.callback(index, slides[index]));
    }

    function move(index, dist, speed) {

        translate(index, dist, speed);
        slidePos[index] = dist;

    }

    function translate(index, dist, speed) {

        var slide = slides[index];
        var style = slide && slide.style;

        if (!style) return;

        style.webkitTransitionDuration =
            style.MozTransitionDuration =
                style.msTransitionDuration =
                    style.OTransitionDuration =
                        style.transitionDuration = speed + 'ms';

        style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        style.msTransform =
            style.MozTransform =
                style.OTransform = 'translateX(' + dist + 'px)';

    }

    function animate(from, to, speed) {

        // if not an animation, just reposition
        if (!speed) {

            element.style.left = to + 'px';
            return;

        }

        var start = +new Date;

        var timer = setInterval(function () {

            var timeElap = +new Date - start;

            if (timeElap > speed) {

                element.style.left = to + 'px';

                if (delay) begin();

                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                clearInterval(timer);
                return;

            }

            element.style.left = (((to - from) * (Math.floor((timeElap / speed) * 100) / 100)) + from) + 'px';

        }, 4);

    }

    // setup auto slideshow
    var delay = options.auto || 0;
    var interval;

    function begin() {

        interval = setTimeout(next, delay);

    }

    function stop() {

        delay = 0;
        clearTimeout(interval);

    }


    // setup initial vars
    var start = {};
    var delta = {};
    var isScrolling;

    // setup event capturing
    var events = {

        handleEvent: function (event) {

            switch (event.type) {
                case 'touchstart':
                    this.start(event);
                    break;
                case 'touchmove':
                    this.move(event);
                    break;
                case 'touchend':
                    offloadFn(this.end(event));
                    break;
                case 'webkitTransitionEnd':
                case 'msTransitionEnd':
                case 'oTransitionEnd':
                case 'otransitionend':
                case 'transitionend':
                    offloadFn(this.transitionEnd(event));
                    break;
                case 'resize':
                    offloadFn(setup);
                    break;
            }

            if (options.stopPropagation) event.stopPropagation();

        },
        start: function (event) {

            var touches = event.touches[0];

            // measure start values
            start = {

                // get initial touch coords
                x: touches.pageX,
                y: touches.pageY,

                // store time to determine touch duration
                time: +new Date

            };

            // used for testing first move event
            isScrolling = undefined;

            // reset delta and end measurements
            delta = {};

            // attach touchmove and touchend listeners
            element.addEventListener('touchmove', this, false);
            element.addEventListener('touchend', this, false);

        },
        move: function (event) {

            // ensure swiping with one touch and not pinching
            if (event.touches.length > 1 || event.scale && event.scale !== 1) return

            if (options.disableScroll) event.preventDefault();

            var touches = event.touches[0];

            // measure change in x and y
            delta = {
                x: touches.pageX - start.x,
                y: touches.pageY - start.y
            }

            // determine if scrolling test has run - one time test
            if (typeof isScrolling == 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
            }

            // if user is not trying to scroll vertically
            if (!isScrolling) {

                // prevent native scrolling
                event.preventDefault();

                // stop slideshow
                stop();

                // increase resistance if first or last slide
                if (options.continuous) { // we don't add resistance at the end

                    translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);

                } else {

                    delta.x =
                        delta.x /
                        ((!index && delta.x > 0               // if first slide and sliding left
                            || index == slides.length - 1        // or if last slide and sliding right
                            && delta.x < 0                       // and if sliding at all
                        ) ?
                            (Math.abs(delta.x) / width + 1)      // determine resistance level
                            : 1);                                 // no resistance if false

                    // translate 1:1
                    translate(index - 1, delta.x + slidePos[index - 1], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(index + 1, delta.x + slidePos[index + 1], 0);
                }

            }

        },
        end: function (event) {

            // measure duration
            var duration = +new Date - start.time;

            // determine if slide attempt triggers next/prev slide
            var isValidSlide =
                Number(duration) < 250               // if slide duration is less than 250ms
                && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
                || Math.abs(delta.x) > width / 2;      // or if slide amt is greater than half the width

            // determine if slide attempt is past start and end
            var isPastBounds =
                !index && delta.x > 0                            // if first slide and slide amt is greater than 0
                || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

            if (options.continuous) isPastBounds = false;

            // determine direction of swipe (true:right, false:left)
            var direction = delta.x < 0;

            // if not scrolling vertically
            if (!isScrolling) {

                if (isValidSlide && !isPastBounds) {

                    if (direction) {

                        if (options.continuous) { // we need to get the next in this direction in place

                            move(circle(index - 1), -width, 0);
                            move(circle(index + 2), width, 0);

                        } else {
                            move(index - 1, -width, 0);
                        }

                        move(index, slidePos[index] - width, speed);
                        move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
                        index = circle(index + 1);

                    } else {
                        if (options.continuous) { // we need to get the next in this direction in place

                            move(circle(index + 1), width, 0);
                            move(circle(index - 2), -width, 0);

                        } else {
                            move(index + 1, width, 0);
                        }

                        move(index, slidePos[index] + width, speed);
                        move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
                        index = circle(index - 1);

                    }

                    options.callback && options.callback(index, slides[index]);

                } else {

                    if (options.continuous) {

                        move(circle(index - 1), -width, speed);
                        move(index, 0, speed);
                        move(circle(index + 1), width, speed);

                    } else {

                        move(index - 1, -width, speed);
                        move(index, 0, speed);
                        move(index + 1, width, speed);
                    }

                }

            }

            // kill touchmove and touchend event listeners until touchstart called again
            element.removeEventListener('touchmove', events, false)
            element.removeEventListener('touchend', events, false)

        },
        transitionEnd: function (event) {

            if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

                if (delay) begin();

                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

            }

        }

    }

    // trigger setup
    setup();

    // start auto slideshow if applicable
    if (delay) begin();


    // add event listeners
    if (browser.addEventListener) {

        // set touchstart event on element
        if (browser.touch) element.addEventListener('touchstart', events, false);

        if (browser.transitions) {
            element.addEventListener('webkitTransitionEnd', events, false);
            element.addEventListener('msTransitionEnd', events, false);
            element.addEventListener('oTransitionEnd', events, false);
            element.addEventListener('otransitionend', events, false);
            element.addEventListener('transitionend', events, false);
        }

        // set resize event on window
        window.addEventListener('resize', events, false);

    } else {

        window.onresize = function () {
            setup()
        }; // to play nice with old IE

    }

    // expose the Swipe API
    return {
        setup: function () {

            setup();

        },
        slide: function (to, speed) {

            // cancel slideshow
            stop();

            slide(to, speed);

        },
        prev: function () {

            // cancel slideshow
            stop();

            prev();

        },
        next: function () {

            // cancel slideshow
            stop();

            next();

        },
        stop: function () {

            // cancel slideshow
            stop();

        },
        getPos: function () {

            // return current index position
            return index;

        },
        getNumSlides: function () {

            // return total number of slides
            return length;
        },
        kill: function () {

            // cancel slideshow
            stop();

            // reset element
            element.style.width = '';
            element.style.left = '';

            // reset slides
            var pos = slides.length;
            while (pos--) {

                var slide = slides[pos];
                slide.style.width = '';
                slide.style.left = '';

                if (browser.transitions) translate(pos, 0, 0);

            }

            // removed event listeners
            if (browser.addEventListener) {

                // remove current event listeners
                element.removeEventListener('touchstart', events, false);
                element.removeEventListener('webkitTransitionEnd', events, false);
                element.removeEventListener('msTransitionEnd', events, false);
                element.removeEventListener('oTransitionEnd', events, false);
                element.removeEventListener('otransitionend', events, false);
                element.removeEventListener('transitionend', events, false);
                window.removeEventListener('resize', events, false);

            }
            else {

                window.onresize = null;

            }

        }
    }

}


if (window.jQuery || window.Zepto) {
    (function ($) {
        $.fn.Swipe = function (params) {
            return this.each(function () {
                $(this).data('Swipe', new Swipe($(this)[0], params));
            });
        }
    })(window.jQuery || window.Zepto)
}
