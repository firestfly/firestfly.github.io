package bingo.excel.model;

import java.util.Date;


   /**
    * main_project 实体类
    * Mon Sep 21 19:16:55 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class MainProject{
	private String id;
	private String oldid;
	private String name;
	private String shortname;
	private String code;
	private String address;
	private String isouter;
	private Date takeovertime;
	private String isdeleted;
	private String deleter;
	private String deleterid;
	private Date deletetime;
	private String hasRole;
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setOldid(String oldid){
		this.oldid=oldid;
	}
	public String getOldid(){
		return oldid;
	}
	public void setName(String name){
		this.name=name;
	}
	public String getName(){
		return name;
	}
	public void setShortname(String shortname){
		this.shortname=shortname;
	}
	public String getShortname(){
		return shortname;
	}
	public void setCode(String code){
		this.code=code;
	}
	public String getCode(){
		return code;
	}
	public void setAddress(String address){
		this.address=address;
	}
	public String getAddress(){
		return address;
	}
	public void setIsouter(String isouter){
		this.isouter=isouter;
	}
	public String getIsouter(){
		return isouter;
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
	 * @return the hasRole
	 */
	public String getHasRole() {
		return hasRole;
	}
	/**
	 * @param hasRole the hasRole to set
	 */
	public void setHasRole(String hasRole) {
		this.hasRole = hasRole;
	}
	/**
	 * @return the takeovertime
	 */
	public Date getTakeovertime() {
		return takeovertime;
	}
	/**
	 * @param takeovertime the takeovertime to set
	 */
	public void setTakeovertime(Date takeovertime) {
		this.takeovertime = takeovertime;
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
}

