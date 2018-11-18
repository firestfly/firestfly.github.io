package bingo.vkcrm.task.models.response;


import bingo.dao.orm.annotations.Table;

import java.util.Date;

@Table(name = "sync_result_grids")
public class GridData {
    private String code;
    private String name;
    private String project_code;
    private String updated;
    private Date sync_time;

    public GridData() {
        super();
    }

    public GridData(String code, String name, String project_code, String updated) {
        super();
        this.code = code;
        this.name = name;
        this.project_code = project_code;
        this.updated = updated;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProject_code() {
        return project_code;
    }

    public void setProject_code(String project_code) {
        this.project_code = project_code;
    }

    public String getUpdated() {
        return updated;
    }

    public void setUpdated(String updated) {
        this.updated = updated;
    }

    public Date getSync_time() {
        return new Date();
    }

    public void setSync_time(Date sync_time) {
        this.sync_time = sync_time;
    }
}
