window.Page_houseinfo["historyinfo"] = (function () {
    var config = {
        url_getHistory: servicePath.customer + '/v1/customer/house/history',
        tempid_history: "#ownerHistoryTemp"
    };
    var ownerHistory_bar, ownerHistory_close, ownerHistory_list, houseId, hasInit = false,
        temp_history;

    var getHistory_ajaxHandle = null;

    function getHistory(data) {
        if (getHistory_ajaxHandle) {
            getHistory_ajaxHandle.abort();
        }
        getHistory_ajaxHandle = Common.ajax({
            url: config.url_getHistory,
            type: "get",
            data: data,
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
        houseId = window.houseId;
        ownerHistory_bar.addClass("active");
    }

    function init(opt) {
        if (!hasInit) {
            bindVariable();
            bindEvent();
        }
        active(opt);
        getHistory({
            houseId: houseId
        });
    }

    return {
        init: init
    }
})();