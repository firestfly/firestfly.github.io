package bingo.vkcrm.service.model;

import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.common.Organization;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 数据修改日志
 */
@Table(name = "log_data_modify")
public class DataChangeLog implements Organization,Serializable {
    /**
     * 唯一标识
     */
    private String id;

    /**
     * 服务名
     */
    private String serviceName;

    /**
     * 请求票据
     */
    private String accessToken;

    /**
     * 客户端IP
     */
    private String clientIP;

    /**
     * 应用ID
     */
    private String appId;

    /**
     * 修改实体名称
     */
    private String changeEntityClass;

    /**
     * 表名
     */
    private String tableName;

    /**
     * 修改数据集合
     */
    private List<Comparison> comparisonList;

    /**
     * 创建时间
     */
    private Date createDate;

    /**
     * 用户编码
     */
    private String userId;

    /**
     * 用户名称
     */
    private String userName;

    /**
     * 客户编码
     */
    private String customerId;

    /**
     * 客户姓名
     */
    private String customerName;

    /**
     * 房屋编码
     */
    @Deprecated
    private String houseId;

    /**
     * 建筑编码
     */
    private String buildingId;

    /**
     * 建筑类型
     */
    private String buildingType;

    /**
     * 项目编码
     */
    private String projectId = "";

    /**
     * 项目名称
     */
    private String projectName = "";

    /**
     * 网格编码
     */
    private String gridId = "";

    /**
     * 网格名称
     */
    private String gridName = "";

    /**
     * 运营中心编码
     */
    private String organizationId = "";

    /**
     * 运营中心名称
     */
    private String organizationName = "";

    /**
     * 管理中心编码
     */
    private String manageCenterId = "";

    /**
     * 管理中心名称
     */
    private String manageCenterName = "";

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getClientIP() {
        return clientIP;
    }

    public void setClientIP(String clientIP) {
        this.clientIP = clientIP;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getChangeEntityClass() {
        return changeEntityClass;
    }

    public void setChangeEntityClass(String changeEntityClass) {
        this.changeEntityClass = changeEntityClass;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public List<Comparison> getComparisonList() {
        return comparisonList;
    }

    public void setComparisonList(List<Comparison> comparisonList) {
        this.comparisonList = comparisonList;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getGridId() {
        return gridId;
    }

    public void setGridId(String gridId) {
        this.gridId = gridId;
    }

    public String getGridName() {
        return gridName;
    }

    public void setGridName(String gridName) {
        this.gridName = gridName;
    }

    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
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

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getManageCenterId() {
        return manageCenterId;
    }

    public void setManageCenterId(String manageCenterId) {
        this.manageCenterId = manageCenterId;
    }

    public String getManageCenterName() {
        return manageCenterName;
    }

    public void setManageCenterName(String manageCenterName) {
        this.manageCenterName = manageCenterName;
    }

    public String getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(String buildingId) {
        this.buildingId = buildingId;
    }

    public String getBuildingType() {
        return buildingType;
    }

    public void setBuildingType(String buildingType) {
        this.buildingType = buildingType;
    }
}
