package bingo.excel.model;

import java.util.Date;


   /**
    * main_customer_detail 实体类
    * Tue Nov 03 17:49:25 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class MainCustomerDetail{
	private String id;
	private String postcode;
	private String email;
	private String qq;
	private String wechat;
	private Date birthday;
	private String blood;
	private String bloodtext;
	private String occupation;
	private String occupationtext;
	private String registeraddr;
	private String contactaddr;
	private String company;
	private String companyaddr;
	private String urgencycontacts;
	private String urgencyphonenumber;
	private String urgencymobilenumber;
	private String remark;
	private String modifier;
	private String modifierid;
	private Date modifytime;
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setPostcode(String postcode){
		this.postcode=postcode;
	}
	public String getPostcode(){
		return postcode;
	}
	public void setEmail(String email){
		this.email=email;
	}
	public String getEmail(){
		return email;
	}
	public void setQq(String qq){
		this.qq=qq;
	}
	public String getQq(){
		return qq;
	}
	public void setWechat(String wechat){
		this.wechat=wechat;
	}
	public String getWechat(){
		return wechat;
	}
	public void setBirthday(Date birthday){
		this.birthday=birthday;
	}
	public Date getBirthday(){
		return birthday;
	}
	public void setBlood(String blood){
		this.blood=blood;
	}
	public String getBlood(){
		return blood;
	}
	public void setBloodtext(String bloodtext){
		this.bloodtext=bloodtext;
	}
	public String getBloodtext(){
		return bloodtext;
	}
	public void setOccupation(String occupation){
		this.occupation=occupation;
	}
	public String getOccupation(){
		return occupation;
	}
	public void setOccupationtext(String occupationtext){
		this.occupationtext=occupationtext;
	}
	public String getOccupationtext(){
		return occupationtext;
	}
	public void setRegisteraddr(String registeraddr){
		this.registeraddr=registeraddr;
	}
	public String getRegisteraddr(){
		return registeraddr;
	}
	public void setContactaddr(String contactaddr){
		this.contactaddr=contactaddr;
	}
	public String getContactaddr(){
		return contactaddr;
	}
	public void setCompany(String company){
		this.company=company;
	}
	public String getCompany(){
		return company;
	}
	public void setCompanyaddr(String companyaddr){
		this.companyaddr=companyaddr;
	}
	public String getCompanyaddr(){
		return companyaddr;
	}
	public void setUrgencycontacts(String urgencycontacts){
		this.urgencycontacts=urgencycontacts;
	}
	public String getUrgencycontacts(){
		return urgencycontacts;
	}
	public void setUrgencyphonenumber(String urgencyphonenumber){
		this.urgencyphonenumber=urgencyphonenumber;
	}
	public String getUrgencyphonenumber(){
		return urgencyphonenumber;
	}
	public void setUrgencymobilenumber(String urgencymobilenumber){
		this.urgencymobilenumber=urgencymobilenumber;
	}
	public String getUrgencymobilenumber(){
		return urgencymobilenumber;
	}
	public void setRemark(String remark){
		this.remark=remark;
	}
	public String getRemark(){
		return remark;
	}
	public void setModifier(String modifier){
		this.modifier=modifier;
	}
	public String getModifier(){
		return modifier;
	}
	public void setModifierid(String modifierid){
		this.modifierid=modifierid;
	}
	public String getModifierid(){
		return modifierid;
	}
	public void setModifytime(Date modifytime){
		this.modifytime=modifytime;
	}
	public Date getModifytime(){
		return modifytime;
	}
}

