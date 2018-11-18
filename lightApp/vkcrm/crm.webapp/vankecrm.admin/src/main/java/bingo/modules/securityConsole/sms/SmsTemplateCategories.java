package bingo.modules.securityConsole.sms;

import java.util.Date;


   /**
    * sms_template_categories 实体类
    * Tue Dec 08 19:04:34 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class SmsTemplateCategories{
	
	private String id;
	private String typeName;
	private String parentId;
	private String enabled;
	private String cname;
	private String cuid;
	private Date ctime;
	private String muid;
	private Date mtime;
	private String deleted;
	private String duid;
	private Date dtime;
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setTypeName(String typeName){
		this.typeName=typeName;
	}
	public String getTypeName(){
		return typeName;
	}
	public void setParentId(String parentId){
		this.parentId=parentId;
	}
	public String getParentId(){
		return parentId;
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
}

