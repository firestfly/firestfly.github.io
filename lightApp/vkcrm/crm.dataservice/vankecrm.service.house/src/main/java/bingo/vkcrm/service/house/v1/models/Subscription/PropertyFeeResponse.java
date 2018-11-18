package bingo.vkcrm.service.house.v1.models.Subscription;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 物业费返回结果实体
 * @author chengsiyuan
 *
 */
public class PropertyFeeResponse {

	@JsonProperty(value = "EncryptTxt")
	private String EncryptTxt;
	@JsonProperty(value = "Version")
	private String Version;
	private String callee;
	private String caller; 
	private String operation; 
	private String para;
	private String returnData;
	private String returnMsg;
	private String returnValue;
	private String taskId;
	private String timestamp;
	public String getEncryptTxt() {
		return EncryptTxt;
	}
	public void setEncryptTxt(String encryptTxt) {
		EncryptTxt = encryptTxt;
	}
	public String getVersion() {
		return Version;
	}
	public void setVersion(String version) {
		Version = version;
	}
	public String getCallee() {
		return callee;
	}
	public void setCallee(String callee) {
		this.callee = callee;
	}
	public String getCaller() {
		return caller;
	}
	public void setCaller(String caller) {
		this.caller = caller;
	}
	public String getOperation() {
		return operation;
	}
	public void setOperation(String operation) {
		this.operation = operation;
	}
	public String getPara() {
		return para;
	}
	public void setPara(String para) {
		this.para = para;
	}
	public String getReturnData() {
		return returnData;
	}
	public void setReturnData(String returnData) {
		this.returnData = returnData;
	}
	public String getReturnMsg() {
		return returnMsg;
	}
	public void setReturnMsg(String returnMsg) {
		this.returnMsg = returnMsg;
	}
	public String getReturnValue() {
		return returnValue;
	}
	public void setReturnValue(String returnValue) {
		this.returnValue = returnValue;
	}
	public String getTaskId() {
		return taskId;
	}
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
	public String getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
	
}
 