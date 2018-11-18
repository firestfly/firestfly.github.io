package bingo.vkcrm.task.models.appTask;

import java.util.List;

public class AppResult {
	
	private  List<SyncTaskRecords> tasks;
	
	private Integer total;

	private String name;
	private String mobile;


	public List<SyncTaskRecords> getTasks() {
		return tasks;
	}

	public void setTasks(List<SyncTaskRecords> tasks) {
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
