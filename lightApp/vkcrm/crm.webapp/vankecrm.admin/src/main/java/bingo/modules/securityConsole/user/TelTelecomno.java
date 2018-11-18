package bingo.modules.securityConsole.user;

import bingo.common.core.utils.StringUtils;


   /**
    * tel_telecomno 实体类
    * Sat Oct 03 01:48:23 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class TelTelecomno{
	
	/** 电信工号 */
	private String number;
	/** 话务员编号 */
	private String telephonistid;
	/** 技能ID */
	private String skillid;
	

	public String toString(){
		String result = "{";
		if(StringUtils.isNotEmpty(telephonistid)){
			result += "话务员编号:" + telephonistid + ",";
		}
		if(StringUtils.isNotEmpty(number)){
			result += "电信工号:" + number + ",";
		}
		if(StringUtils.isNotEmpty(skillid)){
			result += "技能ID:" + skillid + ",";
		}
		try{
			result = result.substring(0, result.length()-1);
		}catch(Exception e){}
		result += "}";		
		return result;
	}
	
	
	public void setNumber(String number){
		this.number=number;
	}
	public String getNumber(){
		return number;
	}
	public void setTelephonistid(String telephonistid){
		this.telephonistid=telephonistid;
	}
	public String getTelephonistid(){
		return telephonistid;
	}
	public String getSkillid() {
		return skillid;
	}
	public void setSkillid(String skillid) {
		this.skillid = skillid;
	}
	
}

