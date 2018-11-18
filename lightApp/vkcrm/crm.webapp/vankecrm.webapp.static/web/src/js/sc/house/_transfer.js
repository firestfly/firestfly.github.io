window.Page_houseinfo["transferHouse"] = (function () {
    var jq_dialog,
        jq_relationList,
        jq_address,
        jq_ownerName,
        jq_dialog_ok,
        jq_dialog_cancel,
        jq_dialog_close,
        jq_a, temp_a,
        temp_relation,
        temp_relation_new,
        houseId = '',
        hasInit = false,
        ownerIds = [],
        ownerRel = [];

    //渲染数据字典
    var d_cardType = null,
        d_temp_cardType = null,
        d_customerType = null,
        d_temp_customerType = null,
        d_affiliationType = null,
        d_temp_affiliationType = null,
        d_sex = null,
        d_temp_sex = null,
        d_job = null,
        d_temp_job = null,
        d_bloodType = null,
        d_temp_bloodType = null,
        d_hobby = null,
        d_temp_hobby = null,
        d_sp = null,
        d_temp_sp = null,
        d_houseRel = null,
        d_temp_houseRel = null;


    var curPage = 1,
        pageSize = 10;

    var getRelation_ajaxHandle = null;
    var config = {
        url_getRelation: servicePath.customer + '/v1/house/' + window.houseId + '/customers',
        url_removeRelation: servicePath.customer + '/v1/customer/houseRelation/houseTransfer',
        tempid_relation: '#transferHouseTemp',
        url_removeRelation_new: servicePath.customer + '/v1/customer/houseRelation/bind',
        url_seacth_list: servicePath.customer + "/v1/customer/queryCustomer4Search" + "/" + curPage + "/" + pageSize,
        url_addCustomer: servicePath.customer + '/v1/customer' + '?houseId=' + window.houseId,
        url_ajax_dictionary: servicePath.customer + '/v1/dict/items',
        //数据字典接口
        tempid_relation_new: '#transferHouseNewTemp',
        searchTempId: "#__view_search_list",
        //数据字典
        d_cardTypeTempId: "#__d_cardType",
        d_customerTypeTempId: "#__d_customerType",
        d_affiliationTempId: "#__d_affiliation",
        d_sexTempId: "#__d_sex",
        d_jobTempId: "#__d_job",
        d_bloodType: "#__d_bloodType",
        d_hobby: "#__d_hobby",
        d_sp: "#__d_sp",
        d_houseRelTempId: "#__d_houseRel"
    }

    /**
     * 获取字典
     * @return {[type]} [description]
     */
    function ajax_dictionary() {
        Common.ajax({
            url: config.url_ajax_dictionary,
            type: "POST",
            data: {codes: 'CustomerAffilication,CustomerCertificateType#CRMv2,CustomerSex,CustomerType,CustomerIdentity,CustomerHobbies,HouseCustomerRelationType,CustomerRelationType,CustomerOccupation,CustomerBlood'},
            success: function (res) {
                if (res.success) {
                    renderDictionary(res);
                }
            },
            error: function (error) {

            },
            complete: function () {
            }
        })
    }

    var ajaxGet_ajaxHandle = null;

    /**
     * 搜索客户
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function ajaxGet(data) {
        data.houseId = window.houseId;

        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }
        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_seacth_list,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    renderSearch(res);
                }
            },
            error: function (error) {

            },
            complete: function () {
            }
        })

        Common.loading({
            text: "",
            container: "#customerTableDiv",
            handle: ajaxGet_ajaxHandle
        });
    }

    /**
     * 渲染搜索结果
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function renderSearch(data) {
        var html = temp_a(data.details.customers);
        jq_a.html(html);
        var pageInfo = data.details.customers.pagination;
        p.render({
            curpage: pageInfo.curPage,
            pagesize: pageInfo.pageSize,
            totalpage: pageInfo.totalPage,
            totalsize: pageInfo.totalSize
        })
        p.pagesize = pageInfo.pageSize;
    }

    /**
     * 渲染字典
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function renderDictionary(data) {
        var data_cardType = d_temp_cardType(data);
        var data_customerType = d_temp_customerType(data);
        var data_affiliationType = d_temp_affiliationType(data);
        var data_sex = d_temp_sex(data);
        var data_job = d_temp_job(data);
        var data_blood = d_temp_bloodType(data);

        d_cardType.html(data_cardType);
        d_customerType.html(data_customerType);
        d_affiliationType.html(data_affiliationType);
        d_sex.html(data_sex);
        d_job.html(data_job);
        d_bloodType.html(data_blood);
        legalDispute();
    }

    /**
     * 绑定字典
     * @return {[type]} [description]
     */
    function bindDictionary() {
        d_cardType = $("#_d_cardType");
        d_customerType = $("#_d_customerType");
        d_affiliationType = $("#_d_affiliation");
        d_sex = $("#_d_sex");
        d_job = $("#_d_job");
        d_bloodType = $("#_d_bloodType");
        d_hobby = $("#_d_hobby");
        d_sp = $("#_d_sp");
        d_houseRel = $("#_d_houseRel");

        d_temp_cardType = template.compile($(config.d_cardTypeTempId).html());
        d_temp_customerType = template.compile($(config.d_customerTypeTempId).html());
        d_temp_affiliationType = template.compile($(config.d_affiliationTempId).html());
        d_temp_sex = template.compile($(config.d_sexTempId).html());
        d_temp_job = template.compile($(config.d_jobTempId).html());
        d_temp_bloodType = template.compile($(config.d_bloodType).html());

        ajax_dictionary();
    }

    /**
     * 提交表单
     * @return {[type]} [description]
     */
    function submitForm() {
        $("#addc_form_btn").hide();
        var basicInfo = Common.getFormData($("#form_Customer")[0]);
        var detailInfo = Common.getFormData($("#form_CustomerDetail")[0]);
        var postData = $.extend({}, basicInfo, detailInfo);
        Common.ajax({
            url: config.url_addCustomer,
            type: "post",
            data: postData,
            success: function (res) {
                if (res.success) {
                    alert('新增客户成功.');
                    addCustomerToLeft(res.details, $("#J_form__username").val());
                    resetForm();
                } else {
                    alert(res.message);
                }
                $("#addc_form_btn").show();
            },
            error: function (error) {
                alert("保存失败：" + error.message);
                $("#addc_form_btn").show();
            },
            complete: function () {
            }
        })
    }

    /**
     * 重置表单
     * @return {[type]} [description]
     */
    function resetForm() {
        $("#form_Customer")[0].reset();
        $("#form_CustomerDetail")[0].reset();
    }

    // 将客户添加到右侧列表
    function addCustomerToLeft(customerId, customerName) {
        var customer = {
            customerId: customerId,
            customerName: customerName
        };
        if ($("#customer_ID_" + customerId).length == 0) {
            var html = temp_relation_new({
                customer: customer
            });
            jq_relationNewList.append(html);
        }
    }

    /**
     * 获取客户房屋关系
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function getRelation(data) {
        if (getRelation_ajaxHandle) {
            getRelation_ajaxHandle.abort();
        }
        renderRelation();
        getRelation_ajaxHandle = Common.ajax({
            url: config.url_getRelation,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var ownerName = [],
                        relationList = [],
                        tag = null,
                        length = res.details.length
                    for (var i = 0; i < length; i++) {
                        var d = res.details[i];
                        if (d["relationType"] == "1") {
                            ownerName.push(d["fullName"]);
                            ownerIds.push(d["customerId"]);
                            ownerRel.push(d["relationType"]);
                        } else {
                            tag = Page_houseinfo.config.tagObj[d["relationType"]];
                            if (tag) {
                                d.color = tag.color;
                                d.spanName = tag.name;
                                relationList.push(d)
                            }
                        }
                    }
                    renderRelation(ownerName.join("，"), relationList);
                }
            },
            error: function (error) {

            },
            complete: function () {

            }
        })
    }

    /**
     * 渲染客户房屋关系
     * @param  {[type]} ownerName    [description]
     * @param  {[type]} relationList [description]
     * @return {[type]}              [description]
     */
    function renderRelation(ownerName, relationList) {
        jq_ownerName.text(ownerName || '');
        var html = relationList ? temp_relation({
            list: relationList
        }) : '';
        jq_relationList.html(html);
    }

    // 删除旧客户关系，新增新客户关系
    var removeRelation_ajaxHandle = null;

    /**
     * 移除客户房屋关系
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function removeRelation(data) {
        var transferHouseNewCustomers = $('[name=transferHouseNewCustomer]');
        var newCustomerIds = [];
        if (transferHouseNewCustomers && transferHouseNewCustomers.length > 0) {
            for (var i = 0; i < transferHouseNewCustomers.length; i++) {
                newCustomerIds[i] = transferHouseNewCustomers[i].value;
            }
        }
        data.ownerIds = newCustomerIds.join(",");

        if (removeRelation_ajaxHandle) {
            removeRelation_ajaxHandle.abort();
        }
        removeRelation_ajaxHandle = Common.ajax({
            url: config.url_removeRelation,
            type: "post",
            data: data,
            success: function (res) {
                window.location.reload();
            },
            error: function (error) {
                alert(error.message);
            },
            complete: function () {

            }
        })
    }

    var p = new Pagination({
        template: "#paginationtmpl",
        selector: "#pagination",
        onchange: function (pageInfo) {
            curPage = pageInfo.curpage;
            pageSize = pageInfo.pagesize;
            config.url_seacth_list = servicePath.customer + "/v1/customer/queryCustomer4Search" + "/" + curPage + "/" + pageSize;
            var paramData = Common.getFormData(List_searchForm);
            paramData.houseId = window.houseId;
            ajaxGet(paramData);
        }
    });

    // 绑定按钮事件
    function bindEvent() {
        jq_dialog_ok.on("click", function () {
            var checkbox = jq_relationList.find("input:checked");
            //add by liaochao 20160126 begin
            var new_owner_nodes=$("#transferRelationNewList").children();
            var new_owner_size=new_owner_nodes.length;
            if(new_owner_size<=0){
                alert("请先添加新业主,再进行过户操作.");
                return;
            }
            //add by liaochao 20160126 end
            if (window.confirm("确定将房屋过户？")) {
                var customerIds = [],
                    relationTypes = [];
                checkbox.each(function (i, item) {
                    var jq = $(item);
                    customerIds.push(jq.attr("data-id"));
                    relationTypes.push(jq.attr("data-type"));
                });
                removeRelation({
                    houseId: houseId,
                    customerIds: customerIds.concat(ownerIds).join(","),
                    relationTypes: relationTypes.concat(ownerRel).join(",")
                })
            }
        });

        jq_dialog_cancel.on("click", function () {
            jq_dialog.modal("hide");
            window.location.reload();
        });

        jq_dialog_close.on("click", function () {
            jq_dialog.modal("hide");
            window.location.reload();
        });


        $("#List_searchBtn").bind('click', function () {
            var str = "";
            $("#List_searchForm").find("input").each(function () {
                str += $(this).val();
            });
            if (str == '') {
                alert('查询内容不能为空');
            } else {
                curPage = 1;
                pageSize = 10;
                config.url_seacth_list = servicePath.customer + "/v1/customer/queryCustomer4Search" + "/" + curPage + "/" + pageSize;
                var paramData = Common.getFormData(List_searchForm);
                paramData.houseId = window.houseId;
                ajaxGet(paramData);
            }
        });

        $("#Add_userBtn").bind('click', function () {
            $("#transferHouseList").slideUp();
            $("#transferHouseForm").slideDown();
        });

        $("#transfer_back_to_list").bind('click', function () {
            $("#transferHouseList").slideDown();
            $("#transferHouseForm").slideUp();
        });

        $("#addc_form_btn").bind('click', function () {
            var validateResultBasic = validate($("#form_Customer")[0], {
                validateAll: true,
                onerror: function (caller, text) {
                    $(caller).closest("div").find(".errortip").addClass("on").tooltip({
                        title: text,
                        placement: "bottom"
                    })
                }
            });
            var validateResultDetail = validate($("#form_CustomerDetail")[0], {
                validateAll: true,
                onerror: function (caller, text) {
                    $(caller).closest("div").find(".errortip").addClass("on").tooltip({
                        title: text,
                        placement: "bottom"
                    })
                }
            });
            if (validateResultBasic || validateResultDetail) {
                return;
            }
            ;
            submitForm();
        });

        jq_a.on("click", "a", function () {
            var id = $(this).attr("data-id"),
                name = $(this).attr("data-name");
            addCustomerToLeft(id, name);
        });

        $("#transferRelationNewList").on('click', '[name=transferHouseRemoveCustomer]', function (event) {
            var itemId = $(this).attr("data-id");
            $("#" + itemId).remove();
        });
    }

    function bindVariable() {
        jq_a = $("#List_listBody");
        jq_dialog = $("#modal_transferHouse");
        jq_relationList = $("#transferRelationList");
        jq_relationNewList = $("#transferRelationNewList");

        jq_address = $("#transferAddress");
        jq_ownerName = $("#transferOwnerName");
        jq_dialog_ok = $("#transferHouse_ok");
        jq_dialog_cancel = $("#transferHouse_cancel");
        jq_dialog_close = $("#transferCloseBtn");
        jq_dialog__addCustomer = $("#transferHouse_addCustomer");
        temp_relation = template.compile($(config.tempid_relation).html());
        temp_relation_new = template.compile($(config.tempid_relation_new).html());
        temp_a = template.compile($(config.searchTempId).html());
    }

    function legalDispute() {
        var checkText = $(".addc_specialidentity").find("input");
        checkText.each(function () {
            if ($(this).val() == '8') {
                $(this).click(function () {
                    $(".jiufen").toggleClass("on");
                    $("._begintime").attr("name", "beginDate");
                    $("._staytime").attr("name", "duration");

                })
            }
        })
    }

    function active(opt) {
        ownerIds = [];
        ownerRel = [];
        jq_dialog.modal();
        jq_address.text(opt.houseName);
        houseId = window.houseId;
        getRelation({
            houseId: houseId
        });
    }

    function init(opt) {
        bindDictionary();
        bindVariable();
        bindEvent();
        active(opt);
    }

    return {
        init: init
    }
})();
function validateIdcard() {


    if ($("[name='basic.certificateType']").val() !== '1') {
        return {
            isError: false
        };
    }

    var code = $("[name='basic.certificateId']").val().toUpperCase();

    if (code == "") {
        return {
            isError: false
        };
    }

    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;

    if(!code || !/^[1-9][0-9]{5}(1[0-9]{3}|2[0-9]{3})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    if (!pass) console.log(tip);
    return {
        isError: !pass,
        errorInfo: tip
    };
}
