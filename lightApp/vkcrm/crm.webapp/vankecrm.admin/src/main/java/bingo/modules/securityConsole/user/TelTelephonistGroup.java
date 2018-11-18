package bingo.modules.securityConsole.user;

import java.util.Date;

import bingo.common.core.utils.StringUtils;


   /**
    * tel_telephonist_group 实体类
    * Sat Oct 03 00:56:23 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    * 话务员所属分组实体类表，一个话务员可以属于多个分组
    */ 
public class TelTelephonistGroup{
	
	private String id;//唯一主键
	private String telephonistId;//话务员ID
	private String groupId;//分组ID
	private String creator;//创建人名称
	private String creatorId;//创建人ID
	private Date createTime;//创建时间
	private String isdeleted;//是否被删除
	private String deleter;//删除人名称
	private String deleterId;//删除人ID
	private Date deleteTime;//删除时间
	
	

	public String toString(){
		String result = "{";
		if(StringUtils.isNotEmpty(telephonistId)){
			result += "编号:" + telephonistId + ",";
		}
		if(StringUtils.isNotEmpty(groupId)){
			result += "分组ID:" + groupId + ",";
		}
		try{
			result = result.substring(0, result.length()-1);
		}catch(Exception e){}
		result += "}";		
		return result;
	}
	
	
	
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the telephonistId
	 */
	public String getTelephonistId() {
		return telephonistId;
	}
	/**
	 * @param telephonistId the telephonistId to set
	 */
	public void setTelephonistId(String telephonistId) {
		this.telephonistId = telephonistId;
	}
	/**
	 * @return the groupId
	 */
	public String getGroupId() {
		return groupId;
	}
	/**
	 * @param groupId the groupId to set
	 */
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}
	/**
	 * @return the creator
	 */
	public String getCreator() {
		return creator;
	}
	/**
	 * @param creator the creator to set
	 */
	public void setCreator(String creator) {
		this.creator = creator;
	}
	/**
	 * @return the creatorId
	 */
	public String getCreatorId() {
		return creatorId;
	}
	/**
	 * @param creatorId the creatorId to set
	 */
	public void setCreatorId(String creatorId) {
		this.creatorId = creatorId;
	}
	/**
	 * @return the createTime
	 */
	public Date getCreateTime() {
		return createTime;
	}
	/**
	 * @param createTime the createTime to set
	 */
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	/**
	 * @return the isdeleted
	 */
	public String getIsdeleted() {
		return isdeleted;
	}
	/**
	 * @param isdeleted the isdeleted to set
	 */
	public void setIsdeleted(String isdeleted) {
		this.isdeleted = isdeleted;
	}
	/**
	 * @return the deleter
	 */
	public String getDeleter() {
		return deleter;
	}
	/**
	 * @param deleter the deleter to set
	 */
	public void setDeleter(String deleter) {
		this.deleter = deleter;
	}
	/**
	 * @return the deleterId
	 */
	public String getDeleterId() {
		return deleterId;
	}
	/**
	 * @param deleterId the deleterId to set
	 */
	public void setDeleterId(String deleterId) {
		this.deleterId = deleterId;
	}
	/**
	 * @return the deleteTime
	 */
	public Date getDeleteTime() {
		return deleteTime;
	}
	/**
	 * @param deleteTime the deleteTime to set
	 */
	public void setDeleteTime(Date deleteTime) {
		this.deleteTime = deleteTime;
	}

	
	
}

