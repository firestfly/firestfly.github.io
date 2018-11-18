package bingo.vkcrm.service.task.v1.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
public class AppResult {
	
	private  List<TaskInfo> tasks;
	
	private Integer total;

	private String name;
	private String mobile;

	public List<TaskInfo> getTasks() {
		return tasks;
	}

	public void setTasks(List<TaskInfo> tasks) {
		this.tasks = tasks;
	}

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
}
