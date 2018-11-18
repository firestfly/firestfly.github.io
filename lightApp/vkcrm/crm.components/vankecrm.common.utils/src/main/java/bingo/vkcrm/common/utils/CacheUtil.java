package bingo.vkcrm.common.utils;

import bingo.vkcrm.common.enums.CachePrefix;
import com.google.gson.Gson;
import org.apache.commons.lang3.time.StopWatch;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.Map;

/**
 * Created by Wangzr on 15/12/28.
 */
public class CacheUtil {

    private static final Log log = LogFactory.getLog(CacheUtil.class);

    private static StopWatch startWatch() {
        StopWatch watch = new StopWatch();
        watch.start();
        return watch;
    }

    private static void stopWatch(String cacheKey, String cacheVal, StopWatch watch) {
        watch.stop();
        log.debug("[CacheUtil]获取缓存key:" + cacheKey + " value:" + cacheVal + " 耗时:" + watch.toString());
    }

    public static <T> T get(Class<T> clazz, CachePrefix prefix, String key) {
        String val = CacheUtil.get(prefix, key);
        return new Gson().fromJson(val, clazz);
    }

    public static Map<String, String> getObj(CachePrefix prefix, String key){
        return CacheUtil.get(Map.class, prefix, key);
    }

    public static String getObjField(CachePrefix prefix, String key, String field){
        Map<String, String> obj = CacheUtil.get(Map.class, prefix, key);
        if(obj == null){
            return "";
        }
        if(obj.containsKey(field)){
            return obj.get(field);
        } else {
            return "";
        }
    }

    private static String get(String cacheKey) {
        StopWatch watch = startWatch();
        String val = JedisUtil.cacheDb().get(cacheKey);
        stopWatch(cacheKey, val, watch);
        return val == null ? "" : val;
    }

    public static String get(CachePrefix prefix, String key) {
        return CacheUtil.get(prefix.getVal() + "_" + key);
    }

    private static void set(String cacheKey, String cacheVal) {
        JedisUtil.cacheDb().set(cacheKey, cacheVal);
    }

    public static void set(CachePrefix prefix, String key, String val) {
        CacheUtil.set(prefix.getVal() + "_" + key, val);
    }

    /**
     * @param prefix
     * @param key
     * @param val
     * @param expire_s 过期时间(秒)
     */
    public static void set(CachePrefix prefix, String key, String val, Integer expire_s) {
        JedisUtil.cacheDb().set(prefix + "_" + key, val, expire_s);
    }

    /**
     * 获取Redis的Set的所有数据
     *
     * @param prefix 前缀
     * @param key    关键字
     * @return
     */
    public static String[] smembers(CachePrefix prefix, String key) {
        StopWatch watch = startWatch();
        String cacheKey = prefix.getVal() + "_" + key;
        String[] vals = JedisUtil.cacheDb().smembers(cacheKey);
        stopWatch(cacheKey, new Gson().toJson(vals), watch);
        return vals == null ? new String[0] : vals;
    }
}
