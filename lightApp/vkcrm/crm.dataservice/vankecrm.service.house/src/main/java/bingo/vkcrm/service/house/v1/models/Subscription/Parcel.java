package bingo.vkcrm.service.house.v1.models.Subscription;

/**
 * 邮包实体
 * @author chengsiyuan
 *
 */
public class Parcel {

	private String billNo;
	private String status;
	private String custMobile;
	private String expCompany;
	private String extCompanyCode;
	private String custName;
	private String time;
	public String getBillNo() {
		return billNo;
	}
	public void setBillNo(String billNo) {
		this.billNo = billNo;
	}
	public String getCustMobile() {
		return custMobile;
	}
	public void setCustMobile(String custMobile) {
		this.custMobile = custMobile;
	}
	public String getExpCompany() {
		return expCompany;
	}
	public void setExpCompany(String expCompany) {
		this.expCompany = expCompany;
	}
	public String getExtCompanyCode() {
		return extCompanyCode;
	}
	public void setExtCompanyCode(String extCompanyCode) {
		this.extCompanyCode = extCompanyCode;
	}
	public String getCustName() {
		return custName;
	}
	public void setCustName(String custName) {
		this.custName = custName;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	


}
