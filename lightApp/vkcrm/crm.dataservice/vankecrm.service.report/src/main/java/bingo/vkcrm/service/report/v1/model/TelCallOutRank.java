package bingo.vkcrm.service.report.v1.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

/**
 * 呼出排行榜
 */
public class TelCallOutRank {

    /**
     * 话务员ID
     */
    private String telephonistId;

    /**
     * 话务员名称
     */
    private String telephonist;

    /**
     * 接话量
     */
    private Integer callInCount;

    /**
     * 话后满意度评价
     */
    private Integer ivr;

    /**
     * 平均接话量（小时）
     */
    private Integer avgCallInCount;

    /**
     * 平均通话时长
     */
    private Integer avgCallInTime;

    /**
     * 新增任务数
     */
    private Integer taskCount;

    /**
     * 在线解决率
     */
    private Integer onlineFixCount;

    /**
     * 有效工时利用率
     */
    private Integer validFactor;

    /**
     * 外呼量
     */
    private Integer callOutCount;

    /**
     * 平均外呼时长
     */
    private Integer avgCallOutTime;

    /**
     * 呼入呼出比
     */
    private Double callInCallOutPercent;

    /**
     * 转出电话量
     */
    private Integer transCount;

    /**
     * 咨询电话量
     */
    private Integer consuCount;

    /**
     * 置忙次数
     */
    private Integer busyCount;

    /**
     * 时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date stateTime;

    public String getTelephonistId() {
        return telephonistId;
    }

    public void setTelephonistId(String telephonistId) {
        this.telephonistId = telephonistId;
    }

    public String getTelephonist() {
        return telephonist;
    }

    public void setTelephonist(String telephonist) {
        this.telephonist = telephonist;
    }

    public Integer getCallInCount() {
        return callInCount;
    }

    public void setCallInCount(Integer callInCount) {
        this.callInCount = callInCount;
    }

    public Integer getIvr() {
        return ivr;
    }

    public void setIvr(Integer ivr) {
        this.ivr = ivr;
    }

    public Integer getAvgCallInCount() {
        return avgCallInCount;
    }

    public void setAvgCallInCount(Integer avgCallInCount) {
        this.avgCallInCount = avgCallInCount;
    }

    public Integer getAvgCallInTime() {
        return avgCallInTime;
    }

    public void setAvgCallInTime(Integer avgCallInTime) {
        this.avgCallInTime = avgCallInTime;
    }

    public Integer getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(Integer taskCount) {
        this.taskCount = taskCount;
    }

    public Integer getOnlineFixCount() {
        return onlineFixCount;
    }

    public void setOnlineFixCount(Integer onlineFixCount) {
        this.onlineFixCount = onlineFixCount;
    }

    public Integer getValidFactor() {
        return validFactor;
    }

    public void setValidFactor(Integer validFactor) {
        this.validFactor = validFactor;
    }

    public Integer getCallOutCount() {
        return callOutCount;
    }

    public void setCallOutCount(Integer callOutCount) {
        this.callOutCount = callOutCount;
    }

    public Integer getAvgCallOutTime() {
        return avgCallOutTime;
    }

    public void setAvgCallOutTime(Integer avgCallOutTime) {
        this.avgCallOutTime = avgCallOutTime;
    }

    public Double getCallInCallOutPercent() {
        return callInCallOutPercent;
    }

    public void setCallInCallOutPercent(Double callInCallOutPercent) {
        this.callInCallOutPercent = callInCallOutPercent;
    }

    public Integer getTransCount() {
        return transCount;
    }

    public void setTransCount(Integer transCount) {
        this.transCount = transCount;
    }

    public Integer getConsuCount() {
        return consuCount;
    }

    public void setConsuCount(Integer consuCount) {
        this.consuCount = consuCount;
    }

    public Integer getBusyCount() {
        return busyCount;
    }

    public void setBusyCount(Integer busyCount) {
        this.busyCount = busyCount;
    }

    public Date getStateTime() {
        return stateTime;
    }

    public void setStateTime(Date stateTime) {
        this.stateTime = stateTime;
    }
}
