package bingo.vkcrm.service.task.v1.models;

import bingo.dao.orm.annotations.IsKey;

import java.util.Date;

/**
 * Created by szsonic on 2015/9/28.
 */
public class TaskRecordsExtension {
    @IsKey
    private String taskId;
    private String levelType;
    private String levelTypeText;
    private String source;
    private String sourceText;
    private String creator;
    private String creatorId;
    private Date createTime;


    public String getLevelType() {
        return levelType;
    }

    public void setLevelType(String levelType) {
        this.levelType = levelType;
    }

    public String getLevelTypeText() {
        return levelTypeText;
    }

    public void setLevelTypeText(String levelTypeText) {
        this.levelTypeText = levelTypeText;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSourceText() {
        return sourceText;
    }

    public void setSourceText(String sourceText) {
        this.sourceText = sourceText;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
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

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }
}
