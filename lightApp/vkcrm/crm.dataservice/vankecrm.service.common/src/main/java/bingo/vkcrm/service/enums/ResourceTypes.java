package bingo.vkcrm.service.enums;

/**
 * 资源类型
 */
public enum ResourceTypes {
    Car("车辆"),
    Pet("宠物"),
    House("房屋"),
    CarPort("车位"),
    Customer("客户"),
    Hobby("个人兴趣"),
    Tag("标签"),
    specialIdentity("特殊身份");

    private String value = "";

    ResourceTypes(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
