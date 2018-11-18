package bingo.vkcrm.service.report.v1.model;

import bingo.vkcrm.service.common.PageResult;

public class RestfulUtilMe {
private String code;
	
	private  String message;
	
	private Object list=new Object();
	
    /**
     * 分页信息
     */
    private RepPage pagination=new RepPage();

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}



	public Object getList() {
		return list;
	}

	public void setList(Object list) {
		this.list = list;
	}

	public RepPage getPagination() {
		return pagination;
	}

	public void setPagination(RepPage pagination) {
		this.pagination = pagination;
	}
    
    

	
    



}
