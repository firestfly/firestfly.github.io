package bingo.vkcrm.component.notify.impl;

import bingo.dao.IDao;
import bingo.dao.Page;
import bingo.vkcrm.component.notify.DaoFactory;
import bingo.vkcrm.component.notify.models.Notify;
import bingo.vkcrm.component.notify.models.NotifySubscribe;
import bingo.vkcrm.component.notify.models.NotifySubscribeRule;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Wangzr on 16/1/14.
 */
public class DbNotifyService {

    private static final Log log = LogFactory.getLog(RedisNotifyService.class);
    private IDao bizDao;
    private IDao orgDao;

    public void setDaoFactory(DaoFactory factory) {
        this.bizDao = factory.getBizDao();
        if (this.bizDao == null) {
            throw new NullPointerException("未初始化bizDao");
        }
        this.orgDao = factory.getOrgDao();
        if(this.orgDao == null){
            throw new NullPointerException("未初始化orgDao");
        }
    }

    /**
     * 获取所有订阅关系
     * @param lastUpdatedTime 最后一次更新时间,用于增量更新配置文件
     * @return
     */
    public List<NotifySubscribe> queryAllRelations(Date lastUpdatedTime) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("lastUpdatedTime", lastUpdatedTime);
        List<NotifySubscribe> subscribes = orgDao.queryForList(NotifySubscribe.class, "sql.notifySubscribe.all", parameters);
        for (NotifySubscribe subscribe : subscribes) {
            // 初始化发送人规则值
            parameters.put("subscribeId", subscribe.getId());
            parameters.put("basis", "initialtor");
            subscribe.setInitialtorRules(orgDao.queryForList(NotifySubscribeRule.class, "sql.notifySubscribe.rules.query", parameters));
            // 初始化接收人规则值
            parameters.put("subscribeId", subscribe.getId());
            parameters.put("basis", "recipient");
            subscribe.setRecipientRules(orgDao.queryForList(NotifySubscribeRule.class, "sql.notifySubscribe.rules.query", parameters));
        }
        return subscribes;
    }

    /**
     * 添加通知
     * @param type          通知类型
     * @param content       通知内容
     * @param publisherId   发布者
     * @return
     */
    public Notify addNotify(String type, String content, String publisherId) {
        log.debug("DB:准备将通知[" + content + "]保存到数据库");
        String notifyId = StringUtils.replace(UUID.randomUUID().toString(), "-", "");

        Date now = new Date();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formatNow = format.format(now);

        // 因为出现同一个时间插入DB和Redis的时间不一致,所以这里进行格式化去除毫秒,保留到秒
        try{
            now = format.parse(formatNow);
        }catch(ParseException ex){

        }

        Notify notify = new Notify();
        notify.setId(notifyId);
        notify.setType(type);
        notify.setContent(content);
        notify.setCreatedBy(publisherId);
        notify.setCreatedAt(now);

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("id", notify.getId());
        parameters.put("type", notify.getType());
        parameters.put("content", notify.getContent());
        parameters.put("created_by", notify.getCreatedBy());
        parameters.put("created_at", notify.getCreatedAt());
        if (bizDao.insert("sql.notify.add", parameters) > 0) {
            log.info("DB:已将通知[" + notify.getContent() + "]保存到数据库");
            return notify;
        } else {
            return null;
        }
    }

    /**
     * 添加通知与用户的关联关系
     * @param notify    通知
     * @param userIds   关联用户(订阅者)
     */
    public void addNotifyToUsers(Notify notify, List<String> userIds) {
        log.debug("DB:准备将通知[" + notify.getId() + "][" + notify.getContent() + "]添加用户关联关系");
        String sql = bizDao.getSql("sql.notify.add.user");
        Connection conn = null;
        try {
            conn = bizDao.getDataSource().getConnection();
            PreparedStatement prest = conn.prepareStatement(sql, ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
            for (String userId : userIds) {
                prest.setString(1, userId);
                prest.setString(2, notify.getId());
                prest.addBatch();
            }
            prest.executeBatch();
            conn.commit();
            conn.close();
        } catch (Exception ex) {

        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (Exception ex1) {

                }
            }
            log.info("DB:已将通知[" + notify.getId() + "][" + notify.getContent() + "]添加用户关联关系");
        }
    }

    /**
     * 获取通知
     * @param type 通知类型
     * @param ids  通知id集合
     * @return
     */
    public List<Notify> getNotifies(String type, String[] ids) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("type", type);
        parameters.put("notifyIds", "'" + StringUtils.join(ids, "','") + "'");
        return bizDao.queryForList(Notify.class, "sql.notify.query.ids", parameters);
    }

    /**
     * 获取通知数量
     * @param subscriberId 订阅用户
     * @return
     */
    public int getUnReadCount(String subscriberId){
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("subscriberId", subscriberId);
        return bizDao.queryForInt("sql.notify.query.count", parameters);
    }

    /**
     * 获取所有已读通知
     * @param subscriberId  订阅者
     * @param type          通知类型
     * @param pager         分页参数
     * @return
     */
    public List<Notify> getRead(String subscriberId, String type, Page pager) {
        pager.setOrderClause("received_at desc");

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("subscriberId", subscriberId);
        parameters.put("type", type);
        parameters.put("received", 1);
        parameters.put("read", 1);
        List<Notify> notifies = bizDao.queryForListPage(Notify.class, pager, "sql.notify.query", null, parameters, true);
        return notifies;
    }

    /**
     * 获取所有已读通知
     * @param subscriberId  订阅者
     * @param type          通知类型
     * @param startTime     接收通知开始时间
     * @param endTime       接收通知结束时间
     * @param content       通知内容
     * @param pager         分页参数
     * @return
     */
    public List<Notify> getUnRead(String subscriberId, String type, Date startTime, Date endTime, String content, Page pager) {
        pager.setOrderClause("received_at desc");

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("subscriberId", subscriberId);
        parameters.put("type", type);
        parameters.put("startTime", startTime == null ? null : format.format(startTime));
        parameters.put("endTime", endTime == null ? null : format.format(endTime));
        parameters.put("content", content);
        parameters.put("received", 1);
        parameters.put("read", 0);
        List<Notify> notifies = bizDao.queryForListPage(Notify.class, pager, "sql.notify.query", null, parameters, true);
        return notifies;
    }

    /**
     * 获取所有已读通知
     * @param subscriberId  订阅者
     * @param type          通知类型
     * @param pager         分页参数
     * @return
     */
    public List<Notify> getRead(String subscriberId, String type, Date startTime, Date endTime, String content, Page pager) {
        pager.setOrderClause("received_at desc");

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("subscriberId", subscriberId);
        parameters.put("type", type);
        parameters.put("startTime", startTime == null ? null : format.format(startTime));
        parameters.put("endTime", endTime == null ? null : format.format(endTime));
        parameters.put("content", content);
        parameters.put("received", 1);
        parameters.put("read", 1);
        List<Notify> notifies = bizDao.queryForListPage(Notify.class, pager, "sql.notify.query", null, parameters, true);
        return notifies;
    }

    /**
     * 标记通知已读
     * @param subscriberId  订阅者
     * @param ids           关联通知id集合
     * @return
     */
    public boolean markedRead(String subscriberId, String[] ids) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("subscriberId", subscriberId);
        parameters.put("notifyIds", "'" + StringUtils.join(ids, "','") + "'");
        return bizDao.update("sql.notify.marked.read", parameters) > 0;
    }

    /**
     * 标记通知已读
     * @param subscriberId  订阅者
     * @param type          通知类型
     * @param startTime     通知接收开始时间
     * @param endTime       通知接收结束时间
     * @param content       通知关键字
     * @return
     */
    public boolean markedRead(String subscriberId, String type, Date startTime, Date endTime, String content) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("subscriberId", subscriberId);
        parameters.put("type", type);
        parameters.put("startTime", startTime == null ? null : format.format(startTime));
        parameters.put("endTime", endTime == null ? null : format.format(endTime));
        parameters.put("content", content);

        bizDao.update("sql.notify.marked.read.condition", parameters);
        return true;
    }

    /**
     * 标记通知删除
     * @param subscriberId  订阅者
     * @param ids           关联通知id集合
     * @return
     */
    public boolean markedDeleted(String subscriberId, String[] ids) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("subscriberId", subscriberId);
        parameters.put("notifyIds", "'" + StringUtils.join(ids, "','") + "'");
        return bizDao.update("sql.notify.marked.deleted", parameters) > 0;
    }

    /**
     * 标记通知已读
     * @param subscriberId  订阅者
     * @param type          通知类型
     * @param startTime     通知接收开始时间
     * @param endTime       通知接收结束时间
     * @param content       通知关键字
     * @return
     */
    public boolean markedDeleted(String subscriberId, String type, Date startTime, Date endTime, String content) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("subscriberId", subscriberId);
        parameters.put("type", type);
        parameters.put("startTime", startTime == null ? null : format.format(startTime));
        parameters.put("endTime", endTime == null ? null : format.format(endTime));
        parameters.put("content", content);

        bizDao.update("sql.notify.marked.deleted.condition", parameters);
        return true;
    }
}
