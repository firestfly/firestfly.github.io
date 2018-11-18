package bingo.vkcrm.service.questionnaire.v1.controllers;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.exceptions.NotModifyiedException;
import bingo.vkcrm.service.questionnaire.v1.Version;
import bingo.vkcrm.service.questionnaire.v1.model.TopicOption;
import bingo.vkcrm.service.questionnaire.v1.services.OptionService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 选项控制器
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class OptionController extends BaseController {
    @Autowired
    OptionService optionService;

    /**
     * 新增或者修改选项
     *
     * @param topicId     题目编码
     * @param topicOption 选项信息
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/option", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult saveOption(TopicOption topicOption) throws Exception {
        if (StringUtils.isEmpty(topicOption.getTopicId())) {
            throw new BadRequestException("题目编码为空.");
        }
        if (topicOption == null) {
            throw new BadRequestException("选项信息为空.");
        }
        if (!optionService.saveOrUpdateOption(topicOption)) {
            throw new NotModifyiedException("操作失败.");
        }
        return ServiceResult.succeed(topicOption.getId());
    }

    /**
     * 删除选项
     *
     * @param optionId 选项编码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/options/{optionId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ServiceResult deleteOption(@PathVariable(value = "optionId")String optionId) throws Exception {
        if (StringUtils.isEmpty(optionId)) {
            throw new BadRequestException("选项编码为空.");
        }
        if (!optionService.removeOption(optionId)) {
            throw new NotModifyiedException("删除失败.");
        }
        return ServiceResult.succeed("删除成功.");
    }
}
