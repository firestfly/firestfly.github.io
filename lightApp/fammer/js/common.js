$(function () {
    var init1 = function () {
        var $ul = $(".top-list").find("ul"),
            $li = $ul.find("li"),
            w = 10,
            $li_width = 0;
        $.each($li, function () {
            $li_width = $(this).outerWidth();
            w += $li_width;
        })
        $ul.width(w);
    }
    init1();

    var goods = localStorage.getItem('goods');
    goods = JSON.parse(goods);
    goods = (goods != null) ? goods : [{
        "superclass": "蔬菜",
        "subclass": [{
            "subname": "茄果类",
            "selected": 0,
            "list": [{
                "name": "原茄",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-16/55063bfab11a7.jpg",
                "price": "￥2.98",
                "unit": "（500g）",
                "num": 0
            }, {
                "name": "长茄",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f842897d0d3.jpg",
                "price": "￥3.98",
                "unit": "（500g）",
                "num": 0
            }, {
                "name": "原椒",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f8429a4532c.jpg",
                "price": "￥4.58",
                "unit": "（500g）",
                "num": 0
            }, {
                "name": "尖椒",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f84333222b6.jpg",
                "price": "￥4.58",
                "unit": "（500g）",
                "num": 0
            }, {
                "name": "苦瓜",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-24/551123e28f488.jpg",
                "price": "￥5.98",
                "unit": "（500g）",
                "num": 0
            }, {
                "name": "西红柿",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f84326b7950.jpg",
                "price": "￥3.58",
                "unit": "（500g）",
                "num": 0
            }]
        }, {
            "subname": "叶菜类",
            "selected": 0,
            "list": [{
                "name": "小白菜",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-18/5509359df01ac.jpg",
                "price": "￥2",
                "unit": "(300g)",
                "num": 0
            }, {
                "name": "大白菜",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-06/54f925297b114.jpg",
                "price": "￥10",
                "unit": "颗（2500g）",
                "num": 0
            }, {
                "name": "圆生菜",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-06/54f92543ab3bd.jpg",
                "price": "￥1.98",
                "unit": "颗(500g)",
                "num": 0
            },

                {
                    "name": "圆白菜",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-06/54f917411dc0b.jpg",
                    "price": "￥3",
                    "unit": "颗（1000g）",
                    "num": 0
                }, {
                    "name": "紫甘蓝",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f8445deb0aa.jpg",
                    "price": "￥4",
                    "unit": "颗（1000g）",
                    "num": 0
                }, {
                    "name": "小油菜",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f8438b56176.jpg",
                    "price": "￥1.5",
                    "unit": "（300g）",
                    "num": 0
                }
            ]
        }, {
            "subname": "根茎类",
            "selected": 0,
            "list": [{
                "name": "西芹",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f84412403c3.jpg",
                "price": "￥2.58",
                "unit": "(500g)",
                "num": 0
            },

                {
                    "name": "香芹",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f84401bee1f.jpg",
                    "price": "￥3",
                    "unit": "（400g）",
                    "num": 0
                }, {
                    "name": "新土豆",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-06/54f917af8a331.jpg",
                    "price": "￥2.58",
                    "unit": "（500g）",
                    "num": 0
                }, {
                    "name": "莴笋",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f84420c5ca7.jpg",
                    "price": "￥7.5",
                    "unit": "颗（1500g）",
                    "num": 0
                }, {
                    "name": "胡萝卜",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f84452c8673.jpg",
                    "price": "￥1.98",
                    "unit": "（500g）",
                    "num": 0
                }, {
                    "name": "白萝卜",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f843f254c9e.jpg",
                    "price": "￥3",
                    "unit": "颗（750g）",
                    "num": 0
                }
            ]
        }]
    }, {
        "superclass": "水果",
        "subclass": [{
            "subname": "苹果类",
            "selected": 0,
            "list": [{
                "name": "烟台富士",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-06/54f91682eeb09.jpg",
                "price": "￥10",
                "unit": "（600g）",
                "num": 0
            }, {
                "name": "栖霞水果",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-06/54f9168f749f9.jpg",
                "price": "￥11.4",
                "unit": "（600g）",
                "num": 0
            }, {
                "name": "高山水果",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f841822651e.jpg",
                "price": "￥6.58",
                "unit": "（500g）",
                "num": 0
            }, {
                "name": "黄宝石水果",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f841fd71bc9.jpg",
                "price": "￥5.58",
                "unit": "（500g）",
                "num": 0
            },]
        }, {
            "subname": "梨类",
            "selected": 0,
            "list": [{
                "name": "雪花梨",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f841694a199.jpg",
                "price": "￥5.5",
                "unit": "（800g）",
                "num": 0
            }, {
                "name": "丰水梨",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f8415b6a2d2.jpg",
                "price": "￥8",
                "unit": "（800g）",
                "num": 0
            }, {
                "name": "库尔勒香梨",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-06/54f91655be730.jpg",
                "price": "￥7.58",
                "unit": "（500g）",
                "num": 0
            }]
        }, {
            "subname": "橘柚类",
            "selected": 0,
            "list": [{
                "name": "海南荔枝",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-05-10/554f0b6b6027a.jpg",
                "price": "￥18.5",
                "unit": "(500g)",
                "num": 0
            }, {
                "name": "丑桔",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-05-04/554707de767cb.jpg",
                "price": "￥9.8",
                "unit": "(500g)",
                "num": 0
            }, {
                "name": "弥核桃--海沃德",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-05-02/5544a0d321f3f.jpg",
                "price": "￥10",
                "unit": "(3)个",
                "num": 0
            }, {
                "name": "柠檬",
                "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f840403951d.jpg",
                "price": "￥6",
                "unit": "份(2个)",
                "num": 0
            }]
        },]
    },

        {
            "superclass": "甘果零食",
            "subclass": [{
                "subname": "特色零食包",
                "selected": 0,
                "list": []
            }, {
                "subname": "干果",
                "selected": 0,
                "list": [{
                    "name": "多味瓜子",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83f7c272ce.jpg",
                    "price": "￥5",
                    "unit": "份(250g)",
                    "num": 0
                }, {
                    "name": "西瓜子(湿)",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83fb051f42.jpg",
                    "price": "￥6",
                    "unit": "份(250g)",
                    "num": 0
                }, {
                    "name": "开口松子",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83f6ea791f.jpg",
                    "price": "￥23",
                    "unit": "份(250g)",
                    "num": 0
                }, {
                    "name": "开心果",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83f9217419.jpg",
                    "price": "￥24",
                    "unit": "份(250g)",
                    "num": 0
                }, {
                    "name": "纸皮核桃",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-16/5506a71d54d6a.jpg",
                    "price": "￥28",
                    "unit": "(500g)",
                    "num": 0
                }, {
                    "name": "葡萄干",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83f26d8fcb.jpg",
                    "price": "￥15",
                    "unit": "(500g)",
                    "num": 0
                }]
            }, {
                "subname": "休闲食品",
                "selected": 0,
                "list": [{
                    "name": "徐福记酥糖",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83efcdb259.jpg",
                    "price": "￥6",
                    "unit": "(100g)",
                    "num": 0
                }, {
                    "name": "大虾酥",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83eed42520.jpg",
                    "price": "￥8",
                    "unit": "(200g)",
                    "num": 0
                }, {
                    "name": "玉米软糖",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-06/54f913cf00e5f.jpg",
                    "price": "￥5",
                    "unit": "(250g)",
                    "num": 0
                }, {
                    "name": "紫/红薯仔",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83e3b0b46f.jpg",
                    "price": "￥5",
                    "unit": "(200g)",
                    "num": 0
                }, {
                    "name": "多味休闲山楂",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-18/55093d3680df8.jpg",
                    "price": "￥6",
                    "unit": "(200g)",
                    "num": 0
                }, {
                    "name": "多味青豆",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-06/54f923022f492.jpg",
                    "price": "￥6",
                    "unit": "(200g)",
                    "num": 0
                }]
            }]
        },

        {
            "superclass": "肉及冷冻品",
            "subclass": [{
                "subname": "冻鲜品",
                "selected": 0,
                "list": [{
                    "name": "华都鸡翅中",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83c40f38e3.jpg",
                    "price": "￥43.8",
                    "unit": "袋(1000g)",
                    "num": 0
                }, {
                    "name": "华都鸡翅根",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83a7fb0ca9.jpg",
                    "price": "￥19.8",
                    "unit": "袋(1000g)",
                    "num": 0
                }]
            }, {
                "subname": "鲜肉",
                "selected": 0,
                "list": [{
                    "name": "牛里脊",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83c40f38e3.jpg",
                    "price": "￥15",
                    "unit": "(250g)",
                    "num": 0
                }, {
                    "name": "猪里脊",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83a7fb0ca9.jpg",
                    "price": "￥7.5",
                    "unit": "(250g)",
                    "num": 0
                }]
            }]
        },

        {
            "superclass": "主食/副食",
            "subclass": [{
                "subname": "粮油",
                "selected": 0,
                "list": [{
                    "name": "五得利特精高筋粉",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-18/550934ab7cab6.jpg",
                    "price": "￥23.8",
                    "unit": "袋(5kg)",
                    "num": 0
                }, {
                    "name": "金龙鱼调和油",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83c40f38e3.jpg",
                    "price": "￥28.5",
                    "unit": "桶(1.8L)",
                    "num": 0
                }, {
                    "name": "五常大米(长粒香)",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-18/550934c4dffa4.jpg",
                    "price": "￥39",
                    "unit": "袋(5kg)",
                    "num": 0
                }, {
                    "name": "五常大米(稻花香)",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-18/550934b786444.jpg",
                    "price": "￥49",
                    "unit": "袋(5kg)",
                    "num": 0
                }]
            }, {
                "subname": "挂面",
                "selected": 0,
                "list": [{
                    "name": "金沙河挂面",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-18/5509359df01ac.jpg",
                    "price": "￥7.5",
                    "unit": "包(1kg)",
                    "num": 0
                }, {
                    "name": "金沙河手擀面(宽)",
                    "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-06/54f925297b114.jpg",
                    "price": "￥3.5",
                    "unit": "包(500g)",
                    "num": 0
                }]
            },

                {
                    "subname": "调味品",
                    "selected": 0,
                    "list": [{
                        "name": "金龙鱼食用调和油",
                        "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83c40f38e3.jpg",
                        "price": "￥32",
                        "unit": "桶(1.8L)",
                        "num": 0
                    }, {
                        "name": "海天鲜味生抽",
                        "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83a7fb0ca9.jpg",
                        "price": "￥16.8",
                        "unit": "桶(1.9L)",
                        "num": 0
                    }, {
                        "name": "海天老抽王",
                        "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83a6478ea8.jpg",
                        "price": "￥6.8",
                        "unit": "瓶(500ml)",
                        "num": 0
                    }, {
                        "name": "山西陈醋",
                        "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83a3a274e8.jpg",
                        "price": "￥11.8",
                        "unit": "桶(1.75L)",
                        "num": 0
                    }, {
                        "name": "料酒",
                        "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83a4d76f41.jpg",
                        "price": "￥3.5",
                        "unit": "瓶(450ml)",
                        "num": 0
                    }, {
                        "name": "深井碘盐",
                        "pic": "http://hlt.oyoozo.com/Uploads/Picture/2015-03-05/54f83c6e90740.jpg",
                        "price": "￥2",
                        "unit": "瓶(280g)",
                        "num": 0
                    }]
                }
            ]
        }
    ];
    UM(goods);
    var children = $('.right-list').children('ul');
    children.each(function () {
        var id = this.id;
        var index = $(this).index();
        var datasource = goods[tag]['subclass'][index]['list'] || null;
        datasource ? ($view(id).set_datasource(datasource)) : '';
    });

    var active_left_index = 0,
        $left_li = $(".left-list li");
    var init2 = function () {
        var content_h = $(window).height() - 120;
        $(".left-list,.right-list").height(content_h);
        $.each($(".right-list-item"), function (i, v) {
            var $count = $(this).find(".count"),
                count = 0,
                value;
            $.each($count, function () {
                value = $(this).html();
                if (value != "" && (value = parseInt(value)) > 0) {
                    count += value;
                    $(this).siblings(".reduce").addBack().addClass("show");
                }
            })
            if (count > 0) {
                $left_li.eq(i).find(".bubble").html(count);
            }
        })
    }
    init2();

    $left_li.on("click", function () {
        var _this = $(this);
        active_left_index = $(this).index();
        _this.find("a").addClass("active");
        _this.siblings("li").find("a").removeClass("active");
        $(".right-list-item").eq(active_left_index).addClass("active").siblings(".right-list-item").removeClass("active");
    })
    $(".add").on("click", function () {
        var $count = $(this).prev(".count");
        var count = parseInt($count.html());
        var rowIndex = $(this).closest('li').index();
        var id;
        count++;
        $count.addClass("show");
        id = children.eq(active_left_index).attr('id');
        $view(id).set_value(rowIndex, 'num', count);
        $(this).siblings(".reduce").addClass("show");
        var bubble = $left_li.eq(active_left_index).find(".bubble");
        bubble.html(1 + parseInt(bubble.html() || 0));
        removeBubble();
    })

    function removeBubble() {
        var left_li = $left_li.eq(active_left_index).find(".bubble");
        (left_li.html() == 0) && left_li.html("");
        var bubble = $left_li.eq(active_left_index).find(".bubble");
        (bubble.html() == 0) && bubble.html("");
    }

    $(".reduce").on("click", function () {
        var $count = $(this).next(".count");
        var count = parseInt($count.html());
        var rowIndex = $(this).closest('li').index();
        var id;
        if (count < 2) {
            $(this).add($count).removeClass("show");
        }
        count--;
        id = children.eq(active_left_index).attr('id');
        $view(id).set_value(rowIndex, 'num', count);
        var bubble = $left_li.eq(active_left_index).find(".bubble");
        bubble.html(parseInt(bubble.html() || 1) - 1);
        removeBubble();
    });


    $(window).on("pagehide", function (e) {
        localStorage['goods'] = JSON.stringify(goods);
    });
});