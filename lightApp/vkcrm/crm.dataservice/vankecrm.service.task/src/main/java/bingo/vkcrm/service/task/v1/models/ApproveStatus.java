package bingo.vkcrm.service.task.v1.models;

/**
 * Created by hades on 15/11/12.
 */
public enum ApproveStatus {
    /**
     * 待审核
     */
    Pending(1),
    /**
     * 通过
     */
    Approve(2),
    /**
     * 不通过
     */
    Reject(3),
    /**
     * 退回
     */
    Rollback(4),
    /**
     * 关闭
     */
    Closed(5);

    private final int code;

    private ApproveStatus(int mCode) {
        this.code = mCode;
    }

    public int getCode() {
        return code;
    }
}
