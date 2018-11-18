package bingo.vkcrm.task.models.questionnaire;

import java.util.Date;

/**
 *
 */
public class SurveyCustomerResult {

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
    private Integer count;

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

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}

