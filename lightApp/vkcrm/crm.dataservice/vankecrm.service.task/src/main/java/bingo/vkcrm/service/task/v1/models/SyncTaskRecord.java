package bingo.vkcrm.service.task.v1.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by szsonic on 2015/12/2.
 */
public class SyncTaskRecord {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date created;
    private String taskNo;
    private String crmSource;
    private String content;
    private String source;
    private String projectCode;
    private String projectName;
    private String houseCode;
    private String houseName;
    private String status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date appointmentStartTime;
    private Boolean isSubscribe;
    private String reportUserMobile;
    private String crmEvaluation;
    private String mobile;

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public String getTaskNo() {
        return taskNo;
    }

    public void setTaskNo(String taskNo) {
        this.taskNo = taskNo;
    }

    public String getCrmSource() {
        return crmSource;
    }

    public void setCrmSource(String crmSource) {
        this.crmSource = crmSource;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getAppointmentStartTime() {
        return appointmentStartTime;
    }

    public void setAppointmentStartTime(Date appointmentStartTime) {
        this.appointmentStartTime = appointmentStartTime;
    }

    public Boolean getIsSubscribe() {
        return isSubscribe;
    }

    public void setIsSubscribe(Boolean isSubscribe) {
        this.isSubscribe = isSubscribe;
    }

    public String getReportUserMobile() {
        return reportUserMobile;
    }

    public void setReportUserMobile(String reportUserMobile) {
        this.reportUserMobile = reportUserMobile;
    }

    public String getCrmEvaluation() {
        return crmEvaluation;
    }

    public void setCrmEvaluation(String crmEvaluation) {
        this.crmEvaluation = crmEvaluation;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
}
