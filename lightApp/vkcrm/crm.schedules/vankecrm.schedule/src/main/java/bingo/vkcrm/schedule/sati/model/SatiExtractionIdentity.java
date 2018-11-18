package bingo.vkcrm.schedule.sati.model;
   /**
    * sati_extraction_identity 实体类
    * Mon Nov 02 10:23:59 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class SatiExtractionIdentity{
	
	private String id;//唯一主键
	private String customerId;//客户ID
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setCustomerId(String customerId){
		this.customerId=customerId;
	}
	public String getCustomerId(){
		return customerId;
	}
}

