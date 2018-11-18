package bingo.vkcrm.task.models.bmap.common;

import bingo.common.core.ApplicationContext;

/**
 * Created by szsonic on 2015/11/13.
 */
public class RequestCommonHead {
    private String sysid;
    private String password;
    private String timestamp;
    private String functionid;

    public String getSysid() {
        return sysid;
    }

    public void setSysid(String sysid) {
        this.sysid = sysid;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getFunctionid() {
        return functionid;
    }

    public void setFunctionid(String functionid) {
        this.functionid = functionid;
    }
}
