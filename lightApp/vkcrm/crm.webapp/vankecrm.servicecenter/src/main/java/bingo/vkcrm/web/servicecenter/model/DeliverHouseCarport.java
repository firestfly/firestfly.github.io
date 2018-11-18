package bingo.vkcrm.web.servicecenter.model;

public class DeliverHouseCarport {
	/**
	 * 所属项目编码
	 */
	private String projectCode;
	/**
	 * 所属项目名称
	 */
	private String projectName;
	/**
	 * 所属楼栋名称
	 */
	private String buildingName;
	/**
	 * 房屋或车位名称
	 */
	private String name;
	/**
	 * 所属单元
	 */
	private String unit;
	
	
	
	/**
	 * 房屋或车位编码
	 */
	private String code;
	/**
	 * 标识是房屋还是车位
	 */
	private String type;

	public String getProjectCode() {
		return projectCode;
	}

	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getBuildingName() {
		return buildingName;
	}

	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	/**
	 * @return the unit
	 */
	public String getUnit() {
		return unit;
	}

	/**
	 * @param unit the unit to set
	 */
	public void setUnit(String unit) {
		this.unit = unit;
	}
	

}
