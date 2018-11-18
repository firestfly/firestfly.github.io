package bingo.vkcrm.service.questionnaire.v1.model;

/**
 * Created by liaochao on 2016/2/26 0026.
 */
public class AnswerAndSupply {
    //答案内容
    private String content;
    //补充说明
    private String supply;

    public AnswerAndSupply(String content, String supply) {
        this.content = content;
        this.supply = supply;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSupply() {
        return supply;
    }

    public void setSupply(String supply) {
        this.supply = supply;
    }

    public String myToString() {
        String returnStr = content;
        returnStr += "".equals(supply) ? ". " : ("(" + supply + "). ");
        return returnStr;
    }
}