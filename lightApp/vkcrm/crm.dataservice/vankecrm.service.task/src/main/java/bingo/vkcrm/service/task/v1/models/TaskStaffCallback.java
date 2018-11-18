package bingo.vkcrm.service.task.v1.models;

/**
 * Created by szsonic on 2015/12/14.
 */
public class TaskStaffCallback {
    private String code;
    private StaffResult result;
    private String has_more;
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }


    public String getHas_more() {
        return has_more;
    }

    public void setHas_more(String has_more) {
        this.has_more = has_more;
    }

    public StaffResult getResult() {
        return result;
    }

    public void setResult(StaffResult result) {
        this.result = result;
    }
}
