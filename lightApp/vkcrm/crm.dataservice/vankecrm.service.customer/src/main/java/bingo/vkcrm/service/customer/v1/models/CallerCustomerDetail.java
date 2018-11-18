package bingo.vkcrm.service.customer.v1.models;
import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import bingo.vkcrm.service.enums.DictionaryCodes;
import bingo.vkcrm.service.model.BaseModel;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by szsonic on 2016/2/2/002.
 */
public class CallerCustomerDetail extends BaseModel{
    /**
     * 客户Id
     */
    private String customerId;
    /**
     * 客户姓名
     */
    private String name;
    /**
     * 客户性别
     */
    private Integer sex;
    /**
     * 客户性别
     */
    private Integer sexText;
    /**
     * 来电号码
     */
    private String phone;
    /**
     * 是否审核
     */
    private String hasApprove;
    private String fullName;
    private String contentId;
    private String contentText;
    private String identity;
    private String identityText;
    private String relationTypeText;
    private String relationType;
    private String projectId;
    private String projectName;
    private String buildingName;

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public String getSexText() {
        return this.getValue(DictionaryCodes.CustomerSex, this.sex);
    }

    public String getHasApprove() {
        return hasApprove;
    }

    public void setHasApprove(String hasApprove) {
        this.hasApprove = hasApprove;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getContentId() {
        return contentId;
    }

    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    public String getIdentity() {
        return identity;
    }

    public void setIdentity(String identity) {
        this.identity = identity;
    }

    public String getContentText() {
        if(StringUtils.isNotEmpty(this.getContentId())){
            String[] contentIdArr=this.getContentId().split(",");
            List<String> list=new ArrayList<String>();
            for (String contentId : contentIdArr) {
                list.add(this.getValue("CustomerHobbies",contentId));
            }
            contentText= StringUtils.join(list.toArray(),";");
        }
        return contentText;
    }

    public void setContentText(String contentText) {
        this.contentText = contentText;
    }

    public String getIdentityText() {
        if(StringUtils.isNotEmpty(this.getIdentity())){
            String[] identityArr=this.identity.split(",");
            List<String> list=new ArrayList<String>();
            for (String identity : identityArr) {
                list.add(this.getValue("CustomerIdentity",identity));
            }
            identityText= StringUtils.join(list.toArray(),";");
        }
        return identityText;
    }

    public void setIdentityText(String identityText) {
        this.identityText = identityText;
    }

    public String getRelationTypeText() {
        if(StringUtils.isNotEmpty(this.getRelationType())){
            String[] relationArr=this.getRelationType().split(",");
            List<String> list=new ArrayList<String>();
            for (String relation : relationArr) {
                list.add(this.getValue("HouseCustomerRelationType",relation));
            }
            relationTypeText= StringUtils.join(list.toArray(),";");
        }
        return relationTypeText;
    }

    public void setRelationTypeText(String relationTypeText) {
        this.relationTypeText = relationTypeText;
    }

    public String getRelationType() {
        return relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        Map<String,String> info= CacheUtil.get(Map.class, CachePrefix.PrjId,this.getProjectId());
        return info==null?null:info.get("name");
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }
}
