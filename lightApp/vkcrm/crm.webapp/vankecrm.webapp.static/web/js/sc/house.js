window.Page_houseinfo = {
    config: {
        tagObj: {
            '1': {
                color: 'tag-yellow',
                name: '拥有',
                relationType: '1'
            }, // 拥有
            '2': {
                color: 'tag-blue',
                name: '居住',
                relationType: '2'
            }, // 居住
            '4': {
                color: 'tag-cyan',
                name: '账单',
                relationType: '4'
            }, // 账单
            '5': {
                color: 'tag-green',
                name: '分润',
                relationType: '5'
            }, // 分润
            '98': {
                color: 'tag-red',
                name: '其他',
                relationType: '98'
            }, // 其他
            '3': {
                color: 'tag-orange',
                name: '租赁',
                relationType: '3'
            } // 租赁
        }
    }
};;window.Page_houseinfo["info"] = (function () {
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
})();;window.Page_houseinfo["houseSplit"] = (function () {
    var subHouse_infoBody,
        temp_subHouse,
        cs_dialog,
        jq_houseSplit_ok,
        jq_houseMeger_ok,
        houseSplit_cancel,
        houseId = '',
        hasInit = false;

    var config = {
        url_getSubHouse: servicePath.house + '/v1/house/subhouse',
        url_houseSplit: servicePath.house + '/v1/house/{:houseId}/split',
        url_houseMeger: servicePath.house + '/v1/subHouse/{:houseId}/merge',
        url_deleteSubHouse: servicePath.house + '/v1/subHouse/{:subHouseId}/del',
        url_getSubHouseInfo: servicePath.house + '/v1/house/detail',
        tempid_subHouse: '#subHouseTemp'
    }
    var getSubHouse_ajaxHandle = null;

    /**
     * 获取子房屋信息
     */
    function getSubHouse(data) {
        if (getSubHouse_ajaxHandle) {
            getSubHouse_ajaxHandle.abort();
        }
        getSubHouse_ajaxHandle = Common.ajax({
            url: config.url_getSubHouse,
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

    var houseSplit_ajaxHandle = null;

    /**
     * 拆分子房屋
     */
    function houseSplit(data) {
        if (houseSplit_ajaxHandle) {
            houseSplit_ajaxHandle.abort();
        }
        houseSplit_ajaxHandle = Common.ajax({
            url: config.url_houseSplit.replace("{:houseId}", data["houseId"]),
            type: "POST",
            data: data,
            success: function (res) {
                if (res.success) {
		            // 打开窗口时清除房屋拆分输入框数据
		            $("#subHouseName").val('');
		            $("#subHousecheckinTime").val('');
		            $("#subHouseArea").val('');
                    alert('拆分房屋成功。');
                    getSubHouse({
                        houseId: houseId
                    });
                } else {
                    alert(res.message);
                }
                jq_houseSplit_ok.show();
            }
        })
    }

    // 删除子房屋
    var deleteSubHouse_ajaxHandle = null;

    function deleteSubhouse(data) {
        if (deleteSubHouse_ajaxHandle) {
            deleteSubHouse_ajaxHandle.abort();
        }
        deleteSubHouse_ajaxHandle = Common.ajax({
            url: config.url_deleteSubHouse.replace("{:subHouseId}", data["subhouseId"]),
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("删除成功!!");
                    getSubHouse({
                        houseId: houseId
                    });
                }
            }
        })
    }

    var querySubHouse_ajaxHandle = null;

    function querySubHouse(data) {
        if (querySubHouse_ajaxHandle) {
            querySubHouse_ajaxHandle.abort();
        }
        querySubHouse_ajaxHandle = Common.ajax({
            url: config.url_getSubHouseInfo,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {

                }
            }
        })
    }


    function render(data) {
        // 渲染数据
        var html = temp_subHouse(data);
        subHouse_infoBody.html(html);
    }

    function bindVariable() {

        cs_dialog = $("#modal_houseSplit");
        jq_houseSplit_ok = $("#houseSplit_ok");
        jq_houseMeger_ok = $("#houseMeger_ok");
        houseSplit_cancel = $("#houseSplit_cancel");
        // 在页面渲染后赋值变量
        subHouse_infoBody = $("#subHouseTable");
        temp_subHouse = template.compile($(config.tempid_subHouse).html());
    }

    function bindEvent() {

        jq_houseSplit_ok.on("click", function () {
            jq_houseSplit_ok.hide();
            var subHouseName = $("#subHouseName").val();
            var subHousecheckinTime = $("#subHousecheckinTime").val();
            var subHouseArea = $("#subHouseArea").val();

            if (subHouseArea == '' || subHouseArea.match(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[0-9][0-9]*))$/) == null) {
                alert("房屋面积必须填写，且必须为数字。");
                jq_houseSplit_ok.show();
                return;
            }
            subHouseName = subHouseName.replace(/^\s+|\s+$/g, "");
            if (subHouseName == "") {
                alert("房屋名称不能为空!");
                jq_houseSplit_ok.show();
            } else if (subHousecheckinTime == "") {
                alert("入住日期不能为空!");
                jq_houseSplit_ok.show();
            } else {
                houseSplit({
                    houseId: houseId,
                    houseName: subHouseName,
                    checkInTime: subHousecheckinTime,
                    area: subHouseArea
                });
            }
        });

        jq_houseMeger_ok.on("click", function () {
            jq_houseMeger_ok.hide();
            if ($('input[name="zfxk"]:checked').length < 2) {
                alert("请选择要合并的房屋，房屋必须大于一个。");
                jq_houseMeger_ok.show();
                return;
            }
            var values = [];
            var i = 0;
            $('input[name="zfxk"]:checked').each(function () { // 遍历每一个名字为zfxk的复选框，其中选中的执行函数
                values[i] = $(this).val(); // 将选中的值添加到values
                i++;
            })
            var url = config.url_houseMeger.replace("{:houseId}", values + '');
            if (confirm("你确定要合并选中的房屋吗？")) {
                Common.ajax({
                    url: url,
                    type: "get",
                    data: {
                        houseIds: values
                    },
                    success: function (data) {
                        if (data.success) {
                            alert("操作成功!");
                            getSubHouse({
                                houseId: houseId
                            });
                        } else {
                            alert(data.message);
                        }
                        jq_houseMeger_ok.show();
                    }
                })
            }
        });

        subHouse_infoBody.on("click", ".j_del", function () {
            var that = $(this);
            if (window.confirm("确定删除子房屋？")) {
                deleteSubhouse({
                    subhouseId: that.attr("data-id")
                });
            }
        })

        subHouse_infoBody.on("click", ".j_edit", function () {
            var that = $(this);
            querySubHouse({
                houseId: that.attr("data-id")
            });

        })

        houseSplit_cancel.on("click", function () {
            cs_dialog.modal("hide");
        })
    }


    function active(opt) {
        cs_dialog.modal();
        houseId = opt.houseId;
        getSubHouse({
            houseId: houseId
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

    return {
        init: init
    }
})();;window.Page_houseinfo["houseStatus"] = (function () {
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
})();;window.Page_houseinfo["historyinfo"] = (function () {
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
})();;// 物业服务
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
})();;window.Page_houseinfo["transferHouse"] = (function () {
    var jq_dialog,
        jq_relationList,
        jq_address,
        jq_ownerName,
        jq_dialog_ok,
        jq_dialog_cancel,
        jq_dialog_close,
        jq_a, temp_a,
        temp_relation,
        temp_relation_new,
        houseId = '',
        hasInit = false,
        ownerIds = [],
        ownerRel = [];

    //渲染数据字典
    var d_cardType = null,
        d_temp_cardType = null,
        d_customerType = null,
        d_temp_customerType = null,
        d_affiliationType = null,
        d_temp_affiliationType = null,
        d_sex = null,
        d_temp_sex = null,
        d_job = null,
        d_temp_job = null,
        d_bloodType = null,
        d_temp_bloodType = null,
        d_hobby = null,
        d_temp_hobby = null,
        d_sp = null,
        d_temp_sp = null,
        d_houseRel = null,
        d_temp_houseRel = null;


    var curPage = 1,
        pageSize = 10;

    var getRelation_ajaxHandle = null;
    var config = {
        url_getRelation: servicePath.customer + '/v1/house/' + window.houseId + '/customers',
        url_removeRelation: servicePath.customer + '/v1/customer/houseRelation/houseTransfer',
        tempid_relation: '#transferHouseTemp',
        url_removeRelation_new: servicePath.customer + '/v1/customer/houseRelation/bind',
        url_seacth_list: servicePath.customer + "/v1/customer/queryCustomer4Search" + "/" + curPage + "/" + pageSize,
        url_addCustomer: servicePath.customer + '/v1/customer' + '?houseId=' + window.houseId,
        url_ajax_dictionary: servicePath.customer + '/v1/dict/items',
        //数据字典接口
        tempid_relation_new: '#transferHouseNewTemp',
        searchTempId: "#__view_search_list",
        //数据字典
        d_cardTypeTempId: "#__d_cardType",
        d_customerTypeTempId: "#__d_customerType",
        d_affiliationTempId: "#__d_affiliation",
        d_sexTempId: "#__d_sex",
        d_jobTempId: "#__d_job",
        d_bloodType: "#__d_bloodType",
        d_hobby: "#__d_hobby",
        d_sp: "#__d_sp",
        d_houseRelTempId: "#__d_houseRel"
    }

    /**
     * 获取字典
     * @return {[type]} [description]
     */
    function ajax_dictionary() {
        Common.ajax({
            url: config.url_ajax_dictionary,
            type: "POST",
            data: {codes: 'CustomerAffilication,CustomerCertificateType#CRMv2,CustomerSex,CustomerType,CustomerIdentity,CustomerHobbies,HouseCustomerRelationType,CustomerRelationType,CustomerOccupation,CustomerBlood'},
            success: function (res) {
                if (res.success) {
                    renderDictionary(res);
                }
            },
            error: function (error) {

            },
            complete: function () {
            }
        })
    }

    var ajaxGet_ajaxHandle = null;

    /**
     * 搜索客户
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function ajaxGet(data) {
        data.houseId = window.houseId;

        if (ajaxGet_ajaxHandle) {
            ajaxGet_ajaxHandle.abort();
        }
        ajaxGet_ajaxHandle = Common.ajax({
            url: config.url_seacth_list,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    renderSearch(res);
                }
            },
            error: function (error) {

            },
            complete: function () {
            }
        })

        Common.loading({
            text: "",
            container: "#customerTableDiv",
            handle: ajaxGet_ajaxHandle
        });
    }

    /**
     * 渲染搜索结果
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function renderSearch(data) {
        var html = temp_a(data.details.customers);
        jq_a.html(html);
        var pageInfo = data.details.customers.pagination;
        p.render({
            curpage: pageInfo.curPage,
            pagesize: pageInfo.pageSize,
            totalpage: pageInfo.totalPage,
            totalsize: pageInfo.totalSize
        })
        p.pagesize = pageInfo.pageSize;
    }

    /**
     * 渲染字典
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function renderDictionary(data) {
        var data_cardType = d_temp_cardType(data);
        var data_customerType = d_temp_customerType(data);
        var data_affiliationType = d_temp_affiliationType(data);
        var data_sex = d_temp_sex(data);
        var data_job = d_temp_job(data);
        var data_blood = d_temp_bloodType(data);

        d_cardType.html(data_cardType);
        d_customerType.html(data_customerType);
        d_affiliationType.html(data_affiliationType);
        d_sex.html(data_sex);
        d_job.html(data_job);
        d_bloodType.html(data_blood);
        legalDispute();
    }

    /**
     * 绑定字典
     * @return {[type]} [description]
     */
    function bindDictionary() {
        d_cardType = $("#_d_cardType");
        d_customerType = $("#_d_customerType");
        d_affiliationType = $("#_d_affiliation");
        d_sex = $("#_d_sex");
        d_job = $("#_d_job");
        d_bloodType = $("#_d_bloodType");
        d_hobby = $("#_d_hobby");
        d_sp = $("#_d_sp");
        d_houseRel = $("#_d_houseRel");

        d_temp_cardType = template.compile($(config.d_cardTypeTempId).html());
        d_temp_customerType = template.compile($(config.d_customerTypeTempId).html());
        d_temp_affiliationType = template.compile($(config.d_affiliationTempId).html());
        d_temp_sex = template.compile($(config.d_sexTempId).html());
        d_temp_job = template.compile($(config.d_jobTempId).html());
        d_temp_bloodType = template.compile($(config.d_bloodType).html());

        ajax_dictionary();
    }

    /**
     * 提交表单
     * @return {[type]} [description]
     */
    function submitForm() {
        $("#addc_form_btn").hide();
        var basicInfo = Common.getFormData($("#form_Customer")[0]);
        var detailInfo = Common.getFormData($("#form_CustomerDetail")[0]);
        var postData = $.extend({}, basicInfo, detailInfo);
        Common.ajax({
            url: config.url_addCustomer,
            type: "post",
            data: postData,
            success: function (res) {
                if (res.success) {
                    alert('新增客户成功.');
                    addCustomerToLeft(res.details, $("#J_form__username").val());
                    resetForm();
                } else {
                    alert(res.message);
                }
                $("#addc_form_btn").show();
            },
            error: function (error) {
                alert("保存失败：" + error.message);
                $("#addc_form_btn").show();
            },
            complete: function () {
            }
        })
    }

    /**
     * 重置表单
     * @return {[type]} [description]
     */
    function resetForm() {
        $("#form_Customer")[0].reset();
        $("#form_CustomerDetail")[0].reset();
    }

    // 将客户添加到右侧列表
    function addCustomerToLeft(customerId, customerName) {
        var customer = {
            customerId: customerId,
            customerName: customerName
        };
        if ($("#customer_ID_" + customerId).length == 0) {
            var html = temp_relation_new({
                customer: customer
            });
            jq_relationNewList.append(html);
        }
    }

    /**
     * 获取客户房屋关系
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function getRelation(data) {
        if (getRelation_ajaxHandle) {
            getRelation_ajaxHandle.abort();
        }
        renderRelation();
        getRelation_ajaxHandle = Common.ajax({
            url: config.url_getRelation,
            type: "get",
            data: data,
            success: function (res) {
                if (res.success) {
                    var ownerName = [],
                        relationList = [],
                        tag = null,
                        length = res.details.length
                    for (var i = 0; i < length; i++) {
                        var d = res.details[i];
                        if (d["relationType"] == "1") {
                            ownerName.push(d["fullName"]);
                            ownerIds.push(d["customerId"]);
                            ownerRel.push(d["relationType"]);
                        } else {
                            tag = Page_houseinfo.config.tagObj[d["relationType"]];
                            if (tag) {
                                d.color = tag.color;
                                d.spanName = tag.name;
                                relationList.push(d)
                            }
                        }
                    }
                    renderRelation(ownerName.join("，"), relationList);
                }
            },
            error: function (error) {

            },
            complete: function () {

            }
        })
    }

    /**
     * 渲染客户房屋关系
     * @param  {[type]} ownerName    [description]
     * @param  {[type]} relationList [description]
     * @return {[type]}              [description]
     */
    function renderRelation(ownerName, relationList) {
        jq_ownerName.text(ownerName || '');
        var html = relationList ? temp_relation({
            list: relationList
        }) : '';
        jq_relationList.html(html);
    }

    // 删除旧客户关系，新增新客户关系
    var removeRelation_ajaxHandle = null;

    /**
     * 移除客户房屋关系
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function removeRelation(data) {
        var transferHouseNewCustomers = $('[name=transferHouseNewCustomer]');
        var newCustomerIds = [];
        if (transferHouseNewCustomers && transferHouseNewCustomers.length > 0) {
            for (var i = 0; i < transferHouseNewCustomers.length; i++) {
                newCustomerIds[i] = transferHouseNewCustomers[i].value;
            }
        }
        data.ownerIds = newCustomerIds.join(",");

        if (removeRelation_ajaxHandle) {
            removeRelation_ajaxHandle.abort();
        }
        removeRelation_ajaxHandle = Common.ajax({
            url: config.url_removeRelation,
            type: "post",
            data: data,
            success: function (res) {
                window.location.reload();
            },
            error: function (error) {
                alert(error.message);
            },
            complete: function () {

            }
        })
    }

    var p = new Pagination({
        template: "#paginationtmpl",
        selector: "#pagination",
        onchange: function (pageInfo) {
            curPage = pageInfo.curpage;
            pageSize = pageInfo.pagesize;
            config.url_seacth_list = servicePath.customer + "/v1/customer/queryCustomer4Search" + "/" + curPage + "/" + pageSize;
            var paramData = Common.getFormData(List_searchForm);
            paramData.houseId = window.houseId;
            ajaxGet(paramData);
        }
    });

    // 绑定按钮事件
    function bindEvent() {
        jq_dialog_ok.on("click", function () {
            var checkbox = jq_relationList.find("input:checked");
            //add by liaochao 20160126 begin
            var new_owner_nodes=$("#transferRelationNewList").children();
            var new_owner_size=new_owner_nodes.length;
            if(new_owner_size<=0){
                alert("请先添加新业主,再进行过户操作.");
                return;
            }
            //add by liaochao 20160126 end
            if (window.confirm("确定将房屋过户？")) {
                var customerIds = [],
                    relationTypes = [];
                checkbox.each(function (i, item) {
                    var jq = $(item);
                    customerIds.push(jq.attr("data-id"));
                    relationTypes.push(jq.attr("data-type"));
                });
                removeRelation({
                    houseId: houseId,
                    customerIds: customerIds.concat(ownerIds).join(","),
                    relationTypes: relationTypes.concat(ownerRel).join(",")
                })
            }
        });

        jq_dialog_cancel.on("click", function () {
            jq_dialog.modal("hide");
            window.location.reload();
        });

        jq_dialog_close.on("click", function () {
            jq_dialog.modal("hide");
            window.location.reload();
        });


        $("#List_searchBtn").bind('click', function () {
            var str = "";
            $("#List_searchForm").find("input").each(function () {
                str += $(this).val();
            });
            if (str == '') {
                alert('查询内容不能为空');
            } else {
                curPage = 1;
                pageSize = 10;
                config.url_seacth_list = servicePath.customer + "/v1/customer/queryCustomer4Search" + "/" + curPage + "/" + pageSize;
                var paramData = Common.getFormData(List_searchForm);
                paramData.houseId = window.houseId;
                ajaxGet(paramData);
            }
        });

        $("#Add_userBtn").bind('click', function () {
            $("#transferHouseList").slideUp();
            $("#transferHouseForm").slideDown();
        });

        $("#transfer_back_to_list").bind('click', function () {
            $("#transferHouseList").slideDown();
            $("#transferHouseForm").slideUp();
        });

        $("#addc_form_btn").bind('click', function () {
            var validateResultBasic = validate($("#form_Customer")[0], {
                validateAll: true,
                onerror: function (caller, text) {
                    $(caller).closest("div").find(".errortip").addClass("on").tooltip({
                        title: text,
                        placement: "bottom"
                    })
                }
            });
            var validateResultDetail = validate($("#form_CustomerDetail")[0], {
                validateAll: true,
                onerror: function (caller, text) {
                    $(caller).closest("div").find(".errortip").addClass("on").tooltip({
                        title: text,
                        placement: "bottom"
                    })
                }
            });
            if (validateResultBasic || validateResultDetail) {
                return;
            }
            ;
            submitForm();
        });

        jq_a.on("click", "a", function () {
            var id = $(this).attr("data-id"),
                name = $(this).attr("data-name");
            addCustomerToLeft(id, name);
        });

        $("#transferRelationNewList").on('click', '[name=transferHouseRemoveCustomer]', function (event) {
            var itemId = $(this).attr("data-id");
            $("#" + itemId).remove();
        });
    }

    function bindVariable() {
        jq_a = $("#List_listBody");
        jq_dialog = $("#modal_transferHouse");
        jq_relationList = $("#transferRelationList");
        jq_relationNewList = $("#transferRelationNewList");

        jq_address = $("#transferAddress");
        jq_ownerName = $("#transferOwnerName");
        jq_dialog_ok = $("#transferHouse_ok");
        jq_dialog_cancel = $("#transferHouse_cancel");
        jq_dialog_close = $("#transferCloseBtn");
        jq_dialog__addCustomer = $("#transferHouse_addCustomer");
        temp_relation = template.compile($(config.tempid_relation).html());
        temp_relation_new = template.compile($(config.tempid_relation_new).html());
        temp_a = template.compile($(config.searchTempId).html());
    }

    function legalDispute() {
        var checkText = $(".addc_specialidentity").find("input");
        checkText.each(function () {
            if ($(this).val() == '8') {
                $(this).click(function () {
                    $(".jiufen").toggleClass("on");
                    $("._begintime").attr("name", "beginDate");
                    $("._staytime").attr("name", "duration");

                })
            }
        })
    }

    function active(opt) {
        ownerIds = [];
        ownerRel = [];
        jq_dialog.modal();
        jq_address.text(opt.houseName);
        houseId = window.houseId;
        getRelation({
            houseId: houseId
        });
    }

    function init(opt) {
        bindDictionary();
        bindVariable();
        bindEvent();
        active(opt);
    }

    return {
        init: init
    }
})();
function validateIdcard() {


    if ($("[name='basic.certificateType']").val() !== '1') {
        return {
            isError: false
        };
    }

    var code = $("[name='basic.certificateId']").val().toUpperCase();

    if (code == "") {
        return {
            isError: false
        };
    }

    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;

    if (!code || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    if (!pass) console.log(tip);
    return {
        isError: !pass,
        errorInfo: tip
    };
}
;window.Page_houseinfo["relationinfo"] = (function () {
    // api/v1/house/info
    var hasInit = false,
        houseId = '',
        customerRelation_list = null,
        ownerRelation_list = null,
        temp_customerRelation = null,
        temp_ownerRelation = null,
        contactsName_list = null,
        temp_contactsName = null,
        ownerList,
        relaObj = {};
    var config = {
        url_getRelation: servicePath.customer + '/v1/house/{:id}/customers',
        // url_removeRelation: servicePath.customer + '/v1/customer/houseRelation/unbind',
        //add by liaochao 20160125 begin
        url_removeRelation: servicePath.customer + '/v1/customer/houseRelation/remove',
        //add by liaochao 20160125 end
        tempid_customerRelation: "#ownerRelationTemp",
        tempid_ownerRelation: "#ownerTemp",
        tempid_contactsName: "#contactsNameTemp"
    };
    var getRelation_ajaxHandle = null;

    function getRelation(data) {
        if (getRelation_ajaxHandle) {
            getRelation_ajaxHandle.abort();
        }
        getRelation_ajaxHandle = Common.ajax({
            url: config.url_getRelation.replace("{:id}", data.houseId),
            type: "get",
            success: function (res) {
                if (res.success) {
                    //alert(JSON.stringify(res));
                    //*******add by liaochao 20160119 begin
                    //存放与该房屋有关的所有客户(非历史客户).
                    window.currentCustomersOfHouse = res.details;
                    //*******add by liaochao 20160119 end
                    render(res)
                }
            },
            error: function () {

            },
            complete: function () {

            }
        });
        Common.loading({
            text: "",
            container: ".ly-right",
            handle: getRelation_ajaxHandle
        });
    }
    
    function eventRemoveRelation(data, li) {
        Common.ajax({
            url: config.url_removeRelation,
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    li.remove();
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })

    }

    function eventHouseRelationCode() {
        Common.ajax({
            url: servicePath.customer + '/v1/batch/dict/HouseCustomerRelationType/items',
            type: "get",
            success: function (res) {
                if (res.success) {
                    if (!ownerList) {
                        return;
                    }
                    for (var i = 0; i < ownerList.length; i++) {
                        $(".owner-tagbox").eq(i).html(template("RelationBarTemp", res));
                    }
                    //循环找出tag，取消其tag-off样式。
                    for (var index = ownerList.length - 1; index >= 0; index--) {
                        var tempOwner = ownerList[index];
                        var customerId = tempOwner.customerId;
                        var elementId = 'div[data-id="' + customerId + '"] .owner-tagbox > span.tag.';
                        var relation = tempOwner.relation;
                        for (var i = 0; i < relation.length; i++) {
                            var tagElement = elementId + relation[i].color + ".tag-off";
                            $(tagElement).removeClass("tag-off");
                        }
                    }
                }
            },
            error: function () {

            },
            complete: function () {

            }
        })
    }//渲染房屋关系模板

    function eventAddHouseRelation(data, span) {
        Common.ajax({
            url: servicePath.customer + '/v1/customer/houseRelation/bind',
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("新增房屋关系成功！");
                    span.removeClass("tag-off");
                }
                else {
                    alert(res.message);
                }
            },
            error: function (error) {
                if (error.message) {
                    alert(error.message);
                } else {
                    alert("新增房屋关系失败！");
                }
            },
            complete: function () {

            }
        })
    }//---------------增加房屋关系
    function eventDeleteHouseRelation(data, span) {
        Common.ajax({
            url: servicePath.customer + '/v1/customer/houseRelation/unbindByType',
            type: "post",
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("删除房屋关系成功！");
                    span.addClass("tag-off");
                }
            },
            error: function () {
                alert("删除房屋关系失败！");

            },
            complete: function () {

            }
        })

    }//---------------删除房屋关系

    function viewCustomerInfo(customerId) {
        if (!customerId) {
            return;
        }
        var url = path.server + '/page/customer/' + customerId + '/details' + (window.houseId ? '?houseId=' + window.houseId : "");
        window.location.href = url;

    }

    function bindEvent() {
		if(hasEditRelationRole){
	        ownerRelation_list.on("click", ".tag", function () {
	            var thisOne = $(this),
	                relationType = thisOne.attr("data-code"),
	                customerId = thisOne.parent().attr("data-id");
                //add by liaochao 20160125 begin
                if(thisOne.index()==0){//如果点击的是"拥有",则不进行操作.
                    return false;
                }
                //add by liaochao 20160125 end
	            if (thisOne.hasClass("tag-off")) {
	                eventAddHouseRelation({
	                    houseId: window.houseId,
	                    customerId: customerId,
	                    relationType: relationType
	                }, thisOne)
	            }
	            else {
	                eventDeleteHouseRelation({
	                    houseId: window.houseId,
	                    customerId: customerId,
	                    relationType: relationType
	                }, thisOne)
	            }
	            return false;
	        })//--------更改客户与房屋关系
		}
        ownerRelation_list.on("click", ".bi-owner-info", function () {
            var relation = $(this),
                item = relation,
                id = item.attr("data-id"),
                obj = relaObj[id];
            viewCustomerInfo(id);
        })

        customerRelation_list.on("click", ".relation-img", function () {
            var relation = $(this),
                item = relation,
                id = item.attr("data-id"),
                obj = relaObj[id];
            viewCustomerInfo(id);
        })
        customerRelation_list.on("click", ".relation-del", function () {
            var relation = $(this),
                item = relation,
                id = item.attr("data-id"),
                obj = relaObj[id];
            var customerId = obj.customerId;
            var relations = obj.relation;

            //add by liaochao 20160125 begin
            // name =obj.relation[0].name;
            var relationTypes =[];

            for(var i=0;i<relations.length;i++){
                relationTypes.push(Number(relations[i].relationType));
            }

            var owner_style=relation.siblings('.bi-owner-tags').find('.tag-yellow').length;
            if(owner_style>0){
                return false;
            }
            //add by liaochao 20160125 end
            if (window.confirm("解除客户房屋关系?")) {
                eventRemoveRelation({
                    houseId: houseId,
                    customerId: customerId
                    //add by liaochao 20160125 begin
                    //,relationTypes: relationTypes
                    //add by liaochao 20160125 end
                }, item.parent().parent());
            }
        })
        var ownerTagbox = $("#owner-tagbox");
        ownerRelation_list.on("click", ".relation-del", function () {
            var relation = $(this),
                item = relation,
                id = item.attr("data-id"),
                obj = relaObj[id];
            var customerId = obj.customerId;
            // var relationType = obj.relation[0].relationType;
            var relationType = [];
            $(this).parent().find(".tag:not(.tag-off)").each(function(i,item){
                relationType.push($(this).attr("data-code"));
            })
            //add by liaochao 20160125 begin
            var owner_style=relation.siblings('.bi-owner-tags').find('.tag-yellow').length;
            if(owner_style>0){
                return false;
            }
            //add by liaochao 20160125 end

            // name =obj.relation[0].name;
            // if (window.confirm("解除客户房屋关系?")) {
            //     eventRemoveRelation({
            //         houseId: houseId,
            //         customerIds: customerId,
            //         relationTypes: relationType.join(",")
            //     }, item.parent());
            // }
            return false
        })
    }

    function render(data) {
        var arr = [],
            owner = [],
            rela = [];

        for (var k = 0; k < data.details.length; k++) {
            var d = data.details[k];
            var relationObj = Page_houseinfo.config.tagObj[d["relationType"]];
            if (d["relationType"] == "1") {
                owner.push(d);
                d["relation"] = [relationObj];
                relaObj[d["customerId"]] = d;
            } else {
                d["relation"] = relationObj;
                arr.push(d);
            }
        }
        ;
        for (var i = 0; i < arr.length; i++) {
            var d = arr[i],
                curObj = relaObj[d["customerId"]];
            if (curObj) {
                curObj["relation"].push(d["relation"]);
            } else {
                d["relation"] = [d["relation"]];
                relaObj[d['customerId']] = d;
                rela.push(d);
            }
        }
        ;

        var html = temp_contactsName({
            list: owner.concat(rela)
        });
        contactsName_list.html(html);

        var html = temp_customerRelation({
            list: rela
        });
        customerRelation_list.html(html);

        var html = temp_ownerRelation({
            list: owner
        });
        ownerRelation_list.html(html);
        if (owner.length > 1) {
            ownerRelation_list.addClass("bi-owner-two")
        }

        ownerList = owner;

        eventHouseRelationCode();
        //渲染房屋关系模板


        //循环找出tag，取消其tag-off样式。
        // for (var index = owner.length - 1; index >= 0; index--) {
        //     var tempOwner = owner[index];
        //     var customerId = tempOwner.customerId;
        //     var elementId = 'div[data-id="' + customerId  +'"] .bi-owner-tags .owner-tagbox > span.tag.';
        //     var relation = tempOwner.relation;
        //     for (var i = 0; i < relation.length; i++) {
        //         var tagElement = elementId + relation[i].color + ".tag-off";
        //         $(tagElement).removeClass("tag-off");
        //     };
        // };
        // $.each(function(index, owner) {
        //     var tempOwner = owner[index];
        //     var customerId = tempOwner.customerId;
        //     var elementId = 'div[data-id="' + customerId  +'"].bi-owner-tags .owner-tagbox > span .tag ';
        //     var relation = tempOwner.relation;
        //     $.each(function(index, relation) {
        //         var tagElement = elementId + relation[index].color + ".tag-off";
        //         $(tagElement).removeClass("tag-off");
        //     });
        // });
    }

    function bindVariable(data) {
        customerRelation_list = $("#ownerRelation_list");
        temp_customerRelation = template.compile($(config.tempid_customerRelation).html());

        ownerRelation_list = $("#ownerHouserRelation_list");
        temp_ownerRelation = template.compile($(config.tempid_ownerRelation).html());

        contactsName_list = $("#contactsName_list");
        temp_contactsName = template.compile($(config.tempid_contactsName).html());

    }

    function init(opt) {
        if (!hasInit) {
            hasInit = true;
            bindVariable();
            bindEvent();
        }
        active(opt);
    }

    function active(opt) {
        houseId = window.houseId
        getRelation({
            houseId: houseId
        });
    }

    return {
        init: init
    }
})();;window.house = {};


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
})();;
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