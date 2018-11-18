package bingo.vkcrm.service.house.v1.models.Subscription;

import java.util.Date;

/**
 * 订阅关系返回体头部
 * @author Administrator
 *
 */
public class ResponseHead {
	private String code;
	private String describe;
	private String mood;
	private Date serverDate;
	private String version;
	private String versionUrl;
	private int updateType;
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getDescribe() {
		return describe;
	}
	public void setDescribe(String describe) {
		this.describe = describe;
	}
	public String getMood() {
		return mood;
	}
	public void setMood(String mood) {
		this.mood = mood;
	}
	public Date getServerDate() {
		return serverDate;
	}
	public void setServerDate(Date serverDate) {
		this.serverDate = serverDate;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getVersionUrl() {
		return versionUrl;
	}
	public void setVersionUrl(String versionUrl) {
		this.versionUrl = versionUrl;
	}
	public int getUpdateType() {
		return updateType;
	}
	public void setUpdateType(int updateType) {
		this.updateType = updateType;
	}

	
}
