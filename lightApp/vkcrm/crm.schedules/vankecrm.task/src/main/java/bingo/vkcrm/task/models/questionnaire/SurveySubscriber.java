package bingo.vkcrm.task.models.questionnaire;

import bingo.dao.orm.annotations.Table;

import java.util.Date;

/**
 * 预约客户
 */
@Table(name = "sati_extraction_subscribe")
public class SurveySubscriber {

    /**
     * 唯一主键
     */
    private String id;
    /**
     * 问卷ID
     */
    private String questionnaireId;
    /**
     * 项目ID
     */
    private String projectId;
    /**
     * 网格ID
     */
    private String gridId;
    /**
     * 房屋ID
     */
    private String houseId;
    /**
     * 客户ID
     */
    private String customerId;
    /**
     * 类型 强制抽取或预约
     */
    private String type;
    /**
     * 预约时间
     */
    private Date appointmentTime;

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setQuestionnaireId(String questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public String getQuestionnaireId() {
        return questionnaireId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setGridId(String gridId) {
        this.gridId = gridId;
    }

    public String getGridId() {
        return gridId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setAppointmentTime(Date appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public Date getAppointmentTime() {
        return appointmentTime;
    }
}

