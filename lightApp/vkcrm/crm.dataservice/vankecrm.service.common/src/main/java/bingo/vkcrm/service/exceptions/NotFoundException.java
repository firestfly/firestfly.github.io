package bingo.vkcrm.service.exceptions;


/**
 * 资源不存在异常
 */
public class NotFoundException extends ServiceException {

    //资源不存在
    private static final int CODE_NOT_FOUND = 404;

    public NotFoundException(String errorMessage) {
        super(CODE_NOT_FOUND, errorMessage);
    }
}
