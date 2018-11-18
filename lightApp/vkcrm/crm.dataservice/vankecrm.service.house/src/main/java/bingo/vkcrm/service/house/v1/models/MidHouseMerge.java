package bingo.vkcrm.service.house.v1.models;

import java.util.Date;


   /**
    * mid_house_merge 实体类
    * Wed Nov 04 16:03:39 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class MidHouseMerge{
	private String id;
	private String houseid;
	private String mergetohouseid;
	private String creator;
	private String creatorid;
	private Date createtime;
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
	public void setHouseid(String houseid){
		this.houseid=houseid;
	}
	public String getHouseid(){
		return houseid;
	}
	public void setMergetohouseid(String mergetohouseid){
		this.mergetohouseid=mergetohouseid;
	}
	public String getMergetohouseid(){
		return mergetohouseid;
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
	public void setCreatetime(Date createtime){
		this.createtime=createtime;
	}
	public Date getCreatetime(){
		return createtime;
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
	public void setDeletetime(Date deletetime){
		this.deletetime=deletetime;
	}
	public Date getDeletetime(){
		return deletetime;
	}
}

