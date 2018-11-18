/**  
 * @Title: YZParam.java
 * @Package: bingo.vkcrm.service.customer.v1.models
 * @author: luoml01 
 * @date: 2016年3月21日下午4:05:03
 * @version V1.0 
 * @see       
 * @since JDK 1.6   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */   
package bingo.vkcrm.service.house.v1.models;

import java.io.Serializable;

/**   
 * @ClassName: YZParam   
 * @Description:营帐请求对象
 * @author: luoml01 
 * @date: 2016年3月21日 下午4:05:03   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有   
 */
public class YZParam implements Serializable{
	/**   
	 * @Fields serialVersionUID : TODO 
	 */     
	    
	private static final long serialVersionUID = 1L;
	/**
     * 客户编码
     */
	private String customerCode;
	/**
     * 项目编码
     */
	private String projectCode;
	/**
     * 车位编码
     */
    private String carportCode;
    /**
     * 车位编码集合
     */
    private String[] carportCodes;
    /**
	 * 房屋编码
	 */
	private String houseCode;
	/**
	 * 房屋编码，多个查询
	 */
	private String[] houseCodes;
	/**
	 * 楼栋编码
	 */
	private String buildingCode;
	/**
	 * 更新时间 yyyy-MM-dd HH:mm:ss
	 */
	private String modifyTime;
	
	/**
	 * 当前时间 yyyy-MM-dd HH:mm:ss
	 */
	private String timestamp;
	
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
	 * @return projectCode 
	 */
	public String getProjectCode() {
		return projectCode;
	}
	/**   
	 * @param: projectCode the projectCode to set   
	 */
	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}
	/** 
	 * @return carportCode 
	 */
	public String getCarportCode() {
		return carportCode;
	}
	/**   
	 * @param: carportCode the carportCode to set   
	 */
	public void setCarportCode(String carportCode) {
		this.carportCode = carportCode;
	}
	/** 
	 * @return houseCode 
	 */
	public String getHouseCode() {
		return houseCode;
	}
	/**   
	 * @param: houseCode the houseCode to set   
	 */
	public void setHouseCode(String houseCode) {
		this.houseCode = houseCode;
	}
	/** 
	 * @return buildingCode 
	 */
	public String getBuildingCode() {
		return buildingCode;
	}
	/**   
	 * @param: buildingCode the buildingCode to set   
	 */
	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
	}
	/** 
	 * @return modifyTime 
	 */
	public String getModifyTime() {
		return modifyTime;
	}
	/**   
	 * @param: modifyTime the modifyTime to set   
	 */
	public void setModifyTime(String modifyTime) {
		this.modifyTime = modifyTime;
	}
	/** 
	 * @return timestamp 
	 */
	public String getTimestamp() {
		return timestamp;
	}
	/**   
	 * @param: timestamp the timestamp to set   
	 */
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	/** 
	 * @return houseCodes 
	 */
	public String[] getHouseCodes() {
		return houseCodes;
	}
	/**   
	 * @param: houseCodes the houseCodes to set   
	 */
	public void setHouseCodes(String[] houseCodes) {
		this.houseCodes = houseCodes;
	}
	
	/** 
	 * @return carportCodes 
	 */
	public String[] getCarportCodes() {
		return carportCodes;
	}
	/**   
	 * @param: carportCodes the carportCodes to set   
	 */
	public void setCarportCodes(String[] carportCodes) {
		this.carportCodes = carportCodes;
	}
	/**
	 * @Description: TODO
	 * @param: @return
	 * @throws:
	 * @Author: luoml01
	 * @date: 2016年4月19日 上午9:15:15
	 * @return:{返回参数名}{返回参数说明} 
	 * @exception:TODO
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */     
	@Override
	public String toString() {
		return "YZParam [customerCode=" + customerCode + ", projectCode=" + projectCode + ", carportCode=" + carportCode
				+ ", carportCodes=" + carportCodes + ", houseCode=" + houseCode + ", houseCodes=" + houseCodes
				+ ", buildingCode=" + buildingCode + ", modifyTime=" + modifyTime + ", timestamp=" + timestamp + "]";
	}
	
}
