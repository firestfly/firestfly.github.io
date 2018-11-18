package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.dao.orm.annotations.Table;

import java.util.Date;

/**
 * sati_result_project 实体类
 * Mon Nov 02 10:24:00 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */

@Table(name = "sati_result_project")
public class SatisfactionResultProject {
    private String id;//唯一主键
    private String questionnaireId;//问卷ID
    private String projectId;//项目Id
    private String gridId;//网格ID
    private Integer total;//总量
    private Integer targetTotal;//目标总量
    private Integer completeTotal;//完成总量
    private Integer targetToday;//今天目标（加上昨天剩余数的）
    private Integer completeToday;//今天完成量

    private Date recordDate;//记录日期
    private Integer targetTodayOriginal;//今天目标数（原来的）

    private Integer yesterdayTotal;//昨天剩余量

    /**
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return the questionnaireId
     */
    public String getQuestionnaireId() {
        return questionnaireId;
    }

    /**
     * @param questionnaireId the questionnaireId to set
     */
    public void setQuestionnaireId(String questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    /**
     * @return the projectId
     */
    public String getProjectId() {
        return projectId;
    }

    /**
     * @param projectId the projectId to set
     */
    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    /**
     * @return the gridId
     */
    public String getGridId() {
        return gridId;
    }

    /**
     * @param gridId the gridId to set
     */
    public void setGridId(String gridId) {
        this.gridId = gridId;
    }

    /**
     * @return the total
     */
    public Integer getTotal() {
        return total;
    }

    /**
     * @param total the total to set
     */
    public void setTotal(Integer total) {
        this.total = total;
    }

    /**
     * @return the targetTotal
     */
    public Integer getTargetTotal() {
        return targetTotal;
    }

    /**
     * @param targetTotal the targetTotal to set
     */
    public void setTargetTotal(Integer targetTotal) {
        this.targetTotal = targetTotal;
    }

    /**
     * @return the completeTotal
     */
    public Integer getCompleteTotal() {
        return completeTotal;
    }

    /**
     * @param completeTotal the completeTotal to set
     */
    public void setCompleteTotal(Integer completeTotal) {
        this.completeTotal = completeTotal;
    }

    /**
     * @return the targetToday
     */
    public Integer getTargetToday() {
        return targetToday;
    }

    /**
     * @param targetToday the targetToday to set
     */
    public void setTargetToday(Integer targetToday) {
        this.targetToday = targetToday;
    }

    /**
     * @return the completeToday
     */
    public Integer getCompleteToday() {
        return completeToday;
    }

    /**
     * @param completeToday the completeToday to set
     */
    public void setCompleteToday(Integer completeToday) {
        this.completeToday = completeToday;
    }

    /**
     * @return the recordDate
     */
    public Date getRecordDate() {
        return recordDate;
    }

    /**
     * @param recordDate the recordDate to set
     */
    public void setRecordDate(Date recordDate) {
        this.recordDate = recordDate;
    }

    /**
     * @return the targetTodayOriginal
     */
    public Integer getTargetTodayOriginal() {
        return targetTodayOriginal;
    }

    /**
     * @param targetTodayOriginal the targetTodayOriginal to set
     */
    public void setTargetTodayOriginal(Integer targetTodayOriginal) {
        this.targetTodayOriginal = targetTodayOriginal;
    }

    public Integer getYesterdayTotal() {
        return yesterdayTotal;
    }

    public void setYesterdayTotal(Integer yesterdayTotal) {
        this.yesterdayTotal = yesterdayTotal;
    }
}

