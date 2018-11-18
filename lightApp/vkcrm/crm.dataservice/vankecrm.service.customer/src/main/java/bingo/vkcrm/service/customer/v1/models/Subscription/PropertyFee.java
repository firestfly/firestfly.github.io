package bingo.vkcrm.service.customer.v1.models.Subscription;

/**
 * 物业费数据实体
 * @author chengsiyuan
 *
 */
public class PropertyFee {

	private String Version;
	private String caller;
	private String callee;
	private String timestamp;
	private String operation;
	private String returnValue;
	private String returnMsg;
	private String taskId;
	private String EncryptTxt;
	private String para;
	private String returnData;
	public String getVersion() {
		return Version;
	}
	public void setVersion(String version) {
		Version = version;
	}
	public String getCaller() {
		return caller;
	}
	public void setCaller(String caller) {
		this.caller = caller;
	}
	public String getCallee() {
		return callee;
	}
	public void setCallee(String callee) {
		this.callee = callee;
	}
	public String getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
	public String getOperation() {
		return operation;
	}
	public void setOperation(String operation) {
		this.operation = operation;
	}
	public String getReturnValue() {
		return returnValue;
	}
	public void setReturnValue(String returnValue) {
		this.returnValue = returnValue;
	}
	public String getReturnMsg() {
		return returnMsg;
	}
	public void setReturnMsg(String returnMsg) {
		this.returnMsg = returnMsg;
	}
	public String getTaskId() {
		return taskId;
	}
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
	
	public String getEncryptTxt() {
		return EncryptTxt;
	}
	public void setEncryptTxt(String encryptTxt) {
		EncryptTxt = encryptTxt;
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
	

}
