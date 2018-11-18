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


(function($) {
    // page.curpage , page.pagesize , page.totalpage , page.totalsize

    var leftCount = 1,
        rightCount = 1,
        centerCount = 2;

    function _tempFunc(data) {
        var arr = [];
        arr.push('<ul>');
        arr.push('<li data-index="-1" ' + (data.hasPrev ? 'class="disabled"' : '') + '><a href="javascript:void(0)">上一页</a></li>');
        for (var i = 0; i < data.left.length; i++) {
            var v = data.left[i];
            arr.push('<li data-index="' + v.index + '"><a href="javascript:void(0)">' + v.index + '</a></li>');
        };

        if (data.hasLeft) {
            arr.push('<li data-index="' + data.hasLeft + '"><a href="javascript:void(0)">...</a></li>');
        }
        for (var j = 0; j < data.center.length; j++) {
            var v = data.center[j];
            arr.push('<li data-index="' + v.index + '" ' + (v.isCurrent ? 'class="active"' : '') + '><a href="javascript:void(0)">' + v.index + '</a></li>');
        };
        if (data.hasRight) {
            arr.push('<li data-index="' + data.hasRight + '"><a href="javascript">...</a></li>');
        }
        for (var k = 0; k < data.right.length; k++) {
            var v = data.right[k]
            arr.push('<li class="" data-index="' + v.index + '"><a href="javascript:void(0)">' + v.index + '</a></li>');
        };
        arr.push('<li data-index="+1" ' + (data.hasNext ? 'class="disabled"' : '') + '><a href="#">下一页</a></li>');
        arr.push('</ul>');
        return arr.join("")
    }

    function pager(opt) {
        this.selector = $(opt.selector);
        this.startpage = opt.startpage || 1;
        this.curpage = opt.curpage || this.startpage;
        this.totalpage = opt.totalpage || 1;
        this.onchange = opt.onchange;
        this._bindEvent();
        // this._tempFunc = template.compile($(opt.template).html())
    }

    pager.prototype.change = function() {
        var that = this;
        this.onchange && this.onchange({
            curpage: that.curpage,
            pagesize: that.pagesize
        })
        return this;
    }
    pager.prototype.render = function(pageInfo) {
        var that = this;
        var page = pageInfo || {};
        that.pagesize = page.pagesize || 10;
        that.curpage = page.curpage || 1;
        that.totalpage = page.totalpage || 0;
        var data = {
            hasRight: this.curpage + centerCount < this.totalpage - rightCount ? (this.curpage + centerCount + 1) : false,
            hasLeft: this.curpage - centerCount > leftCount + 1 ? (this.curpage - centerCount - 1) : false,
            hasPrev: this.curpage == that.startpage,
            hasNext: this.curpage == this.totalpage,
            left: [],
            right: [],
            center: []
        };

        var leftEnd = (this.curpage - centerCount - 1) > leftCount ? leftCount : (this.curpage - centerCount - 1),
            rightStart = (this.curpage + centerCount) < (this.totalpage - rightCount) ? (this.totalpage - rightCount + 1) : (this.curpage + centerCount + 1),
            centerStart = (this.curpage - centerCount) > 0 ? (this.curpage - centerCount) : 1,
            centerEnd = (this.curpage + centerCount) < this.totalpage ? (this.curpage + centerCount) : this.totalpage;

        for (var i = 1; i <= leftEnd; i++) {
            data.left.push({
                index: i
            });
        };
        for (var i = rightStart; i <= this.totalpage; i++) {
            data.right.push({
                index: i
            });
        };
        for (var i = centerStart; i <= centerEnd; i++) {
            data.center.push({
                index: i,
                isCurrent: i == this.curpage
            })
        };
        // var htmlStr = this._tempFunc(data);
        var htmlStr = _tempFunc(data);
        this.selector.html(htmlStr);
        return this;
    }

    pager.prototype._bindEvent = function() {
        var that = this;
        this.selector.on("click", "li", function() {
            var li = $(this),
                index = li.attr("data-index");
            if (li.hasClass("disabled") || li.hasClass("active")) {
                return;
            }
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
    return window.Pagination = pager;
})(jQuery);