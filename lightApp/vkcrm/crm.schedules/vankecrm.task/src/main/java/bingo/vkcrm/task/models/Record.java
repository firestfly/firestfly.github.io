package bingo.vkcrm.task.models;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;

import java.util.Date;

/**
 * Created by Wangzr on 15/11/11.
 */
@Table(name = "sync_call_tapes")
public class Record {

    @Column(name = "record_id")
    public String recordId;

    @Column(name = "call_id")
    public String callId;

    @Column(name = "filepath")
    public String filePath;

    @Column(name = "starttime")
    public Date startTime;

    @Column(name = "endtime")
    public Date endTime;

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getCallId() {
        return callId;
    }

    public void setCallId(String callId) {
        this.callId = callId;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
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
}
