package bingo.vkcrm.web.servicecenter.model;

import bingo.dao.orm.annotations.Table;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;


   /**
    * excel_import_log 实体类
    * Sun Sep 06 18:17:53 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 

@Table(name="excel_import_log")
public class ExcelImportLog{
	
	/** 唯一标识：自增 */
	private String pid;
	/** 文件表ID，暂时没用 */
	private String attachmentId;
	/** 文件名称 */
	private String fileShortName;
	/** 文件上传保存绝对路径 */
	private String srcFileSavePath;
	/** 处理结果文件保存绝对路径 */
	private String resultFilePath;
	/** 导入人登录账号 */
	private String importLoginId;
	/** 导入业务类型 */
	private String businessType;
	/** 处理状态 */
	private String operateStatus;
	/** 处理结果信息 */
	private String operateResultInfo;
	/** 总记录数 */
	private String totalNums;
	/** 成功记录数 */
	private String successNums;
	/** 失败记录数 */
	private String errorNums;
	/** 当前处理记录数 */
	private String dealingNum;
	/** 上传时间 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date uploadTime;
	/** 开始处理时间 */
	private Date dealBeginTime;
	/** 处理结束时间 */
	private Date dealEndTime;
	/** 创建人 */
	private String createdBy;
	/** 创建日期 */
	private Date createdDate;
	/** 最后修改人名称 */
	private String lastUpdatedBy;
	/** 最后修改日期 */
	private Date lastUpdatedDate;
	/** 结束时间 */
	private Date endtime;
	/** 校验通过记录数 */
	private String validatePassNums;
	
	public void setPid(String pid){
		this.pid=pid;
	}
	public String getPid(){
		return pid;
	}
	public void setAttachmentId(String attachmentId){
		this.attachmentId=attachmentId;
	}
	public String getAttachmentId(){
		return attachmentId;
	}
	public void setFileShortName(String fileShortName){
		this.fileShortName=fileShortName;
	}
	public String getFileShortName(){
		return fileShortName;
	}
	public void setSrcFileSavePath(String srcFileSavePath){
		this.srcFileSavePath=srcFileSavePath;
	}
	public String getSrcFileSavePath(){
		return srcFileSavePath;
	}
	public void setResultFilePath(String resultFilePath){
		this.resultFilePath=resultFilePath;
	}
	public String getResultFilePath(){
		return resultFilePath;
	}
	public void setImportLoginId(String importLoginId){
		this.importLoginId=importLoginId;
	}
	public String getImportLoginId(){
		return importLoginId;
	}
	public void setBusinessType(String businessType){
		this.businessType=businessType;
	}
	public String getBusinessType(){
		return businessType;
	}
	public void setOperateStatus(String operateStatus){
		this.operateStatus=operateStatus;
	}
	public String getOperateStatus(){
		return operateStatus;
	}
	public void setOperateResultInfo(String operateResultInfo){
		this.operateResultInfo=operateResultInfo;
	}
	public String getOperateResultInfo(){
		return operateResultInfo;
	}
	public void setTotalNums(String totalNums){
		this.totalNums=totalNums;
	}
	public String getTotalNums(){
		return totalNums;
	}
	public void setSuccessNums(String successNums){
		this.successNums=successNums;
	}
	public String getSuccessNums(){
		return successNums;
	}
	public void setErrorNums(String errorNums){
		this.errorNums=errorNums;
	}
	public String getErrorNums(){
		return errorNums;
	}
	public void setDealingNum(String dealingNum){
		this.dealingNum=dealingNum;
	}
	public String getDealingNum(){
		return dealingNum;
	}
	public void setCreatedBy(String createdBy){
		this.createdBy=createdBy;
	}
	public String getCreatedBy(){
		return createdBy;
	}
	public void setLastUpdatedBy(String lastUpdatedBy){
		this.lastUpdatedBy=lastUpdatedBy;
	}
	public String getLastUpdatedBy(){
		return lastUpdatedBy;
	}
	public void setValidatePassNums(String validatePassNums){
		this.validatePassNums=validatePassNums;
	}
	public String getValidatePassNums(){
		return validatePassNums;
	}
	/**
	 * @return the uploadTime
	 */
	public Date getUploadTime() {
		return uploadTime;
	}
	/**
	 * @param uploadTime the uploadTime to set
	 */
	public void setUploadTime(Date uploadTime) {
		this.uploadTime = uploadTime;
	}
	/**
	 * @return the dealBeginTime
	 */
	public Date getDealBeginTime() {
		return dealBeginTime;
	}
	/**
	 * @param dealBeginTime the dealBeginTime to set
	 */
	public void setDealBeginTime(Date dealBeginTime) {
		this.dealBeginTime = dealBeginTime;
	}
	/**
	 * @return the dealEndTime
	 */
	public Date getDealEndTime() {
		return dealEndTime;
	}
	/**
	 * @param dealEndTime the dealEndTime to set
	 */
	public void setDealEndTime(Date dealEndTime) {
		this.dealEndTime = dealEndTime;
	}
	/**
	 * @return the createdDate
	 */
	public Date getCreatedDate() {
		return createdDate;
	}
	/**
	 * @param createdDate the createdDate to set
	 */
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	/**
	 * @return the lastUpdatedDate
	 */
	public Date getLastUpdatedDate() {
		return lastUpdatedDate;
	}
	/**
	 * @param lastUpdatedDate the lastUpdatedDate to set
	 */
	public void setLastUpdatedDate(Date lastUpdatedDate) {
		this.lastUpdatedDate = lastUpdatedDate;
	}
	/**
	 * @return the endtime
	 */
	public Date getEndtime() {
		return endtime;
	}
	/**
	 * @param endtime the endtime to set
	 */
	public void setEndtime(Date endtime) {
		this.endtime = endtime;
	}
}

