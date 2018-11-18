package bingo.vkcrm.service.questionnaire.v1.services;

import bingo.dao.Dao;
import bingo.dao.Page;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.questionnaire.v1.model.Questionnaire;
import bingo.vkcrm.service.questionnaire.v1.model.Topic;
import bingo.vkcrm.service.service.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 问卷服务
 */
@Service
public class QuestionnaireService extends BaseService {
    @Autowired
    TopicService topicService;

    /**
     * 获取问卷
     *
     * @param questionnaireId 问卷编码
     * @return
     */
    public Questionnaire query(String questionnaireId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("QuestionnaireId", questionnaireId);
        return bizRoDao.queryForObject(Questionnaire.class, "sql.select.questionnaire", paramsMap);
    }

    /**
     * 查询问卷（分页）
     *
     * @param subjectName       主题名称
     * @param questionnaireName 问卷名称
     * @param beginDate         开始时间
     * @param endDate           结束时间
     * @param isEnabled         是否启用
     * @param page              分页信息
     * @return
     */
    public List<Questionnaire> queryQuestionnaires(String subjectName, String questionnaireName, String beginDate, String endDate, String isEnabled, Page page) {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("SubjectName", subjectName);
        paramMap.put("QuestionnaireName", questionnaireName);
        paramMap.put("BeginDate", beginDate);
        paramMap.put("EndDate", endDate);
        paramMap.put("IsEnabled", isEnabled);
        return bizRoDao.queryForListPage(Questionnaire.class, page, "sql.select.questionnaires", "", paramMap, true);
    }

    /**
     * 保存问卷
     *
     * @param questionnaire 问卷信息
     * @return
     */
    public boolean saveOrUpdateQuestionnaire(Questionnaire questionnaire, User user) {
        if (StringUtils.isEmpty(questionnaire.getId())) {
            questionnaire.setId(Dao.getUUID());
            questionnaire.setCreateTime(new Date());
            questionnaire.setCreatorId(user.getId());
            return saveQuestionnaire(questionnaire);
        } else {
            questionnaire.setModifyTime(new Date());
            questionnaire.setModifierId(user.getId());
            return updateQuestionnaire(questionnaire);
        }
    }

    /**
     * 新增问卷
     *
     * @param questionnaire 问卷信息
     * @return
     */
    private boolean saveQuestionnaire(Questionnaire questionnaire) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        if (null != questionnaire) {
            paramsMap.put("id",questionnaire.getId());
            paramsMap.put("subjectId", questionnaire.getSubjectId());
            paramsMap.put("title", questionnaire.getTitle());
            paramsMap.put("sampleRatio", questionnaire.getSampleRatio());
            paramsMap.put("annualCompleteRate", questionnaire.getAnnualCompleteRate());
            paramsMap.put("beginTime", questionnaire.getBeginTime());
            paramsMap.put("endTime", questionnaire.getEndTime());
            paramsMap.put("delayTime", questionnaire.getDelayTime());
            paramsMap.put("description", questionnaire.getDescription());
            paramsMap.put("enabled", questionnaire.getIsEnabled() == true ? "1" : "0");
            paramsMap.put("status", questionnaire.getStatus() == true ? "1" : "0");
            paramsMap.put("creatorId",questionnaire.getCreatorId());
            paramsMap.put("excludeSpecialIdentities",questionnaire.getExcludeSpecialIdentities());
        }
        return bizDao.insert("sql.insert.questionnaire", paramsMap) > 0;
    }

    /**
     * 修改问卷
     *
     * @param questionnaire 问卷信息
     * @return
     */
    private boolean updateQuestionnaire(Questionnaire questionnaire) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        if (null != questionnaire) {
            paramsMap.put("id",questionnaire.getId());
            paramsMap.put("subjectId", questionnaire.getSubjectId());
            paramsMap.put("title", questionnaire.getTitle());
            paramsMap.put("sampleRatio", questionnaire.getSampleRatio());
            paramsMap.put("annualCompleteRate", questionnaire.getAnnualCompleteRate());
            paramsMap.put("beginTime", questionnaire.getBeginTime());
            paramsMap.put("endTime", questionnaire.getEndTime());
            paramsMap.put("delayTime", questionnaire.getDelayTime());
            paramsMap.put("description", questionnaire.getDescription());
            paramsMap.put("enabled", questionnaire.getIsEnabled() == true ? "1" : "0");
            paramsMap.put("modifierId",questionnaire.getModifierId());
            paramsMap.put("excludeSpecialIdentities",questionnaire.getExcludeSpecialIdentities());
        }
        return bizDao.update("sql.update.questionnaire", paramsMap) > 0;
    }

    /**
     * 删除问卷（根据问卷编码）
     *
     * @param questionnaireId
     * @return
     */
    public boolean removeQuestionnaire(String questionnaireId, User user) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("QuestionnaireId", questionnaireId);
        paramsMap.put("UserId", user.getId());
        return bizDao.delete("sql.update.questionnaire.deleted", paramsMap) > 0;
    }

    /**
     * 更新问卷状态(根据问卷编码)
     *
     * @param questionnaireId
     * @param status
     * @param user
     * @return
     */
    public boolean updateQuestionnaireStatus(String questionnaireId, String status, User user) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("QuestionnaireId", questionnaireId);
        paramsMap.put("Status", status);
        paramsMap.put("UserId", user.getId());
        return bizDao.delete("sql.update.questionnaire.status", paramsMap) > 0;
    }

    /**
     * 更新问卷状态(根据问卷编码)
     *
     * @param questionnaireId
     * @param isEnabled
     * @param user
     * @return
     */
    public boolean updateQuestionnaireEnabled(String questionnaireId, String isEnabled, User user) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("QuestionnaireId", questionnaireId);
        paramsMap.put("IsEnabled", isEnabled);
        paramsMap.put("UserId", user.getId());
        return bizDao.delete("sql.update.questionnaire.enabled", paramsMap) > 0;
    }

    /**
     * 新增题目
     *
     * @param questionnaireId 问卷编码
     * @param topicList       题目集合
     * @return
     */
    public boolean addQuestionTopic(String questionnaireId, List<Topic> topicList) {
        return true;
    }

    /**
     * 删除题目
     *
     * @param questionnaireId 问卷编码
     * @param topicList       题目集合
     * @return
     */
    public boolean removeQuestionTopic(String questionnaireId, List<Topic> topicList) {
        return true;
    }

}
