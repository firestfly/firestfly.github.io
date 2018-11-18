// 物业服务
window.house["TakeRelationStatus"] = (function () {

    var PropertyServiceBox, //物业服务容器
        ParcelBox, //邮包容器
        temp_PropertyService, //物业服务渲染模板
        temp_Parcel, //邮包渲染模板
        houseId, //房屋ID
        houseCode, //房屋code
        noDataHtml = "<div class='dtn-noHasData'>暂无数据</div>",
        curPage = 1,
        pageSize = 10,
        hasInit = false;

    var config = {
        url_getPropertyServiceStatus: servicePath.task + '/v1/callcenter/task/app/list', //物业服务URL
        url_getPropertyFee: servicePath.house + '/v1/subscription/propertyFee', //物业费URL
        url_getPropertyFeeIsPaid: servicePath.house + '/v1/subscription/propertyFee/isPaid', //物业费状态URL
        url_getParcelStatus: servicePath.house + '/v1/subscription/parcel', //邮包URL
        url_getTaskPercent: servicePath.task + '/v1/callcenter/task/getTaskPercent/{:houseCode}', //任务进度服务URL
        tempid_TakeRelation: '#PropertyServiceTemplate', //物业服务模板ID
        tempid_Parcel: '#ParcelTemplate', //邮包模板ID
        tempid_PropertyStatus: '#PropertyFeeTemplate' //物业费模板ID
    }

    var getPropertyServiceStatus_ajaxHandle = null, //物业服务GET
        getPropertyFee_ajaxHandle = null, //物业费GET
        getPropertyFeeIsPaid_ajaxHandle = null, //物业费状态GET
        getParcelStatus_ajaxHandle = null, //邮包GET
        getTaskPercent_ajaxHandle = null; //任务进度GET

    function getPropertyServiceStatus(data) {
        if (getPropertyServiceStatus_ajaxHandle) {
            getPropertyServiceStatus_ajaxHandle.abort();
        }
        getPropertyServiceStatus_ajaxHandle = Common.ajax({
            url: config.url_getPropertyServiceStatus,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var Tasks = res.details.list,
                        length = Tasks.length,
                        pageInfo = res.details.pagination,
                        html,
                        bar = $("#dtn-PropertyService");

                    if (Tasks.length != 0) {
                        for (var i = 0; i < length; i++) {
                            var d = Tasks[i];
                            if (d.timeline == "") {
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

                        html = template("PropertyServiceTemplate", res.details);
                        bar.html(html);

                        Page.render({
                            curpage: pageInfo.curPage,
                            pagesize: pageInfo.pageSize,
                            totalpage: pageInfo.totalPage,
                            totalsize: pageInfo.totalSize
                        })
                    } else {
                        bar.html(noDataHtml);
                    }
                    //p.pagesize = pageInfo.pageSize;
                }
            },
            error: function () {

            },
            complete: function () {

            }
        });
        Common.loading({
            text: "",
            container: "#dtn-TakeRelationBar",
            handle: getPropertyServiceStatus_ajaxHandle
        });
    } //----------------物业服务ajax


    function getParcelStatus(data) {
        if (getParcelStatus_ajaxHandle) {
            getParcelStatus_ajaxHandle.abort();
        }
        //renderRelation();
        getParcelStatus_ajaxHandle = Common.ajax({
            url: config.url_getParcelStatus,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var result = res.details,
                        bar = $("#dtn-Parcel"),
                        pageInfo = res.details.pagination,
                        html;
                    if (result.list != null) {
                        for (var i = 0; i < result.list.length; i++) {
                            var d = result.list[i],
                                x = result.list[i].status;
                            switch (x) {
                                case "0":
                                    d.statusTo = "代收登记";
                                    break;
                                case "1":
                                    d.statusTo = "代收确认";
                                    break;
                                case "2":
                                    d.statusTo = "业主签收";
                                    break;
                                case "3":
                                    d.statusTo = "业主拒收";
                                    break;
                                case "4":
                                    d.statusTo = "退回快递公司";
                                    break;
                                case "5":
                                    d.statusTo = "代发登记";
                                    break;
                                case "6":
                                    d.statusTo = "代发确认";
                                    break;
                                case "7":
                                    d.statusTo = "快递公司取走";
                                    break;
                                case "8":
                                    d.statusTo = "快递公司拒收";
                                    break;
                                case "9":
                                    d.statusTo = "业主取回";
                                    break;
                            }
                        }
                        html = template("ParcelTemplate", result);
                        bar.html(html);

                        Page.render({
                            curpage: pageInfo.curPage,
                            pagesize: pageInfo.pageSize,
                            totalpage: pageInfo.totalPage,
                            totalsize: pageInfo.totalSize
                        })

                    } else {
                        bar.html(noDataHtml);
                    }

                }
            },
            error: function () {

            },
            complete: function () {

            }
        });

        Common.loading({
            text: "",
            container: "#dtn-TakeRelationBar",
            handle: getParcelStatus_ajaxHandle
        });
    } //----------------邮包ajax


    function getTaskPercent(data) {
        if (getTaskPercent_ajaxHandle != null) {
            getTaskPercent_ajaxHandle.abort();
        }
        getTaskPercent_ajaxHandle = Common.ajax({
            url: config.url_getTaskPercent.replace("{:houseCode}", window.houseCode),
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var taskPercent = res.details.join(" / ");
                    $("#taskPercent").html('<span class="icf-renwu co-deepCyan"></span> 任务 ' + taskPercent);
                }
            },
            error: function (error) {
                $("#taskPercent").html('<span class="icf-renwu co-deepCyan"></span> 任务 ' + '0 / 0');
            },
            complete: function () {

            }
        });
    } //----------------任务进度ajax

    function getPropertyFee(data) {
        if (getPropertyFee_ajaxHandle != null) {
            getPropertyFee_ajaxHandle.abort();
        }
        getPropertyFee_ajaxHandle = Common.ajax({
            url: config.url_getPropertyFee,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var list = res.details;
                    var bar = $("#dtn-PropertyFee");
                    if (list && list.bis.length > 0) {
                        var html = template("PropertyFeeTemplate", list);
                        bar.html(html);
                    } else {
                        bar.html(noDataHtml);
                    }
                }
            },
            error: function (error) {
                var bar = $("dtn-PropertyFee");
                bar.html(noDataHtml);
            },
            complete: function () {

            }
        });
        Common.loading({
            text: "",
            container: "#dtn-TakeRelationBar",
            handle: getPropertyFee_ajaxHandle
        });
    } //----------------物业费ajax

    function getPropertyFeeIsPaid(data) {
        if (getPropertyFeeIsPaid_ajaxHandle != null) {
            getPropertyFeeIsPaid_ajaxHandle.abort();
        }
        getPropertyFeeIsPaid_ajaxHandle = Common.ajax({
            url: config.url_getPropertyFeeIsPaid + "?houseId=" + window.houseId,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var propertyFeeIsPaid = res.details ? "已缴" : "未缴";
                    $("#propertyFeeIsPaid").html('<span class="icf-wuyefei co-green"></span> 物业费 ' + propertyFeeIsPaid);
                }
            },
            error: function (error) {
                $("#propertyFeeIsPaid").html('<span class="icf-wuyefei co-green"></span> 物业费 ' + '未知');
            },
            complete: function () {

            }
        });
    } //----------------物业费状态ajax


    function render(data) {

    }

    var PageObj = {
        getPropertyServiceStatusPage: function (curPage, pageSize) {
            getPropertyServiceStatus({
                houseCode: houseCode,
                curPage: curPage,
                pageSize: pageSize
            });
        },
        getParcelStatusPage: function (curPage, pageSize) {
            getParcelStatus({
                houseId: houseId,
                curPage: curPage,
                pageSize: pageSize
            });
        }
    }
    var _currentType = "getPropertyServiceStatusPage";

    /**
     * 设置物业服务分页信息
     */
    var Page = new Pagination({
        template: "#paginationtmpl",
        selector: "#TakeRelationPagination",
        onchange: function (pageInfo) {
            curPage = pageInfo.curpage;
            pageSize = pageInfo.pagesize;
            PageObj[_currentType](curPage, pageSize)
        }
    });

    function bindEvent(data) {
        //点击物业费，展示物业费列表
        $("#propertyFeeIsPaid").bind('click', function () {
            $("#TakeRelationBox").find(".active").removeClass("active");
            $("#dtn-PropertyFee").addClass("active");
            $("#dtn-TakeRelationBar").find(".active").removeClass("active");
            $('#TakeRelationBox > a[order="1"]').addClass("active");
            $(".dtn-tabbar").eq(1).addClass("active");
            $("#TakeRelationPagination").html("");

            getPropertyFee({
                houseId: houseId,
                curPage: 1,
                pageSize: 10
            });
        });
        //点击任务，展示任务列表
        $("#taskPercent").bind('click', function () {
            $("#TakeRelationBox").find(".active").removeClass("active");
            $("#dtn-PropertyService").addClass("active");
            $("#dtn-TakeRelationBar").find(".active").removeClass("active");
            $('#TakeRelationBox > a[order="0"]').addClass("active");
            $(".dtn-tabbar").eq(0).addClass("active");
            $("#TakeRelationPagination").html("");

            getPropertyServiceStatus({
                houseCode: houseCode,
                curPage: 1,
                pageSize: 10
            });
        });
        $("#TakeRelationBox>a").click(function () {
            var i = $(this).attr("order");
            var BarID = $(".dtn-tabbar").eq(i).attr("id");
            $("#TakeRelationBox").find(".active").removeClass("active");
            $(this).addClass("active");
            $("#dtn-TakeRelationBar").find(".active").removeClass("active");
            $(".dtn-tabbar").eq(i).addClass("active");
            $("#TakeRelationPagination").html("");
            if (BarID == "dtn-PropertyService") {
                getPropertyServiceStatus({
                    houseCode: houseCode,
                    curPage: 1,
                    pageSize: 10
                }); //物业服务
            } else if (BarID == "dtn-Parcel") {
                getParcelStatus({
                    houseId: houseId,
                    curPage: 1,
                    pageSize: 10
                }); //邮包
            } else if (BarID == "dtn-PropertyFee") {
                getPropertyFee({
                    houseId: houseId
                });
            }
        }); //订阅关系选项点击事件
    }

    function bindVariable(data) {

    }

    function active(opt) {
        // 展示页面时执行该方法
        houseId = window.houseId;
        houseCode = window.houseCode;
    }

    function init(opt) {
        // 初始化
        if (!hasInit) {
            hasInit = true;
            bindVariable();
            bindEvent();
        }
        active(opt);
        getPropertyServiceStatus({
            houseCode: houseCode,
            curPage: curPage,
            pageSize: pageSize
        });
        //获取任务进度
        getTaskPercent({});
        //获取是否已交物业费
        getPropertyFeeIsPaid({});
    }

    init();

    return {
        init: init
    }
})();