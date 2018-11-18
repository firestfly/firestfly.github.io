;
(function (root) {
    function SortList(selector, options) {
        var me = this;
        options = options || {};
        me._events = new UM.EventMgr();
        me.$element = $(selector);
        me.element = me.$element[0];
        me.$parent = me.$element.parent();
        me.naviItems = [];
        me.curGroupIndex = 0;
        me.resizeFn = null;
        me.resizeEnable = false;
        me.$scroll = me.$element.find('.um-sortlist-content');
        me.config = {
            naviEnable: false,
            itemClickEnable: false //是否已开启行点击事件监听
        };
        me.init(options);
    }

    SortList.prototype.init = function (options) {
        var me = this;
        me.opts = $.extend({}, {
            height: 0,
            width: 0,
            collapsible: true
        }, options);

        if (me.opts.collapsible) {
            me.$scroll.delegate('.um-sortlist-title', 'click', function () {
                var $elem = $(this);
                var $parent = $elem.parent();
                var $sibling = $elem.siblings('ul');

                if ($parent.hasClass('um-sortlist-collapsed')) {
                    $parent.removeClass('um-sortlist-collapsed');
                    $sibling.slideDown(500);
                } else {
                    $parent.addClass('um-sortlist-collapsed');
                    $sibling.slideUp(500);
                }
            });
        }

        me.resizeFn = function () {
            var parent = me.$parent[0];
            var self = me.$element[0];
            var parentStyle = root.getComputedStyle(parent);
            var selfStyle = root.getComputedStyle(self)
            var parentPaddingTop = parseInt(parentStyle['padding-top']) || 0;
            var parentPaddingBottom = parseInt(parentStyle['padding-bottom']) || 0;
            var parentPaddingLeft = parseInt(parentStyle['padding-left']) || 0;
            var parentPaddingRight = parseInt(parentStyle['padding-right']) || 0;
            var selfMarginTop = parseInt(selfStyle['margin-top']) || 0;
            var selfMarginBottom = parseInt(selfStyle['margin-bottom']) || 0;
            var selfMarginLeft = parseInt(selfStyle['margin-left']) || 0;
            var selfMarginRight = parseInt(selfStyle['margin-right']) || 0;
            if (me.opts.height > 0) {
                me.$element.height(me.opts.height);
            } else {
                me.$element.height(parent.offsetHeight - parentPaddingTop - parentPaddingBottom - selfMarginTop - selfMarginBottom);
            }

            if (me.opts.width > 0) {
                me.$element.width(me.opts.width);
            } else {
                me.$element.width(parent.offsetWidth - parentPaddingLeft - parentPaddingRight - selfMarginLeft - selfMarginRight);
            }
        };

        me.resizeFn();
    }

    SortList.prototype.setNaviItems = function (arr) {
        var me = this;
        var fragment, ul, li, $navi, $naviParent;
        if (!Array.isArray(arr) || arr.length == 0) return false;
        me.naviItems = arr;
        $navi = $('<ul class="um-box-hc"></ul>');
        fragment = document.createDocumentFragment();
        arr.forEach(function (item) {
            li = document.createElement('li');
            li.innerHTML = item;
            fragment.appendChild(li);
        });
        $navi.html(fragment);

        $naviParent = me.$element.find('.um-sortlist-navi');
        if ($naviParent.length) {
            $naviParent.html($navi);
        } else {
            $naviParent = $('<div class="um-sortlist-navi"></div>');
            $naviParent.html($navi);
            me.$element.append($naviParent);
        }

        if (!me.opts.naviEnable) {
            $('.um-sortlist-navi').on('touchstart touchmove', 'ul', function (e) {
                e.preventDefault();
                var touches = e.originalEvent.targetTouches[0];
                var pageX = touches.pageX;
                var pageY = touches.pageY;
                var targetGroup;
                var naviIndex = -1;
                var targetNavLi = document.elementFromPoint(pageX, pageY);
                var $targetNavLi = $(targetNavLi);
                if ($(this).find(targetNavLi).length) {
                    naviIndex = $targetNavLi.index();
                    targetGroup = me.$scroll.find('.um-sortlist-group').get(naviIndex);
                    targetGroup && me.$scroll.scrollTop(targetGroup.offsetTop);
                }
            });

            me.opts.naviEnable = true;
        }

    }

    SortList.prototype.on = function (event, callback) {
        var me = this;
        if (typeof event !== 'string') {
            console.log('on方法的第一个参数必须为字符串');
            return false;
        }
        switch (event) {
            case "itemClick":
                me.itemClick(callback);
                break;
        }

        return me;
    };

    SortList.prototype.itemClick = function (callback) {
        var me = this;
        if (typeof callback == 'function') {
            me._events.on("itemClick", callback);
            if (!me.config.itemClickEnable) {
                me.$scroll.delegate('.um-sortlist-row', 'click', function (e) {
                    var $target = $(this);
                    var $rows = $('.um-sortlist-row');
                    var groupIndex = $target.closest('.um-sortlist-group').index();
                    var childIndex = $target.index();
                    var rowIndex = $rows.index(this);
                    var args = {
                        groupIndex: groupIndex,
                        childIndex: childIndex,
                        rowIndex: rowIndex,
                        $target: $target
                    };
                    me._events.trigger("itemClick", me, args);

                });
                me.config.itemClickEnable = true;
            }
        }
        return me;
    };

    root.UM.SortList = SortList;
    root.UM.sortList = function (selector, opts) {
        if (selector == undefined) return;
        return new SortList(selector, opts);
    }
})(this);


