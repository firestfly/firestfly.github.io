package bingo.vkcrm.service.exceptions;

/**
 * 禁止访问异常
 */
public class NotModifyiedException extends ServiceException {

    //禁止访问
    public static final int CODE_FORBIDDEN = 403;

    public NotModifyiedException(String errorMessage) {
        super(CODE_FORBIDDEN, errorMessage);
    }
}
