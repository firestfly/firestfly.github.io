package bingo.vkcrm.service.tel.v1.models;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;

/**
 * 通话记录实例
 * @author chengsiyuan
 *
 */
@Table(name="tel_call_records")
public class TelCallRecord {
	//通话记录id
	@UUID
	private String id;
	//通话编号(不用)
	private String code;
	private String callId;
	private String recordId;
	//来电号码
	private String callNumber;
	//来电时间
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date callTime;
	//通话开始时间
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date beginTime;
	//通话结束时间
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date endTime;
	//通话持续时长（单位：秒）
	private Integer duration;
	//是否接听
	private boolean isConnect;
	//话务员姓名
	private String telephonist;
	//话务员id
	private String telephonistId;
	//是否质检
	private Boolean hasCheck;
	//质检员姓名
	private String checker;
	//质检员id
	private String checkerId;
	//通话类型
	private Integer type;
	//通话类型内容
	private String typeText;
	//话务来源
	private Integer source;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	
	public String getCallId() {
		return callId;
	}
	public void setCallId(String callId) {
		this.callId = callId;
	}
	public String getRecordId() {
		return recordId;
	}
	public void setRecordId(String recordId) {
		this.recordId = recordId;
	}
	public String getCallNumber() {
		return callNumber;
	}
	public void setCallNumber(String callNumber) {
		this.callNumber = callNumber;
	}
	public Date getCallTime() {
		return callTime;
	}
	public void setCallTime(Date callTime) {
		this.callTime = callTime;
	}
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
	
	public Integer getDuration() {
		return duration;
	}
	public void setDuration(Integer duration) {
		this.duration = duration;
	}
	public boolean isConnect() {
		return isConnect;
	}
	public void setConnect(boolean isConnect) {
		this.isConnect = isConnect;
	}
	public String getTelephonist() {
		return telephonist;
	}
	public void setTelephonist(String telephonist) {
		this.telephonist = telephonist;
	}
	public String getTelephonistId() {
		return telephonistId;
	}
	public void setTelephonistId(String telephonistId) {
		this.telephonistId = telephonistId;
	}
	public Boolean getHasCheck() {
		return hasCheck;
	}
	public void setHasCheck(Boolean hasCheck) {
		this.hasCheck = hasCheck;
	}
	public String getChecker() {
		return checker;
	}
	public void setChecker(String checker) {
		this.checker = checker;
	}
	public String getCheckerId() {
		return checkerId;
	}
	public void setCheckerId(String checkerId) {
		this.checkerId = checkerId;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public String getTypeText() {
		return typeText;
	}
	public void setTypeText(String typeText) {
		this.typeText = typeText;
	}
	public Integer getSource() {
		return source;
	}
	public void setSource(Integer source) {
		this.source = source;
	}
	
	
	
}
