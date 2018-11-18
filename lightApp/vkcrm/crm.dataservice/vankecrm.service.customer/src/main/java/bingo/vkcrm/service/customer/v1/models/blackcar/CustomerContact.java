package bingo.vkcrm.service.customer.v1.models.blackcar;

import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.model.BaseModel;

/**
 * 客户联系方式
 * @ClassName: CustomerContact   
 * @Description:
 * @author: huangsx 
 * @date: 2016年4月6日 下午2:46:02   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */
@Table(name = "main_customer")
public class CustomerContact  extends BaseModel  {
	private String customerCode;//客户编码
	private String fullName;     //客户姓名
	private String mainMobile;   //主要电话
	private String standbyMobile;//备用电话
	private String homeTel;		 //家庭电话
	private String officeTel ;   //办公电话
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getMainMobile() {
		return mainMobile;
	}
	public void setMainMobile(String mainMobile) {
		this.mainMobile = mainMobile;
	}
	public String getStandbyMobile() {
		return standbyMobile;
	}
	public void setStandbyMobile(String standbyMobile) {
		this.standbyMobile = standbyMobile;
	}
	public String getHomeTel() {
		return homeTel;
	}
	public void setHomeTel(String homeTel) {
		this.homeTel = homeTel;
	}
	public String getOfficeTel() {
		return officeTel;
	}
	public void setOfficeTel(String officeTel) {
		this.officeTel = officeTel;
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
	public CustomerContact(String customerCode,String fullName, String mainMobile, String standbyMobile, String homeTel, String officeTel) {
		super();
		this.customerCode = customerCode;
		this.fullName = fullName;
		this.mainMobile = mainMobile;
		this.standbyMobile = standbyMobile;
		this.homeTel = homeTel;
		this.officeTel = officeTel;
	}
	public CustomerContact() {
		super();
	}
	
	
}
