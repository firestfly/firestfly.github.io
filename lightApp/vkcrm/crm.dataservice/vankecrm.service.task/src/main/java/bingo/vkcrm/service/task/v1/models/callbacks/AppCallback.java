package bingo.vkcrm.service.task.v1.models.callbacks;

/**
 * Created by Wangzr on 16/3/16.
 */
public class AppCallback<T> {

    private int code;
    private T result;
    private String error;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
