+function ($) {
    'use strict';

    function _UModal() {
        var title = window.location.host || "";
        this.countWindow = 0;
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

    _UModal.prototype.modal = function (type, options) {
        var that = this;
        that.countWindow++;
        var overlay = $('<div class="overlay"></div>');
        var _opt = $.extend(that.defaultOptions);

        if (!!options) {
            _opt = $.extend(_opt, options);
        }

        var isStr = options.constructor === String,
            isTips = type === "tips";

        var html;
        if (isStr) {
            html = '<div class="modal"><div class="modal-content"><div class="modal-text">' +
                options + '</div>';
        } else {
            html = '<div class="modal"><div class="modal-content"><div class="modal-title">' +
                _opt.title + '</div><div class="modal-text">' +
                _opt.text + '</div>';
        }

        if (type === "prompt") {
            html += `<div class="modal-input">
                        <input type="text" class="form-control"></div>`;
        }
        if (type === "login") {
            html += `<div class="modal-input">
                        <input type="text" class="form-control">
                        <input type="text" class="form-control"></div>`;
        }

        isTips ? html += '</div>' : html += '</div><div class="modal-btns">';

        if (type === "confirm" || type === "login") {
            html += '<a href="##" class="btn cancle">' + _opt.btnText[1] + '</a>';
        }

        if (isTips) {
            html += '</div>';
        } else {
            html += '<a href="##" class="btn ok">' + _opt.btnText[0] +
                '</a></div></div>';
        }

        if (type === "loading") {
            html = `<div class="modal" style="overflow:visible;">
                    <div class="loading">
                        <div></div>
                        <div></div>
                      </div>
                    </div>`;
        }

        overlay = overlay.appendTo($('body'));
        var modal = $(html).appendTo($('body')),
            modalH = modal.outerHeight(),
            wh = window.innerHeight;
        modal.css('top', (wh - modalH - 20) / 2);
        setTimeout(function () {
            modal.addClass('modal-in');
        }, 0);
        that.destory = destory;
        if (type === 'tips' || type === 'loading') {
            var delay = Number(arguments[2]);
            if (typeof arguments[3] == 'function') var callback = arguments[3];
            if ('' + delay !== 'NaN') {
                setTimeout(function () {
                    that.destory();
                    callback();
                }, delay)
            }
            return;
        }
        modal.on('click', '.btn', function (e) {
            e.preventDefault();
            if ($(this).hasClass('cancle')) {
                _opt.cancle();
            }
            if ($(this).hasClass('ok')) {
                var input = modal.find('.form-control'),
                    inputLen = input.length,
                    data;
                if (inputLen) {
                    if (inputLen == 1) data = modal.find('.form-control').val();
                    else {
                        data = [];
                        $.each(input, function () {
                            data.push(this.value);
                        })
                    }
                }
                _opt.ok(data);
            }
            destory();
        })

        function destory() {
            modal.removeClass('modal-in').addClass('modal-out');
            modal.on('webkitTransitionEnd MSTransitionEnd transitionEnd', function () {
                modal.removeClass('modal-out');
                modal.remove();
                that.countWindow--;
            })
            // 避免遮罩闪烁
            if (that.countWindow > 0) {
                overlay.remove();
            }
        }
    }
    _UModal.prototype.alert = function (options) {
        this.modal("alert", options || this.defaultOptions);
        return this;
    }
    _UModal.prototype.tips = function (options, delay, callback) {
        this.modal("tips", options || this.defaultOptions, delay, callback);
        return this;
    }
    _UModal.prototype.confirm = function (options) {
        this.modal("confirm", options || this.defaultOptions);
        return this;
    }
    _UModal.prototype.prompt = function (options) {
        this.modal("prompt", options || this.defaultOptions);
        return this;
    }
    _UModal.prototype.loading = function (options, delay, callback) {
        this.modal("loading", options || this.defaultOptions, delay, callback);
        return this;
    }
    _UModal.prototype.login = function (options) {
        this.modal("login", options || this.defaultOptions);
        return this;
    }
    window.UModal = new _UModal();
}(jQuery);