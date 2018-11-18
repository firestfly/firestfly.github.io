define(["text!views/contentcar/index.html"], function(modelHtml) {
         var hasInit = false; 
      var vmcar = avalon.define({
        $id: "car", 
          // 当前页码
        curPage: 1,
        pageSize: 10, 
        totalSize: 0,
        form: {
            registerTimeStar: "",
            registerTimeEnd: ""
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
            status: {
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
            vmcar.curPage = 1;
            cus_data_helper.getTaskReportData();
        },
        // 重置
        reset_event: function(e) {
            // 查询时间段
            $('.Wdate').val('');
            var _now = new Date() - 0;
            var _last_month = _now - 30 * 24 * 60 * 60 * 1000;
            vmcar.form.registerTimeStar = Common.formatDate(_last_month, 'yyyy-MM-dd');
            vmcar.form.registerTimeEnd = Common.formatDate(_now, 'yyyy-MM-dd');
            $("#fullName").val('');
            $("#certificateId").val('');
              $("#mainMobile").val('');
            $("#licenseNumber").val('');
            // 创建人
            vmcar.curPage = 1;
            vmcar.pageSize = 10;

            for (var key in vmcar.options) {
                if (vmcar.options.hasOwnProperty(key)) {
                    vmcar.options[key].text = '全部'; //把options里面的id属性设为空
                         vmcar.options[key].id = ''; //把options里面的id属性设为空
                    // if (!vmcustomer.options[key].rootOption) {
                    //     vmcustomer.options[key].list = []; //把options里面的list属性设为空
                    // }
                    vmcar.options[key].text = vmcar.options[key].defaultText;
                }
            }
        },
        // 导出 
        export_event: function() {
            var _this = $(this);
            var exportUrl = Config["carAjaxUrl"].getcarInfoExport +"?&mcId=" + vmcar.options.organization.id + "&projectId=" + vmcar.options.project.id + "&registerTimeStar=" + vmcar.form.registerTimeStar + "&registerTimeEnd=" + vmcar.form.registerTimeEnd +  "&gridId=" + vmcar.options.grid.id + "&buildingCode=" + vmcar.options.building.id + "&houseId=" + vmcar.options.house.id + "&status=" + vmcar.options.status.id + "&certificateType=" + vmcar.options.certificateType.id +
                "&fullName=" + $("#fullName").val() + 
                "&mainMobile=" + $("#mainMobile").val() +
                "&licenseNumber=" + $("#licenseNumber").val() +
                "&certificateId=" + $("#certificateId").val() +  
                "&access_token=" + Common.cookie('access_token');
            location.href=exportUrl
            //$('.export-link').attr('src', exportUrl);

        },
        // 关闭控制面板
        close: function() {
            vmcar.choosePlane_vis = false;
        },
        // 清除选择面板
        cleanCurOptions: function() {
            var _this = $(this);
            var targetName = _this.attr('target');
            if (!vmcar.options[targetName]) return;
            var levelRel = vmcar.options[targetName].levelRel;
            for (var i = 0; i < levelRel.length; i++) {
                vmcar.options[levelRel[i]].id = "";
                vmcar.options[levelRel[i]].text = vmcar.options[levelRel[i]].defaultText;
                vmcar.options[levelRel[i]].list = [];
            }
            vmcar.options[targetName].id = "";
            vmcar.options[targetName].text = vmcar.options[targetName].defaultText;
            vmcar.choosePlane_vis = false;
        },

        cleanRelOptions: function(targetName) {
            if (!vmcar.options[targetName]) return;
            var levelRel = vmcar.options[targetName].levelRel;
            for (var i = 0; i < levelRel.length; i++) {
                vmcar.options[levelRel[i]].id = "";
                if (!vmcar.options[levelRel[i]].rootOption) {
                    vmcar.options[levelRel[i]].list = [];
                }
                vmcar.options[levelRel[i]].text = vmcar.options[levelRel[i]].defaultText;
            }
            vmcar.choosePlane_vis = false;
        },
           // 选择面板控制
           choosePlaneControl: function() {
            var _this = $(this);
if (vmcar.choosePlane_vis) {
                vmcar.choosePlane_vis = false;
            } else {
                var targetName = _this.attr('target')
                vmcar.curTarget = targetName;
                vmcar.curPlaneList = vmcar.options[targetName].list;

                var _input = _this.parents('.pagecontent').find('input[name="' + targetName + '"]');
                var top = _input.offset().top;
                var left = _input.offset().left;


                _this.parents('.pagecontent').find('.choose').css({
                    "top": (top - 30) + 'px',
                    "left": (left - 270) + 'px'
                });
                vmcar.choosePlane_vis = true;
            }

           }
});
 /* 获取数据类  列表|管理中心|项目|网格 */
    var cusup_pageInfo = null;
    var cus_data_helper = { 
    // // 证件类型
    //     getCustomerCertificateType: function() {
    //         Common.ajax({
    //             url: Config["cusAjaxUrl"].getCustomerCertificateType,
    //             type: "GET",
    //             success: function(data) {
    //                 vmcar.options.CustomerCertificateType.list = data;
    //             },
    //             error: function() {},
    //             complete: function() {}
    //         });
    //     },
        //      // 获取房屋状态
        // getHouseType: function() {
        //     Common.ajax({
        //         url: Config["cusAjaxUrl"].getHouseType,
        //         type: "GET",
        //         success: function(data) {
        //             vmcar.options.housetype.list = data;
        //         },
        //         error: function() {},
        //         complete: function() {}
        //     });
        // },
        // 获取管理中心
        getOrganization: function() {
            Common.ajax({
                url: Config["carAjaxUrl"].getOrganization,
                type: "GET",
                success: function(data) {
                    vmcar.options.organization.list = data;
                },
                error: function() {},
                complete: function() {}
            });
        },

        //获取字典(城市,来源)
        getDictionary: function() {
            Common.ajax({
                url: Config["carAjaxUrl"].getDictionary,
                type: "POST",
                data: {
                    codes: "HouseStatus,CustomerCertificateType"
                },
                success: function(data) {
                    vmcar.options.status.text = vmcar.options.status.defaultText;//房屋状态
                    vmcar.options.certificateType.text = vmcar.options.certificateType.defaultText;//证件类型

                    vmcar.options.status.list = formatDictionary(data.HouseStatus);
                        vmcar.options.certificateType.list = formatDictionary(data.CustomerCertificateType);
             
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 获取项目
        getProject: function() {
            vmcar.options.project.text = vmcar.loadOptionsTip;
            if (vmcar.options.organization.id == '' && vmcar.options.city.id == '') return;
            Common.ajax({
                url: Config["carAjaxUrl"].getProject,
                type: "GET",
                data: {
                    parentId: vmcar.options.organization.id,
                    cityCode: vmcar.options.city.id
                },
                success: function(data) {
                    vmcar.options.project.text = vmcar.options.project.defaultText;
                    vmcar.options.project.list = data;
                }, 
                error: function() {
                    vmcar.options.project.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取网格by项目
        getGrid: function() {
            // vmcar.options.grid.text = vmcar.loadOptionsTip;
            if (vmcar.options.project.id == '') return;
            Common.ajax({
                url: Config["carAjaxUrl"].getGrid,
                type: "GET",
                data: {
                    projectId: vmcar.options.project.id
                },
                success: function(data) {
                    // vmcar.options.grid.text = vmcar.options.grid.defaultText;
                    vmcar.options.grid.list = data;
                },
                error: function() {
                    // vmcar.options.grid.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取楼栋by项目
        getBuilding: function() {
            vmcar.options.building.text = vmcar.loadOptionsTip;
            if (vmcar.options.project.id == '') return;
            var ajaxUrl = restURLParse(Config["carAjaxUrl"].getBuilding, [{
                key: '{projectId}',
                val: vmcar.options.project.id
            }]);
            Common.ajax({
                url: ajaxUrl,
                type: "GET",
                success: function(data) {
                    vmcar.options.building.text = vmcar.options.building.defaultText;
                    vmcar.options.building.list = data;
                },
                error: function() {
                    vmcar.options.building.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取房屋by项目
        getHouse: function() {
            vmcar.options.house.text = vmcar.loadOptionsTip;
            if (vmcar.options.building.id == '') return;
            Common.ajax({
                url: Config["carAjaxUrl"].getHouse,
                type: "GET",
                data: {
                    buildingId: vmcar.options.building.id
                },
                success: function(data) {
                    vmcar.options.house.text = vmcar.options.house.defaultText;
                    vmcar.options.house.list = data;
                },
                error: function() {
                    vmcar.options.house.text = '选项获取失败';
                },
                complete: function() {}
            });
        },
 // 获取列表数据
        getTaskReportData: function() {
            vmcar.hasBeenSubmitted = true;
            vmcar.data.isError = false;
            if (!vmcar.curPage) {
                vmcar.curPage = 1;
            }
            if (vmcar.curPage < 1) return;
            vmcar.data.isLoading = true;
            Common.ajax({
                url: Config["carAjaxUrl"].carInfoReport,
                type: "GET",
                cache: false,
                data: {
                    curPage: vmcar.curPage,
                    pageSize: vmcar.pageSize,
                    mcId: vmcar.options.organization.id,
                    projectId: vmcar.options.project.id,
                    registerTimeStar: vmcar.form.registerTimeStar,
                    registerTimeEnd: vmcar.form.registerTimeEnd,
                    gridId: vmcar.options.grid.id,
                    buildingCode: vmcar.options.building.id,
                    houseId: vmcar.options.house.id,
                    status: vmcar.options.status.id,
                    certificateType: vmcar.options.certificateType.id,
                    fullName: $("#fullName").val(),//客户姓名
                    mainMobile: $("#mainMobile").val(),//主用手机
                    licenseNumber: $("#licenseNumber").val(),//车牌号
                    certificateId: $("#certificateId").val()//证件号码

                },
                success: function(data) {
                    vmcar.data.isLoading = false;

                    vmcar.data.list = data.list;

                    if (!vmcar.paginationLoad) {
                        vmcar.paginationLoad = true;
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
                    vmcar.totalSize = tlpinfo.totalSize;
                },
                error: function() {
                    vmcar.data.isLoading = false;
                    vmcar.data.isError = true;
                },
                complete: function() {}
            });
        },

        // 设置分页信息
        bindPageInfo: function() {
            cusup_pageInfo = new Pagination({
                selector: "#pagination",
                onchange: function(pageInfo) {
                    vmcar.curPage = pageInfo.curpage;
                    cus_data_helper.getTaskReportData();
                }
            });
        },

        // 绑定事件
        bindEvent: function() {
            // 选择管理中心
            $('#src_'+vmcar.$id).on("click", 'li',
            function() {
                var text = $(this).attr('data-text'),
                code = $(this).attr('data-id');
                if (!code || !vmcar.curTarget) return;
                vmcar.options[vmcar.curTarget].text = text;
                vmcar.options[vmcar.curTarget].id = code;

                // 清空关联项
                vmcar.cleanRelOptions(vmcar.curTarget);
                // 隐藏当前选择区域
                vmcar.choosePlane_vis = false;
                // 获取下一步选项
                var nextStep = vmcar.options[vmcar.curTarget].nextStep || "";
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
        vmcar.choosePlane_vis = false;
        if (hasInit) {
            return;
        }
        hasInit = true;
        var _now = new Date() - 0;
        var _last_month = _now - 30 * 24 * 60 * 60 * 1000;

        vmcar.form.registerTimeStar = vmcar.form.registerTimeStar || Common.formatDate(_last_month, 'yyyy-MM-dd');
        vmcar.form.registerTimeEnd = vmcar.form.registerTimeEnd || Common.formatDate(_now, 'yyyy-MM-dd');


        /* 模版缓存 */
        avalon.templateCache["contentcar"] = modelHtml;
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
        m = vmcar.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmcar.form[i] = d[i];
            } else {
                vmcar.form[i] = null;
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
        avalon.vmodels.root.visibleIndex = 'car';
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