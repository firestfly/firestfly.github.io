package bingo.vkcrm.service.task.v1.models;

/**
 * Created by szsonic on 2015/11/26.
 */
public enum AppTaskStatus {

    /**
     * 任务创建
     */
    任务创建("1001"),
    /**
     * 等待管家处理
     */
    等待管家处理("1002"),
    /**
     * 等待管家处理
     */
    等待CRM处理("1003"),
    /**
     * 等待员工抢单
     */
    等待员工抢单("1004"),
    /**
     * 等待系统负责人处理
     */
    等待系统负责人处理("1005"),
    /**
     * 等待员工开始工作
     */
    等待员工开始工作("1006"),
    /**
     * 员工工作中
     */
    员工工作中("1007"),
    /**
     * 工作暂停中
     */
    工作暂停中("1008"),
    /**
     * 员工工作完成
     */
    员工工作完成("1009"),
    /**
     * 任务完成
     */
    任务完成("1010"),
    /**
     * 任务已评价
     */
    任务已评价("1011"),
    /**
     * 用户取消任务
     */
    用户取消任务("1012");


    private final String code;

    private AppTaskStatus(String mCode) {
        this.code = mCode;
    }

    public String getCode() {
        return code;
    }
}
