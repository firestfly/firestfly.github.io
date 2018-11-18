window.Page_houseinfo["relationinfo"] = (function () {
    // api/v1/house/info
    var hasInit = false,
        houseId = '',
        customerRelation_list = null,
        ownerRelation_list = null,
        temp_customerRelation = null,
        temp_ownerRelation = null,
        contactsName_list = null,
        temp_contactsName = null,
        ownerList,
        relaObj = {};
    var config = {
        url_getRelation: servicePath.customer + '/v1/house/{:id}/customers',
        // url_removeRelation: servicePath.customer + '/v1/customer/houseRelation/unbind',
        //add by liaochao 20160125 begin
        url_removeRelation: servicePath.customer + '/v1/customer/houseRelation/remove',
        //add by liaochao 20160125 end
        tempid_customerRelation: "#ownerRelationTemp",
        tempid_ownerRelation: "#ownerTemp",
        tempid_contactsName: "#contactsNameTemp"
    };
    var getRelation_ajaxHandle = null;

    function getRelation(data) {
        if (getRelation_ajaxHandle) {
            getRelation_ajaxHandle.abort();
        }
        getRelation_ajaxHandle = Common.ajax({
            url: config.url_getRelation.replace("{:id}", data.houseId),
            type: "get",
            success: function (res) {
                if (res.success) {
                    //alert(JSON.stringify(res));
                    //*******add by liaochao 20160119 begin
                    //存放与该房屋有关的所有客户(非历史客户).
                    window.currentCustomersOfHouse = res.details;
                    //*******add by liaochao 20160119 end
                    render(res)
                }
            },
            error: function () {

            },
            complete: function () {

            }
        });
        Common.loading({
            text: "",
            container: ".ly-right",
            handle: getRelation_ajaxHandle
        });
    }
    
    function eventRemoveRelation(data, li) {
        Common.ajax({
            url: config.url_removeRelation,
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    li.remove();
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })

    }

    function eventHouseRelationCode() {
        Common.ajax({
            url: servicePath.customer + '/v1/batch/dict/HouseCustomerRelationType/items',
            type: "get",
            success: function (res) {
                if (res.success) {
                    if (!ownerList) {
                        return;
                    }
                    for (var i = 0; i < ownerList.length; i++) {
                        $(".owner-tagbox").eq(i).html(template("RelationBarTemp", res));
                    }
                    //循环找出tag，取消其tag-off样式。
                    for (var index = ownerList.length - 1; index >= 0; index--) {
                        var tempOwner = ownerList[index];
                        var customerId = tempOwner.customerId;
                        var elementId = 'div[data-id="' + customerId + '"] .owner-tagbox > span.tag.';
                        var relation = tempOwner.relation;
                        for (var i = 0; i < relation.length; i++) {
                            var tagElement = elementId + relation[i].color + ".tag-off";
                            $(tagElement).removeClass("tag-off");
                        }
                    }
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }//渲染房屋关系模板

    function eventAddHouseRelation(data, span) {
        Common.ajax({
            url: servicePath.customer + '/v1/customer/houseRelation/bind',
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("新增房屋关系成功！");
                    span.removeClass("tag-off");
                }
                else {
                    alert(res.message);
                }
            },
            error: function (error) {
                if (error.message) {
                    alert(error.message);
                } else {
                    alert("新增房屋关系失败！");
                }
            },
            complete: function () {

            }
        })
    }//---------------增加房屋关系
    function eventDeleteHouseRelation(data, span) {
        Common.ajax({
            url: servicePath.customer + '/v1/customer/houseRelation/unbindByType',
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("删除房屋关系成功！");
                    span.addClass("tag-off");
                }
            },
            error: function () {
                alert("删除房屋关系失败！");

            },
            complete: function () {

            }
        })

    }//---------------删除房屋关系

    function viewCustomerInfo(customerId) {
        if (!customerId) {
            return;
        }
        var url = path.server + '/page/customer/' + customerId + '/details' + (window.houseId ? '?houseId=' + window.houseId : "");
        window.location.href = url;

    }

    function bindEvent() {
		if(hasEditRelationRole){
	        ownerRelation_list.on("click", ".tag", function () {
	            var thisOne = $(this),
	                relationType = thisOne.attr("data-code"),
	                customerId = thisOne.parent().attr("data-id");
                //add by liaochao 20160125 begin
                if(thisOne.index()==0){//如果点击的是"拥有",则不进行操作.
                    return false;
                }
                //add by liaochao 20160125 end
	            if (thisOne.hasClass("tag-off")) {
	                eventAddHouseRelation({
	                    houseId: window.houseId,
	                    customerId: customerId,
	                    relationType: relationType
	                }, thisOne)
	            }
	            else {
	                eventDeleteHouseRelation({
	                    houseId: window.houseId,
	                    customerId: customerId,
	                    relationType: relationType
	                }, thisOne)
	            }
	            return false;
	        })//--------更改客户与房屋关系
		}
        ownerRelation_list.on("click", ".bi-owner-info", function () {
            var relation = $(this),
                item = relation,
                id = item.attr("data-id"),
                obj = relaObj[id];
            viewCustomerInfo(id);
        })

        customerRelation_list.on("click", ".relation-img", function () {
            var relation = $(this),
                item = relation,
                id = item.attr("data-id"),
                obj = relaObj[id];
            viewCustomerInfo(id);
        })
        customerRelation_list.on("click", ".relation-del", function () {
            var relation = $(this),
                item = relation,
                id = item.attr("data-id"),
                obj = relaObj[id];
            var customerId = obj.customerId;
            var relations = obj.relation;

            //add by liaochao 20160125 begin
            // name =obj.relation[0].name;
            var relationTypes =[];

            for(var i=0;i<relations.length;i++){
                relationTypes.push(Number(relations[i].relationType));
            }

            var owner_style=relation.siblings('.bi-owner-tags').find('.tag-yellow').length;
            if(owner_style>0){
                return false;
            }
            //add by liaochao 20160125 end
            if (window.confirm("解除客户房屋关系?")) {
                eventRemoveRelation({
                    houseId: houseId,
                    customerId: customerId
                    //add by liaochao 20160125 begin
                    //,relationTypes: relationTypes
                    //add by liaochao 20160125 end
                }, item.parent().parent());
            }
        })
        var ownerTagbox = $("#owner-tagbox");
        ownerRelation_list.on("click", ".relation-del", function () {
            var relation = $(this),
                item = relation,
                id = item.attr("data-id"),
                obj = relaObj[id];
            var customerId = obj.customerId;
            // var relationType = obj.relation[0].relationType;
            var relationType = [];
            $(this).parent().find(".tag:not(.tag-off)").each(function(i,item){
                relationType.push($(this).attr("data-code"));
            })
            //add by liaochao 20160125 begin
            var owner_style=relation.siblings('.bi-owner-tags').find('.tag-yellow').length;
            if(owner_style>0){
                return false;
            }
            //add by liaochao 20160125 end

            // name =obj.relation[0].name;
            // if (window.confirm("解除客户房屋关系?")) {
            //     eventRemoveRelation({
            //         houseId: houseId,
            //         customerIds: customerId,
            //         relationTypes: relationType.join(",")
            //     }, item.parent());
            // }
            return false
        })
    }

    function render(data) {
        var arr = [],
            owner = [],
            rela = [];

        for (var k = 0; k < data.details.length; k++) {
            var d = data.details[k];
            var relationObj = Page_houseinfo.config.tagObj[d["relationType"]];
            if (d["relationType"] == "1") {
                owner.push(d);
                d["relation"] = [relationObj];
                relaObj[d["customerId"]] = d;
            } else {
                d["relation"] = relationObj;
                arr.push(d);
            }
        }
        ;
        for (var i = 0; i < arr.length; i++) {
            var d = arr[i],
                curObj = relaObj[d["customerId"]];
            if (curObj) {
                curObj["relation"].push(d["relation"]);
            } else {
                d["relation"] = [d["relation"]];
                relaObj[d['customerId']] = d;
                rela.push(d);
            }
        }
        ;

        var html = temp_contactsName({
            list: owner.concat(rela)
        });
        contactsName_list.html(html);

        var html = temp_customerRelation({
            list: rela
        });
        customerRelation_list.html(html);

        var html = temp_ownerRelation({
            list: owner
        });
        ownerRelation_list.html(html);
        if (owner.length > 1) {
            ownerRelation_list.addClass("bi-owner-two")
        }

        ownerList = owner;

        eventHouseRelationCode();
        //渲染房屋关系模板


        //循环找出tag，取消其tag-off样式。
        // for (var index = owner.length - 1; index >= 0; index--) {
        //     var tempOwner = owner[index];
        //     var customerId = tempOwner.customerId;
        //     var elementId = 'div[data-id="' + customerId  +'"] .bi-owner-tags .owner-tagbox > span.tag.';
        //     var relation = tempOwner.relation;
        //     for (var i = 0; i < relation.length; i++) {
        //         var tagElement = elementId + relation[i].color + ".tag-off";
        //         $(tagElement).removeClass("tag-off");
        //     };
        // };
        // $.each(function(index, owner) {
        //     var tempOwner = owner[index];
        //     var customerId = tempOwner.customerId;
        //     var elementId = 'div[data-id="' + customerId  +'"].bi-owner-tags .owner-tagbox > span .tag ';
        //     var relation = tempOwner.relation;
        //     $.each(function(index, relation) {
        //         var tagElement = elementId + relation[index].color + ".tag-off";
        //         $(tagElement).removeClass("tag-off");
        //     });
        // });
    }

    function bindVariable(data) {
        customerRelation_list = $("#ownerRelation_list");
        temp_customerRelation = template.compile($(config.tempid_customerRelation).html());

        ownerRelation_list = $("#ownerHouserRelation_list");
        temp_ownerRelation = template.compile($(config.tempid_ownerRelation).html());

        contactsName_list = $("#contactsName_list");
        temp_contactsName = template.compile($(config.tempid_contactsName).html());

    }

    function init(opt) {
        if (!hasInit) {
            hasInit = true;
            bindVariable();
            bindEvent();
        }
        active(opt);
    }

    function active(opt) {
        houseId = window.houseId
        getRelation({
            houseId: houseId
        });
    }

    return {
        init: init
    }
})();