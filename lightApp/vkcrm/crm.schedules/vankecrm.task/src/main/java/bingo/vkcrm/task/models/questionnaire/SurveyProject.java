package bingo.vkcrm.task.models.questionnaire;


import bingo.dao.orm.annotations.Table;

@Table(name = "sati_extraction_project")
public class SurveyProject {

    /**
     * id
     */
    private String id;
    /**
     * 问卷ID
     */
    private String questionnaireId;
    /**
     * 问卷名称
     */
    private String questionnaireName;
    /**
     * 项目Id
     */
    private String projectId;
    /**
     * 项目Code
     */
    private String projectCode;
    /**
     * 项目名次
     */
    private String projectName;
    /**
     * 网格ID
     */
    private String gridId;


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

    public void setQuestionnaireName(String questionnaireName) {
        this.questionnaireName = questionnaireName;
    }

    public String getQuestionnaireName() {
        return questionnaireName;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectName() {
        return projectName;
    }

    public String getGridId() {
        return gridId;
    }

    public void setGridId(String gridId) {
        this.gridId = gridId;
    }

}

