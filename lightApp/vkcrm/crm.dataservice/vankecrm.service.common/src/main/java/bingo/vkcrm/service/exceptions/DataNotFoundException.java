package bingo.vkcrm.service.exceptions;

/**
 * 未找到数据异常
 * Created by Wangzr on 15/8/31.
 */
public class DataNotFoundException extends Exception {

    public DataNotFoundException(String message) {
        super(message);
    }
}
