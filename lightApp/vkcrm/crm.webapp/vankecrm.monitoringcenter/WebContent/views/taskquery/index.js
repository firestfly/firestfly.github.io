define([], function() {
    var hasInit = false,
        listCache = [],
        _projectName = '';
    var projectSelect;
    var model = avalon.define({
        $id: "taskquery",
        form: {
            fullName: "",
            mainMobile: "",
            licenseNumber: "",

            projectId: '', //项目ID
            projectName: '', //项目名称
            projectCode: '', //项目编码

            buildingId: '',
            buildingName: '',
            buildingCode: '', //楼栋编码

            houseId: '', //房屋ID
            houseName: '', //房屋名称
            houseCode: '' //房屋编码
        },
        list: [],
        listLoading: false,
        pagination: {
            totalSize: 0
        },
        projectOptions: {
            list: [],
            de: ''
        },
        project_auto: {
            list: [],
            loading: false,
            visible: false
        },
        building_auto: {
            list: [],
            loading: false,
            visible: false
        },
        house_auto: {
            list: [],
            loading: false,
            visible: false
        },
        autoinput: autoInput,
        eventQueryAuto: function(target) {
            $(this).prev(':text').focus();
            inputChange(target, model.form[target + "Name"], true);
            if (event) {
                event.stopPropagation && event.stopPropagation();
                event.preventDefault && event.preventDefault();
                event.cancelBubble = true;
                event.returnValue = false;
            }
        },
        // 查询
        eventQueryList: function() {
            getList_ajax(1);
        },
        // 重置
        eventReset: function() {
            model.form.projectName = "";
            model.form.projectCode = "";
            model.form.projectId = model.projectOptions.de;

            model.form.houseName = "";
            model.form.houseCode = "";
            model.form.houseId = "";

            model.form.buildingId = "";
            model.form.buildingCode = "";
            model.form.buildingName = "";

            model.form.fullName = "";
            model.form.mainMobile = "";
            model.form.licenseNumber = "";
            // 获取列表
            // getList_ajax(1);
        }
    });

    /*
     * autoinput
     */
    var curAutoOption = {
        project: null,
        building: null,
        house: null
    }
    var autoinput_exclude = /^(9|16|17|18|20|37|39)$/

    function autoInput(evt) {
        // 37 left
        // 38 up
        // 39 right
        // 40 down
        // 13 enter
        var target = this.getAttribute("data-target");
        if (evt.keyCode == 40 || evt.keyCode == 38) {

            var cur = curAutoOption[target],
                next = null,
                dirt = evt.keyCode == 40 ? "next" : "prev"

            if (cur) {
                next = cur[dirt]();

                if (next.length) {
                    curAutoOption[target] = next
                    cur.removeClass("on")
                    next.addClass("on");
                    // next[0]["scrollIntoView"]();
                }
            } else {
                curAutoOption[target] = jq_autoList[target].find("li:first");
                curAutoOption[target].addClass("on");
            }
            evt.preventDefault();
            evt.returnValue = false;
        } else if (evt.keyCode == 13) {
            if (!curAutoOption[target]) {
                curAutoOption[target] = jq_autoList[target].find("li:first");
                curAutoOption[target].addClass("on");
            }
            inputSelect(curAutoOption[target], target)
        } else if (autoinput_exclude.test(evt.keyCode)) {
            return;
        } else {
            inputChange(target, this.value)
        }
        return;
    }

    function inputSelect(dom, target) {
        var li = $(dom),
            id = li.attr("data-id"),
            code = li.attr("data-code"),
            text = li.attr("data-text")
        isClearDataLoop = true;
        model[target + "_auto"].visible = false;
        model.form[target + "Id"] = id;
        model.form[target + "Code"] = code;
        model.form[target + "Name"] = text;
        isClearDataLoop = false;
    }

    function inputChange(target, value, search) {
        var name = Common.trim(value || '');
        if (!search) {
            model.form[target + "Name"] = name;
            model.form[target + "Code"] = '';
            model.form[target + "Id"] = '';
        }
        if (!search && name === '') {
            model[target + "_auto"].visible = false;
            model[target + "_auto"].loading = false;
            return;
        }
        curAutoOption[target] = null;
        autofunc["get" + target + "_ajax"](name);
    }

    /*
     * 自动搜索项目房屋
     */
    var autofunc = {};

    // 楼栋搜索
    var getProject_handle = null;

    autofunc.getproject_ajax = function(projectName) {
        if (getProject_handle) {
            getProject_handle.abort();
        }
        model.project_auto.list = [];
        model.project_auto.visible = true;
        model.project_auto.loading = true;
        getProject_handle = Common.ajax({
            url: servicePath.house + "/v1/roleprojects",
            type: "GET",
            data: {
                projectName: projectName
            },
            success: function(res) {
                model.project_auto.list = res;
            },
            error: function() {

            },
            complete: function() {
                model.project_auto.loading = false;
            }
        })
    }

    // 楼栋搜索 
    var getBuilding_handle = null,
        getBuilding_result = {};

    function filterBuilding(res, name) {
        var i = 0,
            l = res.length,
            arr = [],
            str;
        for (i; i < l; i++) {
            var bname = res[i]["name"].toLowerCase();
            if (bname.indexOf(name.toLowerCase()) > -1) {
                arr.push(res[i]);
            }
        }
        return arr;
    }

    autofunc.getbuilding_ajax = function(buildName) {
            if (getBuilding_handle) {
                getBuilding_handle.abort();
            }
            var projectId = model.form.projectId;
            if (projectId == undefined || projectId == '')
                return;
            model.building_auto.list = [];
            model.building_auto.visible = true;
            model.building_auto.loading = true;
            if (getBuilding_result[projectId]) {
                var arr = filterBuilding(getBuilding_result[projectId], buildName);
                model.building_auto.list = arr;
                model.building_auto.loading = false;
                return;
            }
            getBuilding_handle = Common.ajax({
                url: servicePath.house + "/v1/project/" + projectId + "/buildings",
                type: "GET",
                data: {
                    buildName: buildName
                },
                success: function(res) {
                    getBuilding_result[projectId] = res;
                    var arr = filterBuilding(getBuilding_result[projectId], buildName);
                    model.building_auto.list = arr;
                },
                error: function() {

                },
                complete: function() {
                    model.building_auto.loading = false;
                }
            })
        }
        // 房屋搜索 
    var getHouse_handle = null;

    autofunc.gethouse_ajax = function(houseName) {
            if (getHouse_handle) {
                getHouse_handle.abort();
            }
            model.house_auto.visible = true;
            model.house_auto.loading = true;
            var projectId = model.form.projectId,
                buildingId = model.form.buildingId
            getHouse_handle = Common.ajax({
                url: servicePath.house + "/v1/project/" + projectId + "/" + buildingId + "/houses",
                type: "GET",
                data: {
                    houseName: houseName
                },
                success: function(res) {
                    model.house_auto.list = res;
                },
                error: function() {

                },
                complete: function() {
                    model.house_auto.loading = false;
                }
            })
        }
        /*
         * ajax
         */
        // 获取信息列表
    var getList_handle = null;

    function getList_ajax(pageIndex) {
        if (getList_handle) {
            getList_handle.abort();
        }
        pageIndex = pageIndex || 1;
        model.listLoading = true;
        //_projectName = projectSelect.find("option:selected").text();
        getList_handle = Common.ajax({
            url: servicePath.customer + "/v1/command/queryCustomer/" + pageIndex + "/10",
            type: "GET",
            data: {
                fullName: model.form["fullName"],
                mainMobile: model.form["mainMobile"],
                licenseNumber: model.form["licenseNumber"],
                projectCode: model.form["projectId"],
                houseId: model.form["houseId"],
                buildingCode: model.form["buildingId"]
            },
            success: function(res) {
                var pageinfo = res.pagination;
                model.pagination = pageinfo;
                model.list = res.list;
                listCache = res.list;
                pager.render({
                    curpage: pageinfo["curPage"] || 1,
                    pagesize: pageinfo["pageSize"] || 10,
                    totalpage: pageinfo["totalPage"] || 1,
                    totalsize: pageinfo["totalSize"] || 0
                })
                resize_list();
            },
            error: function() {},
            complete: function() {
                model.listLoading = false;
            }
        })

        /*Common.loading({
            container: '#taskquery',
            handle: getList_handle
        });*/
    }
    // 获取当前登录人所属项目
    var getProjectAjax_handle = null;

    function getProject_ajax() {
        getProjectAjax_handle = Common.ajax({
            url: servicePath.house + "/v1/roleprojects",
            type: "GET",
            success: function(res) {
                if (res == null || res.length == 0) {
                    Common.tip.add({
                        text: "当前用户下无项目",
                        type: "warning"
                    });
                    return;
                }
                // 列表查询项目
                model.form.projectCode = res[0]["code"];
                model.form.projectId = res[0]["id"];
                model.projectOptions.list = res;
                model.projectOptions.de = res[0]["id"];
                // 获取列表
                // getList_ajax(1);
            },
            error: function() {},
            complete: function() {}
        })

        /*Common.loading({
            container: '#taskquery',
            handle: getProjectAjax_handle
        });*/
    }
    // 处理页面高度
    function resize_list() {
        var page_h = $(window).height();
        var obj = $("#taskquery");
        if (obj.attr("class")) {
            var top_h = obj.offset().top;
            obj.height(page_h - top_h - 50); //50: 页面间距 & 分页
        }
    }

    // 窗口改变大小事件
    window.onresize = resize_list;

    // 
    var pager = null;

    function init() {
        if (hasInit) {
            return;
        }

        $("#sltPrj").on('change', function() {

            model.form.projectName = "";
            model.form.projectCode = "";

            model.form.houseName = "";
            model.form.houseCode = "";
            model.form.houseId = "";

            model.form.buildingId = "";
            model.form.buildingCode = "";
            model.form.buildingName = "";
        });

        hasInit = true;
        setTimeout(function() {
            getProject_ajax();
            avalon.scan(null, model);

            pager = new Pagination({
                selector: "#tab-taskquery #pagination",
                onchange: function(pageinfo) {
                    getList_ajax(pageinfo.curpage);
                }
            });
            pager.render({
                curpage: 1,
                pagesize: 1,
                totalpage: 1,
                totalsize: 1
            })
            bindEvent();
        })
    }

    function bindEvent() {

        $("#tab-taskquery .autocomplete").each(function() {
            var that = $(this);
            var target = that.attr("target");
            that.on("click", "li", function() {
                inputSelect(this, target);
            }).on("mouseenter", "li", function() {
                var li = $(this);
                li.addClass("on").siblings().removeClass("on");
                curAutoOption[target] = li;
            });

            $(document).on("click", function() {
                model[target + "_auto"].visible = false;
            })
        });
        $("#taskquery").on("click", "a", function() {
            var id = $(this).attr("data-id"),
                d, data;
            for (var i = 0; i < listCache.length; i++) {
                d = listCache[i];
                if (d.id == id) {
                    data = d;
                    break;
                }
            };
            if (data) {
                //data["projectName"] = _projectName;
                Common["cache"].set("taskqueryData", data);
                avalon.router.navigate("/contenttask/taskinput?from=taskquery");
            }
        });
    }

    function view(opts) {

    }

    function active(opts) {
        init(opts || {});
        view(opts || {});
    }


    return {
        active: active
    }
});