define(['views/taskinput/index', 'views/taskcall/index'], function(taskinput, taskcall) {
    var SIMPLEMODEL = window["SIMPLEMODEL"] || false;
    var curCallId = '',
        curCallNumber = '';
    var hasInit = false,
        isNewTask = false;
    var jq_custdialog, jq_housedialog, jq_draftdialog;
    var page_customer, page_house, page_draft
    var Data = {
        callList: [],
        buildingList: [],
        relationList: [],
        draftList: [],
        draftDialogList: []
    }

    var model = avalon.define({
        $id: "sidebar",
        simpleModel: SIMPLEMODEL,
        /* data */
        relationListLoading: false,
        relationList: [],
        buildingListLoading: false,
        buildingList: [],
        callListLoading: false,
        callList: [],
        draftListLoading: false,
        draftList: [],
        customerInfo:{
            customerId:'',
            fullName:'',
            mainMobile:'',
            sex:'',
            hobbies:'',
            identities:''
        },
        // event
        moreDraft: function() {
            if (model.draftList.length != 0) {
                jq_draftdialog.modal("show");
                if (draftModel.draftList.length == 0) {
                    getDraft_ajax(true);
                }
            }
        },
        moreCust: function() {
            if (model.relationList.length != 0) {
                jq_custdialog.modal("show");
                if (custModel.relationList.length == 0) {
                    //modified by liaochao 20160202
                    getCustomer_ajax(true, null, true);
                }
            }
        },
        moreBuilding: function() {
            if (model.buildingList.length != 0) {
                jq_housedialog.modal("show");
                if (houseModel.buildingList.length == 0) {
                    getBuilding_ajax(true);
                }
            }
        }
    });
    var custModel = avalon.define({
        $id: "sidebar_customer",
        relationListLoading: false,
        relationList: [],
        //add by liaochao 20160202
        clickRow: function(index) {
            var rowData = custModel.relationList[index];
            taskinput.setData({
                contactsUserId: rowData.customerId,
                contactsName: rowData.fullName,
                projectId: rowData.projectId,
                projectName: rowData.projectName,
                houseId: rowData.houseId,
                houseName: rowData.name,
                buildingName: rowData.buildingName
            })
            jq_custdialog.modal("hide");
        }
    })

    var draftModel = avalon.define({
        $id: "sidebar_draft",
        draftListLoading: false,
        draftList: [],
    })

    var houseModel = avalon.define({
            $id: "sidebar_house",
            buildingListLoading: false,
            buildingList: []
        })
        // 获取客户信息
    var getCustomer_handle = null;
    //modified by liaochao 20160202
    function getCustomer_ajax(isMore, curPage, justClicked) {
        if (getCustomer_handle) {
            getCustomer_handle.abort();
        }
        var mod = isMore ? custModel : model;
        mod["relationListLoading"] = true;
        var url = servicePath.customer + "/v1/" + curCallNumber + "/customers";
        if (justClicked) {
            url += "/details";
        }
        getCustomer_handle = Common.ajax({
            //add by liaochao 20160202
            url: url,
            type: "GET",
            data: {
                curPage: curPage || 1,
                pageSize: isMore ? 7 : 3
            },
            success: function(res) {
                var arr = res.list,
                    d;
                // for (var i = 0; i < arr.length; i++) {
                //     d = arr[i];
                // };
                if (isMore) {
                    var p = res["pagination"];
                    page_customer.render({
                        curpage: p["curPage"],
                        pagesize: p["pageSize"],
                        totalpage: p["totalPage"]
                    })
                } else {
                    Data["relationList"] = arr;
                }
                mod["relationList"] = arr;
            },
            error: function() {

            },
            complete: function() {
                mod["relationListLoading"] = false;
            }
        })
    }


    // 获取房屋信息
    var getBuilding_handle = null;

    function getBuilding_ajax(isMore, curPage) {
        if (getBuilding_handle) {
            getBuilding_handle.abort();
        }
        var mod = isMore ? houseModel : model;
        mod["buildingListLoading"] = true;
        getBuilding_handle = Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/queryTaskHouseInfoList/" + (curPage || 1) + "/" + (isMore ? 7 : 5),
            type: "GET",
            data: {
                phoneNo: curCallNumber
            },
            success: function(res) {
                if (isMore) {
                    var p = res["pagination"];
                    page_house.render({
                        curpage: p["curPage"],
                        pagesize: p["pageSize"],
                        totalpage: p["totalPage"]
                    })
                } else {
                    Data["buildingList"] = res.list;
                }
                mod["buildingList"] = res.list;
            },
            error: function() {

            },
            complete: function() {
                mod["buildingListLoading"] = false;
            }
        })

    }

    // 获取通话记录
    var getCallRecord_handle = null;

    function getCallRecord_ajax() {
        if (getCallRecord_handle) {
            getCallRecord_handle.abort();
        }
        model["callListLoading"] = true;
        getCallRecord_handle = Common.ajax({
            url: servicePath.tel + "/v1/telrecord/telcallrecord/get",
            type: "GET",
            data: {
                callNumber: curCallNumber
            },
            success: function(res) {
                Data["callList"] = res;
                model["callList"] = Data["callList"].slice(0, 5);
            },
            error: function() {

            },
            complete: function() {
                model["callListLoading"] = false;
            }
        })
    }

    // 获取通话记录 的 采集原因
    var getReason_handle = null;

    function getReason_ajax(callId, model) {
        if (!callId || !model) {
            return;
        }
        if (getReason_handle) {
            getReason_handle.abort();
        }
        getReason_handle = Common.ajax({
            url: servicePath.tel + "/v1/telrecord/callrecord/reasons",
            type: "GET",
            data: {
                callId: callId
            },
            success: function(res) {
                var s = [];
                if (res.length) {
                    for (var i = 0; i < res.length; i++) {
                        s.push('<span class="word">' + res[i]["content"] + '</span>');
                    };
                } else {
                    s.push("无原因");
                }
                model.find(".popover-content").html(s.join(""))
                model.removeClass("isloading")
            },
            error: function() {

            },
            complete: function() {
                model = null;
            }
        })
    }

    // 获取任务草稿
    var getDraft_handle = null;

    function getDraft_ajax(isMore, curPage) {
        if (getDraft_handle) {
            getDraft_handle.abort();
        }
        var mod = isMore ? draftModel : model;
        mod["draftListLoading"] = true;
        getDraft_handle = Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/queryTaskDraft/" + (curPage || 1) + "/5",
            type: "GET",
            data: {
                // curPage:1,
                // pageSize:5
            },
            success: function(res) {
                if (isMore) {
                    var p = res["pagination"];
                    page_draft.render({
                        curpage: p['curPage'],
                        pagesize: p["pageSize"],
                        totalpage: p["totalPage"]
                    })
                    Data["draftDialogList"] = res.list;
                    //add by liaochao 20160218 begin
                    model["draftList"] = res.list;
                    //add by liaochao 20160218 end

                } else {
                    Data["draftList"] = res.list;
                }
                mod["draftList"] = res.list;
            },
            error: function() {

            },
            complete: function() {
                mod["draftListLoading"] = false;
            }
        })
    }

    // 通过房屋获取公告
    var getNotice_handle = null;

    function getNotice_ajax(projectCode, model) {
        Common.ajax({
            url: servicePath.task + "/v1/notices",
            type: "GET",
            data: {
                curPage: 1,
                pageSize: 5,
                projectCode: projectCode,
                noticeStatus: 2 // 2：已经生效的公告
            },
            success: function(res) {
                var s = [],
                    h, d;
                if (res) {
                    var list = res.list;
                    for (var i = 0; i < list.length; i++) {
                        d = list[i];
                        h = '';
                        h += '<dd>';
                        // h += '<h4>公告标题</h4>';
                        h += '<p>' + d["content"] + '</p><div>';
                        h += '<font>' + d["takeEffectTime"] + '</font> 至 <font>' + d["lostEffectTime"] + '</font>';
                        h += '</div></dd>';
                        s.push(h)
                    };
                }

                model.parent().find(".popover-content").html('<dl>' + s.join("") + '</dl>');
                model.removeClass("isloading");
            },
            error: function() {

            },
            complete: function() {
                model = null;
            }

        })
    }

    // 通过房屋获取任务
    var getTaskByHouseCode_handle = null;

    function getTaskByHouseCode_ajax(houseCode, projectCode, model) {
        if (getTaskByHouseCode_handle) {
            getTaskByHouseCode_handle.abort();
        }
        var param = {
            houseCode: houseCode,
            curPage: "1",
            pageSize: "5"
        };
        // 当房屋编码为null时，传递项目编码查询
        if (houseCode == "null") {
            param = {
                projectCode: projectCode,
                mobile: curCallNumber,
                curPage: "1",
                pageSize: "5"
            };
        }

        getTaskByHouseCode_handle = Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/app/list",
            type: "GET",
            data: param,
            success: function(res) {
                var s = [],
                    list = res.list,
                    h, d, css;

                for (var i = 0; i < list.length; i++) {
                    d = list[i];
                    if ((d["status"] >= '1001' && d["status"] <= '1005') || d["status"] == '1013') {
                        // 暂未找到处理人的显示为红色，包括1001、 1002、1003、1004、 1005、1013
                        css = 'task-doing';
                    } else if (d["status"] >= '1006' && d["status"] <= '1008') {
                        // 已经找到具体处理人的显示为黑色，包括状态1006、1007、1008
                        css = 'task-done';
                    } else if (d["status"] >= '1009' && d["status"] <= '1012') {
                        // 已经完成处理的显示为绿色，1009、1010、1011、1012
                        css = 'task-close';
                    } else {
                        css = '';
                    }
                    h = '';
                    h += '<li><a data-id=' + d["id"] + ' data-no="' + d["task_no"] + '" title="' + d["title"] + '" class="subtask ' + css + '">'
                    h += '<span class="code">' + d["task_no"] + '</span>'
                    h += '<span class="type">' + d["business_name"] + '</span>'
                    h += '<span class="contenttext">' + d["contentText"] + '</span>'
                        // h += '<span class="state">' + (d["status"] == 1 ? "草稿" : "正式") + '</span></a></li>'
                    s.push(h)
                }

                model.removeClass("isloading");
                model.parent().find(".sublist").html(s.join(""));
            },
            error: function() {

            },
            complete: function() {
                model = null;
            }
        })
    }

    //获取标签
    var getHobbies_handle = null;

    function getHobbies_ajax(customerId, model) {
        if (getHobbies_handle) {
            getHobbies_handle.abort();
        }
        getHobbies_handle = Common.ajax({
            url: servicePath.customer + "/v1/customer/" + customerId + "/hobbies",
            type: "GET",
            success: function(res) {
                if (res) {
                    var html = [];
                    if (res.length) {
                        for (var i = 0; i < res.length; i++) {
                            html.push('<span class="word">' + res[i]["contentText"] + '</span>');
                        }
                    } else {
                        html.push("<span>无</span>")
                    }

                    model.find(".c").replaceWith(html.join(""))

                    model.removeClass("isloading");
                }
            },
            error: function() {},
            complete: function() {}
        })
    }

    //获取特殊身份
    var getSpecial_handle = null;

    function getSpecial_ajax(customerId, model) {
        if (getSpecial_handle) {
            getSpecial_handle.abort();
        }
        getSpecial_handle = Common.ajax({
            url: servicePath.customer + "/v1/customer/" + customerId + "/specialIdentities",
            type: "GET",
            success: function(res) {
                if (res) {
                    var html = [];
                    if (res.length) {
                        for (var i = 0; i < res.length; i++) {
                            html.push('<span class="word">' + res[i]["identityText"] + '</span>');
                        }
                    } else {
                        html.push("<span>无</span>")
                    }
                    model.find(".s").replaceWith(html.join(""))
                    model.removeClass("isloading");
                }
            },
            error: function() {},
            complete: function() {}
        })
    }

    // 删除草稿
    function ajaxDeleteDraft(id, jqLi, isMore) {
        Common.ajax({
            url: servicePath.task + "/v1/callcenter/task/taskDraft/" + id,
            type: "POST",
            success: function(res) {
                getDraft_ajax(isMore);
            },
            error: function() {
                jqLi.removeClass("del");
            }
        })

    }

    function cloneAddress(param) {
        taskinput.active();
        //if (avalon.vmodels.taskinput.form.callNo != curCallId) {
        //    return;
        //}
        var obj = param || {};
        var _house_ = "";
        var strInfo = "房屋";
        if (obj["houseName"] == "null" || obj["houseName"] == null || obj["houseName"] == undefined) {
            strInfo = "项目";
            _house_ = obj["projectName"];
        } else {
            _house_ = obj["houseName"];
            strInfo = "房屋";
        }
        if (window.confirm("是否将" + strInfo + "信息【" + (_house_ || obj["projectName"]) + "】带入当期的录入界面")) {
            taskinput.setData({
                projectId: obj["projectId"],
                projectCode: obj["projectCode"],
                projectName: obj["projectName"],
                houseId: obj["houseId"] == 'null' || null || undefined ? '' : obj["houseId"],
                houseCode: obj["houseCode"] == 'null' || null || undefined ? '' : obj["houseCode"],
                houseName: obj["houseName"] == 'null' || null || undefined ? '' : obj["houseName"]
            });
        }
    }

    function cloneCustomer(customerId, customerName, hasApprove) {
        taskinput.active();
        //if (avalon.vmodels.taskinput.form.callNo != curCallId) {
        //    return;
        //}
        var type;
        if(hasApprove){
            type=1;
        }else{
            type=2;
        }
        if (window.confirm("是否将客户信息【" + customerName + "】带入当期的录入界面")) {
            Common.ajax({
                url: servicePath.customer + "/v1/callcenter/customer/info?type="+type+"&customerId="+customerId,
                type: "GET",
                success: function(res) {
                    var hobbyArr = res.hobbies?res.hobbies.split(','):'';
                    var identityArr = res.identities?res.identities.split(','):'';
                    taskinput.setData({
                        contactsName: res.fullName,
                        hasApprove: hasApprove,
                        contactsUserId: res.customerId

                    })
                    taskinput.setDataCust({
                        hobbies:hobbyArr,
                        identity:identityArr,
                        sex:res.sex
                    })
                    model.customerInfo.customerId=res.customerId;
                    model.customerInfo.fullName=res.fullName;
                    model.customerInfo.hobbies=hobbyArr?hobbyArr.sort().join(","):'';
                    model.customerInfo.sex=res.sex;
                    model.customerInfo.identities=identityArr?identityArr.sort().join(","):'';
                    model.customerInfo.mainMobile=res.mainMobile;
                },
                error: function() {

                }
            })

        }
    }

    function bindEvent() {
        jq_custdialog = $("#sidebar_customerdialog");
        jq_housedialog = $("#sidebar_housedialog");
        jq_draftdialog = $("#sidebar_draftdialog");
        jq_buildinglist = $("#sidebar_buildingList,#sidebar_housedialog");
        //关联房屋
        jq_buildinglist.on("click", ".li-arrow", function() {
                var that = $(this),
                    parent = that.parent(),
                    id = that.attr("data-housecode"), // houseCode
                    pid = that.attr("data-projectcode"); // projectCode
                // 房屋编码的优先级大于项目编码
                parent.toggleClass("active");
                if (that.hasClass("isloading")) {
                    getTaskByHouseCode_ajax(id, pid, that);
                }
            }).on("mouseover", "em", function() {
                var that = $(this),
                    id = that.attr("data-projectcode");
                if (that.hasClass("isloading")) {
                    getNotice_ajax(id, that);
                }
            }).on("dblclick", ".address", function() {
                var that = $(this);
                cloneAddress({
                    houseId: that.attr("data-houseid"),
                    houseCode: that.attr("data-housecode"),
                    houseName: that.attr("data-housename"),
                    projectCode: that.attr("data-projectcode"),
                    projectId: that.attr("data-projectid"),
                    projectName: that.attr("data-projectname"),

                });
                jq_housedialog.modal("hide");
            })
            //if (!SIMPLEMODEL) {
            // 点击子任务
        jq_buildinglist.on("click", ".subtask", function() {
            var that = $(this),
                taskId = that.attr("data-id"),
                taskNo = that.attr("data-no");
            jq_housedialog.modal("hide");
            if (!SIMPLEMODEL) {
                avalon.router.redirect("/contenttask/taskquery?islocal=" + (!taskNo) + "&id=" + (taskNo || taskId));
            } else {
                avalon.router.redirect("/contentnewtask/taskquery?islocal=" + (!taskNo) + "&id=" + (taskNo || taskId));
            }
            // IE8下如果不加这一句，会出现按列表逐个往上调用，Chrome下正常
            return false;
        });
        //}
        //客户列表
        $("#sidebar_relationList,#sidebar_customerdialog").on("mouseover", "em", function() {
            var that = $(this),
                customerId = that.parent().attr("data-id");
            if (that.hasClass("isloading")) {
                getHobbies_ajax(customerId, that);
                getSpecial_ajax(customerId, that);
            }

        }).on("dblclick", ".rela-name", function() {
            var li = $(this).parent().parent(),
                customerId = li.attr("data-id"),
                customerName = li.attr("data-name")
            var hasApprove = $(this).next(".rela-v").length > 0 ? true : false;
            cloneCustomer(customerId, customerName, hasApprove);
            jq_custdialog.modal("hide");
        });
        //任务草稿
        if (!SIMPLEMODEL) {
            $("#sidebar_draftList").on("click", "a", function() {
                var id = $(this).attr("data-id");
                Common.each(Data["draftList"], function(item, i) {
                    if (item.id == id) {
                        taskinput.active();
                        taskinput.draftBarList.add(item, {
                            id: item["id"],
                            createTime: item["createTime"]
                        });

                        jq_draftdialog.modal("hide");
                        return;
                    }
                });
            }).on("click", ".j_delete", function() {
                var that = $(this),
                    li = that.parent(),
                    id = that.attr("data-id");
                if (li.hasClass("del")) {
                    return;
                }
                if (window.confirm("确定删除？")) {
                    //li.addClass("del");
                    if (id) {
                        ajaxDeleteDraft(id, li);
                    }
                }
            });
        }
        // 任务更多草稿
        if (!SIMPLEMODEL) {
            $("#sidebar_draftdialog").on("click", "a", function() {
                var id = $(this).attr("data-id");
                Common.each(Data["draftDialogList"], function(item, i) {
                    if (item.id == id) {
                        taskinput.active();
                        taskinput.draftBarList.add(item, {
                            id: item["id"],
                            createTime: item["createTime"]
                        })
                        jq_draftdialog.modal("hide");
                        return;
                    }
                })
            }).on("click", ".j_delete", function() {
                var that = $(this),
                    li = that.parent(),
                    id = that.attr("data-id");
                if (li.hasClass("del")) {
                    return;
                }
                if (window.confirm("确定删除？")) {
                    //li.addClass("del");
                    if (id) {
                        ajaxDeleteDraft(id, li, true);
                    }
                }
            });
        }
        // 更多通话记录

        $("#sidebar_callList_more").on("click", function() {
            if (curCallNumber) {
                avalon.vmodels.contenttask.sidebarVisible = false;
                avalon.router.navigate("/contenttask/taskcall?callNumber=" + curCallNumber);
                // taskcall.active();
                // taskcall.search({
                // callNumber: curCallNumber
                // })
            }
        });
        //通话记录
        $("#sidebar_callList").on("mouseover", "em", function() {
            var that = $(this),
                isloading = that.hasClass("isloading"),
                callId = that.parent().attr("data-id");
            if (isloading) {
                getReason_ajax(callId, that)
            }
        });
        /*.on("click", ".listlink", function() {
         var that = $(this),
         callId = that.attr("data-callid"),
         callNumber = that.attr("data-callnumber")

         avalon.vmodels.contenttask.sidebarVisible = false;
         taskcall.active();
         taskcall.search({
         tapeCode: callId,
         callNumber: callNumber

         })
         })*/
        page_customer = new Pagination({
            selector: "#sidebar_custpager",
            onchange: function(pageInfo) {
                getCustomer_ajax(true, pageInfo.curpage, true);
            }
        });
        page_house = new Pagination({
            selector: "#sidebar_housepager",
            onchange: function(pageInfo) {
                getBuilding_ajax(true, pageInfo.curpage)
            }
        });
        page_draft = new Pagination({
            selector: "#sidebar_draftpager",
            onchange: function(pageInfo) {
                getDraft_ajax(true, pageInfo.curpage)
            }
        });
    }

    function init() {
        if (hasInit) {
            return;
        }
        hasInit = true;
        avalon.scan(null, model);
        bindEvent();
        getDraft_ajax();
    }

    function active(callId, callNumber) {
        init();
        if (callId && callNumber) {
            isNewTask = true;
            curCallId = callId;
            curCallNumber = callNumber;
            getInfo();

        }

    }

    Common.event.add("taskinput_tasksave", function() {
        getDraft_ajax();
        getDraft_ajax(true);
    })

    function getInfo() {
        getCustomer_ajax();
        getBuilding_ajax();
        getCallRecord_ajax();
    }

    // 事件 阻止请求
    function abortGetInfo() {
        // loading
        model["relationListLoading"] = false;
        model["buildingListLoading"] = false;
        model["callListLoading"] = false;
        // handle
        getCustomer_handle && getCustomer_handle.abort();
        getBuilding_handle && getBuilding_handle.abort();
        getCallRecord_handle && getCallRecord_handle.abort();
        // model
        model["relationList"] = [];
        model["buildingList"] = [];
        model["callList"] = [];
        custModel["relationList"] = [];
        houseModel["buildingList"] = [];
    }

    // 事件 注销
    function eventLogout() {
        // loading
        model["relationListLoading"] = false;
        model["buildingListLoading"] = false;
        model["callListLoading"] = false;
        model["draftListLoading"] = false;
        // handle
        getCustomer_handle && getCustomer_handle.abort();
        getBuilding_handle && getBuilding_handle.abort();
        getCallRecord_handle && getCallRecord_handle.abort();
        getDraft_handle && getDraft_handle.abort();
        // model
        model["relationList"] = [];
        model["buildingList"] = [];
        model["callList"] = [];
        model["draftList"] = [];
        custModel["relationList"] = [];
        houseModel["buildingList"] = [];
    }

    /* callevent */
    if (!SIMPLEMODEL) {

        SoftPhone.addEventListener("EvtDidLogin", function() {
            // getDraft_ajax();
        })
        SoftPhone.addEventListener("EvtDidAlerting", function(strEvtMsg, param, eventQueue, callType) {
            // 振铃
        });
        SoftPhone.addEventListener("EvtScreenPopDataArrival", function(strEvtMsg, param, eventQueue, callType) {
            // 弹屏
            // console.log(eventQueue[eventQueue.length-1])
            if (callType == 1) {
                // callType ==1; 呼入
                abortGetInfo();
                curCallId = param["callid"] || param["callId"];
                curCallNumber = param["otherDN"];
                getInfo(curCallNumber);
            }
            //呼出
            if (callType == 2) {

            }
        });

        SoftPhone.addEventListener("EvtDidWrapup", function(strEvtMsg, param, eventQueue, callType) {
            // 话后处理
        });
        SoftPhone.addEventListener("EvtDidDial", function(strEvtMsg, param, eventQueue, callType) {
            // 呼出
        });
        SoftPhone.addEventListener("EvtDidLogout", function() {
            // 注销
            eventLogout();
        })
    }

    return {
        active: active,
        model: model

    }
});
