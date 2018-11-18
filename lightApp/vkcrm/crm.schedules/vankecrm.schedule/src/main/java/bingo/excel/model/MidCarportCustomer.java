package bingo.excel.model;

import java.util.Date;

/**
* mid_carport_customer 实体类
* Mon Dec 07 15:28:44 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
*/
public class MidCarportCustomer{
	
	private String id;//唯一主键
	private String carportid;//车位ID
	private String customerid;//客房ID
	private String relationtype;//关系类型 
	private String creator;//创建人
	private String creatorid;//创建人ID
	private Date createtime;//创建时间
	private String isdeleted;//是否被删除
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setCarportid(String carportid){
		this.carportid=carportid;
	}
	public String getCarportid(){
		return carportid;
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
}

