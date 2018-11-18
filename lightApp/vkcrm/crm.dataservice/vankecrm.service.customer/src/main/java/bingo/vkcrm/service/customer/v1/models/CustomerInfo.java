package bingo.vkcrm.service.customer.v1.models;

import java.util.List;

/**
 * 客户全部信息
 */
public class CustomerInfo {

    /**
     * 基本信息
     */
    private CustomerBasic basic;
    /**
     * 详细信息
     */
    private CustomerDetail details;
    /**
     * 兴趣爱好
     */
    private List<Integer> hobbies;
    /**
     * 特殊身份
     */
    private List<SpecialIdentity> identities;
    /**
     * 房屋关系表
     */
    private List<Integer> houseRelationTypes;
    /**
     * 与业主关系
     */
    private List<CustomerRelation> customerRelations;


    public CustomerBasic getBasic() {
        return basic;
    }

    public void setBasic(CustomerBasic basic) {
        this.basic = basic;
    }

    public CustomerDetail getDetails() {
        return details;
    }

    public void setDetails(CustomerDetail details) {
        this.details = details;
    }

    public List<Integer> getHobbies() {
        return hobbies;
    }

    public void setHobbies(List<Integer> hobbies) {
        this.hobbies = hobbies;
    }

    public List<SpecialIdentity> getIdentities() {
        return identities;
    }

    public void setIdentities(List<SpecialIdentity> identities) {
        this.identities = identities;
    }

    public List<Integer> getHouseRelationTypes() {
        return houseRelationTypes;
    }

    public void setHouseRelationTypes(List<Integer> houseRelationTypes) {
        this.houseRelationTypes = houseRelationTypes;
    }

    public List<CustomerRelation> getCustomerRelations() {
        return customerRelations;
    }

    public void setCustomerRelations(List<CustomerRelation> customerRelations) {
        this.customerRelations = customerRelations;
    }
}
