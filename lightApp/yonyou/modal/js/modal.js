;
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("requires a window with a document");
                }
                return factory(w);
            };
    } else if (typeof define === "function" && define.amd) {
        define(["jquery", "UM"],function() {
            return factory(global);
        });
    } else {
        factory(global);
    }

}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  function Modal(type, options) {
    if (options && (options.constructor === String)) {
      this.settings = $.extend({}, this.defaults, {
        title: options,
        text: ""
      });
    } else {
      this.settings = $.extend({}, this.defaults, options);
    }
    this.type = type;
    this._init();
  }
  Modal.prototype = {
    constructor: Modal,

    overlay: $('<div class="overlay"></div>'),

    defaults: {
      title: window.location.host || "",
      text: "",
      btnText: ["取消", "确定"],
      overlay: true,
      cancle: function() {},
      ok: function(data) {}
    },

    done: function(fn) {
      if (typeof fn === "function" && this._complete) {
        fn.call(this);
      }
    },

    _generateHTML: function() {

      var settings = this.settings,
        type = this.type,
        html;

      html = '<div class="modal"><div class="modal-content border-bottom">';

      if (settings.title) {
        html += '<div class="modal-title">' + settings.title + '</div>';
      }
      if (settings.text) {
        html += '<div class="modal-text">';
        //if(type === "tips") html += '<span class="ani-rotate"></span>';
        html += settings.text + '</div>';
      }
      if (type === "prompt") {
        html += '<div class="modal-inputs"><input type="text" class="modal-input"></div>';
      }

      if (type === "login") {
        html += '<div class="modal-inputs"><input type="text" class="modal-input"><input type="text" class="modal-input"></div>';
      }

      type === "tips" ? html += '</div>' : html += '</div><div class="modal-btns">';

      if (type === "confirm" || type === "login" || type === "prompt") {
        html += '<div class="modal-btn cancle">' + settings.btnText[0] + '</div>';
      }

      if (type === "tips") {
        html += '</div>';
      } else {
        html += '<div class="modal-btn ok">' + settings.btnText[1] +
          '</div></div></div>';
      }

      if (type === "loading") {
        html = '<div class="modal" style="background-color: rgba(0, 0, 0, 0.35);width: 150px;margin-left: -75px;padding: 20px;border-radius: 12px;"><span class="ani-rotate"></span></div>';
      }
      this.html = html;
    },
    _showModal: function() {

      this.settings.overlay && this.overlay.appendTo($('body')).fadeIn(300);

      var modal = $(this.html).appendTo($('body')),
        modalH = modal.outerHeight(),
        wh = window.innerHeight;

      modal.css('top', (wh - modalH - 20) / 2);

      setTimeout(function() {
        modal.addClass('modal-in');
      }, 200);

      this.modal = modal;
      this._attachEvent();
    },
    _attachEvent: function() {
      var that = this;
      that.modal.on("click", '.modal-btn', function(e) {
        e.preventDefault();
        if ($(this).hasClass('cancle')) {
          setTimeout(function() {
            that.settings.cancle(data)
          }, 100);
        }
        if ($(this).hasClass('ok')) {
          var input = that.modal.find('.modal-input'),
            inputLen = input.length,
            data;
          if (inputLen) {
            if (inputLen == 1) data = that.modal.find('.modal-input').val();
            else {
              data = [];
              $.each(input, function() {
                data.push(this.value);
              });
            }
          }
          setTimeout(function() {
            that.settings.ok(data)
          }, 100);
        }
        that.destory(that.modal);
      });
    },
    destory: function() {
      var that = this;
      this.modal.removeClass('modal-in').addClass('modal-out').on('webkitTransitionEnd', function() {
        that.modal.off('webkitTransitionEnd');
        that.modal.removeClass('modal-out');
        that.modal.remove();
      });
      // 避免遮罩闪烁
      this.settings.overlay && this.overlay.remove();
    },
    _init: function() {

      this._generateHTML();
      this._showModal();

      if (this.type === 'tips' || this.type === 'loading') {
        this._complete = 1;
      }
    }
  }
  window.modal = function(type, options) {
    return new Modal(type, options);
  }
  return window.modal;
}))
