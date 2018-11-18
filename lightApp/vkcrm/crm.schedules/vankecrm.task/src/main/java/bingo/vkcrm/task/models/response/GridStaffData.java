package bingo.vkcrm.task.models.response;

import bingo.dao.orm.annotations.Table;

import java.util.Date;

@Table(name = "sync_result_gridstaff")
public class GridStaffData {

    private String grid_code;
    private String staff_id;
    private String staff_name;
    private String mobile;
    private Date sync_time;

    public GridStaffData() {
        super();
    }

    public GridStaffData(String grid_code, String staff_id, String staff_name, String mobile) {
        super();
        this.grid_code = grid_code;
        this.staff_id = staff_id;
        this.staff_name = staff_name;
        this.mobile = mobile;
    }

    public String getGrid_code() {
        return grid_code;
    }

    public void setGrid_code(String grid_code) {
        this.grid_code = grid_code;
    }

    public String getStaff_id() {
        return staff_id;
    }

    public void setStaff_id(String staff_id) {
        this.staff_id = staff_id;
    }

    public String getStaff_name() {
        return staff_name;
    }

    public void setStaff_name(String staff_name) {
        this.staff_name = staff_name;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Date getSync_time() {
        return new Date();
    }
}
