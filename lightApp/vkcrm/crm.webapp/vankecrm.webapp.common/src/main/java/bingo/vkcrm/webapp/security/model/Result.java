package bingo.vkcrm.webapp.security.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Result
 */
public class Result {
    /**
     * code
     */
    @JsonProperty(value = "code")
    private String code;

    /**
     * result
     */
    @JsonProperty(value = "result")
    private UserInfo userInfo;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }
}
