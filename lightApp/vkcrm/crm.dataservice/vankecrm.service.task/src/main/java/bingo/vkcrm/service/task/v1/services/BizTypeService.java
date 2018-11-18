package bingo.vkcrm.service.task.v1.services;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import org.springframework.stereotype.Service;

/**
 * Created by Wangzr on 15/12/30.
 */
@Service
public class BizTypeService {

    public String getName(String code){
        return CacheUtil.get(CachePrefix.BizType, code);
    }
}
