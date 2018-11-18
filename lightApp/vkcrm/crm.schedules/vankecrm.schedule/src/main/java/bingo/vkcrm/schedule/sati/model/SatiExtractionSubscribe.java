package bingo.vkcrm.schedule.sati.model;

import java.util.Date;
   /**
    * sati_extraction_subscribe 实体类
    * Mon Nov 02 10:24:00 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class SatiExtractionSubscribe{
	
	private String id;//唯一主键
	private String questionnaireId;//问卷ID
	private String projectId;//项目ID
	private String gridId;//网格ID
	private String houseId;//房屋ID
	private String customerId;//客户ID
	private String type;//类型 强制抽取或预约
	private Date appointmentTime;//预约时间
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setQuestionnaireId(String questionnaireId){
		this.questionnaireId=questionnaireId;
	}
	public String getQuestionnaireId(){
		return questionnaireId;
	}
	public void setProjectId(String projectId){
		this.projectId=projectId;
	}
	public String getProjectId(){
		return projectId;
	}
	public void setGridId(String gridId){
		this.gridId=gridId;
	}
	public String getGridId(){
		return gridId;
	}
	public void setHouseId(String houseId){
		this.houseId=houseId;
	}
	public String getHouseId(){
		return houseId;
	}
	public void setCustomerId(String customerId){
		this.customerId=customerId;
	}
	public String getCustomerId(){
		return customerId;
	}
	public void setType(String type){
		this.type=type;
	}
	public String getType(){
		return type;
	}
	public void setAppointmentTime(Date appointmentTime){
		this.appointmentTime=appointmentTime;
	}
	public Date getAppointmentTime(){
		return appointmentTime;
	}
}

