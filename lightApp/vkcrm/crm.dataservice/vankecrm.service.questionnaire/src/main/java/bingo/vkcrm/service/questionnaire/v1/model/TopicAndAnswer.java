package bingo.vkcrm.service.questionnaire.v1.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by liaochao on 2016/2/23 0023.
 * 若日后有功能扩展,添加新的字段即可.
 */
public class TopicAndAnswer implements Comparable<TopicAndAnswer>{
    //回答者姓名
    private String customerName;
    //问题序号
    private String sequence;
    //问题标题
    private String title;
    //答案和补充内容list
    @JsonIgnore
    private List<AnswerAndSupply> answerAndSupplys = new ArrayList<AnswerAndSupply>();
    //页面上展现的答案形式
    private String contentToBeShown = "";


    public String getSequence() {
        return sequence;
    }

    public void setSequence(String sequence) {
        this.sequence = sequence;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void addAnswerAndSupplys(AnswerAndSupply answerAndSupply) {
        answerAndSupplys.add(answerAndSupply);
    }

    public String getContentToBeShown() {
        return contentToBeShown;
    }

    public void setContentToBeShown(String contentToBeShown) {
        this.contentToBeShown = contentToBeShown;
    }

    /**
     * 构造符合前端显示的答案数据
     */
    public void buildContentToBeShown() {
        for (int i = 0; i < answerAndSupplys.size(); i++) {
            contentToBeShown += answerAndSupplys.get(i).myToString();
        }
    }

    @Override
    public int compareTo(TopicAndAnswer o) {
        return Integer.valueOf(this.sequence)-Integer.valueOf(o.sequence);
    }
}
