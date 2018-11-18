package bingo.vkcrm.service.tel.v1.models;

import bingo.dao.orm.annotations.Table;

import java.util.Date;

/**
 * 话后满意度调查
 */
@Table(name = "tel_ivr")
public class IVR {
    /**
     * 录音ID
     */
    private String callId;
    /**
     * 客户号码
     */
    private String otherDN;
    /**
     * 方法名称
     */
    private String methodName;
    /**
     * 满意度级别
     */
    private String ivrLevel;
    /**
     * 满意度时间
     */
    private Date ivrDate;

    public String getCallId() {
        return callId;
    }

    public void setCallId(String callId) {
        this.callId = callId;
    }

    public String getOtherDN() {
        return otherDN;
    }

    public void setOtherDN(String otherDN) {
        this.otherDN = otherDN;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public String getIvrLevel() {
        return ivrLevel;
    }

    public void setIvrLevel(String ivrLevel) {
        this.ivrLevel = ivrLevel;
    }

    public Date getIvrDate() {
        return ivrDate;
    }

    public void setIvrDate(Date ivrDate) {
        this.ivrDate = ivrDate;
    }
}
