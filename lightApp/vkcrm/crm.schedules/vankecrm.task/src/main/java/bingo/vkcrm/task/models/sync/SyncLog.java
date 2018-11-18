package bingo.vkcrm.task.models.sync;

import java.util.Date;

/**
 * Created by szsonic on 2016/2/25/025.
 */
public class SyncLog {
    private String id;
    private String syncCode;
    private String buildingCode;
    private String projectCode;
    private Integer editCount;
    private Integer newCount;
    private Integer curPage;
    private String msg;
    private Date requestTime;
    private Date syncTime;
    private Boolean isSuccessed;

    public String getSyncCode() {
        return syncCode;
    }

    public void setSyncCode(String syncCode) {
        this.syncCode = syncCode;
    }

    public String getBuildingCode() {
        return buildingCode;
    }

    public void setBuildingCode(String buildingCode) {
        this.buildingCode = buildingCode;
    }

    public Integer getEditCount() {
        return editCount;
    }

    public void setEditCount(Integer editCount) {
        this.editCount = editCount;
    }

    public Integer getNewCount() {
        return newCount;
    }

    public void setNewCount(Integer newCount) {
        this.newCount = newCount;
    }

    public Integer getCurPage() {
        return curPage;
    }

    public void setCurPage(Integer curPage) {
        this.curPage = curPage;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Date getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(Date requestTime) {
        this.requestTime = requestTime;
    }

    public Date getSyncTime() {
        return syncTime;
    }

    public void setSyncTime(Date syncTime) {
        this.syncTime = syncTime;
    }

    public Boolean getSuccessed() {
        return isSuccessed;
    }

    public void setSuccessed(Boolean successed) {
        isSuccessed = successed;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
