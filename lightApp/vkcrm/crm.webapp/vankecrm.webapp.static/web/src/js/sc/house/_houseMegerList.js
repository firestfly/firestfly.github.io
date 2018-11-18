
// 房屋合并历史模块
window.Page_houseinfo["houseMegerList"] = (function () {
    var houseId = '',houseMegerList_infoBody,hasInit = false;
    var config = {
        url_getHouseMegerList: servicePath.house + '/v1/house/{:houseId}/getMerger',
        tempid_houseMegerList: '#houseMegerListTemp'
    }
    
    var getHoserMegerList_ajaxHandle = null;
    /**
     * 获取源房屋
     */
    function getMeger(data) {
        if (getHoserMegerList_ajaxHandle) {
            getHoserMegerList_ajaxHandle.abort();
        }
        getHoserMegerList_ajaxHandle = Common.ajax({
            url: config.url_getHouseMegerList.replace("{:houseId}",houseId),
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
    
    
    function render(data) {
        // 渲染数据
        var html = temp_houseMegerList(data);
        houseMegerList_infoBody.html(html);
    }

    // 绑定事件
    function bindEvent() {
        jq_dialog_cancel.on("click", function () {
            jq_dialog.modal("hide");
        })
    }

    // 绑定变量
    function bindVariable() {
        jq_dialog = $("#modal_houseMegerList");
        jq_dialog_cancel = $("#houseMegerList_cancel");
        houseMegerList_infoBody = $("#houseMegerListTable");
        temp_houseMegerList = template.compile($(config.tempid_houseMegerList).html());
    }

    function active(opt) {
        jq_dialog.modal()
        houseId = window.houseId;
        getMeger({houseId: houseId});
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
})();;