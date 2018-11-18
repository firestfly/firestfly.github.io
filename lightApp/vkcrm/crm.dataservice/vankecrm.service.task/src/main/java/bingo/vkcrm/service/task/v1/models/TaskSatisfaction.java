package bingo.vkcrm.service.task.v1.models;

/**
 * Created by szsonic on 2015/11/3.
 * 满意度评价内容
 */
public class TaskSatisfaction {
    private String code;
    private String parentCode;
    private String content;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getParentCode() {
        return parentCode;
    }

    public void setParentCode(String parentCode) {
        this.parentCode = parentCode;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
