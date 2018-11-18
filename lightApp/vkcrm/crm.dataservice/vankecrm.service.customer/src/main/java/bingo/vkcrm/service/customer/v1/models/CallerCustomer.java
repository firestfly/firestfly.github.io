package bingo.vkcrm.service.customer.v1.models;

import bingo.vkcrm.service.enums.DictionaryCodes;
import bingo.vkcrm.service.model.BaseModel;

/**
 * 来电客户
 */
public class CallerCustomer extends BaseModel {
    /**
     * 客户Id
     */
    private String customerId;
    /**
     * 客户姓名
     */
    private String name;
    /**
     * 客户性别
     */
    private Integer sex;
    /**
     * 来电号码
     */
    private String phone;
    /**
     * 是否审核
     */
    private String hasApprove;

    private String contentId;

    private String identity;

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public String getSexText() {
        return this.getValue(DictionaryCodes.CustomerSex, this.sex);
    }

    public String getHasApprove() {
        return hasApprove;
    }

    public void setHasApprove(String hasApprove) {
        this.hasApprove = hasApprove;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getContentId() {
        return contentId;
    }

    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    public String getIdentity() {
        return identity;
    }

    public void setIdentity(String identity) {
        this.identity = identity;
    }
}
