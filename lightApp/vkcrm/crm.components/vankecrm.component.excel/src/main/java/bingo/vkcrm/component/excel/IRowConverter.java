package bingo.vkcrm.component.excel;

import java.util.Map;

/**
 * Created by Wangzr on 16/3/4.
 */
public interface IRowConverter {
    Map<String, Object> convert(Map<String, Object> var1, String[] var2, String[] var3);
}
