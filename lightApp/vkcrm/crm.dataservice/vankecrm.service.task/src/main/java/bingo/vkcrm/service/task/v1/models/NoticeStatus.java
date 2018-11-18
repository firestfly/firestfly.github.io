package bingo.vkcrm.service.task.v1.models;

/**
 * Created by hades on 15/11/12.
 */
public enum NoticeStatus {
    /**
     * 待生效
     */
    Pending(1),
    /**
     * 已生效
     */
    TakeEffect(2),
    /**
     * 已失效
     */
    LostEffect(3);

    private final int code;

    private NoticeStatus(int mCode) {
        this.code = mCode;
    }

    public int getCode() {
        return code;
    }
}
