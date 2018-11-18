package bingo.vkcrm.service.task.v1.models;

import bingo.dao.orm.annotations.Column;
import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by szsonic on 2015/12/31.
 */
public class ProjectNoticeLog {
    private String id;
    @Column(name = "notice_id")
    private String noticeId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date logtime;
    private String content;
    private String operatorId;
    private String operatorName;
    private String noticeDetail;
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNoticeId() {
        return noticeId;
    }

    public void setNoticeId(String noticeId) {
        this.noticeId = noticeId;
    }

    public Date getLogtime() {
        return logtime;
    }

    public void setLogtime(Date logtime) {
        this.logtime = logtime;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(String operatorId) {
        this.operatorId = operatorId;
    }

    public String getOperatorName() {
        return CacheUtil.get(CachePrefix.UserId,this.operatorId);
    }

    public String getNoticeDetail() {
        return noticeDetail;
    }

    public void setNoticeDetail(String noticeDetail) {
        this.noticeDetail = noticeDetail;
    }
}
