define(["avalon"], function (av) {

    // 必须 在avalon.ui上注册一个函数，它有三个参数，分别为容器元素，data， vmodels
    av.ui["testui"] = function (element, data, vmodels) {
        var $element = avalon(element);
        var model = av.define(data.testuiId, function (vm) {
            vm.name = "这是控件的默认内容"
            vm.xxx = "xxx"//添加其属性与方法
            vm.yyy = function () {
            }
            avalon.mix(vm, data.testuiOptions)
        })
        //必须在nextTick的回调里插入新节点 与 进行扫描
        av.nextTick(function () {
            element.innerHTML = "<div>{{ name }}</div>"
            //这里的格式是固定的
            av.scan(element, [model].concat(vmodels))
        })
        return model //这里必须返回VM对象，好让avalon.bindingHandlers.widget方法，将它放到avalon.vmodels中
    }
    av.ui["testui"].defaults = {}
    return av //必须有返回值
})