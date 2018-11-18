package bingo.vkcrm.service.questionnaire.v1.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import bingo.vkcrm.common.utils.UUIDUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.questionnaire.v1.Version;
import bingo.vkcrm.service.questionnaire.v1.model.Answer;
import bingo.vkcrm.service.questionnaire.v1.model.ExtractionCustomer;
import bingo.vkcrm.service.questionnaire.v1.services.AnswerService;
import bingo.vkcrm.service.questionnaire.v1.services.QuestionnaireExtractionService;


/**
 * <code>{@link QuestionnaireExtractionController}</code>
 * 客户满意度调查Controller
 *
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 * @version 1.00, 2015-10-26
 * @since JDK 1.6
 */

@Controller
@RequestMapping(value = Version.API_PATH + "/questionnaire")
public class QuestionnaireExtractionController extends BaseController {
    private static final Log log = LogFactory.getLog(QuestionnaireExtractionController.class);

    @Autowired
    QuestionnaireExtractionService questionnaireExtractionService;
    @Autowired
    AnswerService answerService;


    /**
     * 从问卷中抽取一个客户进行问答
     *
     * @param questionnaireId 问卷id
     * @return ServiceResult
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     * @version 1.00, 2015-10-26
     * @since JDK 1.6
     */
    @RequestMapping(value = "/extraction", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult extraction(String questionnaireId) throws Exception {
        log.debug("从问卷中抽取一个客户进行问答");
        // 抽取一个客户
        ExtractionCustomer extractionCustomer = questionnaireExtractionService.extraction(questionnaireId, getCurrentUser().getId());

        if (null != extractionCustomer) {
            // 抽取问卷顺便把客户的答卷推送给前台
            String answerId=UUIDUtil.create();
            Answer answer = answerService.getAnswer(questionnaireId, extractionCustomer.getCustomerId(),
                    extractionCustomer.getHouseId(), extractionCustomer.getProjectId(), extractionCustomer.getHouseName(), extractionCustomer.getProjectName());
            // 李工需求，不完整满意度调查不做记录
            answer.setAnswerItemList(null);
            Map<String, Object> details = new HashMap<String, Object>();
            details.put("customer", extractionCustomer);
            answer.setAnswerId(answerId);
            details.put("answer", answer);
            return ServiceResult.succeed(details);
        } else {
            return new ServiceResult(false, "暂时抽取不到客户");
        }
    }

}
