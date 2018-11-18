package bingo.vkcrm.task.models.appTask;

/**
 * Created by szsonic on 2016/1/22/022.
 */
public class TaskCallBack4Report {
    private String code;
    private TaskRecordResult4Report result;

    /**
     * 状态码
     */
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }


    public TaskRecordResult4Report getResult() {
        return result;
    }

    public void setResult(TaskRecordResult4Report result) {
        this.result = result;
    }
}
