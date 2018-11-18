/**
 * This file created at 2010-10-22.
 * <p/>
 * Copyright (c) 2002-2010 Bingosoft, Inc. All rights reserved.
 */
package bingo.vkcrm.service.service;

import bingo.common.core.ApplicationContext;
import bingo.common.core.ApplicationFactory;
import bingo.dao.IDao;
import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.common.UserContext;
import bingo.vkcrm.service.model.RelationChangeLog;
import bingo.vkcrm.service.utils.HttpUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Required;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * <code>{@link BaseService}</code>
 * <p/>
 * 服务类基础类
 */
public abstract class BaseService {

    protected final Logger log = LoggerFactory.getLogger(this.getClass());

    private static final String SERVICE_NAME = ApplicationContext.getProperty("service_name", "服务");

    /**
     * Center库
     */
    @Autowired(required = false)
    @Qualifier(value = "centerDao")
    protected IDao centerDao;
    /**
     * Center只读库
     */
    @Autowired(required = false)
    @Qualifier(value = "centerRoDao")
    protected IDao centerRoDao;

    /**
     * 业务库
     */
    @Autowired(required = false)
    @Qualifier(value = "bizDao")
    protected IDao bizDao;
    /**
     * 业务只读库
     */
    @Autowired(required = false)
    @Qualifier(value = "bizRoDao")
    protected IDao bizRoDao;

    /**
     * 系统库
     */
    @Autowired(required = false)
    @Qualifier(value = "sysDao")
    protected IDao sysDao;
    /**
     * 系统只读库
     */
    @Autowired(required = false)
    @Qualifier(value = "sysRoDao")
    protected IDao sysRoDao;

    /**
     * 日志库
     */
    @Autowired(required = false)
    @Qualifier(value = "logDao")
    protected IDao logDao;
    /**
     * 日志只读库
     */
    @Autowired(required = false)
    @Qualifier(value = "logRoDao")
    protected IDao logRoDao;

    /**
     * 报表库
     */
    @Autowired(required = false)
    @Qualifier(value = "reportDao")
    protected IDao reportDao;
    /**
     * 报表只读库
     */
    @Autowired(required = false)
    @Qualifier(value = "reportRoDao")
    protected IDao reportRoDao;

    @Autowired(required = false)
    private HttpServletRequest httpServletRequest;

    /**
     * 记录关系修改日志至消息队列
     *
     * @param customerId
     * @param resourceId
     * @param changeType
     * @param resourceType
     * @param relationType
     */
    @Deprecated
    protected void logRelation2RedisMQ(String customerId, String houseId, String resourceId, String changeType, String resourceType, int relationType) {
        //获取access_token
        String accessToken = StringUtils.isNotEmpty(httpServletRequest.getHeader("Authorization")) ? httpServletRequest.getHeader("Authorization").replace("Bearer ", "") : "";
        //获取客户端IP
        String clientIP = HttpUtil.getIpAddress(httpServletRequest);
        try {
            RelationChangeLog relationChangeLog = new RelationChangeLog();

            Map<String, Object> customerInfo = queryCustomerInfo(customerId);

            String customerName = null;

            if (customerInfo != null) {
                customerName = customerInfo.get("fullName") != null ? customerInfo.get("fullName").toString() : "";
            }

            User user = UserContext.getCurrentUser();
            relationChangeLog.setUserId(user.getId());
            relationChangeLog.setUserName(user.getName());
            relationChangeLog.setAccessToken(accessToken);
            relationChangeLog.setClientIP(clientIP);
            relationChangeLog.setServiceName(SERVICE_NAME);
            relationChangeLog.setRelationId(relationType);
            relationChangeLog.setRelationText("");
            relationChangeLog.setCustomerId(customerId);
            relationChangeLog.setHouseId(houseId);
            relationChangeLog.setCustomerName(customerName);
            relationChangeLog.setResourceId(resourceId);
            relationChangeLog.setResourceName(resourceType);
            relationChangeLog.setChangeType(changeType);
            String jsonString = JsonUtil.toJson(relationChangeLog);
            String accessLogKey = ApplicationContext.getProperty("log.relationchangelog.key", "RelationChangeLog");
            JedisUtil.defaultDb().lpush(accessLogKey.getBytes("UTF-8"), jsonString.getBytes("UTF-8"));
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }

    /**
     * 记录关系修改日志至消息队列
     *
     * @param customerId
     * @param buildingId
     * @param buildingType
     * @param resourceId
     * @param changeType
     * @param resourceType
     * @param relationType
     */
    protected void logRelation2RedisMQ(String customerId, String buildingId, String buildingType, String resourceId, String changeType, String resourceType, int relationType) {
        //获取access_token
        String accessToken = StringUtils.isNotEmpty(httpServletRequest.getHeader("Authorization")) ? httpServletRequest.getHeader("Authorization").replace("Bearer ", "") : "";
        //获取客户端IP
        String clientIP = HttpUtil.getIpAddress(httpServletRequest);
        try {
            RelationChangeLog relationChangeLog = new RelationChangeLog();

            Map<String, Object> customerInfo = queryCustomerInfo(customerId);

            String customerName = null;

            if (customerInfo != null) {
                customerName = customerInfo.get("fullName") != null ? customerInfo.get("fullName").toString() : "";
            }

            User user = UserContext.getCurrentUser();
            relationChangeLog.setUserId(user.getId());
            relationChangeLog.setUserName(user.getName());
            relationChangeLog.setAccessToken(accessToken);
            relationChangeLog.setClientIP(clientIP);
            relationChangeLog.setServiceName(SERVICE_NAME);
            relationChangeLog.setRelationId(relationType);
            relationChangeLog.setRelationText("");
            relationChangeLog.setCustomerId(customerId);
            relationChangeLog.setBuildingId(buildingId);
            relationChangeLog.setBuildingType(buildingType);
            relationChangeLog.setCustomerName(customerName);
            relationChangeLog.setResourceId(resourceId);
            relationChangeLog.setResourceName(resourceType);
            relationChangeLog.setChangeType(changeType);
            String jsonString = JsonUtil.toJson(relationChangeLog);
            String accessLogKey = ApplicationContext.getProperty("log.relationchangelog.key", "RelationChangeLog");
            JedisUtil.defaultDb().lpush(accessLogKey.getBytes("UTF-8"), jsonString.getBytes("UTF-8"));
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }

    /**
     * 检查用户是否有权限
     *
     * @param userId    用户ID
     * @param operation 操作权限
     * @return 用户是否有操作权限
     */
    public boolean hasPermission(String userId, String operation) {
        return sysDao.getJdbcDao().exists("sql.security.hasPermission", userId, operation);
    }

    /**
     * @param customerId
     * @return
     */
    public Map<String, Object> queryCustomerInfo(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerDao.queryForMap("sql.query.customer.basic", parameters);
    }


}