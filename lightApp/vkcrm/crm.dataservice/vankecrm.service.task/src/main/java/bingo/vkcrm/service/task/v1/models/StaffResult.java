package bingo.vkcrm.service.task.v1.models;

import java.util.List;

/**
 * Created by szsonic on 2016/1/8/008.
 */
public class StaffResult {
    private  String total;
    private List<StaffInfo> staffs;

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public List<StaffInfo> getStaffs() {
        return staffs;
    }

    public void setStaffs(List<StaffInfo> staffs) {
        this.staffs = staffs;
    }
}
