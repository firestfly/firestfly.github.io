package bingo.vkcrm.task.models.bmap.building;

/**
 * Created by szsonic on 2015/11/22.
 */
public class RequestBuildingParameter {
    private String page;
    private String pagesize;
    private String projectcode;
    private String source;
    private String buildingcode;
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

    public String getProjectcode() {
        return projectcode;
    }

    public void setProjectcode(String projectcode) {
        this.projectcode = projectcode;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getBuildingcode() {
        return buildingcode;
    }

    public void setBuildingcode(String buildingcode) {
        this.buildingcode = buildingcode;
    }

    public String getSynctime() {
        return synctime;
    }

    public void setSynctime(String synctime) {
        this.synctime = synctime;
    }
}
