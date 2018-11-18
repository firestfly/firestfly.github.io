package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.dao.orm.annotations.Table;

/**
 * 答卷通话记录
 * @author Administrator
 *
 */
@Table(name = "mid_answer_callrecords")
public class AnswerCallRecords {

	private String answerId;
	private String callRecordId;
	public String getAnswerId() {
		return answerId;
	}
	public void setAnswerId(String answerId) {
		this.answerId = answerId;
	}
	public String getCallRecordId() {
		return callRecordId;
	}
	public void setCallRecordId(String callRecordId) {
		this.callRecordId = callRecordId;
	}
	
	
}
