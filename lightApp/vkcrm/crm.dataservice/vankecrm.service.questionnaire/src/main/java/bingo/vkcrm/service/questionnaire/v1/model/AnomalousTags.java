package bingo.vkcrm.service.questionnaire.v1.model;

import java.util.Date;

import bingo.dao.orm.annotations.Table;

/**
 * 客户异常标签
 * @author chengsiyuan
 *
 */
@Table(name = "dim_anomalous_tags")
public class AnomalousTags {

	/**
	 * id
	 */
	private String id;
	/**
	 * 答卷id
	 */
	private String answerId;
	/**
	 * 问卷id
	 */
	private String questionnaireId;
	/**
	 * 项目id
	 */
	private String projectId;
	/**
	 * 房屋id
	 */
	private String houseId;
	/**
	 * 客户id
	 */
	private String customerId;
	/**
	 * 标签类型
	 */
	private Integer tagCategory;
	/**
	 * 标签值
	 */
	private String tagValue;
	/**
	 * 异常类型
	 */
	private Integer errorCategory;
	/**
	 * 异常内容
	 */
	private String errorContent;
	/**
	 * 创建时间
	 */
	private Date ctime;

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getAnswerId() {
		return answerId;
	}
	
	public void setAnswerId(String answerId) {
		this.answerId = answerId;
	}

	public String getQuestionnaireId() {
		return questionnaireId;
	}

	public void setQuestionnaireId(String questionnaireId) {
		this.questionnaireId = questionnaireId;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getHouseId() {
		return houseId;
	}

	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}

	public String getCustomerId() {
		return customerId;
	}
	
	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}
	
	public Integer getTagCategory() {
		return tagCategory;
	}
	
	public void setTagCategory(Integer tagCategory) {
		this.tagCategory = tagCategory;
	}
	
	public String getTagValue() {
		return tagValue;
	}
	
	public void setTagValue(String tagValue) {
		this.tagValue = tagValue;
	}
	
	public Integer getErrorCategory() {
		return errorCategory;
	}
	
	public void setErrorCategory(Integer errorCategory) {
		this.errorCategory = errorCategory;
	}
	
	public String getErrorContent() {
		return errorContent;
	}
	
	public void setErrorContent(String errorContent) {
		this.errorContent = errorContent;
	}

	public Date getCtime() {
		return ctime;
	}

	public void setCtime(Date ctime) {
		this.ctime = ctime;
	}


}
