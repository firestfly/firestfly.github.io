package bingo.vkcrm.service.house.v1.models;

/**
 * Created by asus on 2015/10/24.
 */
public class CustomerInfo {
    private String customerId;
    private String owner;
    private String mainMobile;

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getMainMobile() {
        return mainMobile;
    }

    public void setMainMobile(String mainMobile) {
        this.mainMobile = mainMobile;
    }
}
