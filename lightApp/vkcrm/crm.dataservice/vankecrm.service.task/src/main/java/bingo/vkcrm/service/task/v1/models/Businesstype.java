package bingo.vkcrm.service.task.v1.models;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Column;

public class Businesstype {
	/**
	 * 业务ID
	 */
	private String id;
	/**
	 * 任务类型编码
	 */
	private String businessCode;
	/**
	 * 所属业务类型编码
	 */
	private String parentCode;
	/**
	 * 业务类型名称
	 */
	private String businessName;
	/**
	 * 状态
	 */
	private Integer status;
	/**
	 * 创建时间
	 */
	@Column(name = "buy_time")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date createTime;
	/**
	 * 修改时间
	 */
	@Column(name = "buy_time")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date modifyTime;
	/**
	 * 删除时间
	 */
	@Column(name = "buy_time")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date deletedTime;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getBusinessCode() {
		return businessCode;
	}

	public void setBusinessCode(String businessCode) {
		this.businessCode = businessCode;
	}

	public String getParentCode() {
		return parentCode;
	}

	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}

	public String getBusinessName() {
		return businessName;
	}

	public void setBusinessName(String businessName) {
		this.businessName = businessName;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}

	public Date getDeletedTime() {
		return deletedTime;
	}

	public void setDeletedTime(Date deletedTime) {
		this.deletedTime = deletedTime;
	}

}
