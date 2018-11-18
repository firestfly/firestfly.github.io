package bingo.vkcrm.service.tel.v1.models;

import java.util.Date;


   /**
    * sms_send_log 实体类
    * Tue Dec 08 19:04:43 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class SmsSendLog{
	
	private String id;//唯一主键
	private String templateId;//模版ID
	private String type;//模版类型
	private String content;//短信内容
	private Date timing;//定时时间，为空时表示立即发送（选填）
	private String extCode;//扩展编号：接收短信时使用
	private String msgid;//客户自定义消息ID
	private Date sendTime;//发送时间
	private String sendName;//发送人名称
	private String sendUid;//发送人ID
	private Boolean success;//是否发送成功：1推送成功，2推送失败
	private String errorMessage;//发送失败错误信息
	private String returnCode;//状态报告编码：DELIVRD状态成功;UNDELIV状态失败;EXPIRED因为用户长时间关机或者不在服务区等导致的短消息超时没有递交到用户手机上REJECTD消息因为某些原因被拒绝MBBLACK黑号
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setTemplateId(String templateId){
		this.templateId=templateId;
	}
	public String getTemplateId(){
		return templateId;
	}
	public void setType(String type){
		this.type=type;
	}
	public String getType(){
		return type;
	}
	public void setContent(String content){
		this.content=content;
	}
	public String getContent(){
		return content;
	}
	public void setTiming(Date timing){
		this.timing=timing;
	}
	public Date getTiming(){
		return timing;
	}
	public void setExtCode(String extCode){
		this.extCode=extCode;
	}
	public String getExtCode(){
		return extCode;
	}
	public void setMsgid(String msgid){
		this.msgid=msgid;
	}
	public String getMsgid(){
		return msgid;
	}
	public void setSendTime(Date sendTime){
		this.sendTime=sendTime;
	}
	public Date getSendTime(){
		return sendTime;
	}
	public void setSendName(String sendName){
		this.sendName=sendName;
	}
	public String getSendName(){
		return sendName;
	}
	public void setSendUid(String sendUid){
		this.sendUid=sendUid;
	}
	public String getSendUid(){
		return sendUid;
	}
	public Boolean getSuccess() {
		return success;
	}
	public void setSuccess(Boolean success) {
		this.success = success;
	}
	public void setReturnCode(String returnCode){
		this.returnCode=returnCode;
	}
	public String getReturnCode(){
		return returnCode;
	}
	/**
	 * @return the errorMessage
	 */
	public String getErrorMessage() {
		return errorMessage;
	}
	/**
	 * @param errorMessage the errorMessage to set
	 */
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	
}

