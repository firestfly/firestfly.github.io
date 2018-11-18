package bingo.vkcrm.service.exceptions;

/**
 * 未认证服务异常
 */
public class UnAuthorizedException extends ServiceException {

    //未认证
    private static final int CODE_UNAUTHORIZED = 401;

    public UnAuthorizedException(String errorMessage) {
        super(CODE_UNAUTHORIZED, errorMessage);
    }
}
