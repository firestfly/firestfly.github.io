package bingo.vkcrm.service.house.v1.models.Subscription;

/**
 * 物业费请求
 * @author chengsiyuan
 *
 */
public class EncryptTxtRequest {

	private String bill_end_mth;
	private String bill_start_mth;
	private String house_mdscode;
	private String pwd;
	private String project_code;
	public String getBill_end_mth() {
		return bill_end_mth;
	}
	public void setBill_end_mth(String bill_end_mth) {
		this.bill_end_mth = bill_end_mth;
	}
	public String getBill_start_mth() {
		return bill_start_mth;
	}
	public void setBill_start_mth(String bill_start_mth) {
		this.bill_start_mth = bill_start_mth;
	}
	public String getHouse_mdscode() {
		return house_mdscode;
	}
	public void setHouse_mdscode(String house_mdscode) {
		this.house_mdscode = house_mdscode;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getProject_code() {
		return project_code;
	}
	public void setProject_code(String project_code) {
		this.project_code = project_code;
	}
	
}
