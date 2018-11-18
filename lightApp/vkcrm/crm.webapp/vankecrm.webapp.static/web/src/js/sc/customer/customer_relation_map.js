/**
 * created by liaochao 20160121
 */

$(document).ready(function() {
    $(".entrance-relation-map").hide();

    setTimeout(function() {
        $(".entrance-relation-map").show();
    }, 1000);

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //存在的问题:由于做了数据缓存,所以当执行一些与当前页面数据相关的更新操作时,再点击关系图,关系图不会更新
    //由于不进行页面刷新,数据不更新,所以该问题暂时没有好的解决方法. //
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // ********************************* Constants begin *********************************

    // ********************************* Constants begin *********************************

    var VERSION = "/v1/";

    var URL = {
        PREFIX: {
            IMG: "image://" + window.path["staticWeb"] + "/img/sc/relation_map/",
            CUSTOMER: servicePath.customer + VERSION + "customer/",
            HOUSE: servicePath.customer + VERSION + "house/",
        },
        SUFFIX: {
            ESTATES: "/estates",
            RELATIONS: "/relations",
            CUSTOMERS: "/customers"
        }
    }

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
        CARPORT: {
            NAME: "车位",
            CATEGORY: 2,
            SHADOW_COLOR: "#a2e5ec",
            SHADOW_BLUR: 51,
            IMG: URL.PREFIX.IMG + "carport.png",
        },
        RELATION: {
            NAME: "亲属",
            CATEGORY: 3,
            SHADOW_COLOR: "#98c2ff",
            SHADOW_BLUR: 52,
            IMG: URL.PREFIX.IMG + "customer_relation.png",
        },
    };

    var ESTATE_TYPE = {
        CARPORT: "Carport",
        HOUSE: "House",
    };

    //页面编号
    var PAGE = {
        HOUSE: 0,
        CUSTOMER: 1
    }

    //用于匹配数据里的relaltion-type
    var HOUSE_CUSTOMER_RELATION_TYPE = {
        OWNER: 1,
        LIVE: 2,
        RENT: 3,
        BILL: 4,
        PROFIX: 5,
        OTHER: 98
    };

    //用于显示echart-categories的数据
    var CATEGORIES = [{
        name: PROP.HOUSE.NAME,
        icon: PROP.HOUSE.IMG,
    }, {
        name: PROP.OWNER.NAME,
        icon: PROP.OWNER.IMG,
    }, {
        name: PROP.CARPORT.NAME,
        icon: PROP.CARPORT.IMG,
    }, {
        name: PROP.RELATION.NAME,
        icon: PROP.RELATION.IMG,
    }, ];

    // ********************************* Constants end *********************************


    // ********************************* var begin *********************************

    var node_index = 0;

    var nodes = [];
    var links = [];
    var cur_page = -1;

    var has_cached = false;

    //节点集合,用于去除重复节点
    var nodes_set = {};

    var owner_node;


    // ********************************* var end *********************************

    // ********************************* function begin *********************************

    /**
     * [view_switch description] 页面切换效果
     * @return {[type]} [description]
     */
    var view_switch = function() {
        switch (cur_page) {
            case PAGE.HOUSE:
                content.show();
                customer_house.hide(300);
                back_btn.hide(300);
                cur_page--;
                break;
            case PAGE.CUSTOMER:
                cur_page--;
                customer_house.show();
                customer_house.hide(300);
                break;
            default:
                back_btn.show(500);
                content.hide(500);
                customer_house.show();
                break;
        }
    };

    var clicked_house_node = function(dom) {
        if (dom.event.target.style.shadowBlur == PROP.HOUSE.SHADOW_BLUR) {
            location.href = "../../house/" + dom.value + "/details";
        };
    }

    //后台既通过customerId查,又通过toCustomerId查.
    var get_all_relations = function() {
        Common.ajax({
            url: URL.PREFIX.CUSTOMER + window.customerId + URL.SUFFIX.RELATIONS,
            type: "get",
            success: function(res) {
                var data_relation = res.details;

                if (data_relation != undefined) {
                    //构建亲戚节点,这里不需要links_builder,因为nodes_builder_relation里有.
                    nodes = nodes_builder_relation(data_relation, nodes);
                };

                view_switch();

                chart_customer_house = echarts.init(document.getElementById('customer_house'));

                var option = option_builder(nodes, links);

                chart_customer_house.setOption(option);

                chart_customer_house.hideLoading();

                cur_page = PAGE.HOUSE;

                //给房屋节点添加点击事件
                chart_customer_house.on('dblclick', clicked_house_node);

            },
        });
    }


    // ********************************* function end *********************************

    // ********************************* builder begin *********************************
    var link_builder = function(source, target) {
        return {
            source: source,
            target: target,
            lineStyle: { //该效果无效,原因未知.
                normal: {
                    width: 100,
                    type: "dotted"
                }
            }
        }
    };

    var links_builder = function(links, srcNode, targetNodes) {
        for (var i = 0; i < targetNodes.length; i++) {
            var link = link_builder(srcNode.id, targetNodes[i].id);
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


    var nodes_builder_relation = function(data, nodes) {
        for (var i = 0; i < data.length; i++) {
            var node = data[i];
            //如果是通过customerId查询的
            if (node.customerId == owner_node.value) {
                //则看看toCustomerId有没有重复.(由于前面通过houseId查询与house相关的客户的时候可能存在重复关系所以需要进行去重)
                if (nodes_set[node.toCustomerId] == undefined) { //如果没有重复,则创建一个新的节点加入到nodes,并且与owner_node连线
                    var relation_type_text = node.relationTypeText;
                    if (relation_type_text.trim() != "") {
                        relation_type_text = "(" + relation_type_text + ")";
                    };
                    var node_name = node.toCustomerName + relation_type_text;
                    var relation_node = node_builder(node_name, PROP.RELATION.CATEGORY, PROP.RELATION.IMG, PROP.RELATION.SHADOW_COLOR, PROP.RELATION.SHADOW_BLUR, node.toCustomerId);
                    nodes.push(relation_node);
                    links = links_builder(links, owner_node, [relation_node]);
                    nodes_set[node.toCustomerId] = relation_node;
                } else { //否则直接将owner_node和已存在的节点相连.
                    var relation_type_text = node.relationTypeText;
                    if (relation_type_text.trim() != "") {
                        relation_type_text = "(" + relation_type_text + ")";
                    };
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].value == node.toCustomerId) {
                            nodes[i].name += relation_type_text;
                            break;
                        }
                    }

                    links = links_builder(links, owner_node, [nodes_set[node.toCustomerId]]);
                }
            } else { //如果是通过toCustomerId查询的,同上.
                if (nodes_set[node.customerId] == undefined) {
                    var relation_type_text = node.relationTypeText;
                    if (relation_type_text.trim() != "") {
                        relation_type_text = "(" + relation_type_text + ")";
                    };
                    var node_name = node.toCustomerName + relation_type_text;
                    var relation_node = node_builder(node_name, PROP.RELATION.CATEGORY, PROP.RELATION.IMG, PROP.RELATION.SHADOW_COLOR, PROP.RELATION.SHADOW_BLUR, node.customerId);
                    nodes.push(relation_node);
                    links = links_builder(links, owner_node, [relation_node]);
                    nodes_set[node.customerId] = relation_node;
                } else {
                    var relation_type_text = node.relationTypeText;
                    if (relation_type_text.trim() != "") {
                        relation_type_text = "(" + relation_type_text + ")";
                    };
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].value == node.customerId) {
                            nodes[i].name += relation_type_text;
                            break;
                        }
                    }
                    links = links_builder(links, owner_node, [nodes_set[node.customerId]]);
                }
            };
        }
        return nodes;
    };
    var nodes_builder_estate = function(data, nodes) {
        for (var i = 0; i < data.length; i++) {
            var node = data[i];
            var estate_node;
            if (node.type == ESTATE_TYPE.CARPORT) {
                estate_node = node_builder(node.name, PROP.CARPORT.CATEGORY, PROP.CARPORT.IMG, PROP.CARPORT.SHADOW_COLOR, PROP.CARPORT.SHADOW_BLUR, node.id);
            } else {
                estate_node = node_builder(node.name, PROP.HOUSE.CATEGORY, PROP.HOUSE.IMG, PROP.HOUSE.SHADOW_COLOR, PROP.HOUSE.SHADOW_BLUR, node.id);
            };
            nodes.push(estate_node);
        }
        return nodes;
    };
    var nodes_builder_house_relations = function(data, nodes) {
        for (var i = 0; i < data.length; i++) {
            var node = data[i];

            //只处理业主节点.并且需要去重,房主主业主节点出现多个节点.
            if (node.relationType == HOUSE_CUSTOMER_RELATION_TYPE.OWNER) {
                //防止主业主节点重复出现
                if (nodes_set[node.customerId] == undefined && nodes_set[node.toCustomerId] == undefined) {
                    var customer_node = node_builder(node.fullName, PROP.OWNER.CATEGORY, PROP.OWNER.IMG, PROP.OWNER.SHADOW_COLOR, PROP.OWNER.SHADOW_BLUR, node.customerId);
                    nodes.push(customer_node);
                    nodes_set[customer_node.value] = customer_node;
                }
            }
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
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    },
                }
            },
            series: [{
                type: 'graph',
                layout: 'force',
                //hoverAnimation: true,
                roam: true,
                draggable: true,
                legendHoverLink: true,
                symbolSize: 35,
                label: {
                    normal: {
                        formatter: "{b}",
                        position: 'bottom',
                        show: true
                    }
                },
                force: {
                    edgeLength: 100,
                    repulsion: 1500,
                    // layoutAnimation: true
                },
                //根据数据显示chart begin
                categories: CATEGORIES,
                nodes: nodes,
                links: links,
                //根据数据显示chart end
            }]
        };
    };
    // ********************************* builder end *********************************

    // ********************************* dom begin *********************************

    var customer_house = $("#customer_house");
    var content = $(".content");
    var back_btn = $("#relation-map-back-btn");
    var loading = $("#loading");

    var chart_customer_house;

    // ********************************* dom end *********************************

    var recursion_ajax = function(estates, index) {
        Common.ajax({
            url: URL.PREFIX.HOUSE + estates[index].id + URL.SUFFIX.CUSTOMERS,
            type: "get",
            async: false,
            complete: function(res) {
                var house_relations = res.responseJSON.details;

                if (house_relations != undefined) {
                    var src_node = nodes[index + 1];
                    var target_node_index = nodes.length;

                    nodes = nodes_builder_house_relations(house_relations, nodes);

                    var start_index = links.length;

                    links = links_builder(links, src_node, nodes.slice(target_node_index, nodes.length));


                    for (var i = start_index; i < links.length; i++) {
                        links[i].lineStyle.normal.width = 10;
                    }
                };

                //查完所有的房屋下的相关业主信息后,再查当前页面业主的相关客户.
                if (estates.length - 1 != index) {
                    recursion_ajax(estates, ++index);
                } else {
                    get_all_relations();
                };
            }
        })
    }


    // ********************************* Ajax begin *********************************


    //点击关系图按钮进入时执行.
    $(".entrance-relation-map").click(function(event) {
        if (has_cached) {
            view_switch();
            cur_page = PAGE.HOUSE;
        } else {

            has_cached = true;
            var data_estate = window.ownerEstates;

            //构造业主节点
            owner_node = node_builder(window.customerName, PROP.OWNER.CATEGORY, PROP.OWNER.IMG, PROP.OWNER.SHADOW_COLOR, PROP.OWNER.SHADOW_BLUR, window.customerId);

            //突出主业主节点
            owner_node.itemStyle.normal.shadowColor = "red";
            owner_node.itemStyle.normal.shadowBlur = 60;
            owner_node.symbolSize = 60;

            nodes.push(owner_node);
            nodes_set[window.customerId] = owner_node;

            if (data_estate != undefined) {
                nodes = nodes_builder_estate(data_estate, nodes);

                links = links_builder(links, nodes[0], nodes.slice(1, nodes.length));

                recursion_ajax(data_estate, 0);
            } else { //如果该业主名下没有物业,也要查询相关的亲戚
                get_all_relations();
            }
        }
    });

    // ********************************* Ajax end *********************************
    //返回事件
    back_btn.click(function(event) {
        view_switch();
    })

});
