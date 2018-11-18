package bingo.vkcrm.schedule.sati.model;


   /**
    * sati_extraction_double 实体类
    * Mon Nov 02 15:30:03 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class SatiExtractionDouble{
	
	private String id;//唯一主键
	private String idId;//Sati_Extraction_5_Customer 表的主键
	private String questionnaireId;//问卷ID
	private String customerId;//客户ID
	private String mainMobile;//主要手机号码
	private String projectId;//项目ID
	private String gridId;//网格ID
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setIdId(String idId){
		this.idId=idId;
	}
	public String getIdId(){
		return idId;
	}
	public void setQuestionnaireId(String questionnaireId){
		this.questionnaireId=questionnaireId;
	}
	public String getQuestionnaireId(){
		return questionnaireId;
	}
	public void setCustomerId(String customerId){
		this.customerId=customerId;
	}
	public String getCustomerId(){
		return customerId;
	}
	public void setMainMobile(String mainMobile){
		this.mainMobile=mainMobile;
	}
	public String getMainMobile(){
		return mainMobile;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getGridId() {
		return gridId;
	}
	public void setGridId(String gridId) {
		this.gridId = gridId;
	}
	
	
}

