(function() {
	var model = avalon.define({
		$id: 'satisfaction',
		questionnaires: {
			questionnaireList: [],
			curPage: 1,
			pageSize: 10,
			editAction: function() {
				var data = avalon(this);
				console.log(data.data('id'));
				if (data.data('id')) {
					window.location.href = path.server + '/page/questionnaires/' + data.data('id');
				}
			},
			removeAction: function() {
				var data = avalon(this);
				console.log(data.data('id'));
				if (window.confirm('您确定要删除问卷?')) {
					ajaxDeleteQuestionnaireUrl = servicePath.questionnaire + '/v1/questionnaires/{questionnaireId}';
					ajaxDeleteQuestionnaireUrl = ajaxDeleteQuestionnaireUrl.replace('{questionnaireId}', data.data('id'));
					ajaxDeleteQuestionnaire();
				}
			},
			stopAction: function() {
				var data = avalon(this);
				console.log(data.data('id'));
				if (window.confirm('您确定要停用问卷?')) {
					ajaxPostQuestionnaireEnabledUrl = servicePath.questionnaire + '/v1/questionnaires/{questionnaireId}/enabled';
					ajaxPostQuestionnaireEnabledUrl = ajaxPostQuestionnaireEnabledUrl.replace('{questionnaireId}', data.data('id'));
					ajaxPostQuestionnaireEnabled({
						isEnabled: 0
					});
				}
			},
			restoreAction: function() {
				var data = avalon(this);
				console.log(data.data('id'));
				if (window.confirm('您确定要启用问卷?')) {
					ajaxPostQuestionnaireEnabledUrl = servicePath.questionnaire + '/v1/questionnaires/{questionnaireId}/enabled';
					ajaxPostQuestionnaireEnabledUrl = ajaxPostQuestionnaireEnabledUrl.replace('{questionnaireId}', data.data('id'));
					ajaxPostQuestionnaireEnabled({
						isEnabled: 1
					});
				}
			}
		},
		showAddBtn: true,
		addQuestionnaireAction: function() {
			window.location.href = path.server + '/page/questionnaire';
		}
	})

	var ajaxGetDictionariesUrl = servicePath.questionnaire + '/v1/dictionaries',
		ajaxGetQuestionnairesUrl = servicePath.questionnaire + '/v1/questionnaires/{curPage}/{pageSize}',
		ajaxDeleteQuestionnaireUrl = servicePath.questionnaire + '/v1/questionnaires/{questionnaireId}',
		ajaxPostQuestionnaireEnabledUrl = servicePath.questionnaire + '/v1/questionnaires/{questionnaireId}/enabled';

	/* 设置分页信息 */
	var questionnairePageInfo = null;

	function bindPageInfo() {
		questionnairePageInfo = new Pagination({
			template: '#paginationtmpl',
			selector: '#pagination',
			onchange: function(pageInfo) {
				model.questionnaires.curPage = pageInfo.curpage;
				ajaxGetQuestionnaires();
			}
		});
	}

	var ajaxGetQuestionnairesHandle = null;

	function ajaxGetQuestionnaires() {
		if (ajaxGetQuestionnairesHandle != null) {
			ajaxGetQuestionnairesHandle.abort();
		}
		if (!model.questionnaires.curPage) {
			model.questionnaires.curPage = 1;
		}
		ajaxGetQuestionnairesUrl = servicePath.questionnaire + '/v1/questionnaires' + '/' + model.questionnaires.curPage + '/' + model.questionnaires.pageSize;
		ajaxGetQuestionnairesHandle = Common.ajax({
			url: ajaxGetQuestionnairesUrl,
			type: 'GET',
			data: {

			},
			success: function(res) {
				model.questionnaires.questionnaireList = res.list;
				/* 更新分页控件 */
				var pageInfo = res.pagination;
				questionnairePageInfo.render({
					curpage: pageInfo.curPage,
					pagesize: pageInfo.pageSize,
					totalpage: pageInfo.totalPage,
					totalsize: pageInfo.totalSize
				});
				model.questionnaires.pageSize = pageInfo.pageSize;
			},
			error: function(error) {
				console.log(error);
				model.questionnaires.questionnaireList = [];
			},
			complete: function() {}
		});
		Common.loading({
			text: '',
			container: '#questionnaireTableContainer',
			handle: ajaxGetQuestionnairesHandle
		});
	}

	var ajaxDeleteQuestionnaireHandle = null;

	function ajaxDeleteQuestionnaire() {
		if (ajaxDeleteQuestionnaireHandle != null) {
			ajaxDeleteQuestionnaireHandle.abort();
		}
		ajaxDeleteQuestionnaireHandle = Common.ajax({
			url: ajaxDeleteQuestionnaireUrl,
			type: 'DELETE',
			success: function(res) {
				ajaxGetQuestionnaires();
			},
			error: function(error) {
				console.log(error);
			},
			complete: function() {}
		})
	}

	var ajaxPostQuestionnaireEnabledHandle = null;

	function ajaxPostQuestionnaireEnabled(data) {
		if (ajaxPostQuestionnaireEnabledHandle != null) {
			ajaxPostQuestionnaireEnabledHandle.abort();
		}
		ajaxPostQuestionnaireEnabledHandle = Common.ajax({
			url: ajaxPostQuestionnaireEnabledUrl,
			type: 'POST',
			data: data,
			success: function(res) {
				ajaxGetQuestionnaires();
				Common.tip.add({
					text: Config.tips['SubmitFormSuccess'],
					type: 'success'
				});
			},
			error: function(error) {
				console.log(error);
			},
			complete: function() {}
		});
	}

	function bindEvent() {

	}


	function active() {
		avalon.scan(null, model);
		setTimeout(function() {
			bindEvent();
			bindPageInfo();
			ajaxGetQuestionnaires();
		})
	}

	active();
})();