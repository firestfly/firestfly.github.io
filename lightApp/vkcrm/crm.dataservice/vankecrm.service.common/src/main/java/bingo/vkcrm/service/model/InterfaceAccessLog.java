package bingo.vkcrm.service.model;

import java.util.Date;

/**
 * 接口访问日志
 */
@Deprecated
public class InterfaceAccessLog {private String id;
    private String remoteUrl;
    private Date startDate;
    private Date endDate;
    private String resultJson;
    private String paramterJson;
    private String actionName;
    private String exceptionMessage;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRemoteUrl() {
        return remoteUrl;
    }

    public void setRemoteUrl(String remoteUrl) {
        this.remoteUrl = remoteUrl;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getResultJson() {
        return resultJson;
    }

    public void setResultJson(String resultJson) {
        this.resultJson = resultJson;
    }

    public String getParamterJson() {
        return paramterJson;
    }

    public void setParamterJson(String paramterJson) {
        this.paramterJson = paramterJson;
    }

    public String getActionName() {
        return actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public String getExceptionMessage() {
        return exceptionMessage;
    }

    public void setExceptionMessage(String exceptionMessage) {
        this.exceptionMessage = exceptionMessage;
    }
}