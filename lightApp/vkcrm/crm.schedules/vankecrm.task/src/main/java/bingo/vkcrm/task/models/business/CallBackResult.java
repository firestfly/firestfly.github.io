package bingo.vkcrm.task.models.business;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by szsonic on 2015/12/22.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class CallBackResult {
    private String code;
    private Result result;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }
}
