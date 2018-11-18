package bingo.vkcrm.service.task.v1.models;

import bingo.dao.orm.annotations.IsKey;
import bingo.dao.orm.annotations.Table;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by szsonic on 2015/10/28.
 */
public class TimeLine {
    private String taskId;
    private String telephonistId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date logTime;
    private String content;
    private int taskStage;
    private String taskNo;
    private String status;
    private String name;

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTelephonistId() {
        return telephonistId;
    }

    public void setTelephonistId(String telephonistId) {
        this.telephonistId = telephonistId;
    }



    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getLogTime() {
        return logTime;
    }

    public void setLogTime(Date logTime) {
        this.logTime = logTime;
    }


    public String getTaskNo() {
        return taskNo;
    }

    public void setTaskNo(String taskNo) {
        this.taskNo = taskNo;
    }

    public int getTaskStage() {
        return taskStage;
    }

    public void setTaskStage(int taskStage) {
        this.taskStage = taskStage;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
