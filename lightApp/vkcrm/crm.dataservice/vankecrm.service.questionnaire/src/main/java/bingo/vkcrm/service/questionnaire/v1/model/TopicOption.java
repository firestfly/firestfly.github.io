package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;

/**
 * 题目选项
 */
@Table(name = "biz_options")
public class TopicOption extends Option {

    /**
     * 处理方式
     */
    private int processMode;

    /**
     * 处理方式文本
     */
    @Column(insert = false, update = false)
    private String processModeText;

    /**
     * 跳转序号
     */
    private String gotoTopic;

    public int getProcessMode() {
        return processMode;
    }

    public void setProcessMode(int processMode) {
        this.processMode = processMode;
    }

    public String getProcessModeText() {
        return getValue("OptionProcessMode",this.processMode);
    }

    public void setProcessModeText(String processModeText) {
        this.processModeText = processModeText;
    }

    public String getGotoTopic() {
        return gotoTopic;
    }

    public void setGotoTopic(String gotoTopic) {
        this.gotoTopic = gotoTopic;
    }
}
