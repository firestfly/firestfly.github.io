package bingo.vkcrm.service.enums;

/**
 * 请求类型
 */
public enum AccessTypes {
    /**
     * Rest
     */
    Rest("rest"),

    /**
     * App
     */
    App("app"),

    /**
     * OAuth
     */
    OAuth("oauth"),

    /**
     * 战图
     */
    Bmap("bmap");

    private String value = "";

    AccessTypes(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
