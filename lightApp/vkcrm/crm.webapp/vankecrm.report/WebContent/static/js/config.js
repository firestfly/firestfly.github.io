(function(Config) {
    /* model */
    Config.local = {
        phone: true,
        data: false,
        userName: "系统管理员",
        userId: "CDE744E968C94964AA7F8163EE6A90D7",
        mobile: "17704054869"
    };
    /* ajaxPath */
    Config["ajaxPath"] = Config.ajaxPath || 'http://10.0.72.35'; //内网
    /* access_token */
    Config["accessToken"] = Config.accessToken || (function() {
        var _token = document.cookie.match(/access_token=(\w+)(?=;|$)/);
        if (_token && _token[1]) {
            return _token[1];
        }
    })();

    /* tips */
    Config["tips"] = {
        closeDraft: "若未保存将丢失该任务内容，确认离开？",
        taskValidateError: "提交表单失败，请检查表单内容",
        taskAppendValidateError: "请填写追加内容"
    };
    var servicePath = window.servicePath || {};
    var baseUrl = {
        tel: servicePath["tel"] || 'http://10.0.72.35/tel/api',
        task: servicePath["task"] || 'http://10.0.72.35/task/api',
        house: servicePath["house"] || 'http://10.0.72.35/house/api',
        customer: servicePath["customer"] || 'http://10.0.72.35/customer/api',
        questionnaire: servicePath["questionnaire"] || 'http://10.0.72.35/questionnaire/api',
        report: servicePath["report"] || 'http://10.0.72.35/report/api',
    };
    Config["ajaxUrl"] = {
        /**
         * 获取查询条件
         */
        getOperation: "", //获取运营中心
        getOrganization: baseUrl.house + "/v1/organization/get", //获取管理中心
        getGrid: "", //获取网格
        getCity: "", //获取城市
        getProject: baseUrl.house + "/v1/project/get", //获取项目
        getBuilding: baseUrl.house + "/v1/project/{projectId}/buildings/report", //获取楼栋
        getCompany: "", //获取公司
        getHouse: "", //获取房屋
        // 报表
        getReport_relationChange: baseUrl.report + '/v1/relationChangeReport/get',
        getReport_customerModify: baseUrl.report + '/v1/customerModifyReport/get',
        //导出客户信息查询报表
        export_customerModify:baseUrl.report+'/v1/customerModifyReport/export',
        //导出客房关系信息报表
        export_relationChange:baseUrl.report+'/v1/relationChangeReport/export',
        // 呼叫中心报表 - 呼入-话务清单报表
        getReport_callinrecordChange: baseUrl.report + '/v1/callcenter/telreport',
        export_callinrecordChange: baseUrl.report + '/v1/callcenter/telreport/export',
        /**
         * 获取报表
         */
        // 基础信息报表 - 基础信息统计报表
        getReport_base: '',
        // 查询信息报表 - 客户信息查询
        getReport_customer: '',
        // 查询信息报表 - 车辆信息查询
        getReport_car: '',
        // 查询信息报表 - 宠物信息查询
        getReport_pet: '',
        // 质量检查报表 - 客户数据质量检查报表
        getReport_quality: '',
        // 修改纪录报表 - 客户修改纪录报表
        getReport_cusupdate: '',
        // 修改纪录报表 - 客房关系修改纪录报表
        getReport_grupdate: '',
        // 呼叫中心报表 - 呼入-任务清单报表
        getReport_callintask: baseUrl.report + '/v1/call/taskreport',
        // 呼叫中心报表 - 呼入-话务清单报表
        getReport_callinrecord: '',
        // 呼叫中心报表 - 呼入-呼入组排行榜
        getReport_callincharts: '',
        // 呼叫中心报表 - 外呼-外呼工作明细
        getReport_calloutdetail: '',
        // 呼叫中心报表 - 外呼-外呼组排行榜
        getReport_calloutcharts: '',
        // 呼叫中心报表 - 满意度明细表
        getReport_sfdetail: '',
        // 呼叫中心报表 - 进度积累
        getReport_sfamass: ''
    };
    //prdetail
    Config["newAjaxUrl"] = {
        getDictionary: baseUrl.report + "/v1/dict/items", //获取字典
        getOrganization: baseUrl.house + "/v1/organization/McAndCompany", // 获取管理中心
        getProject: baseUrl.house + "/v1/roleprojects", //获取项目
        getGrid: baseUrl.house + '/v1/gridinfo',  //获取网格
        getBuilding: baseUrl.house + "/v1/project/{projectId}/buildings/report", //获取楼栋
        getHouse: baseUrl.house + "/v1/house/report", //获取房屋
        getHouseByBuild: baseUrl.house + "/v1/building/house", //获取房屋无需权限即无需使用网格的过滤
        getModifyField: baseUrl.report + "/v1/modifyitems", //获取修改字段
        getTaskReport: baseUrl.report + '/v1/taskReport', // 获取任务清单报表
        getTaskReportExport: baseUrl.report + '/v1/taskReport/export',// 导出任务清单报表
        getCallTaskReportExport: baseUrl.report + '/v1/call/taskreport/export'// 导出项目任务清单报表
    };
    //customer
    Config["cusAjaxUrl"]={
        getDictionary: baseUrl.report + "/v1/dict/items", //获取字典
        getOrganization: baseUrl.house + "/v1/organization/McAndCompany", // 获取管理中心
        getProject: baseUrl.house + "/v1/roleprojects", //获取项目
        getGrid: baseUrl.house + '/v1/gridinfo',  //获取网格
        getBuilding: baseUrl.house + "/v1/project/{projectId}/buildings/report", //获取楼栋
        getHouse: baseUrl.house + "/v1/house/report", //获取房屋
        getuserInfolistReport:baseUrl.report + '/v1/getuserInfolistReport', // 获取客户信息清单报表
        getUserReportExport: baseUrl.report + '/v1/userInfoReport/export'   // 导出客户信息清单报表
    };
    //car
        Config["carAjaxUrl"]={
        getDictionary: baseUrl.report + "/v1/dict/items", //获取字典
        getOrganization: baseUrl.house + "/v1/organization/McAndCompany", // 获取管理中心
        getProject: baseUrl.house + "/v1/roleprojects", //获取项目
        getGrid: baseUrl.house + '/v1/gridinfo',  //获取网格
        getBuilding: baseUrl.house + "/v1/project/{projectId}/buildings/report", //获取楼栋
        getHouse: baseUrl.house + "/v1/house/report", //获取房屋
        carInfoReport: baseUrl.report + '/v1/carInfoReport', // 获取车辆信息清单报表
        getcarInfoExport: baseUrl.report + '/v1/carInfoReport/export'   // 导出车辆信息清单报表
    };
    //pet
        Config["petAjaxUrl"]={
        getDictionary: baseUrl.report + "/v1/dict/items", //获取字典
        getOrganization: baseUrl.house + "/v1/organization/McAndCompany", // 获取管理中心
        getProject: baseUrl.house + "/v1/roleprojects", //获取项目
        getGrid: baseUrl.house + '/v1/gridinfo',  //获取网格
        getBuilding: baseUrl.house + "/v1/project/{projectId}/buildings/ ", //获取楼栋
        getHouse: baseUrl.house + "/v1/house/report", //获取房屋
        petInfoReport: baseUrl.report + '/v1/petsInfoReport', // 获取宠物信息清单报表
        getpetInfoExport: baseUrl.report + '/v1/petsInfoReport/export'   // 导出宠物信息清单报表
    };
    //base
     Config["baseAjaxUrl"]={
        getDictionary: baseUrl.report + "/v1/dict/items", //获取字典
        getOrganization: baseUrl.house + "/v1/organization/McAndCompany", // 获取管理中心
        getProject: baseUrl.house + "/v1/roleprojects", //获取项目
        getGrid: baseUrl.house + '/v1/gridinfo/projectId',  //获取网格
        baseInfoReport: baseUrl.report + '/v1/baseInfoReport',// 获取基本信息清单报表
        getbaseInfoExport: baseUrl.report + '/v1/baseInfoReport/export',   // 导出基本信息清单报表
        downdloadbaseInfoExport: baseUrl.report + '/v1/baseInfoReport/downdload'   // 下载基本信息清单报表
    };
    /* keys */
    Config["keys"] = {};
    /*  */
    Config["baseModule"] = "base";
})(window.Config = window.Config || {});
