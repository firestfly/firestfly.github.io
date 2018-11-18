package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;

/**
 * 主题
 */
@Table(name = "biz_subject")
public class Subject {

    @Column(name = "subject_id")
    private String id;

    private String content;

    @Column(name = "anomalous_months")
    private Integer anomalousMonths;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getAnomalousMonths() {
        return anomalousMonths;
    }

    public void setAnomalousMonths(Integer anomalousMonths) {
        this.anomalousMonths = anomalousMonths;
    }
}
