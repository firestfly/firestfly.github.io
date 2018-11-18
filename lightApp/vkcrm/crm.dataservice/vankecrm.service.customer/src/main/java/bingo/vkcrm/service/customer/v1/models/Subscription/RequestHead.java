package bingo.vkcrm.service.customer.v1.models.Subscription;

/**
 * 订阅关系请求体头部
 * @author chengsiyaun
 *
 */
public class RequestHead {
	/**
	 * id
	 */
	private String sysid;
	/**
	 * 密码
	 */
	private String password;
	/**
	 * 时间戳
	 */
	private String timestamp;
	
	private String functionid;

	public String getSysid() {
		return sysid;
	}

	public void setSysid(String sysid) {
		this.sysid = sysid;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	public String getFunctionid() {
		return functionid;
	}

	public void setFunctionid(String functionid) {
		this.functionid = functionid;
	}
	

}
