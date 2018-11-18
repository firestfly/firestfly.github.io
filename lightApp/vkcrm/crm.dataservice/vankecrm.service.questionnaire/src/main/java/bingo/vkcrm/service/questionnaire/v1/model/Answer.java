package bingo.vkcrm.service.questionnaire.v1.model;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;
/**
 * 答卷
 * @author chengsiyuan
 *
 */
@Table(name = "biz_answer")
public class Answer {

	/**
	 * 答卷ID
	 */
	@UUID
	private String answerId;
	/**
	 * 所属问卷ID
	 */
	private String questionnaireId;
	/**
	 * 客户ID
	 */
	private String customerId;
	/**
	 * 客户名字
	 */
	private String customerName;
	/**
	 * 房屋ID
	 */
	private String houseId;
	/**
	 * 项目id
	 */
	private String projectId;
	/**
	 * 异常编码
	 */
	private Integer abnormalCode;
	/**
	 * 异常内容
	 */
	private String abnormalContent;
	/**
	 * 是否正常完成
	 */
	private Boolean completed;
	/**
	 * 完成时间
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date completedTime;
	/**
	 * 项目名称
	 */
	private String projectName;
	/**
	 * 物业地址
	 */
	private String houseAddr;
	/**
	 * 答题列表
	 */
	private List<AnswerItem> answerItemList;
	
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
	
	public String getCustomerId() {
		return customerId;
	}
	
	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}
	
	public String getHouseId() {
		return houseId;
	}
	
	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}
	
	public Integer getAbnormalCode() {
		return abnormalCode;
	}
	
	public void setAbnormalCode(Integer abnormalCode) {
		this.abnormalCode = abnormalCode;
	}
	
	public String getAbnormalContent() {
		return abnormalContent;
	}
	
	public void setAbnormalContent(String abnormalContent) {
		this.abnormalContent = abnormalContent;
	}
	
	public Boolean getCompleted() {
		return completed;
	}
	
	public void setCompleted(Boolean completed) {
		this.completed = completed;
	}
	
	public Date getCompletedTime() {
		return completedTime;
	}
	
	public void setCompletedTime(Date completedTime) {
		this.completedTime = completedTime;
	}
	
	public List<AnswerItem> getAnswerItemList() {
		return answerItemList;
	}
	
	public void setAnswerItemList(List<AnswerItem> answerItemList) {
		this.answerItemList = answerItemList;
	}
	
	public String getProjectName() {
		return projectName;
	}
	
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	
	public String getHouseAddr() {
		return houseAddr;
	}
	
	public void setHouseAddr(String houseAddr) {
		this.houseAddr = houseAddr;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}
}
