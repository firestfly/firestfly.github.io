package bingo.vkcrm.service.customer.v1.models;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;
import bingo.vkcrm.service.model.BaseModel;

/**
 * 个人兴趣爱好实例
 * @author chengsiyuan
 *
 */
@Table(name="dim_cust_hobbies")
public class Hobby extends BaseModel {
	@UUID
	private String id;
	/**
	 * 客户Id
	 */
	private String customerId;
	/**
	 * 房屋编码
	 */
	@Column(insert = false,update = false)
	private String houseId;

	private Integer contentId;

	private String contentText;

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
		return this.getValue("CustomerHobbies", this.contentId);
	}

	public String getHouseId() {
		return houseId;
	}

	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}
}
