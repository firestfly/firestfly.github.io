package bingo.vkcrm.service.questionnaire.v1.model;

import java.util.Date;

   /**
    * dim_anomalous_tags 实体类
    * Fri Nov 06 18:07:31 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 
public class DimAnomalousTags{
	
	private String id;//唯一主键
	private String answerId;//答卷ID
	private String customerId;//客户ID
	private String tagCategory;//标签类型
	private String tagValue;//标签值
	private String errorCategory;//错误类型
	private Date ctime;//创建时间
	private String deleted;//是否被删除
	private String duid;//删除人Id
	private Date dtime;//删除时间
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setAnswerId(String answerId){
		this.answerId=answerId;
	}
	public String getAnswerId(){
		return answerId;
	}
	public void setCustomerId(String customerId){
		this.customerId=customerId;
	}
	public String getCustomerId(){
		return customerId;
	}
	public void setTagCategory(String tagCategory){
		this.tagCategory=tagCategory;
	}
	public String getTagCategory(){
		return tagCategory;
	}
	public void setTagValue(String tagValue){
		this.tagValue=tagValue;
	}
	public String getTagValue(){
		return tagValue;
	}
	public void setErrorCategory(String errorCategory){
		this.errorCategory=errorCategory;
	}
	public String getErrorCategory(){
		return errorCategory;
	}
	public void setCtime(Date ctime){
		this.ctime=ctime;
	}
	public Date getCtime(){
		return ctime;
	}
	public void setDeleted(String deleted){
		this.deleted=deleted;
	}
	public String getDeleted(){
		return deleted;
	}
	public void setDuid(String duid){
		this.duid=duid;
	}
	public String getDuid(){
		return duid;
	}
	public void setDtime(Date dtime){
		this.dtime=dtime;
	}
	public Date getDtime(){
		return dtime;
	}
}

