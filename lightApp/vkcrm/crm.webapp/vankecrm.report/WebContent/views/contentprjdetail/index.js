define(["text!views/contentprjdetail/index.html"], function(modelHtml) {


    /* avalon */
    var hasInit = false;
    var vmprjdetail = avalon.define({
        $id: "prjdetail",
        // 当前页码
        curPage: 1,
        pageSize: 10,
        totalSize: 0,
        form: {
            // 查询时间段
            st_time: "",
            ed_time: "",
            // 任务类容
            task_content: ""
        },
        // 列表数据
        data: {
            isLoading: true,
            isError: false,
            list: []
        },
        // 参数配置
        options: {
            // 来源
            source: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: [],
                nextStep: [],
                rootOption: true
            },
            // 管理中心
            organization: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: ["project", "grid", "building", "house"],
                nextStep: ["getProject"],
                rootOption: true
            },
            // 城市
            city: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: ["organization", "project", "grid", "building", "house"],
                nextStep: ["getProject"],
                rootOption: true
            },
            // 项目
            project: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: ["grid", "building", "house"],
                nextStep: ["getBuilding", "getGrid"],
                rootOption: false
            },
            // 网格
            grid: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: ["building", "house"],
                nextStep: ["getBuilding"],
                rootOption: false
            },
            // 楼栋
            building: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: ["house"],
                nextStep: ["getHouse"],
                rootOption: false
            },
            // 房屋
            house: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: [],
                nextStep: [],
                rootOption: false
            }
        },
        loadOptionsTip: '正在获取...',
        curTarget: '',
        curPlaneList: [],
        hasBeenSubmitted: false,
        choosePlane_vis: false,
        paginationLoad: false,
        // 查询按钮事件
        search_event: function(e) {
            vmprjdetail.curPage = 1;
            cus_data_helper.getTaskReportData();
        },
        // 重置
        reset_event: function(e) {
            // 查询时间段
            $('.Wdate').val('');
            var _now = new Date() - 0;
            var _last_month = _now - 30 * 24 * 60 * 60 * 1000;
            vmprjdetail.form.st_time = Common.formatDate(_last_month, 'yyyy-MM-dd HH:mm:ss');
            vmprjdetail.form.ed_time = Common.formatDate(_now, 'yyyy-MM-dd HH:mm:ss');
            // 创建人
            vmprjdetail.curPage = 1;
            vmprjdetail.pageSize = 10;

            for (var key in vmprjdetail.options) {
                if (vmprjdetail.options.hasOwnProperty(key)) {
                    vmprjdetail.options[key].id = '';
                    if (!vmprjdetail.options[key].rootOption) {
                        vmprjdetail.options[key].list = [];
                    }
                    vmprjdetail.options[key].text = vmprjdetail.options[key].defaultText;
                }
            }
        },
        // 导出
        export_event: function() {
            var _this = $(this);

            var exportUrl = Config["newAjaxUrl"].getTaskReportExport + "?start=" + vmprjdetail.form.st_time + "&end=" + vmprjdetail.form.ed_time + "&source=" + vmprjdetail.options.source.id + "&cityCode=" + vmprjdetail.options.city.id + "&mcId=" + vmprjdetail.options.organization.id + "&projectId=" + vmprjdetail.options.project.id + "&gridId=" + vmprjdetail.options.grid.id + "&buildingCode=" + vmprjdetail.options.building.id + "&houseId=" + vmprjdetail.options.house.id + "&access_token=" + Common.cookie('access_token');

            $('#prjdetail_export').attr('src', exportUrl);

        },
        // 关闭控制面板
        close: function() {
            vmprjdetail.choosePlane_vis = false;
        },
        // 清除选择面板
        cleanCurOptions: function() {
            var _this = $(this);
            var targetName = _this.attr('target');
            if (!vmprjdetail.options[targetName]) return;
            var levelRel = vmprjdetail.options[targetName].levelRel;
            for (var i = 0; i < levelRel.length; i++) {
                vmprjdetail.options[levelRel[i]].id = "";
                vmprjdetail.options[levelRel[i]].text = vmprjdetail.options[levelRel[i]].defaultText;
                vmprjdetail.options[levelRel[i]].list = [];
            }
            vmprjdetail.options[targetName].id = "";
            vmprjdetail.options[targetName].text = vmprjdetail.options[targetName].defaultText;
            vmprjdetail.choosePlane_vis = false;
        },

        cleanRelOptions: function(targetName) {
            if (!vmprjdetail.options[targetName]) return;
            var levelRel = vmprjdetail.options[targetName].levelRel;
            for (var i = 0; i < levelRel.length; i++) {
                vmprjdetail.options[levelRel[i]].id = "";
                if (!vmprjdetail.options[levelRel[i]].rootOption) {
                    vmprjdetail.options[levelRel[i]].list = [];
                }
                vmprjdetail.options[levelRel[i]].text = vmprjdetail.options[levelRel[i]].defaultText;
            }
            vmprjdetail.choosePlane_vis = false;
        },

        // 选择面板控制
        choosePlaneControl: function() {
            var _this = $(this);

            if (vmprjdetail.choosePlane_vis) {
                vmprjdetail.choosePlane_vis = false;
            } else {
                var targetName = _this.attr('target')
                vmprjdetail.curTarget = targetName;
                vmprjdetail.curPlaneList = vmprjdetail.options[targetName].list;

                var _input = _this.parents('.pagecontent').find('input[name="' + targetName + '"]');
                var top = _input.offset().top;
                var left = _input.offset().left;

                _this.parents('.pagecontent').find('.choose').css({
                    "top": (top - 30) + 'px',
                    "left": (left - 270) + 'px'
                });

                vmprjdetail.choosePlane_vis = true;
            }

        }


    });

    /* 获取数据类  列表|管理中心|项目|网格 */
    var cusup_pageInfo = null;
    var cus_data_helper = {

        // 获取管理中心
        getOrganization: function() {
            Common.ajax({
                url: Config["newAjaxUrl"].getOrganization,
                type: "GET",
                success: function(data) {
                    vmprjdetail.options.organization.list = data;
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 获取字典(城市,来源)
        getDictionary: function() {
            Common.ajax({
                url: Config["newAjaxUrl"].getDictionary,
                type: "POST",
                data: {
                    codes: "CityCode,AppTaskSource"
                },
                success: function(data) {
                    vmprjdetail.options.city.text = vmprjdetail.options.city.defaultText;
                    vmprjdetail.options.source.text = vmprjdetail.options.source.defaultText;
                    vmprjdetail.options.city.list = formatDictionary(data.CityCode);
                    vmprjdetail.options.source.list = formatDictionary(data.AppTaskSource);
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 获取项目
        getProject: function() {
            vmprjdetail.options.project.text = vmprjdetail.loadOptionsTip;
            if (vmprjdetail.options.organization.id == '' && vmprjdetail.options.city.id == '') return;
            Common.ajax({
                url: Config["newAjaxUrl"].getProject,
                type: "GET",
                data: {
                    parentId: vmprjdetail.options.organization.id,
                    cityCode: vmprjdetail.options.city.id
                },
                success: function(data) {
                    vmprjdetail.options.project.text = vmprjdetail.options.project.defaultText;
                    vmprjdetail.options.project.list = data;
                },
                error: function() {
                    vmprjdetail.options.project.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取网格by项目
        getGrid: function() {
            // vmprjdetail.options.grid.text = vmprjdetail.loadOptionsTip;
            if (vmprjdetail.options.project.id == '') return;
            Common.ajax({
                url: Config["newAjaxUrl"].getGrid,
                type: "GET",
                data: {
                    projectId: vmprjdetail.options.project.id
                },
                success: function(data) {
                    // vmprjdetail.options.grid.text = vmprjdetail.options.grid.defaultText;
                    vmprjdetail.options.grid.list = data;
                },
                error: function() {
                    // vmprjdetail.options.grid.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取楼栋by项目
        getBuilding: function() {
            vmprjdetail.options.building.text = vmprjdetail.loadOptionsTip;
            if (vmprjdetail.options.project.id == '') return;
            var ajaxUrl = restURLParse(Config["newAjaxUrl"].getBuilding, [{
                key: '{projectId}',
                val: vmprjdetail.options.project.id
            }]);
            Common.ajax({
                url: ajaxUrl,
                type: "GET",
                success: function(data) {
                    vmprjdetail.options.building.text = vmprjdetail.options.building.defaultText;
                    vmprjdetail.options.building.list = data;
                },
                error: function() {
                    vmprjdetail.options.building.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取房屋by项目
        getHouse: function() {
            vmprjdetail.options.house.text = vmprjdetail.loadOptionsTip;
            if (vmprjdetail.options.building.id == '') return;
            Common.ajax({
                url: Config["newAjaxUrl"].getHouse,
                type: "GET",
                data: {
                    buildingId: vmprjdetail.options.building.id
                },
                success: function(data) {
                    vmprjdetail.options.house.text = vmprjdetail.options.house.defaultText;
                    vmprjdetail.options.house.list = data;
                },
                error: function() {
                    vmprjdetail.options.house.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取列表数据
        getTaskReportData: function() {
            vmprjdetail.hasBeenSubmitted = true;
            vmprjdetail.data.isError = false;
            if (!vmprjdetail.curPage) {
                vmprjdetail.curPage = 1;
            }
            if (vmprjdetail.curPage < 1) return;
            vmprjdetail.data.isLoading = true;
            Common.ajax({
                url: Config["newAjaxUrl"].getTaskReport,
                type: "GET",
                cache: false,
                data: {
                    curPage: vmprjdetail.curPage,
                    pageSize: vmprjdetail.pageSize,
                    start: vmprjdetail.form.st_time,
                    end: vmprjdetail.form.ed_time,
                    source: vmprjdetail.options.source.id,
                    cityCode: vmprjdetail.options.city.id,
                    mcId: vmprjdetail.options.organization.id,
                    projectId: vmprjdetail.options.project.id,
                    gridId: vmprjdetail.options.grid.id,
                    buildingCode: vmprjdetail.options.building.id,
                    houseId: vmprjdetail.options.house.id
                },
                success: function(data) {
                    vmprjdetail.data.isLoading = false;

                    vmprjdetail.data.list = data.list;

                    if (!vmprjdetail.paginationLoad) {
                        vmprjdetail.paginationLoad = true;
                        cus_data_helper.bindPageInfo();
                    }

                    /* 更新分页控件 */
                    var tlpinfo = data.pagination;
                    cusup_pageInfo.render({
                        curpage: tlpinfo.curPage,
                        pagesize: tlpinfo.pageSize,
                        totalpage: tlpinfo.totalPage,
                        totalsize: tlpinfo.totalSize
                    });
                    vmprjdetail.totalSize = tlpinfo.totalSize;
                },
                error: function() {
                    vmprjdetail.data.isLoading = false;
                    vmprjdetail.data.isError = true;
                },
                complete: function() {}
            });
        },

        // 设置分页信息
        bindPageInfo: function() {
            cusup_pageInfo = new Pagination({
                selector: "#pagination",
                onchange: function(pageInfo) {
                    vmprjdetail.curPage = pageInfo.curpage;
                    cus_data_helper.getTaskReportData();
                }
            });
        },

        // 绑定事件
        bindEvent: function() {
            // 选择管理中心
            $("#choosePlane").on("click", 'li', function() {
                var text = $(this).attr('data-text'),
                    code = $(this).attr('data-id');
                if (!code || !vmprjdetail.curTarget) return;
                vmprjdetail.options[vmprjdetail.curTarget].text = text;
                vmprjdetail.options[vmprjdetail.curTarget].id = code;

                // 清空关联项
                vmprjdetail.cleanRelOptions(vmprjdetail.curTarget);
                // 隐藏当前选择区域
                vmprjdetail.choosePlane_vis = false;
                // 获取下一步选项
                var nextStep = vmprjdetail.options[vmprjdetail.curTarget].nextStep || "";
                if (nextStep && nextStep.length > 0) {
                    for (var i = 0; i < nextStep.length; i++) {
                        cus_data_helper[nextStep[i]]();
                    }
                }
            });


            // 项目变更时事件
            // $("#project").on("change", function() {
            //     // 获取选择项目下的网格
            //     vmprjdetail.form.gridId = '';
            //     vmprjdetail.form.projectId = $(this).val();
            //     cus_data_helper.getGrid();
            // });

            // 浏览器大小改变事件
            /* window.onresize = function() {
                 cus_data_helper.resizeHeight();
             };*/
        },

        // 处理页面高度
        /*        resizeHeight: function() {
                    var page_h = $(window).height();
                    var obj = $('#custable');
                    var top_h = obj.offset().top;
                    obj.height(page_h - top_h - 55); // 55: 分页和页面间距的高度
                }*/
    }

    /* 初始化 */
    function init() {
        $('.choose').hide();
        vmprjdetail.choosePlane_vis = false;
        if (hasInit) {
            return;
        }
        hasInit = true;

        var _now = new Date() - 0;
        var _last_month = _now - 30 * 24 * 60 * 60 * 1000;

        vmprjdetail.form.st_time = vmprjdetail.form.st_time || Common.formatDate(_last_month, 'yyyy-MM-dd HH:mm:ss');
        vmprjdetail.form.ed_time = vmprjdetail.form.ed_time || Common.formatDate(_now, 'yyyy-MM-dd HH:mm:ss');

        /* 模版缓存 */
        avalon.templateCache["contentprjdetail"] = modelHtml;
        // avalon.vmodels["root"].src_contentprjdetail = "contentprjdetail";

        cus_data_helper.bindPageInfo();

        setTimeout(function() {
            // 加载管理中心
            cus_data_helper.getOrganization();
            // 加载字典(城市|来源)
            cus_data_helper.getDictionary();
            // 选择管理中心
            cus_data_helper.bindEvent();
        }, 500);
    }

    /* 清除表单 */
    function clearData(data) {
        var d = data || {},
            m = vmprjdetail.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmprjdetail.form[i] = d[i];
            } else {
                vmprjdetail.form[i] = null;
            }
        }
    }

    function restURLParse(url, map) {
        var result = url;
        for (var i = 0; i < map.length; i++) {
            result = result.replace(map[i].key, map[i].val);
        }
        return result;
    }

    /* active */
    function active() {
        init();
        avalon.vmodels.root.visibleIndex = 'prjdetail';
    }

    // 格式化字典
    function formatDictionary(data) {
        var len = data.length;
        var result = [];
        if (!len) return result;
        for (var i = 0; i < len; i++) {
            var tmp = {};
            tmp.id = data[i].code;
            tmp.name = data[i].value;
            result.push(tmp);
        }
        return result;
    }

    function fetchData(keyArr, mapArr, data){
      var result = [];
      if(keyArr.length != mapArr.length) return result;
      for(var i=0; i < data.length; i++){
        var item = {};
        for(var j=0; j < mapArr.length; j++){
          item[keyArr[j]] = data[mapArr[j]];
        }
        result.push(item);
      }
      return result;
    }


    return {
        active: active,
        clearData: clearData
    }
});
