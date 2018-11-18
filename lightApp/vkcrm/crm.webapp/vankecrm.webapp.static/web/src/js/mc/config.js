(function (Config) {
    /* model */
    Config.local = {
        phone: true,
        data: false,
        publisher: "系统管理员",
        publisherId: "43FE6476CD7B493B8044C7E3149D0876",
        contactMobile: "17704054869"
    };
    /* access_token */
    Config["accessToken"] = Config.accessToken || (function () {
            var _token = document.cookie.match(/access_token=(\w+)(?=;|$)/);
            if (_token && _token[1]) {
                return _token[1];
            }
            // document.cookie = "access_token=;expires=" + new Date(0).toGMTString()
        })();
    /* tips */
    Config["tips"] = {
        closeDraft: "若未保存将丢失该任务内容，确认离开？",
        taskValidateError: "提交表单失败，请检查表单内容",
        taskAppendValidateError: "请检查所填写的追加内容",
        gettingAbnormalTask: "正在获取超时任务",
        getAbnormalTaskSuccess: "获取超时任务成功",
        getAbnormalTaskError: "获取超时任务失败",
        checkEvaluationTaskError: "请选择评价",
        taskCloseIsEmptyError: "请选择关闭原因",
        addTaskBusinessTypeError: "请选择任务类型",
        taskAppendProcessError: "请检查所填写的内容"
    }
    /* keys */
    Config["keys"] = {};
    /* objs */
    Config["objs"] = {};
    /* */
    Config["abnormalTask"] = {
        interval: 10000 //10秒
    }
})(window.Config = window.Config || {});