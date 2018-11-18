package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

/**
 * 问卷
 */
@Table(name = "biz_questionnaire")
public class Questionnaire {
    /**
     * 问卷编码
     */
    @Column(name = "questionnaire_id")
    private String id;

    /**
     * 主题编码
     */
    private String subjectId;

    /**
     * 问卷标题
     */
    private String title;

    /**
     * 抽样比例
     */
    private int sampleRatio;

    /**
     * 年度完成率
     */
    private int annualCompleteRate;

    /**
     * 开始时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date beginTime;

    /**
     * 结束时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date endTime;

    /**
     * 延迟时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date delayTime;

    /**
     * 问卷说明
     */
    private String description;

    /**
     * 是否启用
     */
    @Column(name = "enabled")
    @JsonProperty(value = "isEnabled")
    private boolean isEnabled;

    /**
     * 状态
     */
    private boolean status;

    /**
     * 问题数量
     */
    private int topicCount;

    /**
     * 题目列表
     */
    @Column(insert = false, update = false)
    private List<Topic> topicList;

    /**
     * 创建人编码
     */
    @Column(name = "cuid")
    private String creatorId;

    /**
     * 创建时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "ctime")
    private Date createTime;

    /**
     * 修改人编码
     */
    @Column(name = "muid")
    private String modifierId;

    /**
     * 修改时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "mtime")
    private Date modifyTime;

    /**
     * 删除人编码
     */
    @Column(name = "duid")
    private String deletierId;

    /**
     * 删除时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "dtime")
    private Date deleteTime;

    /**
     * 是否超时
     */
    @Column(insert = false, update = false)
    private boolean crossTime;

    /**
     * 排除客户特殊身份
     */
    private String excludeSpecialIdentities;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getSampleRatio() {
        return sampleRatio;
    }

    public void setSampleRatio(int sampleRatio) {
        this.sampleRatio = sampleRatio;
    }

    public int getAnnualCompleteRate() {
        return annualCompleteRate;
    }

    public void setAnnualCompleteRate(int annualCompleteRate) {
        this.annualCompleteRate = annualCompleteRate;
    }

    public Date getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(Date beginTime) {
        this.beginTime = beginTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Date getDelayTime() {
        return delayTime;
    }

    public void setDelayTime(Date delayTime) {
        this.delayTime = delayTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean getIsEnabled() {
        return isEnabled;
    }

    public void setIsEnabled(boolean isEnabled) {
        this.isEnabled = isEnabled;
    }

    public boolean getStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public int getTopicCount() {
        return topicCount;
    }

    public void setTopicCount(int topicCount) {
        this.topicCount = topicCount;
    }

    public List<Topic> getTopicList() {
        return topicList;
    }

    public void setTopicList(List<Topic> topicList) {
        this.topicList = topicList;
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

    public String getModifierId() {
        return modifierId;
    }

    public void setModifierId(String modifierId) {
        this.modifierId = modifierId;
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

    public String getDeletierId() {
        return deletierId;
    }

    public void setDeletierId(String deletierId) {
        this.deletierId = deletierId;
    }

    public Date getDeleteTime() {
        return deleteTime;
    }

    public void setDeleteTime(Date deleteTime) {
        this.deleteTime = deleteTime;
    }

    public boolean isCrossTime() {
        return crossTime;
    }

    public void setCrossTime(boolean crossTime) {
        this.crossTime = crossTime;
    }

    public String getExcludeSpecialIdentities() {
        return excludeSpecialIdentities;
    }

    public void setExcludeSpecialIdentities(String excludeSpecialIdentities) {
        this.excludeSpecialIdentities = excludeSpecialIdentities;
    }
}
