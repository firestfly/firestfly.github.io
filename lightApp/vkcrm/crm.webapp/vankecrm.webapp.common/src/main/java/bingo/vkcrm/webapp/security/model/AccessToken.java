package bingo.vkcrm.webapp.security.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * AccessToken
 */
public class AccessToken {
    /**
     * access_token
     */
    @JsonProperty(value = "access_token")
    private String accessToken;

    /**
     * token_type
     */
    @JsonProperty(value = "token_type")
    private String tokenType;

    /**
     * refresh_token
     */
    @JsonProperty(value = "refresh_token")
    private String refreshToken;

    /**
     * scope
     */
    @JsonProperty(value = "scope")
    private String scope;

    /**
     * expires
     */
    @JsonProperty(value = "expires")
    private String expires;

    /**
     * expires_in
     */
    @JsonProperty(value = "expires_in")
    private String expiresIn;

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getExpires() {
        return expires;
    }

    public void setExpires(String expires) {
        this.expires = expires;
    }

    public String getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(String expiresIn) {
        this.expiresIn = expiresIn;
    }
}
