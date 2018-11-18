package bingo.vkcrm.service.house.v1.models.bmap;

/**
 * Created by szsonic on 2016/3/18/018.
 */
public class BmapRequestHead {
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
