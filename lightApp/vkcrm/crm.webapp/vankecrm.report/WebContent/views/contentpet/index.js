define(["text!views/contentpet/index.html"], function(modelHtml) {
         var hasInit = false; 
      var vmpet = avalon.define({
        $id: "pet", 
          // 当前页码
        curPage: 1, 
        pageSize: 10, 
        totalSize: 0,
        form: { 
           adoptTimeStart: "",//领养时间开始
           adoptTimeEnd: ""//领养时间结束
        },
         // 列表数据
        data: {
            isLoading: true,
            isError: false,
            list: []
        },
       // 参数配置
        options: {
            // 管理中心 
            organization: {
                id: "",
                text: "==请选择==",
                defaultText: "==请选择==",
                list: [],
                levelRel: ["project", "grid", "building", "house"],
                nextStep: ["getProject"],
                rootOption: true
            },
              // 房屋状态
            houseStatus: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: [],
                nextStep: [],
                rootOption: false
            }, 
                // 证件类型
            certificateType: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: [],
                nextStep: [],
                rootOption: false
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
                text: "==请选择==",
                defaultText: "==请选择==",
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
                text: "==请选择==",
                defaultText: "==请选择==",
                list: [],
                levelRel: ["house"],
                nextStep: ["getHouse"],
                rootOption: false
            },
            // 房屋
            house: {
                id: "",
                text: "==请选择==",
                defaultText: "==请选择==",
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
            vmpet.curPage = 1;
            cus_data_helper.getTaskReportData();
        },
        // 重置
        reset_event: function(e) {
            // 查询时间段
            $('.Wdate').val('');
            var _now = new Date() - 0;
            var _last_month = _now - 30 * 24 * 60 * 60 * 1000;
            vmpet.form.adoptTimeStart = Common.formatDate(_last_month, 'yyyy-MM-dd');
            vmpet.form.adoptTimeEnd = Common.formatDate(_now, 'yyyy-MM-dd');
            vmpet.curPage = 1;
            vmpet.pageSize = 10;
    $("#fullName").val('');
            $("#certificateId").val('');
              $("#mainMobile").val('');
            $("#licenseNumber").val('');
           
            for (var key in vmpet.options) {
                if (vmpet.options.hasOwnProperty(key)) {
                    vmpet.options[key].text = '全部'; //把options里面的id属性设为空
                         vmpet.options[key].id = ''; //把options里面的id属性设为空
                    // if (!vmcustomer.options[key].rootOption) {
                    //     vmcustomer.options[key].list = []; //把options里面的list属性设为空
                    // }
                    vmpet.options[key].text = vmpet.options[key].defaultText;
                }
            }
        },
        // 导出
        export_event: function() {
            var _this = $(this);
            var exportUrl = Config["petAjaxUrl"].getpetInfoExport +"?&mcId=" + vmpet.options.organization.id + "&projectId=" + vmpet.options.project.id + "&gridId=" + vmpet.options.grid.id + "&buildingCode=" + vmpet.options.building.id + "&houseId=" + vmpet.options.house.id + "&certificateType=" + vmpet.options.certificateType.id +"&houseStatus=" + vmpet.options.houseStatus.id +
                "&adoptTimeStart=" + vmpet.form.adoptTimeStart +
                "&adoptTimeEnd=" + vmpet.form.adoptTimeEnd +
                "&certificateId=" + $("#certificateId").val() + 
                "&fullName=" + $("#fullName").val() + 
                "&mainMobile=" + $("#mainMobile").val() + 
                "&access_token=" + Common.cookie('access_token');
            location.href=exportUrl;
            //$('.export-link').attr('src', exportUrl);

        },
          // 关闭控制面板
        close: function() {
            vmpet.choosePlane_vis = false;
        },
        // 清除选择面板
        cleanCurOptions: function() {
            var _this = $(this);
            var targetName = _this.attr('target');
            if (!vmpet.options[targetName]) return;
            var levelRel = vmpet.options[targetName].levelRel;
            for (var i = 0; i < levelRel.length; i++) {
                vmpet.options[levelRel[i]].id = "";
                vmpet.options[levelRel[i]].text = vmpet.options[levelRel[i]].defaultText;
                vmpet.options[levelRel[i]].list = [];
            }
            vmpet.options[targetName].id = "";
            vmpet.options[targetName].text = vmpet.options[targetName].defaultText;
            vmpet.choosePlane_vis = false;
        },

        cleanRelOptions: function(targetName) {
            if (!vmpet.options[targetName]) return;
            var levelRel = vmpet.options[targetName].levelRel;
            for (var i = 0; i < levelRel.length; i++) {
                vmpet.options[levelRel[i]].id = "";
                if (!vmpet.options[levelRel[i]].rootOption) {
                    vmpet.options[levelRel[i]].list = [];
                }
                vmpet.options[levelRel[i]].text = vmpet.options[levelRel[i]].defaultText;
            }
            vmpet.choosePlane_vis = false;
        },
           // 选择面板控制
           choosePlaneControl: function() {
            var _this = $(this);
            if (vmpet.choosePlane_vis) {
                vmpet.choosePlane_vis = false;
            } else {
                var targetName = _this.attr('target')
                vmpet.curTarget = targetName;
                vmpet.curPlaneList = vmpet.options[targetName].list;

                var _input = _this.parents('.pagecontent').find('input[name="' + targetName + '"]');
                var top = _input.offset().top;
                var left = _input.offset().left;

                _this.parents('.pagecontent').find('.choose').css({
                    "top": (top - 30) + 'px',
                    "left": (left - 270) + 'px'
                });
                vmpet.choosePlane_vis = true;
            }

           }
});
 /* 获取数据类  列表|管理中心|项目|网格 */
    var cusup_pageInfo = null;
    var cus_data_helper = { 
    // // 证件类型
    //     getcertificateType: function() {
    //         Common.ajax({
    //             url: Config["petAjaxUrl"].getcertificateType,
    //             type: "GET",
    //             success: function(data) {
    //                 vmcustomer.options.certificateType.list = data;
    //             },
    //             error: function() {},
    //             complete: function() {}
    //         });
    //     },
        //      // 获取房屋状态
        // getHouseStatus: function() {
        //     Common.ajax({
        //         url: Config["petAjaxUrl"].getHouseStatus,
        //         type: "GET",
        //         success: function(data) {
        //             vmcustomer.options.HouseStatus.list = data;
        //         },
        //         error: function() {},
        //         complete: function() {}
        //     });
        // },
        // 获取管理中心
        getOrganization: function() {
            Common.ajax({
                url: Config["petAjaxUrl"].getOrganization,
                type: "GET",
                success: function(data) {
                    vmpet.options.organization.list = data;
                },
                error: function() {},
                complete: function() {}
            });
        },

        //获取字典(城市,来源)
        getDictionary: function() {
            Common.ajax({
                url: Config["petAjaxUrl"].getDictionary,
                type: "POST",
                data: { 
                    codes: "HouseStatus,CustomerCertificateType"
                },
                success: function(data) {
                    vmpet.options.houseStatus.text = vmpet.options.houseStatus .defaultText;
                    vmpet.options.certificateType.text = vmpet.options.certificateType.defaultText;
     
                    vmpet.options.houseStatus.list = formatDictionary(data.HouseStatus);
                    vmpet.options.certificateType.list = formatDictionary(data.CustomerCertificateType);
    
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 获取项目
        getProject: function() {
            vmpet.options.project.text = vmpet.loadOptionsTip;
            if (vmpet.options.organization.id == '' && vmpet.options.city.id == '') return;
            Common.ajax({
                url: Config["petAjaxUrl"].getProject,
                type: "GET",
                data: {
                    parentId: vmpet.options.organization.id,
                    cityCode: vmpet.options.city.id
                },
                success: function(data) {
                    vmpet.options.project.text = vmpet.options.project.defaultText;
                    vmpet.options.project.list = data;
                }, 
                error: function() {
                    vmpet.options.project.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取网格by项目
        getGrid: function() {
            // vmpet.options.grid.text = vmpet.loadOptionsTip;
            if (vmpet.options.project.id == '') return;
            Common.ajax({
                url: Config["petAjaxUrl"].getGrid,
                type: "GET",
                data: {
                    projectId: vmpet.options.project.id
                },
                success: function(data) {
                    // vmpet.options.grid.text = vmpet.options.grid.defaultText;
                    vmpet.options.grid.list = data;
                },
                error: function() {
                    // vmpet.options.grid.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取楼栋by项目
        getBuilding: function() {
            vmpet.options.building.text = vmpet.loadOptionsTip;
            if (vmpet.options.project.id == '') return;
            var ajaxUrl = restURLParse(Config["petAjaxUrl"].getBuilding, [{
                key: '{projectId}',
                val: vmpet.options.project.id
            }]);
            Common.ajax({
                url: ajaxUrl,
                type: "GET",
                success: function(data) {
                    vmpet.options.building.text = vmpet.options.building.defaultText;
                    vmpet.options.building.list = data;
                },
                error: function() {
                    vmpet.options.building.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取房屋by项目
        getHouse: function() {
            vmpet.options.house.text = vmpet.loadOptionsTip;
            if (vmpet.options.building.id == '') return;
            Common.ajax({
                url: Config["petAjaxUrl"].getHouse,
                type: "GET",
                data: {
                    buildingId: vmpet.options.building.id
                },
                success: function(data) {
                    vmpet.options.house.text = vmpet.options.house.defaultText;
                    vmpet.options.house.list = data;
                },
                error: function() {
                    vmpet.options.house.text = '选项获取失败';
                },
                complete: function() {}
            });
        },
 // 获取列表数据
        getTaskReportData: function() {
            vmpet.hasBeenSubmitted = true;
            vmpet.data.isError = false;
            if (!vmpet.curPage) {
                vmpet.curPage = 1;
            }
            if (vmpet.curPage < 1) return;
            vmpet.data.isLoading = true;
            Common.ajax({
                url: Config["petAjaxUrl"].petInfoReport,
                type: "GET",
                cache: false,
                data: {
                    curPage: vmpet.curPage,
                    pageSize: vmpet.pageSize,
                    mcId: vmpet.options.organization.id,
                    projectId: vmpet.options.project.id,
                    gridId: vmpet.options.grid.id,
                    buildingCode: vmpet.options.building.id,
                    houseId: vmpet.options.house.id,
                    houseStatus: vmpet.options.houseStatus.id,
                    certificateType: vmpet.options.certificateType.id,
                    certificateId: $("#certificateId").val(),//证件号码
                    fullName: $("#fullName").val(),//客户姓名
                    mainMobile: $("#mainMobile").val(),//主用手机
                    adoptTimeStart: vmpet.form.adoptTimeStart,//领养时间开始
                    adoptTimeEnd: vmpet.form.adoptTimeEnd//领养时间结束
                },
                success: function(data) {
                    vmpet.data.isLoading = false;

                    vmpet.data.list = data.list;

                    if (!vmpet.paginationLoad) {
                        vmpet.paginationLoad = true;
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
                    vmpet.totalSize = tlpinfo.totalSize;
                },
                error: function() {
                    vmpet.data.isLoading = false;
                    vmpet.data.isError = true;
                },
                complete: function() {}
            });
        },

        // 设置分页信息
        bindPageInfo: function() {
            cusup_pageInfo = new Pagination({
                selector: "#pagination",
                onchange: function(pageInfo) {
                    vmpet.curPage = pageInfo.curpage;
                    cus_data_helper.getTaskReportData();
                }
            });
        },

        // 绑定事件
        bindEvent: function() {
            // 选择管理中心
            $('#src_'+vmpet.$id).find('.choose').on("click", 'li',
            function() {
                var text = $(this).attr('data-text'),
                code = $(this).attr('data-id');
                if (!code || !vmpet.curTarget) return;
                vmpet.options[vmpet.curTarget].text = text;
                vmpet.options[vmpet.curTarget].id = code;

                // 清空关联项
                vmpet.cleanRelOptions(vmpet.curTarget);
                // 隐藏当前选择区域
                vmpet.choosePlane_vis = false;
                // 获取下一步选项
                var nextStep = vmpet.options[vmpet.curTarget].nextStep || "";
                if (nextStep && nextStep.length > 0) {
                    for (var i = 0; i < nextStep.length; i++) {
                        cus_data_helper[nextStep[i]]();
                    }
                }
            });
        },
    }

    /* 初始化 */
    function init() {
        $('.choose').hide();
        vmpet.choosePlane_vis = false;
        if (hasInit) {
            return;
        }
        hasInit = true;
         var _now = new Date() - 0;
        var _last_month = _now - 30 * 24 * 60 * 60 * 1000;
         vmpet.form.adoptTimeStart = vmpet.form.adoptTimeStart || Common.formatDate(_last_month, 'yyyy-MM-dd');
        vmpet.form.adoptTimeEnd = vmpet.form.adoptTimeEnd || Common.formatDate(_now, 'yyyy-MM-dd');
        /* 模版缓存 */
        avalon.templateCache["contentpet"] = modelHtml;
        // avalon.vmodels["root"].src_contentprjdetail = "contentprjdetail";
        cus_data_helper.bindPageInfo();

        setTimeout(function() {
            // 加载管理中心
            cus_data_helper.getOrganization();
            // 加载字典(城市|来源)
            cus_data_helper.getDictionary();
            // 选择管理中心
            cus_data_helper.bindEvent();
        },
        500);
    }

    /* 清除表单 */
    function clearData(data) {
        var d = data || {},
        m = vmpet.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmpet.form[i] = d[i];
            } else {
                vmpet.form[i] = null;
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
        avalon.vmodels.root.visibleIndex = 'pet';
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

    function fetchData(keyArr, mapArr, data) {
        var result = [];
        if (keyArr.length != mapArr.length) return result;
        for (var i = 0; i < data.length; i++) {
            var item = {};
            for (var j = 0; j < mapArr.length; j++) {
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