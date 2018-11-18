window.carport = {};;//车位信息
window.carport["info"] = (function () {

    var carportId = '',
        jq_houseWrap = null,
        temp_house = null,
        house_Title = null,
        temp_Address = null,
        temp_houseStatus = null,
        houseStatusWrap = null,
        temp_houseBroadband = null,
        houseBroadbandWrap = null,
        hasInit = false,
        dictionaryCode = ["Broadband", "HouseStatus"], //宽带信息,房屋状态信息 从字典表取出渲染。
        houseInfo = {
            data: null
        },
        dictionary = null;

    var config = {
        url_getHouse: servicePath.house + "/v1/house/full",
        url_gethouseStatus: servicePath.customer + '/v1/batch/dict/' + dictionaryCode + '/items',
        url_dictionary: servicePath.customer + "/v1/batch/dict/ParkingType,EquityType,CarportStatus/items",
        url_getParkingDetail: servicePath.house + '/v1/carport/{:carportId}',
        url_getParkingCustomer: servicePath.house + '/v1/carport/{:carportId}/customer?isdeleted=',
        tempid: "#carportInfoTemp",
        addressTempid: "#carportAddressTemp",
        statusTempid: "#statusTemp",
        houseBroadbandTempid: "#broadbandTemp",
        tempid_select: '#selectTemp'
    }

    var ajaxGet_ajaxHandle = null;

    function ajaxGet(carportId) {

        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }

        var url = config.url_getParkingDetail.replace("{:carportId}", carportId);

        ajaxGet_ajaxHandle = Common.ajax({
            url: url,
            type: "get",
            success: function (res) {

                if (res.success) {
                    var data = res;

                    render(data);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    var ajaxGetDictionary_ajaxHandle = null;

    /**
     * 获取字典数据
     * @return {[type]} [description]
     */
    function ajaxGetDictionary(data) {
        if (ajaxGetDictionary_ajaxHandle) {
            ajaxGetDictionary_ajaxHandle.abort();
        }
        ajaxGetDictionary_ajaxHandle = Common.ajax({
            url: config.url_dictionary,
            type: "get",
            success: function (res) {
                // alert(JSON.stringify(res));
                if (res.success) {
                    dictionary = res.details;

                    renderDictionary(dictionary);
                }
            },
            error: function (error) {
                alert(error.message);
            },
            complete: function () {
            }
        })
    }

    var getCarportContacts_ajaxHandle = null;

    /**
     *
     * @param data
     */
    function getCarportContacts(data) {
        if (getCarportContacts_ajaxHandle) {
            getCarportContacts_ajaxHandle.abort();
        }
        var type = 0;
        var url = config.url_getCarportContacts.replace("{:carportId}", data.carportId) + type;
        getCarportContacts_ajaxHandle = Common.ajax({
            url: url,
            type: "get",
            success: function (res) {
                if (res.success) {
                    var contactsSelect = $("#contactsId");
                    var temp_contacs = template.compile($(config.tempid_contac).html());
                    contactsSelect.html(temp_contacs({list: res.details}));
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })

    }

    /**
     * [renderDictionary 填充类型字段]
     * @return {[type]} data     [description]
     */
    function renderDictionary(data) {
        // 在页面渲染后赋值变量
        var statusSelect = $("#status");
        var temp_status = template.compile($(config.tempid_select).html());
        statusSelect.html(temp_status({list: data.CarportStatus}));
    }

    function render(data) {

        // 渲染数据
        var html = temp_house(data);
        jq_houseWrap.html(html);
        var title = temp_Address(data);
        house_Title.html(title);

        houseInfo["data"] = data.details;//暴露房屋信息到Page_houseinfo["houseinfo"]外
    }

    function bindVariable() {
        // 在页面渲染后赋值变量
        jq_houseWrap = $("#infoContainer");
        temp_house = template.compile($(config.tempid).html());

        house_Title = $("#carportTitle");
        temp_Address = template.compile($(config.addressTempid).html());

        // houseStatusWrap = $("#houseStatusTemp");
        // temp_houseStatus = template.compile($(config.statusTempid).html());

        // houseBroadbandWrap = $("#houseBroadbandTemp");
        // temp_houseBroadband = template.compile($(config.houseBroadbandTempid).html());
    }

    function bindEvent() {
        // 在页面渲染后绑定事件

    }

    function active(opt) {

        // 展示页面时执行该方法
        carportId = window.carportId;

        ajaxGetDictionary({});

        //请求车位详情数据
        ajaxGet(carportId);
    }

    function init(opt) {
        // 初始化
        if (!hasInit) {
            hasInit = true;
            bindVariable();
            bindEvent();
        }
        active(opt);
    }

    return {
        init: init,
        houseInfo: houseInfo
    }
})();;//客户关系
window.carport["relation"] = (function () {
    // api/v1/house/info
    var hasInit = false,
        carportId = '',
        customerRelation_list = null,
        ownerRelation_list = null,
        temp_customerRelation = null,
        temp_ownerRelation = null,
        contactsName_list = null,
        temp_contactsName = null,
        relaObj = {};
    var config = {
        url_getRelation: servicePath.customer + '/v1/customer/house',
        url_removeRelation: servicePath.customer + '/v1/carport/removeRelation',
        url_getParkingDetail: servicePath.house + '/v1/carport/{:carportId}',
        url_getParkingCustomer: servicePath.house + '/v1/carport/{:carportId}/customer?isdeleted=',
        tempid_customerRelation: "#ownerRelationTemp",
        tempid_ownerRelation: "#ownerTemp",
        tempid_contactsName: "#contactsNameTemp",
        tempid_contacts: '#contactsTemp'
    };
    var getRelation_ajaxHandle = null;

    function getRelation(data) {
        if (getRelation_ajaxHandle) {
            getRelation_ajaxHandle.abort();
        }
        var type = 0; // 0 || 1
        var url = config.url_getParkingCustomer.replace("{:carportId}", data.carportId) + type;
        getRelation_ajaxHandle = Common.ajax({
            url: url,
            type: "get",
            success: function (res) {
                // alert(JSON.stringify(res));
                if (res.success) {
                    //alert(JSON.stringify(res));
                    render(res)
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })

    }

    function eventRemoveRelation(data, li) {
        // alert(JSON.stringify(data))
        Common.ajax({
            url: config.url_removeRelation,
            type: "post",
            data: data,
            success: function (res) {
                console.log(res);

                if (res.success) {
                    li.remove();
                }
            },
            error: function (e) {
                console.log(e);
            },
            complete: function () {

            }
        })

    }

    function viewCustomerInfo(customerId) {
        if (!customerId) {
            return;
        }
        var url = path.server + '/page/customer/' + customerId + '/details' + '?carportId=' + window.carportId ;
        window.location.href = url;

    }

    function bindEvent() {

        // ownerRelation_list.on("click", ".bi-owner-info", function () {
        //     var item = $(this),
        //         id = item.attr("data-id"),
        //         obj = relaObj[id];
        //     viewCustomerInfo(id);
        // })

        customerRelation_list.on("click", ".relation-img", function () {
            var cid = $(this).attr("data-id");
            viewCustomerInfo(cid);
        })

        customerRelation_list.on("click", ".relation-del", function () {
            var item = $(this);
            var customerId = item.attr("data-id");
            var cId = window.carportId;

            // name =obj.relation[0].name;
            if (window.confirm("解除客户车位关系?")) {
                eventRemoveRelation({
                    carportId: cId,
                    customerIds : customerId
                }, item.parent().parent());
            }
        })

        
    }

    function render(data) {

        var html = temp_customerRelation(data);
        customerRelation_list.html(html);

        var contactsSelect = $("#contactsId");
        var temp_contacts = template.compile($(config.tempid_contacts).html());
        contactsSelect.html(temp_contacts({list: data.details}));

        // var html = temp_ownerRelation(data);
        // ownerRelation_list.html(html);

    }

    function bindVariable(data) {
        customerRelation_list = $("#ownerRelation_list");
        temp_customerRelation = template.compile($(config.tempid_customerRelation).html());

        // ownerRelation_list = $("#ownerHouserRelation_list");
        // temp_ownerRelation = template.compile($(config.tempid_ownerRelation).html());

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
        carportId = window.carportId;
        getRelation({
            carportId: carportId
        });
    }

    return {
        init: init
    }
})();;//历史客户
window.carport["history"] = (function () {
    var config = {
        url_getHistory: servicePath.customer + '/v1/customer/house/history',
        url_getParkingDetail: servicePath.house + '/v1/carport/{:carportId}',
        url_getParkingCustomer: servicePath.house + '/v1/carport/{:carportId}/customer?isdeleted=',
        tempid_history: "#ownerHistoryTemp"
    };
    var ownerHistory_bar, ownerHistory_close, ownerHistory_list, carportId, hasInit = false,
        temp_history;

    var getHistory_ajaxHandle = null;

    function getHistory(data) {
        if (getHistory_ajaxHandle) {
            getHistory_ajaxHandle.abort();
        }

        var type = 1; // 0 || 1
        var url = config.url_getParkingCustomer.replace("{:carportId}", data.carportId) + type;

        getHistory_ajaxHandle = Common.ajax({
            url: url,
            type: "get",
            success: function (res) {
                if (res.success) {
                    render(res);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })

    }

    function bindEvent() {
        ownerHistory_close.on("click", function () {
            ownerHistory_bar.removeClass("active");
            return false;
        })

    }

    function render(data) {
        var html = temp_history(data);
        ownerHistory_list.html(html);
    }

    function bindVariable(data) {
        ownerHistory_bar = $("#ownerHistory_bar");
        ownerHistory_list = $("#ownerHistory_list");
        ownerHistory_close = $("#ownerHistory_close");
        temp_history = template.compile($(config.tempid_history).html());
    }

    function active(opt) {
        carportId = window.carportId;
        ownerHistory_bar.addClass("active");
    }

    function init(opt) {
        if (!hasInit) {
            bindVariable();
            bindEvent();
        }
        active(opt);
        getHistory({
            carportId: carportId
        });
    }

    return {
        init: init
    }
})();;// 物业服务
window.carport["subscribe"] = (function () {

    var PropertyServiceBox, //物业服务容器
        ParcelBox, //邮包容器
        temp_PropertyService, //物业服务渲染模板
        temp_Parcel, //邮包渲染模板
        carportId, //房屋ID
        houseCode,
        hasInit = false;

    var config = {
        url_getRelation: servicePath.task + '/v1/callcenter/task/app/list', //物业服务URL
        url_getProperty: servicePath.house + '/v1/subscription/propertyFee', //物业费URL
        url_getParcel: servicePath.house + '/v1/subscription/parcel', //邮包URL
        url_getParkingDetail: servicePath.house + '/v1/carport/{:carportId}',
        url_getParkingCustomer: servicePath.house + '/v1/carport/{:carportId}/customer?isdeleted=',
        tempid_TakeRelation: '#TakeRelation', //物业服务模板ID
        tempid_Parcel: '#Parcel' //邮包模板ID
    }

    var getPropertyServiceStatus_ajaxHandle = null, //物业服务GET
        getPropertyFeeStatus_ajaxHandle = null, //物业费GET
        getParcelStatus_ajaxHandle = null; //邮包GET

    function getPropertyServiceStatus(data) {
        if (getPropertyServiceStatus_ajaxHandle) {
            getPropertyServiceStatus_ajaxHandle.abort();
        }
        //renderRelation();
        getPropertyServiceStatus_ajaxHandle = Common.ajax({
            url: config.url_getRelation,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var Tasks = res.details.result.tasks,
                        length = Tasks.length;
                    for (var i = 0; i < length; i++) {
                        var d = Tasks[i];
                        if (d.timeline == []) {
                            d.statusTo = "进行中";
                        } else {
                            for (j in d.timeline) {
                                if (d.timeline[j].status == "1010" || d.timeline[j].status == "1009") {
                                    d.statusTo = "已完成";
                                    break;
                                } else {
                                    d.statusTo = "进行中";
                                }
                            }
                        }

                    }
                    render(res.details.result);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    } //----------------物业服务ajax

    function getParcelStatus(data) {
        if (getParcelStatus_ajaxHandle) {
            getParcelStatus_ajaxHandle.abort();
        }
        //renderRelation();
        getParcelStatus_ajaxHandle = Common.ajax({
            url: config.url_getParcel,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var Lists = res.details.data;
                    render(Lists);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    } //----------------邮包ajax

    function render(data) {
        var html = temp_PropertyService(data);

        //alert(JSON.stringify(data));
        // var html2 = temp_Parcel(data);
        // alert(html);
        PropertyServiceBox.html(html); //物业服务数据页面渲染
        // ParcelBox.html(html2);//邮包数据页面渲染
    }

    function bindEvent(data) {

        $("#TakeRelationBox>a").click(function () {
            var i = $(this).attr("order");
            var BarID = $(".dtn-tabbar").eq(i).attr("id");
            $("#TakeRelationBox").find(".active").removeClass("active");
            $(this).addClass("active");
            $("#dtn-TakeRelationBar").find(".active").removeClass("active");
            $(".dtn-tabbar").eq(i).addClass("active");
            if (BarID == "dtn-PropertyService") {
                getPropertyServiceStatus({}); //物业服务
            } else if (BarID == "dtn-Parcel") {
                getParcelStatus({
                    carportId: carportId,
                    pageSize: 10,
                    pageNo: 1
                });

            }
        }); //订阅关系选项点击事件

    }

    function bindVariable(data) {
        PropertyServiceBox = $("#dtn-PropertyService"); //物业服务barID
        ParcelBox = $("#dtn-Parcel"); //邮包barID
        //alert(JSON.stringify(data));
        temp_PropertyService = template.compile($(config.tempid_TakeRelation).html()); //物业服务数据模板
        temp_Parcel = template.compile($(config.tempid_Parcel).html()); //邮包数据模板
        //alert(temp_PropertyService);
    }

    function active(opt) {
        // 展示页面时执行该方法
        carportId = window.carportId;
        //houseCode = window.houseCode;
    }

    function init(opt) {
        // 初始化
        // active(opt);
        // if (!hasInit) {
        //     hasInit = true;
        //     bindVariable();
        //     bindEvent();
        // }
        // getPropertyServiceStatus({
        // });
        // 
        PropertyServiceBox = $("#dtn-PropertyServiceBox");
        temp_PropertyService = template.compile($(config.tempid_TakeRelation).html());
        render({});
    }


    return {
        init: init
    }
})();;//车位状态
window.carport["status"] = (function () {
    var carportStatus,
        carportId = '',
        hasInit = false,
        jq_dialog = null,
        jq_dialog_ok = null,
        jq_dialog_cancel = null;

    var config = {
        url_getRelation: servicePath.customer + '/v1/customer/carportCheckin',
        url_updateCarportStatus: servicePath.house + '/v1/carport/' + window.carportId,
        url_dictionary: servicePath.customer + '/v1/batch/dict/ParkingType,EquityType,CarportStatus/items',
        url_getCarportContacts: servicePath.house + '/v1/carport/{:carportId}/customer?isdeleted=',
        tempid_relation: '#transferCarportTemp',
        tempid_subCarport: '#subCarportTemp',
    };

    var updateCarportStatus_ajaxHandle = null,
        ajaxGetDictionary_ajaxHandle = null;

    function updateCarportStatus(data) {
        if (updateCarportStatus_ajaxHandle) {
            updateCarportStatus_ajaxHandle.abort();
        }
        data["carportId"] = window.carportId;
        updateCarportStatus_ajaxHandle = Common.ajax({
            url: config.url_updateCarportStatus,
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("操作成功.");
                    jq_dialog.modal("hide");
                    window.location.reload();
                } else {
                    alert("操作失败.");
                }
            },
            error: function () {
                alert("操作失败.");
            }
        })
    }

    /**
     * 获取字典数据
     * @return {[type]} [description]
     */
    function ajaxGetDictionary(data) {
        if (ajaxGetDictionary_ajaxHandle) {
            ajaxGetDictionary_ajaxHandle.abort();
        }
        ajaxGetDictionary_ajaxHandle = Common.ajax({
            url: config.url_dictionary,
            type: "get",
            success: function (res) {
                if (res.success) {
                    renderDictionary(res.details);
                }
            },
            error: function (error) {

            },
            complete: function () {
            }
        })
    }


    /**
     * [renderDictionary 填充类型字段]
     * @param  {[type]} res  [description]
     * @param  {[type]} code [字段]
     * @return {[type]} data     [description]
     */
    function renderDictionary(data) {
        // 在页面渲染后赋值变量
        var statusSelect = $("#status");
        var temp_status = template.compile($(config.tempid_select).html());
        statusSelect.html(temp_status({list: data.CarportStatus}));

    }

    function bindEvent() {
        jq_dialog_ok.on("click", function () {
            var obj = Common.getFormData($("#modal_carportStatus_form").get(0));
            updateCarportStatus(obj);
        });
        jq_dialog_cancel.on("click", function () {
            jq_dialog.modal("hide");
            window.location.reload();
        });
    }

    function bindVariable() {
        jq_dialog = $("#modal_carportStatus");

        jq_dialog_ok = $("#carportStatus_ok");
        jq_dialog_cancel = $("#carportStatus_cancel");

    }

    function active(opt) {
        carportId = window.carportId;

        Common.setFormData($("#modal_carportStatus_form").get(0), opt.data.data);

        jq_dialog.modal("show");
    }

    function init(opt) {
        if (!hasInit) {
            hasInit = true;
            bindVariable();
            bindEvent();
        }
        active(opt);
    }

    return {
        init: init
    }
})();;(function() {

    //停车位初始化
    window.carport["info"].init(window.carportId);
    //停车位车主
    window.carport["relation"].init(window.carportId);
    //物业服务
    window.carport["subscribe"].init(window.carportId);
    //历史客户
    var ownerHistory_showbtn = $("#ownerHistory_showbtn");
    var ownerHistory_bar = $("#ownerHistory_bar");
    var carportStatus = $("#btn_carportStatus");

    ownerHistory_showbtn.on("click", function() {
        if (ownerHistory_bar.hasClass("active")) {
            ownerHistory_bar.removeClass("active");
        } else {
            window.carport["history"].init(window.carportId);

        }
        return false;
    });

    carportStatus.bind("click", function () {
        //车位状态
        window.carport["status"].init({
            data: carport["info"]["houseInfo"]
        });
    });

})();