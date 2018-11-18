define(["avalon", "text!./widget.html"], function(avalon, html) {
    var widget = avalon.ui.businessType = function(elem, data, vmodels) {
        var jq_elem = $(elem),
            // 如果有属性data-businesstype-onlychild，则只能选最后一级
            // _notOnlySelectedChild = jq_elem.attr("data-businesstype-onlychild") === undefined;
            _notOnlySelectedChild = false; //只能选最后一级
        var model = avalon.define({
            $id: data.businessTypeId,
            text: {
                get: function() {
                    var arr = [],
                        obj = Config.businessType.obj;
                    obj[this.businessType0] && arr.push(obj[this.businessType0]["businessName"]);
                    obj[this.businessType1] && arr.push(obj[this.businessType1]["businessName"]);
                    obj[this.businessType2] && arr.push(obj[this.businessType2]["businessName"]);
                    // return arr.join(" / ")
                    var s = arr.join("/");
                    elem.value = s;
                    return s;
                }
            },
            /*code: {
                get: function() {
                    return [this.businessType0,
                        this.businessType1,
                        this.businessType2
                    ].join(".")
                },
                set: function(val) {
                    var arr = (val || '').split(".");
                    this.businessType0 = arr[0] || '';
                    this.businessType1 = arr[1] || '';
                    this.businessType2 = arr[2] || '';
                    this.businessType = arr[2] || arr[1] || arr[0] || '';

                }
            },*/
            visible: false,
            businessType0List: Config["businessType"] && Config["businessType"].list || [],
            businessType1List: [],
            businessType2List: [],

            businessType0: '', //填具体业务类型
            businessType1: '',
            businessType2: '',
            businessType: ''
        });
        // append
        var d = document.createElement("div");
        d.innerHTML = html;
        var child = d.children[0];
        elem.parentNode.appendChild(child);
        d = null;
        // scan
        avalon.scan(child, model);
        setTimeout(function() {
            jq_elem.on("click", function() {
                model.visible = true;
                return false;
            });
            $(document).on("click", function() {
                model.visible = false;
            });
            // 业务类型
            var code0, code1, code2;
            $(".child0", child).on("mouseover", "li", function() {
                var that = $(this),
                    code = that.attr("data-code"),
                    obj = Config.businessType.obj[code];
                code0 = code;
                that.addClass("on").siblings().removeClass("on")
                if (code && obj) {
                    model.businessType1List = [];
                    model.businessType1List = obj["children"];
                    model.businessType2List = [];
                }
            }).on("click", "li", function() {
                var that = $(this),
                    code = that.attr("data-code"),
                    obj = Config.businessType.obj[code];
                if (_notOnlySelectedChild || !obj["children"] || obj["children"].length == 0) {
                    code0 = code;
                    model.businessType0 = code0;
                    model.businessType1 = '';
                    model.businessType2 = '';
                    model.businessType = code0;
                }
            });
            $(".child1", child).on("mouseover", "li", function() {
                var that = $(this),
                    code = that.attr("data-code"),
                    obj = Config.businessType.obj[code];
                code1 = code;
                that.addClass("on").siblings().removeClass("on")
                if (code && obj) {
                    model.businessType2List = [];
                    model.businessType2List = obj["children"];
                }
            }).on("click", "li", function() {
                var that = $(this),
                    code = that.attr("data-code"),
                    obj = Config.businessType.obj[code];
                if (_notOnlySelectedChild || !obj["children"] || obj["children"] == 0) {
                    code1 = code;
                    model.businessType0 = code0;
                    model.businessType1 = code1;
                    model.businessType2 = '';
                    model.businessType = code1;
                }

            });
            $(".child2", child).on("click", "li", function() {
                var that = $(this),
                    code = that.attr("data-code");
                model.businessType0 = code0;
                model.businessType1 = code1;
                model.businessType2 = code;
                model.businessType = code;
                model.visible = false;
            }).on("mouseenter", "li", function() {
                $(this).addClass("on").siblings().removeClass("on")
            })
        })
    }
    return widget;
})