window.Page_houseinfo["info"] = (function () {
    var houseId = '',
        hasInit = false,
        dictionaryCode = ["Broadband", "HouseStatus"],//宽带信息,房屋状态信息 从字典表取出渲染。
        info = {data: null};

    var config = {
        url: {
            getHouse: servicePath.house + "/v1/house/full",
            getHouseStatus: servicePath.customer + '/v1/dict/items',
        },
        tmpl: {
            info: {
                id: "tmplHouseInfo",
                container: $("#infoContainer")
            },
            address: {
                id: "tmplHouseTitle",
                container: $('#houseTitle')
            },
            status: {
                id: "tmplStatus",
                container: $('#houseStatusTemp')
            },
            broadband: {
                id: "tmplBoardband",
                container: $('#houseBroadbandTemp')
            }
        }
    };

    var getHouseStatus_ajaxHandle = null;

    function getHouseStatus(data) {
        if (getHouseStatus_ajaxHandle) {
            getHouseStatus_ajaxHandle.abort();
        }
        getHouseStatus_ajaxHandle = Common.ajax({
            url: config.url.getHouseStatus,
            type: "POST",
            data: data,
            success: function (res) {
                if (res.success) {
                    config.tmpl.status.container.html(template(config.tmpl.status.id, res.details));
                    config.tmpl.broadband.container.html(template(config.tmpl.broadband.id, res.details));
                }
            },
            error: function () {
            },
            complete: function () {
            }
        })
    }

    var ajaxGet_ajaxHandle = null;

    function ajaxGet(data) {
        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }
        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url.getHouse,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    render(res.details)
                }
            },
            error: function () {
            },
            complete: function () {
            }
        })
    }

    function render(data) {
        config.tmpl.info.container.html(template(config.tmpl.info.id, data));
        config.tmpl.address.container.html(template(config.tmpl.address.id, data));

        window.houseName = data.basic && data.basic.name;
        info["data"] = data;// 暴露房屋信息到Page_houseinfo["houseinfo"]外
        if(!data.basic.combine){
        	document.getElementById('btn_houseMegerList').style.display = 'none';
        	document.getElementById('btn_mergeHouseRestore').style.display = 'none';
        }
    }

    function bindVariable() {
    }

    function bindEvent() {
        // 在页面渲染后绑定事件
        $("#btnDetailMore").on("click", function () {
            $("#infoContainer").find('div[data-detail]').toggleClass("panel-hide")
            $("#infoPanel").toggleClass('panel-visable');
        });
    }

    function active(opt) {
        // 展示页面时执行该方法
        houseId = window.houseId;
        ajaxGet({
            houseId: houseId
        });
        getHouseStatus($.param({
            codes: dictionaryCode
        }, true));
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
        houseInfo: info
    }
})();