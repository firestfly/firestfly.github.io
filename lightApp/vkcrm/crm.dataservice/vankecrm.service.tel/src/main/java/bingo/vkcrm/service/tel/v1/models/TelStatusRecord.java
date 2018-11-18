package bingo.vkcrm.service.tel.v1.models;

import bingo.dao.orm.annotations.Table;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by DomYY on 15/9/1.
 */
@Table(name = "biz_tele_status_records")
/**
 * 通话记录
 */
public class TelStatusRecord implements Serializable{
    /**
     * 物理主键id，自增
     */
    private String pid;
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
    /**
     * 持续时长，单位（秒）
     */
    private int timeSpan;

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
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

    public int getTimeSpan() {
        return timeSpan;
    }

    public void setTimeSpan(int timeSpan) {
        this.timeSpan = timeSpan;
    }
}
