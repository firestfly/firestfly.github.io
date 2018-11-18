define(["text!views/contentcustomer/index.html"], function(modelHtml) {
      
        // /* 模版缓存 */
        // avalon.templateCache["contentcustomer"] = modelHtml;
        // avalon.vmodels["root"].src_contentcustomer = "contentcustomer";
         var hasInit = false;
      var vmcustomer = avalon.define({
        $id: "customer",
          // 当前页码 
        curPage: 1,
        pageSize: 10, 
        totalSize: 0,
        form: {
            birthday: "", //生日日期
            startDeliversTime: "",//交付开始
            endDeliverTime: "",//交付结束
            checkInTimeStart: "",//入住时间开始
            checkInTimeEnd: ""//入住时间结束
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
                list: [],
                text: "==请选择==",
                defaultText: "==请选择==",
                levelRel: ["project", "grid", "building", "house"],
                nextStep: ["getProject"],
                rootOption: true
            },
            // 城市
            city: {
                id: "",
                //text: "全部",
                //defaultText: "全部",
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
            // 客房关系
            houseCustomerRelationType: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: [],
                nextStep: [],
                rootOption: false
            },
            // 客户类型
            customerType: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: [],
                nextStep: [],
                rootOption: false
            },
            // 客户归属
            customerAffilication: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: [],
                nextStep: [],
                rootOption: false
            },
            // 年龄类型
            uerReportAgeTP: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: [],
                nextStep: [],
                rootOption: false
            },
            // 证件类型
            customerCertificateType: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: [],
                nextStep: [],
                rootOption: false
            },
            // 是否二手房
            isSecanHand: {
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
            vmcustomer.curPage = 1;
            cus_data_helper.getTaskReportData();
            //if(document.getElementById('organization').value=='==请选择==')
            //{
            //    $(".btn").attr("disabled", "true");
            //    $("#organization").css("background-color","red");//背景颜色设为红色
            //
            //    document.fullName('organization').focus();
            //    return false;
            //}
        },
        // 重置
        reset_event: function(e) {
            // 查询时间段
            $('.Wdate').val('');
             var _now = new Date() - 0;
            var _last_month = _now - 30 * 24 * 60 * 60 * 1000;
            var _now = new Date() - 0;
            var _last_month = _now - 30 * 24 * 60 * 60 * 1000;
            vmcustomer.form.startDeliversTime = Common.formatDate(_last_month, 'yyyy-MM-dd');
            vmcustomer.form.endDeliverTime = Common.formatDate(_now, 'yyyy-MM-dd');
            vmcustomer.form.checkInTimeStart = Common.formatDate(_last_month, 'yyyy-MM-dd');
            vmcustomer.form.checkInTimeEnd = Common.formatDate(_now, 'yyyy-MM-dd');
            vmcustomer.form.birthday = ''; //把form里面的属性设为空
            // 创建人
            vmcustomer.curPage = 1;
            vmcustomer.pageSize = 10;
 
            for (var key in vmcustomer.options) {
                if (vmcustomer.options.hasOwnProperty(key)) {
                    vmcustomer.options[key].text = '全部'; //把options里面的id属性设为空
                         vmcustomer.options[key].id = ''; //把options里面的id属性设为空
                    // if (!vmcustomer.options[key].rootOption) {
                    //     vmcustomer.options[key].list = []; //把options里面的list属性设为空
                    // }
                    vmcustomer.options[key].text = vmcustomer.options[key].defaultText;
                }
            }
        }, 
        // 导出 
        export_event: function() { 
            var _this = $(this);
            var exportUrl = Config["cusAjaxUrl"].getUserReportExport + "?birthday=" + vmcustomer.form.birthday + "&startDeliversTime=" + vmcustomer.form.startDeliversTime + "&endDeliverTime=" + vmcustomer.form.endDeliverTime + "&checkInTimeStart=" +vmcustomer.form.checkInTimeStart + "&checkInTimeEnd=" +vmcustomer.form.checkInTimeEnd + "&cityCode=" + vmcustomer.options.city.id + "&mcId=" + vmcustomer.options.organization.id + "&projectId=" + vmcustomer.options.project.id + "&gridId=" + vmcustomer.options.grid.id + "&buildingCode=" + vmcustomer.options.building.id + "&houseId=" + vmcustomer.options.house.id + "&houseStatus=" + vmcustomer.options.houseStatus.id + "&houseCustomerRelationType=" + vmcustomer.options.houseCustomerRelationType.id + "&customerType=" + vmcustomer.options.customerType.id + "&customerAffilication=" + vmcustomer.options.customerAffilication .id + "&uerReportAgeTP=" + vmcustomer.options.uerReportAgeTP.id + "&customerCertificateType=" + vmcustomer.options.customerCertificateType.id + "&isSecanHand=" + vmcustomer.options.isSecanHand.id +
                "&certificateId=" + $("#certificateId").val() + 
                "&fullName=" + $("#fullName").val() + 
                "&mainMobile=" + $("#mainMobile").val() + 
                "&access_token=" + Common.cookie('access_token');
                // console.log(exportUrl)
            location.href=exportUrl;
            //$('.export-link').attr('src', exportUrl);
        },
          // 关闭控制面板
        close: function() {
            vmcustomer.choosePlane_vis = false;
        },
        // 清除选择面板
        cleanCurOptions: function() {
            var _this = $(this);
            var targetName = _this.attr('target');
            if (!vmcustomer.options[targetName]) return;
            var levelRel = vmcustomer.options[targetName].levelRel;
            for (var i = 0; i < levelRel.length; i++) {
                vmcustomer.options[levelRel[i]].id = "";
                vmcustomer.options[levelRel[i]].text = vmcustomer.options[levelRel[i]].defaultText;
                vmcustomer.options[levelRel[i]].list = [];
            }
            vmcustomer.options[targetName].id = "";
            vmcustomer.options[targetName].text = vmcustomer.options[targetName].defaultText;
            vmcustomer.choosePlane_vis = false;
        },
        cleanRelOptions: function(targetName) {
            if (!vmcustomer.options[targetName]) return;
            var levelRel = vmcustomer.options[targetName].levelRel;
            for (var i = 0; i < levelRel.length; i++) {
                vmcustomer.options[levelRel[i]].id = "";
                if (!vmcustomer.options[levelRel[i]].rootOption) {
                    vmcustomer.options[levelRel[i]].list = [];
                }
                vmcustomer.options[levelRel[i]].text = vmcustomer.options[levelRel[i]].defaultText;
            }
            vmcustomer.choosePlane_vis = false;
        },
           // 选择面板控制
           choosePlaneControl: function() {
            var _this = $(this);
                if (vmcustomer.choosePlane_vis) {
                vmcustomer.choosePlane_vis = false;
            } else {
                var targetName = _this.attr('target')
                vmcustomer.curTarget = targetName;
                vmcustomer.curPlaneList = vmcustomer.options[targetName].list;

                var _input = _this.parents('.pagecontent').find('input[name="' + targetName + '"]');
                var top = _input.offset().top;
                var left = _input.offset().left;


                _this.parents('.pagecontent').find('.choose').css({
                    "top": (top - 30) + 'px',
                    "left": (left - 270) + 'px'
                });
                vmcustomer.choosePlane_vis = true;
            }
           }
});
 /* 获取数据类  列表|管理中心|项目|网格 */
    var cusup_pageInfo = null;
    var cus_data_helper = {
        // // 获取房屋状态
        // getHouseStatus: function() {
        //     Common.ajax({
        //         url: Config["cusAjaxUrl"].getHouseStatus,
        //         type: "GET",
        //         success: function(data) {
        //             vmcustomer.options.HouseStatus.list = data;
        //         },
        //         error: function() {},
        //         complete: function() {}
        //     });
        // },
        // // 获取客房关系
        // getHouseCustomerRelationType: function() {
        //     Common.ajax({
        //         url: Config["cusAjaxUrl"].getHouseCustomerRelationType,
        //         type: "GET",
        //         success: function(data) {
        //             vmcustomer.options.HouseCustomerRelationType.list = data;
        //         },
        //         error: function() {},
        //         complete: function() {}
        //     });
        // },
        // // 获取客户类型
        // getCustomerType: function() {
        //     Common.ajax({
        //         url: Config["cusAjaxUrl"].getCustomerType,
        //         type: "GET",
        //         success: function(data) {
        //             vmcustomer.options.CustomerType.list = data;
        //         },
        //         error: function() {},
        //         complete: function() {}
        //     });
        // },
        // // 获取客户归属
        // getCustomerAffilication : function() {
        //     Common.ajax({
        //         url: Config["cusAjaxUrl"].getCustomerAffilication ,
        //         type: "GET",
        //         success: function(data) {
        //             vmcustomer.options.CustomerAffilication.list = data;
        //         },
        //         error: function() {},
        //         complete: function() {}
        //     });
        // },
        // // 年龄类型
        // getUerReportAgeTP: function() {
        //     Common.ajax({
        //         url: Config["cusAjaxUrl"].getUerReportAgeTP,
        //         type: "GET",
        //         success: function(data) {
        //             vmcustomer.options.UerReportAgeTP.list = data;
        //         },
        //         error: function() {},
        //         complete: function() {}
        //     });
        // },
        // // 证件类型
        // getCustomerCertificateType: function() {
        //     Common.ajax({
        //         url: Config["cusAjaxUrl"].getCustomerCertificateType,
        //         type: "GET",
        //         success: function(data) {
        //             vmcustomer.options.CustomerCertificateType.list = data;
        //         },
        //         error: function() {},
        //         complete: function() {}
        //     });
        // },
        // // 是否二手房
        // getisSecanHand: function() {
        //     Common.ajax({
        //         url: Config["cusAjaxUrl"].getisSecanHand,
        //         type: "GET",
        //         success: function(data) {
        //             vmcustomer.options.isSecanHand.list = data;
        //         },
        //         error: function() {},
        //         complete: function() {}
        //     });
        // },
        // 获取管理中心
        getOrganization: function() {
            Common.ajax({
                url: Config["cusAjaxUrl"].getOrganization,
                type: "GET",
                success: function(data) {
                    vmcustomer.options.organization.list = data;
                },
                error: function() {},
                complete: function() {}
            });
        },

        //获取字典(城市,房屋状态)
        getDictionary: function() {
            Common.ajax({
                url: Config["cusAjaxUrl"].getDictionary,
                type: "POST",
                data: {
                    codes: "CityCode,HouseStatus,HouseCustomerRelationType,CustomerType,CustomerAffilication,CustomerCertificateType,UerReportAgeTP,isSecanHand"
                }, 
                success: function(data) {
                    vmcustomer.options.city.text = vmcustomer.options.city.defaultText;
                    vmcustomer.options.houseStatus.text = vmcustomer.options.houseStatus.defaultText;//房屋状态
                    vmcustomer.options.houseCustomerRelationType.text = vmcustomer.options.houseCustomerRelationType.defaultText;//客房关系
                    vmcustomer.options.customerType.text = vmcustomer.options.customerType.defaultText;//客户类型
                    vmcustomer.options.customerAffilication .text = vmcustomer.options.customerAffilication .defaultText;//客户类型
                    vmcustomer.options.customerCertificateType.text = vmcustomer.options.customerCertificateType.defaultText;//证件类型
                    vmcustomer.options.uerReportAgeTP.text = vmcustomer.options.uerReportAgeTP.defaultText;//年龄类型
                    vmcustomer.options.isSecanHand.text = vmcustomer.options.isSecanHand.defaultText;//是否二手房

                    vmcustomer.options.city.list = formatDictionary(data.CityCode);
                    vmcustomer.options.houseStatus.list = formatDictionary(data.HouseStatus);
                    vmcustomer.options.houseCustomerRelationType.list = formatDictionary(data.HouseCustomerRelationType);
                    vmcustomer.options.customerType.list = formatDictionary(data.CustomerType);
                    vmcustomer.options.customerAffilication.list = formatDictionary(data.CustomerAffilication);
                    vmcustomer.options.customerCertificateType.list = formatDictionary(data.CustomerCertificateType);
                    vmcustomer.options.uerReportAgeTP.list = formatDictionary(data.UerReportAgeTP);
                    vmcustomer.options.isSecanHand.list = formatDictionary(data.isSecanHand);
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 获取项目
        getProject: function() {
            vmcustomer.options.project.text = vmcustomer.loadOptionsTip;
            if (vmcustomer.options.organization.id == '' && vmcustomer.options.city.id == '') return;
            Common.ajax({
                url: Config["cusAjaxUrl"].getProject,
                type: "GET",
                data: {
                    parentId: vmcustomer.options.organization.id,
                    cityCode: vmcustomer.options.city.id
                },
                success: function(data) {
                    vmcustomer.options.project.text = vmcustomer.options.project.defaultText;
                    vmcustomer.options.project.list = data;
                }, 
                error: function() {
                    vmcustomer.options.project.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取网格by项目
        getGrid: function() {
            // vmcustomer.options.grid.text = vmcustomer.loadOptionsTip;
            if (vmcustomer.options.project.id == '') return;
            Common.ajax({
                url: Config["cusAjaxUrl"].getGrid,
                type: "GET",
                data: {
                    projectId: vmcustomer.options.project.id
                },
                success: function(data) {
                    // vmcustomer.options.grid.text = vmcustomer.options.grid.defaultText;
                    vmcustomer.options.grid.list = data;
                },
                error: function() {
                    // vmcustomer.options.grid.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取楼栋by项目
        getBuilding: function() {
            vmcustomer.options.building.text = vmcustomer.loadOptionsTip;
            if (vmcustomer.options.project.id == '') return;
            var ajaxUrl = restURLParse(Config["cusAjaxUrl"].getBuilding, [{
                key: '{projectId}',
                val: vmcustomer.options.project.id
            }]);
            Common.ajax({
                url: ajaxUrl,
                type: "GET",
                success: function(data) {
                    vmcustomer.options.building.text = vmcustomer.options.building.defaultText;
                    vmcustomer.options.building.list = data;
                },
                error: function() {
                    vmcustomer.options.building.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取房屋by项目
        getHouse: function() {
            vmcustomer.options.house.text = vmcustomer.loadOptionsTip;
            if (vmcustomer.options.building.id == '') return;
            Common.ajax({
                url: Config["cusAjaxUrl"].getHouse,
                type: "GET",
                data: {
                    buildingId: vmcustomer.options.building.id
                },
                success: function(data) {
                    vmcustomer.options.house.text = vmcustomer.options.house.defaultText;
                    vmcustomer.options.house.list = data;
                },
                error: function() {
                    vmcustomer.options.house.text = '选项获取失败';
                },
                complete: function() {}
            });
        },
 // 获取列表数据
        getTaskReportData: function() {
            vmcustomer.hasBeenSubmitted = true;
            vmcustomer.data.isError = false;
            if (!vmcustomer.curPage) {
                vmcustomer.curPage = 1;
            }
            if (vmcustomer.curPage < 1) return;
            vmcustomer.data.isLoading = true;
            Common.ajax({
                url: Config["cusAjaxUrl"].getuserInfolistReport,
                type: "POST",
                cache: false,
                data: {
                    curPage: vmcustomer.curPage,
                    pageSize: vmcustomer.pageSize,
                    birthday: vmcustomer.form.birthday,//生日
                    startDeliversTime: vmcustomer.form.startDeliversTime,//交付开始
                    endDeliverTime: vmcustomer.form.endDeliverTime,//交付结束
                    checkInTimeStart: vmcustomer.form.checkInTimeStart,//入住开始
                    checkInTimeEnd: vmcustomer.form.checkInTimeEnd,//入住结束
                    cityCode: vmcustomer.options.city.id,//城市
                    mcId: vmcustomer.options.organization.id,//管理中心 
                    projectId: vmcustomer.options.project.id,//项目   
                    gridId: vmcustomer.options.grid.id,//网格
                    buildingCode: vmcustomer.options.building.id,//楼栋
                    houseId: vmcustomer.options.house.id,//房屋
                    houseStatus: vmcustomer.options.houseStatus.id,//房屋状态
                    houseCustomerRelationType: vmcustomer.options.houseCustomerRelationType.id,//客房关系
                    customerType: vmcustomer.options.customerType.id,//客户类型
                    customerAffilication: vmcustomer.options.customerAffilication.id,//客户归属
                    uerReportAgeTP: vmcustomer.options.uerReportAgeTP.id,//年龄类型
                    customerCertificateType: vmcustomer.options.customerCertificateType.id,//证件类型
                    isSecanHand: vmcustomer.options.isSecanHand.id,//是否二手房
                    certificateId: $("#certificateId").val(),//证件号码
                    fullName: $("#fullName").val(),//客户姓名
                    mainMobile: $("#mainMobile").val()//主用手机
                },
                success: function(data) {
                    vmcustomer.data.isLoading = false;

                    vmcustomer.data.list = data.list;

                    if (!vmcustomer.paginationLoad) {
                        vmcustomer.paginationLoad = true;
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
                    vmcustomer.totalSize = tlpinfo.totalSize;
                },
                error: function() {
                    vmcustomer.data.isLoading = false;
                    vmcustomer.data.isError = true;
                },
                complete: function() {}
            });
        },

        // 设置分页信息
        bindPageInfo: function() {
            cusup_pageInfo = new Pagination({
                selector: "#pagination",
                onchange: function(pageInfo) {
                    vmcustomer.curPage = pageInfo.curpage;
                    cus_data_helper.getTaskReportData();
                }
            });
        },

        // 绑定事件
        bindEvent: function() {
            // 选择管理中心
            $('#src_'+vmcustomer.$id).find('.choose').on("click", 'li',
            function() {
                var text = $(this).attr('data-text'),
                code = $(this).attr('data-id');
                if (!code || !vmcustomer.curTarget) return;
                vmcustomer.options[vmcustomer.curTarget].text = text;
                vmcustomer.options[vmcustomer.curTarget].id = code;

                // 清空关联项
                vmcustomer.cleanRelOptions(vmcustomer.curTarget);
                // 隐藏当前选择区域
                vmcustomer.choosePlane_vis = false;
                // 获取下一步选项
                var nextStep = vmcustomer.options[vmcustomer.curTarget].nextStep || "";
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
        vmcustomer.choosePlane_vis = false;
        if (hasInit) {
            return;
        }
        hasInit = true;
        var _now = new Date() - 0;
        var _last_month = _now - 30 * 24 * 60 * 60 * 1000;
        vmcustomer.form.startDeliversTime = vmcustomer.form.startDeliversTime || Common.formatDate(_last_month, 'yyyy-MM-dd');
        vmcustomer.form.endDeliverTime = vmcustomer.form.endDeliverTime || Common.formatDate(_now, 'yyyy-MM-dd');
        vmcustomer.form.checkInTimeStart = vmcustomer.form.checkInTimeStart || Common.formatDate(_last_month, 'yyyy-MM-dd');
        vmcustomer.form.checkInTimeEnd = vmcustomer.form.checkInTimeEnd || Common.formatDate(_now, 'yyyy-MM-dd');

        /* 模版缓存 */
        avalon.templateCache["contentcustomer"] = modelHtml;
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
        m = vmcustomer.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmcustomer.form[i] = d[i];
            } else {
                vmcustomer.form[i] = null;
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
        avalon.vmodels.root.visibleIndex = 'customer';
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