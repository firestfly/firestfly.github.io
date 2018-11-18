window.Page_userinfo = {};
// 用户详情
window.Page_userinfo["customerRelation"] = (function () {
    var hasInit = false,
        customerId = '',
        customerRelation_list = null,
        temp_customerRelation = null;
    var config = {
        url_getRelation: servicePath.customer + '/v1/customer/relation',
        tempid_customerRelation: "#customerRelationTemp"
    };
    var getRelation_ajaxHandle = null;

    function getRelation(data) {
        if (getRelation_ajaxHandle) {
            getRelation_ajaxHandle.abort();
        }
        getRelation_ajaxHandle = Common.ajax({
            url: config.url_getRelation,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    render(res)
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })

    }

    function eventRemoveRelation(id) {

    }

    function bindEvent() {

    }

    function render(data) {
        var html = temp_customerRelation(data);
        customerRelation_list.html(html);
    }

    function bindVariable(data) {
        customerRelation_list = $("#customerRelationInfo");
        temp_customerRelation = template.compile($(config.tempid_customerRelation).html());

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
        customerId = window.customerId;
        getRelation({
            customerId: customerId
        });
    }

    return {
        init: init
    }
})();
// 基础信息
window.Page_userinfo["jiben"] = (function () {

    var jq_controller,
        jq_infoBody,
        jq_allBody,
        dom_infoForm,
        temp_func,
        temp_all,
        temp_owner,
        customerId,
        ownerinfoBody,
        info_data,
        hasInit = false;

    var config = {
        url_ajaxGet: servicePath.customer + "/v1/customer/{:id}/info",
        tempid: '#customerDetailInfoTemp',
        // all_tempid: '#customerDetailInfoTemp',
        all_tempid: "#allDetailInfoTemp",
        owner_tempid: '#ownerinfoTemp'
    }
    var ajaxGet_ajaxHandle = null;

    function ajaxGet(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }
        // console.log(config.url_ajaxGet)
        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet.replace("{:id}", data.customerId),
            type: "get",
            success: function (res) {
                if (res.success) {
                    info_data = res;
                    window["customerCode"] = res.details.basic.code;
                    window["customerName"] = res.details.basic.fullName;
                    render(res.details);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function render(data) {
        // 渲染数据
        // var html = temp_func(data);
        // jq_infoBody.html(html);
        Common.setFormData(dom_infoForm, data)

        var html2 = temp_owner(data);
        ownerinfoBody.html(html2);
        // 渲染综合页基础信息
        var html3 = temp_all(data);
        jq_allBody.html(html3)
    }

    var saveInfo_ajaxHandle = null;
    //保存信息
    function saveInfo(data) {
        if (saveInfo_ajaxHandle) {
            saveInfo_ajaxHandle.abort();
        }
        saveInfo_ajaxHandle = Common.ajax({
            url: config.url_save,
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("保存成功");
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function bindEvent() {
        // 模块内的事件
        $("#userinfoBasePanelSave").on('click', function () {
            var data = Common.getFormData(dom_infoForm);
            saveInfo(data);
        })
        $("#userinfoBasePanelReset").on("click", function () {
            Common.setFormData(dom_infoForm, null)
            Common.setFormData(dom_infoForm, info_data)
        })
    }

    function bindVariable() {
        // 模块内变量初始化
        jq_infoBody = $("#userinfoBasePanelBody");
        dom_infoForm = $("#userinfoBasePanelForm").get(0);
        jq_allBody = $("#allBaseInfoBody");
        temp_func = template.compile($(config.tempid).html());
        temp_all = template.compile($(config.all_tempid).html());
        ownerinfoBody = $("#ownerInfo");
        temp_owner = template.compile($(config.owner_tempid).html());
    }

    function active(opt) {
        // 每次执行init都会执行该方法
        customerId = opt.customerId;
        ajaxGet({
            customerId: customerId
        });
        Page_userinfo.wuye.init({
            customerId: window.customerId
        });
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
})();
// 相关物业
window.Page_userinfo["wuye"] = (function () {

    var jq_controller,
        jq_infoBody,
        temp_func,
        customerId,
        roomTemp = null,
        hasInit = false;

    var config = {
        url_ajaxGet: servicePath.customer + "/v1/customer/{:id}/estates",
        tempid: '#customerPropertyInfoTemp'
    }
    var ajaxGet_ajaxHandle = null;

    function ajaxGet(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }
        // console.log(config.url_ajaxGet)
        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet.replace("{:id}", data.customerId),
            type: "get",
            success: function (res) {
                if (res.success) {
                    $.each(res.details, function (i, d) {
                        d.statusStyle = "state0" + d.status;
                    });
                    window.ownerEstates=res.details;
                    //alert(JSON.stringify(res));
                    render(res);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function render(data) {
        // 渲染数据
        var html = temp_func(data);
        jq_infoBody.html(html);
    }

    function bindEvent() {
        // 模块内的事件
        /*
         //如
         jq_controller.on(eventName,eventTarget,eventFucntion)
         */
        jq_infoBody.on("click", ".floor-room.hasPermission", function () {
            var building = $(this),
                buildingId = building.attr("data-id"),
                buildingType = building.attr("building-type");
            viewRoomInfo(buildingId, buildingType);
        })
    }

    //点击房屋模块跳转页面
    function viewRoomInfo(buildingId, buildingType) {
        if (!buildingId) {
            return;
        }
        var url = path.server + '/page/' + buildingType.toLowerCase() + "/" + buildingId + '/details';
        window.location.href = url;
    }

    function bindVariable() {
        // 模块内变量初始化
        jq_infoBody = $("#userinfoBaseMoreBody");
        temp_func = template.compile($(config.tempid).html());
    }

    function active(opt) {
        // 每次执行init都会执行该方法
        customerId = opt.customerId;
        ajaxGet({
            customerId: customerId
        })
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
})();
// 车辆
window.Page_userinfo["cheliang"] = (function () {

    var jq_controller,
        jq_infoBody,
        jq_allBody,
        temp_all,
        temp_func,
        customerId,
        hasInit = false;

    var config = {
        url_ajaxGet: servicePath.customer + "/v1/customer/{:id}/cars",
        url_ajaxPost: servicePath.customer + "/v1/customer/car/{:id}/delete",
        tempid: '#customerCarsInfoTemp',
        all_tempid: '#allCarsInfoTemp'
    }
    var ajaxGet_ajaxHandle = null;

    function ajaxGet(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }
        // console.log(config.url_ajaxGet)
        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet.replace("{:id}", data.customerId),
            type: "get",
            success: function (res) {
                if (res.success) {
                    // 这里你按需修改
                    render(res);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    var ajaxPost_ajaxHandle = null;

    function ajaxPost(data) {
        if (ajaxPost_ajaxHandle) {
            ajaxPost_ajaxHandle.abort();
        }

        ajaxPost_ajaxHandle = Common.ajax({
            url: config.url_ajaxPost.replace("{:id}", data.carId),
            type: "post",
            success: function (res) {
                if (res.success) {
                    ajaxGet({
                        customerId: window.customerId
                    });
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function render(data) {
        // 渲染数据
        var html = temp_func(data);
        jq_infoBody.html(html);
        var html2 = temp_all(data);
        jq_allBody.html(html2);

    }

    function bindEvent() {
        jq_infoBody.on("click", "a.edit", function () {
            $("#car_update").show();
            $("#car_add").hide();
            Page_userinfo["updatecheliang"].init({
                licenseNumber: $(this).attr("data-licenseNumber"),
                buyTime: $(this).attr("data-buyTime"),
                brand: $(this).attr("data-brand"),
                color: $(this).attr("data-color"),
                customerId: $(this).attr("data-customerId"),
                status: $(this).attr("data-status"),
                id: $(this).attr("data-id")
            });
        });

        jq_infoBody.on("click", "a.delete", function () {
            var id = $(this).attr("data-id");
            ajaxPost({
                carId: id
            });
        });

        $("#btnAddCar").on("click", function () {
            $("#car_update").hide();
            $("#car_add").show();
            Page_userinfo["addcheliang"].init();
        })
    }

    function bindVariable() {
        // 模块内变量初始化
        /*jq_controller = $("#userinfoBasePanel");*/
        jq_infoBody = $("#customerCarsPanelBody");
        jq_allBody = $("#allCarsPanelBody");
        temp_func = template.compile($(config.tempid).html());
        temp_all = template.compile($(config.all_tempid).html());
    }

    function active(opt) {
        // 每次执行init都会执行该方法
        customerId = opt.customerId;
        car = {}
        car.carLicenseNumber = "";
        car.buyTimeStr = "";
        car.brand = "";
        car.color = "";
        Common.setFormData($("#addCarForm").get(0), car)
        ajaxGet({
            customerId: customerId
        });
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
})();
//更新车辆
window.Page_userinfo["updatecheliang"] = (function () {

    var jq_controller,
        jq_infoBody,
        jq_allBody,
        temp_all,
        jq_dialog,
        jq_dialog_cancel,
        jq_dialog_update,
        temp_func,
        customerId,
        car = {},
        hasInit = false;

    var config = {
        url_ajaxGet: servicePath.customer + "/v1/customer/car/{:id}/update",
        all_tempid: '#allCarsInfoTemp',
        url_dictGet: servicePath.customer + "/v1/batch/dict/{:codes}/items"
    }
    var ajaxGet_ajaxHandle = null;

    function ajaxGet(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }

        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet.replace("{:id}", data.id),
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    jq_dialog.modal("hide");
                    Page_userinfo["cheliang"].init({
                        customerId: window.customerId
                    });
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function render(data) {
        // 渲染数据
        //alert(JSON.stringify(data));
        var html = temp_func(data);
        jq_infoBody.html(html);
        var html2 = temp_all(data);
        jq_allBody.html(html2);
    }

    function bindEvent() {
        // 模块内的事件
        jq_dialog_cancel.on("click", function () {
            jq_dialog.modal("hide");
            $("#updateCarForm").find('.errortip').removeClass('on').tooltip("destroy");
            Common.setFormData(updateCarForm, null);
        })
        jq_dialog_update.on("click", function () {
            $("#updateCarForm").find('.errortip').removeClass('on').tooltip("destroy");
            var dom_form = $("#updateCarForm").get(0);
            var validateResult = validate(dom_form, {
                validateAll: true,
                onerror: function (caller, text) {
                    $(caller).closest(".controls").find(".errortip").addClass("on").tooltip({
                        title: text,
                        placement: "bottom"
                    })
                }
            })
            if (validateResult) {
                return;
            }
            var obj = Common.getFormData(dom_form);
            obj["buildingId"] = window.buildingId;
            obj["buildingType"] = window.buildingType;
            ajaxGet(obj);
        })
    }

    function bindVariable() {
        // 模块内变量初始化
        /*jq_controller = $("#userinfoBasePanel");*/
        jq_infoBody = $("#customerCarsPanelBody");
        jq_allBody = $("#allCarsPanelBody");

        temp_all = template.compile($(config.all_tempid).html());
        jq_dialog = $("#modal_updateCar");
        jq_dialog_cancel = $("#car_cancel");
        jq_dialog_update = $("#car_update");
    }

    function bindDicts(bindForm) {
        // 绑定编辑页面相关数据字典
        Common.ajax({
            url: config.url_dictGet.replace("{:codes}", "CarBrand%2CCarColor%2CCarStatus"),
            type: "get",
            success: function (res) {
                if (res.success) {
                    var bransSelector = $("#updateCarForm").find("[name='brand']");
                    bransSelector.empty();
                    bransSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.CarBrand, function (i, item) {
                        bransSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    var colorSelector = $("#updateCarForm").find("[name='color']");
                    colorSelector.empty();
                    colorSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.CarColor, function (i, item) {
                        colorSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    var statusSelector = $("#updateCarForm").find("[name='status']");
                    statusSelector.empty();
                    statusSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.CarStatus, function (i, item) {
                        statusSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    if (typeof(bindForm) == "function" && bindForm) {
                        bindForm();
                    }
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function active(opt) {
        // 绑定数据字典
        bindDicts(function () {
            // 每次执行init都会执行该方法
            car.licenseNumber = opt.licenseNumber;
            car.buyTime = opt.buyTime;
            car.brand = opt.brand;
            car.color = opt.color;
            car.customerId = opt.customerId;
            car.status = opt.status,
                car.id = opt.id;
            jq_dialog.modal();
            Common.setFormData($("#updateCarForm").get(0), car)
            //ajaxGet({customerId:customerId,pet:pet});
        });
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
})();
//添加车辆
window.Page_userinfo["addcheliang"] = (function () {

    var jq_controller,
        jq_infoBody,
        jq_allBody,
        temp_all,
        jq_dialog,
        jq_dialog_cancel,
        jq_dialog_update,
        temp_func,
        hasInit = false;

    var config = {
        url_ajaxGet: servicePath.customer + "/v1/customer/car/add",
        all_tempid: "#allCarsInfoTemp",
        url_dictGet: servicePath.customer + "/v1/batch/dict/{:codes}/items"
    }
    var ajaxGet_ajaxHandle = null;

    function ajaxAddCar(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }

        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet,
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    jq_dialog.modal("hide");
                    Page_userinfo["cheliang"].init({
                        customerId: window.customerId
                    });
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function render(data) {
        // 渲染数据
        var html = temp_func(data);
        jq_infoBody.html(html);
        var html2 = temp_all(data);
        jq_allBody.html(html2);
    }

    function bindEvent() {
        jq_dialog_cancel.on("click", function () {
            jq_dialog.modal("hide");
            $("#updateCarForm").find('.errortip').removeClass('on').tooltip("destroy");
            Common.setFormData(updateCarForm, null);
        })
        jq_dialog_update.on("click", function () {
            $("#updateCarForm").find('.errortip').removeClass('on').tooltip("destroy");
            var obj = Common.getFormData($("#updateCarForm").get(0))
            var dom_form = $("#updateCarForm").get(0);
            var validateResult = validate(dom_form, {
                validateAll: true,
                onerror: function (caller, text) {
                    $(caller).closest(".controls").find(".errortip").addClass("on").tooltip({
                        title: text,
                        placement: "bottom"
                    })
                }
            })
            if (validateResult) {
                return;
            }
            obj.customerId = window.customerId;
            // console.log(obj);
            ajaxAddCar(obj);
        })
    }

    function bindVariable() {
        // 模块内变量初始化
        /*jq_controller = $("#userinfoBasePanel");*/
        jq_infoBody = $("#customerCarsPanelBody");
        jq_allBody = $("#allCarsPanelBody");
        temp_all = template.compile($(config.all_tempid).html());

        jq_dialog = $("#modal_updateCar");
        jq_dialog_cancel = $("#car_cancel");
        jq_dialog_update = $("#car_add");

    }

    function bindDicts(bindForm) {
        // 绑定编辑页面相关数据字典
        Common.ajax({
            url: config.url_dictGet.replace("{:codes}", "CarBrand%2CCarColor%2CCarStatus"),
            type: "get",
            success: function (res) {
                if (res.success) {
                    var bransSelector = $("#updateCarForm").find("[name='brand']");
                    bransSelector.empty();
                    bransSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.CarBrand, function (i, item) {
                        bransSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    var colorSelector = $("#updateCarForm").find("[name='color']");
                    colorSelector.empty();
                    colorSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.CarColor, function (i, item) {
                        colorSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    var statusSelector = $("#updateCarForm").find("[name='status']");
                    statusSelector.empty();
                    statusSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.CarStatus, function (i, item) {
                        statusSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    if (typeof(bindForm) == "function" && bindForm) {
                        bindForm();
                    }
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function active(opt) {
        bindDicts(function () {
            car = {};
            car.licenseNumber = "";
            car.buyTime = "";
            car.brand = "";
            car.color = "";
            car.status = "";
            car.id = "";
            jq_dialog.modal();
            Common.setFormData($("#updateCarForm").get(0), car)
        });
        //ajaxAddCar(opt.obj);
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
})();
//宠物
window.Page_userinfo["chongwu"] = (function () {

    var jq_controller,
        jq_infoBody,
        temp_func,
        customerId,
        hasInit = false;

    var config = {
        url_ajaxGet: servicePath.customer + "/v1/customer/{:id}/pets",
        url_ajaxPost: servicePath.customer + "/v1/customer/pet/{:id}/delete",
        tempid: '#customerPetsInfoTemp',
        all_tempid: "#allPetsInfoTemp"
    }
    var ajaxGet_ajaxHandle = null;

    function ajaxGet(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }
        // console.log(config.url_ajaxGet)
        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet.replace("{:id}", data.customerId),
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

    var ajaxPost_ajaxHandle = null;

    function ajaxPost(data) {
        if (ajaxPost_ajaxHandle) {
            ajaxPost_ajaxHandle.abort();
        }

        ajaxPost_ajaxHandle = Common.ajax({
            url: config.url_ajaxPost.replace("{:id}", data.petId),
            type: "post",
            success: function (res) {
                if (res.success) {
                    ajaxGet({
                        customerId: window.customerId
                    });
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }


    function render(data) {
        // 渲染数据
        var html = temp_func(data);
        jq_infoBody.html(html);
        var html2 = temp_all(data);
        jq_allBody.html(html2);
    }

    function bindEvent() {
        jq_infoBody.on("click", "a.edit", function () {
            $("#pet_update").show();
            $("#pet_add").hide();
            var that = $(this);
            Page_userinfo["updatechongwu"].init({
                customerId: window.customerId,
                name: that.attr("data-name"),
                status: that.attr("data-status"),
                breed: that.attr("data-breed"),
                sex: that.attr("data-sex"),
                adoptTime: that.attr("data-adoptTime"),
                description: that.attr("data-description"),
                pid: that.attr("data-pid"),
                customerId: that.attr("data-customerId"),
                id: that.attr("data-id")
            });
        });
        jq_infoBody.on("click", "a.delete", function () {
            var id = $(this).attr("data-id");
            ajaxPost({
                petId: id
            });
        });

        $("#btnAddPet").on("click", function () {
            $("#pet_update").hide();
            $("#pet_add").show();
            Page_userinfo["addchongwu"].init();
        })
    }

    function bindVariable() {
        // 模块内变量初始化
        /*jq_controller = $("#userinfoBasePanel");*/
        jq_infoBody = $("#customerPetsPanelBody");
        jq_allBody = $("#allPetsPanelBody");
        temp_func = template.compile($(config.tempid).html());
        temp_all = template.compile($(config.all_tempid).html());
    }

    function active(opt) {
        customerId = opt.customerId;
        pet = {};
        pet.name = "";
        pet.status = "1";
        pet.breed = "";
        pet.sex = "";
        pet.adoptTime = "";
        pet.description = "";
        Common.setFormData($("#addPetForm").get(0), pet);
        ajaxGet({
            customerId: customerId
        });
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
})();
//更新宠物
window.Page_userinfo["updatechongwu"] = (function () {

    var jq_controller,
        jq_infoBody,
        jq_dialog,
        jq_dialog_cancel,
        jq_dialog_update,
        temp_func,
        customerId,
        name,
        pid,
        pet = {},
        hasInit = false;

    var config = {
        url_ajaxGet: servicePath.customer + "/v1/customer/pet/{:id}/update",
        url_dictGet: servicePath.customer + "/v1/batch/dict/{:codes}/items"
    }
    var ajaxGet_ajaxHandle = null;

    function ajaxGet(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }
        // console.log(data);

        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet.replace("{:id}", data.id),
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    jq_dialog.modal("hide");
                    Page_userinfo["chongwu"].init({
                        customerId: window.customerId
                    });
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    // function render(data) {
    //     // 渲染数据
    //     var html = temp_func(data);
    //     jq_infoBody.html(html);
    // }

    function bindEvent() {
        // 模块内的事件
        jq_dialog_cancel.on("click", function () {
            jq_dialog.modal("hide");
            $("#updatePetForm").find('.errortip').removeClass('on').tooltip("destroy");
            Common.setFormData(updatePetForm, null);
        })
        jq_dialog_update.on("click", function () {
            $("#updatePetForm").find('.errortip').removeClass('on').tooltip("destroy");
            var dom_form = $("#updatePetForm").get(0);
            var validateResult = validate(dom_form, {
                validateAll: true,
                onerror: function (caller, text) {
                    $(caller).closest(".controls").find(".errortip").addClass("on").tooltip({
                        title: text,
                        placement: "bottom"
                    })
                }
            })
            if (validateResult) {
                alert('请输入必填项！')
                return;
            }
            // console.log(obj);
            var obj = Common.getFormData($("#updatePetForm").get(0));
            obj["buildingId"] = window.buildingId;
            obj["buildingType"] = window.buildingType;
            ajaxGet(obj);
        })
    }

    function bindVariable() {
        // 模块内变量初始化
        /*jq_controller = $("#userinfoBasePanel");*/
        jq_infoBody = $("#customerPetsPanelBody");
        jq_dialog = $("#modal_updatePet");
        jq_dialog_cancel = $("#pet_cancel");
        jq_dialog_update = $("#pet_update");
    }

    function bindDicts(bindForm) {
        // 绑定编辑页面相关数据字典
        Common.ajax({
            url: config.url_dictGet.replace("{:codes}", "PetBreed%2CPetSex%2CPetStatus"),
            type: "get",
            success: function (res) {
                if (res.success) {
                    var breedSelector = $("#updatePetForm").find("select[name='breed']");
                    breedSelector.empty();
                    breedSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.PetBreed, function (i, item) {
                        breedSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    var sexSelector = $("#updatePetForm").find("select[name='sex']");
                    sexSelector.empty();
                    sexSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.PetSex, function (i, item) {
                        sexSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    var statusSelector = $("#updatePetForm").find("select[name='status']");
                    statusSelector.empty();
                    statusSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.PetStatus, function (i, item) {
                        statusSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    if (typeof(bindForm) === "function" && bindForm) {
                        bindForm();
                    }
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function active(opt) {
        bindDicts(function () {
            // 每次执行init都会执行该方法
            pet.name = opt.name;
            pet.status = opt.status;
            pet.breed = opt.breed;
            pet.sex = opt.sex;
            pet.adoptTime = opt.adoptTime;
            pet.description = opt.description;
            pet.customerId = opt.customerId;
            pet.id = opt.id;
            jq_dialog.modal();

            Common.setFormData($("#updatePetForm").get(0), pet)
            //ajaxGet({customerId:customerId,pet:pet});
        });
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
})();
//添加宠物
window.Page_userinfo["addchongwu"] = (function () {

    var jq_controller,
        jq_dialog,
        jq_dialog_cancel,
        jq_dialog_update,
    // jq_infoBody,
        temp_func,
        hasInit = false;

    var config = {
        url_ajaxGet: servicePath.customer + "/v1/customer/pet/add",
        url_dictGet: servicePath.customer + "/v1/batch/dict/{:codes}/items"
    }
    var ajaxGet_ajaxHandle = null;

    function ajaxAddPet(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }

        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet,
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    jq_dialog.modal("hide");
                    Page_userinfo["chongwu"].init({
                        customerId: window.customerId
                    });
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function render(data) {
        // 渲染数据
        var html = temp_func(data);
        jq_infoBody.html(html);
    }

    function bindEvent() {
        jq_dialog_cancel.on("click", function () {
            jq_dialog.modal("hide");
            $("#updatePetForm").find('.errortip').removeClass('on').tooltip("destroy");
            Common.setFormData(updatePetForm, null);
        })
        jq_dialog_update.on("click", function () {
            $("#updatePetForm").find('.errortip').removeClass('on').tooltip("destroy");
            var obj = Common.getFormData($("#updatePetForm").get(0))
            var dom_form = $("#updatePetForm").get(0);
            var validateResult = validate(dom_form, {
                validateAll: true,
                onerror: function (caller, text) {
                    $(caller).closest(".controls").find(".errortip").addClass("on").tooltip({
                        title: text,
                        placement: "bottom"
                    })
                }
            })
            if (validateResult) {
                return;
            }
            obj.customerId = window.customerId;
            ajaxAddPet(obj);
        })
    }

    function bindVariable() {
        // 模块内变量初始化
        /*jq_controller = $("#userinfoBasePanel");*/
        // jq_infoBody = $("#customerCarsPanelBody,#allCarsPanelBody");
        jq_dialog = $("#modal_updatePet");
        jq_dialog_cancel = $("#pet_cancel");
        jq_dialog_update = $("#pet_add");
    }

    function bindDicts(bindForm) {
        // 绑定编辑页面相关数据字典
        Common.ajax({
            url: config.url_dictGet.replace("{:codes}", "PetBreed%2CPetSex%2CPetStatus"),
            type: "get",
            success: function (res) {
                if (res.success) {
                    var breedSelector = $("#updatePetForm").find("[name='breed']");
                    breedSelector.empty();
                    breedSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.PetBreed, function (i, item) {
                        breedSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    var sexSelector = $("#updatePetForm").find("[name='sex']");
                    sexSelector.empty();
                    sexSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.PetSex, function (i, item) {
                        sexSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    var statusSelector = $("#updatePetForm").find("[name='status']");
                    statusSelector.empty();
                    statusSelector.append("<option value='0'>请选择</option>");
                    $.each(res.details.PetStatus, function (i, item) {
                        statusSelector.append("<option value='" + item.code + "'>" + item.value + "</option>");
                    });

                    if (typeof(bindForm) == "function" && bindForm) {
                        bindForm();
                    }
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function active(opt) {
        bindDicts(function () {
            pet.name = "";
            pet.status = "1";
            pet.breed = "";
            pet.sex = "";
            pet.adoptTime = "";
            pet.description = "";

            jq_dialog.modal();
            Common.setFormData($("#updatePetForm").get(0), pet)
        });
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
})();
// 个人兴趣
window.Page_userinfo["xingqu"] = (function () {

    var jq_controller,
        jq_infoBody,
        jq_checkbox,
        jq_allBody,
        temp_func,
        temp_all,
        customerId,
        interstedStr = '',
        hasInit = false;

    var config = {
        url_ajaxGet: servicePath.customer + "/v1/dict/CustomerHobbies/items",
        url_ajaxInt: servicePath.customer + "/v1/customer/{:id}/hobbies",
        url_ajaxPost: servicePath.customer + "/v1/customer/{:id}/hobbies",
        tempid: '#customerInterstedInfoTemp',
        all_tempid: "#allInterstedInfoTemp"
    }
    var ajaxGet_ajaxHandle = null;

    function ajaxGet(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }
        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet,
            type: "get",
            success: function (res) {
                if (res.success) {
                    render(res);
                    ajaxInt({
                        customerId: data.customerId
                    });
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    var ajaxInt_ajaxHandle = null;

    function ajaxInt(data) {
        //console.log(config.url_ajaxInt.replace("{:id}", data.customerId));
        if (ajaxInt_ajaxHandle) {
            ajaxInt_ajaxHandle.abort();
        }
        ajaxInt_ajaxHandle = Common.ajax({
            url: config.url_ajaxInt.replace("{:id}", data.customerId),
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    // console.log(res.details)
                    var str = [];
                    for (var i = 0; i < res.details.length; i++) {
                        var d = res.details[i];
                        str.push(d["contentId"]);
                    }

                    interstedStr = str.join(",");
                    Common.setFormData(jq_checkbox.get(0), {
                        intersted: interstedStr
                    })
                    // 综合信息展示兴趣
                    var html = temp_all(res);
                    jq_allBody.html(html);

                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    var ajaxPost_ajaxHandle = null;

    function ajaxPost(data) {
        if (ajaxPost_ajaxHandle) {
            ajaxPost_ajaxHandle.abort();
        }
        // console.log(data.content)
        ajaxPost_ajaxHandle = Common.ajax({
            url: config.url_ajaxPost.replace("{:id}", data.customerId),
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("修改成功！");
                    ajaxInt({
                        customerId: data.customerId
                    });
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function render(data) {
        // 渲染数据
        var html = temp_func(data);
        jq_infoBody.html(html);
    }

    function bindEvent() {
        // 模块内的事件
        /*
         //如
         jq_controller.on(eventName,eventTarget,eventFucntion)
         */
        $("#customerInterstedPanelSave").on("click", function () {
            var checked = jq_checkbox.find("input:checked");
            var arr = [];
            checked.each(function (i, item) {
                var checkbox = $(item),
                    content = checkbox.val();
                arr.push(content);
            })
            // console.log(arr);
            ajaxPost({
                customerId: customerId,
                contentIds: arr.join(",")
            });
        })
        $("#customerInterstedPanelReset").on("click", function () {

            Common.setFormData(jq_checkbox.get(0), null);
            Common.setFormData(jq_checkbox.get(0), {
                intersted: interstedStr
            })
        })
    }

    function bindVariable() {
        // 模块内变量初始化
        /*jq_controller = $("#userinfoBasePanel");*/
        jq_infoBody = $("#customerInterstedPanelBody");
        jq_allBody = $("#allInterestPanelBody");
        temp_func = template.compile($(config.tempid).html());
        temp_all = template.compile($(config.all_tempid).html());
        jq_checkbox = $("#userinfo_xingqu_checkbog");
    }

    function active(opt) {
        // 每次执行init都会执行该方法
        customerId = opt.customerId;
        ajaxGet({
            customerId: customerId
        });
        interstedStr = '';
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
})();
// 一卡通
window.Page_userinfo["yikatong"] = (function () {
    var hasInit = false;
    var config = {}

    function bindVariable() {
    }

    function bindEvent() {
    }

    function active() {
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
})();
//特殊身份
window.Page_userinfo["teshushenfen"] = (function () {
    var jq_controller,
        jq_infoBody,
        jq_checkbox,
        jq_allBody,
        temp_func,
        temp_all,
        customerId,
        interstedStr = '',
        hasInit = false;
    var config = {
        url_ajaxGet: servicePath.customer + "/v1/dict/CustomerIdentity/items",
        url_ajaxInt: servicePath.customer + "/v1/customer/{:id}/specialIdentities",
        url_ajaxPost: servicePath.customer + "/v1/customer/{customerId}/update/specialIdentities",
        tempid: '#customerIdentityInfoTemp',
        all_tempid: "#allIdentityInfoTemp"
    };
    var ajaxGet_ajaxHandle = null;

    function ajaxGet(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }

        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet,
            type: "get",
            success: function (res) {

                if (res.success) {
                    render(res);
                    ajaxInt({
                        customerId: data.customerId
                    });
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    var ajaxInt_ajaxHandle;

    function ajaxInt(data) {
        if (ajaxInt_ajaxHandle) {
            ajaxInt_ajaxHandle.abort();
        }
        ajaxInt_ajaxHandle = Common.ajax({
            url: config.url_ajaxInt.replace("{:id}", data.customerId),
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    //console.log(res.details)
                    var str = [];
                    for (var i = 0; i < res.details.length; i++) {
                        var d = res.details[i];
                        str.push(d["identity"]);
                        if (d.identity == 8) {
                            $("#beginDate").val(d.beginDate);
                            $("#duration").val(d.duration);
                            $(".jiufen").toggleClass("on");
                        }
                    }
                    var interstedStr = str.join(",");
                    Common.setFormData(jq_checkbox.get(0), {
                        identity: interstedStr
                    })
                    // 特殊身份展示
                    //var html = temp_all(res);
                    //jq_allBody.html(html);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }

    function render(data) {
        // 渲染数据

        var html = temp_func(data);
        jq_infoBody.html(html);
        legalDispute();

        //var html2 = temp_all(data);
        //jq_allBody.html(html2);
    }

    function bindVariable() {
        // 模块内变量初始化
        /*jq_controller = $("#userinfoBasePanel");*/
        jq_infoBody = $("#customerSpecialidentityPanelBody");
        jq_allBody = $("#allSpecialidentityPanelBody");
        temp_func = template.compile($(config.tempid).html());
        //temp_all = template.compile($(config.all_tempid).html());
        jq_checkbox = $("#userinfo_specialidentity_checkbog");
    }

    function bindEvent(opt) {
        $("#customerSpecialidentityPanelSave").bind("click", function () {
            var identities = Array.prototype.slice.call($("#customerSpecialidentityPanelBody input:checked").map(function () {
                return $(this).attr("data-id");
            }));
            var duration, beginDate;
            if ($.inArray("8", identities) != -1) {
                //如果选择了法律纠纷客户
                duration = $("#duration").val();
                beginDate = $("#beginDate").val();
            }
            var data = {
                customerId: opt.customerId,
                duration: duration,
                beginDate: beginDate,
                identities: identities.join(",")
            };
            submitSpecialidentity(data);
        });
        $("#customerSpecialidentityPanelReset").bind("click", function () {
            $(".jiufen").addClass("on");
        });
    }

    /*---------------
     ----------------
     点击法律纠纷客户开始
     ----------------
     ----------------*/
    function legalDispute() {
        var checkText = jq_infoBody.find("input");
        checkText.each(function () {
            if ($(this).val() == "8") {
                $(this).click(function () {
                    $(".jiufen").toggleClass("on");
                    $("._begintime").attr("name", "beginDate");
                    $("._staytime").attr("name", "duration");
                })
            }
        });
    }

    /*---------------
     ----------------
     点击法律纠纷客户结束
     ----------------
     ----------------*/

    function submitSpecialidentity(data) {
        ajaxInt_ajaxHandle = Common.ajax({
            url: config.url_ajaxPost.replace("{customerId}", data.customerId),
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("保存成功.")
                    //console.log(res.details)
                }
            },
            error: function () {
                alert("保存失败.")
            },
            complete: function () {

            }
        })
    }

    function active(opt) {
        ajaxGet({
            customerId: opt.customerId
        });
    }

    function init(opt) {
        if (!hasInit) {
            hasInit = true;
            bindVariable();
            bindEvent(opt);
        }
        active(opt);
    }

    return {
        init: init
    }
})();
//影像资料
window.Page_userinfo["yingxiang"] = (function () {
    var jq_infoBody,
        temp_func,
        hasInit = false;
    var config = {
        url_ajaxGet: path.server + '/page/bigeyes/queryimginfo',
        tempid: '#imginfo',
    }

    var ajaxGet_ajaxHandle = null;

    function ajaxGetImg(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }
        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_ajaxGet,
            data: data,
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

    function render(data) {
        // 渲染数据
        var html = temp_func(data);
        jq_infoBody.html(html);
        var name = $(".bi-owner-name").text();
        setTimeout(function () {
            $('#customerScanBody span[name="customerName"]').text(name)
        });
    }

    function bindVariable() {
    }

    function getFileCode(data) {
        Common.ajax({
            url: path.server + '/page/bigeyes/getfilecode',
            type: "get",
            data: data,
            cache: false,
            success: function (res) {
                if (res.success) {
                    var barCode = res.details.result
                    $("#barCode").val(barCode);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        });
    }

    function bindEvent() {
        var myDate = new Date();
        var intYears = myDate.getFullYear();
        var companyCode = $("#companyCode").val();
        var projectCode = $("#projectCode").val();
        var docType = $("#docTypeLb").val();
        jq_infoBody = $("#customerScanBody");
        temp_func = template.compile($(config.tempid).html());

        $("#btnSacn").on("click", function () {
            getFileCode({
                companyCode: companyCode,
                projectCode: projectCode,
                docType: docType,
                year: intYears
            });
            $('#scanModal').modal('show');
        });
        $("#docTypeLb").change(function () {
            var docType = $("#docTypeLb").val();
            getFileCode({
                companyCode: companyCode,
                projectCode: projectCode,
                docType: docType,
                year: intYears
            });
        });

        $("#scanModal").on("hidden", function () {
            $("#docTitle").val("");
        });
    }

    function active(opt) {
        var projectCode = $("#projectCode").val();
        var companyCode = $("#companyCode").val();
        ajaxGetImg({
            companyCode: companyCode,
            custCode: window.customerCode,
            projectCode: projectCode,
            count: 10
        });
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
})();
//订阅关系
window.Page_userinfo["dingyue"] = (function () {
    var hasInit = false;
    var config = {}

    function bindVariable() {
    }

    function bindEvent() {
    }

    function active() {
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
})();
/* main */
var customerInfoInit = (function () {
    var htmlObj = {
        "#userinfo_jiben": "jiben",
        "#userinfo_cheliang": "cheliang",
        "#userinfo_chongwu": "chongwu",
        "#userinfo_xingqu": "xingqu",
        "#userinfo_yikatong": "yikatong",
        "#userinfo_yingxiang": "yingxiang",
        "#userinfo_dingyue": "dingyue",
        "#userinfo_teshushenfen": "teshushenfen"
    }

    var allBaseInfoPanel,
        buildinginfoBaseMore,
        buildinginfoBasePanel;

    function bindEvent() {

        // 点击展示更多信息
        $("#userinfoBaseMore").on("click", function () {
            allBaseInfoPanel.toggleClass("panel-visable")
        });
        Common.navigation("#userinfo_tab", function (event, a) {
            var href = $(a).attr("href");
            // console.log(htmlObj[href])
            Page_userinfo[htmlObj[href]] && Page_userinfo[htmlObj[href]].init({
                customerId: window.customerId
            })
        });
    }

    function bindVariable() {
        allBaseInfoPanel = $("#allBaseInfoPanel")
        buildinginfoBaseMore = $("#buildinginfoBaseMore");
        buildinginfoBasePanel = $("#buildinginfoBasePanel");

    }

    function init() {
        bindVariable();
        bindEvent();
        active();
        Page_userinfo['jiben'].init({
            customerId: window.customerId
        });
        Page_userinfo["cheliang"].init({
            customerId: window.customerId
        });
        Page_userinfo["chongwu"].init({
            customerId: window.customerId
        });
        Page_userinfo["xingqu"].init({
            customerId: window.customerId
        });
        Page_userinfo["customerRelation"].init({
            customerId: window.customerId
        });
        Page_userinfo["yikatong"].init({
            customerId: window.customerId
        });
        //        Page_userinfo["yingxiang"].init({
        //            customerId: window.customerId
        //        });
        Page_userinfo["dingyue"].init({
            customerId: window.customerId
        });
        Page_userinfo["teshushenfen"].init({
            customerId: window.customerId
        });
    }

    function active() {
        customerId = window.customerId;
    }

    init();

    return init;
})();