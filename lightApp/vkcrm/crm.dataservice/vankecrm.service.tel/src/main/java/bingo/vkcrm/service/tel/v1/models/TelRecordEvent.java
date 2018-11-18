package bingo.vkcrm.service.tel.v1.models;

import java.util.Date;

/**
 * Created by DomYY on 15/9/1.
 */
public class TelRecordEvent {
    /**
     * UUID
     */
    private  String uuid;
    /**
     * 话务员编号
     */
    private String telephonistId;
    /**
     * 话务员名称
     */
    private String telephonistName;
    /**
     * 坐席id
     */
    private String seatId;
    /**
     * 话务状态
     */
    private String status;
    /**
     * 开始时间
     */
    private Date startTime;
    /**
     * 结束时间
     */
    private Date endTime;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getTelephonistId() {
        return telephonistId;
    }

    public void setTelephonistId(String telephonistId) {
        this.telephonistId = telephonistId;
    }

    public String getTelephonistName() {
        return telephonistName;
    }

    public void setTelephonistName(String telephonistName) {
        this.telephonistName = telephonistName;
    }

    public String getSeatId() {
        return seatId;
    }

    public void setSeatId(String seatId) {
        this.seatId = seatId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public TelRecordEvent(String uuid, String telephonistId, String telephonistName, String seatId, String status, Date startTime, Date endTime) {
        this.uuid = uuid;
        this.telephonistId = telephonistId;
        this.telephonistName = telephonistName;
        this.seatId = seatId;
        this.status = status;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
