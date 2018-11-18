package bingo.vkcrm.service.exceptions;

/**
 * 禁止访问异常
 */
public class ForbiddenException extends ServiceException {

    //禁止访问
    private static final int CODE_FORBIDDEN = 403;

    public ForbiddenException(String errorMessage) {
        super(CODE_FORBIDDEN, errorMessage);
    }
}
