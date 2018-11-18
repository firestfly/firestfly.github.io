define(['validate'], function(validate) {
  var global = {
    callid: '',
    recordid: ''
  };
  var modal = {
    reason: null
  };
  var hasInit = false;
  var el_formSearch = null;
  var vmtaskcall = avalon.define({
    $id: "taskcall",
    // 权限
    canPlay: window["hasCallcenterTelcallrecordDownloadSound"],
    canCollect: window["hasCallcenterTelcallrecordReasonCreate"],
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
      callReason: "",
      // add by liaochao 20160203
      taskCode: ""
    },
    taskcalllist: {
      data: [],
      isLoading: false
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
    callreasons: Config.callReason && Config.callReason.callin.concat(Config.callReason.callout),
    // 查询按钮事件
    searchclick: function(event) {
      /* 开始校验 */
      clearErrorTip();
      var validateResult = validate(el_formSearch[0], {
          validateAll: true,
          onerror: function(caller, text) {
              $(caller).closest("td").find(".errortip").addClass("on").tooltip({
                  title: text,
                  placement: "bottom"
              })
          }
      })
      if (validateResult) {
          Common.tip.add({
              text: '查询条件有误，请重新输入',
              type: "warning"
          });
          return;
      }
      vmtaskcall.curPage = 1;
      ajaxGetTaskcallData();
      ajaxCallrecord();
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
      vmtaskcall.form.taskCode = "";
      // 设置为首页
      vmtaskcall.curPage = 1;
      // ajaxGetTaskcallData();
    },
    // 话务统计
    totalclick: function(e) {
      if(vmtaskcall.form.fromTime == "" || vmtaskcall.form.toTime == "") {
        alert("请先选择统计时间段范围！");
        $("#fromTime").focus();
        return;
      }
    }
  });
  vmtaskcall.form.$watch("type", function(newValue) {
    if(vmtaskcall.form.type == 1) {
      vmtaskcall.callreasons = Config.callReason.callin.slice();
    } else if(vmtaskcall.form.type == 2) {
      vmtaskcall.callreasons = Config.callReason.callout.slice();
    } else {
      vmtaskcall.callreasons = Config.callReason.callin.concat(Config.callReason.callout);
    }
  });

  /*
   * 清除校验提示
   */
  function clearErrorTip() {
      el_formSearch.find(".errortip").removeClass("on").tooltip("destroy");
  }

  var vmreason = avalon.define({
    $id: "reasonCtrl",
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
      selector: "#taskcall_pagination",
      onchange: function(pageInfo) {
        vmtaskcall.curPage = pageInfo.curpage;
        ajaxGetTaskcallData();
        ajaxCallrecord();
      }
    });
    resize_taskcall();
  }
  // 处理页面高度
  function resize_taskcall() {
    var page_h = $(window).height();
    var obj = $("#" + avalon.vmodels.contenttask.visibleIndex);
    if(obj.attr("class")) {
      var top_h = obj.offset().top;
      obj.height(page_h - top_h - 55); //55: 页面间距 & 分页
    }
  }
  var ajaxCallrecord_handle = null;

  function ajaxCallrecord() {
    if(ajaxCallrecord_handle) {
      ajaxCallrecord_handle.abort();
    }
    vmtaskcall.statistic.loading = true;
    ajaxCallrecord_handle = Common.ajax({
      url: servicePath.tel + '/v1/telrecord/callrecord/count',
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
    /*Common.loading({
        text: "",
        container: "#taskcall",
        handle: ajaxCallrecord_handle
    });*/
  }
  // 补录呼叫原因
  function ajaxAddCallReason(recordId, reasonIds) {
    Common.tip.add({
      text: "正在补录",
      type: "info"
    })
    Common.ajax({
      url: servicePath.tel + "/v1/telrecord/reason",
      type: "POST",
      data: {
        callId: recordId,
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
  // 获取录音地址
  function ajaxGetRecordUrl(recordId) {
    Common.tip.add({
      type: "info",
      text: "正在加载录音[" + recordId + "]"
    })
    Common.ajax({
      url: servicePath.tel + "/v1/tape/" + recordId + "/listen",
      type: "GET",
      success: function(res) {
        if(res.substr(res.length-4, 4) == 'null') {
          Common.tip.add({
            type: "error",
            text: "录音[" + recordId + "]加载失败，录音文件不存在"
          })
        } else {
          window.open(res);
        }
      },
      error: function() {
        Common.tip.add({
          type: "error",
          text: "加载录音[" + recordId + "]失败"
        })
      },
      complete: function() {}
    })
  }
  var ajaxGetTaskcallData_handle = null;

  function ajaxGetTaskcallData() {
    if(!vmtaskcall.curPage) {
      vmtaskcall.curPage = 1;
    }
    if(vmtaskcall.curPage < 1) return;
    if(ajaxGetTaskcallData_handle) {
      ajaxGetTaskcallData_handle.abort();
    }
    vmtaskcall.taskcalllist.isLoading = true;
    ajaxGetTaskcallData_handle = Common.ajax({
      url: servicePath.tel + '/v1/telrecord/callrecords/get',
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
        taskCode: vmtaskcall.form.taskCode,
        curPage: vmtaskcall.curPage,
        pageSize: vmtaskcall.pageSize
      },
      success: function(data) {
        if(data.list && data.list.length > 0) {
          for(var i = 0; i < data.list.length; i++) {
            var d = data.list[i];
            d.tasks = d.tasks && d.tasks.split(";").slice(0, 5) || [];
          };
        }
        vmtaskcall.taskcalllist.data = data.list;
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
      complete: function() {
        vmtaskcall.taskcalllist.isLoading = false;
      }
    });
    /*Common.loading({
        text: "",
        container: "#taskcall",
        handle: ajaxGetTaskcallData_handle
    });*/
  }

  function search(opt) {
    if(opt && opt.callNumber) {
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
      ajaxCallrecord();
    }
  }

  function bindEvent() {
    $("#tbody_taskcall").on("click", "a", function() {
      var that = $(this);
      var dataType = that.attr("name");
      switch(dataType) {
        case "record":
          var recordId = that.attr("data-record");
          ajaxGetRecordUrl(recordId);
          break;
        case "taskinput":
          var id = that.attr("data-id"),
            callNo = that.attr("data-callno"),
            callNumber = that.attr("data-value"),
            telephonist = that.attr("data-telephonist"),
            callTime = that.attr("data-calltime");
          avalon.vmodels['taskinput'].addCall.addCallTime = callTime;
          avalon.vmodels['taskinput'].addCall.userMoblie = callNumber;
          avalon.vmodels['taskinput'].addCall.fullName = telephonist;
          avalon.router.redirect("/contenttask/taskinput?callRecordId=" + id + "&callno=" + callNo + "&callnumber=" + callNumber + "&telephonist=" + telephonist + "&calltime=" + callTime);
          break;
        case "taskreason":
          var id = that.attr("data-id"),
            type = that.attr("data-type"),
            number = that.attr("data-value"),
            code = that.attr("data-reasonscode") || '';
          global.recordid = id;
          vmreason["reasonPhone"] = number;
          vmreason["reasonType"] = type == 1 ? "呼入" : "呼出";
          vmreason["reasonList"] = [];
          vmreason["reasonList"] = type == 1 ? Config.callReason.callin.slice() : Config.callReason.callout.slice();
          vmreason["reasons"] = code == '' ? [] : code.split(";");
          modal.reason.modal();
          break;
        case "taskno":
          var id = that.attr("data-taskno");
          avalon.router.redirect("/contenttask/taskquery?id=" + id + "&islocal=false");
          break;
      }
    });
    $("#taskcall_reasonsubmit").on("click", function() {
      if(vmreason.reasons.length) {
        modal.reason.modal("hide");
        ajaxAddCallReason(global.recordid, vmreason.reasons.join(","));
        return false;
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
    vmtaskcall.form.toTime = Common.formatDate(q, "yyyy-MM-dd 23:59:59");
    q.setDate(q.getDate(), q.setDate(0))
    vmtaskcall.form.fromTime = Common.formatDate(q, "yyyy-MM-dd 00:00:00");
  }

  function init() {
    if(hasInit) {
      return;
    }
    hasInit = true;
    setTimeout(function() {
      resetTime();
      el_formSearch = $("#taskcall_form");
      bindPageInfo();
      // ajaxGetTaskcallData();
      bindEvent();
      modal.reason = $("#taskcall_reasondialog");
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
    for(var i in m) {
      if(d.hasOwnProperty(i)) {
        vmtaskcall.form[i] = d[i];
      } else {
        vmtaskcall.form[i] = null;
      }
    }
  }

  function active(param) {
    init(param);
    setTimeout(function() {
      search(param)
    })
  }
  return {
    active: active,
    search: search,
    clearData: clearData
  }
});
