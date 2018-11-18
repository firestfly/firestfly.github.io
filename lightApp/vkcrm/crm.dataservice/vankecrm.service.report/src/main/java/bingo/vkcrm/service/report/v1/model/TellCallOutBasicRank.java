package bingo.vkcrm.service.report.v1.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

/**
 * 呼出排行榜(呼叫中心)
 */
public class TellCallOutBasicRank {
    /**
     * 话务员ID
     */
    private String telephonistId;

    /**
     * 话务员名称
     */
    private String telephonist;

    /**
     * 外呼量
     */
    private Integer callOutCount;

    /**
     * 接通量
     */
    private Integer connectedCount;

    /**
     * 成功量
     */
    private Integer succeededCount;

    /**
     * 未接通量
     */
    private Integer unConnectCount;

    /**
     * 时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date stateTime;

    public String getTelephonistId() {
        return telephonistId;
    }

    public void setTelephonistId(String telephonistId) {
        this.telephonistId = telephonistId;
    }

    public String getTelephonist() {
        return telephonist;
    }

    public void setTelephonist(String telephonist) {
        this.telephonist = telephonist;
    }

    public Integer getCallOutCount() {
        return callOutCount;
    }

    public void setCallOutCount(Integer callOutCount) {
        this.callOutCount = callOutCount;
    }

    public Integer getConnectedCount() {
        return connectedCount;
    }

    public void setConnectedCount(Integer connectedCount) {
        this.connectedCount = connectedCount;
    }

    public Integer getSucceededCount() {
        return succeededCount;
    }

    public void setSucceededCount(Integer succeededCount) {
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
