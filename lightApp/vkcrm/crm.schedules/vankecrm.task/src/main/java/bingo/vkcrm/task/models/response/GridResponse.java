package bingo.vkcrm.task.models.response;

public class GridResponse {

    public GridResponse() {
        super();
    }

    private String code;

    private GridResult result;

    private String error;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public GridResult getResult() {
        return result;
    }

    public void setResult(GridResult result) {
        this.result = result;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public GridResponse(String code, GridResult result) {
        super();

        this.code = code;
        this.result = result;
    }

}
