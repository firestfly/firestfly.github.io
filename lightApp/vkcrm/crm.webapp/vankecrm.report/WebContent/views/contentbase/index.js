define(["text!views/contentbase/index.html"], function(modelHtml) {
      
        // /* 模版缓存 */
        // avalon.templateCache["contentcustomer"] = modelHtml;
        // avalon.vmodels["root"].src_contentcustomer = "contentcustomer";
         var hasInit = false;
      var vmbase = avalon.define({
        $id: "base",
          // 当前页码 
        curPage: 1,
        pageSize: 10, 
        totalSize: 0,
        form: {   
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
                levelRel: ["project", "grid"],
                nextStep: ["getProject"],
                rootOption: true
            },
            // 城市
            city: {
                id: "",
                text: "==请选择==",
                defaultText: "==请选择==",
                list: [],
                levelRel: [],
                nextStep: [],
                rootOption: true
            },
            // 项目
            project: {
                id: "",
                text: "全部",
                defaultText: "全部",
                list: [],
                levelRel: ["grid"],
                nextStep: ["getGrid"],
                rootOption: true
            },
            // 网格
            grid: {
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
            if(document.getElementById('organization').value=='==请选择==')
            {
                alert("请选择一项管理中心！");
                return false;
            }
            vmbase.curPage = 1;
            cus_data_helper.getTaskReportData();
            $("#nlm").css('display','none');
            $("#nlmm").css('display','none');
        },
        // 重置
        reset_event: function(e) {
           
            // 创建人
            vmbase.curPage = 1;
            vmbase.pageSize = 10;

            for (var key in vmbase.options) {
            	 if (vmbase.options.hasOwnProperty(key)) {
                     vmbase.options[key].id = ''; //把options里面的id属性设为空
                     if (!vmbase.options[key].rootOption) {
                         vmbase.options[key].list = []; //把options里面的list属性设为空
                     }
                     vmbase.options[key].text = vmbase.options[key].defaultText;
                 }
            }
            $("#nlm").css('display','none');
            $("#nlmm").css('display','none');
        },
        // 导出
        export_event: function() {
        	//失效导出按钮
        	 var _this = $(this);
        	 //判断是否有disabled属性
        	 if (_this.attr('data-disabled') === 'disabled') return;
        	 if(vmbase.totalSize > 0){
        		 //失效按钮
        		 _this.attr('data-disabled', 'disabled'); 
                 var exportUrl = Config["baseAjaxUrl"].getbaseInfoExport + "?cityCode=" + vmbase.options.city.id + "&mcId=" + vmbase.options.organization.id + "&projectId=" + vmbase.options.project.id + "&gridId=" + vmbase.options.grid.id + "&access_token=" + Common.cookie('access_token');
                 //location.href=exportUrl;
                 //进度条
                 $("#nlm").css('display','block');
                 $("#nlmm").css('display','none');
                 $.ajax({
                     	async:false,
                     	type: "GET",
                         url:exportUrl,
                         contentType: "application/x-zip-compressed; charset=utf-8",
                         success:function(result){
                             //生成成功
                             if(result){
                             	//隐藏导出进度
                                 $("#nlm").css('display','none');
                             	//赋值
                                 $('#zipFilePath').val(result);
                            	 var zipFileName = result.match(/\/([^/]*.zip)/i)[1];
                            	 $("#zipFilePath").text("[请点击下载Excel("+zipFileName+")文件]");
                                 //打开下载文件
                                 $("#nlmm").css('display','block');
                                 //打开按钮
                                 _this.attr('data-disabled', ''); 
                             }
                         },
                         error:function(){
                             attr("导出异常，请稍候重试");
                         }
                  })
        	 }
        },
        downdloadFile:function (){
        	location.href = Config["baseAjaxUrl"].downdloadbaseInfoExport +"?filePath="+$('#zipFilePath').val()+"&access_token=" + Common.cookie('access_token');
        },
          // 关闭控制面板
        close: function() {
            vmbase.choosePlane_vis = false;
        },
        // 清除选择面板
        cleanCurOptions: function() {
            var _this = $(this);
            var targetName = _this.attr('target');
            if (!vmbase.options[targetName]) return;
            var levelRel = vmbase.options[targetName].levelRel;
            for (var i = 0; i < levelRel.length; i++) {
                vmbase.options[levelRel[i]].id = "";
                vmbase.options[levelRel[i]].text = vmbase.options[levelRel[i]].defaultText;
                vmbase.options[levelRel[i]].list = [];
            }
            vmbase.options[targetName].id = "";
            vmbase.options[targetName].text = vmbase.options[targetName].defaultText;
            vmbase.choosePlane_vis = false;
        },

        cleanRelOptions: function(targetName) {
            if (!vmbase.options[targetName]) return;
            var levelRel = vmbase.options[targetName].levelRel;
            for (var i = 0; i < levelRel.length; i++) {
                vmbase.options[levelRel[i]].id = "";
                if (!vmbase.options[levelRel[i]].rootOption) {
                    vmbase.options[levelRel[i]].list = [];
                }
                vmbase.options[levelRel[i]].text = vmbase.options[levelRel[i]].defaultText;
            }
            vmbase.choosePlane_vis = false;
        },
           // 选择面板控制
           choosePlaneControl: function() {
            var _this = $(this);
if (vmbase.choosePlane_vis) {
                vmbase.choosePlane_vis = false;
            } else {
                var targetName = _this.attr('target')
                vmbase.curTarget = targetName;
                vmbase.curPlaneList = vmbase.options[targetName].list;

                var _input = _this.parents('.pagecontent').find('input[name="' + targetName + '"]');
                var top = _input.offset().top;
                var left = _input.offset().left;


                _this.parents('.pagecontent').find('.choose').css({
                    "top": (top - 30) + 'px',
                    "left": (left - 270) + 'px'
                });

                vmbase.choosePlane_vis = true;
            }
           }
});
 /* 获取数据类  列表|管理中心|项目|网格 */
    var cusup_pageInfo = null;
    var cus_data_helper = {
        // 获取管理中心
        getOrganization: function() {
            Common.ajax({
                url: Config["baseAjaxUrl"].getOrganization,
                type: "GET",
                success: function(data) {
                	if(null != data){
                		 vmbase.options.organization.list = data;
                		 //只有一条默认第一个
                		 if(data.length == 1){
                			vmbase.options['organization'].text = vmbase.options.organization.list[0].name;
                            vmbase.options['organization'].id = vmbase.options.organization.list[0].id;
                            if (vmbase.options['organization'].id) cus_data_helper.getProject()
                		 }
                	}
                },
                error: function() {},
                complete: function() {} 
            });
        },

        //获取字典(城市,房屋状态)
        getDictionary: function() {
            Common.ajax({
                url: Config["baseAjaxUrl"].getDictionary,
                type: "POST",
                data: {
                    codes: "CityCode"
                }, 
                success: function(data) {
                    vmbase.options.city.text = vmbase.options.city.defaultText;         
                    vmbase.options.city.list = formatDictionary(data.CityCode);
                },
                error: function() {},
                complete: function() {}
            });
        },

        // 获取项目
        getProject: function() {
            vmbase.options.project.text = vmbase.loadOptionsTip;
            if (vmbase.options.organization.id == '' && vmbase.options.city.id == '') return;
            Common.ajax({
                url: Config["baseAjaxUrl"].getProject,
                type: "GET",
                data: {
                    parentId: vmbase.options.organization.id
                },
                success: function(data) {
                    vmbase.options.project.text = vmbase.options.project.defaultText;
                    vmbase.options.project.list = data;
                }, 
                error: function() {
                    vmbase.options.project.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

        // 获取网格by项目
        getGrid: function() {
            // vmbase.options.grid.text = vmbase.loadOptionsTip;
            if (vmbase.options.project.id == '') return;
            Common.ajax({
                url: Config["baseAjaxUrl"].getGrid,
                type: "GET",
                data: {
                    projectId: vmbase.options.project.id
                },
                success: function(data) {
                    // vmbase.options.grid.text = vmbase.options.grid.defaultText;
                    vmbase.options.grid.list = data;
                },
                error: function() {
                    // vmbase.options.grid.text = '选项获取失败';
                },
                complete: function() {}
            });
        },

 // 获取列表数据
        getTaskReportData: function() {
            vmbase.hasBeenSubmitted = true;
            vmbase.data.isError = false;
            if (!vmbase.curPage) {
                vmbase.curPage = 1;
            }
            if (vmbase.curPage < 1) return;
            vmbase.data.isLoading = true;
            Common.ajax({
                url: Config["baseAjaxUrl"].baseInfoReport,
                type: "GET",
                cache: false, 
                data: {
                    curPage: vmbase.curPage,
                    pageSize: vmbase.pageSize,
                    cityCode: vmbase.options.city.id,//城市
                    mcId: vmbase.options.organization.id,//管理中心 
                    projectId: vmbase.options.project.id,//项目   
                    gridId: vmbase.options.grid.id//网格
                    
                },
                success: function(data) {
                    vmbase.data.isLoading = false;

                    vmbase.data.list = data.list;

                    if (!vmbase.paginationLoad) {
                        vmbase.paginationLoad = true;
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
                    vmbase.totalSize = tlpinfo.totalSize;
                },
                error: function() {
                    vmbase.data.isLoading = false;
                    vmbase.data.isError = true;
                },
                complete: function() {}
            });
        },

        // 设置分页信息
        bindPageInfo: function() {
            cusup_pageInfo = new Pagination({
                selector: "#pagination",
                onchange: function(pageInfo) {
                    vmbase.curPage = pageInfo.curpage;
                    cus_data_helper.getTaskReportData();
                }
            });
        },

        // 绑定事件
        bindEvent: function() {
            // 选择管理中心
            $('#src_'+vmbase.$id).on("click", 'li', function() {
                var text = $(this).attr('data-text'),
                code = $(this).attr('data-id');
                if (!code || !vmbase.curTarget) return;
                vmbase.options[vmbase.curTarget].text = text;
                vmbase.options[vmbase.curTarget].id = code;

                // 清空关联项
                vmbase.cleanRelOptions(vmbase.curTarget);
                // 隐藏当前选择区域
                vmbase.choosePlane_vis = false;
                // 获取下一步选项
                var nextStep = vmbase.options[vmbase.curTarget].nextStep || "";
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
        vmbase.choosePlane_vis = false;
        if (hasInit) {
            return;
        }
        hasInit = true;
        /* 模版缓存 */
        avalon.templateCache["contentbase"] = modelHtml;
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
        m = vmbase.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                vmbase.form[i] = d[i];
            } else {
                vmbase.form[i] = null;
            }
        } 
    }

    function restURLParse(url, map) {
        var result = url;
        for (var i = 0; i < map.length; i++) {
        	console.log(result);
            result = result.replace(map[i].key, map[i].val);
        }
        return result;
    }

    /* active */
    function active() {
        init();
        avalon.vmodels.root.visibleIndex = 'base';
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