package bingo.vkcrm.task.models.response;

public class GridHouseResponse {

    public GridHouseResponse() {
        super();
    }

    private String code;

    private GridHouseResult result;

    private String error;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public GridHouseResult getResult() {
        return result;
    }

    public void setResult(GridHouseResult result) {
        this.result = result;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public GridHouseResponse(String code, GridHouseResult result) {
        super();

        this.code = code;
        this.result = result;
    }

}
