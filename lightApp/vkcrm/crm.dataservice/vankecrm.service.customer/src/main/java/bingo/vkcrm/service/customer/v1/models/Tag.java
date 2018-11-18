package bingo.vkcrm.service.customer.v1.models;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.model.BaseModel;

/**
 * 客户标签类
 */
@Table(name = "dim_cust_tags")
public class Tag extends BaseModel{
	/**
	 * 标签id
	 */
	private String id;
    /**
     * 房屋编码
     */
    @Column(insert = false,update = false)
    private String houseId;
	/**
	 * 客户id
	 */
	private String customerId;
	/**
	 * 标签内容id
	 */
	private Integer contentId;
	/**
	 * 标签内容
	 */
	private String contentText;
    /**
     * 创建人
     */
    private String creator;
    /**
     * 创建人ID
     */
    private String creatorId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public Integer getContentId() {
        return contentId;
    }

    public void setContentId(Integer contentId) {
        this.contentId = contentId;
    }

    public String getContentText() {
        return this.getValue("CustomerTags", this.contentId);
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }
}
