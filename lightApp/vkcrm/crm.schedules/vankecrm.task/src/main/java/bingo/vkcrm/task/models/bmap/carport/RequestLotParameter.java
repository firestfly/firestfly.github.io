package bingo.vkcrm.task.models.bmap.carport;

/**
 * Created by szsonic on 2015/11/22.
 */
public class RequestLotParameter {
    private String page;
    private String pagesize;
    private String projcode;
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

    public String getProjcode() {
        return projcode;
    }

    public void setProjcode(String projcode) {
        this.projcode = projcode;
    }
}
