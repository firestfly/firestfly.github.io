package bingo.vkcrm.service.task.v1.services;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.common.utils.CacheUtil;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.Map;

/**
 * Created by Wangzr on 15/11/4.
 */
@Service
public class HouseService extends BaseService {

    /**
     * 根据项目编码获取项目名称
     * @param code
     * @return
     */
    public String getNameByCode(String code){
        return CacheUtil.get(CachePrefix.HouseCode, code);
    }

}
