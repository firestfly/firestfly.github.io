package bingo.vkcrm.service.customer.v1.models.blackcar;
/**
 * 楼栋信息pojo
 * @ClassName: Building   
 * @Description:
 * @author: huangsx 
 * @date: 2016年4月7日 下午7:52:06   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */
public class Building {
	private String buildingCode;
	private String buildingName;
	public String getBuildingCode() {
		return buildingCode;
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
	public Building(String buildingCode, String buildingName) {
		super();
		this.buildingCode = buildingCode;
		this.buildingName = buildingName;
	}
	public Building() {
		super();
	}
	
}
