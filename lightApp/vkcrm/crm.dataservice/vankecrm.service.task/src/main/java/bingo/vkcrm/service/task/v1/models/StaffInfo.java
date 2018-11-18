package bingo.vkcrm.service.task.v1.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by szsonic on 2015/12/14.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class StaffInfo {

    private String mobile;
    private String fullname;
    private String staff_id;
    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getStaff_id() {
        return staff_id;
    }

    public void setStaff_id(String staff_id) {
        this.staff_id = staff_id;
    }
}
