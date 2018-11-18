package bingo.vkcrm.service.tel.v1.models;
/**
 * 电信工号表实例
 * @author chengsiyuan
 *
 */
public class Telecomno {
	//电信工号
	private String number;
	//话务员id
	private String telephonistId;
	//电信工号名称
	private String name;
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getTelephonistId() {
		return telephonistId;
	}
	public void setTelephonistId(String telephonistId) {
		this.telephonistId = telephonistId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
}
