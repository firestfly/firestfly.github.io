package bingo.vkcrm.service.customer.v1.models;

import bingo.vkcrm.service.model.BaseModel;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by szsonic on 2015/11/16.
 */
public class CustomerInfo4Command  extends BaseModel {
    private String id;
    private String mainMobile;
    private String fullName;
    private String licenseNumber;
    private String relationType;
    private String relationTypeText;
    private String houseName;
    private String houseCode;
    private String projectCode;
    private String projectName;
    private String projectId;
    private String buildingName;
    private String buildingCode;
    private String certificateId;
    private Integer certificateType;
    private String certificateTypeText;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMainMobile() {
        return mainMobile;
    }

    public void setMainMobile(String mainMobile) {
        this.mainMobile = mainMobile;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public String getHouseCode() {
        return houseCode;
    }

    public void setHouseCode(String houseCode) {
        this.houseCode = houseCode;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public String getBuildingCode() {
        return buildingCode;
    }

    public void setBuildingCode(String buildingCode) {
        this.buildingCode = buildingCode;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }



    public String getCertificateTypeText() {
        return this.getValue("CustomerCertificateType", this.getCertificateType());
    }

    public String getRelationType() {
        return relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public String getRelationTypeText() {
        if(StringUtils.isNotEmpty(this.getRelationType())){
            String [] relationArr=this.getRelationType().split(",");
            List<String> relationList=new ArrayList<String>();
            for (String relation : relationArr) {
                relationList.add(this.getValue("HouseCustomerRelationType",relation));
            }
            return StringUtils.join(relationList.toArray(),";");
        }
        return null;
    }

    public void setRelationTypeText(String relationTypeText) {
        this.relationTypeText = relationTypeText;
    }

    public Integer getCertificateType() {
        return certificateType;
    }

    public void setCertificateType(Integer certificateType) {
        this.certificateType = certificateType;
    }
}
