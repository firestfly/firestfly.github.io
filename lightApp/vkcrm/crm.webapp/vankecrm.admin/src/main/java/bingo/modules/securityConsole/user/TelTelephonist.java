package bingo.modules.securityConsole.user;

import bingo.common.core.utils.StringUtils;
import bingo.dao.orm.annotations.Table;


   /**
    * tel_telephonist 实体类
    * Fri Sep 25 15:31:04 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 

@Table(name = "tel_telephonist")
public class TelTelephonist{
	private String id;
	private String loginId;
	private String name;
	private String mobileNumber;
	private String dutyId;
	private String dutyText;
	
	public String toString(){
		String result = "{";
		if(StringUtils.isNotEmpty(id)){
			result += "编号:" + id + ",";
		}
		if(StringUtils.isNotEmpty(name)){
			result += "姓名:" + name + ",";
		}
		if(StringUtils.isNotEmpty(mobileNumber)){
			result += "联系电话:" + mobileNumber + ",";
		}
		if(StringUtils.isNotEmpty(dutyText)){
			result += "职务:" + dutyText + ",";
		}
		try{
			result = result.substring(0, result.length()-1);
		}catch(Exception e){}
		result += "}";		
		return result;
	}
	
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setName(String name){
		this.name=name;
	}
	public String getName(){
		return name;
	}
	/**
	 * @return the mobileNumber
	 */
	public String getMobileNumber() {
		return mobileNumber;
	}
	/**
	 * @param mobileNumber the mobileNumber to set
	 */
	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}
	/**
	 * @return the dutyId
	 */
	public String getDutyId() {
		return dutyId;
	}
	/**
	 * @param dutyId the dutyId to set
	 */
	public void setDutyId(String dutyId) {
		this.dutyId = dutyId;
	}
	/**
	 * @return the dutyText
	 */
	public String getDutyText() {
		return dutyText;
	}
	/**
	 * @param dutyText the dutyText to set
	 */
	public void setDutyText(String dutyText) {
		this.dutyText = dutyText;
	}


	/**
	 * @return the loginId
	 */
	public String getLoginId() {
		return loginId;
	}


	/**
	 * @param loginId the loginId to set
	 */
	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}
	
	
	
}

