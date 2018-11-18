package bingo.vkcrm.service.questionnaire.v1.services;

import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.questionnaire.v1.model.AnomalousCustomer;
import bingo.vkcrm.service.questionnaire.v1.model.AnomalousTags;
import bingo.vkcrm.service.questionnaire.v1.model.Answer;
import bingo.vkcrm.service.questionnaire.v1.model.AnswerItem;
import bingo.vkcrm.service.questionnaire.v1.model.SubscribeCustomer;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.common.utils.UUIDUtil;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 问卷结果服务
 */
@Service
public class AnswerService extends BaseService {

    @Autowired
    QuestionnaireExtractionService extractionService;

    protected final Logger log = LoggerFactory.getLogger(this.getClass());

    /**
     * 保存问卷答案
     *
     * @param answer
     * @return 返回答卷id（新增满意度调查外呼通话记录需要绑定该答卷id）
     */
    public String saveAnswers(Answer answer) {
        //获取问卷中所有问题列表
        List<AnswerItem> list = answer.getAnswerItemList();
        //如果该答卷已经完成，则设置完成时间
        if (answer.getCompleted()) {
            answer.setCompletedTime(new Date());
        }
        //更新答卷数据
        //bizDao.update("sql-update-answer", answer);
        //插入答卷数据
        bizDao.insert("sql-insert-answer",answer);
        //如果有题目信息，则保存
        if (answer.getAnswerItemList() != null && answer.getAnswerItemList().size() > 0) {
            //遍历添加答卷每个题目答案
            for (AnswerItem answerItem : list) {
                if (StringUtils.isNotBlank(answerItem.getTopicId())) {
                    Map<String, Object> params = new HashMap<String, Object>();
                    params.put("answerId", answer.getAnswerId());
                    params.put("topicId", answerItem.getTopicId());
                    params.put("content", answerItem.getContent());
                    bizDao.insert("sql-insert-answerItem", params);
                }
            }
        }
        return answer.getAnswerId();
    }


    /**
     * 根据答卷id获取答卷及题目答案
     *
     * @param questionnaireId
     * @param customerId
     * @param houseId
     * @param projectId
     * @param houseAddress
     * @param projectName
     * @return
     */

    public Answer getAnswer(String questionnaireId, String customerId, String houseId, String projectId, String houseAddress, String projectName) {
        List<AnswerItem> list;
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("questionnaireId", questionnaireId);
        parameters.put("customerId", customerId);
        //获取答卷
        Answer answer = bizDao.queryForObjectQuietly(Answer.class, "sql-query-answer", parameters);
        //获取答卷下所有题目答案
        if (answer != null) {
            list = bizDao.queryForList(AnswerItem.class, "sql-query-answerItem", parameters);
            answer.setAnswerItemList(list);
            return answer;
        } else {
            //若不存在新增一条
            Answer answerSave = new Answer();
            answerSave.setAnswerId(UUIDUtil.create());
            answerSave.setQuestionnaireId(questionnaireId);
            answerSave.setCustomerId(customerId);
            answerSave.setHouseId(houseId);
            answerSave.setHouseAddr(houseAddress);
            answerSave.setProjectName(projectName);
            answerSave.setProjectId(projectId);
            bizDao.insert(answerSave);
            return answerSave;
        }
    }

    /**
     * 保存异常客户
     *
     * @param anomalousCustomer
     * @return
     */
    public boolean saveAnomalousCustomer(AnomalousCustomer anomalousCustomer) {
        //如果异常客户没有设置不接受调查时间区间，则使用该主题的默认不接受调查时长
        if (anomalousCustomer.getEndTime() == null) {
            //根据主题ID获取默认不接受调查时长
            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("subjectId", anomalousCustomer.getSubjectId());
            int month = bizDao.queryForInt("sql-query-anomalousMonths", parameters);
            //如果当前时间没有设置，则使用当前时间
            if (anomalousCustomer.getStartTime() == null) {
                //将开始时间设为当前
                anomalousCustomer.setStartTime(new Date());
            }
            //将开始时间设为当前
            anomalousCustomer.setStartTime(new Date());
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(anomalousCustomer.getStartTime());
            //结束时间在开始时间加上默认不接受调查时长
            calendar.add(Calendar.MONTH, month);
        }

        // 扣减今天完成数
        extractionService.deductionTodayCompleteCount(anomalousCustomer.getQuestionnaireId(), anomalousCustomer.getProjectId(), anomalousCustomer.getHouseId(), anomalousCustomer.getCustomerId());

        int result = bizDao.insert(anomalousCustomer);
        return result > 0;
    }

    /**
     * 保存客户异常标签
     *
     * @param anomalousTags
     * @return
     */
    @Transactional
    public boolean saveAnomalousTags(AnomalousTags anomalousTags, boolean isLast) {

        if (isLast) {
            // 扣减今天完成数
            extractionService.deductionTodayCompleteCount(anomalousTags.getQuestionnaireId(), anomalousTags.getProjectId(), anomalousTags.getHouseId(), anomalousTags.getCustomerId());
        }
        Answer answerSave = new Answer();
        answerSave.setAnswerId(anomalousTags.getAnswerId());
        answerSave.setQuestionnaireId(anomalousTags.getQuestionnaireId());
        answerSave.setCustomerId(anomalousTags.getCustomerId());
        answerSave.setHouseId(anomalousTags.getHouseId());
        answerSave.setProjectId(anomalousTags.getProjectId());
        bizDao.insert(answerSave);

        int result = bizDao.insert(anomalousTags);
        return result > 0;
    }

    /**
     * 保存预约客户
     *
     * @param subscribeCustomer
     * @return
     */
    public boolean saveSubscribeCustomer(SubscribeCustomer subscribeCustomer) throws Exception {
        // 如果预约时间在今天需要将用户插入到预约客户池；如果预约其它天，则扣减今天完成数
        Calendar yesterday = Calendar.getInstance();
        yesterday.set(Calendar.HOUR_OF_DAY, 0);
        yesterday.set(Calendar.MINUTE, 0);
        yesterday.set(Calendar.SECOND, 0);
        yesterday.add(Calendar.DAY_OF_MONTH, 1);

        Calendar scribeTime = Calendar.getInstance();
        scribeTime.setTime(subscribeCustomer.getSubscribeTime());

        if (yesterday.compareTo(scribeTime) > 0) {//添加预约客户到预约队列表
            extractionService.addToSubscribe(subscribeCustomer);
        } else {
            //扣减今天完成数
            extractionService.deductionTodayCompleteCount(subscribeCustomer.getQuestionnaireId(), subscribeCustomer.getProjectId(), subscribeCustomer.getHouseId(), subscribeCustomer.getCustomerId());
        }

        int result = bizDao.insert(subscribeCustomer);
        return result > 0;
    }

    /**
     * 根据答卷id获取答卷及题目答案
     *
     * @param answerId
     * @return
     */
    public Answer getAnswerItem(String answerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("answerId", answerId);
        //获取答卷
        Answer answer = bizDao.queryForObjectQuietly(Answer.class, "sql-query-answer-by-id", parameters);
        //获取答卷下所有题目答案
        if (answer != null) {
            List<AnswerItem> list = bizDao.queryForList(AnswerItem.class, "sql-query-answerItem", parameters);
            answer.setAnswerItemList(list);
            return answer;
        }
        return null;
    }
}
