window.Page_index = {};
window.editstate = false;//房屋的合并状态

function breadTemp(breadcrumb) {
    if (breadcrumb) {
        var arr = [],
            str = '';
        for (var i = breadcrumb.length - 1; i < breadcrumb.length; i++) {
            str = "<span title='" + breadcrumb[i]["text"] + "'>当前位置：" + breadcrumb[i]["text"] + "</span>";
            arr.push(str);
        }
        ;
        return arr.join(" / ")
    }
}
/* tree */
(function ($, wrapId) {
    var config = {
        url_getTreeData: servicePath.house + '/v1/organization/tree',
        url_getOptions: servicePath.house + '/v1/organization/items',
        url_getMCOptions: servicePath.house + '/v1/organization/McAndCompany',
        url_getPJOptions: servicePath.house + '/v1/organization/project',
        url_getHouse: servicePath.house + '/v1/house/queryByProjectId',
        url_getReverseTree: servicePath.house + '/v1/organization/reverseTree',
        label: {
            treeids: "treeids",
            treetype: "treetype"
        },
        keys: {
            floor: '5',
            unit: '6',
            parking: '9'
        },
        css: {
            show: "vkt-active",
            loading: "vkt-loading",
            brank: "vk-tree-brank",
            leaf: "listbar-li"
        },
        basePaddingLeft: 10,
        paddingLeft: 14
    }

    var jq_wrap;


    function renderLi(data, index, pdleft, selectedId, list) {
        var hasChild = data["hasChild"],
            text = data["name"] + (data["levelType"] == config.keys.unit ? '单元' : ''),
            id = data["id"],
            levelType = data["levelType"],
            outer = data["outer"],
        // structuretype = data["structuretype"],
        // active = nextId == id && !hasChild,
        // showChild = nextId == id,
            active = selectedId == id,
            showChild = data["open"],
            html = '';
        if (outer) {
            text = text + "(外)";
        }
        //html
        html += '<li class="' + (showChild ? config.css.show : config.css.loading) + (active ? ' on' : '') + '"'
        html += ' data-id="' + id + '"'
        html += ' data-index="' + index + '"'
        html += ' data-haschild="' + (hasChild ? 1 : 0) + '"'
        html += ' data-leveltype="' + levelType + '"'
        // html += ' data-structuretype="' + structuretype + '"'
        html += '>'
        html += '<div class="' + (hasChild ? config.css.brank : "") + '">'
        html += '<span  style="padding-left:' + pdleft + 'px;">' + text;
        if (hasChild) {
            html += '<i class="refresh"></i>'
        }
        html += '</span></div>'
        if (showChild && list && list.length) {
            html += renderInit(list, index + 1, selectedId);
        }
        '</li>'
        return html;
    }

    function renderLeaf(arr, index) {
        var _li = [],
            htmlUl = '<ul>',
            pdleft = config.basePaddingLeft + (index - 1) * config.paddingLeft;
        for (var i = 0; i < arr.length; i++) {
            var data = arr[i],
                html = renderLi(data, index, pdleft, null, null);
            _li.push(html);

        }
        ;
        return htmlUl + _li.join("") + '</ul>';
    }


    function renderInit(list, index, selectedId) {
        var curObj = list[0],
        // curArr = curObj["list"],
        // curId = curObj["id"],
        // nextId = list[1] && list[1]["id"],
            _li = [],
            htmlUl = '<ul>',
            pdleft = config.basePaddingLeft + (index-1) * config.paddingLeft;
        list = list.slice(1);
        var html = ''
        for (var i = 0; i < curObj.length; i++) {
            var data = curObj[i];
            html = renderLi(data, index, pdleft, selectedId, list);
            _li.push(html);
        }
        ;
        return htmlUl + _li.join("") + '</ul>';
    }

    var ajaxHandle = null;

    function ajax(jq_li, ids) {
        var index = (parseInt(jq_li.attr("data-index")) + 1) || 1,
            treeId = ids || jq_li.attr("data-id"),
            hasChild = jq_li.attr("data-haschild"),
        // structuretype = jq_li.attr("data-structuretype"),
            levelType = jq_li.attr("data-leveltype");


        if (ajaxHandle) {
            ajaxHandle.abort();
        }
        ajaxHandle = Common.ajax({
            url: ids ? config.url_getReverseTree : config.url_getTreeData,
            type: 'get',
            data: {
                treeNodeId: treeId,
                // isleaf: isleaf,
                levelType: levelType
                // structuretype: structuretype
            },
            success: function (res) {
                // alert(JSON.stringify(res))
                if (res.success) {
                    var html = '';
                    if (ids) {
                        var selectedId = treeId.split(",").pop();
                        html = renderInit(res.details, index, selectedId);
                    } else {
                        html = renderLeaf(res.details, index);
                    }
                    jq_li.find("ul").remove();
                    jq_li.append(html);
                    jq_li.removeClass(config.css.loading);
                    $("#vankeTree>ul>li>div").addClass("first-tree-brank");
                    $("#vankeTree>ul>li").first().children("ul").addClass("firstul");
                    // setTimeout(function(){
                    //     $(".first-tree-brank").first().click();   
                    // },200);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function getIds(curLi) {
        var s = curLi.attr("data-id"),
            lt = curLi.attr("data-leveltype")
        if (lt == config.keys.parking) {

        }
        var li = curLi.parent().parent();
        if (li.get && li.get(0).nodeName == 'LI') {
            return getIds(li) + ',' + s;
        }
        return s;
    }

    function show(jq_li) {
        jq_li.siblings().removeClass(config.css.show);
        jq_li.addClass(config.css.show);
    }

    function hide(jq_li) {
        jq_li.removeClass(config.css.show);
    }

    function getParam(li) {
        var levelType = li.attr("data-leveltype"),
            id = li.attr("data-id"),
            obj = {
                projectId: undefined,
                buildingId: undefined,
                unitId: undefined
            };
        if (levelType === config.keys.unit) {
            var buildingLi = li.parent().parent(),
                projectLi = buildingLi.parent().parent(),
                buildingId = buildingLi.attr("data-id"),
                projectId = projectLi.attr("data-id");
            obj["unitId"] = id;
            obj["buildingId"] = buildingId;
            obj["projectId"] = projectId;
        }
        if (levelType === config.keys.floor) {
            var projectLi = li.parent().parent(),
                projectId = projectLi.attr("data-id");
            obj["buildingId"] = id;
            obj["projectId"] = projectId;
        }
        if (levelType === config.keys.parking) {
            var projectLi = li.parent().parent(),
                projectId = projectLi.attr("data-id");
            obj["projectId"] = projectId;
			obj["carparkId"] = id;
        }
        return obj;

    }

    function getBreadcrumb(li, list) {
        var arr = list || [],
            obj = {},
            pli = li.parent().parent();
        obj["text"] = li.children(":first").text();
        arr.unshift(obj);
        if (pli.prop("nodeName") == 'LI') {
            getBreadcrumb(pli, arr)
        }
        return arr;
    }

    function bindEvent() {
        jq_wrap.on("click", "li", function () {
            var li = $(this),
                hasChild = li.attr("data-haschild") == '1',
                levelType = li.attr("data-leveltype"),
                id = li.attr("data-id"),
                isShow = li.hasClass(config.css.show),
                isLoading = li.hasClass(config.css.loading),
				text = li.text();

            if (levelType == "3"||levelType=="8") {
                getOptions(id);
                clickTreeSearchChange(levelType, text);
            }
            else if (levelType == "4") {
                clickTreeSearchChange(levelType, text);
            }//房屋树和查询条件联动

            $("#buildingPanel").css("top", "42px");
            $("#house-combine-btn").hide();
            if (!hasChild) {
                var idObj = getParam(li),
                    bread = getBreadcrumb(li);

                //去掉房屋合并的状态
                window.editstate = false;
                $('#house-combine-btn').hide();
                $('#buildingList').find(".floor-room").removeClass('active');

                if (config.keys.floor == levelType || config.keys.unit == levelType) {
                    Page_index.floor.init(idObj, bread);
                } else if (config.keys.parking == levelType) {
                    Page_index.parking.init(idObj, bread);
                }
                //set hash
                var _treeids = getIds(li);
                if (config.keys.floor == levelType) {
                    _treeids += ',';
                }
                var _o = {};
                _o["treeids"] = _treeids;
                _o["leveltype"] = levelType;
                Common.hash.set(_o);
                //add class
                jq_wrap.find("li").removeClass("on");
                li.addClass("on");
            } else {
                if (isShow) {
                    hide(li)
                } else if (isLoading) {
                    show(li)
                    ajax(li)
                } else {
                    show(li)
                }
            }

            return false;
        });
        jq_wrap.on("click", ".refresh", function () {
            var icon = $(this),
                li = icon.parent().parent().parent();
            ajax(li);
            return false;
        });
        $("#sel_mc").bind("change", function () {
            var checkMc = $("#sel_mc").val();
            getOptions(checkMc);

        });
        $("#sel_prj").bind("change", function () {
            $("#houseName").val("");
            $("#houseId").val("");
            $("#unitId").val("");
            $("#floor").val("");
            $("#buildingId").val("");
            $("#search_projectId").val("");
        });
    }

    function init(ids) {
        jq_wrap = $(wrapId);
        bindEvent();
        getHouseInfo();
        initOptions();
        ajax(jq_wrap, ids);
    }

    /*****************
     *****************
     项目树和查询条件联动开始
     *****************
     *****************/
    function initOptions() {
        Common.ajax({
            url: config.url_getMCOptions,
            type: 'get',
            data: {},
            success: function (res) {
                if (res.success) {
                    var details = res.details;
                    for (var i = 0; i < details.length; i++) {
                        $("#sel_mc").append("<option value='" + details[i].id + "'>" + details[i].name + "</option>");
                    }
                    var checkMc = $("#sel_mc").val(); //默认第一个选择的管理中心的ID
                    getOptions(checkMc);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        });

    }

    function clickTreeSearchChange(isMc, id) {
        var jq = isMc ? $("#sel_mc"):$("#sel_prj");
        jq.val(id)

    }//点击项目树联动查询条件


    /**
     * 获取层级信息
     * @param levelType
     * @param parentId
     * @param select
     */
    function getOptions(parentId) {
        $("#sel_prj").empty(); //先清空所有选项

        Common.ajax({
            url: config.url_getPJOptions,
            type: 'get',
            data: {
                levelType: 4,//4代表项目层级，需要联动的层级
                parentId: parentId
            },
            success: function (res) {
                if (res.success) {
                    var details = res.details;
                    for (var i = 0; i < details.length; i++) {
                        $("#sel_prj").append("<option value='" + details[i].id + "'>" + details[i].name + "</option>");
                    }
                }
            },
            error: function () {

            },
            complete: function () {

            }
        });
    }

    /*****************
     *****************
     项目树和查询条件联动结束
     *****************
     *****************/
    var query_handle = null;

    function getHouseInfo() {
        $('#houseName').typeahead({
            items: 30,
            source: function (query, process) {
                if (query_handle) {
                    query_handle.abort();
                }
                var serarchName = $("#houseName").val();
                var projectId = $("#sel_prj").val();
                query_handle = Common.ajax({
                    url: config.url_getHouse,
                    type: "get",
                    data: {
                        projectId: projectId,
                        houseName: serarchName
                    },
                    success: function (res) {
                        products = res.details;
                        var arr = [];
                        for (var i = 0; i < products.length; i++) {
                            arr.push(products[i].id);
                        }
                        ;
                        process(arr);

                    }
                })
            },

            matcher: function (item) {
                return true;
            },

            highlighter: function (id) {
                //format 渲染控件下拉内容
                var obj;
                for (var i = 0; i < products.length; i++) {
                    if (products[i].id == id) {
                        obj = products[i];
                        return obj.name + '(' + obj.unit + ')'; //todo
                    }
                }
                ;
            },
            updater: function (id) {
                //拿取id，赋值与hidden，返回 控件内容
                var info;
                for (var i = 0; i < products.length; i++) {
                    if (products[i].id == id) {
                        $("#houseId").val(id);
                        $("#unitId").val(products[i].unitId);
                        $("#floor").val(products[i].floor);
                        $("#buildingId").val(products[i].buildingId);
                        $("#search_projectId").val(products[i].projectId);
                        $("#houseName").val(products[i].name);
                        info = products[i];
                        return info.name;
                    }
                }
                ;
            }
        });
        $("#search_house").click(function () {
            var projectId = $("#search_projectId").val();
            var unitId = $("#unitId").val();
            var floor = $("#floor").val();
            var buildingId = $("#buildingId").val();
            var data = {
                projectId: projectId,
                unitId: unitId,
                floorIndex: floor,
                buildingId: buildingId,
                curPage: 1
            };
            var curpage = 1;
            Page_index.floor.init(data);
            Page_index.floor.getRooms(data, curpage);
        });

    }

    Page_index.tree = {
        init: init
    }
})(jQuery, "#vankeTree");

/*车场 parking list */
(function ($, wrapId) {
    var _hasInit = false,
        jq_wrap = null,
        jq_nav = null,
        jq_select = null,
        jq_groupOk = null,
        jq_groupCancel = null,
        jq_panels = null,
        jq_breadcrumb = null,
        temp_park = null,
        isEditModal = false,
        func_nav = null;

    var _projectId,
		_carparkId;

    var config = {
        url_getGroups: servicePath.house + '/v1/carport/groups/{:projectId}/{:carparkId}',
        url_getGroupCarports: servicePath.house + '/v1/carport/group/{:projectId}/{:carparkId}/{:id}',
        url_getUngroupCarports: servicePath.house + '/v1/carport/{:projectId}/{:carparkId}/ungroup',
		url_getFoundGroup: servicePath.house + '/v1/carport/querygroup/{:projectId}/{:carparkId}',
        css_editModal: "edit-modal",
        parkingTempId: "#indexParkTemp"
    };

    function changGroup(event, link) {
        var jq_link = $(link),
            panelId = jq_link.attr("href"),
			isQuery = jq_link.attr("query"),
            moreId = panelId + '_more',
            more = $(moreId),
            groupId = more.attr("data-groupid"),
            curPage = more.attr("data-curpage");
        if (!curPage || isQuery=='true') {
            if (isQuery=='true')
				jq_link.attr("query","false");

		getPark({
                projectId: _projectId,
				carparkId: _carparkId,
                groupId: groupId,
                curPage: curPage || 1
            }, moreId)
        }


    }

    var getGroup_ajaxHandle = null;
	var foundGroup_ajaxHandle = null;

    function getGroup(data) {
        var url = '';
		url = config.url_getGroups.replace("{:projectId}", data["projectId"]).replace("{:carparkId}", data["carparkId"]);
        if (getGroup_ajaxHandle) {
            getGroup_ajaxHandle.abort();
        }
        getGroup_ajaxHandle = Common.ajax({
            url: url,
            type: "get",
            //data: data,
            success: function (res) {
                if (res.success) {
                    //alert(JSON.stringify(res));
                    renderGroup(res.details);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    //点击车位模块跳转页面
    function carportInfo(parkId) {
        if (!parkId) {
            return;
        }
        var url = path.server + '/page/carport/' + parkId + '/details';
        window.location.href = url;
    }


    function getPark(data, moreId) {
        var url = '';
        if (data["groupId"]) {
            url = config.url_getGroupCarports.replace("{:projectId}", data["projectId"]).replace("{:carparkId}", data["carparkId"]).replace("{:id}", data["groupId"]);
            delete data["projectId"];
        } else {
            //url = config.url_getUngroupCarports.replace("{:projectId}", data["projectId"].slice(3));
			url = config.url_getUngroupCarports.replace("{:projectId}", data["projectId"]).replace("{:carparkId}", data["carparkId"]);
            delete data["groupId"];
        }

        var jq_more = $(moreId);
        jq_more.addClass("park-loading");
        Common.ajax({
            url: url,
            type: "get",
            data: {
                curPage: data.curPage,
				carportName: $("#carportName").val() || ''
            },
            success: function (res) {
                // alert(JSON.stringify(res))
                if (res.success) {
                    var d = res.details,
                        noMore = (d.pagination["totalPage"] == 0) || (d.pagination["curPage"] == d.pagination["totalPage"]);
                    renderPark(d, moreId, noMore);
                    jq_more.attr("data-curpage", data["curPage"]);
                }
                jq_more.removeClass("park-loading");
            },
            error: function () {
                jq_more.removeClass("park-loading");
            },
            complete: function () {


            }

        })
    }

    function renderGroup(data) {
        var navHtml = '',
            optionHtml = '',
            panelHtml = '';
        /*
        data.unshift({
            id: '',
            name: '选择分组'
        })
		*/
        for (var i = 0; i < data.length; i++) {
            var d = data[i],
                tabid = 'parkinggroup_' + i,
                moreId = tabid + '_more';
            navHtml += '<li><a href="#' + tabid + '" query="false" data-groupid="' + d["id"] + '">' + (d.name=="UNGROUP" ? '选择分组' : d.name) + '</a></li>';
            panelHtml += '<div class="park-wrap" id="' + tabid + '"><div class="park park-more" id="' + moreId + '" data-groupid="' + d["id"] + '"></div></div>';
            optionHtml += '<option value="' + d["id"] + '">' + (d["name"]=="UNGROUP" ? '选择分组' : d["name"]) + '</option>';
        }
        ;
        jq_nav.html(navHtml);
        jq_panels.html(panelHtml);
        jq_select.html(optionHtml);
        // 获取未分组车位
        func_nav.fire(0);
    }

    function renderPark(data, moreId, noMore) {
        var html = temp_park(data);
        jq_more = $(moreId);
        jq_more.before(html);
        if (noMore) {
            jq_more.hide();
        } else {
			jq_more.show();
        }
    }

    function bindVariable() {
        jq_wrap = $(wrapId);
        jq_nav = $("#parkingNav");
        jq_select = $("#parkingSelect");
        jq_groupOk = $("#parkingGroupOk");
        jq_groupCancel = $("#parkingGroupCancel");
        jq_breadcrumb = $("#parkBreadcrumb");
        jq_panels = $("#parkingPanels");

        temp_park = template.compile($(config.parkingTempId).html());
    }

    function show() {
        jq_wrap.addClass("on").siblings().removeClass("on");
    }

    function submitGroup() {
        var ids = [],
            groutId = jq_select.val();
        if (!groutId) {
            alert("请选择分组");
            return;
        }
        jq_panels.children(".active").find(".park.on").each(function (i, item) {
            var that = $(this)
            ids.push(that.attr("data-id"));
        })
        Common.ajax({
            url: config.url_submitGroup,
            type: "put",
            data: {
                carportIds: ids.join(","),
                groupId: groutId
            },
            success: function (res) {
                if (res.success) {
                    alert("分组成功");
                    // jq_panels.find(".park-more").removeAttr("data-id");
                    // changGroup({},jq_nav.find("li.active a"))
                    func_nav.fire(0);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function bindEvent() {
        func_nav = Common.navigation("#parkingNav", changGroup);
        $(".j_btnSetGroup", jq_wrap).on("click", function () {
            //jq_wrap.toggleClass(config.css_editModal)
            $(".dtn-team").toggleClass("dtn-team-block");
            isEditModal = !isEditModal;
        })
        jq_wrap.on("click", ".park", function () {
            if (isEditModal) {
                $(this).toggleClass("on");
            }
        })
        jq_wrap.on("click", ".park-more", function () {
            var more = $(this),
                moreId = '#' + more.attr("id"),
                groupId = more.attr("data-groupid"),
                curPage = more.attr("data-curpage");
            if (curPage) {
                curPage++;
                getPark({
                    projectId: _projectId,
					carparkId: _carparkId,
                    groupId: groupId,
                    curPage: curPage
                }, moreId)
            }
        })

        $("#parkingGroupOk", jq_wrap).on("click", function () {
            submitGroup();
        })

        $("#parkingGroupCancel", jq_wrap).on("click", function () {
            jq_wrap.removeClass(config.css_editModal)
        })


        var jq_dialog = $("#modal_carportDetail");
        var carportId;
        jq_panels.on("click", ".park-name", function () {
            carportId = $(this).parent().attr("data-id");
            //jq_dialog.modal();
            //ajaxGetCarportDetail(carportId);
            carportInfo(carportId);
        });//点击车场跳转详情页面
		
		$("#carportName").change(function () {
			$("#parkingNav").find('a[query]').attr("query","true");
			
			$("#parkingPanels div.park[data-id]").remove();
			var jq_link = $("#parkingNav li.active a"),
			panelId = jq_link.attr("href"),
            moreId = panelId + '_more',
            more = $(moreId);
            more.attr("data-curpage","");
			changGroup(null, $("#parkingNav li.active a"));
		});
		
		$("#search_carport").click(function () {
			var url = '';
			url = config.url_getFoundGroup.replace("{:projectId}", _projectId).replace("{:carparkId}", _carparkId);
			if (foundGroup_ajaxHandle) {
				foundGroup_ajaxHandle.abort();
			}
			foundGroup_ajaxHandle = Common.ajax({
				url: url,
				type: "get",
				data: {
					carportName: $.trim($("#carportName").val()) || ''
				},
				success: function (res) {
					if (res.success) {
						//alert(JSON.stringify(res));
						$("#parkingNav").find('a[data-groupid="' + res.details + '"]').trigger("click");
					}
				},
				error: function () {

				},
				complete: function () {

				}
			})
        });


        var modal_carportDetail = $("#modal_carportDetail");
        modal_carportDetail.on("click", "#modal_tansfercustomer_btn", function () {
            //todo
            $("#carport_customers").addClass("editmode");
            $("#ownerName").removeClass("hidden").show();
            var query_handle = null,
                products;
            $("#modal_tansfercustomer_btn").toggleClass("hidden");
            $("#oldownerName").toggleClass("hidden");
            $("#modal_transfercarport_btn").toggleClass("hidden");
            $("#modal_transfercarport_btn").bind("click", function () {
                var carportId = $("#carportId").val();
                var newOwnerId = $("#carport_customers").find("span.word").map(function () {
                    return $(this).attr("data-id");
                });
                newOwnerId = Array.prototype.join.call(newOwnerId, ",");
                if (newOwnerId == null || newOwnerId == "") {
                    $("#div_ownerName").addClass("error");
                    return;
                }
                Common.ajax({
                    url: servicePath.house + "/v1/carport/carportInfo/" + carportId + "/carportTransfer",
                    type: "post",
                    data: {
                        newIds: newOwnerId
                    },
                    success: function () {
                        ajaxGetCarportDetail(carportId);
                    }
                });
            });
            $('#ownerName').typeahead({
                source: function (query, process) {
                    if (query_handle) {
                        query_handle.abort();
                    }
                    var serarchName = $("#ownerName").val();
                    var projectId = $("#projectId").val();

                    query_handle = Common.ajax({
                        url: Config.customerPath + "/v1/customer/queryCustomer4CarportTransfer/" + projectId,
                        type: "get",
                        data: {
                            name: serarchName
                        },
                        success: function (res) {
                            products = res.details;
                            var arr = [];
                            for (var i = 0; i < products.length; i++) {
                                arr.push(products[i].id);
                            }
                            ;

                            process(arr);

                        }
                    })
                },

                matcher: function (item) {
                    return true;
                },

                highlighter: function (id) {
                    //format 渲染控件下拉内容
                    var obj;
                    for (var i = 0; i < products.length; i++) {
                        if (products[i].id == id) {
                            obj = products[i];
                            return '姓名:' + obj.fullName + '   证件号码:' + obj.certificateId; //todo
                        }
                    }
                    ;
                },
                updater: function (id) {
                    //拿取id，赋值与hidden，返回 控件内容
                    var info;
                    for (var i = 0; i < products.length; i++) {
                        if (products[i].id == id) {
                            $("#newOwnerId").val(id);
                            $("#ownerName").val(products[i].fullName);
                            info = products[i];
                            //渲染一个标签
                            //<span class="word">
                            //        <span>name</span>
                            //        <span>mobile</span>
                            //        <i>&time;</i>
                            //    </span>
                            $("#carport_customers").append("<span class='word' data-id='" + info.id + "'><span>" + info.fullName + "</span><span>" + info.mainMobile + "</span><i>X</i></span>");
                            return info.fullName;
                        }
                    }
                    ;
                }
            })


        })

    }

    function ajaxGetCarportDetail(carportId) {
        var url = servicePath.house + '/v1/carport/carportInfo/' + carportId;

        Common.ajax({
            url: url,
            type: "get",
            success: function (res) {
                var html = template('carportDetail', res.details);
                var customerInfo = res.details.customerInfos;
                $('#modal_carportDetail').html(html);
                renderCarportDetail(customerInfo);
                $("#carport_customers").on("click", "i", function () {
                    $(this).parent().remove();
                });
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function renderCarportDetail(customerInfo) {
        for (var i = 0; i < customerInfo.length; i++) {
            $("#carport_customers").append("<span class='word' data-id='" + customerInfo[i].customerId + "'><span>" + customerInfo[i].owner + "</span><span>" + customerInfo[i].mainMobile + "</span><i>X</i></span>");
        }
    }

    function init(opt, breadcrumb) {
        if (!_hasInit) {
            _hasInit = true;
            // init
            bindVariable();
            bindEvent();
        }
        active(opt, breadcrumb);
        show();
    }

    function active(opt, breadcrumb) {
        _projectId = opt.projectId;
        _carparkId = opt.carparkId;
        jq_nav.empty();
        jq_select.empty();
        jq_panels.empty();
        jq_breadcrumb.html(breadTemp(breadcrumb))
        getGroup({
            projectId: _projectId,
			carparkId: _carparkId
        })

    }

    Page_index.parking = {
        init: init
    }
})(jQuery, "#indexParkPanel");

/* floor list */
(function ($, wrapId) {
    var _hasInit = false,
        jq_wrap = null,
        jq_buildingList = null,
        jq_breadcrumb = null,
        jq_subroomList = null,
        jq_panel = null,
        floorTemp = null,
        subroomTemp = null,
        roomTemp = null,
        roomIds = [];


    var _projectId,
        _buildingId,
        _unitId;

    var config = {
        url_getFloors: servicePath.house + '/v1/house/floor',
        url_getSubroom: servicePath.house + '/v1/house/subhouse',
        url_getRooms: servicePath.house + '/v1/house/floor/overviews',
        url_mergeRooms: servicePath.house + '/v1/house/{:houseIds}/merge',
        url_mergeSubRooms: servicePath.house + '/v1/subHouse/{:subHouseIds}/merge',
        url_splitRoom: servicePath.house + '/v1/house/{:houseId}/split',
        url_splitSubRoom: servicePath.house + '/v1/subHouse/{:subHouseId}/split',
        url_delSubRoom: servicePath.house + '/v1/house/{:subHouseId}/del',
        floorTempId: "#indexFloorTemp",
        roomTempId: "#indexRoomTemp",
        subroomTempId: "#subroomTemp",
        buildingListId: "#buildingList",
        status: {
            "%E5%B8%B8%E4%BD%8F": 'state01', //常住
            "%E7%A9%BA%E7%BD%AE": 'state02', //空置
            "%E5%BA%A6%E5%81%87": 'state03', //度假
            "%E5%87%BA%E7%A7%9F": 'state04', //出租
            "%E8%BD%A6%E4%BD%8D": 'state05' //车位
        }
    }
    var getFloors_ajaxHandle = null;

    function getFloors(data) {
        if (getFloors_ajaxHandle) {
            getFloors_ajaxHandle.abort();
        }
        getFloors_ajaxHandle = Common.ajax({
            url: config.url_getFloors,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    renderFloors(data, res.details);
                }
                if (data.floorIndex != undefined) {
                    jq_buildingList.find("[data-floor=" + data.floorIndex + "] .floor-header").trigger("click");
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    var getRooms_ajaxHandle = null;

    function getRooms(data, roomMoreId) {
        if (getRooms_ajaxHandle) {
            getRooms_ajaxHandle.abort();
        }
        var more = $(roomMoreId, jq_buildingList);
        more.addClass("floor-loading")
        getRooms_ajaxHandle = Common.ajax({
            url: config.url_getRooms,
            type: "get",
            data: data,
            success: function (res) {
                // var data = JSON.stringify(res.details);
                // alert(data);
                if (res.success) {
                    var d = res.details,
                        noMore = (d.pagination["totalPage"] == 0) || (d.pagination["curPage"] == d.pagination["totalPage"]);

                    renderRooms(d, roomMoreId, noMore)
                    more.attr("data-curpage", data["curPage"]);
                }

            },
            error: function () {

            },
            complete: function () {
                more.removeClass("floor-loading")
            }
        })
    }

    function renderFloors(data, floors) {
        var html = floorTemp({
            moreid: data.buildingId + '_' + data.unitId,
            floors: floors
        });
        jq_buildingList.html(html);
    }

    function renderRooms(data, roomMoreId, noMore) {
        for (var i = 0; i < data.list.length; i++) {
            var d = data.list[i],
                key = encodeURI(d["statusText"]);
            // d["css_status"] = config.status[key];
        }
        ;
        var html = roomTemp(data),
            jq_roomMore = $(roomMoreId);

        jq_roomMore.before(html);
        if (noMore) {
            jq_roomMore.hide();
        }
    }

    function show() {
        jq_wrap.addClass("on").siblings().removeClass("on");
    }

    function bindVariable() {

        // function
        jq_wrap = $(wrapId);
        jq_buildingList = $(config.buildingListId);
        jq_breadcrumb = $("#floorBreadcrumb");
        jq_subroomList = $("#subroomList");
        jq_panel = $("#buildingPanel");
        floorTemp = template.compile($(config.floorTempId).html());
        roomTemp = template.compile($(config.roomTempId).html());
        subroomTemp = template.compile($(config.subroomTempId).html());
    }

    function bindEvent() {
        jq_buildingList.on("click", ".floor-header", function () {
            var jq_header = $(this),
                parent = jq_header.parent(),
                floorId = parent.attr("data-floor"),
                more = parent.find(".floor-more"),
                moreId = "#" + more.attr("id");

            //清空每层要合并的id
            roomIds = [];
            jq_buildingList.find('.floor-room').removeClass('active');

            parent.toggleClass("on");
            if (parent.hasClass("on")) {
                parent.siblings().removeClass("on");
                parent.get(0).scrollIntoView();
            }
            // getRoom
            if (more.attr("data-curpage")) {
                return;
            } else {
                getRooms({
                    projectId: _projectId,
                    buildingId: _buildingId,
                    unitId: _unitId,
                    floor: floorId,
                    curPage: 1
                }, moreId)
            }
        })

        jq_buildingList.on("click", ".floor-more", function () {
            var more = $(this),
                curPage = more.attr("data-curpage"),
                floor = more.parent().parent(),
                floorId = floor.attr("data-floor"),
                moreId = "#" + more.attr("id");
            getRooms({
                projectId: _projectId,
                buildingId: _buildingId,
                unitId: _unitId,
                floor: floorId,
                curPage: parseInt(curPage) + 1
            }, moreId)
        })

        //jq_buildingList.on("click", ".room-sb", function () {
        //    var span = $(this),
        //        room = span.parent().parent().parent().find(".along-house-Info"),
        //        roomId = room.attr("data-id"),
        //        subroom = span.find(".room-list")
        //    if (subroom.length) {
        //        showSubroom(subroom)
        //    } else {
        //        getSubroom({
        //            houseId: roomId
        //        })
        //        return false;
        //    }
        //})

        $("#buildingCover").on("click", function () {
            jq_panel.removeClass("active");
            return false;
        })

        /*--------
         -------
         合并房屋功能开始
         ----------
         -----*/
        var houseBar = $("#buildingPanel");
        $("#btn-sure").on("click", function () {

            if (roomIds.length > 1) {

                //弹出房屋信息输入框
                $('#mergeModal').modal('show');
            } else {
                alert("合并房屋需要选择2个及以上房屋才能进行");
            }
        });//确定合并

        $("#btnMerge").on("click", function () {

            var name = $('#parentHouseName').val();
            var times = $('#parentHousecheckinTime').val();
            var data = {};
            //modified by liaochao 20160126 begin
            if (name && times && $.trim(name) !="") {
            //modified by liaochao 20160126 end

                $("#dtn-sure").parent().hide();
                //去掉编辑状态
                window.editstate = false;

                var parent = jq_buildingList.find(".on"),
                    floorId = parent.attr("data-floor"),
                    more = parent.find(".floor-more"),
                    moreId = "#" + more.attr("id");
                jq_buildingList.find(".active").removeClass("active");

                data.houseName = name;
                data.houseIds = roomIds;
                data.checkinTime = times;

                //合并房屋
                mergeRooms(data);


                //清空原本合并数据
                $('#parentHouseName,#parentHousecheckinTime').val('');
                $('#mergeModal').modal('hide');

            } else {

                alert("名称跟入住时间不能为空");
                return false;
            }

            // houseBar.css("top", "42px");
        });//取消合并

        $("#btn-cancel").on("click", function () {
            $(this).parent().hide();
            var parent = jq_buildingList.find(".floor-room");
            parent.removeClass("active");
            window.editstate = false;
            //清空已经添加要合并的id;
            roomIds = [];
            houseBar.css("top", "42px");
        });//取消合并

        $("#house-combine").on("click", function () {
            window.editstate = true;
            //var onfloorbox=jq_buildingList.find(".on");
            $("#house-combine-btn").show();
            houseBar.css("top", "80px");
            roomIds = [];
        });//点击房屋合并按钮

        var moarray = {};

        /**
         * [in 返回位置]
         * @param  {[type]} id : 字符串 ; arr : 数组
         * @return {[type]} boolean
         */
        moarray.In = function (id, arr) {

            var index = '-1';
            for (var i = 0; i < arr.length; i++) {
                try {
                    if (arr[i] == id) {
                        index = i;
                    }
                    return index;
                } catch (e) {
                }
            }
        }

        /**
         * [compare 比对数组是否已经存在]
         * @param  {[type]} id : 字符串 ; arr : 数组
         * @return {[type]} boolean
         */
        moarray.compare = function (id, arr) {
            for (var i = 0; i < arr.length; i++) {
                try {
                    if (arr[i] == id) {
                        return true;
                    }
                } catch (e) {
                }
            }
        }

        /**
         * [remove 删除存在的数组对象]
         * @param  {[type]} id : 字符串 ; arr : 数组
         * @return {[type]} boolean
         */
        moarray.remove = function (id, arr) {
            for (var key in arr) {
                try {
                    if (arr[key] == id) {
                        //delete arr[key];
                        arr = arr.splice(key, 1);
                    }
                } catch (e) {
                }
            }
        }
        //对第一层房屋处理
        jq_buildingList.add(jq_subroomList).on("click", ".floor-room-wrap>.floor-room", function (e) {

            var $this = $(this);
            var roomId = $this.attr("data-id");

//             //如果有id并不是编辑状态,跳转
            if (roomId && window.editstate == false) {
                viewRoomInfo(roomId);
            }
            //如果有id 而且编辑状态为true,进入合并状态
            if (roomId && window.editstate == true) {

                if ($this.hasClass('active')) {
                    $this.removeClass("active");
                    //如果有这个id则删除
                    if (moarray.compare(roomId, roomIds)) {
                        moarray.remove(roomId, roomIds);
                    }
                } else {

                    $this.addClass("active");
                    //清空合并id数组
                    roomIds.push(roomId);
                }
            }

            e.stopPropagation();

        })
        //对第二成房屋处理
        jq_buildingList.on("click",".floor-room-split .along-house-Info,.floor-room-split .merge-house-info,.floor-room-split .floor-room-okhouse,.floor-room-merge .merge-house-info,.floor-room-merge .floor-room-okhouse,.hlist li,.floor-room .floor-room", function (e) {

            var $this = $(this);
            var roomId = $this.attr("data-id");

            if (roomId && window.editstate == false) {

                var roomId = $this.attr("data-id");
                viewRoomInfo(roomId);

            }

        })//点击楼层展开加载房屋列表
        /*--------
         -------
         合并房屋功能结束
         ----------
         -----*/
    }

    // 合并房屋
    var mergeRooms_ajaxhandle = null;

    function mergeRooms(data) {
        if (mergeRooms_ajaxhandle) {
            mergeRooms_ajaxhandle.abort();
        }

        var newurl = config.url_mergeRooms.replace("{:houseIds}", data.houseIds.join(','));

        mergeRooms_ajaxhandle = Common.ajax({
            url: newurl,
            type: "post",
            data: data,
            success: function (res) {

                if (res.success) {

                    //刷新房屋数据
                    var parent = jq_buildingList.find(".on"),
                        floorId = parent.attr("data-floor"),
                        more = parent.find(".floor-more"),
                        moreId = "#" + more.attr("id");

                    $(moreId).addClass("park-loading")
                        .show()
                        .prevAll().remove();
                    getRooms({
                        projectId: _projectId,
                        buildingId: _buildingId,
                        unitId: _unitId,
                        floor: floorId
                    }, moreId);


                    alert("合并成功");

                }


            },
            error: function () {
            },
            complete: function () {

            }
        })
    }

    var getSubroom_ajaxhandle = null;

    function getSubroom(data) {
        if (getSubroom_ajaxhandle) {
            getSubroom_ajaxhandle.abort();
        }
        jq_subroomList.html("loading");
        jq_panel.addClass("active")
        getSubroom_ajaxhandle = Common.ajax({
            url: config.url_getSubroom,
            type: "get",
            data: data,
            success: function (res) {
                var html = subroomTemp({
                    list: res.details
                });
                jq_subroomList.html(html);
            },
            error: function () {
                jq_panel.removeClass("active")
            },
            complete: function () {

            }
        })
    }

    //点击房屋模块跳转页面
    function viewRoomInfo(houseId) {
        if (!houseId) {
            return;
        }

        var url = path.server + '/page/house/' + houseId + '/details';
        window.location.href = url;
    }


    function active(opt, breadcrumb) {
        // variable
        _buildingId = opt.buildingId;
        _unitId = opt.unitId;
        _projectId = opt.projectId;
        jq_buildingList.empty();
        jq_breadcrumb.html(breadTemp(breadcrumb));
        getFloors({
            projectId: _projectId,
            buildingId: _buildingId,
            unitId: _unitId,
            floorIndex: opt.floorIndex
        })
    }

    function init(opt, breadcrumb) {
        if (!_hasInit) {
            _hasInit = true;
            // init
            bindVariable();
            bindEvent();
        }
        active(opt, breadcrumb);
        show();

    }

    Page_index.floor = {
        init: init,
        getRooms: getRooms
    }
})(jQuery, "#indexFloorPanel");


function ExportRoom() {
    Common.loadingNeedUnload({text:'下载中...',container:'.panel-body'});
	//Common.unLoading();
	setTimeout('Common.unLoading()',5000);
	
    var url = path.server + '/page/roomsExport/export';
    document.getElementById('downloadFileFrameID2').src = url;
}


/* main */
(function () {
    // Page_index.tree.init();

    var hashObj = Common.hash.get(),
        treeids = hashObj["treeids"] || '',
        treeidsArr = treeids.split(","),
        length = treeidsArr && treeidsArr.length;
    Page_index.tree.init(treeids);
    if (treeids) {
        if (hashObj["leveltype"] == '5' || hashObj["leveltype"] == '6') {
            Page_index.floor.init({
                unitId: treeidsArr[length - 1],
                buildingId: treeidsArr[length - 2],
                projectId: treeidsArr[length - 3]
            });
        } else if (hashObj["leveltype"] == '9') {
            Page_index.parking.init({
                projectId: treeidsArr[length - 2],
				carparkId: treeidsArr[length - 1],
            })
        }
    }
    $("#btnExportRoom").on("click", function () {
        ExportRoom();
    })
})();