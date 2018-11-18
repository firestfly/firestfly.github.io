package bingo.vkcrm.service.customer.v1.models;

import java.util.List;

/**
 * Created by Administrator on 2016/5/13.
 */
public class CallCenterCustomer {
    private String customerId;
    private String fullName;
    private String mainMobile;
    private String sex;
    private String hobbies;
    private String identities;

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getMainMobile() {
        return mainMobile;
    }

    public void setMainMobile(String mainMobile) {
        this.mainMobile = mainMobile;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getHobbies() {
        return hobbies;
    }

    public void setHobbies(String hobbies) {
        this.hobbies = hobbies;
    }

    public String getIdentities() {
        return identities;
    }

    public void setIdentities(String identities) {
        this.identities = identities;
    }
}
