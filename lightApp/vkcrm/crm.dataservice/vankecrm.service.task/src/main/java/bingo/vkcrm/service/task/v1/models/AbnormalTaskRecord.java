package bingo.vkcrm.service.task.v1.models;

import bingo.dao.orm.annotations.Table;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by szsonic on 2015/10/29.
 */
@Table(name = "task_abnormal_records")
public class AbnormalTaskRecord {
    private String id;
    private String taskNo;
    private Integer abnormal_type;
    private String task_status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date ctime;
    private Integer followup;
    private String followup_uid;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date followup_time;
    private Integer completed;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date completed_time;
    private String followupName;

    public String getTaskNo() {
        return taskNo;
    }

    public void setTaskNo(String taskNo) {
        this.taskNo = taskNo;
    }


    public String getTask_status() {
        return task_status;
    }

    public void setTask_status(String task_status) {
        this.task_status = task_status;
    }

    public Date getCtime() {
        return ctime;
    }

    public void setCtime(Date ctime) {
        this.ctime = ctime;
    }


    public String getFollowup_uid() {
        return followup_uid;
    }

    public void setFollowup_uid(String followup_uid) {
        this.followup_uid = followup_uid;
    }



    public Date getCompleted_time() {
        return completed_time;
    }

    public void setCompleted_time(Date completed_time) {
        this.completed_time = completed_time;
    }

    public Integer getAbnormal_type() {
        return abnormal_type;
    }

    public void setAbnormal_type(Integer abnormal_type) {
        this.abnormal_type = abnormal_type;
    }

    public Integer getFollowup() {
        return followup;
    }

    public void setFollowup(Integer followup) {
        this.followup = followup;
    }

    public Integer getCompleted() {
        return completed;
    }

    public void setCompleted(Integer completed) {
        this.completed = completed;
    }

    public Date getFollowup_time() {
        return followup_time;
    }

    public void setFollowup_time(Date followup_time) {
        this.followup_time = followup_time;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFollowupName() {
        return followupName;
    }

    public void setFollowupName(String followupName) {
        this.followupName = followupName;
    }
}
