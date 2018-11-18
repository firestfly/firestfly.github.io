package bingo.vkcrm.service.task.v1.models;

import bingo.dao.orm.annotations.IsKey;
import bingo.dao.orm.annotations.Table;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by szsonic on 2015/9/14.
 */
@Table(name = "task_records")
public class TaskRecords {
    @IsKey
    private String id;
    /**
     * 任务编号（App返回）
     */
    private String taskNo;
    private Integer taskdeal;
    /**
     * 通话记录编码
     */
    private String callNo;
    /**
     * 任务标题
     */
    private String title;
    /**
     * 任务内容
     */
    private String content;
    
    /**
     * 任务内容截取前20字符
     */
    private String contentText;
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
     * 项目id
     */
    private String projectId;
    /**
     * 项目编码
     */
    private String projectCode;
    /**
     * 项目名称
     */
    private String projectName;
    /**
     * 房屋id
     */
    private String houseId;
    /**
     * 房屋编码
     */
    private String houseCode;
    /**
     * 房屋名称
     */
    private String houseName;
    /**
     * 任务来电号码
     */
    private String reportUserMobile;
    /**
     * 任务相关地址
     */
    private String address;
    /**
     * 业务类型编码
     */
    private String businessType;
    /**
     * 业务类型编码Text
     */
    private String businessTypeText;
    /**
     * 业务类型完整编码（以.分割）
     */
    private String businessTypeFullCode;
    /**
     * 期望开始时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date appointmentStartTime;
    /**
     * 期望结束时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date appointmentEndTime;
    private Boolean isSync;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date lastSyncTime;
    private String creator;
    private String creatorId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private Integer status;
    private String statusText;
    private Boolean isHasNotice;
    private String source;
    private String sourceText;
    private String levelType;
    private String levelTypeText;
    private Integer processingWay;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date callTime;
    private String callRecordId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTaskNo() {
        return taskNo;
    }

    public void setTaskNo(String taskNo) {
        this.taskNo = taskNo;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getHouseCode() {
        return houseCode;
    }

    public void setHouseCode(String houseCode) {
        this.houseCode = houseCode;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getBusinessTypeText() {
		return businessTypeText;
	}

	public void setBusinessTypeText(String businessTypeText) {
		this.businessTypeText = businessTypeText;
	}

	public String getBusinessTypeFullCode() {
        return businessTypeFullCode;
    }

    public void setBusinessTypeFullCode(String businessTypeFullCode) {
        this.businessTypeFullCode = businessTypeFullCode;
    }

    public Date getAppointmentStartTime() {
        return appointmentStartTime;
    }

    public void setAppointmentStartTime(Date appointmentStartTime) {
        this.appointmentStartTime = appointmentStartTime;
    }

    public Date getAppointmentEndTime() {
        return appointmentEndTime;
    }

    public void setAppointmentEndTime(Date appointmentEndTime) {
        this.appointmentEndTime = appointmentEndTime;
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

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getReportUserMobile() {
        return reportUserMobile;
    }

    public void setReportUserMobile(String reportUserMobile) {
        this.reportUserMobile = reportUserMobile;
    }


    public String getStatusText() {
        return statusText;
    }

    public void setStatusText(String statusText) {
        this.statusText = statusText;
    }


    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Boolean getIsHasNotice() {
        return isHasNotice;
    }

    public void setIsHasNotice(Boolean isHasNotice) {
        this.isHasNotice = isHasNotice;
    }

    public String getCallNo() {
        return callNo;
    }

    public void setCallNo(String callNo) {
        this.callNo = callNo;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getLevelType() {
        return levelType;
    }

    public void setLevelType(String levelType) {
        this.levelType = levelType;
    }

	public String getSourceText() {
		return sourceText;
	}

	public void setSourceText(String sourceText) {
		this.sourceText = sourceText;
	}

	public String getLevelTypeText() {
		return levelTypeText;
	}

	public void setLevelTypeText(String levelTypeText) {
		this.levelTypeText = levelTypeText;
	}



    public Date getCallTime() {
        return callTime;
    }

    public void setCallTime(Date callTime) {
        this.callTime = callTime;
    }

    public Integer getProcessingWay() {
        return processingWay;
    }

    public void setProcessingWay(Integer processingWay) {
        this.processingWay = processingWay;
    }

    public Integer getTaskdeal() {
        return taskdeal;
    }

    public void setTaskdeal(Integer taskdeal) {
        this.taskdeal = taskdeal;
    }

    public String getCallRecordId() {
        return callRecordId;
    }

    public void setCallRecordId(String callRecordId) {
        this.callRecordId = callRecordId;
    }
}
