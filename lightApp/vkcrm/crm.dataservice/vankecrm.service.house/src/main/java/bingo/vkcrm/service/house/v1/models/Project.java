package bingo.vkcrm.service.house.v1.models;

/**
 * 项目
 */
public class Project {
	/**
	 * 项目ID
	 */
	private String id;

	/**
	 * 旧业务数据id
	 */
	private String oldId;
	/**
	 * 项目名称
	 */
	private String name;
	/**
	 * 短名称
	 */
	private String shortName;
	/**
	 * 项目编码
	 */
	private String code;
	/**
	 * 项目地址
	 */
	private String address;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getOldId() {
		return oldId;
	}

	public void setOldId(String oldId) {
		this.oldId = oldId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

}
