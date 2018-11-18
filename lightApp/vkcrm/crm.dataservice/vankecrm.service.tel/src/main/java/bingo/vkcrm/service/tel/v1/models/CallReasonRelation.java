package bingo.vkcrm.service.tel.v1.models;

import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;

import java.util.Date;

/**
 * 通话记录原因关系表实体
 */
@Table(name = "mid_tel_callreason")
public class CallReasonRelation {
    /**
     * id
     */
    private String id;
    /**
     * 通话记录id
     * (该字段已废弃)
     */
    private String callId;
    /**
     * 通话记录id
     */
    private String callRecordId;
    /**
     * 通话原因id
     */
    private String reasonId;

    private String creatorId;

    private Date createTime;

    private Boolean isDeleted;

    private String deletorId;

    private Date deleteTime;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCallId() {
        return callId;
    }

    public String getCallRecordId() {
        return callRecordId;
    }

    public void setCallRecordId(String callRecordId) {
        this.callRecordId = callRecordId;
    }

    public void setCallId(String callId) {
        this.callId = callId;
    }

    public String getReasonId() {
        return reasonId;
    }

    public void setReasonId(String reasonId) {
        this.reasonId = reasonId;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public String getDeletorId() {
        return deletorId;
    }

    public void setDeletorId(String deletorId) {
        this.deletorId = deletorId;
    }

    public Date getDeleteTime() {
        return deleteTime;
    }

    public void setDeleteTime(Date deleteTime) {
        this.deleteTime = deleteTime;
    }
}
