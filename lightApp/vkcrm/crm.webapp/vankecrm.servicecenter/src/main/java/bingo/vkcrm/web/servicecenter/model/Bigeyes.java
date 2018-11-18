package bingo.vkcrm.web.servicecenter.model;

import bingo.common.core.ApplicationContext;

public class Bigeyes {
	/**
	 * 项目
	 */
	private String project;
	
	/**
	 * 公司名称
	 */
	private String unit;
	
	/**
	 * 标题
	 */
	private String title;
	
	/**
	 * 归档时间
	 */
	private String archDate;
	
	/**
	 * 文档类型
	 */
	private String docType;
	
	/**
	 * 文档类型text
	 */
	private String docTypeText;
	
	/**
	 * 文档子类型
	 */
	private String docSubType;
	/**
	 * 图片名称路径
	 */
	private String path;

	private String pageNo;

	public String getProject() {
		return project;
	}

	public void setProject(String project) {
		this.project = project;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getArchDate() {
		return archDate;
	}

	public void setArchDate(String archDate) {
		this.archDate = archDate;
	}

	public String getDocType() {
		return docType;
	}

	public void setDocType(String docType) {
		this.docType = docType;
	}
	
	public String getDocTypeText() {
		return docTypeText;
	}

	public void setDocTypeText(String docTypeText) {
		if(docTypeText.equals("DCTP")){
			this.docTypeText = "对私合同";
		}else if(docTypeText.equals("DCIPS")){
			this.docTypeText = "个人证照";
		}else if(docTypeText.equals("DCIPSID")){
			this.docTypeText = "身份证";
		}else if(docTypeText.equals("DCIPSPP")){
			this.docTypeText = "护照";
		}else if(docTypeText.equals("DCIPSOF")){
			this.docTypeText = "军官证";
		}else if(docTypeText.equals("DCIPSHM")){
			this.docTypeText = "港澳居民证";
		}else if(docTypeText.equals("DCIPSPC")){
			this.docTypeText = "警官证";
		}else if(docTypeText.equals("DCIPSTW")){
			this.docTypeText = "台胞证";
		}else if(docTypeText.equals("DCIPSNC")){
			this.docTypeText = "外国证照";
		}else if(docTypeText.equals("DCICOD")){
			this.docTypeText = "印章";
		}else if(docTypeText.equals("DFRCSCU")){
			this.docTypeText = "客户信息表";
		}else{
			this.docTypeText = docTypeText;
		}
		
	}
	
	public String getDocSubType() {
		return docSubType;
	}

	public void setDocSubType(String docSubType) {
		this.docSubType = docSubType;
	}

	public String getPath() {
		return ApplicationContext.getProperty("bigEyes.ImgPath")+path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getPageNo() {
		return pageNo;
	}

	public void setPageNo(String pageNo) {
		this.pageNo = pageNo;
	}
	
}
