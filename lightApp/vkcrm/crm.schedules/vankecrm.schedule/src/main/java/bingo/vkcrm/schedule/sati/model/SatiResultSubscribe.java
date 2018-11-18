package bingo.vkcrm.schedule.sati.model;

import java.util.Date;


   /**
    * sati_result_subscribe 实体类
    * Mon Nov 02 10:24:01 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class SatiResultSubscribe{	
	
	private String id;//唯一标志
	private String questionnaireId;//问卷ID
	private String projectId;//项目ID
	private String houseId;//房屋ID
	private String customerId;//客户ID
	private Date appointmentTime;//预约时间
	private String status;//状态
	private String gridId;//网格ID
	
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the questionnaireId
	 */
	public String getQuestionnaireId() {
		return questionnaireId;
	}
	/**
	 * @param questionnaireId the questionnaireId to set
	 */
	public void setQuestionnaireId(String questionnaireId) {
		this.questionnaireId = questionnaireId;
	}
	/**
	 * @return the projectId
	 */
	public String getProjectId() {
		return projectId;
	}
	/**
	 * @param projectId the projectId to set
	 */
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	/**
	 * @return the houseId
	 */
	public String getHouseId() {
		return houseId;
	}
	/**
	 * @param houseId the houseId to set
	 */
	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}
	/**
	 * @return the customerId
	 */
	public String getCustomerId() {
		return customerId;
	}
	/**
	 * @param customerId the customerId to set
	 */
	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}
	/**
	 * @return the appointmentTime
	 */
	public Date getAppointmentTime() {
		return appointmentTime;
	}
	/**
	 * @param appointmentTime the appointmentTime to set
	 */
	public void setAppointmentTime(Date appointmentTime) {
		this.appointmentTime = appointmentTime;
	}
	/**
	 * @return the status
	 */
	public String getStatus() {
		return status;
	}
	/**
	 * @param status the status to set
	 */
	public void setStatus(String status) {
		this.status = status;
	}
	/**
	 * @return the gridId
	 */
	public String getGridId() {
		return gridId;
	}
	/**
	 * @param gridId the gridId to set
	 */
	public void setGridId(String gridId) {
		this.gridId = gridId;
	}
	
	
	
	
}

