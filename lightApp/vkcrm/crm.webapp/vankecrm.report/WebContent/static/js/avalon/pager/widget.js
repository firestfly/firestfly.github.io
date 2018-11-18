/**
 * $replace: Boolean, 真值时表示替换其容器
 * $slot: String 默认插入点的名字
 * $template: String 组件的模板
 * $extend: String 指定要继承的组件名
 * $container: DOM 插入元素的位置,比如dialog就不一定在使用它的位置插入,通常放在body中
 * $construct: Function 用于调整三个配置项的合并,默认是function:(a, b,c ){return avalon.mix(a, b,c)}
 * $$template Function 用于微调组件的模板,传入$template与当前元素
 * $init: Function 刚开始渲染时调用的回调, 传入model与当前元素
 * $childReady: Function 当其子组件$ready完毕后, 会冒泡到当前组件触发的回调, 传入model与当前元素
 * $ready: Function 当组件的所有子组件都调用其$ready回调后才触发的回调, 传入model与当前元素
 * $dispose: Function 该组件被移出DOM树，并且元素不存在msRetain属性时的销毁回调, 传入model与当前元素
 */
define(["avalon", "text!./widget.html"], function(avalon, template) {
	function render(){

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

	}
	avalon.component("crm:pager", {
		hasRight: 0,
		hasLeft: 0,
		hasPrev: false,
		hasNext: false,
		left: [],
		right: [],
		center: [],
		onChange: function() {},
		render: render,
		$replace: true,
		$template: template,
		$init: function(vm, dom, vms) {},
		$ready: function(model, dom, vms) {},
		$dispose: function(model, dom, vms) {}

	});

});