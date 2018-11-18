package bingo.vkcrm.task.models.sync;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by szsonic on 2016/2/24/024.
 */
public class SyncConfig {
    private String syncCode;
    private Integer syncEnv;
    private Integer pageSize;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date requestTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date nextSyncTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date lastRequestTime;
    private Integer syncCycle;
    private Integer requestCycle;
    public String getSyncCode() {
        return syncCode;
    }

    public void setSyncCode(String syncCode) {
        this.syncCode = syncCode;
    }




    public Date getNextSyncTime() {
        return nextSyncTime;
    }

    public void setNextSyncTime(Date nextSyncTime) {
        this.nextSyncTime = nextSyncTime;
    }


    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getSyncEnv() {
        return syncEnv;
    }

    public void setSyncEnv(Integer syncEnv) {
        this.syncEnv = syncEnv;
    }




    public Date getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(Date requestTime) {
        this.requestTime = requestTime;
    }

    public Date getLastRequestTime() {
        return lastRequestTime;
    }

    public void setLastRequestTime(Date lastRequestTime) {
        this.lastRequestTime = lastRequestTime;
    }

    public Integer getSyncCycle() {
        return syncCycle;
    }

    public void setSyncCycle(Integer syncCycle) {
        this.syncCycle = syncCycle;
    }

    public Integer getRequestCycle() {
        return requestCycle;
    }

    public void setRequestCycle(Integer requestCycle) {
        this.requestCycle = requestCycle;
    }
}
