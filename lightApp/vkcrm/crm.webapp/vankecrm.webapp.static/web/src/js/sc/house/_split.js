window.Page_houseinfo["houseSplit"] = (function () {
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
})();