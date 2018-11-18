package bingo.excel.model;

import java.util.Date;


   /**
    * mid_customer_house 实体类
    * Mon Sep 21 19:16:56 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class MidCustomerHouse{
	private String id;
	private String houseid;
	private String customerid;
	private String relationtype;
	private String relationtypetext;
	private String creator;
	private String creatorid;
	private Date createtime;
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setHouseid(String houseid){
		this.houseid=houseid;
	}
	public String getHouseid(){
		return houseid;
	}
	public void setCustomerid(String customerid){
		this.customerid=customerid;
	}
	public String getCustomerid(){
		return customerid;
	}
	public void setRelationtype(String relationtype){
		this.relationtype=relationtype;
	}
	public String getRelationtype(){
		return relationtype;
	}
	public void setRelationtypetext(String relationtypetext){
		this.relationtypetext=relationtypetext;
	}
	public String getRelationtypetext(){
		return relationtypetext;
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
	
	
}

