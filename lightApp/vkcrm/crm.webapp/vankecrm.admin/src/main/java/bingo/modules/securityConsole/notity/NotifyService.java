package bingo.modules.securityConsole.notity;

import bingo.common.BaseService;
import bingo.dao.Dao;
import bingo.security.SecurityContext;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotifyService extends BaseService {

    /**
     * 保存或者更新通知配置
     *
     * @param notifySubscribe
     * @return
     */
    public String saveOrUpdate(NotifySubscribe notifySubscribe) {
        if (StringUtils.isEmpty(notifySubscribe.getId())) {
            notifySubscribe.setId(Dao.getUUID());
            notifySubscribe.setCreatedBy(SecurityContext.getCurrentUser().getId());
            notifySubscribe.setCreatedDate(new Date());
            dao.insert(notifySubscribe);
        } else {
            notifySubscribe.setUpdatedBy(SecurityContext.getCurrentUser().getId());
            notifySubscribe.setUpdatedDate(new Date());
            deleteNotifySubscribes(notifySubscribe);
            dao.updateFieldsNotNull(notifySubscribe);
        }
        return notifySubscribe.getId();
    }

    /**
     * 更新通知订阅配置
     *
     * @param notifyId
     */
    public void updateNotifySubscribe(String notifyId) {
        NotifySubscribe notifySubscribe = new NotifySubscribe();
        notifySubscribe.setId(notifyId);
        notifySubscribe.setUpdatedBy(SecurityContext.getCurrentUser().getId());
        notifySubscribe.setUpdatedDate(new Date());
        deleteNotifySubscribes(notifySubscribe);
        dao.updateFieldsNotNull(notifySubscribe);
    }

    /**
     * 删除通知配置
     *
     * @param notifyId
     */
    public void deleteNotify(String notifyId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("notifyId", notifyId);
        paramsMap.put("userId", SecurityContext.getCurrentUser().getId());
        dao.update("notify.delete", paramsMap);
    }

    /**
     * 批量删除通知配置
     *
     * @param notifyIds
     */
    public void deleteNotifies(String[] notifyIds) {
        if (null != notifyIds && notifyIds.length > 0) {
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("userId", SecurityContext.getCurrentUser().getId());
            for (String notifyId : notifyIds) {
                paramsMap.put("notifyId", notifyId.replace("[", "").replace("]", "").replace("\"", ""));
                dao.update("notify.delete", paramsMap);
            }
        }

    }

    /**
     * 根据ID获取通知订阅配置
     *
     * @param id
     * @return
     */
    public NotifySubscribe getNotifySubscribeById(String id) {
        return rnDao.select(NotifySubscribe.class, id);
    }

    /**
     * 添加通知订阅用户集合
     *
     * @param notifyId
     * @param userIds
     */
    public String addNotifySubscribeUser(String notifyId, String[] userIds, String type) {
        if (null != userIds && userIds.length > 0) {
            //deleteNotifySubscribes(notifyId, "user", type);
            NotifySubscribeRule notifySubscribeRule = new NotifySubscribeRule();
            notifySubscribeRule.setBasis(type);
            notifySubscribeRule.setSubscribeId(notifyId);
            for (String userId : userIds) {
                notifySubscribeRule.setValue(userId.replace("[", "").replace("]", "").replace("\"", ""));
                dao.insert(NotifySubscribeRule.class, notifySubscribeRule);
            }
            updateNotifySubscribe(notifyId);
        }
        return notifyId;
    }

    /**
     * 删除通知订阅配置
     *
     * @param notifySubscribe
     */
    public void deleteNotifySubscribes(NotifySubscribe notifySubscribe) {
        String notifyId = notifySubscribe.getId();
        NotifySubscribe beforeUpdatedNotifySubscribe = dao.select(NotifySubscribe.class, notifyId);
        if (notifySubscribe == null) {
            return;
        }
        if (StringUtils.isNotEmpty(notifySubscribe.getInitialtorMode()) && !notifySubscribe.getInitialtorMode().equalsIgnoreCase(beforeUpdatedNotifySubscribe.getInitialtorMode())) {
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("notifyId", notifyId);
            paramsMap.put("type", "initialtor");
            dao.delete("notify.delete.byBasis", paramsMap);
        }
        if (StringUtils.isNotEmpty(notifySubscribe.getRecipientMode()) && !notifySubscribe.getRecipientMode().equalsIgnoreCase(beforeUpdatedNotifySubscribe.getRecipientMode())) {
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("notifyId", notifyId);
            paramsMap.put("type", "recipient");
            dao.delete("notify.delete.byBasis", paramsMap);
        }
    }

    /**
     * 删除通知订阅配置
     *
     * @param notifyId
     * @param type
     */
    public void deleteNotifySubscribes(String notifyId, String type, String modeType) {
        NotifySubscribe notifySubscribe = dao.select(NotifySubscribe.class, notifyId);
        if (notifySubscribe == null) {
            return;
        }
        if (!type.equalsIgnoreCase(notifySubscribe.getInitialtorMode())) {
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("notifyId", notifyId);
            paramsMap.put("type", modeType);
            dao.delete("notify.delete.byBasis", paramsMap);
        }
        if (!type.equalsIgnoreCase(notifySubscribe.getRecipientMode())) {
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("notifyId", notifyId);
            paramsMap.put("type", modeType);
            dao.delete("notify.delete.byBasis", paramsMap);
        }
    }

    /**
     * 删除通知订阅用户
     *
     * @param notifyId
     * @param userId
     */
    public void deleteNotifyUser(String notifyId, String userId, String type) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("notifyId", notifyId);
        paramsMap.put("type", type);
        paramsMap.put("userId", userId);
        dao.delete("notify.delete.user", paramsMap);
        updateNotifySubscribe(notifyId);
    }

    /**
     * 批量删除通知订阅用户
     *
     * @param notifyId
     * @param userIds
     */
    public void deleteNotifyUsers(String notifyId, String[] userIds, String type) {
        if (null != userIds && userIds.length > 0) {
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("notifyId", notifyId);
            paramsMap.put("type", type);
            for (String userId : userIds) {
                paramsMap.put("userId", userId.replace("[", "").replace("]", "").replace("\"", ""));
                dao.delete("notify.delete.user", paramsMap);
            }
            updateNotifySubscribe(notifyId);
        }
    }

    /**
     * 添加通知订阅角色集合
     *
     * @param notifyId
     * @param roleIds
     */
    public String addNotifySubscribeRole(String notifyId, String[] roleIds, String type) {
        if (null != roleIds && roleIds.length > 0) {
            //deleteNotifySubscribes(notifyId, "role", type);
            NotifySubscribeRule notifySubscribeRule = new NotifySubscribeRule();
            notifySubscribeRule.setBasis(type);
            notifySubscribeRule.setSubscribeId(notifyId);
            for (String roleId : roleIds) {
                notifySubscribeRule.setValue(roleId.replace("[", "").replace("]", "").replace("\"", ""));
                dao.insert(NotifySubscribeRule.class, notifySubscribeRule);
            }
            updateNotifySubscribe(notifyId);
        }
        return notifyId;
    }

    /**
     * 删除通知订阅角色
     *
     * @param notifyId
     * @param roleId
     */
    public void deleteNotifyRole(String notifyId, String roleId, String type) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("notifyId", notifyId);
        paramsMap.put("type", type);
        paramsMap.put("roleId", roleId);
        dao.delete("notify.delete.role", paramsMap);
        updateNotifySubscribe(notifyId);
    }

    /**
     * 批量删除通知订阅角色
     *
     * @param notifyId
     * @param roleIds
     */
    public void deleteNotifyRoles(String notifyId, String[] roleIds, String type) {
        if (null != roleIds && roleIds.length > 0) {
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("notifyId", notifyId);
            paramsMap.put("type", type);
            for (String roleId : roleIds) {
                paramsMap.put("roleId", roleId.replace("[", "").replace("]", "").replace("\"", ""));
                dao.delete("notify.delete.role", paramsMap);
            }
            updateNotifySubscribe(notifyId);
        }
    }

    /**
     * 添加通知订阅组织集合
     *
     * @param notifyId
     * @param organizationIds
     */
    public String addNotifySubscribeOrganization(String notifyId, String[] organizationIds, String type) {
        if (null != organizationIds && organizationIds.length > 0) {
            //deleteNotifySubscribes(notifyId, "org", type);
            NotifySubscribeRule notifySubscribeRule = new NotifySubscribeRule();
            notifySubscribeRule.setBasis(type);
            notifySubscribeRule.setSubscribeId(notifyId);
            for (String organizationId : organizationIds) {
                notifySubscribeRule.setValue(organizationId.replace("[", "").replace("]", "").replace("\"", ""));
                dao.insert(NotifySubscribeRule.class, notifySubscribeRule);
            }
            updateNotifySubscribe(notifyId);
        }
        return notifyId;
    }

    /**
     * 删除通知订阅组织
     *
     * @param notifyId
     * @param organizationId
     */
    public void deleteNotifyOrganization(String notifyId, String organizationId, String type) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("notifyId", notifyId);
        paramsMap.put("type", type);
        paramsMap.put("organizationId", organizationId);
        dao.delete("notify.delete.organization", paramsMap);
        updateNotifySubscribe(notifyId);
    }

    /**
     * 批量删除通知订阅组织
     *
     * @param notifyId
     * @param organizationIds
     */
    public void deleteNotifyOrganizations(String notifyId, String[] organizationIds, String type) {
        if (null != organizationIds && organizationIds.length > 0) {
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("notifyId", notifyId);
            paramsMap.put("type", type);
            for (String organizationId : organizationIds) {
                paramsMap.put("organizationId", organizationId.replace("[", "").replace("]", "").replace("\"", ""));
                dao.delete("notify.delete.organization", paramsMap);
            }
            updateNotifySubscribe(notifyId);
        }
    }

    /**
     * 添加通知订阅话务分组集合
     *
     * @param notifyId
     * @param telephonistGroupIds
     */
    public String addNotifySubscribeTelephonistGroup(String notifyId, String[] telephonistGroupIds, String type) {
        if (null != telephonistGroupIds && telephonistGroupIds.length > 0) {
            //deleteNotifySubscribes(notifyId, "telGroup", type);
            NotifySubscribeRule notifySubscribeRule = new NotifySubscribeRule();
            notifySubscribeRule.setBasis(type);
            notifySubscribeRule.setSubscribeId(notifyId);
            for (String telephonistGroupId : telephonistGroupIds) {
                notifySubscribeRule.setValue(telephonistGroupId.replace("[", "").replace("]", "").replace("\"", ""));
                dao.insert(NotifySubscribeRule.class, notifySubscribeRule);
            }
            updateNotifySubscribe(notifyId);
        }
        return notifyId;
    }

    /**
     * 删除通知订阅话务分组
     *
     * @param notifyId
     * @param telephonistGroupId
     */
    public void deleteNotifyTelephonistGroup(String notifyId, String telephonistGroupId, String type) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("notifyId", notifyId);
        paramsMap.put("type", type);
        paramsMap.put("telephonistGroupId", telephonistGroupId);
        dao.delete("notify.delete.telephonistGroup", paramsMap);
        updateNotifySubscribe(notifyId);
    }

    /**
     * 批量删除通知订阅话务分组
     *
     * @param notifyId
     * @param telephonistGroupIds
     */
    public void deleteNotifyTelephonistGroups(String notifyId, String[] telephonistGroupIds, String type) {
        if (null != telephonistGroupIds && telephonistGroupIds.length > 0) {
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("notifyId", notifyId);
            paramsMap.put("type", type);
            for (String telephonistGroupId : telephonistGroupIds) {
                paramsMap.put("telephonistGroupId", telephonistGroupId.replace("[", "").replace("]", "").replace("\"", ""));
                dao.delete("notify.delete.telephonistGroup", paramsMap);
            }
            updateNotifySubscribe(notifyId);
        }
    }
}
