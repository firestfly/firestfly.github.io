define([], function() {
  /**
   * 公告权限
   * 公告列表.公告创建
   * var hasCallcenterNoticeListCreate = false;
   * 公告列表.公告审批
   * var hasCallcenterNoticeListApproveRole = false;
   * 公告列表.公告编辑
   * var hasCcallcenterNoticeListEditRole = false;
   * 公告列表.公告关闭
   * var hasCcallcenterNoticeListCloseRole = false;
   */
  // 计时
  var t;
  var hasInit = false;
  // 页面查询、列表展示模块
  var vmtasknotice = avalon.define({
    $id: "tasknotice",
    // 当前页码
    curPage: 1,
    pageSize: 10,
    // 是否显示公告状态查询条件
    nstauts_vis: true,
    form: {
      // 查询时间段
      start_time_notice: "",
      end_time_notice: "",
      // 发布人
      publisher: Config.local.userName,
      // 公告级别
      level: "",
      // 公告状态
      noticeStatus: "",
      // 公告内容
      content: "",
      // 审核状态
      approveStatus: "",
      // 项目编码
      projectCode: '',
      // 项目名称
      projectName: '',
      // 项目Id
      projectId: ''
    },
    // 项目名称
    project_auto: {
      list: [],
      isout: true,
      loading: false,
      visible: false
    },
    // 自动检索
    autoinput: function(target) {
      var name = Common.trim(this.value || '');
      vmtasknotice.form[target + "Name"] = name;
      vmtasknotice.form[target + "Code"] = '';
      vmtasknotice.form[target + "Id"] = '';
      if(name === '') {
        vmtasknotice[target + "_auto"].visible = false;
        vmtasknotice[target + "_auto"].loading = false;
        return;
      }
      autofunc["get" + target + "_ajax"](vmtasknotice, name);
    },
    canCreate: window["hasCallcenterNoticeListCreate"],
    canApprove: window["hasCallcenterNoticeListApproveRole"],
    canEdit: window["hasCcallcenterNoticeListEditRole"],
    canClose: window["hasCcallcenterNoticeListCloseRole"],
    noticelist: {
      isLoading: false,
      data: []
    },
    approve: {
      isLoading: true,
      data: []
    },
    notice: {
      isLoading: true,
      data: []
    },
    level: {
      isLoading: false,
      data: []
    },
    // 查询按钮事件
    searchclick: function(e) {
      vmtasknotice.curPage = 1;
      ajaxGetNoticeData();
    },
    // 重置按钮事件
    resetclick: function(e) {
      resetTime();
      // vmtasknotice.form.start_time_notice = "";
      // vmtasknotice.form.end_time_notice = "";
      vmtasknotice.form.publisher = "";
      vmtasknotice.form.projectCode = "";
      vmtasknotice.form.projectName = "";
      vmtasknotice.form.level = "";
      vmtasknotice.form.noticeStatus = "";
      vmtasknotice.form.approveStatus = "";
      vmtasknotice.form.content = "";
      // 设置为首页
      vmtasknotice.curPage = 1;
      // ajaxGetNoticeData();
    },
    // 公告创建
    create: function(e) {
      noticedetail.modelType = "";
      clearDataValue(noticedetail.form.$model);
      // 设置标题、打开窗口
      noticedetail.modelType = "add";
      noticedetail.form.text = "公告新增";
      // 按钮控制
      noticedetail.btnCheck_vis = false;
      noticedetail.btnLog_vis = false;
      noticedetail.btnUpdate_vis = false;
      noticedetail.inputs_dis = false;
      noticedetail.btnAdd_vis = true;
      t = setInterval(tick, 1000);
      showDialog();
    },
    // 公告删除
    ddelete: function(e) {
      // 获取选中的公告
      var noticeId = $('#tbody_tasknotice input[name="notice"]:checked').val();
      if(noticeId == undefined || noticeId == null) {
        alert("请在下表中选择公告，然后再执行此操作！");
        return;
      } else {
        if(confirm("确认要删除吗？")) {
          Common.ajax({
            url: '/s.task/api/v1/notice/delete',
            type: "POST",
            data: {
              noticeIds: noticeId
            },
            success: function(data) {
              if(data) {
                ajaxGetNoticeData();
              } else {
                alert("公告删除失败，请稍后重试！");
                return;
              }
            },
            error: function() {},
            complete: function() {}
          });
        }
      }
    }
  });
  // 新增、修改、删除、审核公告模块
  var noticedetail = avalon.define({
    $id: "noticedetail",
    modelType: "", // 模态窗口类型［新增、编辑、查看]
    btnAdd_vis: false, // 发布按钮状态
    btnCheck_vis: false, // 审核按钮
    btnLog_vis: false, // 日志按钮
    btnUpdate_vis: false, // 保持按钮状态
    inputs_dis: false, // 文本框状态
    fromSource: true, // 打开模态窗口来源[true：当前页面自己打开，false：不是当前页面打开]
    // 编辑表单
    form: {
      id: '', // 公告id
      text: '公告新增', // 公告标题
      projectId: '', // 项目ID
      projectName: '', // 项目名称
      projectCode: '', // 项目编码
      publisher: '', // 创建人
      publisherId: '',
      contactMobile: '', // 电话
      publishTime: '', // 发布时间
      takeEffectTime: "", // 生效时间
      lostEffectTime: "", // 失效时间
      level: '', // 公告级别
      content: '' // 公告内容
    },
    // 项目名称
    project_auto: {
      list: [],
      isout: true,
      loading: false,
      visible: false
    },
    // 公告级别
    level: {
      isLoading: false,
      data: []
    },
    // 自动检索
    autoinput: function(target) {
      var name = Common.trim(this.value || '');
      noticedetail.form[target + "Name"] = name;
      noticedetail.form[target + "Code"] = '';
      noticedetail.form[target + "Id"] = '';
      if(name === '') {
        noticedetail[target + "_auto"].visible = false;
        noticedetail[target + "_auto"].loading = false;
        return;
      }
      autofunc["get" + target + "_ajax"](noticedetail, name);
    },
    // 获取单条公告信息
    getNoticeInfobyId: function() {
      Common.ajax({
        url: servicePath.task + '/v1/notice/' + noticedetail.form.id,
        type: "GET",
        data: {},
        success: function(data) {
          noticedetail.form.projectName = data.projectName;
          noticedetail.form.projectCode = data.projectCode;
          noticedetail.form.takeEffectTime = data.takeEffectTime;
          noticedetail.form.lostEffectTime = data.lostEffectTime;
          noticedetail.form.level = data.level;
          noticedetail.form.content = data.content;
          noticedetail.form.publisher = data.publisher;
          noticedetail.form.contactMobile = data.contactMobile;
          noticedetail.form.publishTime = data.publishTime;
        },
        error: function() {},
        complete: function() {}
      });
    },
    // 新增公告
    add: function(e) {
      if(checkForm()) {
        Common.ajax({
          url: servicePath.task + '/v1/notice/add',
          type: "POST",
          data: {
            //projectName: noticedetail.form.projectName,
            noticeSource: "1",
            projectCode: noticedetail.form.projectCode,
            takeEffectTime: noticedetail.form.takeEffectTime,
            lostEffectTime: noticedetail.form.lostEffectTime,
            level: noticedetail.form.level,
            content: noticedetail.form.content,
            publisher: noticedetail.form.publisher,
            publisherId: noticedetail.form.publisherId,
            contactMobile: noticedetail.form.contactMobile
          },
          success: function(data) {
            if(data) {
              $(".backdrop,#notice_edit").hide();
              ajaxGetNoticeData();
            } else {
              alert("公告修改失败，请稍后重试！");
              return;
            }
          },
          error: function() {},
          complete: function() {}
        });
      }
    },
    // 修改公告
    update: function(e) {
      if(checkForm()) {
        Common.ajax({
          url: servicePath.task + '/v1/notice/' + noticedetail.form.id + '/update',
          type: "POST",
          data: {
            id: noticedetail.form.id,
            //projectName: noticedetail.form.projectName,
            projectCode: noticedetail.form.projectCode,
            takeEffectTime: noticedetail.form.takeEffectTime,
            lostEffectTime: noticedetail.form.lostEffectTime,
            level: noticedetail.form.level,
            content: noticedetail.form.content,
            contactMobile: noticedetail.form.contactMobile
          },
          success: function(data) {
            if(data) {
              $(".backdrop,#notice_edit").hide();
              clearDataValue(noticedetail.form.$model);
              ajaxGetNoticeData();
            } else {
              alert("公告修改失败，请稍后重试！");
              return;
            }
          },
          error: function() {},
          complete: function() {}
        });
      }
    },
    // 公告日志
    record: {
      loading: false,
      list: [], //公告日志列表
      isShowed: false
    },
    recordShow: function() {
      var jqRecord = $("#taknotice_record_body");
      noticedetail.record.isShowed = true;
      $(".modal_check_bg").show();
      jqRecord.show().animate({
        bottom: "0px"
      });
      getNoticeRecord();
    },
    recordHide: function() {
      var jqRecord = $("#taknotice_record_body");
      noticedetail.record.isShowed = false;
      jqRecord.animate({
        bottom: "-260px"
      }, function() {
        $(".modal_check_bg").hide();
        jqRecord.hide();
      });
    },
    toggleRecord: function() {
      var jqRecord = $("#taknotice_record_body");
      if(noticedetail.record.isShowed) {
        noticedetail.recordHide();
      } else {
        noticedetail.recordShow();
      }
    },
    up: function(e) {
      noticedetail.btnCheck_vis = false;
      $(".modal_check_bg").show();
      $("#notice_body .j_approve").show().animate({
        bottom: "0px"
      });
    },
    down: function(e) {
      var jqApprove = $("#notice_body .j_approve")
      jqApprove.animate({
        bottom: "-260px"
      }, function() {
        $(".modal_check_bg").hide();
        jqApprove.hide();
        if(noticedetail.modelType == "check") {
          noticedetail.btnCheck_vis = true;
        }
      });
    },
    // 审核
    check: function(e, res, text) {
      if(confirm("您的审批结果为:［ " + text + " ］确定执行该操作吗？")) {
        Common.ajax({
          url: servicePath.task + '/v1/notice/' + noticedetail.form.id + '/approve',
          type: "POST",
          data: {
            result: res,
            opinion: $("#check_content").val()
          },
          success: function(data) {
            if(data) {
              ajaxGetNoticeData();
              noticedetail.hide();
            } else {
              alert("审批失败，请稍后重试，或者联系管理员！");
            }
          },
          error: function() {},
          complete: function() {}
        });
      }
    },
    // 关闭
    close: function(e) {
      if(confirm("确定关闭此条公告吗？")) {
        Common.ajax({
          url: servicePath.task + '/api/v1/notice/' + noticedetail.form.id + '/close',
          type: "POST",
          data: {},
          success: function(data) {
            if(data) {
              ajaxGetNoticeData();
            } else {
              alert("关闭失败，请稍后重试，或者联系管理员！");
            }
          },
          error: function() {},
          complete: function() {}
        });
      }
    },
    // 隐藏窗口
    hide: function() {
      $(".backdrop,#notice_edit").hide();
      if(t) {
        clearInterval(t);
      }
      noticedetail.down();
      if(!noticedetail.fromSource) {
        if(window["SIMPLEMODEL"]){
          avalon.router.redirect("/contentnewtask/taskinput");
        }else{
          avalon.router.redirect("/contenttask/taskinput");
        }
        // 设置成默认当前页面打开
        noticedetail.fromSource = true;
      }
      // 隐藏公告日志
      noticedetail.recordHide();
    }
  });
  // 监控表单下的所有属性值
  noticedetail.form.$watch("$all", function(name) {
    if(noticedetail.form[name] != '') $("#div_" + name).removeClass("error");
  });
  /* 设置分页信息 */
  var noticePageInfo = null;

  function bindPageInfo() {
    noticePageInfo = new Pagination({
      selector: "#tasknotice_pagination",
      onchange: function(pageInfo) {
        vmtasknotice.curPage = pageInfo.curpage;
        ajaxGetNoticeData();
      }
    });
    // 计算宽高
    resize_notice();
  }
  /**
   * 展示公告弹出框
   */
  function showDialog() {
    // 清空错误提示
    $("#notice_body .error").removeClass("error");
    $(".backdrop,#notice_edit").show();
  }
  // 处理页面高度
  function resize_notice() {
    var page_h = $(window).height();

    if(avalon.vmodels.contenttask){
      var obj = $("#" + avalon.vmodels.contenttask.visibleIndex);
    }else if(avalon.vmodels.contentnewtask){
      var obj = $("#" + avalon.vmodels.contentnewtask.visibleIndex);
    }

    if(obj.attr("class")) {
      var top_h = obj.offset().top;
      obj.height(page_h - top_h - 55); //55: 页面间距 & 分页
    }
  }

  function clearData(data) {
    var d = data || {},
      m = vmtasknotice.form.$model
    for(var i in m) {
      if(d.hasOwnProperty(i)) {
        vmtasknotice.form[i] = d[i];
      } else {
        vmtasknotice.form[i] = null;
      }
    }
  }

  function clearDataValue(m) {
    for(var i in m) {
      noticedetail.form[i] = '';
    }
    // 设置默认公告级别为：普通
    noticedetail.form.level = "1";
    noticedetail.form.publisher = Config.local.userName;
    noticedetail.form.publisherId = Config.local.userId;
    noticedetail.form.contactMobile = Config.local.mobile;
    $("#fPublisher").val(Config.local.userName);
    $("#contactMobile").val(Config.local.mobile);
    $("#hidPublisherId").val(Config.local.userId);
  }
  /* 获取公告列表 */
  var ajaxGetNoticeData_handle = null;

  function ajaxGetNoticeData() {
    vmtasknotice.noticelist.isLoading = true;
    if(!vmtasknotice.curPage) {
      vmtasknotice.curPage = 1;
    }
    if(vmtasknotice.curPage < 1) return;
    if(ajaxGetNoticeData_handle) {
      ajaxGetNoticeData_handle.abort();
    }
    ajaxGetNoticeData_handle = Common.ajax({
      url: servicePath.task + '/v1/notices',
      type: "GET",
      cache: false,
      data: {
        curPage: vmtasknotice.curPage,
        pageSize: vmtasknotice.pageSize,
        startTime: vmtasknotice.form.start_time_notice,
        endTime: vmtasknotice.form.end_time_notice,
        publisher: vmtasknotice.form.publisher,
        projectCode: vmtasknotice.form.projectCode,
        projectName: "",
        level: vmtasknotice.form.level,
        content: vmtasknotice.form.content,
        noticeStatus: vmtasknotice.form.noticeStatus,
        approveStatus: vmtasknotice.form.approveStatus
      },
      success: function(data) {
        vmtasknotice.noticelist.data = [];
        vmtasknotice.noticelist.data = data.list;
        /* 更新分页控件 */
        var pinfo = data.pagination;
        noticePageInfo.render({
          curpage: pinfo.curPage,
          pagesize: pinfo.pageSize,
          totalpage: pinfo.totalPage,
          totalsize: pinfo.totalSize
        });
        noticePageInfo.pagesize = pinfo.pageSize;
      },
      error: function() {},
      complete: function() {
        vmtasknotice.noticelist.isLoading = false;
      }
    });
    /*Common.loading({
        text: "",
        container: "#tasknotice",
        handle: ajaxGetNoticeData_handle
    });*/
  }
  /* 获取公告日志 */
  var getNoticeRecord_handle = null;

  function getNoticeRecord() {
    if(getNoticeRecord_handle) {
      getNoticeRecord_handle.abort();
    }
    noticedetail.record.loading = true;
    noticedetail.record.list = [];
    getNoticeRecord_handle = Common.ajax({
      // /notice/{noticeId}/log
      url: servicePath.task + "/v1/notice/" + noticedetail.form.id + "/log",
      type: "GET",
      success: function(res) {
        noticedetail.record.list = res;
      },
      error: function() {},
      complete: function() {
        noticedetail.record.loading = false;
      }
    })
  }
  /* 自动搜索项目 */
  var autofunc = {};
  var getProject_handle = null;
  autofunc.getproject_ajax = function(vm, projectName) {
    if(getProject_handle) {
      getProject_handle.abort();
    }
    vm.project_auto.visible = true;
    vm.project_auto.loading = true;
    getProject_handle = Common.ajax({
      url: servicePath.house + "/v1/projects",
      type: "GET",
      data: {
        projectName: projectName
      },
      success: function(res) {
        vm.project_auto.list = res;
      },
      error: function() {},
      complete: function() {
        vm.project_auto.loading = false;
      }
    })
  }

  function init() {
    if(hasInit) {
      return;
    }
    hasInit = true;
    setTimeout(function() {
      resetTime();
      // 审核状态查询变更
      $("#approveStatus").on("change", function() {
        var status = $(this).val();
        if(status != 2 && status != "") {
          vmtasknotice.nstauts_vis = false;
          vmtasknotice.form.noticeStatus = "";
        } else {
          vmtasknotice.nstauts_vis = true;
        }
      });
      // 获取公告状态
      getNoticeStatus();
    });
  }

  function resetTime() {
    var q = new Date();
    vmtasknotice.form.end_time_notice = Common.formatDate(q, "yyyy-MM-dd 23:59:59");
    q.setDate(q.getDate(), q.setDate(0))
    vmtasknotice.form.start_time_notice = Common.formatDate(q, "yyyy-MM-dd 00:00:00");
  }
  // 窗口改变大小事件
  window.onresize = function() {
    resize_notice();
  };

  function active(query) {
    init();
    view(query);
  }

  function view(opt) {
    if(opt && opt.noticeid) {
      noticedetail.modelType = "show";
      // 设置窗口状态为公告查看
      noticedetail.form.text = "公告查看";
      noticedetail.btnAdd_vis = false;
      noticedetail.btnCheck_vis = false;
      noticedetail.btnUpdate_vis = false;
      noticedetail.inputs_dis = true;
      noticedetail.btnLog_vis = true;
      // 设置打开来源为其他窗口
      noticedetail.fromSource = false;
      noticedetail.form.id = opt.noticeid;
      noticedetail.getNoticeInfobyId();
      showDialog();
    }
  }

  function bindEvent() {
    // $("#taknotice_record_body").popover({
    //     content: function() {
    //         var a = $(this),
    //             index = a.attr("data-index"),
    //             notice = noticedetail.record.list[index],
    //             text = notice["noticeDetail"];
    //         return text;
    //     },
    //     placement: "bottom",
    //     selector: "a.record-details"
    // });
    $("#taknotice_record_body").on("click", "a.record-details", function() {
        $(this).parent().next().toggle();
      })
      // 自动完成
    $("#tasknoticeProjectNameAutoComplete").each(function() {
      var that = $(this);
      var target = that.attr("target");
      that.on("click", "li", function() {
        var li = $(this),
          id = li.attr("data-id"),
          code = li.attr("data-code"),
          text = li.attr("data-text");
        vmtasknotice[target + "_auto"].visible = false;
        vmtasknotice.form[target + "Id"] = id;
        vmtasknotice.form[target + "Code"] = code;
        vmtasknotice.form[target + "Name"] = text;
      })
      $(document).on("click", function() {
        vmtasknotice[target + "_auto"].visible = false;
      })
    });
    $("#notice_edit .autocomplete").each(function() {
      var that = $(this);
      var target = that.attr("target");
      that.on("click", "li", function() {
        var li = $(this),
          id = li.attr("data-id"),
          code = li.attr("data-code"),
          text = li.attr("data-text");
        noticedetail[target + "_auto"].visible = false;
        noticedetail.form[target + "Id"] = id;
        noticedetail.form[target + "Code"] = code;
        noticedetail.form[target + "Name"] = text;
      })
      $(document).on("click", function() {
        noticedetail[target + "_auto"].visible = false;
      })
    });
    // 项目名称 － 行点击
    $("#tbody_tasknotice").on("click", "a", function() {
      var name = $(this).attr("data-type");
      var that = $(this);
      var noticeId = that.attr("data-id");
      // 公告id
      noticedetail.form.id = noticeId;
      // 获取详情
      noticedetail.getNoticeInfobyId();
      // 设置窗口类型
      noticedetail.modelType = name;
      // 状态控制
      noticedetail.btnAdd_vis = false;
      noticedetail.btnCheck_vis = false;
      noticedetail.btnUpdate_vis = false;
      noticedetail.inputs_dis = false;
      noticedetail.btnLog_vis = true;
      window.clearInterval(t);
      // 校验属性
      switch(name) {
        case "edit":
          noticedetail.form.text = "公告编辑";
          noticedetail.btnUpdate_vis = true;
          break;
        case "show":
          noticedetail.form.text = "公告查看";
          noticedetail.inputs_dis = true;
          break;
        case "check":
          noticedetail.form.text = "公告审批";
          noticedetail.inputs_dis = true;
          noticedetail.btnCheck_vis = false;
          $("#check_content").val("");
          break;
      }
      if(name == "close") noticedetail.close();
      else {
        showDialog();
        setTimeout(function() {
          if(name == "check") noticedetail.up();
        }, 400);
      }
    });
    // 公告编辑
    $("#noticeContent").on("blur", function() {
      if(!cmd()) {
        $("#div_content").addClass("error");
      } else {
        $("#div_content").removeClass("error");
      }
    });
  }

  function checkForm() {
    var isOk = false;
    var projectName = Common.trim(noticedetail.form.projectName || '');
    var projectCode = Common.trim(noticedetail.form.projectCode || '');
    var takeEffectTime = Common.trim(noticedetail.form.takeEffectTime || '');
    var lostEffectTime = Common.trim(noticedetail.form.lostEffectTime || '');
    var level = Common.trim(noticedetail.form.level || '');
    var content = Common.trim(noticedetail.form.content || '');
    if(projectName === '') $("#div_projectName").addClass("error");
    else if(projectCode === '') $("#div_projectCode").addClass("error");
    else if(takeEffectTime === '') $("#div_takeEffectTime").addClass("error");
    else if(lostEffectTime === '') $("#div_lostEffectTime").addClass("error");
    else if(level === '') $("#div_level").addClass("error");
    else if(content === '') $("#div_content").addClass("error");
    else
    if(!cmd()) {
      $("#div_content").addClass("error");
    } else {
      isOk = true;
    }
    return isOk;
  }

  function cmd() {
    var tr = true;
    var len = $("#noticeContent").val().replace(/[^\x00-\xff]/g, "**").length;
    if(len > 1000) {
      tr = false;
    }
    return tr;
  }
  // 加载字典数据
  function getNoticeStatus() {
    var codes = ["NoticeStatus", // 公告状态
      "ProjectNoticeLevel", // 公告级别
      "ApproveStatus" // 审批状态
    ].join(",");
    return Common.ajax({
      url: servicePath.task + "/v1/batch/dict/" + codes + "/items",
      type: "GET",
      success: function(data) {
        vmtasknotice.notice.data = data["NoticeStatus"];
        vmtasknotice.approve.data = data["ApproveStatus"];
        noticedetail.level.data = data["ProjectNoticeLevel"];
        vmtasknotice.level.data = data["ProjectNoticeLevel"];
        // 设置公告状态为有效
        vmtasknotice.form.noticeStatus = "2";
        vmtasknotice.form.approveStatus = "2";
        // 获取列表数据
        // ajaxGetNoticeData();
        // 绑定分页
        bindPageInfo();
        // 绑定事件
        bindEvent();
      },
      error: function() {},
      complete: function() {}
    })
  }

  function tick() {
    noticedetail.form.publishTime = stime(0);
  }

  function stime(day) {
    var years, months, days, hours, minutes, seconds;
    var intYears, intMonths, intDays, intHours, intMinutes, intSeconds;
    var today;
    today = new Date(); // 系统当前时间
    intYears = today.getFullYear(); // 得到年份,getFullYear()比getYear()更普适
    intMonths = today.getMonth();
    if(day == 0) intMonths = today.getMonth() + 1; // 得到月份，要加1
    intDays = today.getDate(); // 得到日期
    intHours = today.getHours(); // 得到小时
    intMinutes = today.getMinutes(); // 得到分钟
    intSeconds = today.getSeconds(); // 得到秒钟
    years = intYears + "-";
    if(intMonths < 10) {
      months = "0" + intMonths + "-";
    } else {
      months = intMonths + "-";
    }
    if(intDays < 10) {
      days = "0" + intDays + " ";
    } else {
      days = intDays + " ";
    }
    if(intHours == 0) {
      hours = "00:";
    } else if(intHours < 10) {
      hours = "0" + intHours + ":";
    } else {
      hours = intHours + ":";
    }
    if(intMinutes < 10) {
      minutes = "0" + intMinutes + ":";
    } else {
      minutes = intMinutes + ":";
    }
    if(intSeconds < 10) {
      seconds = "0" + intSeconds + " ";
    } else {
      seconds = intSeconds + " ";
    }
    return years + months + days + hours + minutes + seconds;
  }
  return {
    active: active,
    view: view,
    clearData: clearData
  }
});
