package bingo.vkcrm.service.customer.v1.models;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import bingo.vkcrm.service.model.BaseModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.Map;

/**
 * Created by szsonic on 2015/11/18.
 */
public class CustomerBasic4Approve extends BaseModel {
	private String pendingId;
    private String customerId;
    private String houseId;
    private String houseName;
    private String projectId;
    private String projectName;
    private String relationType;
    private String certificateId;
    private String certificateType;
    private String certificateTypeText;
    private String mainMobile;
    private String standbyMobile;
    private String homeTel;
    private String officeTel;
    private String from;
    private Integer fromCode;
    private String operator;
    private Integer operatorCode;
    private String sex;
    private String sexText;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String crmCustomerId;
    private String fullName;
    private String tags;
    private String identities;
    
    

	public String getPendingId() {
		return pendingId;
	}

	public void setPendingId(String pendingId) {
		this.pendingId = pendingId;
	}

	public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public String getRelationType() {
        return relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public String getCertificateType() {
        return certificateType;
    }

    public void setCertificateType(String certificateType) {
        this.certificateType = certificateType;
    }

    public String getFrom() {
        return this.getValue("from", this.fromCode);
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getOperator() {
        return this.getValue("operator", this.operatorCode);
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getCrmCustomerId() {
        return crmCustomerId;
    }

    public void setCrmCustomerId(String crmCustomerId) {
        this.crmCustomerId = crmCustomerId;
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

    public String getCertificateTypeText() {
        return this.getValue("CustomerCertificateType", this.certificateType);
    }


    public String getSexText() {
        return this.getValue("CustomerSex", this.sex);
    }

    public Integer getFromCode() {
        return fromCode;
    }

    public void setFromCode(Integer fromCode) {
        this.fromCode = fromCode;
    }

    public Integer getOperatorCode() {
        return operatorCode;
    }

    public void setOperatorCode(Integer operatorCode) {
        this.operatorCode = operatorCode;
    }

    public String getProjectName() {
        Map<String,String> map=CacheUtil.get(Map.class,CachePrefix.PrjId, this.getProjectId());
        return map==null?null:map.get("name");
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getIdentities() {
        return identities;
    }

    public void setIdentities(String identities) {
        this.identities = identities;
    }
}
