// 物业服务
window.carport["subscribe"] = (function () {

    var PropertyServiceBox, //物业服务容器
        ParcelBox, //邮包容器
        temp_PropertyService, //物业服务渲染模板
        temp_Parcel, //邮包渲染模板
        carportId, //房屋ID
        houseCode,
        hasInit = false;

    var config = {
        url_getRelation: servicePath.task + '/v1/callcenter/task/app/list', //物业服务URL
        url_getProperty: servicePath.house + '/v1/subscription/propertyFee', //物业费URL
        url_getParcel: servicePath.house + '/v1/subscription/parcel', //邮包URL
        url_getParkingDetail: servicePath.house + '/v1/carport/{:carportId}',
        url_getParkingCustomer: servicePath.house + '/v1/carport/{:carportId}/customer?isdeleted=',
        tempid_TakeRelation: '#TakeRelation', //物业服务模板ID
        tempid_Parcel: '#Parcel' //邮包模板ID
    }

    var getPropertyServiceStatus_ajaxHandle = null, //物业服务GET
        getPropertyFeeStatus_ajaxHandle = null, //物业费GET
        getParcelStatus_ajaxHandle = null; //邮包GET

    function getPropertyServiceStatus(data) {
        if (getPropertyServiceStatus_ajaxHandle) {
            getPropertyServiceStatus_ajaxHandle.abort();
        }
        //renderRelation();
        getPropertyServiceStatus_ajaxHandle = Common.ajax({
            url: config.url_getRelation,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var Tasks = res.details.result.tasks,
                        length = Tasks.length;
                    for (var i = 0; i < length; i++) {
                        var d = Tasks[i];
                        if (d.timeline == []) {
                            d.statusTo = "进行中";
                        } else {
                            for (j in d.timeline) {
                                if (d.timeline[j].status == "1010" || d.timeline[j].status == "1009") {
                                    d.statusTo = "已完成";
                                    break;
                                } else {
                                    d.statusTo = "进行中";
                                }
                            }
                        }

                    }
                    render(res.details.result);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    } //----------------物业服务ajax

    function getParcelStatus(data) {
        if (getParcelStatus_ajaxHandle) {
            getParcelStatus_ajaxHandle.abort();
        }
        //renderRelation();
        getParcelStatus_ajaxHandle = Common.ajax({
            url: config.url_getParcel,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var Lists = res.details.data;
                    render(Lists);
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    } //----------------邮包ajax

    function render(data) {
        var html = temp_PropertyService(data);

        //alert(JSON.stringify(data));
        // var html2 = temp_Parcel(data);
        // alert(html);
        PropertyServiceBox.html(html); //物业服务数据页面渲染
        // ParcelBox.html(html2);//邮包数据页面渲染
    }

    function bindEvent(data) {

        $("#TakeRelationBox>a").click(function () {
            var i = $(this).attr("order");
            var BarID = $(".dtn-tabbar").eq(i).attr("id");
            $("#TakeRelationBox").find(".active").removeClass("active");
            $(this).addClass("active");
            $("#dtn-TakeRelationBar").find(".active").removeClass("active");
            $(".dtn-tabbar").eq(i).addClass("active");
            if (BarID == "dtn-PropertyService") {
                getPropertyServiceStatus({}); //物业服务
            } else if (BarID == "dtn-Parcel") {
                getParcelStatus({
                    carportId: carportId,
                    pageSize: 10,
                    pageNo: 1
                });

            }
        }); //订阅关系选项点击事件

    }

    function bindVariable(data) {
        PropertyServiceBox = $("#dtn-PropertyService"); //物业服务barID
        ParcelBox = $("#dtn-Parcel"); //邮包barID
        //alert(JSON.stringify(data));
        temp_PropertyService = template.compile($(config.tempid_TakeRelation).html()); //物业服务数据模板
        temp_Parcel = template.compile($(config.tempid_Parcel).html()); //邮包数据模板
        //alert(temp_PropertyService);
    }

    function active(opt) {
        // 展示页面时执行该方法
        carportId = window.carportId;
        //houseCode = window.houseCode;
    }

    function init(opt) {
        // 初始化
        // active(opt);
        // if (!hasInit) {
        //     hasInit = true;
        //     bindVariable();
        //     bindEvent();
        // }
        // getPropertyServiceStatus({
        // });
        // 
        PropertyServiceBox = $("#dtn-PropertyServiceBox");
        temp_PropertyService = template.compile($(config.tempid_TakeRelation).html());
        render({});
    }


    return {
        init: init
    }
})();