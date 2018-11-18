(function() {

    var hasInit = false;
    var jq_reasonDialog = null;
    var _reasonDialog_callId = "";
    var vmtaskcall = avalon.define({
        $id: "taskcall",
        // 当前页码
        curPage: 1,
        pageSize: 10,
        form: {
            // 查询时间段
            fromTime: "",
            toTime: "",
            // 通话时长
            fromDuration: "",
            toDuration: "",
            // 通话类型
            type: "",
            // 呼出、呼入号码
            callNumber: "",
            // 受理人
            telephonist: "",
            // 流水号
            tapeCode: "",
            // 是否质检
            hasCheck: "",
            //通话原因
            callReason: ""
        },
        taskcalllist: {
            data: [],
            isLoading: true
        },
        statistic: {
            loading: false,
            beginTime: "",
            endTime: "",
            callInCount: "",
            callOutCount: "",
            callOutMissCount: "",
            checkedCount: ""
        },
        callreasons: Config.callReason.callin.concat(Config.callReason.callout),

        // 查询按钮事件
        searchclick: function(event) {
            vmtaskcall.curPage = 1;
            ajaxGetTaskcallData();
        },

        // 重置按钮事件
        resetclick: function(event) {
            resetTime();
            // vmtaskcall.form.fromTime = "";
            // vmtaskcall.form.toTime = "";
            vmtaskcall.form.fromDuration = "";
            vmtaskcall.form.toDuration = "";
            vmtaskcall.form.type = "";
            vmtaskcall.form.callNumber = "";
            vmtaskcall.form.telephonist = "";
            vmtaskcall.form.tapeCode = "";
            vmtaskcall.form.hasCheck = "";
            vmtaskcall.form.callReason = "";
            // 设置为首页
            vmtaskcall.curPage = 1;
            ajaxGetTaskcallData();
        },

        // 话务统计
        totalclick: function(e) {
            if (vmtaskcall.form.fromTime == "" || vmtaskcall.form.toTime == "") {
                alert("请先选择统计时间段范围！");
                $("#fromTime").focus();
                return;
            }
        }
        /*
         // 补录任务
         taskinput: function(e,obj) {
         var rad = $('#tbody_taskcall input[name="taskcalllist"]:checked');
         var callId = obj.attr("data-id"),
         callNumber = obj.attr("data-value");
         if (callId == undefined || callId == null) {
         alert("请先在下表中选择话务！");
         return;
         }
         input.active();
         input.draftBarList.add({
         reportUserMobile: callNumber,
         callNo: callId
         });
         },

         taskquery: function(e,obj) {
         var rad = $('#tbody_taskcall input[name="taskcalllist"]:checked');
         var callId = obj.attr("data-id"),
         type = obj.attr("data-type"),
         number = obj.attr("data-value");
         if (callId == undefined || callId == null) {
         alert("请先在下表中选择话务！");
         return;
         }
         _reasonDialog_callId = callId;
         vmreason["reasonNumber"] = callId;
         vmreason["reasonPhone"] = number;
         vmreason["reasonType"] = type == 1 ? "呼入" : "呼出";
         vmreason["reasonList"] = type == 1 ? Config.callReason.callin : Config.callReason.callout;
         vmreason["reasons"] = [];
         jq_reasonDialog.modal();
         }*/
    });

    vmtaskcall.form.$watch("type", function(newValue) {
        if (vmtaskcall.form.type == 1) {
            vmtaskcall.callreasons = Config.callReason.callin.slice();
        } else if (vmtaskcall.form.type == 2) {
            vmtaskcall.callreasons = Config.callReason.callout.slice();
        } else {
            vmtaskcall.callreasons = Config.callReason.callin.concat(Config.callReason.callout);
        }
    });

    var vmreason = avalon.define({
        $id: "taskcall_reason",
        // 补录原因
        reasonNumber: "",
        reasonPhone: "",
        reasonType: "",
        reasons: [],
        reasonList: []
    });

    /* 设置分页信息 */
    var taskcallPageInfo = null;

    function bindPageInfo() {
        taskcallPageInfo = new Pagination({
            template: "#paginationtmpl",
            selector: "#taskcall_pagination",
            onchange: function(pageInfo) {
                vmtaskcall.curPage = pageInfo.curpage;
                ajaxGetTaskcallData();
            }
        });
        resize_taskcall();
    }

    // 处理页面高度
    function resize_taskcall() {
        var page_h = $(window).height();
        var obj = $("#" + avalon.vmodels.contenttask.visibleIndex);
        if (obj.attr("class")) {
            var top_h = obj.offset().top;
            obj.height(page_h - top_h - 55); //55: 页面间距 & 分页
        }
    }

    var ajaxCallrecord_handle = null;

    function ajaxCallrecord() {
        if (ajaxCallrecord_handle) {
            ajaxCallrecord_handle.abort();
        }
        vmtaskcall.statistic.loading = true;
        ajaxCallrecord_handle = Common.ajax({
            url: '/s.tel/api/v1/telrecord/callrecord/count',
            type: "GET",
            data: {
                fromTime: vmtaskcall.form.fromTime,
                toTime: vmtaskcall.form.toTime,
                fromDuration: vmtaskcall.form.fromDuration,
                toDuration: vmtaskcall.form.toDuration,
                type: vmtaskcall.form.type,
                callNumber: vmtaskcall.form.callNumber,
                telephonist: vmtaskcall.form.telephonist,
                tapeCode: vmtaskcall.form.tapeCode,
                hasCheck: vmtaskcall.form.hasCheck,
                reasonId: vmtaskcall.form.callReason
            },
            success: function(data) {
                vmtaskcall.statistic.beginTime = data["beginTime"] || vmtaskcall.form.fromTime;
                vmtaskcall.statistic.endTime = data["endTime"] || vmtaskcall.form.toTime;
                vmtaskcall.statistic.callInCount = data["callInCount"]
                vmtaskcall.statistic.callOutCount = data["callOutCount"]
                vmtaskcall.statistic.callOutMissCount = data["callOutMissCount"]
                vmtaskcall.statistic.checkedCount = data["checkedCount"]

            },
            error: function() {},
            complete: function() {
                vmtaskcall.statistic.loading = false
            }
        });
    }

    // 补录呼叫原因
    function ajaxAddCallReason(callId, reasonIds) {
        Common.tip.add({
            text: "正在补录",
            type: "info"
        })
        Common.ajax({
            url: "/s.tel/api/v1/telrecord/callrecord/reason/add",
            type: "POST",
            data: {
                callId: callId,
                reasonIds: reasonIds
            },
            success: function(res) {
                Common.tip.add({
                    text: "补录成功",
                    type: "success"
                });
            },
            error: function() {
                Common.tip.add({
                    text: "补录失败",
                    type: "error"
                });
            },
            complete: function() {}
        })
    }

    function ajaxGetTaskcallData() {
        if (!vmtaskcall.curPage) {
            vmtaskcall.curPage = 1;
        }
        if (vmtaskcall.curPage < 1) return;

        ajaxCallrecord();

        Common.ajax({
            url: '/s.tel/api/v1/telrecord/callrecords/get',
            type: "GET",
            data: {
                fromTime: vmtaskcall.form.fromTime,
                toTime: vmtaskcall.form.toTime,
                fromDuration: vmtaskcall.form.fromDuration,
                toDuration: vmtaskcall.form.toDuration,
                type: vmtaskcall.form.type,
                callNumber: vmtaskcall.form.callNumber,
                telephonist: vmtaskcall.form.telephonist,
                tapeCode: vmtaskcall.form.tapeCode,
                hasCheck: vmtaskcall.form.hasCheck,
                reasonId: vmtaskcall.form.callReason,
                curPage: vmtaskcall.curPage,
                pageSize: vmtaskcall.pageSize
            },
            success: function(data) {
                if (data.list && data.list.length > 0) {
                    for (var i = 0; i < data.list.length; i++) {
                        var d = data.list[i];
                        d.tasks = d.tasksAll && d.tasksAll.split(";") || [];
                    };
                    html = template('taskcalllist', {
                        list: data.list
                    });
                }

                vmtaskcall.taskcalllist.data = data.list;
                vmtaskcall.taskcalllist.isLoading = false;
                /* 更新分页控件 */
                var pinfo = data.pagination;
                taskcallPageInfo.render({
                    curpage: pinfo.curPage,
                    pagesize: pinfo.pageSize,
                    totalpage: pinfo.totalPage,
                    totalsize: pinfo.totalSize
                });
                taskcallPageInfo.pagesize = pinfo.pageSize;

            },
            error: function() {},
            complete: function() {}
        });
    }

    function search(opt) {
        if (opt.callNumber) {
            vmtaskcall.form["fromTime"] = opt["fromTime"] || "";
            vmtaskcall.form["toTime"] = opt["toTime"] || "";
            vmtaskcall.form["fromDuration"] = opt["fromDuration"] || "";
            vmtaskcall.form["toDuration"] = opt["toDuration"] || "";
            vmtaskcall.form["type"] = opt["type"] || "";
            vmtaskcall.form["callNumber"] = opt["callNumber"] || "";
            vmtaskcall.form["telephonist"] = opt["telephonist"] || "";
            vmtaskcall.form["tapeCode"] = opt["tapeCode"] || "";
            vmtaskcall.form["hasCheck"] = opt["hasCheck"] || "";
            ajaxGetTaskcallData();
        }
    }

    function bindEvent() {
        $("#tbody_taskcall").on("click", "a", function() {
            var that = $(this);
            var dataType = that.attr("name");
            switch (dataType) {
                case "taskinput":
                    var callId = that.attr("data-id"),
                        callNumber = that.attr("data-value");
                    avalon.router.navigate("/contenttask/taskinput?callno=" + callId + "&callnumber=" + callNumber);
                    // input.active();
                    // input.draftBarList.add({
                    // reportUserMobile: callNumber,
                    // callNo: callId
                    // });
                    break;
                case "taskreason":
                    var callId = that.attr("data-id"),
                        type = that.attr("data-type"),
                        number = that.attr("data-value"),
                        code = that.attr("data-reasonscode") || '';
                    _reasonDialog_callId = callId;
                    vmreason["reasonNumber"] = callId;
                    vmreason["reasonPhone"] = number;
                    vmreason["reasonType"] = type == 1 ? "呼入" : "呼出";
                    vmreason["reasonList"] = type == 1 ? Config.callReason.callin : Config.callReason.callout;
                    vmreason["reasons"] = code.split(";");
                    jq_reasonDialog.modal();
                    break;
                case "taskno":
                    var id = that.attr("data-taskno");
                    avalon.router.navigate("/contenttask/taskquery?id=" + id + "&islocal=false");

                    // taskquery.active();
                    // taskquery.view({
                    //     id: id,
                    //     isLocal: false
                    // });
                    break;
            }
        });
        $("#taskcall_reasonsubmit").on("click", function() {
            if (vmreason.reasons.length) {
                jq_reasonDialog.modal("hide");
                ajaxAddCallReason(_reasonDialog_callId, vmreason.reasons.join(","))
            } else {
                Common.tip.add({
                    text: "请选择原因",
                    type: "warning"
                })
            }
        })
    }

    function resetTime() {
        var q = new Date();
        vmtaskcall.form.toTime = Common.formatDate(q, "yyyy-MM-dd HH:mm:ss");
        q.setDate(q.getDate(), q.setDate(0))
        vmtaskcall.form.fromTime = Common.formatDate(q, "yyyy-MM-dd HH:mm:ss");
    }

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        setTimeout(function() {
            bindPageInfo();
            ajaxGetTaskcallData();
            bindEvent();
            jq_reasonDialog = $("#taskcall_reasondialog");
            resetTime();
        });

        SoftPhone.addEventListener("EvtScreenPopDataArrival", function(strEvtMsg, param, eventQueue, callType) {
            vmtaskcall.form.callNumber = param["otherDN"];
            vmtaskcall.form.telephonist = Config.local.publisher;
        });

        // 窗口改变大小事件
        window.onresize = function() {
            resize_taskcall();
        };
    }

    function clearData(data) {
        var d = data || {},
            m = vmtaskcall.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmtaskcall.form[i] = d[i];
            } else {
                vmtaskcall.form[i] = null;
            }
        }
    }

    function active() {
        init();
    }

    return {
        active: active,
        search: search,
        clearData: clearData
    }

    active();
})();