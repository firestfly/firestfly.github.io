package bingo.modules.securityConsole.project;

import java.util.Date;


   /**
    * 项目 实体类
    * Tue Sep 15 16:12:36 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class Project{
	
	private String id;
	private Date startTime;
	private Date endTime;
	
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	/**
	 * @return the startTime
	 */
	public Date getStartTime() {
		return startTime;
	}
	/**
	 * @param startTime the startTime to set
	 */
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	/**
	 * @return the endTime
	 */
	public Date getEndTime() {
		return endTime;
	}
	/**
	 * @param endTime the endTime to set
	 */
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
}

