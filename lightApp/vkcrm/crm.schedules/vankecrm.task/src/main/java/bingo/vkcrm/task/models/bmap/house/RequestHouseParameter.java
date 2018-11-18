package bingo.vkcrm.task.models.bmap.house;

import java.util.Date;

/**
 * Created by szsonic on 2015/11/23.
 */
public class RequestHouseParameter {
    private String page;
    private String pagesize;
    private String propcode;
    private String source;
    private String buildcode;
    private String synctime;


    public String getPage() {
        return page;
    }

    public void setPage(String page) {
        this.page = page;
    }

    public String getPagesize() {
        return pagesize;
    }

    public void setPagesize(String pagesize) {
        this.pagesize = pagesize;
    }


    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getPropcode() {
        return propcode;
    }

    public void setPropcode(String propcode) {
        this.propcode = propcode;
    }

    public String getBuildcode() {
        return buildcode;
    }

    public void setBuildcode(String buildcode) {
        this.buildcode = buildcode;
    }


    public String getSynctime() {
        return synctime;
    }

    public void setSynctime(String synctime) {
        this.synctime = synctime;
    }
}
