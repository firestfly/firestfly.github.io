package bingo.vkcrm.service.enums;

/**
 * 建筑类型
 */
public enum BuildingTypes {
    /**
     * 房屋
     */
    House("house"),
    /**
     * 车位
     */
    Carport("carport");

    private String value = "";

    BuildingTypes(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
