package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.model.BaseModel;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * 题目
 */
@Table(name = "biz_topics")
public class Topic extends BaseModel{
    /**
     * 题目编码
     */
    @Column(name = "topic_id")
    private String id;

    /**
     * 问卷编码
     */
    private String questionnaireId;

    /**
     * 题目标题
     */
    private String title;

    /**
     * 权重
     */
    private int weight;

    /**
     * 指标
     */
    private String target;

    /**
     * 序号
     */
    private int sequence;

    /**
     * 选项类型
     */
    private int optionMode;

    /**
     * 选项类型文本
     */
    @Column(insert = false, update = false)
    private String optionModeText;

    /**
     * 选项数量
     */
    private int optionCount;

    /**
     * 是否已启用
     */
    @Column(name = "enabled")
    @JsonProperty(value = "isEnabled")
    private boolean isEnabled;

    /**
     * 是否已删除
     */
    @Column(name = "deleted")
    @JsonProperty(value = "isDeleted")
    private boolean isDeleted;

    /**
     * 选项列表
     */
    @Column(insert = false, update = false)
    private List<TopicOption> optionList;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(String questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public int getSequence() {
        return sequence;
    }

    public void setSequence(int sequence) {
        this.sequence = sequence;
    }

    public int getOptionMode() {
        return optionMode;
    }

    public void setOptionMode(int optionMode) {
        this.optionMode = optionMode;
    }

    public String getOptionModeText() {
        return getValue("TopicsOptionMode", this.optionMode);
    }

    public int getOptionCount() {
        return optionCount;
    }

    public void setOptionCount(int optionCount) {
        this.optionCount = optionCount;
    }

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setIsEnabled(boolean isEnabled) {
        this.isEnabled = isEnabled;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public List<TopicOption> getOptionList() {
        return optionList;
    }

    public void setOptionList(List<TopicOption> optionList) {
        this.optionList = optionList;
    }
}
