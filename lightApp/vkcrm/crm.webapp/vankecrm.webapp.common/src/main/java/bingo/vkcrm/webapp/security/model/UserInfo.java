package bingo.vkcrm.webapp.security.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * UserInfo
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserInfo {
    /**
     * nick_name
     */
    @JsonProperty(value = "nickname")
    private String nickName;

    /**
     * created
     */
    @JsonProperty(value = "created")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date created;

    /**
     * updated
     */
    @JsonProperty(value = "updated")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updated;

    /**
     * identity_id
     */
    @JsonProperty(value = "identity_id")
    private String identityId;

    /**
     * is_keeper
     */
    @JsonProperty(value = "is_keeper")
    private String isKeeper;

    /**
     * avatar_url
     */
    @JsonProperty(value = "avatar_url")
    private String avatarUrl;

    /**
     * contact_phones
     */
    @JsonProperty(value = "contact_phones")
    private String[] contactPhones;

    /**
     * state
     */
    @JsonProperty(value = "state")
    private String state;

    /**
     * id
     */
    @JsonProperty(value = "id")
    private String id;

    /**
     * full_name
     */
    @JsonProperty(value = "fullname")
    private String fullName;

    /**
     * sex
     */
    @JsonProperty(value = "sex")
    private String sex;

    /**
     * mobile
     */
    @JsonProperty(value = "mobile")
    private String mobile;

    @JsonProperty(value = "job_can_edit")
    private String jobCanEdit;

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    public String getIdentityId() {
        return identityId;
    }

    public void setIdentityId(String identityId) {
        this.identityId = identityId;
    }

    public String getIsKeeper() {
        return isKeeper;
    }

    public void setIsKeeper(String isKeeper) {
        this.isKeeper = isKeeper;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String[] getContactPhones() {
        return contactPhones;
    }

    public void setContactPhones(String[] contactPhones) {
        this.contactPhones = contactPhones;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getJobCanEdit() {
        return jobCanEdit;
    }

    public void setJobCanEdit(String jobCanEdit) {
        this.jobCanEdit = jobCanEdit;
    }
}
