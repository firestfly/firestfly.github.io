package bingo.vkcrm.service.customer.v1.models.blackcat;

/**
 * 客房关系:[{楼栋,房号,关系,状态}] 关系：(主，住，租，帐，润) 状态：（有效，失效）
 * 
 * @author Administrator
 *
 */
public class HouseCustomerRelation {
	/**
	 * 楼栋名称
	 */
	private String buildingName;
	/**
	 * 楼栋Code
	 */
	private String buildingCode;
	/**
	 * 房屋名称
	 */
	private String houseName;
	/**
	 * 房屋Code
	 */
	private String houseCode;
	/**
	 * 关系类型
	 */
	private String relationType;
	/**
	 * 状态
	 */
	private String houseStatus;

	public String getBuildingName() {
		return buildingName;
	}

	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}

	public String getBuildingCode() {
		return buildingCode;
	}

	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
	}

	public String getHouseName() {
		return houseName;
	}

	public void setHouseName(String houseName) {
		this.houseName = houseName;
	}

	public String getHouseCode() {
		return houseCode;
	}

	public void setHouseCode(String houseCode) {
		this.houseCode = houseCode;
	}

	public String getRelationType() {
		return relationType;
	}

	public void setRelationType(String relationType) {
		this.relationType = relationType;
	}

	public String getHouseStatus() {
		return houseStatus;
	}

	public void setHouseStatus(String houseStatus) {
		this.houseStatus = houseStatus;
	}

}
