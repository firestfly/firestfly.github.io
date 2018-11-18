package bingo.vkcrm.service.exceptions;

/**
 * 服务异常
 */
public class ServiceException extends Exception {
    int code;
    String errorMessage;

    public int getCode() {
        return code;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    /**
     * @param code
     * @param errorMessage
     */
    public ServiceException(int code, String errorMessage) {
        super(errorMessage);
        this.code = code;
        this.errorMessage = errorMessage;
    }
}
