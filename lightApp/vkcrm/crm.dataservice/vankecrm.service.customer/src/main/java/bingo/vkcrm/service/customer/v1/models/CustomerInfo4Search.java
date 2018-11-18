package bingo.vkcrm.service.customer.v1.models;

import bingo.vkcrm.service.model.BaseModel;

/**
 * Created by szsonic on 2015/9/24.
 */
public class CustomerInfo4Search extends BaseModel {

    private String id;
    private String fullName;
    private String certificateId;
    private String mainMobile;
    private String relationType;
    private String relationTypeText;
    private String houseId;
    private String certificateType;
    private String certificateTypeText;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public String getMainMobile() {
        return mainMobile;
    }

    public void setMainMobile(String mainMobile) {
        this.mainMobile = mainMobile;
    }

    public String getRelationType() {
        return relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public String getRelationTypeText() {
        return this.getValue("HouseCustomerRelationType", this.relationType);
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getCertificateTypeText() {
        return this.getValue("CustomerCertificateType", this.certificateType);
    }

    public String getCertificateType() {
        return certificateType;
    }

    public void setCertificateType(String certificateType) {
        this.certificateType = certificateType;
    }
}
