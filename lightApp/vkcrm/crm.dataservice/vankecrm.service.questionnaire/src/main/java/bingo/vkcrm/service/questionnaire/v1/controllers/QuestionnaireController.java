package bingo.vkcrm.service.questionnaire.v1.controllers;

import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.exceptions.EmptyParameterException;
import bingo.vkcrm.service.exceptions.NotFoundException;
import bingo.vkcrm.service.exceptions.NotModifyiedException;
import bingo.vkcrm.service.questionnaire.v1.Version;
import bingo.vkcrm.service.questionnaire.v1.model.*;
import bingo.vkcrm.service.questionnaire.v1.services.AnswerService;
import bingo.vkcrm.service.questionnaire.v1.services.QuestionnaireService;
import bingo.vkcrm.service.questionnaire.v1.services.TopicService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 问卷控制器
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class QuestionnaireController extends BaseController {

    @Autowired
    QuestionnaireService questionnaireService;
    @Autowired
    TopicService topicService;
    @Autowired
    AnswerService answerService;

    /**
     * 获取问卷列表
     *
     * @param curPage           当前页
     * @param pageSize          页大小
     * @param subjectName       主题名称
     * @param questionnaireName 问卷名称
     * @param beginDate         开始时间
     * @param endDate           结束时间
     * @param isEnabled         是否启用
     * @return
     */
    @RequestMapping(value = "/questionnaires/{curPage}/{pageSize}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryQuestionnaires(@PathVariable(value = "curPage") int curPage, @PathVariable(value = "pageSize") int pageSize, String subjectName, String questionnaireName, String beginDate, String endDate, String isEnabled) {
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        List<Questionnaire> list = questionnaireService.queryQuestionnaires(subjectName, questionnaireName, beginDate, endDate, isEnabled, page);
        ListResult<Questionnaire> listResult = new ListResult<Questionnaire>(page, list);
        return ServiceResult.succeed(listResult);
    }

    /**
     * 获取问卷
     *
     * @param questionnaireId 问卷编码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/questionnaires/{questionnaireId}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryQuestionnaire(@PathVariable(value = "questionnaireId") String questionnaireId) throws Exception {
        if (StringUtils.isBlank(questionnaireId)) {
            throw new BadRequestException("问卷编码不能为空.");
        }
        Questionnaire questionnaire = questionnaireService.query(questionnaireId);
        if (questionnaire == null) {
            throw new NotFoundException("不存在该问卷.");
        }
        List<Topic> topicList = topicService.queryTopics(questionnaireId);
        questionnaire.setTopicList(topicList);
        return ServiceResult.succeed(questionnaire);
    }

    /**
     * 获取问卷问题列表
     *
     * @param questionnaireId 问卷编码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/questionnaires/{questionnaireId}/topics", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryTopics(@PathVariable(value = "questionnaireId") String questionnaireId) throws Exception {
        if (StringUtils.isBlank(questionnaireId)) {
            throw new BadRequestException("问卷编码不能为空.");
        }
        List<Topic> topicList = topicService.queryTopics4Edit(questionnaireId);
        if (topicList == null || topicList.size() == 0) {
            throw new NotFoundException("不存在问题.");
        }
        return ServiceResult.succeed(topicList);
    }

    /**
     * 新增或修改问卷
     *
     * @param questionnaire 问卷信息
     * @return
     */
    @RequestMapping(value = "/questionnaire", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult saveQuestionnaire(Questionnaire questionnaire) throws Exception {
        if (questionnaire == null) {
            throw new BadRequestException("问卷信息为空.");
        }
        if (!questionnaireService.saveOrUpdateQuestionnaire(questionnaire, getCurrentUser())) {
            throw new NotModifyiedException("操作失败.");
        }
        return ServiceResult.succeed(questionnaire.getId());
    }

    /**
     * 删除问卷
     *
     * @param questionnaireId 问卷编码
     * @return
     */
    @RequestMapping(value = "/questionnaires/{questionnaireId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ServiceResult removeQuestionnaire(@PathVariable(value = "questionnaireId") String questionnaireId) throws Exception {
        if (!questionnaireService.removeQuestionnaire(questionnaireId, getCurrentUser())) {
            throw new NotModifyiedException("删除失败.");
        }
        return ServiceResult.succeed("删除成功.");
    }

    /**
     * 更新问卷状态
     *
     * @param questionnaireId
     * @param status
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/questionnaires/{questionnaireId}/status", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateQuestionnaireStatus(@PathVariable(value = "questionnaireId") String questionnaireId, String status) throws Exception {
        if (StringUtils.isEmpty(status)) {
            throw new EmptyParameterException("status", "问卷状态");
        }
        if (!questionnaireService.updateQuestionnaireStatus(questionnaireId, status, getCurrentUser())) {
            throw new NotModifyiedException("更新失败.");
        }
        return ServiceResult.succeed("更新成功.");
    }

    /**
     * 更新问卷状态
     *
     * @param questionnaireId
     * @param isEnabled
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/questionnaires/{questionnaireId}/enabled", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateQuestionnaireEnabled(@PathVariable(value = "questionnaireId") String questionnaireId, String isEnabled) throws Exception {
        if (StringUtils.isEmpty(isEnabled)) {
            throw new EmptyParameterException("isEnabled", "问卷状态");
        }
        if (!questionnaireService.updateQuestionnaireEnabled(questionnaireId, isEnabled, getCurrentUser())) {
            throw new NotModifyiedException("更新失败.");
        }
        return ServiceResult.succeed("更新成功.");
    }

    /**
     * 获取问卷问题列表
     *
     * @param questionnaireId 问卷编码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/questionnaires/{questionnaireId}/answers/{answerId}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryTopicAndAnswer(@PathVariable(value = "questionnaireId") String questionnaireId, @PathVariable(value = "answerId") String answerId) throws Exception {
        if (StringUtils.isBlank(questionnaireId)) {
            throw new BadRequestException("问卷编码不能为空.");
        } else if (StringUtils.isBlank(questionnaireId)) {
            throw new BadRequestException("答卷编码不能为空.");
        }

        List<TopicAndAnswer> topicAndOptionList = topicService.queryTopicsAndOptions(questionnaireId, answerId);

        return ServiceResult.succeed(topicAndOptionList);
    }
}


