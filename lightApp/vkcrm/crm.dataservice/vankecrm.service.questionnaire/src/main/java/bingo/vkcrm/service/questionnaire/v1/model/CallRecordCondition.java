package bingo.vkcrm.service.questionnaire.v1.model;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 查询通话记录条件实体
 *
 * @author chengsiyuan
 */
public class CallRecordCondition {
    /**
     * 开始时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date fromTime;
    /**
     * 结束时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date toTime;
    /**
     * 接触号码
     */
    private String callNumber;
    /**
     * 受理人
     */
    private String telephonist;
    /**
     * 流水号(录音)
     */
    private String tapeCode;
    /**
     * 项目
     */
    private String projectId;
    private String projectName;
    private String projectCode;
    /**
     * 楼栋
     */
    private String buildingId;
    private String buildingName;
    private String buildingCode;
    /**
     * 房屋
     */
    private String houseId;
    private String houseName;
    private String houseCode;
    /**
     * 通话时长
     */
    private String fromDuration;
    private String toDuration;
    /**
     * 问卷名称
     */
    private String questionnaireName;
    /**
     * 异常原因(字典值)
     */
    private String answerAbnormal;
    /**
     * 客户异常(字典值)
     */
    private String anomalousErrorCategory;
    /**
     * 是否已完成调查
     */
    private String isComplete;

    public Date getFromTime() {
        return fromTime;
    }

    public void setFromTime(Date fromTime) {
        this.fromTime = fromTime;
    }

    public Date getToTime() {
        return toTime;
    }

    public void setToTime(Date toTime) {
        this.toTime = toTime;
    }

    public String getCallNumber() {
        return callNumber;
    }

    public void setCallNumber(String callNumber) {
        this.callNumber = callNumber;
    }

    public String getTelephonist() {
        return telephonist;
    }

    public void setTelephonist(String telephonist) {
        this.telephonist = telephonist;
    }

    public String getTapeCode() {
        return tapeCode;
    }

    public void setTapeCode(String tapeCode) {
        this.tapeCode = tapeCode;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(String buildingId) {
        this.buildingId = buildingId;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public String getBuildingCode() {
        return buildingCode;
    }

    public void setBuildingCode(String buildingCode) {
        this.buildingCode = buildingCode;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public String getHouseCode() {
        return houseCode;
    }

    public void setHouseCode(String houseCode) {
        this.houseCode = houseCode;
    }

    public String getFromDuration() {
        return fromDuration;
    }

    public void setFromDuration(String fromDuration) {
        this.fromDuration = fromDuration;
    }

    public String getToDuration() {
        return toDuration;
    }

    public void setToDuration(String toDuration) {
        this.toDuration = toDuration;
    }

    public String getQuestionnaireName() {
        return questionnaireName;
    }

    public void setQuestionnaireName(String questionnaireName) {
        this.questionnaireName = questionnaireName;
    }

    public String getAnswerAbnormal() {
        return answerAbnormal;
    }

    public void setAnswerAbnormal(String answerAbnormal) {
        this.answerAbnormal = answerAbnormal;
    }

    public String getAnomalousErrorCategory() {
        return anomalousErrorCategory;
    }

    public void setAnomalousErrorCategory(String anomalousErrorCategory) {
        this.anomalousErrorCategory = anomalousErrorCategory;
    }

    public String getIsComplete() {
        return isComplete;
    }

    public void setIsComplete(String isComplete) {
        this.isComplete = isComplete;
    }
}
