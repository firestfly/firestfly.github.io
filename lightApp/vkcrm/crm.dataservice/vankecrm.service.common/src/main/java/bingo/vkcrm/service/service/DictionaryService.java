package bingo.vkcrm.service.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import bingo.vkcrm.service.enums.DictionaryCodes;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.stereotype.Service;

import bingo.vkcrm.service.model.DictionaryItem;

/**
 * 数据字典基类,已加缓存
 * 需要修改的配置:
 * 1\spring-cache.xml,增加以下缓存配置:
 * <p>
 * # xmlns:cache="http://www.springframework.org/schema/cache"
 * # http://www.springframework.org/schema/cache http://www.springframework.org/schema/cache/spring-cache.xsd http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd
 * <p>
 * <cache:annotation-driven cache-manager="cacheManager"/>
 * <bean id="cacheManager" class="org.springframework.cache.support.SimpleCacheManager">
 * <property name="caches">
 * <set>
 * <bean class="org.springframework.cache.concurrent.ConcurrentMapCacheFactoryBean" name="dictionaryCache"/>
 * </set>
 * </property>
 * </bean>
 * 2\spring-context.xml,增加清理缓存定时任务
 * <p>
 * # xmlns:task="http://www.springframework.org/schema/task"
 * # http://www.springframework.org/schema/task http://www.springframework.org/schema/task/spring-task-3.0.xsd
 * <p>
 * <task:scheduler id="taskScheduler" pool-size="10"/>
 * <task:annotation-driven scheduler="taskScheduler" mode="proxy"/>
 */
@Service
public class DictionaryService extends BaseService {

    private static final Log log = LogFactory.getLog(DictionaryService.class);
    /**
     * 数据字典缓存
     */
    private static ConcurrentMapCache _cache = new ConcurrentMapCache("dictionaryCache");

    /**
     * 查询所有字典项
     *
     * @return
     */
    private HashMap<String, List<DictionaryItem>> queryAll() {
        List<DictionaryItem> items = centerRoDao.queryForList(DictionaryItem.class, "sql.common.query.dictionaries", null);

        HashMap<String, List<DictionaryItem>> dictionary = new HashMap<String, List<DictionaryItem>>();
        for (DictionaryItem item : items) {
            if (!dictionary.containsKey(item.getDictionaryCode())) {
                dictionary.put(item.getDictionaryCode(), new ArrayList<DictionaryItem>());
            }
            ArrayList<DictionaryItem> array = (ArrayList<DictionaryItem>) dictionary.get(item.getDictionaryCode());
            array.add(item);
            dictionary.put(item.getDictionaryCode(), array);
            log.debug("预加载字典项：" + item.getDictionaryCode() + "-" + item.getCode());
        }

        return dictionary;
    }

    /**
     * 获取特定的数据字典项集合
     *
     * @param codes
     * @return
     */
    public HashMap<String, List<DictionaryItem>> queryAll(String[] codes) {
        return this.queryAll(codes, true);
    }

    /**
     * 获取特定的数据字典项集合
     *
     * @param codes
     * @return
     */
    public HashMap<String, List<DictionaryItem>> queryAll(String[] codes, Boolean filterDeleted) {
        HashMap<String, List<DictionaryItem>> dictionary = new HashMap<String, List<DictionaryItem>>();
        String[] codeMark = new String[0];
        String useIn = null;
        String dictCode = null;
        for (String code : codes) {
            codeMark = code.split("#");
            useIn = null;
            if (codeMark.length == 2) {
                dictCode = codeMark[0];
                useIn = codeMark[1];
            } else {
                dictCode = code;
                useIn = null;
            }
            List<DictionaryItem> src = this.get(dictCode, filterDeleted);
            List<DictionaryItem> dest = new ArrayList<DictionaryItem>(src.size());
            for (DictionaryItem item : src) {
                // 增加使用方,查询参数的使用方为空时,返回所有字典项;如果使用方不为空时,只返回匹配使用方的字典项
                if (StringUtils.isEmpty(useIn) || ArrayUtils.contains(item.getUseInArr(), useIn)) {
                    dest.add(item);
                }
            }
            if (filterDeleted) {
                for (int i = 0; i < dest.size(); i++) {
                    if (dest.get(i).getIsDeleted()) {
                        dest.remove(i);
                        i--;
                    }
                }
            }
            dictionary.put(dictCode, dest);
        }
        return dictionary;
    }

    /**
     * 获取单个字典项
     *
     * @param code
     * @param useIn 使用方
     * @return
     */
    public List<DictionaryItem> get(String code, String useIn) {
        return this.get(code + "#" + useIn, true);
    }

