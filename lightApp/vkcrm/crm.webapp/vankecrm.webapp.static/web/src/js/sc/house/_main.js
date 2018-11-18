window.house = {};


(function () {
    var ownerHistory_showbtn,
        btn_houseSplit,
        btn_transferHouse,
        btn_houseStatus,
        btn_houseMegerList,
        btn_mergeHouseRestore,
        lnkDetailMore,
        panelDetailMore,
        hasInit = false;
    var config = {}

    function bindVariable() {
        ownerHistory_showbtn = $("#ownerHistory_showbtn");
        //btnDetailMore = $("#btnDetailMore");
        //panelDetailMore = $("#infoContainer").find('div[data-detail]');
        btn_transferHouse = $("#btn_transferhouse");
        btn_houseStatus = $("#btn_houseStatus");
        btn_houseMegerList = $("#btn_houseMegerList");
        btn_mergeHouseRestore = $("#btn_mergeHouseRestore");
        btn_houseSplit = $("#btn_houseSplit");
    }

    function bindEvent() {
        var ownerHistory_bar = $("#ownerHistory_bar");
        ownerHistory_showbtn.on("click", function () {
            if (ownerHistory_bar.hasClass("active")) {
                ownerHistory_bar.removeClass("active");
            } else {
                window.Page_houseinfo["historyinfo"].init({
                    houseId: window.houseId
                });
            }
            return false;
        });

        //btnDetailMore.on("click", function () {
        //    panelDetailMore.toggleClass("panel-visable")
        //});

        btn_transferHouse.on("click", function () {
            Page_houseinfo["transferHouse"].init({
                houseName: window["houseName"],
                houseId: window["houseId"]
            });
        });

        btn_houseSplit.on("click", function () {
            Page_houseinfo["houseSplit"].init({
                houseId: window["houseId"]
            });
            
            // 打开窗口时清除房屋拆分输入框数据
            $("#subHouseName").val('');
            $("#subHousecheckinTime").val('');
            $("#subHouseArea").val('');
        });

        btn_houseStatus.on("click", function () {
            Page_houseinfo["houseStatus"].init({
                status: window["status"],
                houseId: window["houseId"],
                data: Page_houseinfo["info"]["houseInfo"]
            });
        });
		
        // 房屋合并历史
        btn_houseMegerList.on("click", function () {
            Page_houseinfo["houseMegerList"].init({
                houseId: window["houseId"]
            });
        });
        
        
        // 合并房屋复原
        btn_mergeHouseRestore.on("click", function () {			
		    var mergeHouseRestore_ajaxHandle = null;
		    if(confirm('确定要复原合并房屋？合并房以及合并房的子房屋将被删除！')){
		        if (mergeHouseRestore_ajaxHandle) {
		            mergeHouseRestore_ajaxHandle.abort();
		        }
		        var url = servicePath.house + '/v1/house/{:houseId}/mergeHouseRestore';
		        mergeHouseRestore_ajaxHandle = Common.ajax({
		            url: url.replace("{:houseId}",houseId),
		            type: "get",
		            data: {houseId: window["houseId"]},
		            success: function (res) {
		                if (res.success) {
		            		alert(res.details);
		                    window.location.href = window.path["server"]+'/page/houses';
		                }else{		                	
		            		alert(res.message);
		                }
		            },
		            error: function () {},
		            complete: function (){}
		        })
		    }
        });

        // 物业服务初始化

        // window.Page_houseinfo["PropertyServiceStatus"].init({
        //     PropertyServiceId: window.PropertyServiceId
        // });

    }

    function active() {
        window.Page_houseinfo["info"].init({
            houseId: window.houseId
        });
        window.Page_houseinfo["relationinfo"].init({
            houseId: window.houseId
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

    init();
})();