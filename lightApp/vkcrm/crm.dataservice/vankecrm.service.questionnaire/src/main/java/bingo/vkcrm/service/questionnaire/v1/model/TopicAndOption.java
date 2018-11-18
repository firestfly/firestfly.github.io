package bingo.vkcrm.service.questionnaire.v1.model;

/**
 * Created by liaochao on 2016/2/23 0023.
 */
public class TopicAndOption {
    /**
     * 答案内容,如:比较满意,满意等.
     */
    private String content;
    /**
     * 题目id
     */
    private String topicId;
    /**
     * 题目序号
     */
    private String topicSequence;
    /**
     * 选项序号
     */
    private String optionSequence;
    /**
     * 选项id
     */
    private String optionId;
    /**
     * 题目标题
     */
    private String title;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getOptionId() {
        return optionId;
    }

    public void setOptionId(String optionId) {
        this.optionId = optionId;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTopicId() {
        return topicId;
    }

    public void setTopicId(String topicId) {
        this.topicId = topicId;
    }

    public String getTopicSequence() {
        return topicSequence;
    }

    public void setTopicSequence(String topicSequence) {
        this.topicSequence = topicSequence;
    }

    public String getOptionSequence() {
        return optionSequence;
    }

    public void setOptionSequence(String optionSequence) {
        this.optionSequence = optionSequence;
    }
}
