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
    Config["ajaxPath"] = Config.ajaxPath || 'http://10.0.72.35:8081';
    // Config["ajaxPath"] = Config.ajaxPath || 'http://10.0.72.35:16901';
    Config["ajaxPaths"] = {
        // customer
        'getDictionary': servicePath.customer + '/v1/batch/dict/',
        // questionnaire
        'getQuestions': servicePath.questionnaire + '/v1/questionnaires/', //'/s.questionnaire/v1/questionnaires/1/10'
        'getExaminationById': servicePath.questionnaire + '/v1/questionnaires/', // '/s.questionnaire/v1/questionnaires/5684ae5509af4225b6bb7af29bcdf00e'
        'saveExamination': servicePath.questionnaire + '/v1/connectedAnswer',
        'getCustomerForExamination': servicePath.questionnaire + "/v1/questionnaire/extraction",
        'addQuesRecord': servicePath.questionnaire + '/v1/callrecord/add',
        'saveNotConnectError': servicePath.questionnaire + '/v1/notconnectederro',
        // 'saveConnectError': servicePath.questionnaire + '/v1/connectederro',
        // telService
        'getRecordFile': servicePath.tel + '/v1/tape/', //telService /v1/tape/{id}/listen, telService /b1/tape/{id}/download
        // tel
        'addCallRecord': servicePath.tel + '/v1/telrecord/callrecord/add',
        'getCallRecord': servicePath.tel + '/v1/telrecord/callrecords/get',
        'updateCallRecord': servicePath.tel + "/v1/telrecord/callrecord/update",
        'getHandlenumer': servicePath.tel + "/v1/telrecord/handlenumer",
        'getAttribution': servicePath.tel + "/v1/telrecord/attribution",
        'getTelUser': servicePath.tel + "/v1/teluser/get",
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