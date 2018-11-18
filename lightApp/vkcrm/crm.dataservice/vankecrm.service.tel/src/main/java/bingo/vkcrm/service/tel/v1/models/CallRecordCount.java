package bingo.vkcrm.service.tel.v1.models;

import java.util.Date;

/**
 * 话务统计实例
 * @author Administrator
 *
 */
public class CallRecordCount {
	//查询起始时间
	private Date beginTime;
	//查询结束时间
	private Date endTime;
	//呼入次数
	private int callInCount;
	//呼出次数
	private int callOutCount;
	//呼出未接听数
	private int callOutMissCount;
	//已检次数
	private int checkedCount;
	public Date getBeginTime() {
		return beginTime;
	}
	public void setBeginTime(Date beginTime) {
		this.beginTime = beginTime;
	}
	public Date getEndTime() {
		return endTime;
	}
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	public int getCallInCount() {
		return callInCount;
	}
	public void setCallInCount(int callInCount) {
		this.callInCount = callInCount;
	}
	public int getCallOutCount() {
		return callOutCount;
	}
	public void setCallOutCount(int callOutCount) {
		this.callOutCount = callOutCount;
	}
	public int getCallOutMissCount() {
		return callOutMissCount;
	}
	public void setCallOutMissCount(int callOutMissCount) {
		this.callOutMissCount = callOutMissCount;
	}
	public int getCheckedCount() {
		return checkedCount;
	}
	public void setCheckedCount(int checkedCount) {
		this.checkedCount = checkedCount;
	}
	
}
