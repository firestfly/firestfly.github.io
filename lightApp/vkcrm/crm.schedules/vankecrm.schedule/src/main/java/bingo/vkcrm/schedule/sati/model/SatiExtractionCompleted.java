package bingo.vkcrm.schedule.sati.model;


   /**
    * sati_extraction_completed 实体类
    * Mon Nov 02 15:30:04 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class SatiExtractionCompleted{
	private String id;//唯一主键
	private String questionnaireId;//问卷Id
	private String projectId;//项目Id
	private String gridId;//网格ID
	private String houseId;//房屋ID
	private String customerId;//客户ID
	
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
	public void setProjectId(String projectId){
		this.projectId=projectId;
	}
	public String getProjectId(){
		return projectId;
	}
	public void setHouseId(String houseId){
		this.houseId=houseId;
	}
	public String getHouseId(){
		return houseId;
	}
	public void setCustomerId(String customerId){
		this.customerId=customerId;
	}
	public String getCustomerId(){
		return customerId;
	}
	public String getGridId() {
		return gridId;
	}
	public void setGridId(String gridId) {
		this.gridId = gridId;
	}
}

