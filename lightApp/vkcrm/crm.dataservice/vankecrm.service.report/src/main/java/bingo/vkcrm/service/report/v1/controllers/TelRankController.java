package bingo.vkcrm.service.report.v1.controllers;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.exceptions.EmptyParameterException;
import bingo.vkcrm.service.report.v1.Version;
import bingo.vkcrm.service.report.v1.services.TelRankService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 话务排行榜
 */
@Controller
@RequestMapping(Version.API_PATH)
public class TelRankController {

    @Autowired
    TelRankService telRankService;

    /**
     * 获取呼出排行榜数据
     *
     * @param rankType 排行榜类型 ? 日 : 月
     * @param skillId  技能组ID
     * @return
     */
    @RequestMapping(value = "/tel/callOut/basic", method = RequestMethod.GET)
    @ResponseBody
    private ServiceResult getTelCallOutBasicRankData(String rankType, String skillId) throws Exception {
        if (StringUtils.isEmpty(rankType)) {
            throw new EmptyParameterException("rankType", "排行榜类型");
        }
        return ServiceResult.succeed(telRankService.getTelCallOutBasicRankData(rankType, skillId));
    }
}
