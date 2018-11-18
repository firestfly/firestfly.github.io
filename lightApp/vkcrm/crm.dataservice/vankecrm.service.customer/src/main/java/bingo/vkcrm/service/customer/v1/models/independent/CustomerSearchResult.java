package bingo.vkcrm.service.customer.v1.models.independent;

import bingo.vkcrm.service.model.BaseModel;
import org.apache.commons.lang3.StringUtils;

/**
 * Created by Wangzr on 15/9/19.
 */
public class CustomerSearchResult extends BaseModel {
    /**
     * 客户id
     */
    String customerId;
    /**
     * 客户姓名
     */
    String customerName;
    /**
     * 联系电话
     */
    String mainMobile;
    /**
     * 证件类型
     */
    String certificateType;
    /**
     * 证件类型文本
     */
    String certificateTypeText;
    /**
     * 证件号码
     */
    String certificateId;
    /**
     * 房号
     */
    String houseName;
    /**
     * 房屋编码
     */
    String houseId;
    /**
     * 类型
     */
    String type;
    /**
     * 与房屋的关系
     */
    String relationType;
    /**
     * 与房屋的关系文本
     */
    String relationTypeText;
    /**
     * 车牌号
     */
    String licenseNumber;

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getMainMobile() {
        return mainMobile;
    }

    public void setMainMobile(String mainMobile) {
        this.mainMobile = mainMobile;
    }

    public String getCertificateType() {
        return certificateType;
    }

    public void setCertificateType(String certificateType) {
        this.certificateType = certificateType;
    }

    public String getCertificateTypeText() {
        return this.getValue("CustomerCertificateType", this.certificateType);
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRelationType() {
        return relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public String getRelationTypeText() {
        if (StringUtils.isNotEmpty(this.relationType)) {
            String[] relationTypes = this.relationType.split(",");
            StringBuffer stringBuffer = new StringBuffer();
            for (String tempRelationType : relationTypes) {
                if(StringUtils.isNotEmpty(stringBuffer.toString())){
                    stringBuffer.append(",");
                }
                stringBuffer.append(this.getValue("HouseCustomerRelationType", tempRelationType));
            }
            return stringBuffer.toString();
        }
        return this.getValue("HouseCustomerRelationType", this.relationType);
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }


}
