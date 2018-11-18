package bingo.vkcrm.service.questionnaire.v1.controllers;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.questionnaire.v1.Version;
import bingo.vkcrm.service.questionnaire.v1.model.*;
import bingo.vkcrm.service.questionnaire.v1.services.AnswerService;

import java.util.Date;

import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.questionnaire.v1.services.QuestionnaireExtractionService;
import bingo.vkcrm.service.questionnaire.v1.services.SubjectService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 问卷结果控制器
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class AnswerController extends BaseController {

    @Autowired
    AnswerService service;

    @Autowired
    SubjectService subjectService;

    @Autowired
    QuestionnaireExtractionService extractionService;

//    /**
//     * 保存问卷
//     * @param answer
//     * return 返回新增的答卷Id
//     * @throws Exception
//     */
//    @RequestMapping(value = "/answer", method = RequestMethod.POST)
//    @ResponseBody
//    public ServiceResult saveAnswer(Answer answer) throws Exception {
//    	if(answer == null){
//    		throw new BadRequestException("参数错误!");
//    	}
//    	if(StringUtils.isEmpty(answer.getAnswerId())){
//    		throw new BadRequestException("答卷id为空!");
//    	}
//    	String answerId = service.saveAnswers(answer);
//        return ServiceResult.succeed(answerId);
//    }

//    /**
//     * 根据问卷id、客户id获取答卷内容（已经整合到客户抽取里面去）
//     * @param answerId
//     * @return Answer
//     * @throws Exception
//     */
//    @RequestMapping(value = "/answer/get", method = RequestMethod.GET)
//    @ResponseBody
//    public ServiceResult getAnswer(String questionnaireId ,String customerId) throws Exception {
//    	if(questionnaireId == null || StringUtils.isBlank(questionnaireId)){
//    		throw new BadRequestException("问卷Id不能为空!");
//    	}
//    	Answer answer = service.getAnswer(questionnaireId,customerId);
//    	return ServiceResult.succeed(answer);
//    }

    /**
     * 保存答卷/问卷调查已接通异常保存(也需要保存答卷，如果完成部分题目，也需进行保存)
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/connectedAnswer", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult saveConnectedAnswer(AnswerSave answerSave) throws Exception {
        // 新增结果
        boolean addResult = false;
        // 更新问卷返回问卷的id
        String updateResult = null;
        // 整个操作结果
        boolean result = false;
        Answer answer = new Answer();
        if (StringUtils.isEmpty(answerSave.getAnswerId())) {
            throw new BadRequestException("答卷id为空!");
        }
        if (StringUtils.isEmpty(answerSave.getCustomerId())) {
            throw new BadRequestException("客户id为空!");
        }

        if (answerSave.getAbnormalCode() == 1) {
            // 拒绝接受调查的客户异常(abnormalCode等于1时)

            if (StringUtils.isBlank(answerSave.getSubjectId())) {
                throw new BadRequestException("主题Id不能为空!");
            }

            Subject subject = subjectService.get(answerSave.getSubjectId());
            if (subject == null) {
                throw new BadRequestException("当前问卷没有所属主题");
            }

            AnomalousCustomer anomalousCustomer = new AnomalousCustomer();
            anomalousCustomer.setCtime(new Date());
            anomalousCustomer.setCuid(getCurrentUser().getId());
            anomalousCustomer.setStartTime(answerSave.getStartTime());
            anomalousCustomer.setEndTime(DateUtils.addMonths(answerSave.getStartTime(), subject.getAnomalousMonths()));
            anomalousCustomer.setCustomerId(answerSave.getCustomerId());
            anomalousCustomer.setSubjectId(answerSave.getSubjectId());
            anomalousCustomer.setHouseId(answerSave.getHouseId());
            anomalousCustomer.setAnomalousType(answerSave.getAbnormalCode());
            anomalousCustomer.setQuestionnaireId(answerSave.getQuestionnaireId());
            anomalousCustomer.setProjectId(answerSave.getProjectId());

            service.saveAnomalousCustomer(anomalousCustomer);

        } else if (answerSave.getAbnormalCode() == 2) {
            // 预约时间的客户异常（abnormalCode等于2时）

            if (StringUtils.isBlank(answerSave.getQuestionnaireId()) || StringUtils.isBlank(answerSave.getHouseId()) || answerSave.getSubscribeTime() == null) {
                throw new BadRequestException("问卷Id、房屋Id和预约时间不能为空!");
            }

            SubscribeCustomer subscribeCustomer = new SubscribeCustomer();
            subscribeCustomer.setSubscribeTime(answerSave.getSubscribeTime());
            subscribeCustomer.setCTime(new Date());
            subscribeCustomer.setCustomerId(answerSave.getCustomerId());
            subscribeCustomer.setHouseId(answerSave.getHouseId());
            subscribeCustomer.setProjectId(answerSave.getProjectId());
            subscribeCustomer.setQuestionnaireId(answerSave.getQuestionnaireId());
            subscribeCustomer.setTelephonistId(getCurrentUser().getId());

            service.saveSubscribeCustomer(subscribeCustomer);

        } else if (!answerSave.isCompleted()) {

            extractionService.deductionTodayCompleteCount(answerSave.getQuestionnaireId(), answerSave.getProjectId(), answerSave.getHouseId(), answerSave.getCustomerId());
            // 未完成则没有完成时间
            answer.setCompletedTime(null);
        }
        answer.setCompleted(answerSave.isCompleted());
        answer.setAnswerId(answerSave.getAnswerId());
        answer.setAbnormalCode(answerSave.getAbnormalCode());
        answer.setAbnormalContent(answerSave.getAbnormalContent());
        answer.setAnswerItemList(answerSave.getAnswerItemList());
        answer.setCustomerId(answerSave.getCustomerId());
        answer.setProjectId(answerSave.getProjectId());
        answer.setQuestionnaireId(answerSave.getQuestionnaireId());
        answer.setHouseId(answerSave.getHouseId());
        answer.setCustomerId(answerSave.getCustomerId());
        // 保存答卷
        updateResult = service.saveAnswers(answer);
        if (StringUtils.isNotEmpty(updateResult)) {
            result = true;
        }
        return ServiceResult.succeed(result);
    }

    /**
     * 问卷调查未接通异常保存
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/notconnectederro", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult saveNotConnectedError(AnomalousTags anomalousTags, boolean isLast) throws Exception {
        if (anomalousTags == null) {
            throw new BadRequestException("参数错误!");
        }
        anomalousTags.setCtime(new Date());
        boolean result = service.saveAnomalousTags(anomalousTags, isLast);
        return ServiceResult.succeed(result);
    }
}
