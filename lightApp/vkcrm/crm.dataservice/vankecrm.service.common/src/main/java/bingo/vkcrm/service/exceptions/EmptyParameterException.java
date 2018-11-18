package bingo.vkcrm.service.exceptions;

/**
 * Created by hades on 15/9/3.
 */
public class EmptyParameterException extends ParameterErrorException {

    public EmptyParameterException(String parameterName, String parameterDesc) {
        super(parameterName, parameterDesc, "参数不允许为空");
    }
}
