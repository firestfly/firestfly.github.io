//客户关系
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
               // console.log(res);

                if (res.success) {
                    li.remove();
                }
            },
            error: function (e) {
                //console.log(e);
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

        var contactsSelect = $("#contactsId");
        var temp_contacts = template.compile($(config.tempid_contacts).html());
        var _data_ = data.details;
        for(var i= 0; i <_data_.length; i++ ) {
            var item = _data_[i];
            item.canEdit = hasEditCarportPermission;
        }
        // _data_.push(sec_info);
      //  contactsSelect.html(temp_contacts({list: _data_}));

        var html  = template("ownerRelationTemp",{
            list:_data_
        });
        customerRelation_list.html(html);

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
})();
