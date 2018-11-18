package bingo.vkcrm.service.exceptions;

/**
 * 请求错误异常
 */
public class BadRequestException extends ServiceException {

    //请求错误
    private static final int CODE_BAD_REQUEST = 400;

    public BadRequestException(String errorMessage) {
        super(CODE_BAD_REQUEST, errorMessage);
    }
}
