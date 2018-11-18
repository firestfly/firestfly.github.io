package bingo.vkcrm.task.models.response;


import bingo.dao.orm.annotations.Table;

import java.util.Date;

@Table(name = "sync_result_gridhouses")
public class GridHouseData {
    private String grid_code;
    private String house_code;
    private String updated;
    private Date sync_time;

    public GridHouseData() {
        super();
    }

    public GridHouseData(String grid_code, String house_code, String updated) {
        super();
        this.grid_code = grid_code;
        this.house_code = house_code;
        this.updated = updated;
    }

    public String getGrid_code() {
        return grid_code;
    }

    public void setGrid_code(String grid_code) {
        this.grid_code = grid_code;
    }

    public String getHouse_code() {
        return house_code;
    }

    public void setHouse_code(String house_code) {
        this.house_code = house_code;
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
