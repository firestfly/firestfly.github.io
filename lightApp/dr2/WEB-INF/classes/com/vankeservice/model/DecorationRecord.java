package com.vankeservice.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.vankeservice.common.model.BaseModel;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * 装修备案
 */
public class DecorationRecord extends BaseModel {

    /**
     * 版本号
     */
    private String version;

    /**
     * 序号
     */
    private String serialNumber;

    /**
     * 生效日期
     */
    private Date effectDate;

    /**
     * 客户姓名
     */
    private String customerName;

    /**
     * 房屋名称
     */
    private String houseName;

    /**
     * 签名日期
     */
    private String autographDate;

    /**
     * 联系电话
     */
    private String mobilePhone;

    /**
     * 装修负责人
     */
    private String decorationName;

    /**
     * 装修单位
     */
    private String decorationUnit;

    /**
     * 装修单位联系电话
     */
    private String decorationPhone;

    /**
     * 装修施工开始日期
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date beginDate;

    /**
     * 装修施工结束日期
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endDate;

    /**
     * 施工延迟记录
     */
    private String delayRecord;

    /**
     * 物业服务中心
     */
    private String serviceCenter;

    /**
     * 装修施工单位
     */
    private String constructionUnit;

    /**
     * 装修施工内容
     */
    private String decorationContent;

    /**
     * 是否已经打印
     */
    private Integer isPrint;

    /**
     * 介绍人
     */
    private String referrals;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public Date getEffectDate() {
        return effectDate;
    }

    public void setEffectDate(Date effectDate) {
        this.effectDate = effectDate;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public String getAutographDate() {
        return autographDate;
    }

    public void setAutographDate(String autographDate) {
        this.autographDate = autographDate;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public String getDecorationName() {
        return decorationName;
    }

    public void setDecorationName(String decorationName) {
        this.decorationName = decorationName;
    }

    public String getDecorationUnit() {
        return decorationUnit;
    }

    public void setDecorationUnit(String decorationUnit) {
        this.decorationUnit = decorationUnit;
    }

    public String getDecorationPhone() {
        return decorationPhone;
    }

    public void setDecorationPhone(String decorationPhone) {
        this.decorationPhone = decorationPhone;
    }

    public Date getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(Date beginDate) {
        this.beginDate = beginDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getDelayRecord() {
        return delayRecord;
    }

    public void setDelayRecord(String delayRecord) {
        this.delayRecord = delayRecord;
    }

    public String getServiceCenter() {
        return serviceCenter;
    }

    public void setServiceCenter(String serviceCenter) {
        this.serviceCenter = serviceCenter;
    }

    public String getConstructionUnit() {
        return constructionUnit;
    }

    public void setConstructionUnit(String constructionUnit) {
        this.constructionUnit = constructionUnit;
    }

    public String getDecorationContent() {
        return decorationContent;
    }

    public void setDecorationContent(String decorationContent) {
        this.decorationContent = decorationContent;
    }

    public Integer getIsPrint() {
        return isPrint;
    }

    public void setIsPrint(Integer isPrint) {
        this.isPrint = isPrint;
    }

    public String getReferrals() {
        return referrals;
    }

    public void setReferrals(String referrals) {
        this.referrals = referrals;
    }
}
