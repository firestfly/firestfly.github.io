package bingo.excel.model;

import java.util.Date;


   /**
    * main_customer 实体类
    * Mon Sep 21 19:16:49 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class MainCustomer{
	private String id;
	private String code;
	private String firstname;
	private String lastname;
	private String fullname;
	private String sex;
	private String sextext;
	private String customertype;
	private String customertypetext;
	private String mainmobile;
	private String standbymobile;
	private String hometel;
	private String officetel;
	private String contactaddr;
	private String affiliation;
	private String affiliationtext;
	private String certificatetype;
	private String certificatetypetext;
	private String certificateid;
	private String creator;
	private String creatorid;
	private Date createtime;
	private String modifier;
	private String modifierid;
	private Date modifytime;
	private String isdeleted;
	private String deleter;
	private String deleterid;
	private Date deletetime;
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setCode(String code){
		this.code=code;
	}
	public String getCode(){
		return code;
	}
	public void setFirstname(String firstname){
		this.firstname=firstname;
	}
	public String getFirstname(){
		return firstname;
	}
	public void setLastname(String lastname){
		this.lastname=lastname;
	}
	public String getLastname(){
		return lastname;
	}
	public void setFullname(String fullname){
		this.fullname=fullname;
	}
	public String getFullname(){
		return fullname;
	}
	public void setSex(String sex){
		this.sex=sex;
	}
	public String getSex(){
		return sex;
	}
	public void setSextext(String sextext){
		this.sextext=sextext;
	}
	public String getSextext(){
		return sextext;
	}
	public void setCustomertype(String customertype){
		this.customertype=customertype;
	}
	public String getCustomertype(){
		return customertype;
	}
	public void setCustomertypetext(String customertypetext){
		this.customertypetext=customertypetext;
	}
	public String getCustomertypetext(){
		return customertypetext;
	}
	public void setMainmobile(String mainmobile){
		this.mainmobile=mainmobile;
	}
	public String getMainmobile(){
		return mainmobile;
	}
	public void setStandbymobile(String standbymobile){
		this.standbymobile=standbymobile;
	}
	public String getStandbymobile(){
		return standbymobile;
	}
	public void setHometel(String hometel){
		this.hometel=hometel;
	}
	public String getHometel(){
		return hometel;
	}
	public void setOfficetel(String officetel){
		this.officetel=officetel;
	}
	public String getOfficetel(){
		return officetel;
	}
	public void setContactaddr(String contactaddr){
		this.contactaddr=contactaddr;
	}
	public String getContactaddr(){
		return contactaddr;
	}
	public void setAffiliation(String affiliation){
		this.affiliation=affiliation;
	}
	public String getAffiliation(){
		return affiliation;
	}
	public void setAffiliationtext(String affiliationtext){
		this.affiliationtext=affiliationtext;
	}
	public String getAffiliationtext(){
		return affiliationtext;
	}
	public void setCertificatetype(String certificatetype){
		this.certificatetype=certificatetype;
	}
	public String getCertificatetype(){
		return certificatetype;
	}
	public void setCertificatetypetext(String certificatetypetext){
		this.certificatetypetext=certificatetypetext;
	}
	public String getCertificatetypetext(){
		return certificatetypetext;
	}
	public void setCertificateid(String certificateid){
		this.certificateid=certificateid;
	}
	public String getCertificateid(){
		return certificateid;
	}
	public void setCreator(String creator){
		this.creator=creator;
	}
	public String getCreator(){
		return creator;
	}
	public void setCreatorid(String creatorid){
		this.creatorid=creatorid;
	}
	public String getCreatorid(){
		return creatorid;
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
	public void setIsdeleted(String isdeleted){
		this.isdeleted=isdeleted;
	}
	public String getIsdeleted(){
		return isdeleted;
	}
	public void setDeleter(String deleter){
		this.deleter=deleter;
	}
	public String getDeleter(){
		return deleter;
	}
	public void setDeleterid(String deleterid){
		this.deleterid=deleterid;
	}
	public String getDeleterid(){
		return deleterid;
	}
	/**
	 * @return the createtime
	 */
	public Date getCreatetime() {
		return createtime;
	}
	/**
	 * @param createtime the createtime to set
	 */
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
	/**
	 * @return the deletetime
	 */
	public Date getDeletetime() {
		return deletetime;
	}
	/**
	 * @param deletetime the deletetime to set
	 */
	public void setDeletetime(Date deletetime) {
		this.deletetime = deletetime;
	}
	/**
	 * @return the modifytime
	 */
	public Date getModifytime() {
		return modifytime;
	}
	/**
	 * @param modifytime the modifytime to set
	 */
	public void setModifytime(Date modifytime) {
		this.modifytime = modifytime;
	}
	
	
	
}

