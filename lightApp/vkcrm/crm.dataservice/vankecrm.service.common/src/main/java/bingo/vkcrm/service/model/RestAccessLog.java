package bingo.vkcrm.service.model;

import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;

/**
 * Rest服务请求日志
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "log_rest_access")
public class RestAccessLog {
    /**
     * 唯一标识
     */
    @UUID
    private String id;

    /**
     * 服务名
     */
    private String serviceName;

    /**
     * 操作名
     */
    private String actionName;

    /**
     * 类型
     */
    private String accessType;

    /**
     * 请求URL
     */
    private String requestUrl;

    /**
     * 请求方法
     */
    private String requestMethod;

    /**
     * 请求时间
     */
    private Date requestDate;

    /**
     * 响应时间
     */
    private Date responseDate;

    /**
     * 请求参数表（json格式）
     */
    private String parameterMapJson;

    /**
     * 结果集（json格式）
     */
    private String resultJson;

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
     * 用户代理(浏览器信息)
     */
    private String userAgent;

    /**
     * 异常信息
     */
    private String exceptionMessage;

    /**
     * 创建时间
     */
    private Date createDate;

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

    public String getActionName() {
        return actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public String getAccessType() {
        return accessType;
    }

    public void setAccessType(String accessType) {
        this.accessType = accessType;
    }

    public String getRequestUrl() {
        return requestUrl;
    }

    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl;
    }

    public String getRequestMethod() {
        return requestMethod;
    }

    public void setRequestMethod(String requestMethod) {
        this.requestMethod = requestMethod;
    }

    public Date getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(Date requestDate) {
        this.requestDate = requestDate;
    }

    public Date getResponseDate() {
        return responseDate;
    }

    public void setResponseDate(Date responseDate) {
        this.responseDate = responseDate;
    }

    public String getParameterMapJson() {
        return parameterMapJson;
    }

    public void setParameterMapJson(String parameterMapJson) {
        this.parameterMapJson = parameterMapJson;
    }

    public String getResultJson() {
        return resultJson;
    }

    public void setResultJson(String resultJson) {
        this.resultJson = resultJson;
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

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getExceptionMessage() {
        return exceptionMessage;
    }

    public void setExceptionMessage(String exceptionMessage) {
        this.exceptionMessage = exceptionMessage;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}
