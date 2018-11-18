//历史客户
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
})();