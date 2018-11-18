package bingo.vkcrm.task.models.appTask;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import bingo.dao.orm.annotations.Table;


@JsonIgnoreProperties(ignoreUnknown = true)
public class TackTableResult {
	private String code; //网格编码
	
	private String name;//网格名称
	
	private String project_code; //网格所在项目编码
	
	private String updated; //更新时间
	
	private String id;
	
	

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getProject_code() {
		return project_code;
	}

	public void setProject_code(String project_code) {
		this.project_code = project_code;
	}

	public String getUpdated() {
		return updated;
	}

	public void setUpdated(String updated) {
		this.updated = updated;
	}
	
	
}
