package bingo.vkcrm.service.questionnaire.v1.model;

import java.util.Date;

import bingo.vkcrm.service.model.BaseModel;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 通话记录查询结果对象
 *
 * @author chengsiyuan
 */
public class CallRecordResult extends BaseModel {

    private String callRecordId;
    /**
     * 话务ID
     */
    private String callId;
    /**
     * 通话时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date callTime;
    /**
     * 开始时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    /**
     * 结束时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    /**
     * 通过时长
     */
    private Integer duration;
    /**
     * 通话时分秒
     */
    @DateTimeFormat(pattern = "HH:mm:ss")
    private Date durationTime;
    /**
     * 挂机方
     */
    private String hangUp;
    /**
     * 话务员
     */
    private String telephonist;
    /**
     * 话务员ID
     */
    private String telephonistId;
    /**
     * 接触号码
     */
    private String callNumber;
    /**
     * 流水号
     */
    private String recordNo;
    /**
     * 标题
     */
    private String title;
    /**
     * 项目ID
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
     * 房屋ID
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
     * 异常说明
     */
    private String abnormalContent;
    /**
     * 已接通异常类型
     */
    private String abnormalCode;
    /**
     * 已接通异常类型文本
     */
    private String abnormalText;

    /**
     * 未接通异常类型
     */
    private String errorCategory;

    /**
     * 未接通异常类型文本
     */
    private String errorCategoryText;

    /**
     * 客户ID
     */
    private String customerId;
    /**
     * 客户编码
     */
    private String customerCode;
    /**
     * 客户名称
     */
    private String customerName;
    /**
     * 答案ID
     */
    private String answerId;
    /**
     * 问卷ID
     */
    private String questionnaireId;
    /**
     * 是否完成
     */
    private String completed;
    /**
     * 来源
     */
    private String source;
    /**
     * 任务编号
     */
    private String tasks;
    /**
     * 任务编号(全)
     */
    private String taskAll;

    public String getCallRecordId() {
        return callRecordId;
    }

    public void setCallRecordId(String callRecordId) {
        this.callRecordId = callRecordId;
    }

    public String getCallId() {
        return callId;
    }

    public void setCallId(String callId) {
        this.callId = callId;
    }

    public Date getCallTime() {
        return callTime;
    }

    public void setCallTime(Date callTime) {
        this.callTime = callTime;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getTelephonist() {
        return telephonist;
    }

    public void setTelephonist(String telephonist) {
        this.telephonist = telephonist;
    }

    public String getHangUp() {
        return hangUp;
    }

    public void setHangUp(String hangUp) {
        this.hangUp = hangUp;
    }

    public String getTelephonistId() {
        return telephonistId;
    }

    public void setTelephonistId(String telephonistId) {
        this.telephonistId = telephonistId;
    }

    public String getCallNumber() {
        return callNumber;
    }

    public void setCallNumber(String callNumber) {
        this.callNumber = callNumber;
    }

    public String getRecordNo() {
        return recordNo;
    }

    public void setRecordNo(String recordNo) {
        this.recordNo = recordNo;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getAbnormalContent() {
        return abnormalContent;
    }

    public void setAbnormalContent(String abnormalContent) {
        this.abnormalContent = abnormalContent;
    }

    public String getAbnormalCode() {
        return abnormalCode;
    }

    public void setAbnormalCode(String abnormalCode) {
        this.abnormalCode = abnormalCode;
    }

    public String getErrorCategory() {
        return errorCategory;
    }

    public void setErrorCategory(String errorCategory) {
        this.errorCategory = errorCategory;
    }

    public Date getDurationTime() {
        return durationTime;
    }

    public void setDurationTime(Date durationTime) {
        this.durationTime = durationTime;
    }

    public String getAbnormalText() {
        return getValue("AnswerAbnormalCode", this.abnormalCode);
    }

    public String getErrorCategoryText() {
        return getValue("AnomalousErrorCategory", this.errorCategory);
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(String questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public String getAnswerId() {
        return answerId;
    }

    public void setAnswerId(String answerId) {
        this.answerId = answerId;
    }

    public String getCompleted() {
        return completed;
    }

    public void setCompleted(String completed) {
        this.completed = completed;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTasks() {
        return tasks;
    }

    public void setTasks(String tasks) {
        this.tasks = tasks;
    }

    public String getTaskAll() {
        return taskAll;
    }

    public void setTaskAll(String taskAll) {
        this.taskAll = taskAll;
    }
}
