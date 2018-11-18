package bingo.vkcrm.component.notify;

import bingo.common.core.ApplicationContext;
import bingo.dao.Page;
import bingo.vkcrm.component.notify.impl.DbNotifyService;
import bingo.vkcrm.component.notify.impl.RedisNotifyService;
import bingo.vkcrm.component.notify.models.Notify;
import bingo.vkcrm.component.notify.models.NotifySubscribe;
import bingo.vkcrm.component.notify.models.NotifySubscribeRule;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 通知控制器
 * Created by Wangzr on 16/1/14.
 */
public class NotifyCenter {

    private NotifyCenter(DaoFactory factory) {
        this.factory = factory;
        this.lastUpdatedTime = null;
        this.publisherMapper = new HashMap<String, List<NotifyPublisher>>();

        this.dbService = new DbNotifyService();
        this.dbService.setDaoFactory(factory);

        this.redisService = new RedisNotifyService();
        this.interval_Init = Integer.parseInt(ApplicationContext.getProperty("notify.init.interval", "5"));
    }

    private static final Log log = LogFactory.getLog(NotifyCenter.class);

    private DaoFactory factory;
    private Date lastUpdatedTime;

    private DbNotifyService dbService;
    private RedisNotifyService redisService;

    private int interval_Init = 5;
    private final int DEFAULT_PAGE_SIZE = 10;

    private static HashMap<String, List<NotifyPublisher>> publisherMapper;
    private Lock lock = new ReentrantLock();


    private static NotifyCenter instance;

    public static NotifyCenter getInstance(DaoFactory factory) {
        if (instance == null) {
            instance = new NotifyCenter(factory);
        }
        instance.initSubscribeRelation();
        return instance;
    }

