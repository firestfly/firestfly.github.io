package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.dao.orm.annotations.Table;

/**
* 项目 实体类
* Tue Sep 15 16:12:36 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
*/ 

@Table(name = "mid_questionnaire_project")
public class Project{	
	
	private String id;// 唯一主键	
	private String questionnaireId;// 问卷ID	
	private String projectId;// 项目Id	
	private String projectName;// 项目名称
	
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
	 * @return the projectName
	 */
	public String getProjectName() {
		return projectName;
	}
	/**
	 * @param projectName the projectName to set
	 */
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
}

