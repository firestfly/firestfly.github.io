package bingo.vkcrm.service.exceptions;

/**
 * 数据不存在
 * Created by Wangzr on 15/8/31.
 */
public class DataNotExistsException extends Exception {

    public DataNotExistsException(String message) {
        super(message);
    }
}
