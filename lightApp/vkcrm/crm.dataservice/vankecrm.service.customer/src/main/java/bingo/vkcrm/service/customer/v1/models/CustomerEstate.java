package bingo.vkcrm.service.customer.v1.models;

import bingo.vkcrm.service.model.BaseModel;

/**
 * 客户相关物业信息（房屋、车位）
 *
 */
public class CustomerEstate extends BaseModel {

	/**
	 * 物业名称
	 */
	private String name;
	/**
	 * 物业id
	 */
	private String id;
	/**
	 * 物业状态
	 */
	private Integer status;
    /**
     * 物业状态文本
     */
    private String statusText;
    /**
     * 物业类型
     */
    private String type;
    /**
     * 是否拥有权限
     */
    private boolean hasPermission;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getStatusText() {
        return "";
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isHasPermission() {
        return hasPermission;
    }

    public void setHasPermission(boolean hasPermission) {
        this.hasPermission = hasPermission;
    }
}
