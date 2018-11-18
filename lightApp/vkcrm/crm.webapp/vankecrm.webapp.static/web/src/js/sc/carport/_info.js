//车位信息
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
})();