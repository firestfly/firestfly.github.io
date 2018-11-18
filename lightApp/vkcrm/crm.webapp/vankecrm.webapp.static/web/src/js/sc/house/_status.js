window.Page_houseinfo["houseStatus"] = (function () {
    var houseStatus,
        houseId = '',
        houseStatus_Body,
        temp_houseStatus,
        hasInit = false

    var config = {
        url_getRelation: servicePath.customer + '/v1/customer/houseCheckin',
        url_updateHouseStatus: servicePath.house + '/v1/house/checkinStatus',
        tempid_relation: '#transferHouseTemp',
        tempid_subHouse: '#subHouseTemp'
    }

    var updateHouseStatus_ajaxHandle = null;

    function updateHouseStatus(data) {
        if (updateHouseStatus_ajaxHandle) {
            updateHouseStatus_ajaxHandle.abort();
        }
        data["id"] = window.houseId;
        data["isSecondhand"] = data.secondhand;
        updateHouseStatus_ajaxHandle = Common.ajax({
            url: config.url_updateHouseStatus,
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

    function bindEvent() {
        jq_dialog_ok.on("click", function () {
            var obj = Common.getFormData($("#modal_houseStatus_form").get(0));
            updateHouseStatus(obj);
        })
        jq_dialog_cancel.on("click", function () {
            jq_dialog.modal("hide");
            window.location.reload();
        })
    }

    function bindVariable() {
        houseStatus = $("#houseStatueList");
        jq_dialog = $("#modal_houseStatus");

        jq_dialog_ok = $("#houseStatus_ok");
        jq_dialog_cancel = $("#houseStatus_cancel");

        dom_form = $("#modal_houseStatus_form").get(0);

        subHouse_infoBody = $("#subHouseTable");
        temp_subHouse = template.compile($(config.tempid_subHouse).html());
    }

    function active(opt) {
        //getHouseStatus();
        jq_dialog.modal()
        //根据传入的data,填充信息表数据
        var broadband = opt.data["data"]["basic"]["broadband"];
        var checkin = {
            contactsId: opt.data["data"]["basic"]["contactsId"],
            secondhand: opt.data["data"]["basic"]["secondhand"],
            broadband: opt.data["data"]["basic"]["broadband"],
            status: opt.data["data"]["basic"]["status"],
            deliverTime: opt.data["data"]["basic"]["deliverTime"],
            checkInTime: opt.data["data"]["basic"]["checkInTime"]
        }
        $("#broadband" + broadband).attr("checked", true);
        Common.setFormData(dom_form, checkin)
        houseId = window.houseId;
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