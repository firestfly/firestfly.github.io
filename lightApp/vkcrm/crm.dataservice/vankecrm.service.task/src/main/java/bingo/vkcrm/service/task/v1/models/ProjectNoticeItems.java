package bingo.vkcrm.service.task.v1.models;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Table;

/**
 * 公告审批
 * @author chengsiyuan
 *
 */
@Table(name = "biz_project_notice_items")
public class ProjectNoticeItems {

	private String noticeId;
	private String approverId;
	private String opinion;
	private int result;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date approveTime;


	public String getNoticeId() {
		return noticeId;
	}
	public void setNoticeId(String noticeId) {
		this.noticeId = noticeId;
	}

	public String getApproverId() {
		return approverId;
	}
	public void setApproverId(String approverId) {
		this.approverId = approverId;
	}

	public String getOpinion() {
		return opinion;
	}
	public void setOpinion(String opinion) {
		this.opinion = opinion;
	}

	public int getResult() {
		return result;
	}
	public void setResult(int result) {
		this.result = result;
	}

	public Date getApproveTime() {
		return approveTime;
	}
	public void setApproveTime(Date approveTime) {
		this.approveTime = approveTime;
	}
	
}
