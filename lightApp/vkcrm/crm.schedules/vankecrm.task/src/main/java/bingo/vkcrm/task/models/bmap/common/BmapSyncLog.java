package bingo.vkcrm.task.models.bmap.common;

import bingo.dao.orm.annotations.Table;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by szsonic on 2015/11/15.
 */
@Table(name = "log_bmap_syn")
public class BmapSyncLog {
    private String serviceCode;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date synTime;
    private String message;
    private Integer userTimeRequest;
    private Integer userTimeProgram;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date dataBeginTime;
    private Integer page;
    private Integer count;
    private Integer newCount;
    private Integer editCount;



    public Date getSynTime() {
        return synTime;
    }

    public void setSynTime(Date synTime) {
        this.synTime = synTime;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getUserTimeRequest() {
        return userTimeRequest;
    }

    public void setUserTimeRequest(Integer userTimeRequest) {
        this.userTimeRequest = userTimeRequest;
    }

    public Integer getUserTimeProgram() {
        return userTimeProgram;
    }

    public void setUserTimeProgram(Integer userTimeProgram) {
        this.userTimeProgram = userTimeProgram;
    }

    public Date getDataBeginTime() {
        return dataBeginTime;
    }

    public void setDataBeginTime(Date dataBeginTime) {
        this.dataBeginTime = dataBeginTime;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Integer getNewCount() {
        return newCount;
    }

    public void setNewCount(Integer newCount) {
        this.newCount = newCount;
    }

    public Integer getEditCount() {
        return editCount;
    }

    public void setEditCount(Integer editCount) {
        this.editCount = editCount;
    }

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }
}
