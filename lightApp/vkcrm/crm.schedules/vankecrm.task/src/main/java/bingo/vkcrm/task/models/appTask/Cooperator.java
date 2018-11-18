package bingo.vkcrm.task.models.appTask;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by szsonic on 2016/1/18/018.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Cooperator {
    private String id;
    private String mobile;
    private String task_no;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }


    public String getTask_no() {
        return task_no;
    }

    public void setTask_no(String task_no) {
        this.task_no = task_no;
    }
}
