package bingo.vkcrm.service.house.v1.models.Subscription;

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
	
}
