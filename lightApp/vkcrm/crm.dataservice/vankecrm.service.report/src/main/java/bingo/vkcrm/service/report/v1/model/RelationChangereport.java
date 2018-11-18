package bingo.vkcrm.service.report.v1.model;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 客房关系修改记录
 * @author chengsiyuan
 *
 */
public class RelationChangereport {
	
	/**
     * 房屋编码
     */
    private String houseId;

    /**
     * 房屋名称
     */
    private String houseName;

	/**
     * 修改人所在项目名称
     */
    private String projectName;

    /**
     * 修改人所在网格名称
     */
    private String gridName;

    /**
     * 修改人所在运营中心名称
     */
    private String organizationName;
    
    /**
     * 关系名称
     */
    private String relationText;
    
    /**
     * 修改类型
     */
    private String changeType;

    /**
     * 客户编码
     */
    private String customerId;

    /**
     * 客户姓名
     */
    private String customerName;
    
    /**
     * 用户名称
     */
    private String userName;
    
    /**
     * 创建时间
     */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createDate;

	public String getHouseId() {
		return houseId;
	}

	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}

	public String getHouseName() {
		return houseName;
	}

	public void setHouseName(String houseName) {
		this.houseName = houseName;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getGridName() {
		return gridName;
	}

	public void setGridName(String gridName) {
		this.gridName = gridName;
	}

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	public String getRelationText() {
		return relationText;
	}

	public void setRelationText(String relationText) {
		this.relationText = relationText;
	}

	public String getChangeType() {
		return changeType;
	}

	public void setChangeType(String changeType) {
		this.changeType = changeType;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
    
}
