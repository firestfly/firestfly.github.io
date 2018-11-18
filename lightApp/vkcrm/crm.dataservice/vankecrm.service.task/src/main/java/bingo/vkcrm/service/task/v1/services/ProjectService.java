package bingo.vkcrm.service.task.v1.services;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.common.utils.CacheUtil;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by Wangzr on 15/11/4.
 */
@Service
public class ProjectService extends BaseService {

    /**
     * 根据项目编码获取项目名称
     *
     * @param code
     * @return
     */
    public String getNameByCode(String code) {
        Map<String, String> map = CacheUtil.get(Map.class, CachePrefix.PrjCode, code);
        if (map != null) {
            return map.get("name");
        }
        return null;
    }
}
