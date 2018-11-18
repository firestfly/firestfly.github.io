package bingo.modules.securityConsole.sms;

import java.util.Date;


/**
* sms_template 实体类
* Tue Dec 08 19:04:43 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
*/ 
public class SmsTemplate{
	
	private String id;//唯一标识
	private String name;//模板名称
	private String categoryId;//分类ID
	private String type;//模板类型
	private Date startDate;//生效时间
	private Date endDate;//失效时间
	private String enabled;//是否启用1启用0禁用
	private String cname;//创建人名称
	private String cuid;//创建人ID
	private Date ctime;//创建时间
	private String muid;//修改人ID
	private Date mtime;//修改时间
	private String deleted;//是否被删除0否1被删除
	private String duid;//删除人ID
	private Date dtime;//删除时间
	private String content;//模板内容
	
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setName(String name){
		this.name=name;
	}
	public String getName(){
		return name;
	}
	public void setCategoryId(String categoryId){
		this.categoryId=categoryId;
	}
	public String getCategoryId(){
		return categoryId;
	}
	public void setType(String type){
		this.type=type;
	}
	public String getType(){
		return type;
	}
	public void setStartDate(Date startDate){
		this.startDate=startDate;
	}
	public Date getStartDate(){
		return startDate;
	}
	public void setEndDate(Date endDate){
		this.endDate=endDate;
	}
	public Date getEndDate(){
		return endDate;
	}
	public void setEnabled(String enabled){
		this.enabled=enabled;
	}
	public String getEnabled(){
		return enabled;
	}
	public void setCname(String cname){
		this.cname=cname;
	}
	public String getCname(){
		return cname;
	}
	public void setCuid(String cuid){
		this.cuid=cuid;
	}
	public String getCuid(){
		return cuid;
	}
	public void setCtime(Date ctime){
		this.ctime=ctime;
	}
	public Date getCtime(){
		return ctime;
	}
	public void setMuid(String muid){
		this.muid=muid;
	}
	public String getMuid(){
		return muid;
	}
	public void setMtime(Date mtime){
		this.mtime=mtime;
	}
	public Date getMtime(){
		return mtime;
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
	public void setContent(String content){
		this.content=content;
	}
	public String getContent(){
		return content;
	}
}

