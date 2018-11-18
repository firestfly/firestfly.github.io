package bingo.vkcrm.service.customer.v1.models;

import java.util.List;

/**
 * Created by szsonic on 2015/11/25.
 */
public class CustomerInfo4Update {
    private String customerId;
    private String crmCustomerId;
    private String name;
    private String mainMobile;
    private String standbyMobile;
    private String homeTel;
    private String officeTel;
    private Integer sex;
    @Deprecated
    private String houseId;
    private String buildingId;
    private String buildingType;
    private List<Integer> hobbyIds;
    private List<Integer> houseRelations;
    private Integer cardType;
    private String cardNo;

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

    public String getMainMobile() {
        return mainMobile;
    }

    public void setMainMobile(String mainMobile) {
        this.mainMobile = mainMobile;
    }



    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(String buildingId) {
        this.buildingId = buildingId;
    }

    public String getBuildingType() {
        return buildingType;
    }

    public void setBuildingType(String buildingType) {
        this.buildingType = buildingType;
    }

    public String getCardNo() {
        return cardNo;
    }

    public void setCardNo(String cardNo) {
        this.cardNo = cardNo;
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }



    public List<Integer> getHobbyIds() {
        return hobbyIds;
    }

    public void setHobbyIds(List<Integer> hobbyIds) {
        this.hobbyIds = hobbyIds;
    }

    public Integer getCardType() {
        return cardType;
    }

    public void setCardType(Integer cardType) {
        this.cardType = cardType;
    }

    public List<Integer> getHouseRelations() {
        return houseRelations;
    }

    public void setHouseRelations(List<Integer> houseRelations) {
        this.houseRelations = houseRelations;
    }

    public String getCrmCustomerId() {
        return crmCustomerId;
    }

    public void setCrmCustomerId(String crmCustomerId) {
        this.crmCustomerId = crmCustomerId;
    }

    public String getStandbyMobile() {
        return standbyMobile;
    }

    public void setStandbyMobile(String standbyMobile) {
        this.standbyMobile = standbyMobile;
    }

    public String getHomeTel() {
        return homeTel;
    }

    public void setHomeTel(String homeTel) {
        this.homeTel = homeTel;
    }

    public String getOfficeTel() {
        return officeTel;
    }

    public void setOfficeTel(String officeTel) {
        this.officeTel = officeTel;
    }
}
