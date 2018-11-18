package bingo.modules.securityConsole.telcallreason;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;

/**
 * 采集原因实例
 * @author chengsiyuan
 *
 */
@Table(name="tel_callreason")
public class TelCallReason {
	//id
	private String id;
	//通话类型
	private int type;
	//通话类型内容
	private String typeText;
	//通话原因
	private String content;
	//排序
	private int sortNo;
	//是否启用
	private boolean isEnabled;
	//创建�?
	private String creator;
	//创建者id
	private String creatorId;
	//创建时间
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date createTime;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public int getSortNo() {
		return sortNo;
	}
	public void setSortNo(int sortNo) {
		this.sortNo = sortNo;
	}
	public boolean isEnabled() {
		return isEnabled;
	}
	public void setEnabled(boolean isEnabled) {
		this.isEnabled = isEnabled;
	}
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}
	public String getCreatorId() {
		return creatorId;
	}
	public void setCreatorId(String creatorId) {
		this.creatorId = creatorId;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public String getTypeText() {
		return typeText;
	}
	public void setTypeText(String typeText) {
		this.typeText = typeText;
	}
	
	
}
