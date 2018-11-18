package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.dao.orm.annotations.Table;

import java.util.Date;

/**
 * Created by 林 on 2016/4/19.
 */
@Table(name = "mid_tel_callreason")
public class CallReasonRelation {

    private String id;

    private String callId;

    private String callRecordId;

    private String reasonId;

    private String creatorId;

    private Date createTime;

    private Boolean isDeleted;

    private String deletorId;

    private Date deleteTime;

    public String getId() {return id;}

    public void setId(String id) {this.id = id; }

    public String getCallId() { return callId; }

    public void setCallId(String callId) {this.callId = callId;}

    public String getCallRecordId() {return callRecordId;}

    public void setCallRecordId(String callRecordId) {this.callRecordId = callRecordId; }

    public String getReasonId() {return reasonId;}

    public void setReasonId(String reasonId) {this.reasonId = reasonId;}

    public String getCreatorId() {return creatorId; }

    public void setCreatorId(String creatorId) {this.creatorId = creatorId;}

    public Date getCreateTime() { return createTime;}

    public void setCreateTime(Date createTime) { this.createTime = createTime;}

    public Boolean getDeleted() { return isDeleted; }

    public void setDeleted(Boolean deleted) { isDeleted = deleted; }

    public String getDeletorId() { return deletorId;}

    public void setDeletorId(String deletorId) { this.deletorId = deletorId;}

    public Date getDeleteTime() {return deleteTime;}

    public void setDeleteTime(Date deleteTime) {this.deleteTime = deleteTime;}




}

