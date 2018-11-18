package bingo.vkcrm.task.models.bmap.carport;

/**
 * Created by szsonic on 2015/11/24.
 */
public class RequestCarportParameter {
    private String page;
    private String pagesize;
    private String lotcode;
    private String source;
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

    public String getLotcode() {
        return lotcode;
    }

    public void setLotcode(String lotcode) {
        this.lotcode = lotcode;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSynctime() {
        return synctime;
    }

    public void setSynctime(String synctime) {
        this.synctime = synctime;
    }
}
