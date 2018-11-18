package bingo.vkcrm.service.model;


/**
 * 比较器
 */
public class HmacSHA1Result {
	
    /** 时间戳 */
    private String ts;
    /** 令牌 */
    private String token;
    /** 认证key */
    private String accessKey;
    /** 拼接好的新的URI */
    private String newUri;
    

	/**
	 * @return the ts
	 */
	public String getTs() {
		return ts;
	}

	/**
	 * @param ts the ts to set
	 */
	public void setTs(String ts) {
		this.ts = ts;
	}

	/**
	 * @return the token
	 */
	public String getToken() {
		return token;
	}

	/**
	 * @param token the token to set
	 */
	public void setToken(String token) {
		this.token = token;
	}

	/**
	 * @return the newUri
	 */
	public String getNewUri() {
		return newUri;
	}

	/**
	 * @param newUri the newUri to set
	 */
	public void setNewUri(String newUri) {
		this.newUri = newUri;
	}

	/**
	 * @return the accessKey
	 */
	public String getAccessKey() {
		return accessKey;
	}

	/**
	 * @param accessKey the accessKey to set
	 */
	public void setAccessKey(String accessKey) {
		this.accessKey = accessKey;
	}
    
    
    
    
}
