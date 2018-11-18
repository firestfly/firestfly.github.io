package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.dao.orm.annotations.Column;
import bingo.vkcrm.service.model.BaseModel;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

/**
 * 选项
 */
public abstract class Option extends BaseModel {

    /**
     * 选项编码
     */
    @Column(name = "option_id")
    protected String id;

    /**
     * 问题编码
     */
    protected String topicId;

    /**
     * 序号
     */
    protected int sequence;

    /**
     * 选项分类
     */
    protected String category;

    /**
     * 选项分类文本
     */
    @Column(insert = false, update = false)
    protected String categoryText;

    /**
     * 分数
     */
    protected BigDecimal score;

    /**
     * 选项内容(注明分数)
     */
    protected String content;

    /**
     * 选项内容
     */
    protected String basicContent;

    /**
     * 是否已删除
     */
    @Column(name = "deleted")
    @JsonProperty(value = "isDeleted")
    protected boolean isDeleted;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTopicId() {
        return topicId;
    }

    public void setTopicId(String topicId) {
        this.topicId = topicId;
    }

    public int getSequence() {
        return sequence;
    }

    public void setSequence(int sequence) {
        this.sequence = sequence;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryText() {
        return getValue("OptionCategory", this.category);
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getBasicContent() {
        return basicContent;
    }

    public void setBasicContent(String basicContent) {
        this.basicContent = basicContent;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}