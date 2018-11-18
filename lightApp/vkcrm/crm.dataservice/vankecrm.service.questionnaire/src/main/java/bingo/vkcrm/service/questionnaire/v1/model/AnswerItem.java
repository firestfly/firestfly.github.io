package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.dao.orm.annotations.Table;

/**
 * 答卷题目结果
 * @author Administrator
 *
 */
@Table(name = "biz_answer_items")
public class AnswerItem {

	/**
	 * 答卷ID
	 */
	private String answerId;
	/**
	 * 题目ID
	 */
	private String topicId;
	/**
	 * 答案内容
	 */
	private String content;
	
	public String getAnswerId() {
		return answerId;
	}
	
	public void setAnswerId(String answerId) {
		this.answerId = answerId;
	}
	
	public String getTopicId() {
		return topicId;
	}

	public void setTopicId(String topicId) {
		this.topicId = topicId;
	}

	public String getContent() {
		return content;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
}
