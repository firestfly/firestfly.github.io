(function(Config) {
    /* model */
    Config.local = {
        phone: true,
        data: false,
        publisher: "系统管理员",
        publisherId: "43FE6476CD7B493B8044C7E3149D0876",
        contactMobile: ""
    };
    /* ajaxPath */
    Config["ajaxPath"] = Config.ajaxPath || 'http://10.0.72.35';
    // Config["ajaxPath"] = Config.ajaxPath || 'http://10.0.72.35:16901';
    Config["ajaxPaths"] = {
            // customer
            'getDictionary': window.servicePath["customer"] + '/v1/batch/dict/',
            // questionnaire
            'getQuestions': window.servicePath["questionnaire"] + '/v1/questionnaires/', //'/s.questionnaire/api/v1/questionnaires/1/10'
            'getExaminationById': window.servicePath["questionnaire"] + '/v1/questionnaires/', // '/s.questionnaire/api/v1/questionnaires/5684ae5509af4225b6bb7af29bcdf00e'
            'saveExamination': window.servicePath["questionnaire"] + '/v1/connectedAnswer',
            'getCustomerForExamination': window.servicePath["questionnaire"] + "/v1/questionnaire/extraction",
            'addQuesRecord': window.servicePath["questionnaire"] + '/v1/callrecord/add',
            'saveNotConnectError': window.servicePath["questionnaire"] + '/v1/notConnectedError',
            // telService
            'getRecordFile': window.servicePath["tel"] + '/v1/tape/', //telService /api/v1/tape/{id}/listen, telService /api/b1/tape/{id}/download
            // tel
            'addCallRecord': window.servicePath["tel"] + '/v1/telrecord/callrecord/add',
            'getCallRecord': window.servicePath["tel"] + '/v1/telrecord/callrecords/get',
            'updateCallRecord': window.servicePath["tel"] + '/v1/telrecord/callrecord/update',

            'getHandleNumber': window.servicePath["tel"] + '/v1/',
            'getAttribution': window.servicePath["tel"] + '/v1/',
            'getTelUser': window.servicePath["tel"] + '/v1/teluser/get',
            'default': ''
        }
        /* access_token */
    Config["accessToken"] = Config.accessToken || (function() {
        var _token = document.cookie.match(/access_token=(\w+)(?=;|$)/);
        if (_token && _token[1]) {
            return _token[1];
        }
    })();
    /* tips */
    Config["tips"] = {
            'SubmitFormError': '提交表单失败，请检查表单内容',
            'SubmitFormSuccess': '保存成功'
        }
        /* keys */
    Config["keys"] = {}
        /*  */

})(window.Config = window.Config || {});