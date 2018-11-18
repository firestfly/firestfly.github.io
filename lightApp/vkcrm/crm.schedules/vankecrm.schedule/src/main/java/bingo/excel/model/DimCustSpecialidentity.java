package bingo.excel.model;

import java.util.Date;

   /**
    * dim_cust_specialidentity 实体类
    * Thu Nov 26 16:31:58 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class DimCustSpecialidentity{
	
	private String id;//客户特殊身份唯一标志
	private String customerid;//客户ID
	private String identity;//特殊身份类型
	private String identitytext;//特殊身份类型名称
	private Date begindate;//法律纠纷开始时间
	private Date enddate;//法律纠纷结束时间
	private String duration;//持续时间
	private String creator;//创建人名称
	private String creatorid;//创建人登录ID
	private Date createtime;//创建时间
	private String modifier;//最后修改人姓名
	private String modifierid;//最后修改人ID
	private Date modifytime;//最后修改时间
	private String isDeleted = "0";


	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setCustomerid(String customerid){
		this.customerid=customerid;
	}
	public String getCustomerid(){
		return customerid;
	}
	public void setIdentity(String identity){
		this.identity=identity;
	}
	public String getIdentity(){
		return identity;
	}
	public void setIdentitytext(String identitytext){
		this.identitytext=identitytext;
	}
	public String getIdentitytext(){
		return identitytext;
	}
	public void setBegindate(Date begindate){
		this.begindate=begindate;
	}
	public Date getBegindate(){
		return begindate;
	}
	public void setEnddate(Date enddate){
		this.enddate=enddate;
	}
	public Date getEnddate(){
		return enddate;
	}
	public void setDuration(String duration){
		this.duration=duration;
	}
	public String getDuration(){
		return duration;
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
	/**
	 * @return the modifier
	 */
	public String getModifier() {
		return modifier;
	}
	/**
	 * @param modifier the modifier to set
	 */
	public void setModifier(String modifier) {
		this.modifier = modifier;
	}
	/**
	 * @return the modifierid
	 */
	public String getModifierid() {
		return modifierid;
	}
	/**
	 * @param modifierid the modifierid to set
	 */
	public void setModifierid(String modifierid) {
		this.modifierid = modifierid;
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
	/**
	 * @return the isDeleted
	 */
	public String getIsDeleted() {
		return isDeleted;
	}
	/**
	 * @param isDeleted the isDeleted to set
	 */
	public void setIsDeleted(String isDeleted) {
		this.isDeleted = isDeleted;
	}
	
	
}

