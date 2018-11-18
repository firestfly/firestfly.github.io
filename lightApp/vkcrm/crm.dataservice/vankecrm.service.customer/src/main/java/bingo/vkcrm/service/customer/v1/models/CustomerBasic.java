package bingo.vkcrm.service.customer.v1.models;


import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.annotation.FieldInfo;
import bingo.vkcrm.service.model.BaseModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * 客户基本信息
 */
@Table(name = "main_customer")
public class CustomerBasic extends BaseModel implements Serializable {

    private static final long serialVersionUID = 522889572773714584L;

    /**
     * 客户id
     */
    private String id;
    /**
     * 客户编码
     */
    @FieldInfo(fieldChineseName = "客户编码")
    private String code;
    /**
     * 姓
     */
    @FieldInfo(fieldChineseName = "姓")
    private String firstName;
    /**
     * 名
     */
    @FieldInfo(fieldChineseName = "名")
    private String lastName;
    /**
     * 客户全称
     */
    @FieldInfo(fieldChineseName = "客户全称")
    private String fullName;
    /**
     * 性别
     */
    private Integer sex;
    /**
     * 性别文本
     */
    @FieldInfo(fieldChineseName = "性别")
    private String sexText;
    /**
     * 客户类型
     */
    private Integer customerType;
    /**
     * 客户类型名称
     */
    @FieldInfo(fieldChineseName = "客户类型")
    private String customerTypeText;
    /**
     * 主要手机号
     */
    @FieldInfo(fieldChineseName = "主要手机号")
    private String mainMobile;
    /**
     * 备用手机号
     */
    @FieldInfo(fieldChineseName = "备用手机号")
    private String standbyMobile;
    /**
     * 家庭电话
     */
    @FieldInfo(fieldChineseName = "家庭电话")
    private String homeTel;
    /**
     * 办公电话
     */
    @FieldInfo(fieldChineseName = "办公电话")
    private String officeTel;
    /**
     * 联系地址
     */
    @FieldInfo(fieldChineseName = "联系地址")
    private String contactAddr;
    /**
     * 客户归属
     */
    private Integer affiliation;
    /**
     * 客户归属文本
     */
    @FieldInfo(fieldChineseName = "客户归属")
    private String affiliationText;
    /**
     * 证件类型
     */
    private Integer certificateType;
    /**
     * 证件类型文本
     */
    @FieldInfo(fieldChineseName = "证件类型")
    private String certificateTypeText;
    /**
     * 证件号码
     */
    @FieldInfo(fieldChineseName = "证件号码")
    private String certificateId;

    /**
     * 创建人
     */
    private String creator;
    /**
     * 创建人ID
     */
    private String creatorId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    /**
     * 修改人
     */
    private String modifier;
    /**
     * 修改人ID
     */
    private String modifierId;
    /**
     * 修改时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date modifyTime;


    /**
     * 客户id
     */
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    /**
     * 客户编码
     */
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    /**
     * 客户全称
     */
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * 名
     */
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * 姓
     */
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /**
     * 性别
     */
    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    /**
     * 性别文本
     */
    public String getSexText() {
        return this.getValue("CustomerSex", this.sex);
    }

    /**
     * 客户类型
     */
    public Integer getCustomerType() {
        return customerType;
    }

    public void setCustomerType(Integer customerType) {
        this.customerType = customerType;
    }

    /**
     * 客户类型名称
     */
    public String getCustomerTypeText() {
        return getValue("CustomerType", this.customerType);
    }

    /**
     * 主要手机号
     */
    public String getMainMobile() {
        return mainMobile;
    }

    public void setMainMobile(String mainMobile) {
        this.mainMobile = mainMobile;
    }

    /**
     * 备用手机号
     */
    public String getStandbyMobile() {
        return standbyMobile;
    }

    public void setStandbyMobile(String standbyMobile) {
        this.standbyMobile = standbyMobile;
    }

    /**
     * 家庭电话
     */
    public String getHomeTel() {
        return homeTel;
    }

    public void setHomeTel(String homeTel) {
        this.homeTel = homeTel;
    }

    /**
     * 办公电话
     */
    public String getOfficeTel() {
        return officeTel;
    }

    public void setOfficeTel(String officeTel) {
        this.officeTel = officeTel;
    }

    /**
     * 联系地址
     */
    public String getContactAddr() {
        return contactAddr;
    }

    public void setContactAddr(String contactAddr) {
        this.contactAddr = contactAddr;
    }

    /**
     * 客户归属
     */
    public Integer getAffiliation() {
        return affiliation;
    }

    public void setAffiliation(Integer affiliation) {
        this.affiliation = affiliation;
    }

    /**
     * 客户归属文本
     */
    public String getAffiliationText() {
        return this.getValue("CustomerAffilication", this.affiliation);
    }

    /**
     * 证件类型
     */
    public Integer getCertificateType() {
        return certificateType;
    }

    public void setCertificateType(Integer certificateType) {
        this.certificateType = certificateType;
    }

    /**
     * 证件类型文本
     */
    public String getCertificateTypeText() {
        return this.getValue("CustomerCertificateType", this.certificateType);
    }

    /**
     * 证件号码
     */
    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    /**
     * 创建人
     */
    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    /**
     * 创建人ID
     */
    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * 修改人
     */
    public String getModifier() {
        return modifier;
    }

    public void setModifier(String modifier) {
        this.modifier = modifier;
    }

    /**
     * 修改人ID
     */
    public String getModifierId() {
        return modifierId;
    }

    public void setModifierId(String modifierId) {
        this.modifierId = modifierId;
    }

    /**
     * 修改时间
     */
    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

}
