package bingo.vkcrm.task.models.appTask;

/**
 * Created by szsonic on 2015/9/23.
 *
 * 调用助这儿接口返回信息
 */

public class TaskListCallback {
	/**
	 * 状态码
	 */
	private String code;
	/**
	 * 返回结果
	 */
	private AppResult result;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public AppResult getResult() {
		return result;
	}

	public void setResult(AppResult result) {
		this.result = result;
	}

}
