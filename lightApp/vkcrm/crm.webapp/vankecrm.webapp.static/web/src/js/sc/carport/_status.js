//车位状态
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
})();