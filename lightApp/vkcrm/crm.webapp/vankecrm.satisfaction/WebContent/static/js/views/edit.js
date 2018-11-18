(function () {
    var dictionaryData = null;

    /*定义问卷模型*/
    var questionnaireModel = avalon.define({
        $id: 'questionnaireEdit',
        form: {
            id: '',
            subjectId: 'default',
            title: '',
            sampleRatio: 100,
            annualCompleteRate: 10,
            topicCount: 0,
            beginTime: '',
            endTime: '',
            delayTime: '',
            description: '',
            isEnabled: true,
            crossTime: false,
            status: 0,
            excludeSpecialIdentities: ''
        },
        showAddBtn: false,
        toggle: false,
        identities: [],
        excludeSpecialIdentities: [],
        topics: {
            topicList: [],
            allchecked: false,
            /*全选*/
            checkAll: function () {
                var bool = questionnaireModel.topics.allchecked = this.checked
                questionnaireModel.topics.topicList.forEach(function (el) {
                    el.checked = bool
                })
            },
            /*单选*/
            checkOne: function () {
                if (!this.checked) {
                    questionnaireModel.topics.allchecked = false
                } else {
                    questionnaireModel.topics.allchecked = questionnaireModel.topics.topicList.every(function (el) {
                        return el.checked
                    })
                }
            },
            /*编辑*/
            editAction: function () {
                $('#topicSequence').attr('data-validator', '');
                $('#topicSequence').attr('disabled', true);
                var data = avalon(this);
                console.log(data.data('id'));
                fillTopicData(this['data-object']);
                topicModel.cacheFormData = $.extend({}, topicModel.form.$model);
                questionnaireModel.toggle = true;
            },
            /*删除*/
            removeAction: function () {
                var data = avalon(this);
                console.log(data.data('id'));
                if (window.confirm('您确定要删除问题?')) {
                    ajaxDeleteTopicUrl = servicePath.questionnaire + '/v1/topics/{topicId}';
                    ajaxDeleteTopicUrl = ajaxDeleteTopicUrl.replace('{topicId}', data.data('id'));
                    ajaxDeleteTopic();
                }
            },
            /*预览*/
            preViewAction: function () {
                var data = avalon(this);
                console.log(data.data('id'));
            }
        },
        saveAction: function () {
            console.log('saveAction');
            clearErrorTip(questionnaireForm);
            submitQuestionnaireForm();
        },
        resetAction: function () {
            console.log('resetAction');
            window.location.href = path.server + '/page/questionnaire/manage';
        },
        cancelAction: function () {
            console.log('cancelAction');
            window.location.href = path.server + '/page/questionnaire/manage';
        },
        addTopicAction: function () {
            $('#topicSequence').attr('data-validator', 'required,integer,range[1~99],func[checkTopicSequence]');
            $('#topicSequence').attr('disabled', false);
            topicModel.clearFormData();
            optionModel.clearFormData();
            topicModel.cacheFormData = $.extend({}, topicModel.form.$model);
            topicModel.options.optionList = [];
            topicModel.form.questionnaireId = questionnaireModel.form.id;
            topicModel.showAddBtn = false;
            questionnaireModel.toggle = true;
        },
        clearFormData: function () {
            questionnaireModel.form.id = '';
            questionnaireModel.form.title = '';
            questionnaireModel.form.sampleRatio = 100;
            questionnaireModel.form.annualCompleteRate = 10;
            questionnaireModel.form.topicCount = 0;
            questionnaireModel.form.beginTime = '';
            questionnaireModel.form.endTime = '';
            questionnaireModel.form.delayTime = '';
            questionnaireModel.form.description = '';
            questionnaireModel.form.isEnabled = true;
            questionnaireModel.form.excludeSpecialIdentities = '';
            clearErrorTip(questionnaireForm);
        }
    });

    /*定义问题模型*/
    var topicModel = avalon.define({
        $id: 'topicEdit',
        form: {
            id: '',
            questionnaireId: '',
            title: '',
            weight: 100,
            target: '',
            sequence: '',
            optionMode: '1',
            optionCount: 0,
            isEnabled: true
        },
        cacheFormData: {},
        showAddBtn: false,
        showDialog: false,
        options: {
            optionList: [],
            allchecked: false,
            /*全选*/
            checkAll: function () {
                var bool = topicModel.options.allchecked = this.checked
                topicModel.options.optionList.forEach(function (el) {
                    el.checked = bool
                })
            },
            /*单选*/
            checkOne: function () {
                if (!this.checked) {
                    topicModel.options.allchecked = false
                } else { //avalon已经为数组添加了ecma262v5的一些新方法
                    topicModel.options.allchecked = topicModel.options.optionList.every(function (el) {
                        return el.checked
                    })
                }
            },
            /*编辑*/
            editAction: function () {
                $('#optionSequence').attr('data-validator', '');
                $('#optionSequence').attr('disabled', true);
                var data = avalon(this);
                console.log(data.data('id'));
                fillOptionData(this['data-object']);
                optionModel.cacheFormData = $.extend({}, optionModel.form.$model);
                topicModel.showDialog = true;
            },
            /*删除*/
            removeAction: function () {
                var data = avalon(this);
                console.log(data.data('id'));
                if (window.confirm('您确定要删除选项?')) {
                    ajaxDeleteOptionUrl = servicePath.questionnaire + '/v1/options/{optionId}';
                    ajaxDeleteOptionUrl = ajaxDeleteOptionUrl.replace('{optionId}', data.data('id'));
                    ajaxDeleteOption();
                }
            },
            /*预览*/
            preViewAction: function () {
                var data = avalon(this);
                console.log(data.data('id'));
            }
        },
        topicOptionModes: [],
        saveAction: function () {
            console.log('saveAction');
            clearErrorTip(topicForm);
            submitTopicForm();
        },
        resetAction: function () {
            console.log('resetAction');
            fillTopicData(topicModel.cacheFormData);
            clearErrorTip(topicForm);
        },
        cancelAction: function () {
            console.log('cancelAction');
            topicModel.clearFormData();
            topicModel.options.optionList = [];
            questionnaireModel.toggle = false;
            clearErrorTip(topicForm);
            ajaxGetTopics();
        },
        addOptionAction: function () {
            $('#optionSequence').attr('data-validator', 'required,integer,range[1~99],func[checkOptionSequence]');
            $('#optionSequence').attr('disabled', false);
            optionModel.form.topicId = topicModel.form.id;
            optionModel.cacheFormData = $.extend({}, optionModel.form.$model);
            topicModel.showDialog = true;
        },
        clearFormData: function () {
            topicModel.form.id = '';
            topicModel.form.title = '';
            topicModel.form.weight = 100;
            topicModel.form.target = '';
            topicModel.form.sequence = '';
            topicModel.form.optionMode = '1';
            topicModel.form.optionCount = 0;
            topicModel.form.isEnabled = true;
            topicModel.cacheFormData = {};
            clearErrorTip(topicForm);
        }
    });

    /*定义选项模型*/
    var optionModel = avalon.define({
        $id: 'optionEdit',
        form: {
            id: '',
            sequence: '',
            topicId: '',
            category: '1',
            score: '5.0',
            content: '',
            processMode: '1',
            gotoTopic: ''
        },
        cacheFormData: {},
        editMode: false,
        optionCategories: [],
        processModes: [],
        saveAction: function () {
            console.log('saveAction');
            clearErrorTip(optionForm);
            submitOptionForm();
        },
        resetAction: function () {
            console.log('resetAction');
            fillOptionData(optionModel.cacheFormData);
            clearErrorTip(optionForm);
        },
        cancelAction: function () {
            console.log('cancelAction');
            optionModel.clearFormData();
            topicModel.showDialog = false;
            clearErrorTip(optionForm);
        },
        clearFormData: function () {
            optionModel.form.id = '';
            optionModel.form.sequence = '';
            optionModel.form.category = '1';
            optionModel.form.score = '5.0';
            optionModel.form.content = '';
            optionModel.form.processMode = '1';
            optionModel.form.gotoTopic = '';
            optionModel.cacheFormData = {};
            var optionCategories = [];
            $.each(dictionaryData['OptionCategory'], function (index, value) {
                if (value.code === topicModel.optionMode) {
                    optionCategories.push(value);
                }
            });
            clearErrorTip(topicForm);
        }
    });

    questionnaireModel.$watch('form.id', function (e) {
        if (e) {
            ajaxGetQuestionnaireUrl = ajaxGetQuestionnaireUrl.replace('{questionnaireId}', e);
            ajaxGetQuestionnaire();
            ajaxGetTopicsUrl = ajaxGetTopicsUrl.replace('{questionnaireId}', e);
            ajaxGetTopics();
        } else {
            questionnaireModel.topics.topicList = [];
            ajaxGetTopicsUrl = servicePath.questionnaire + '/v1/questionnaires/{questionnaireId}/topics';
        }
    });

    questionnaireModel.$watch('toggle', function (e) {
        if (e) {
            $('#questionnaireEdit').slideUp();
            $('#topicEdit').slideDown();
        } else {

            $('#questionnaireEdit').slideDown();
            $('#topicEdit').slideUp();
        }
    });

    questionnaireModel.$watch('form.isEnabled', function (e) {
        if (e) {

        } else {

        }
    });

    questionnaireModel.$watch("excludeSpecialIdentities.length", function (e) {
        avalon.log(questionnaireModel.excludeSpecialIdentities);
        questionnaireModel.form.excludeSpecialIdentities = questionnaireModel.excludeSpecialIdentities.join(',');
    });

    topicModel.$watch('form.id', function (e) {
        if (e) {
            ajaxGetOptionsUrl = ajaxGetOptionsUrl.replace('{topicId}', e);
            ajaxGetOptions();

        } else {
            topicModel.options.optionList = [];
            ajaxGetOptionsUrl = servicePath.questionnaire + '/v1/topics/{topicId}/options';
        }
        var optionCategories = [];
        $.each(dictionaryData['OptionCategory'], function (index, value) {
            if (value.code === topicModel.form.optionMode) {
                optionCategories.push(value);
            }
        });
        optionModel.optionCategories = optionCategories;
    });

    topicModel.$watch('showDialog', function (e) {
        if (e) {
            $('#topicEditDialog').modal('show');
        } else {
            $('#topicEditDialog').modal('hide');
        }
    });

    topicModel.$watch('form.optionMode', function (e) {
        switch (e.toString()) {
            case '1':
                var optionCategories = [];
                $.each(dictionaryData['OptionCategory'], function (index, value) {
                    if (value.code === '1') {
                        optionCategories.push(value);
                    }
                });
                optionModel.optionCategories = optionCategories;
                break;
            case '2':
                var optionCategories = [];
                $.each(dictionaryData['OptionCategory'], function (index, value) {
                    if (value.code === '2') {
                        optionCategories.push(value);
                    }
                });
                optionModel.optionCategories = optionCategories;
                break;
            case '3':
                optionModel.optionCategories = dictionaryData['OptionCategory'];
                break;
            case '4':
                var optionCategories = [];
                $.each(dictionaryData['OptionCategory'], function (index, value) {
                    if (value.code === '3') {
                        optionCategories.push(value);
                    }
                });
                optionModel.optionCategories = optionCategories;
                break;
        }
    });

    optionModel.$watch('form.processMode', function (e) {
        console.log(e);
        if (e == 2) {
            $('[name=gotoTopic]').attr('data-validator', 'required,integer');
            $('[name=gotoTopic]').attr('disabled', false);
        } else {
            $('[name=gotoTopic]').attr('data-validator', '');
            $('[name=gotoTopic]').attr('disabled', true);
        }
    });

    var questionnaireForm = null,
        topicForm = null,
        optionForm = null;

    var ajaxGetDictionariesUrl = servicePath.questionnaire + '/v1/batch/dict/TopicsOptionMode,OptionCategory,OptionProcessMode,CustomerIdentity/items',
        ajaxGetQuestionnaireUrl = servicePath.questionnaire + '/v1/questionnaires/{questionnaireId}',
        ajaxGetTopicsUrl = servicePath.questionnaire + '/v1/questionnaires/{questionnaireId}/topics',
        ajaxGetOptionsUrl = servicePath.questionnaire + '/v1/topics/{topicId}/options',
        ajaxPostQuestionnaireUrl = servicePath.questionnaire + '/v1/questionnaire',
        ajaxPostTopicUrl = servicePath.questionnaire + '/v1/topic',
        ajaxPostOptionUrl = servicePath.questionnaire + '/v1/option',
        ajaxDeleteTopicUrl = servicePath.questionnaire + '/v1/topics/{topicId}',
        ajaxDeleteOptionUrl = servicePath.questionnaire + '/v1/options/{optionId}';

    function bindEvent() {
        //模态窗隐藏
        $('#topicEditDialog').on('hidden', function () {

        });
        //模态窗呈现
        $('#topicEditDialog').on('shown', function () {

        });
        //
        $('.close').bind('click', function () {
            optionModel.clearFormData();
            topicModel.showDialog = false;
            clearErrorTip(optionForm);
        });
    };

    function clearErrorTip(form) {
        form.find('.errortip').removeClass('on').tooltip("destroy");
    }

    function submitQuestionnaireForm() {
        clearErrorTip(questionnaireForm);
        var validateResult = validate(questionnaireForm[0], {
            validateAll: true,
            onerror: function (caller, text) {
                $(caller).closest('td').find('.errortip').addClass('on').tooltip({
                    title: text,
                    placement: 'bottom'
                })
            }
        })
        if (validateResult) {
            Common.tip.add({
                text: Config.tips['SubmitFormError'],
                type: 'warning'
            });
            return;
        }
        ajaxPostQuestionnaire();
    }

    function submitTopicForm() {
        clearErrorTip(topicForm);
        var validateResult = validate(topicForm[0], {
            validateAll: true,
            onerror: function (caller, text) {
                $(caller).closest('td').find('.errortip').addClass('on').tooltip({
                    title: text,
                    placement: 'bottom'
                })
            }
        })
        if (validateResult) {
            Common.tip.add({
                text: Config.tips['SubmitFormError'],
                type: 'warning'
            });
            return;
        }
        ajaxPostTopic();
    }

    function submitOptionForm() {
        clearErrorTip(topicForm);
        var validateResult = validate(optionForm[0], {
            validateAll: true,
            onerror: function (caller, text) {
                $(caller).closest('td').find('.errortip').addClass('on').tooltip({
                    title: text,
                    placement: 'bottom'
                })
            }
        })
        if (validateResult) {
            Common.tip.add({
                text: Config.tips['SubmitFormError'],
                type: 'warning'
            });
            return;
        }
        ajaxPostOption();
    }

    function fillQuestionnaireData(data) {
        var d = data || {},
            m = questionnaireModel.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                questionnaireModel.form[i] = d[i];
            } else {
                questionnaireModel.form[i] = null;
            }
        }
        questionnaireModel.showAddBtn = true;
    }

    function fillTopicData(data) {
        var d = data || {},
            m = topicModel.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                topicModel.form[i] = d[i];
            } else {
                topicModel.form[i] = null;
            }
        }
        topicModel.showAddBtn = true;
    }

    function fillOptionData(data) {
        var d = data || {},
            m = optionModel.form.$model
        for (var i in m) {
            if (d.hasOwnProperty(i)) {
                optionModel.form[i] = d[i];
            } else {
                optionModel.form[i] = null;
            }
        }
    }

    //声明Ajax处理
    var ajaxGetDictonariesHandle = null;
    var ajaxGetQuestionnaireHandle = null;
    var ajaxGetTopicsHandle = null;
    var ajaxGetOptionsHandle = null;

    var ajaxPostQuestionnaireHandle = null;
    var ajaxPostTopicHandle = null;
    var ajaxPostOptionHandle = null;

    var ajaxDeleteTopicHandle = null;
    var ajaxDeleteOptionHandle = null;

    function ajaxGetDictonaries() {
        if (ajaxGetDictonariesHandle != null) {
            ajaxGetDictonariesHandle.abort();
        }
        ajaxGetDictonariesHandle = Common.ajax({
            url: ajaxGetDictionariesUrl,
            type: 'GET',
            success: function (res) {
                var data = res;
                dictionaryData = data;
                questionnaireModel.identities = data['CustomerIdentity'];
                topicModel.topicOptionModes = data['TopicsOptionMode'];
                optionModel.optionCategories = data['OptionCategory'];
                optionModel.processModes = data['OptionProcessMode'];
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            }
        })
    }

    function ajaxGetQuestionnaire() {
        if (ajaxGetQuestionnaireHandle != null) {
            ajaxGetQuestionnaireHandle.abort();
        }
        ajaxGetQuestionnaireHandle = Common.ajax({
            url: ajaxGetQuestionnaireUrl,
            type: 'GET',
            success: function (res) {
                if (res) {
                    fillQuestionnaireData(res);
                    questionnaireModel.excludeSpecialIdentities = (res.excludeSpecialIdentities) ? res.excludeSpecialIdentities.split(',') : [];
                }
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            }
        });
        Common.loading({
            text: '',
            container: '#questionnaireEdit',
            handle: ajaxGetQuestionnaireHandle
        });
    }

    function ajaxGetTopics() {
        if (ajaxGetTopicsHandle != null) {
            ajaxGetTopicsHandle.abort();
        }
        ajaxGetTopicsHandle = Common.ajax({
            url: ajaxGetTopicsUrl,
            type: 'GET',
            success: function (res) {
                var topics = res;
                questionnaireModel.topics.topicList = topics;
            },
            error: function (error) {
                console.log(error);
                questionnaireModel.topics.topicList = [];
            },
            complete: function () {
            }
        });
        Common.loading({
            text: '',
            container: '#topicTableContainer',
            handle: ajaxGetTopicsHandle
        });
    }

    function ajaxGetOptions() {
        if (ajaxGetOptionsHandle != null) {
            ajaxGetOptionsHandle.abort();
        }
        ajaxGetOptionsHandle = Common.ajax({
            url: ajaxGetOptionsUrl,
            type: 'GET',
            success: function (res) {
                var options = res;
                topicModel.options.optionList = options;
            },
            error: function (error) {
                console.log(error);
                topicModel.options.optionList = [];
            },
            complete: function () {
            }
        });
        Common.loading({
            text: '',
            container: '#optionTableContainer',
            handle: ajaxGetOptionsHandle
        });
    }

    function ajaxPostQuestionnaire() {
        if (ajaxPostQuestionnaireHandle != null) {
            ajaxPostQuestionnaireHandle.abort();
        }
        ajaxPostQuestionnaireHandle = Common.ajax({
            url: ajaxPostQuestionnaireUrl,
            type: 'POST',
            data: $.extend({}, questionnaireModel.form.$model),
            success: function (res) {
                var questionnaireId = res;
                questionnaireModel.form.id = questionnaireId;
                window['questionnaireId'] = questionnaireModel.form.id;

                questionnaireModel.showAddBtn = true;
                Common.tip.add({
                    text: Config.tips['SubmitFormSuccess'],
                    type: 'success'
                });
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            }
        });
    }


    function ajaxPostTopic() {
        if (ajaxPostTopicHandle != null) {
            ajaxPostTopicHandle.abort();
        }
        ajaxPostTopicHandle = Common.ajax({
            url: ajaxPostTopicUrl,
            type: 'POST',
            data: $.extend({}, topicModel.form.$model),
            success: function (res) {
                var topicId = res;
                topicModel.form.id = topicId;
                questionnaireModel.form.topicCount++;
                topicModel.showAddBtn = true;
                $('#topicSequence').attr('data-validator', '');
                $('#topicSequence').attr('disabled', true);
                Common.tip.add({
                    text: Config.tips['SubmitFormSuccess'],
                    type: 'success'
                });
                ajaxGetTopics();
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            }
        });
    }

    function ajaxPostOption() {
        if (ajaxPostOptionHandle != null) {
            ajaxPostOptionHandle.abort();
        }
        ajaxPostOptionHandle = Common.ajax({
            url: ajaxPostOptionUrl,
            type: 'POST',
            data: $.extend({}, optionModel.form.$model),
            success: function (res) {
                var optionId = res;
                optionModel.form.id = optionId;
                topicModel.form.optionCount++;
                optionModel.editMode = false;
                topicModel.showAddBtn = true;
                Common.tip.add({
                    text: Config.tips['SubmitFormSuccess'],
                    type: 'success'
                });
                ajaxGetOptions();
                optionModel.clearFormData();
                topicModel.showDialog = false;
                clearErrorTip(optionForm);
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            }
        });
    }

    function ajaxDeleteTopic() {
        if (ajaxDeleteTopicHandle != null) {
            ajaxDeleteTopicHandle.abort();
        }
        ajaxDeleteTopicHandle = Common.ajax({
            url: ajaxDeleteTopicUrl,
            type: 'DELETE',
            success: function (res) {
                ajaxGetTopics();
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            }
        })
    }

    function ajaxDeleteOption() {
        if (ajaxDeleteOptionHandle != null) {
            ajaxDeleteOptionHandle.abort();
        }
        ajaxDeleteOptionHandle = Common.ajax({
            url: ajaxDeleteOptionUrl,
            type: 'DELETE',
            success: function (res) {
                ajaxGetOptions();
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            }
        })
    }

    function active() {
        avalon.scan(document.body);
        setTimeout(function () {
            bindEvent();
            ajaxGetDictonaries();
            if (window['questionnaireId']) {
                questionnaireModel.form.id = window['questionnaireId'];
            }
            questionnaireForm = $('#questionnaireForm');
            topicForm = $('#topicForm');
            optionForm = $('#optionForm');
            $('#topicEditDialog').modal({
                backdrop: false,
                keyboard: false,
                show: false
            });
        })
    };

    active();

    window.checkTopicSequence = function () {
        var tip = false;
        if ($('#topicSequence').val()) {
            $.each(questionnaireModel.topics.topicList, function (index, el) {
                if ($('#topicSequence').val() == el.sequence) {
                    tip = true;
                    return false;
                }
            });
        }
        return {
            isError: tip,
            errorInfo: '请检查序号是否重复'
        };
    }

    window.checkOptionSequence = function () {
        var tip = false;
        if ($('#optionSequence').val()) {
            $.each(topicModel.options.optionList, function (index, el) {
                if ($('#optionSequence').val() == el.sequence) {
                    tip = true;
                    return false;
                }
            });
        }
        return {
            isError: tip,
            errorInfo: '请检查序号是否重复'
        };
    }
})();