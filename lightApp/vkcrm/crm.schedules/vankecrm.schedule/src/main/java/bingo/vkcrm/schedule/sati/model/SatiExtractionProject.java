package bingo.vkcrm.schedule.sati.model;


/**
* sati_extraction_project 实体类
* Mon Nov 02 10:23:58 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
*/
public class SatiExtractionProject{
	private String id;
	private String questionnaireId;// 问卷ID
	private String questionnaireName;// 问卷名称
	private String projectId;//项目Id
	private String projectCode;// 项目Code
	private String projectName;// 项目名次
	private String gridId;//网格ID
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setQuestionnaireId(String questionnaireId){
		this.questionnaireId=questionnaireId;
	}
	public String getQuestionnaireId(){
		return questionnaireId;
	}
	public void setQuestionnaireName(String questionnaireName){
		this.questionnaireName=questionnaireName;
	}
	public String getQuestionnaireName(){
		return questionnaireName;
	}
	public void setProjectId(String projectId){
		this.projectId=projectId;
	}
	public String getProjectId(){
		return projectId;
	}
	public void setProjectCode(String projectCode){
		this.projectCode=projectCode;
	}
	public String getProjectCode(){
		return projectCode;
	}
	public void setProjectName(String projectName){
		this.projectName=projectName;
	}
	public String getProjectName(){
		return projectName;
	}
	public String getGridId() {
		return gridId;
	}
	public void setGridId(String gridId) {
		this.gridId = gridId;
	}
	
}

