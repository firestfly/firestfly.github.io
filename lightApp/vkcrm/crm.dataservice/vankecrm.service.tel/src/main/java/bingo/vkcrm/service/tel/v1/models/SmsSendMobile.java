package bingo.vkcrm.service.tel.v1.models;


   /**
    * sms_send_mobile 实体类
    * Tue Dec 08 19:04:43 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class SmsSendMobile{
	private String id;
	private String sendId;
	private String mobile;
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setSendId(String sendId){
		this.sendId=sendId;
	}
	public String getSendId(){
		return sendId;
	}
	public void setMobile(String mobile){
		this.mobile=mobile;
	}
	public String getMobile(){
		return mobile;
	}
}

