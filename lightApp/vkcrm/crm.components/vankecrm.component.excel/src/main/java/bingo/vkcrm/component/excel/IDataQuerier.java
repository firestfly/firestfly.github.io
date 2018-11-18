package bingo.vkcrm.component.excel;

import java.util.List;
import java.util.Map;

/**
 * Created by Wangzr on 16/3/4.
 */
public interface IDataQuerier {

    List<Map<String, Object>> queryPage(String var1, String var2, int var3, int var4, String var5, Map<String, Object> var6);

    int queryTotal(String var1, String var2, String var3, Map<String, Object> var4);

    Map<String, Object> querySum(String var1, String var2, Map<String, Object> var3);

    List<Map<String, Object>> queryAll(String var1, String var2, Map<String, Object> var3);
}
