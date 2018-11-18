package bingo.vkcrm.service.report.v1.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

/**
 * 呼入排行榜
 */
public class TelCallInRank {

    /**
     * 话务员ID
     */
    private String telephonistd;

    /**
     * 话务员名称
     */
    private String telephonist;

    /**
     * 外呼量
     */
    private Integer calloutCount;

    /**
     * 接通量
     */
    private Integer connectedCount;

    /**
     * 成功量
     */
    private Double succeededCount;

    /**
     * 未接通量
     */
    private Integer unConnectCount;

    /**
     * 时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date stateTime;

    public String getTelephonistd() {
        return telephonistd;
    }

    public void setTelephonistd(String telephonistd) {
        this.telephonistd = telephonistd;
    }

    public String getTelephonist() {
        return telephonist;
    }

    public void setTelephonist(String telephonist) {
        this.telephonist = telephonist;
    }

    public Integer getCalloutCount() {
        return calloutCount;
    }

    public void setCalloutCount(Integer calloutCount) {
        this.calloutCount = calloutCount;
    }

    public Integer getConnectedCount() {
        return connectedCount;
    }

    public void setConnectedCount(Integer connectedCount) {
        this.connectedCount = connectedCount;
    }

    public Double getSucceededCount() {
        return succeededCount;
    }

    public void setSucceededCount(Double succeededCount) {
        this.succeededCount = succeededCount;
    }

    public Integer getUnConnectCount() {
        return unConnectCount;
    }

    public void setUnConnectCount(Integer unConnectCount) {
        this.unConnectCount = unConnectCount;
    }

    public Date getStateTime() {
        return stateTime;
    }

    public void setStateTime(Date stateTime) {
        this.stateTime = stateTime;
    }
}
