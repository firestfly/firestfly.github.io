package bingo.vkcrm.service.questionnaire.v1.controllers;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.exceptions.NotFoundException;
import bingo.vkcrm.service.exceptions.NotModifyiedException;
import bingo.vkcrm.service.questionnaire.v1.Version;
import bingo.vkcrm.service.questionnaire.v1.model.Topic;
import bingo.vkcrm.service.questionnaire.v1.model.TopicOption;
import bingo.vkcrm.service.questionnaire.v1.services.OptionService;
import bingo.vkcrm.service.questionnaire.v1.services.TopicService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * 题目控制器
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class TopicController extends BaseController {

    @Autowired
    TopicService topicService;
    @Autowired
    OptionService optionService;

    /**
     * 获取问题选项列表
     *
     * @param topicId 题目编码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/topics/{topicId}/options", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryOptions(@PathVariable(value = "topicId") String topicId) throws Exception {
        List<TopicOption> optionList = optionService.queryOptions4Edit(topicId);
        if (optionList == null || optionList.size() == 0) {
            throw new NotFoundException("不存在选项.");
        }
        return ServiceResult.succeed(optionList);
    }

    /**
     * 新增或修改问题
     *
     * @param topic 问题信息
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/topic", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult saveTopic(Topic topic) throws Exception {
        if (topic == null) {
            throw new BadRequestException("题目不能为空.");
        }
        if (StringUtils.isEmpty(topic.getQuestionnaireId())) {
            throw new BadRequestException("问卷编码不能为空.");
        }
        if (!topicService.saveOrUpdateTopic(topic)) {
            throw new NotModifyiedException("操作失败.");
        }
        return ServiceResult.succeed(topic.getId());
    }

    /**
     * 删除问题
     *
     * @param topicId 问题编码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/topics/{topicId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ServiceResult removeTopic(@PathVariable(value = "topicId")String topicId) throws Exception {
        if (StringUtils.isEmpty(topicId)) {
            throw new BadRequestException("题目编码不能为空.");
        }
        if (!topicService.removeTopic(topicId)) {
            throw new NotModifyiedException("修改失败.");
        }
        return ServiceResult.succeed(topicId);
    }
}
