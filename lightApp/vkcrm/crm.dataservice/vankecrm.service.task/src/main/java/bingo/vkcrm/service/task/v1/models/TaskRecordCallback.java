package bingo.vkcrm.service.task.v1.models;

/**
 * Created by szsonic on 2015/9/23.
 *
 * 调用助这儿接口返回信息
 */

public class TaskRecordCallback {
    /**
     * 状态码
     */
    private String code;
    
    private String error;
    /**
     * 返回结果
     */
    private TaskRecordResult result;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public TaskRecordResult getResult() {
        return result;
    }

    public void setResult(TaskRecordResult result) {
        this.result = result;
    }

	/**
	 * @return the error
	 */
	public String getError() {
		return error;
	}

	/**
	 * @param error the error to set
	 */
	public void setError(String error) {
		this.error = error;
	}
    
    
}
