package bingo.vkcrm.service.enums;

/**
 * 客户与房屋的关系类型
 */
public enum RelationTypes {
    /**
     * 拥有
     */
    Owner(1),
    /**
     * 居住
     */
    Live(2),
    /**
     * 租赁
     */
    Rent(3),
    /**
     * 账单
     */
    Bill(4),
    /**
     * 分润
     */
    Profit(5),
    /**
     * 其他
     */
    Other(99);

    private Integer code = 0;

    private RelationTypes(Integer code) {
        this.code = code;
    }

    public Integer getCode() {
        return code;
    }
}
