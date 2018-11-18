package bingo.vkcrm.service.task.v1.models;

import java.util.Date;
import java.util.List;

import bingo.vkcrm.service.model.BaseModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Table;

/**
 * Created by szsonic on 2015/9/14.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "task_records")
public class TaskInfo extends BaseModel{

    /**
     * 任务编号（App返回）
     */
    private String task_no;
    /**
     * 任务标题
     */
    private String title;
    /**
     * 任务描述
     */
    private String desc;
    /**
     * 处理时联系人姓名/称呼
     */
    private String contact;
    /**
     * 处理时联系人手机
     */
    private String mobile;
    /**
     * 任务相关地址
     */
    private String address;
    /**
     * 任务内容
     */
    private String content;
    /**
     * 任务内容截取前20字符显示
     */
    private String contentText;
    /**
     * 项目id
     */
    private String project_Id;
    /**
     * 项目编码
     */
    private String project_code;
    /**
     * 项目名称
     */
    private String project_name;
    /**
     * 房屋id
     */
    private String house_id;
    /**
     * 房屋编码
     */
    private String house_code;
    /**
     * 房屋名称
     */
    private String house_name;
    /**
     * 业务类型编码
     */
    private String business_type;
    /**
     * 业务类型名称
     */
    private String business_name;
    /**
     * 数据来源
     */
    private String source;
    
    /**
     * 任务来源(call in)人的手机号
     */
    private String report_user_mobile;
    /**
     * 联系人id
     */
    private String contactsUserId;
    /**
     * 联系人姓名
     */
    private String contactsName;
    /**
     * 联系电话
     */
    private String contactsMobile;
    /**
     * 业务类型完整编码（以.分割）
     */
    private String businessTypeFullCode;
    
    private Integer system_head;
    
    private String staff_mobile;
    
    private String paid;
    

    private Integer score;
    
    private Integer staff;
    
    private String crm_duty;
    
    private String crm_evaluation;
    
    private String crm_priority;

	private String crm_source;
    /**
     * 期望开始时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date appointment_start_time;
    /**
     * 期望结束时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date appointment_end_time;
    private Boolean isSync;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date lastSyncTime;
    private String creator;
    private String creatorId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date created;
    private String status;
    private String statusText;
    private List images;
    
    private List<AppTimeline> timeline;

    private String errorCode;
    
    private String errorMsg;

	public String getTask_no() {
		return task_no;
	}

	public void setTask_no(String task_no) {
		this.task_no = task_no;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getContentText() {
		return contentText;
	}

	public void setContentText(String contentText) {
		this.contentText = contentText;
	}

	public String getProject_Id() {
		return project_Id;
	}

	public void setProject_Id(String project_Id) {
		this.project_Id = project_Id;
	}

	public String getProject_code() {
		return project_code;
	}

	public void setProject_code(String project_code) {
		this.project_code = project_code;
	}

	public String getProject_name() {
		return project_name;
	}

	public void setProject_name(String project_name) {
		this.project_name = project_name;
	}

	public String getHouse_id() {
		return house_id;
	}

	public void setHouse_id(String house_id) {
		this.house_id = house_id;
	}

	public String getHouse_code() {
		return house_code;
	}

	public void setHouse_code(String house_code) {
		this.house_code = house_code;
	}

	public String getHouse_name() {
		return house_name;
	}

	public void setHouse_name(String house_name) {
		this.house_name = house_name;
	}

	public String getBusiness_type() {
		return business_type;
	}

	public void setBusiness_type(String business_type) {
		this.business_type = business_type;
	}
	
	public Integer getSystem_head() {
		return system_head;
	}

	public void setSystem_head(Integer system_head) {
		this.system_head = system_head;
	}

	public String getStaff_mobile() {
		return staff_mobile;
	}

	public void setStaff_mobile(String staff_mobile) {
		this.staff_mobile = staff_mobile;
	}

	
	public String getCrm_duty() {
		return crm_duty;
	}

	public void setCrm_duty(String crm_duty) {
		this.crm_duty = crm_duty;
	}

	public String getPaid() {
		return paid;
	}

	public void setPaid(String paid) {
		this.paid = paid;
	}



	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	public Integer getStaff() {
		return staff;
	}

	public void setStaff(Integer staff) {
		this.staff = staff;
	}

	public String getBusiness_name() {
		return business_name;
	}

	public void setBusiness_name(String business_name) {
		this.business_name = business_name;
	}

	public String getReport_user_mobile() {
		return report_user_mobile;
	}

	public void setReport_user_mobile(String report_user_mobile) {
		this.report_user_mobile = report_user_mobile;
	}

	public String getContactsUserId() {
		return contactsUserId;
	}

	public void setContactsUserId(String contactsUserId) {
		this.contactsUserId = contactsUserId;
	}

	public String getContactsName() {
		return contactsName;
	}

	public void setContactsName(String contactsName) {
		this.contactsName = contactsName;
	}

	public String getContactsMobile() {
		return contactsMobile;
	}

	public void setContactsMobile(String contactsMobile) {
		this.contactsMobile = contactsMobile;
	}

	public String getBusinessTypeFullCode() {
		return businessTypeFullCode;
	}

	public void setBusinessTypeFullCode(String businessTypeFullCode) {
		this.businessTypeFullCode = businessTypeFullCode;
	}

	public Date getAppointment_start_time() {
		return appointment_start_time;
	}

	public void setAppointment_start_time(Date appointment_start_time) {
		this.appointment_start_time = appointment_start_time;
	}

	public Date getAppointment_end_time() {
		return appointment_end_time;
	}

	public void setAppointment_end_time(Date appointment_end_time) {
		this.appointment_end_time = appointment_end_time;
	}

	public Boolean getIsSync() {
		return isSync;
	}

	public void setIsSync(Boolean isSync) {
		this.isSync = isSync;
	}

	public Date getLastSyncTime() {
		return lastSyncTime;
	}

	public void setLastSyncTime(Date lastSyncTime) {
		this.lastSyncTime = lastSyncTime;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getCreatorId() {
		return creatorId;
	}

	public void setCreatorId(String creatorId) {
		this.creatorId = creatorId;
	}

	public String getCrm_evaluation() {
		return crm_evaluation;
	}

	public void setCrm_evaluation(String crm_evaluation) {
		this.crm_evaluation = crm_evaluation;
	}

	public String getCrm_priority() {
		return crm_priority;
	}

	public void setCrm_priority(String crm_priority) {
		this.crm_priority = crm_priority;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getStatusText() {
		return statusText;
	}

	public void setStatusText(String statusText) {
		this.statusText = statusText;
	}



	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public String getSource() {
		if(this.source.equals("crm")){
			return getValue("TaskSource",this.crm_source);
		}
		return getValue("AppTaskSource",this.source);
	}

	public void setSource(String source) {
		this.source = source;
	}


	public String getCrm_source() {
		return crm_source;
	}

	public void setCrm_source(String crm_source) {
		this.crm_source = crm_source;
	}

	/**
     * 任务相关图片列表
     */
	public List getImages() {
		return images;
	}

	public void setImages(List images) {
		this.images = images;
	}

	public List<AppTimeline> getTimeline() {
		return timeline;
	}

	public void setTimeline(List<AppTimeline> timeline) {
		this.timeline = timeline;
	}

}
