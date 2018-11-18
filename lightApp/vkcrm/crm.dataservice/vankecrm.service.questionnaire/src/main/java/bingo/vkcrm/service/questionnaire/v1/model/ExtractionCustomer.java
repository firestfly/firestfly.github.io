package bingo.vkcrm.service.questionnaire.v1.model;

import bingo.vkcrm.service.model.BaseModel;

/**
 * ExtractionCustomer 实体类
 * Mon Oct 26 19:19:33 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
public class ExtractionCustomer extends BaseModel {

    private String questionnaireId;//问卷ID
    private String questionnaireName;//问卷ID
    private String projectId;//项目ID
    private String projectName;//项目ID
    private String projectCode;//项目编码
    private String houseId;//房屋ID
    private String houseName;//房屋ID
    private String houseCode;//房屋编码
    private String customerId;//客户ID
    private String customerName;//客户名称
    private String customerCode;//客户编码
    private String mainMobile;//主要手机号码
    private String mainMobileTag;//主要号码标签
    private String standbyMobile;//备用手机号码
    private String standbyMobileTag;//备用手机号码标签
    private String homeTel;//家庭电话
    private String homeTelTag;//家庭电话标签
    private String officeTel;//办公电话
    private String officeTelTag;//办公电话标签

    private Integer sex;//性别
    private String sexText;//性别文本

    private Integer date1subscribe;//明天的预约剩余数量
    private Integer date2subscribe;//后天的预约剩余数量
    private Integer date3subscribe;//第三天的预约剩余数量
    private Integer date4subscribe;//第四天的预约剩余数量
    private Integer date5subscribe;//第五天的预约剩余数量


    /**
     * @return the questionnaireId
     */
    public String getQuestionnaireId() {
        return questionnaireId;
    }

    /**
     * @param questionnaireId the questionnaireId to set
     */
    public void setQuestionnaireId(String questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    /**
     * @return the questionnaireName
     */
    public String getQuestionnaireName() {
        return questionnaireName;
    }

    /**
     * @param questionnaireName the questionnaireName to set
     */
    public void setQuestionnaireName(String questionnaireName) {
        this.questionnaireName = questionnaireName;
    }

    /**
     * @return the projectId
     */
    public String getProjectId() {
        return projectId;
    }

    /**
     * @param projectId the projectId to set
     */
    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    /**
     * @return the projectName
     */
    public String getProjectName() {
        return projectName;
    }

    /**
     * @param projectName the projectName to set
     */
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    /**
     * @return the houseId
     */
    public String getHouseId() {
        return houseId;
    }

    /**
     * @param houseId the houseId to set
     */
    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    /**
     * @return the houseName
     */
    public String getHouseName() {
        return houseName;
    }

    /**
     * @param houseName the houseName to set
     */
    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public String getHouseCode() {
        return houseCode;
    }

    public void setHouseCode(String houseCode) {
        this.houseCode = houseCode;
    }

    /**
     * @return the customerId
     */
    public String getCustomerId() {
        return customerId;
    }

    /**
     * @param customerId the customerId to set
     */
    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    /**
     * @return the customerName
     */
    public String getCustomerName() {
        return customerName;
    }

    /**
     * @param customerName the customerName to set
     */
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    /**
     * @return the mainMobile
     */
    public String getMainMobile() {
        return mainMobile;
    }

    /**
     * @param mainMobile the mainMobile to set
     */
    public void setMainMobile(String mainMobile) {
        this.mainMobile = mainMobile;
    }

    /**
     * @return the standbyMobile
     */
    public String getStandbyMobile() {
        return standbyMobile;
    }

    /**
     * @param standbyMobile the standbyMobile to set
     */
    public void setStandbyMobile(String standbyMobile) {
        this.standbyMobile = standbyMobile;
    }

    /**
     * @return the homeTel
     */
    public String getHomeTel() {
        return homeTel;
    }

    /**
     * @param homeTel the homeTel to set
     */
    public void setHomeTel(String homeTel) {
        this.homeTel = homeTel;
    }

    /**
     * @return the officeTel
     */
    public String getOfficeTel() {
        return officeTel;
    }

    /**
     * @param officeTel the officeTel to set
     */
    public void setOfficeTel(String officeTel) {
        this.officeTel = officeTel;
    }

    /**
     * @return the mainMobileTag
     */
    public String getMainMobileTag() {
        return mainMobileTag;
    }

    /**
     * @param mainMobileTag the mainMobileTag to set
     */
    public void setMainMobileTag(String mainMobileTag) {
        this.mainMobileTag = mainMobileTag;
    }

    /**
     * @return the standbyMobileTag
     */
    public String getStandbyMobileTag() {
        return standbyMobileTag;
    }

    /**
     * @param standbyMobileTag the standbyMobileTag to set
     */
    public void setStandbyMobileTag(String standbyMobileTag) {
        this.standbyMobileTag = standbyMobileTag;
    }

    /**
     * @return the homeTelTag
     */
    public String getHomeTelTag() {
        return homeTelTag;
    }

    /**
     * @param homeTelTag the homeTelTag to set
     */
    public void setHomeTelTag(String homeTelTag) {
        this.homeTelTag = homeTelTag;
    }

    /**
     * @return the officeTelTag
     */
    public String getOfficeTelTag() {
        return officeTelTag;
    }

    /**
     * @param officeTelTag the officeTelTag to set
     */
    public void setOfficeTelTag(String officeTelTag) {
        this.officeTelTag = officeTelTag;
    }

    /**
     * @return the date1subscribe
     */
    public Integer getDate1subscribe() {
        return date1subscribe;
    }

    /**
     * @param date1subscribe the date1subscribe to set
     */
    public void setDate1subscribe(Integer date1subscribe) {
        this.date1subscribe = date1subscribe;
    }

    /**
     * @return the date2subscribe
     */
    public Integer getDate2subscribe() {
        return date2subscribe;
    }

    /**
     * @param date2subscribe the date2subscribe to set
     */
    public void setDate2subscribe(Integer date2subscribe) {
        this.date2subscribe = date2subscribe;
    }

    /**
     * @return the date3subscribe
     */
    public Integer getDate3subscribe() {
        return date3subscribe;
    }

    /**
     * @param date3subscribe the date3subscribe to set
     */
    public void setDate3subscribe(Integer date3subscribe) {
        this.date3subscribe = date3subscribe;
    }

    /**
     * @return the date4subscribe
     */
    public Integer getDate4subscribe() {
        return date4subscribe;
    }

    /**
     * @param date4subscribe the date4subscribe to set
     */
    public void setDate4subscribe(Integer date4subscribe) {
        this.date4subscribe = date4subscribe;
    }

    /**
     * @return the date5subscribe
     */
    public Integer getDate5subscribe() {
        return date5subscribe;
    }

    /**
     * @param date5subscribe the date5subscribe to set
     */
    public void setDate5subscribe(Integer date5subscribe) {
        this.date5subscribe = date5subscribe;
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public String getSexText() {
        return this.getValue("CustomerSex", this.sex);
    }
}

