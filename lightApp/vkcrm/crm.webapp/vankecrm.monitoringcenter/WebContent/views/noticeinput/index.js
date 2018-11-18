define([], function() {

    // 计时
    var t = setInterval(tick, 1000);

    var hasInit = false;
    // 页面查询、列表展示模块
    var vmtasknotice = avalon.define({
        $id: "tasknotice",
        // 当前页码
        curPage: 1,
        pageSize: 10,
        form: {
            // 查询时间段
            start_time_notice: "",
            end_time_notice: "",
            // 发布人
            publisher: "",
            // 项目名称
            projectName: "",
            // 公告级别
            level: "",
            // 公告状态
            noticeStatus: "",
            // 公告内容
            content: ""
        },
        notice: {
            isLoading: false,
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
            $("#start_time_notice,#end_time_notice").val("");
            vmtasknotice.form.start_time_notice = "";
            vmtasknotice.form.end_time_notice = "";
            vmtasknotice.form.publisher = "";
            vmtasknotice.form.projectName = "";
            vmtasknotice.form.level = "";
            vmtasknotice.form.noticeStatus = "";
            vmtasknotice.form.content = "";

            // 设置为首页
            vmtasknotice.curPage = 1;
            ajaxGetNoticeData();
        },
        // 公告创建
        create: function(e) {
            noticedetail.modelType = "";
            // 设置标题、打开窗口
            clearDataValue(noticedetail.form.$model);
            noticedetail.modelType = "add";
            // 初始化创建人
            noticedetail.form.publisher = Config.local.publisher;
            noticedetail.form.publisherId = Config.local.publisherId;
            noticedetail.form.contactMobile = Config.local.contactMobile;

            // 获取
            $("#notice_edit").removeClass("hide").modal('show');
        },
        // 公告查看
        show: function(e) {
            var noticeId = $('#tbody_tasknotice input[name="notice"]:checked').val();
            if (noticeId == undefined || noticeId == null) {
                alert("请在下表中选择公告，然后再执行此操作！");
                return;
            } else {
                noticedetail.modelType = "show";
                noticedetail.form.id = noticeId;
                noticedetail.getNoticeInfobyId();
                // 设置标题、打开窗口
                $("#notice_edit").removeClass("hide").modal('show');
            }
        },
        // 公告修改
        edit: function(e) {
            // 获取选中的公告
            var noticeId = $('#tbody_tasknotice input[name="notice"]:checked').val();
            if (noticeId == undefined || noticeId == null) {
                alert("请在下表中选择公告，然后再执行此操作！");
                return;
            } else {
                noticedetail.modelType = "edit";
                // 公告id
                noticedetail.form.id = noticeId;
                noticedetail.getNoticeInfobyId();
                // 设置标题、打开窗口
                $("#notice_edit").removeClass("hide").modal('show');
            }
        },
        // 公告删除
        ddelete: function(e) {
            // 获取选中的公告
            var noticeId = $('#tbody_tasknotice input[name="notice"]:checked').val();
            if (noticeId == undefined || noticeId == null) {
                alert("请在下表中选择公告，然后再执行此操作！");
                return;
            } else {
                if (confirm("确认要删除吗？")) {
                    Common.ajax({
                        url: servicePath.task + '/v1/notice/delete',
                        type: "POST",
                        data: {
                            noticeIds: noticeId
                        },
                        success: function(data) {
                            if (data) {
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

    // 新增、修改、删除公告模块
    var noticedetail = avalon.define({
        $id: "noticedetail",
        modelType: "", // 模态窗口类型［新增、编辑、查看]
        btnAdd_vis: false, // 发布按钮状态
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
            takeEffectTime: '', // 生效时间
            lostEffectTime: '', // 失效时间
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
            if (name === '') {
                noticedetail[target + "_auto"].visible = false;
                noticedetail[target + "_auto"].loading = false;
                return;
            }
            autofunc["get" + target + "_ajax"](name);
        },
        autoblur: function(target) {
            setTimeout(function() {
                noticedetail[target + '_auto'].visible = false;
            }, 200);
        },
        // 获取单条公告信息
        getNoticeInfobyId: function() {
            Common.ajax({
                url: servicePath.task + '/v1/notice/querynotice',
                type: "GET",
                data: {
                    noticeId: noticedetail.form.id
                },
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

                    // 设置标题、打开窗口
                    $("#notice_edit").removeClass("hide").modal('show');
                },
                error: function() {},
                complete: function() {}
            });
        },
        // 新增公告
        add: function(e) {
            if (checkForm()) {
                Common.ajax({
                    url: servicePath.task + '/v1/notice/add',
                    type: "POST",
                    data: {
                        projectName: noticedetail.form.projectName,
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
                        if (data) {
                            $("#notice_edit").modal('hide');
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
            if (checkForm()) {
                Common.ajax({
                    url: servicePath.task + '/v1/notice/update',
                    type: "POST",
                    data: {
                        id: noticedetail.form.id,
                        projectName: noticedetail.form.projectName,
                        projectCode: noticedetail.form.projectCode,
                        takeEffectTime: noticedetail.form.takeEffectTime,
                        lostEffectTime: noticedetail.form.lostEffectTime,
                        level: noticedetail.form.level,
                        content: noticedetail.form.content,
                        contactMobile: noticedetail.form.contactMobile
                    },
                    success: function(data) {
                        if (data) {
                            $("#notice_edit").modal('hide');
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
        }
    });

    // 监控属性变化
    noticedetail.$watch("modelType", function(newValue, oldValue) {
        // 控制按钮 & 表单
        noticedetail.btnAdd_vis = false;
        noticedetail.btnUpdate_vis = false;
        noticedetail.inputs_dis = false;
        window.clearInterval(t);
        // 校验属性
        switch (newValue) {
            case "add":
                noticedetail.form.text = "公告新增";
                noticedetail.btnAdd_vis = true;
                t = setInterval(tick, 1000);
                break;
            case "edit":
                noticedetail.form.text = "公告编辑";
                noticedetail.btnUpdate_vis = true;
                break;
            case "show":
                noticedetail.form.text = "公告查看";
                noticedetail.inputs_dis = true;
                break;
        }
    });

    // 监控表单下的所有属性值
    noticedetail.form.$watch("$all", function(name) {
        if (noticedetail.form[name] != '')
            $("#div_" + name).removeClass("error");
    });

    /* 设置分页信息 */
    var noticePageInfo = null;

    function bindPageInfo() {
        noticePageInfo = new Pagination({
            template: "#paginationtmpl",
            selector: "#tasknotice_pagination",
            onchange: function(pageInfo) {
                vmtasknotice.curPage = pageInfo.curpage;
                ajaxGetNoticeData();
            }
        });
    }

    function clearData(data) {
        var d = data || {},
            m = vmtasknotice.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmtasknotice.form[i] = d[i];
            } else {
                vmtasknotice.form[i] = null;
            }
        }
    }

    function clearDataValue(m) {
        for (var i in m) {
            noticedetail.form[i] = '';
        }
    }

    /* ajax取数 */
    function ajaxGetNoticeData() {
        if (!vmtasknotice.curPage) {
            vmtasknotice.curPage = 1;
        }
        if (vmtasknotice.curPage < 1) return;
        Common.ajax({
            url: servicePath.task + '/v1/notices',
            type: "GET",
            cache: false,
            data: {
                curPage: vmtasknotice.curPage,
                pageSize: vmtasknotice.pageSize,
                startTime: vmtasknotice.form.start_time_notice,
                endTime: vmtasknotice.form.end_time_notice,
                publisher: vmtasknotice.form.publisher,
                projectName: vmtasknotice.form.projectName,
                level: vmtasknotice.form.level,
                content: vmtasknotice.form.content,
                noticeStatus: vmtasknotice.form.noticeStatus
            },
            success: function(data) {
                // vmtasknotice.notice.data = data.list;  /* avalon 显示效果 */
                var html = "<tr class='nothing'><td colspan='10'>暂无数据</td></tr>";
                /* 渲染table */
                if (data.list != undefined) {
                    if (data.list.length > 0) {
                        html = template('tasknoticelist', {
                            list: data.list
                        });
                    }
                    /* 更新分页控件 */
                    var pinfo = data.pagination;
                    noticePageInfo.render({
                        curpage: pinfo.curPage,
                        pagesize: pinfo.pageSize,
                        totalpage: pinfo.totalPage,
                        totalsize: pinfo.totalSize
                    });
                    noticePageInfo.pagesize = pinfo.pageSize;
                }
                $('#tbody_tasknotice').html(html);
            },
            error: function() {},
            complete: function() {}
        });
    }

    /*
     * 自动搜索项目
     */
    var autofunc = {};
    var getProject_handle = null;

    autofunc.getproject_ajax = function(projectName) {
        if (getProject_handle) {
            getProject_handle.abort();
        }
        noticedetail.project_auto.visible = true;
        noticedetail.project_auto.loading = true;
        getProject_handle = Common.ajax({
            url: servicePath.house + "/v1/projects",
            type: "GET",
            data: {
                projectName: projectName
            },
            success: function(res) {
                noticedetail.project_auto.list = res;
            },
            error: function() {

            },
            complete: function() {
                noticedetail.project_auto.loading = false;
            }
        })
    }

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        setTimeout(function() {
            // 获取公告状态
            getNoticeStatus();
            // 获取列表数据
            ajaxGetNoticeData();
            // 绑定分页
            bindPageInfo();
            // 绑定事件
            bindEvent();
        });
    }

    function active() {
        init();
    }

    function view(opt, callback) {
        if (opt.noticeId) {
            noticedetail.modelType = "show";
            // 设置打开来源为其他窗口
            noticedetail.fromSource = false;
            noticedetail.form.id = opt.noticeId;
            noticedetail.getNoticeInfobyId();
        }
    }

    function bindEvent() {
        // 自动完成
        $(".autocomplete").each(function() {
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
        });

        // 项目名称 － 行点击
        $("#tbody_tasknotice").on("click", "a", function() {
            var noticeId = $(this).attr("data-id");
            noticedetail.modelType = "show";
            noticedetail.form.id = noticeId;
            noticedetail.getNoticeInfobyId();
            // 设置标题、打开窗口
            $("#notice_edit").removeClass("hide").modal('show');
        });

        // 置为失效 － 行点击
        $("#tbody_tasknotice").on("click", "span", function() {
            var noticeId = $(this).attr("data-id");
            if (confirm("确定将当前公告置为“失效”吗？")) {
                Common.ajax({
                    url: servicePath.task + '/v1/notice/update/status',
                    type: "POST",
                    data: {
                        noticeid: noticeId,
                        status: "3"
                    },
                    success: function(data) {
                        if (data) {
                            ajaxGetNoticeData();
                        } else {
                            alert("修改状态失败，请重试！");
                            return;
                        }
                    },
                    error: function() {},
                    complete: function() {}
                });
            }
        });

        // 模态窗口关闭
        $("#m_close").on("click", function() {
            $("#notice_edit").removeClass("show").modal('hide');
            if (!noticedetail.fromSource) {
                // 设置成默认当前页面打开
                noticedetail.fromSource = true;
            }
        });
        $("#btn_close").on("click", function() {
            $("#m_close").click();
        });

        // 公告编辑
        $("#noticeContent").on("blur", function() {
            if (!cmd()) {
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


        if (projectName === '')
            $("#div_projectName").addClass("error");
        else if (projectCode === '')
            $("#div_projectCode").addClass("error");
        else if (takeEffectTime === '')
            $("#div_takeEffectTime").addClass("error");
        else if (lostEffectTime === '')
            $("#div_lostEffectTime").addClass("error");
        else if (level === '')
            $("#div_level").addClass("error");
        else if (content === '')
            $("#div_content").addClass("error");
        else
        if (!cmd()) {
            $("#div_content").addClass("error");
        } else {
            isOk = true;
        }
        return isOk;
    }

    function cmd() {
        var tr = true;
        var len = $("#noticeContent").val().replace(/[^\x00-\xff]/g, "**").length;
        if (len > 1000) {
            tr = false;
        }
        return tr;
    }

    // 加载字典数据
    function getNoticeStatus() {
        Common.ajax({
            url: servicePath.task + '/v1/dict/items',
            type: "POST",
            data: {'codes': 'NoticeStatus'},
            success: function(data) {
                vmtasknotice.notice.data = data;
            },
            error: function() {},
            complete: function() {}
        });

        Common.ajax({
            url: servicePath.task + '/v1/dict/items',
            type: "POST",
            data: {'codes': 'ProjectNoticeLevel'},
            success: function(data) {
                noticedetail.level.data = data;
                vmtasknotice.level.data = data;
            },
            error: function() {},
            complete: function() {}
        });
    }

    function tick() {
        var years, months, days, hours, minutes, seconds;
        var intYears, intMonths, intDays, intHours, intMinutes, intSeconds;
        var today;
        today = new Date(); // 系统当前时间
        intYears = today.getFullYear(); // 得到年份,getFullYear()比getYear()更普适
        intMonths = today.getMonth() + 1; // 得到月份，要加1
        intDays = today.getDate(); // 得到日期
        intHours = today.getHours(); // 得到小时
        intMinutes = today.getMinutes(); // 得到分钟
        intSeconds = today.getSeconds(); // 得到秒钟
        years = intYears + "-";
        if (intMonths < 10) {
            months = "0" + intMonths + "-";
        } else {
            months = intMonths + "-";
        }
        if (intDays < 10) {
            days = "0" + intDays + " ";
        } else {
            days = intDays + " ";
        }
        if (intHours == 0) {
            hours = "00:";
        } else if (intHours < 10) {
            hours = "0" + intHours + ":";
        } else {
            hours = intHours + ":";
        }
        if (intMinutes < 10) {
            minutes = "0" + intMinutes + ":";
        } else {
            minutes = intMinutes + ":";
        }
        if (intSeconds < 10) {
            seconds = "0" + intSeconds + " ";
        } else {
            seconds = intSeconds + " ";
        }
        noticedetail.form.publishTime = years + months + days + hours + minutes + seconds;
    }

    return {
        active: active,
        view: view,
        clearData: clearData
    }
});