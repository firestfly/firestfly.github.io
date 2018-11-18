package bingo.vkcrm.task.models.questionnaire;

import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.common.utils.DateUtil;
import org.apache.commons.lang3.time.DateUtils;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 */
@Table(name = "sati_result_project")
public class SurveyProjectResult {

    /**
     * 唯一主键
     */
    private String id;
    /**
     * 问卷ID
     */
    private String questionnaireId;
    /**
     * 项目Id
     */
    private String projectId;
    /**
     * 网格ID
     */
    private String gridId;
    /**
     * 总量
     */
    private Integer total;
    /**
     * 目标总量
     */
    private Integer targetTotal;
    /**
     * 完成总量
     */
    private Integer completeTotal;
    /**
     * 今天目标（加上昨天剩余数的）
     */
    private Integer targetToday;
    /**
     * 今天完成量
     */
    private Integer completeToday;
    /**
     * 记录日期
     */
    private Date recordDate;
    /**
     * 今天目标数（原来的）
     */
    private Integer targetTodayOriginal;
    /**
     * 昨天剩余量
     */
    private Integer leftYestoday;

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("项目Id:" + projectId + ",");
        sb.append("网格Id:" + gridId + ",");
        sb.append("总量:" + total + ",");
        sb.append("目标总量:" + targetToday + ",");
        sb.append("完成总量:" + completeTotal + ",");
        sb.append("今天目标:" + targetToday + ",");
        sb.append("今天完成量:" + completeToday + ",");
        sb.append("今天目标数:" + targetTodayOriginal + ",");
        sb.append("昨天剩余量:" + leftYestoday + ",");

        return sb.toString();
    }


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

    /**
     * @return the leftYestoday
     */
    public Integer getLeftYestoday() {
        return leftYestoday;
    }

    /**
     * @param leftYestoday the leftYestoday to set
     */
    public void setLeftYestoday(Integer leftYestoday) {
        this.leftYestoday = leftYestoday;
    }



}

