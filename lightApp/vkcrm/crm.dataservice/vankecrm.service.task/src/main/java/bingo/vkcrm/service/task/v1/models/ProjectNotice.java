package bingo.vkcrm.service.task.v1.models;

import java.util.Date;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.service.model.BaseModel;
import bingo.vkcrm.common.utils.CacheUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Column;

public class ProjectNotice extends BaseModel {
    /**
     * 公告ID
     */
    private String id;
    /**
     * 项目编号
     */
    private String projectCode;
    /**
     * 项目名称
     */
    private String projectName;
    /**
     * 生效时间
     */
    @Column(name = "takeEffectTime")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date takeEffectTime;
    /**
     * 失效时间
     */
    @Column(name = "lostEffectTime")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date lostEffectTime;
    /**
     * 公告级别
     */
    private String level;
    /**
     * 公告级别文本
     */
    private String levelText;
    /**
     * 公告内容
     */
    private String content;
    /**
     * 联系电话
     */
    private String contactMobile;
    /**
     * 审批状态
     */
    private int approveStatus;

    private String approveStatusText;
    /**
     * 公告状态
     */
    private int noticeStatus;
    /**
     * 公告状态文本
     */
    private String noticeStatusText;
    /**
     * 发布者
     */
    private String publisher;
    /**
     * 创建人ID
     */
    private String publisherId;
    private Integer noticeSource;
    private String noticeSourceText;
    /**
     * 公告创建时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date publishTime;
    /**
     * 公告是否删除
     */
    private Boolean isDeleted;
    /**
     * 公告删除人
     */
    private String deleter;
    /**
     * 公告删除人账号
     */
    private String deleterId;
    /**
     * 公告删除时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(style = "yyyy-MM-dd HH:mm:ss")
    private Date deleteTime;
    /**
     * 公告创建人是否登陆者本人
     */
    private boolean isSelf;
    /**
     * 是否已关闭
     */
    private boolean isClosed;
    /**
     * 关闭人
     */
    private String closeUserId;
    /**
     * 关闭时间
     */
    private Date closeTime;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Date getTakeEffectTime() {
        return takeEffectTime;
    }

    public void setTakeEffectTime(Date takeEffectTime) {
        this.takeEffectTime = takeEffectTime;
    }

    public Date getLostEffectTime() {
        return lostEffectTime;
    }

    public void setLostEffectTime(Date lostEffectTime) {
        this.lostEffectTime = lostEffectTime;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getLevelText() {
            return this.getValue("ProjectNoticeLevel", this.level);
    }

    public void setLevelText(String levelText) {
        this.levelText = levelText;
    }

    public String getSummary(){
        return StringUtils.substring(this.content, 0, this.content.length() > 20 ? 20 : this.content.length());
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContactMobile() {
        return contactMobile;
    }

    public void setContactMobile(String contactMobile) {
        this.contactMobile = contactMobile;
    }

    public int getApproveStatus() {
        return approveStatus;
    }

    public void setApproveStatus(int approveStatus) {
        this.approveStatus = approveStatus;
    }

    public String getApproveStatusText() {
        return approveStatusText;
    }

    public void setApproveStatusText(String approveStatusText) {
        this.approveStatusText = approveStatusText;
    }

    public int getNoticeStatus() {
        return noticeStatus;
    }

    public void setNoticeStatus(int noticeStatus) {
        this.noticeStatus = noticeStatus;
    }

    public String getNoticeStatusText() {
        return this.getValue("NoticeStatus", this.noticeStatus);
    }

    public void setNoticeStatusText(String noticeStatusText) {
        this.noticeStatusText = noticeStatusText;
    }

    public String getPublisher() {
        return CacheUtil.get(CachePrefix.UserId, this.publisherId);
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getPublisherId() {
        return publisherId;
    }

    public void setPublisherId(String publisherId) {
        this.publisherId = publisherId;
    }

    public Date getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(Date publishTime) {
        this.publishTime = publishTime;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public String getDeleter() {
        return deleter;
    }

    public void setDeleter(String deleter) {
        this.deleter = deleter;
    }

    public String getDeleterId() {
        return deleterId;
    }

    public void setDeleterId(String deleterId) {
        this.deleterId = deleterId;
    }

    public Date getDeleteTime() {
        return deleteTime;
    }

    public void setDeleteTime(Date deleteTime) {
        this.deleteTime = deleteTime;
    }

    public boolean isSelf() {
        return isSelf;
    }

    public void setSelf(boolean isSelf) {
        this.isSelf = isSelf;
    }

    public String getStatus() {
        if(this.isClosed){
            return getApproveStatusText();
        } else {
            if (this.approveStatus == ApproveStatus.Approve.getCode()) {
                return getNoticeStatusText();
            } else {
                return getApproveStatusText();
            }
        }
    }

    public Boolean getIsClosed() {
        return isClosed;
    }

    public void setIsClosed(Boolean isClosed) {
        this.isClosed = isClosed;
    }

    public String getCloseUserId() {
        return closeUserId;
    }

    public void setCloseUserId(String closeUserId) {
        this.closeUserId = closeUserId;
    }

    public Date getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(Date closeTime) {
        this.closeTime = closeTime;
    }

    /**
     * 公告来源
     */
    public Integer getNoticeSource() {
        return noticeSource;
    }

    public void setNoticeSource(Integer noticeSource) {
        this.noticeSource = noticeSource;
    }

    /**
     * 公告来源文本
     */
    public String getNoticeSourceText() {
        return this.getValue("NoticeSource", this.noticeSource);
    }

    public void setNoticeSourceText(String noticeSourceText) {
        this.noticeSourceText = noticeSourceText;
    }
}
