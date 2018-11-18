package bingo.vkcrm.service.exceptions;

/**
 * Created by Wangzr on 15/9/3.
 */
public class ParameterErrorException extends ServiceException{

    //请求错误
    private static final int CODE_PARAMETER_ERROR = 400;

    public String parameterName;
    public String parameterDesc;
    public String errorMessage;

    public ParameterErrorException(String parameterName, String parameterDesc, String message) {
        super(CODE_PARAMETER_ERROR, String.format("参数有误：[%s:%s] %s", parameterName, parameterDesc, message));
        this.parameterName = parameterName;
        this.parameterDesc = parameterDesc;
        this.errorMessage = message;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getParameterDesc() {
        return parameterDesc;
    }

    public void setParameterDesc(String parameterDesc) {
        this.parameterDesc = parameterDesc;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
