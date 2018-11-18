package bingo.vkcrm.service.tel.v1.models;

import java.util.Date;

/**
 * 通话录音
 * Created by Wangzr on 15/11/12.
 */
public class RecordTape {

    /**
     * 通话id
     */
    public String callId;
    /**
     * 录音id
     */
    public String recordId;
    /**
     * 开始时间
     */
    public Date startTime;
    /**
     * 结束时间
     */
    public Date endTime;
    /**
     * 文件路径
     */
    public String filePath;

    public String getCallId() {
        return callId;
    }

    public void setCallId(String callId) {
        this.callId = callId;
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
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

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
