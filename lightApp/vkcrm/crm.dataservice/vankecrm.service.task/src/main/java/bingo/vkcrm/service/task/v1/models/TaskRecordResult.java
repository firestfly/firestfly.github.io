package bingo.vkcrm.service.task.v1.models;

/**
 * Created by szsonic on 2015/9/22.
 */
public class TaskRecordResult {
    /**
     * 成功时返回任务流水号
     */
    private String task_id;
    /**
     * 错误代码
     */
    private String error_code;
    /**
     * 错误描述
     */
    private String error_msg;

    private String task_no;

    /**
	 * @return the task_id
	 */
	public String getTask_id() {
		return task_id;
	}

	/**
	 * @param task_id the task_id to set
	 */
	public void setTask_id(String task_id) {
		this.task_id = task_id;
	}

	public String getError_code() {
        return error_code;
    }

    public void setError_code(String error_code) {
        this.error_code = error_code;
    }



    public String getError_msg() {
        return error_msg;
    }

    public void setError_msg(String error_msg) {
        this.error_msg = error_msg;
    }

    public String getTask_no() {
        return task_no;
    }

    public void setTask_no(String task_no) {
        this.task_no = task_no;
    }
}
