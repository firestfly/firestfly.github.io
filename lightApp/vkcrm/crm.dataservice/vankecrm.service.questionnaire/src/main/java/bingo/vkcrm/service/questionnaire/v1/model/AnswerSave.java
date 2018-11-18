package bingo.vkcrm.service.questionnaire.v1.model;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

public class AnswerSave {

    /**
     * 答卷id（必填）
     */
    private String answerId;
    /**
     * 客户id（必填）
     */
    private String customerId;
    /**
     * 主题id（拒绝接受调查的客户异常时传参）
     */
    private String subjectId;
    /**
     * 问卷id（必填）
     */
    private String questionnaireId;
    /**
     * 房屋id（预约客户异常时传参）
     */
    private String houseId;
    /**
     * 项目id（预约客户异常时传参）
     */
    private String projectId;
    /**
     * 拒绝接受调查时间段起始时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    /**
     * 拒绝接受调查时间段结束时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    /**
     * 预约客户时间（预约客户异常时传参）
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
    private Date subscribeTime;
    /**
     * 异常编码
     */
    private Integer abnormalCode;
    /**
     * 异常内容
     */
    private String abnormalContent;
    /**
     * 答卷题目数组
     */
    private List<AnswerItem> answerItemList;
    /**
     * 答卷是够完成
     */
    private boolean completed;

    public String getAnswerId() {
        return answerId;
    }

    public void setAnswerId(String answerId) {
        this.answerId = answerId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(String questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public Date getStartTime() {
        return startTime;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
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

    public Date getSubscribeTime() {
        return subscribeTime;
    }

    public void setSubscribeTime(Date subscribeTime) {
        this.subscribeTime = subscribeTime;
    }

    public Integer getAbnormalCode() {
        return abnormalCode;
    }

    public void setAbnormalCode(Integer abnormalCode) {
        this.abnormalCode = abnormalCode;
    }

    public String getAbnormalContent() {
        return abnormalContent;
    }

    public void setAbnormalContent(String abnormalContent) {
        this.abnormalContent = abnormalContent;
    }

    public List<AnswerItem> getAnswerItemList() {
        return answerItemList;
    }

    public void setAnswerItemList(List<AnswerItem> answerItemList) {
        this.answerItemList = answerItemList;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }


}
