package bingo.vkcrm.service.model;

import bingo.dao.orm.annotations.Table;

import java.util.Date;

/**
 * 物业关系修改日志
 */
@Table(name = "log_relation_change")
public class RelationChangeLog extends BaseModel {
    /**
     * 唯一标识
     */
    private String id;

    /**
     * 房屋编码
     */
    @Deprecated
    private String houseId;
    private String houseName;
    /**
     * 建筑编码
     */
    private String buildingId;

    /**
     * 建筑类型
     */
    private String buildingType;

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
     * 项目编码
     */
    private String projectId;

    /**
     * 项目名称
     */
    private String projectName;

    /**
     * 网格编码
     */
    private String gridId;

    /**
     * 网格名称
     */
    private String gridName;

    /**
     * 运营中心编码
     */
    private String organizationId;

    /**
     * 运营中心名称
     */
    private String organizationName;

    /**
     * 客户编码
     */
    private String customerId;

    /**
     * 客户姓名
     */
    private String customerName;

    /**
     * 资源编码
     */
    private String resourceId;

    /**
     * 资源名称
     */
    private String resourceName;

    /**
     * 修改类型
     */
    private String changeType;

    /**
     * 关系编码
     */
    private int relationId;

    private String relationText;

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

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getChangeType() {
        return changeType;
    }

    public void setChangeType(String changeType) {
        this.changeType = changeType;
    }

    public int getRelationId() {
        return relationId;
    }

    public void setRelationId(int relationId) {
        this.relationId = relationId;
    }



    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
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

    /**
     * 房屋名称
     */
    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    /**
     * 关系名称
     */
    public String getRelationText() {
        return relationText;
    }

    public void setRelationText(String relationText) {
        this.relationText = relationText;
    }
}
