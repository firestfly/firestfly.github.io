package com.vankeservice.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vankeservice.common.model.BaseModel;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * 施工凭证
 */
public class ConstructionCertificate extends BaseModel {

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
     * 装修单位
     */
    private String decorationUnit;

    /**
     * 房屋名称
     */
    private String houseName;

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
     * 装修施工内容
     */
    private String decorationContent;

    /**
     * 是否已经打印
     */
    private Integer isPrint;

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

    public String getDecorationUnit() {
        return decorationUnit;
    }

    public void setDecorationUnit(String decorationUnit) {
        this.decorationUnit = decorationUnit;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
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
}
