package bingo.vkcrm.service.questionnaire.v1.model;

import java.util.Date;

import bingo.dao.orm.annotations.Table;

/**
 * 异常客户
 *
 * @author chengsiyuan
 */
@Table(name = "biz_anomalous_customer")
public class AnomalousCustomer {
    /**
     * id
     */
    private String id;
    /**
     * 主题id
     */
    private String subjectId;
    /**
     * 问卷id
     */
    private String questionnaireId;
    /**
     * 项目id
     */
    private String projectId;
    /**
     * 房屋id
     */
    private String houseId;
    /**
     * 客户id
     */
    private String customerId;
    /**
     * 异常类型（不接受调查)）
     */
    private Integer anomalousType;
    /**
     * 开始时间
     */
    private Date startTime;
    /**
     * 结束时间
     */
    private Date endTime;
    /**
     * 创建人id
     */
    private String cuid;
    /**
     * 创建时间
     */
    private Date ctime;
    /**
     * 修改人id
     */
    private String muid;
    /**
     * 修改时间
     */
    private Date mtime;
    /**
     * 是否删除
     */
    private Boolean deleted;
    /**
     * 删除人id
     */
    private String duid;
    /**
     * 删除时间
     */
    private Date dtime;

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

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public Integer getAnomalousType() {
        return anomalousType;
    }

    public void setAnomalousType(Integer anomalousType) {
        this.anomalousType = anomalousType;
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

    public String getCuid() {
        return cuid;
    }

    public void setCuid(String cuid) {
        this.cuid = cuid;
    }

    public Date getCtime() {
        return ctime;
    }

    public void setCtime(Date ctime) {
        this.ctime = ctime;
    }

    public String getMuid() {
        return muid;
    }

    public void setMuid(String muid) {
        this.muid = muid;
    }

    public Date getMtime() {
        return mtime;
    }

    public void setMtime(Date mtime) {
        this.mtime = mtime;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public String getDuid() {
        return duid;
    }

    public void setDuid(String duid) {
        this.duid = duid;
    }

    public Date getDtime() {
        return dtime;
    }

    public void setDtime(Date dtime) {
        this.dtime = dtime;
    }

}
