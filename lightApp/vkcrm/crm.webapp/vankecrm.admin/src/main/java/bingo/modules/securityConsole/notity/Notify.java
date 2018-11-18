package bingo.modules.securityConsole.notity;

import bingo.dao.orm.annotations.Column;

import java.util.Date;

/**
 * 通知消息
 */
public class Notify {
    /**
     * 通知id
     */
    private String id;
    /**
     * 通知类型
     */
    private Integer type;
    /**
     * 通知内容
     */
    private String content;
    /**
     * 创建人
     */
    private String createdBy;
    /**
     * 创建时间
     */
    @Column(name = "created_at")
    private Date createdDate;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }
}
