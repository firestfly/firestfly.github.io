package bingo.vkcrm.service.report.v1.model;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.service.model.BaseModel;
import bingo.vkcrm.common.utils.CacheUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.StringUtils;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.Map;

/**
 * Created by szsonic on 2016/1/23/023.
 */
public class TaskRecordReport extends BaseModel {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date   created;//创建时间
    private String taskNo;//任务流水号
    private String contact;//联系人
    private String source;//任务来源
    private String content;//任务内容
    private String MCId;//运营中心ID
    private String mcname;//运营中心名称
    private String city;//城市
    private String projectId;//项目ID
    private String projectCode;//项目code
    private String projectName;//项目名称
    private String gridId;//网格ID
    private String gridName;//网格名称
    private String buildName;//楼栋名称
    private String houseName;//房屋名称
    private String houseId;//房屋ID
    private String houseCode;//房屋code
    private String status;//任务状态
    private String staff;//任务创建人
    private String reportUserMobile;//来电号码
    private String mobile;//联系电话
    private String process;//处理方式
    private String processingWay;//处理方式(code)
    private String isOrder;//是否预约
    private String isCancel;//是否取消
    private String crmEvaluation;//人工评价
    private String evaluationUser;//评价人
    private String evaluationUserId;//评价人ID
    private String crmDuty;//定责
    private String dutyUser;//定责人
    private String dutyUserId;//定责人
    private String crmSource;//crm任务来源
    private String businessType;//任务类型
    private String isTimeout;//是否超时
    private String score;//系统评价，
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date appointmentStartTime;//预约时间


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

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMCId() {
        return MCId;
    }

    public void setMCId(String MCId) {
        this.MCId = MCId;
    }



    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
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

    public String getGridId() {
        return gridId;
    }

    public void setGridId(String gridId) {
        this.gridId = gridId;
    }

    public String getGridName() {
        return gridName;
    }

    public void setGridName(String gridName) {
        this.gridName = gridName;
    }

    public String getBuildName() {
        return buildName;
    }

    public void setBuildName(String buildName) {
        this.buildName = buildName;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStaff() {
        return staff;
    }

    public void setStaff(String staff) {
        this.staff = staff;
    }

    public String getReportUserMobile() {
        return reportUserMobile;
    }

    public void setReportUserMobile(String reportUserMobile) {
        this.reportUserMobile = reportUserMobile;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getProcess() {
        return process;
    }

    public void setProcess(String process) {
        this.process = process;
    }

    public String getProcessingWay() {
        return processingWay;
    }

    public void setProcessingWay(String processingWay) {
        this.processingWay = processingWay;
    }

    public String getIsOrder() {
        return isOrder;
    }

    public void setIsOrder(String isOrder) {
        this.isOrder = isOrder;
    }

    public String getIsCancel() {
        return isCancel;
    }

    public void setIsCancel(String isCancel) {
        this.isCancel = isCancel;
    }

    public String getCrmEvaluation() {
        return crmEvaluation;
    }

    public void setCrmEvaluation(String crmEvaluation) {
        this.crmEvaluation = crmEvaluation;
    }

    public String getEvaluationUser() {
        return evaluationUser;
    }

    public void setEvaluationUser(String evaluationUser) {
        this.evaluationUser = evaluationUser;
    }

    public String getEvaluationUserId() {
        return evaluationUserId;
    }

    public void setEvaluationUserId(String evaluationUserId) {
        this.evaluationUserId = evaluationUserId;
    }

    public String getCrmDuty() {
        return crmDuty;
    }

    public void setCrmDuty(String crmDuty) {
        this.crmDuty = crmDuty;
    }

    public String getDutyUser() {
        return dutyUser;
    }

    public void setDutyUser(String dutyUser) {
        this.dutyUser = dutyUser;
    }

    public String getDutyUserId() {
        return dutyUserId;
    }

    public void setDutyUserId(String dutyUserId) {
        this.dutyUserId = dutyUserId;
    }

    public String getCrmSource() {
        return crmSource;
    }

    public void setCrmSource(String crmSource) {
        this.crmSource = crmSource;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getIsTimeout() {
        return isTimeout;
    }

    public void setIsTimeout(String isTimeout) {
        this.isTimeout = isTimeout;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public Date getAppointmentStartTime() {
        return appointmentStartTime;
    }

    public void setAppointmentStartTime(Date appointmentStartTime) {
        this.appointmentStartTime = appointmentStartTime;
    }

    public String getMcname() {
        return mcname;
    }

    public void setMcname(String mcname) {
        this.mcname = mcname;
    }
}
