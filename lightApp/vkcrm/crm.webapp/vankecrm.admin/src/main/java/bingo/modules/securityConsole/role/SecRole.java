package bingo.modules.securityConsole.role;

import bingo.dao.ext.BaseObject;
import bingo.dao.orm.annotations.UUID;

@SuppressWarnings("serial")
public class SecRole extends BaseObject {
	@UUID
	private String id;
	private String name;
	private String description;
	private Integer type;
	private String belongtoSysId;
	private String belongtoSysName;
	

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the belongtoSysId
	 */
	public String getBelongtoSysId() {
		return belongtoSysId;
	}

	/**
	 * @param belongtoSysId the belongtoSysId to set
	 */
	public void setBelongtoSysId(String belongtoSysId) {
		this.belongtoSysId = belongtoSysId;
	}

	/**
	 * @return the belongtoSysName
	 */
	public String getBelongtoSysName() {
		return belongtoSysName;
	}

	/**
	 * @param belongtoSysName the belongtoSysName to set
	 */
	public void setBelongtoSysName(String belongtoSysName) {
		this.belongtoSysName = belongtoSysName;
	}
	
	
	
	
}
