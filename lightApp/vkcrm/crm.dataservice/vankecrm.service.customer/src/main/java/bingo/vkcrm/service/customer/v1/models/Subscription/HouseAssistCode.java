package bingo.vkcrm.service.customer.v1.models.Subscription;

/**
 * 根据房屋id获取辅助编码和所在项目code
 * @author chengsiyuan
 *
 */
public class HouseAssistCode {

	/**
	 * 辅助编码
	 */
	private String assistCode;
	/**
	 * 项目code
	 */
	private String projectCode;
	/**
	 * 房屋名
	 */
	private String houseName;
	public String getAssistCode() {
		return assistCode;
	}
	public void setAssistCode(String assistCode) {
		this.assistCode = assistCode;
	}
	public String getProjectCode() {
		return projectCode;
	}
	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}
	public String getHouseName() {
		return houseName;
	}
	public void setHouseName(String houseName) {
		this.houseName = houseName;
	}
	
}