    /**
     * 获取单个字典项
     *
     * @param code
     * @return
     */
    public List<DictionaryItem> get(String code) {
        return this.get(code, true);
    }

    /**
     * 获取单个字典项
     *
     * @param code
     * @return
     */
    public List<DictionaryItem> get(String code, Boolean filterDeleted) {
        String[] codeMark = code.split("#");
        String useIn = null;
        String dictCode = code;
        if (codeMark.length == 2) {
            dictCode = codeMark[0];
            useIn = codeMark[1];
        } else {
            dictCode = code;
            useIn = null;
        }
        String cacheKey = "Dict_".concat(dictCode);
        if (_cache == null) {
            log.error("数据字典未初始化,请检查Spring-Context.xml配置文件的DictionaryCacheInit配置项");
            return new ArrayList<DictionaryItem>(0);
        }
        if (!_cache.getNativeCache().containsKey(cacheKey)) {
            log.error("未找到数据字典" + code + ",请检查该数据字典项是否存在");
            return new ArrayList<DictionaryItem>(0);
        }
        List<DictionaryItem> src = (List<DictionaryItem>) _cache.get(cacheKey).get();
        List<DictionaryItem> dest = new ArrayList<DictionaryItem>(src.size());
        for (DictionaryItem item : src) {
            // 增加使用方,查询参数的使用方为空时,返回所有字典项;如果使用方不为空时,只返回匹配使用方的字典项
            if (StringUtils.isEmpty(useIn) || ArrayUtils.contains(item.getUseInArr(), useIn)) {
                dest.add(item);
            }
        }
        if (filterDeleted) {
            for (int i = 0; i < dest.size(); i++) {
                if (dest.get(i).getIsDeleted()) {
                    dest.remove(i);
                    i++;
                }
            }
        }
        return dest;
    }

    /**
     * 根据字典项的value获取code
     *
     * @param dictionaryCode 字典编码
     * @param itemValue      字典项值
     * @return 字典项编码
     */
    public String getCode(String dictionaryCode, String itemValue) {
        List<DictionaryItem> items = get(dictionaryCode, false);
        for (DictionaryItem item : items) {
            if (item.getValue().equals(itemValue)) {
                return item.getCode();
            }
        }
        return null;
    }

    /**
     * 根据字典的value值，模糊匹配code
     *
     * @param dictionaryCode 字典编码
     * @param itemValue      字典项值
     * @return 字典项编码
     */
    public String getCodeFuzzy(String dictionaryCode, String itemValue) {
        List<DictionaryItem> items = get(dictionaryCode, false);
        if (StringUtils.isNotEmpty(itemValue)) {
            for (DictionaryItem item : items) {
                if (item.getValue().contains(itemValue)) {
                    return item.getCode();
                }
            }
        }
        return null;
    }

    /**
     * 根据字典项的Value获取字典Code
     *
     * @param dictionaryCode 字典类型
     * @param itemValue      字典项的值
     * @return
     */
    public String getCode(DictionaryCodes dictionaryCode, String itemValue) {
        return this.getCode(dictionaryCode.getCode(), itemValue);
    }


    /**
     * 获取单个
     *
     * @param dictionaryCode
     * @param itemCode
     * @return
     */
    public String getValue(String dictionaryCode, String itemCode) {
        if (StringUtils.isEmpty(itemCode)) {
            return "";
        }
        String cacheKey = "Dict_".concat(dictionaryCode).concat("_").concat(itemCode);
        if (_cache.getNativeCache().containsKey(cacheKey)) {
            return _cache.get(cacheKey).get().toString();
        } else {
            return "";
        }
    }

    /**
     * 初始化到缓存
     */
    public void init2Cache() {
        _cache.clear();
        log.info("dictionary cache start");

        HashMap<String, List<DictionaryItem>> dictionaries = this.queryAll();
        for (String dictCode : dictionaries.keySet()) {
            List<DictionaryItem> items = dictionaries.get(dictCode);
            // 缓存整个字典项,Key:Dict_CustomerType
            String dictCodeCache = "Dict_".concat(dictCode);
            _cache.put("Dict_".concat(dictCode), items);
            for (DictionaryItem item : items) {
                // 缓存单个字典项,Key:Dict_CustomerType_1
                _cache.put(dictCodeCache.concat("_").concat(item.getCode()), item.getValue());
            }
        }

        log.info("dictionary cache end");
        log.info("dictionary cached count " + _cache.getNativeCache().keySet().size());
    }

    public int getCacheCount() {
        return _cache.getNativeCache().size();
    }

    /**
     * 定时清空缓存
     */
    public void cleanCache() {
        // 每天6点定时清缓存
        init2Cache();
        log.info("dictionary cache reload");
    }

}
