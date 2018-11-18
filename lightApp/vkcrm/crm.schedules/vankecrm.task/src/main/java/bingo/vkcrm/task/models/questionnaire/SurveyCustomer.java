package bingo.vkcrm.task.models.questionnaire;

import bingo.dao.orm.annotations.Table;

@Table(name = "sati_extraction_identity")
public class SurveyCustomer {

    /**
     * 唯一主键
     */
    private String id;

    /**
     * 客户ID
     */
    private String customerId;

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerId() {
        return customerId;
    }
}

