package bingo.vkcrm.task.models.response;

public class GridStaffResponse {
    private String code;
    private GridStaffResult result;

    public GridStaffResponse(String code, GridStaffResult result) {
        super();
        this.code = code;
        this.result = result;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public GridStaffResult getResult() {
        return result;
    }

    public void setResult(GridStaffResult result) {
        this.result = result;
    }

    public GridStaffResponse() {
        super();

    }

}
