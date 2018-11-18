package bingo.vkcrm.service.questionnaire.v1.model;

import java.util.Date;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;

/**
 * 预约客户
 *
 * @author chengsiyuan
 */
@Table(name = "biz_subscribe_customer")
public class SubscribeCustomer {

    /**
     * id
     */
    private String id;
    /**
     * 问卷id
     */
    private String questionnaireId;
    /**
     * 客户id
     */
    private String customerId;
    /**
     * 房屋ID
     */
    private String projectId;
    /**
     * 房屋ID
     */
    private String houseId;
    /**
     * 预约时间
     */
    private Date subscribeTime;
    /**
     * 话务员id
     */
    private String telephonistId;
    /**
     * 创建时间
     */
    private Date cTime;
    /**
     * 是否已读取
     */
    private Boolean loaded;
    /**
     * 读取时间
     */
    private Date loadTime;
    /**
     * 读取话务员id
     */
    private String loadTelephonistId;

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

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public Date getSubscribeTime() {
        return subscribeTime;
    }

    public void setSubscribeTime(Date subscribeTime) {
        this.subscribeTime = subscribeTime;
    }

    public Date getCTime() {
        return cTime;
    }

    public void setCTime(Date cTime) {
        this.cTime = cTime;
    }

    public Boolean getLoaded() {
        return loaded;
    }

    public void setLoaded(Boolean loaded) {
        this.loaded = loaded;
    }

    public String getTelephonistId() {
        return telephonistId;
    }

    public void setTelephonistId(String telephonistId) {
        this.telephonistId = telephonistId;
    }

    public Date getLoadTime() {
        return loadTime;
    }

    public void setLoadTime(Date loadTime) {
        this.loadTime = loadTime;
    }

    public String getLoadTelephonistId() {
        return loadTelephonistId;
    }

    public void setLoadTelephonistId(String loadTelephonistId) {
        this.loadTelephonistId = loadTelephonistId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }
}
