package bingo.vkcrm.component.notify.impl;

import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.component.notify.models.Notify;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Wangzr on 16/1/14.
 */
public class RedisNotifyService {

    private static final Log log = LogFactory.getLog(RedisNotifyService.class);

    private final String REDIS_DB = "redis.notify.db";
    private final String KEY_PREFIX = "NOTIFY_";
    private final int LIST_SIZE = 50;

    /**
     * 获取存储用户通知的Redis Key
     *
     * @param type
     * @param subscriberId
     * @return
     */
    private String getUserKey(String type, String subscriberId) {
        return KEY_PREFIX + type + "_" + subscriberId;
    }

    public void addNotifyToUsers(Notify notify, List<String> userIds) {
        try {
            JedisUtil redis = JedisUtil.switchDb(REDIS_DB);
            String notifyJson = JsonUtil.toJson(notify);
            for (String userId : userIds) {
                redis.lpush(getUserKey(notify.getType(), userId), notifyJson);
                log.debug("REDIS: 为用户[" + userId + "]写入通知[" + notifyJson + "]");
            }
            log.info("REDIS: 通知[" + notifyJson + "]已发送给" + userIds.size() + "个用户");
        } catch (Exception ex) {
            log.error("添加通知关联用户失败", ex);
        }
    }

    /**
     * 获取未读的通知
     * @param subscriberId 订阅人
     * @param type         订阅类型
     * @return
     */
    public long getUnReadCount(String subscriberId, String type) {
        try {
            String key = getUserKey(type, subscriberId);
            JedisUtil redis = JedisUtil.switchDb(REDIS_DB);
            long size = redis.llen(key);
            return size;
        } catch (Exception ex) {
            log.error("获取用户" + subscriberId + "类型" + type + "的所有未读通知失败", ex);
            return -1;
        }
    }

    /**
     * 获取未读的通知
     * @param subscriberId 订阅人
     * @param type         订阅类型
     * @param pageSize     每页数据量
     * @param pageIndex    页码(从1开始)
     * @return
     */
    public List<Notify> getUnRead(String subscriberId, String type, int pageIndex, int pageSize) {
        try {
            String key = getUserKey(type, subscriberId);
            int from = (pageIndex - 1) * pageSize;
            int to = pageIndex * pageSize;
            JedisUtil redis = JedisUtil.switchDb(REDIS_DB);
            long totalSize = redis.llen(key);
            if(from > totalSize){
                return new ArrayList<Notify>(0);
            }
            List<String> listFromCache = redis.lrange(key, from, to);
            List<Notify> notifies = new ArrayList<Notify>(listFromCache.size());
            for (String notifyJson : listFromCache) {
                notifies.add(JsonUtil.fromJson(notifyJson, Notify.class));
            }
            return notifies;
        } catch (Exception ex) {
            log.error("获取用户" + subscriberId + "类型" + type + "的所有未读通知失败", ex);
            return null;
        }
    }

    public boolean delete(String subscriberId, String type, List<Notify> notifies) {
        try {
            String key = getUserKey(type, subscriberId);
            JedisUtil redis = JedisUtil.switchDb(REDIS_DB);
            for (Notify notify : notifies) {
                redis.lrem(key, 0, JsonUtil.toJson(notify));
            }
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }
}
