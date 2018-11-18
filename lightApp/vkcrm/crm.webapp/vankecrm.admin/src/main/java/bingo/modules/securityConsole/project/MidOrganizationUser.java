package bingo.modules.securityConsole.project;

import java.util.Calendar;
import java.util.Date;


/**
* mid_organization_user 实体类
* Tue Sep 15 16:12:36 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
*/
public class MidOrganizationUser{
	private String id;//唯一主键
	private String userId;//用户ID
	private String organizationId;//组织或项目ID
	private String creator;//创建人
	private String creatorid;//创建人ID
	private Date createtime;//创建时间
	private String isdeleted;//是否被删除
	private String deletebyUser;//删除人
	private String deletebyUserid;//删除人ID
	private Date deletetime;//删除时间
	private Date startTime;//开始时间
	private Date endTime;//结束时间
	private String status;//状态
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setUserId(String userId){
		this.userId=userId;
	}
	public String getUserId(){
		return userId;
	}
	public void setOrganizationId(String organizationId){
		this.organizationId=organizationId;
	}
	public String getOrganizationId(){
		return organizationId;
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
	public void setDeletebyUser(String deletebyUser){
		this.deletebyUser=deletebyUser;
	}
	public String getDeletebyUser(){
		return deletebyUser;
	}
	public void setDeletebyUserid(String deletebyUserid){
		this.deletebyUserid=deletebyUserid;
	}
	public String getDeletebyUserid(){
		return deletebyUserid;
	}
	public void setDeletetime(Date deletetime){
		this.deletetime=deletetime;
	}
	public Date getDeletetime(){
		return deletetime;
	}
	/**
	 * @return the startTime
	 */
	public Date getStartTime() {
		return startTime;
	}
	/**
	 * @param startTime the startTime to set
	 */
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	/**
	 * @return the endTime
	 */
	public Date getEndTime() {
		return endTime;
	}
	/**
	 * @param endTime the endTime to set
	 */
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	/**
	 * @return the status
	 */
	public String getStatus() {
		String statusTemp = "1";
		if(null != startTime && startTime.compareTo(new Date())> 0){
			statusTemp = "0";
		}
    	Calendar calendar=Calendar.getInstance();
    	calendar.add(Calendar.DAY_OF_MONTH, -1);
		if(null != endTime && endTime.compareTo(calendar.getTime())< 0 ){
			statusTemp = "0";
		}
		return statusTemp;
	}

	
	
	
}

