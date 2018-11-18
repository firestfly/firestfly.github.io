package bingo.vkcrm.task.models.bmap.project;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by szsonic on 2015/11/13.
 */
public class RequestParameter {
    private String page;
    private String pagesize;
    private String synctime;
    private String projectcode;




    public String getSynctime() {
        return synctime;
    }

    public void setSynctime(String synctime) {
        this.synctime = synctime;
    }

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
}