    /**
     * 初始化订阅关系,不计算发布者和订阅者具体人员
     */
    public void initSubscribeRelation() {
        Date timespan = new Date();

        // 初始化间隔时间5分钟1000 * 60 * 间隔分钟
        if(lastUpdatedTime != null && timespan.getTime() - lastUpdatedTime.getTime() < (60000 * interval_Init)){
            return;
        }

        lock.lock();

        try {

            if (lastUpdatedTime != null && timespan.before(lastUpdatedTime)) {
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                log.debug("该进程的时间戳是:" + format.format(timespan) + ";最后更新时间为:" + format.format(lastUpdatedTime) + ";其他进程已初始化数据,退出;");
                return;
            }

            List<NotifySubscribe> subscribeRelation = dbService.queryAllRelations(lastUpdatedTime);
            log.info("从数据库获取到订阅关系数:" + subscribeRelation.size());
            if(subscribeRelation.size() == 0){
                return;
            }

            for (NotifySubscribe subscribe : subscribeRelation) {
                if (!publisherMapper.containsKey(subscribe.getType())) {
                    publisherMapper.put(subscribe.getType(), new ArrayList<NotifyPublisher>());
                }

                List<NotifyPublisher> publishers = publisherMapper.get(subscribe.getType());
                for (int i = 0; i < publishers.size(); i++) {
                    if (subscribe.getId().equals(publishers.get(i).getId())) {
                        publishers.remove(i);
                        break;
                    }
                }

                if (subscribe.getDeleted()) {
                    continue;
                }

                NotifyPublisher publisher = new NotifyPublisher();
                publisher.setDaoFactory(this.factory);
                publisher.setDbService(this.dbService);
                publisher.setRedisService(this.redisService);

                publisher.setId(subscribe.getId());
                publisher.setType(subscribe.getType());
                publisher.setInitialtorMode(subscribe.getInitialtorMode());
                for (NotifySubscribeRule rule : subscribe.getInitialtorRules()) {
                    publisher.getValues().add(rule.getValue());
                }

                NotifySubscriber subscriber = new NotifySubscriber();
                subscriber.setRecipientMode(subscribe.getRecipientMode());
                for (NotifySubscribeRule rule : subscribe.getRecipientRules()) {
                    subscriber.getValues().add(rule.getValue());
                }

                publisher.registerSubscriber(subscriber);
                publisherMapper.get(subscribe.getType()).add(publisher);
                log.info("已加载订阅关系类型:" + subscribe.getType() + ",发布者:" + publisher.toString() + ",订阅者:" + subscriber.toString());
            }

            if (subscribeRelation.size() > 0) {
                lastUpdatedTime = new Date();
            }
        } catch (Throwable ex) {
            ex.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    private HashMap<String, List<NotifyPublisher>> getPublisherMapper() {
        return this.publisherMapper;
    }

    /**
     * 发布通知
     *
     * @param type        通知类型
     * @param content     通知内容
     * @param publisherId 发布人Id
     * @return 如果不为null, 则存储的是发布者的错误信息
     */
    public HashMap<NotifyPublisher, String> publish(String type, String content, String publisherId) throws Throwable {
        if (publisherMapper == null) {
            log.error("尚未初始化通知订阅关系");
            throw new NullPointerException("尚未初始化通知订阅关系");
        }
        if (!publisherMapper.containsKey(type)) {
            log.error("当前通知类型不存在.通知类型:" + type);
            throw new Exception("当前通知类型不存在.通知类型:" + type);
        }
        List<NotifyPublisher> publishers = publisherMapper.get(type);
        if (publishers == null) {
            log.error("当前通知类型" + type + "尚未配置通知发布者");
            throw new NullPointerException("当前通知类型" + type + "尚未配置通知发布者");
        }
        HashMap<NotifyPublisher, String> errorMessages = new HashMap<NotifyPublisher, String>();

        HashSet<String> publishedUser = new HashSet<String>();

        log.debug("已检查到当前通知类型有个" + publishers.size() + "发布者");
        for (NotifyPublisher publisher : publishers) {
            String publisherDesc = publisher.toString();
            if (publisher.isUserCanPublish(publisherId)) {
                log.debug("通知发布者:" + publisherDesc + ",当前发布人:" + publisherId + " 校验通过,准备发布通知");
                try {
                    // 计算订阅者
                    publisher.resolveSubscriber();
                    // 检查该订阅人是否已发布通知
                    for (NotifySubscriber subscriber : publisher.getSubscribers()) {
                        // 去重,防止发送给多个规则的同一个人
                        for (String uid : publishedUser) {
                            if (subscriber.hasRecipientId(uid)) {
                                subscriber.removeRecipientId(uid);
                                log.debug("发布者:" + publisherDesc + " 过滤重复订阅者用户" + uid);
                            }
                        }
                    }

                    publisher.publish(content, publisherId);

                    log.debug("发布者:" + publisherDesc + " 发布完成");

                    for (NotifySubscriber subscriber : publisher.getSubscribers()) {
                        for (String uid : subscriber.getRecipientIds()) {
                            publishedUser.add(uid);
                        }
                    }

                } catch (Exception ex) {
                    errorMessages.put(publisher, ex.getMessage());
                    log.error("发布者:" + publisherDesc + " 发布过程中出现异常:" + ex.getMessage());
                    ex.printStackTrace();
                }
            } else {
                log.warn("通知发布者:" + publisherDesc + ",当前发布人:" + publisherId + " 校验不通过");
            }
        }

        return errorMessages;
    }

    /**
     * 获取所有未读通知
     *
     * @param subscriberId 订阅人Id
     * @param type         通知类型
     * @param pager        页码
     * @return
     */
    private List<Notify> getUnRead(String subscriberId, String type, Page pager) {
        //return redisService.getUnRead(subscriberId, type, pager.getPage(), pager.getPageSize());
        throw new NotImplementedException();
    }

    /**
     * 获取第一页未读通知
     *
     * @param subscriberId 订阅人Id
     * @param type         通知类型
     * @return
     */
    private List<Notify> getUnRead(String subscriberId, String type) {
        //return redisService.getUnRead(subscriberId, type, 1, DEFAULT_PAGE_SIZE);
        throw new NotImplementedException();
    }

    /**
     * 获取第一页未读通知
     *
     * @param subscriberId 订阅者
     * @param type         通知类型
     * @param startTime    接收通知开始时间
     * @param endTime      接收通知结束时间
     * @param content      通知内容
     * @param pager        分页参数
     * @return
     */
    public List<Notify> getUnRead(String subscriberId, String type, Date startTime, Date endTime, String content, Page pager) {
        //return redisService.getUnRead(subscriberId, type, 1, DEFAULT_PAGE_SIZE);
        pager.setQueryTotalRows(true);
        return dbService.getUnRead(subscriberId, type, startTime, endTime, content, pager);
    }


    /**
     * 获取第一页未读通知
     *
     * @param subscriberId 订阅人Id
     * @return
     */
    public int getUnReadCount(String subscriberId) {
        //return redisService.getUnReadCount(subscriberId, type);
        return dbService.getUnReadCount(subscriberId);
    }

    /**
     * 获取所有已读通知
     *
     * @param subscriberId 订阅者
     * @param type         通知类型
     * @param startTime    接收通知开始时间
     * @param endTime      接收通知结束时间
     * @param content      通知内容
     * @param pager        分页参数
     * @return
     */
    public List<Notify> getRead(String subscriberId, String type, Date startTime, Date endTime, String content, Page pager) {
        pager.setQueryTotalRows(true);
        return dbService.getRead(subscriberId, type, startTime, endTime, content, pager);
    }

    /**
     * 将通知标记为已读
     *
     * @param subscriberId 订阅人Id
     * @param ids          通知id集合
     * @return
     */
    public boolean readAll(String subscriberId, String type, String[] ids) {
        return dbService.markedRead(subscriberId, ids);
    }

    /**
     * 将通知标记为已读
     *
     * @param subscriberId 订阅者
     * @param type         通知类型
     * @param startTime    接收通知开始时间
     * @param endTime      接收通知结束时间
     * @param content      通知内容
     * @return
     */
    public boolean readAll(String subscriberId, String type, Date startTime, Date endTime, String content) {
        return dbService.markedRead(subscriberId, type, startTime, endTime, content);
    }

    /**
     * 删除通知
     *
     * @param subscriberId 订阅人Id
     * @param ids          通知id集合
     * @return
     */
    public boolean deleteAll(String subscriberId, String type, String[] ids) {
        return dbService.markedDeleted(subscriberId, ids);
    }

    /**
     * 将通知标记为删除
     *
     * @param subscriberId 订阅者
     * @param type         通知类型
     * @param startTime    接收通知开始时间
     * @param endTime      接收通知结束时间
     * @param content      通知内容
     * @return
     */
    public boolean deleteAll(String subscriberId, String type, Date startTime, Date endTime, String content) {
        return dbService.markedDeleted(subscriberId, type, startTime, endTime, content);
    }

}
