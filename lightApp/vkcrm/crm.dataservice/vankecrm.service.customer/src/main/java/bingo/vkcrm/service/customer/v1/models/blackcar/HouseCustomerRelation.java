package bingo.vkcrm.service.customer.v1.models.blackcar;

import bingo.vkcrm.service.model.BaseModel;

/**
 * 客房关系pojo
 * @ClassName: HouseCustomerRelation   
 * @Description:TODO
 * @author: huangsx 
 * @date: 2016年4月7日 上午11:15:08   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */
public class HouseCustomerRelation extends BaseModel{
	private String buildingCode ;
	private String buildingName ;
	private String unit ;//单元
	private String houseCode ;
	private String houseName ;
	private String customerCode;//客户编码
	private String fullName ;
	private String mainMobile;
	private String standbyMobile;
	private String homeTel;
	private String officeTel;
	private String certificateId ;//身份证
	private String certificateType;
	private String certificateTypeText;//客户证件类型
	private String relation ;//关系
	private boolean isDelete ;
	
	public HouseCustomerRelation() {
		super();
	}
	
	public String getBuildingCode() {
		return buildingCode;
	}
	/**
	 * @Description: TODO
	 * @Author: luoml01
	 * @date: 2016年5月18日 上午10:04:54
	 * @return:{返回参数名}{返回参数说明} 
	 * @exception:TODO
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */   
	public HouseCustomerRelation(String buildingCode, String buildingName, String unit, String houseCode,
			String houseName, String customerCode, String fullName, String mainMobile, String standbyMobile,
			String homeTel, String officeTel, String certificateId, String certificateType, String certificateTypeText,
			String relation, boolean isDelete) {
		super();
		this.buildingCode = buildingCode;
		this.buildingName = buildingName;
		this.unit = unit;
		this.houseCode = houseCode;
		this.houseName = houseName;
		this.customerCode = customerCode;
		this.fullName = fullName;
		this.mainMobile = mainMobile;
		this.standbyMobile = standbyMobile;
		this.homeTel = homeTel;
		this.officeTel = officeTel;
		this.certificateId = certificateId;
		this.certificateType = certificateType;
		this.certificateTypeText = certificateTypeText;
		this.relation = relation;
		this.isDelete = isDelete;
	}

	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
	}
	public String getBuildingName() {
		return buildingName;
	}
	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getHouseCode() {
		return houseCode;
	}
	public void setHouseCode(String houseCode) {
		this.houseCode = houseCode;
	}
	public String getHouseName() {
		return houseName;
	}
	public void setHouseName(String houseName) {
		this.houseName = houseName;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getCertificateId() {
		return certificateId;
	}
	public void setCertificateId(String certificateId) {
		this.certificateId = certificateId;
	}
	public String getRelation() {
		return relation;
	}
	public void setRelation(String relation) {
		this.relation = relation;
	}
	public boolean getIsDelete() {
		return isDelete;
	}
	public void setDelete(boolean isDelete) {
		this.isDelete = isDelete;
	}
	/** 
	 * @return customerCode 
	 */
	public String getCustomerCode() {
		return customerCode;
	}
	/**   
	 * @param: customerCode the customerCode to set   
	 */
	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}
	
	/** 
	 * @return certificateType 
	 */
	public String getCertificateType() {
		return certificateType;
	}
	/**   
	 * @param: certificateType the certificateType to set   
	 */
	public void setCertificateType(String certificateType) {
		this.certificateType = certificateType;
	}
	/** 
	 * @return certificateTypeText 
	 */
	public String getCertificateTypeText() {
		return this.getValue("CustomerCertificateType", this.certificateType);
	}
	/**   
	 * @param: certificateTypeText the certificateTypeText to set   
	 */
	public void setCertificateTypeText(String certificateTypeText) {
		this.certificateTypeText = certificateTypeText;
	}

	/** 
	 * @return mainMobile 
	 */
	public String getMainMobile() {
		return mainMobile;
	}

	/**   
	 * @param: mainMobile the mainMobile to set   
	 */
	public void setMainMobile(String mainMobile) {
		this.mainMobile = mainMobile;
	}

	/** 
	 * @return standbyMobile 
	 */
	public String getStandbyMobile() {
		return standbyMobile;
	}

	/**   
	 * @param: standbyMobile the standbyMobile to set   
	 */
	public void setStandbyMobile(String standbyMobile) {
		this.standbyMobile = standbyMobile;
	}

	/** 
	 * @return homeTel 
	 */
	public String getHomeTel() {
		return homeTel;
	}

	/**   
	 * @param: homeTel the homeTel to set   
	 */
	public void setHomeTel(String homeTel) {
		this.homeTel = homeTel;
	}

	/** 
	 * @return officeTel 
	 */
	public String getOfficeTel() {
		return officeTel;
	}

	/**   
	 * @param: officeTel the officeTel to set   
	 */
	public void setOfficeTel(String officeTel) {
		this.officeTel = officeTel;
	}

}
