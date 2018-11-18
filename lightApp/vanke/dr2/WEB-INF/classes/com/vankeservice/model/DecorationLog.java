package com.vankeservice.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vankeservice.common.model.BaseModel;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

public class DecorationLog extends BaseModel{

    /**
     * 单号
     */
    private String serialNumber;

    /**
     * 表单名称
     */
    private String form;

    /**
     * 类型
     */
    private String mode;

    /**
     * 操作人
     */
    private String processBy;

    /**
     * 操作时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date processAt;

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getForm() {
        return form;
    }

    public void setForm(String form) {
        this.form = form;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getProcessBy() {
        return processBy;
    }

    public void setProcessBy(String processBy) {
        this.processBy = processBy;
    }

    public Date getProcessAt() {
        return processAt;
    }

    public void setProcessAt(Date processAt) {
        this.processAt = processAt;
    }
}
