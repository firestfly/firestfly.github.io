package bingo.vkcrm.service.tel.v1.models;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 话务查询结果实例
 *
 * @author chengsiyuan
 */
public class CallRecords {

    private String id;
    /**
     * 通话id
     */
    private String callId;
    //录音流水号
    private String tapeCode;
    //通话来电时间
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date callTime;
    //通话类型
    private Integer type;
    //通话记录内容
    private String typeText;
    //来电号码
    private String callNumber;
    //通话时长
    private Integer duration;
    //通话时分秒
    @DateTimeFormat(pattern = "HH:mm:ss")
    private Date durationTime;
    //挂机方
    private String HangUp;
    //受理人姓名（话务员姓名）
    private String telephonist;
    //满意度评价（暂定）
    private String satifaction;
    //任务单号部分
    private String tasks;
    //任务单号全部
    private String tasksAll;
    //通话原因(截取部分)
    private String reasons;
    //全部通话原因
    private String reasonsAll;
    private String reasonCodes;
    //质检情况
    private String hasCheck;
    //接听电话时间
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date beginTime;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCallId() {
        return callId;
    }

    public void setCallId(String callId) {
        this.callId = callId;
    }

    public String getTapeCode() {
        return tapeCode;
    }

    public void setTapeCode(String tapeCode) {
        this.tapeCode = tapeCode;
    }

    public Date getCallTime() {
        return callTime;
    }

    public void setCallTime(Date callTime) {
        this.callTime = callTime;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getCallNumber() {
        return callNumber;
    }

    public void setCallNumber(String callNumber) {
        this.callNumber = callNumber;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getHangUp() {
        return HangUp;
    }

    public void setHangUp(String hangUp) {
        HangUp = hangUp;
    }

    public String getTelephonist() {
        return telephonist;
    }

    public void setTelephonist(String telephonist) {
        this.telephonist = telephonist;
    }

    public String getSatifaction() {
        return satifaction;
    }

    public void setSatifaction(String satifaction) {
        this.satifaction = satifaction;
    }

    public String getTasks() {
        return tasks;
    }

    public void setTasks(String tasks) {
        this.tasks = tasks;
    }

    public String getTasksAll() {
        return tasksAll;
    }

    public void setTasksAll(String tasksAll) {
        this.tasksAll = tasksAll;
    }

    public String getReasons() {
        return reasons;
    }

    public void setReasons(String reasons) {
        this.reasons = reasons;
    }

    public String getHasCheck() {
        return hasCheck;
    }

    public void setHasCheck(String hasCheck) {
        this.hasCheck = hasCheck;
    }

    public String getTypeText() {
        return typeText;
    }

    public void setTypeText(String typeText) {
        this.typeText = typeText;
    }

    public Date getDurationTime() {
        return durationTime;
    }

    public void setDurationTime(Date durationTime) {
        this.durationTime = durationTime;
    }

    public String getReasonsAll() {
        return reasonsAll;
    }

    public void setReasonsAll(String reasonsAll) {
        this.reasonsAll = reasonsAll;
    }

    public String getReasonCodes() {
        return reasonCodes;
    }

    public void setReasonCodes(String reasonCodes) {
        this.reasonCodes = reasonCodes;
    }


    public Date getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(Date beginTime) {
        this.beginTime = beginTime;
    }
}
