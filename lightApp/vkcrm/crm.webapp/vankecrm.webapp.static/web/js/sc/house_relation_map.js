$(document).ready(function() {
    $("#relation_map_btn").hide();
    setTimeout(function() {
        $("#relation_map_btn").show();
    }, 1000);
    /////////////////////////////////////////////////////////////////////////////////////////////////
    //存在的问题:由于做了数据缓存,所以当执行一些与当前页面数据相关的更新操作时,再点击关系图,关系图不会更新
    //由于不进行页面刷新,数据不更新,所以该问题暂时没有好的解决方法. //
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // ********************************* Constants begin *********************************

    var VERSION = "/v1/";

    var URL = {
        GET_HISTORY_CUSTOMERS: servicePath.customer + VERSION + 'customer/house/history',
        PREFIX: {
            IMG: "image://" + window.path["staticWeb"] + "/img/sc/relation_map/",
            CUSTOMER: servicePath.customer + VERSION + "relationMap/houseCustomer/customer/",
            HOUSE: servicePath.customer + VERSION + "relationMap/houseCustomer/house/",
        },
    };

    //prop:property 各分类的常量属性
    //通过SHADOW_BLUR可以判断点击的节点是哪一类节点,从而进行跳转.
    var PROP = {
        HOUSE: {
            NAME: "房屋",
            CATEGORY: 0,
            SHADOW_COLOR: "#92e0e9",
            SHADOW_BLUR: 49,
            IMG: URL.PREFIX.IMG + "house.png",
        },
        OWNER: {
            NAME: "业主",
            CATEGORY: 1,
            SHADOW_COLOR: "#ee9f9f",
            SHADOW_BLUR: 50,
            IMG: URL.PREFIX.IMG + "owner.png",
        },
        HOUSE_PROPERTY: {
            NAME: "房屋属性",
            CATEGORY: 2,
            SHADOW_COLOR: "#99cb7d",
            SHADOW_BLUR: 51,
            IMG: URL.PREFIX.IMG + "house_property.png",
        },
        CURRENT_CUSTOMER: {
            NAME: "客户",
            CATEGORY: 3,
            SHADOW_COLOR: "#98c2ff",
            SHADOW_BLUR: 52,
            IMG: URL.PREFIX.IMG + "current_customer.png",
        },
        HISTORICAL_CUSTOMER: {
            NAME: "历史客户",
            CATEGORY: 4,
            SHADOW_COLOR: "#ddd",
            SHADOW_BLUR: 53,
            IMG: URL.PREFIX.IMG + "history_customer.png",
        },
    };

    //用于匹配数据里的relaltion-type
    var HOUSE_CUSTOMER_RELATION_TYPE = {
        OWNER: 1,
        LIVE: 2,
        RENT: 3,
        BILL: 4,
        PROFIX: 5,
        OTHER: 98
    };

    //页面编号
    var PAGE = {
        HOUSE: 0,
        CUSTOMER: 1
    }

    //用于显示echart-categories的数据
    var CATEGORIES = [{
        name: PROP.HOUSE.NAME,
        icon: PROP.HOUSE.IMG,
    }, {
        name: PROP.OWNER.NAME,
        icon: PROP.OWNER.IMG,
    }, {
        name: PROP.HOUSE_PROPERTY.NAME,
        icon: PROP.HOUSE_PROPERTY.IMG,
    }, {
        name: PROP.CURRENT_CUSTOMER.NAME,
        icon: PROP.CURRENT_CUSTOMER.IMG,
    }, {
        name: PROP.HISTORICAL_CUSTOMER.NAME,
        icon: PROP.HISTORICAL_CUSTOMER.IMG,
    }];


    //********************************* Constants end *********************************



    //********************************* var begin *********************************

    //数据结构: customer_id(unique):relation_type_texts
    //存放 客户:所有客户与房子的关系
    var map = {};

    var has_cached = false;

    //记录节点总数
    var node_index = 0;

    var cur_page = -1;
    //********************************* var end *********************************


    //********************************* function begin *********************************

    /**
     * [view_switch description] 页面切换效果
     * @return {[type]} [description]
     */
    var view_switch = function() {
        switch (cur_page) {
            case PAGE.HOUSE:
                content.show();
                house_customer.hide(300);
                back_btn.hide(300);
                cur_page--;
                break;
            case PAGE.CUSTOMER:
                cur_page--;
                house_customer.show();
                customer_house.hide(300);
                break;
            default:
                back_btn.show(500);
                content.hide(500);
                house_customer.show();
                break;
        }
    };

    var is_exists = function(key) {
        return key in map;
    };

    var get_history_customers = function(success_callback) {
        Common.ajax({
            url: URL.GET_HISTORY_CUSTOMERS,
            type: "get",
            data: {
                houseId: window.houseId
            },
            success: success_callback,
            error: function() {

            },
            complete: function() {

            }
        })
    };

    var clicked_owner_node = function(dom) {
        if (dom.event.target.style.shadowBlur == PROP.OWNER.SHADOW_BLUR) {
            location.href = "../../customer/" + dom.value + "/details";
        }
    };

    //********************************* function end *********************************



    //********************************* Builder begin *********************************

    var link_builder = function(source, target) {
        return {
            source: source,
            target: target
        }
    };

    var links_builder = function(nodes) {
        var links = [];
        for (var i = 1; i < nodes.length; i++) {
            var link = link_builder(0, i);
            links.push(link);
        }
        return links;
    };

    var node_builder = function(name, category, symbol, shadowColor, shadowBlur, value) {
        return {
            id: node_index++,
            name: name,
            category: category,
            symbol: symbol,
            itemStyle: {
                normal: {
                    shadowColor: shadowColor,
                    shadowBlur: shadowBlur
                }
            },
            value: value,
        }
    };

    /**
     * [nodes_builder description] 处理客户节点信息的转换: url获取的数据->echart能接受的数据
     * @param  {[type]} data  [description]
     * @param  {[type]} nodes [description]
     * @return {[type]}       [description]
     */
    var nodes_builder = function(data, nodes, is_history) {
        for (var i = 0; i < data.length; i++) {
            var node = data[i];
            var customer_id = node.customerId;
            var relation_type_text = node.relationTypeText;

            //key:唯一key值,如果是历史客户则以"."结尾,否则为":".用于解决一个客户对某个房屋有多种关系的问题.
            var key = is_history ? (customer_id + ".") : (customer_id + ":");

            if (is_exists(key)) {
                map[key] += "," + relation_type_text;
            } else {
                map[key] = relation_type_text;

                var customer_node;

                if (is_history) { //如果是历史客户
                    customer_node = node_builder(node.fullName, PROP.HISTORICAL_CUSTOMER.CATEGORY, PROP.HISTORICAL_CUSTOMER.IMG, PROP.HISTORICAL_CUSTOMER.SHADOW_COLOR, PROP.HISTORICAL_CUSTOMER.SHADOW_BLUR, customer_id);
                } else { //如果不是历史客户
                    //如果是业主
                    if (node.relationType == HOUSE_CUSTOMER_RELATION_TYPE.OWNER) {
                        customer_node = node_builder(node.fullName, PROP.OWNER.CATEGORY, PROP.OWNER.IMG, PROP.OWNER.SHADOW_COLOR, PROP.OWNER.SHADOW_BLUR, customer_id);
                    } else {
                        customer_node = node_builder(node.fullName, PROP.CURRENT_CUSTOMER.CATEGORY, PROP.CURRENT_CUSTOMER.IMG, PROP.CURRENT_CUSTOMER.SHADOW_COLOR, PROP.CURRENT_CUSTOMER.SHADOW_BLUR, customer_id);
                    };
                };

                nodes.push(customer_node);
            };
        }
        return nodes;
    }

    var option_builder = function(nodes, links) {
        return {
            legend: {
                data: CATEGORIES,
                itemHeight: 25
            },
            //tooltip: {
            //    triggerOn: "mouseover",
            //    formatter: "{b}"
            //},
            series: [{
                type: 'graph',
                layout: 'force',
                //hoverAnimation: true,
                roam: true,
                draggable: true,
                legendHoverLink: true,
                symbolSize: 50,
                label: {
                    normal: {
                        formatter: "{b}",
                        position: 'bottom',
                        show: true
                    }
                },
                force: {
                    edgeLength: 200,
                    repulsion: 1000
                },
                //根据数据显示chart begin
                categories: CATEGORIES,
                nodes: nodes,
                links: links,
                //根据数据显示chart end
            }]
        };
    };
    /**
     * [relation_type_text_builder description] 给有relation_type_text的节点添加上对应关系信息.
     * @param  {[type]}  start_index [description]  从第start_index开始往后遍历节点,防止重复添加关系信息.
     * @param  {[type]}  nodes       [description]
     * @param  {Boolean} is_history  [description] 是否为历史客户.
     * @return {[type]}              [description]
     */
    var relation_type_text_builder = function(start_index, nodes, is_history) {
        var suffix = is_history ? "." : ":";
        //第0个是房屋节点,所以从1开始.
        for (var i = start_index; i < nodes.length; i++) {
            var relation_type_text = map[nodes[i].value + suffix].trim();
            if (relation_type_text != "") {
                nodes[i].name += "(" + relation_type_text + ")";
            };
        }
        return nodes;
    }

    //********************************* Builder end *********************************

    //********************************* dom begin *********************************

    var house_customer = $("#house_customer");
    var customer_house = $("#customer_house");
    var content = $(".content");
    var back_btn = $("#relation-map-back-btn");
    var loading = $("#loading");

    var chart_house_customer;
    var chart_customer_house;
    //********************************* dom end *********************************






    $("#relation_map_btn").click(function() {
        //如果先打开了关系图,然后又进行了客房关系更新操作,则缓存显示的关系图不是最新的.
        //如果先打开了关系图,然后又进行了客房关系更新操作,则缓存显示的关系图不是最新的.
        //如果先打开了关系图,然后又进行了客房关系更新操作,则缓存显示的关系图不是最新的.
        if (has_cached) {
            view_switch();
            cur_page = PAGE.HOUSE;
        } else {
            has_cached = true;

            var house_name = $("#houseTitle").children()[0].firstChild.data;
            var current_customers_of_house = window.currentCustomersOfHouse;
            var property_fee_status = $("#propertyFeeIsPaid")[0].innerText;
            var task_percent = $("#taskPercent")[0].innerText;

            var nodes = [];
            var links = [];

            //构造房屋节点
            var house_node = node_builder(house_name, PROP.HOUSE.CATEGORY, PROP.HOUSE.IMG, PROP.HOUSE.SHADOW_COLOR, PROP.HOUSE.SHADOW_BLUR, "");
            nodes.push(house_node);

            //构造物业费节点
            var fee_node = node_builder(property_fee_status, PROP.HOUSE_PROPERTY.CATEGORY, PROP.HOUSE_PROPERTY.IMG, PROP.HOUSE_PROPERTY.SHADOW_COLOR, PROP.HOUSE_PROPERTY.SHADOW_BLUR, "");
            nodes.push(fee_node);

            //构造任务节点
            var task_node = node_builder(task_percent, PROP.HOUSE_PROPERTY.CATEGORY, PROP.HOUSE_PROPERTY.IMG, PROP.HOUSE_PROPERTY.SHADOW_COLOR, PROP.HOUSE_PROPERTY.SHADOW_BLUR, "");
            nodes.push(task_node);

            if (current_customers_of_house != undefined) {
                //处理房屋当前有关客户节点
                nodes = nodes_builder(current_customers_of_house, nodes, false);
            };

            //3前面有0,1,2,分别代表房屋节点,物业费节点,任务节点.
            nodes = relation_type_text_builder(3, nodes, false);

            //历史客户节点的start_index
            var start_index = node_index;

            //发送ajax获取历史客户,成功返回后处理结果并显示.
            get_history_customers(function(res) {

                var history_customers = res.details;

                if (history_customers != undefined) {
                    //处理历史客户    
                    nodes = nodes_builder(history_customers, nodes, true);
                }

                nodes = relation_type_text_builder(start_index, nodes, true);

                //构建线
                links = links_builder(nodes);

                view_switch();

                chart_house_customer = echarts.init(document.getElementById('house_customer'));

                var option = option_builder(nodes, links);

                chart_house_customer.setOption(option);

                cur_page = PAGE.HOUSE;

                //给业主节点添加点击事件
                chart_house_customer.on('dblclick', clicked_owner_node);

            })
        };

    });


    //返回事件
    back_btn.click(function(event) {
        view_switch();
    })


});
