package bingo.vkcrm.service.model;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import bingo.vkcrm.service.enums.DictionaryCodes;
import bingo.vkcrm.service.service.DictionaryService;
import org.apache.commons.lang3.StringUtils;

/**
 * Created by Wangzr on 15/11/23.
 */
public abstract class BaseModel {


    protected DictionaryService dictService = new DictionaryService();

    /**
     * 获取字典项
     * @param dictionaryCode 字典编码
     * @param itemCode 字典项编码
     * @return
     */
    protected String getValue(String dictionaryCode, String itemCode) {
        if(StringUtils.isEmpty(dictionaryCode) || StringUtils.isEmpty(itemCode)){
            return "";
        }
        return dictService.getValue(dictionaryCode, itemCode);
    }

    /**
     * 获取字典项
     * @param dictionaryCode 字典编码
     * @param itemCode 字典项编码
     * @return
     */
    protected String getValue(String dictionaryCode, Integer itemCode){
        if(itemCode == null){
            return "";
        }
        return this.getValue(dictionaryCode, itemCode.toString());
    }

    /**
     * 获取字典项
     *
     * @param dictionaryCode 字典编码
     * @param itemCode       字典项编码
     * @return
     */
    protected String getValue(DictionaryCodes dictionaryCode, Integer itemCode) {
        if (itemCode == null) {
            return "";
        }
        return this.getValue(dictionaryCode.getCode(), itemCode.toString());
    }

    protected String getFromCache(CachePrefix prefix, String key){
        return CacheUtil.get(prefix, key);
    }
}
