package bingo.vkcrm.task.models.questionnaire;

import bingo.dao.orm.annotations.Table;

/**
 * 调查完成客户
 */
@Table(name = "sati_extraction_completed")
public class SurveyCustomerCompleted {
    /**
     * 唯一主键
     */
    private String id;
    /**
     * 问卷Id
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
     * 房屋ID
     */
    private String houseId;
    /**
     * 客户ID
     */
    private String customerId;

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

    public String getGridId() {
        return gridId;
    }

    public void setGridId(String gridId) {
        this.gridId = gridId;
    }
}

