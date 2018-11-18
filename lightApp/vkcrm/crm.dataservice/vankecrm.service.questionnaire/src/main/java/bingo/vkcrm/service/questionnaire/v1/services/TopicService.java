package bingo.vkcrm.service.questionnaire.v1.services;

import bingo.dao.Dao;
import bingo.vkcrm.service.exceptions.NotFoundException;
import bingo.vkcrm.service.questionnaire.v1.model.*;
import bingo.vkcrm.service.service.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Map.Entry;

/**
 * 题目服务
 */
@Service
public class TopicService extends BaseService {

    @Autowired
    OptionService optionService;

    @Autowired
    AnswerService answerService;

    /**
     * 查询题目列表
     *
     * @param questionnaireId 问卷编码
     * @return
     */
    public List<Topic> queryTopics(String questionnaireId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("QuestionnaireId", questionnaireId);
        List<Topic> topicList = bizRoDao.queryForList(Topic.class, "sql.select.topics", paramsMap);
        for (Topic topic : topicList) {
            List<TopicOption> optionList = optionService.queryOptions(topic.getId());
            topic.setOptionList(optionList);
        }
        return topicList;
    }

    /**
     * 查询题目列表
     *
     * @param questionnaireId 问卷编码
     * @return
     */
    public List<Topic> queryTopics4Edit(String questionnaireId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("QuestionnaireId", questionnaireId);
        List<Topic> topicList = bizRoDao.queryForList(Topic.class, "sql.select.topics", paramsMap);
        for (Topic topic : topicList) {
            List<TopicOption> optionList = optionService.queryOptions4Edit(topic.getId());
            topic.setOptionList(optionList);
        }
        return topicList;
    }

    /**
     * 新增或修改问题
     *
     * @param topic 问题信息
     * @return
     */
    public boolean saveOrUpdateTopic(Topic topic) {
        if (StringUtils.isEmpty(topic.getId())) {
            topic.setId(Dao.getUUID());
            return saveTopic(topic);
        } else {
            return updateTopic(topic);
        }
    }

    /**
     * 保存题目
     *
     * @param topic 题目信息
     * @return
     */
    private boolean saveTopic(Topic topic) {
        return bizDao.insert(topic) > 0;
    }

    /**
     * 保存题目（批量）
     *
     * @param topicList
     * @return
     */
    public boolean saveTopics(List<Topic> topicList) {
        return true;
    }

    /**
     * 删除题目
     *
     * @param topicId 题目编码
     * @return
     */
    public boolean removeTopic(String topicId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("TopicId", topicId);
        return bizDao.update("sql.update.topic.deleted", paramsMap) > 0;
    }

    /**
     * 删除题目（批量）
     *
     * @param topicList 题目集合
     * @return
     */
    public boolean remogeTopics(List<Topic> topicList) {
        return true;
    }

    /**
     * 更新题目
     *
     * @param topic 题目信息
     * @return
     */
    private boolean updateTopic(Topic topic) {
        return bizDao.update(topic) > 0;
    }

    /**
     * 查询并处理题目及选项
     * 思路:
     * 1.通过questionnaireId找到对应的所有题目和选项
     * 2.通过answerId找到对应的answerItem
     * 3.匹配1和2,得出结果.
     *
     * @param questionnaireId 问卷编码
     * @param answerId        答卷编码
     * @return
     */
    public List<TopicAndAnswer> queryTopicsAndOptions(String questionnaireId, String answerId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("QuestionnaireId", questionnaireId);
        List<TopicAndOption> topicAndOptionList = bizRoDao.queryForList(TopicAndOption.class, "sql.select.topics.options", paramsMap);//通过问卷id获取该问卷下的题目和选项
        List<TopicAndAnswer> topicAndAnswerList = new ArrayList<TopicAndAnswer>();//存储题目和答案,前端只需用avalon直接输出即可,无需做数据转换处理.
        Map<String, TopicAndAnswer> topicAndAnswerMap = new HashMap<String, TopicAndAnswer>();
        if (topicAndOptionList != null && !topicAndOptionList.isEmpty()) {
            Answer answer = answerService.getAnswerItem(answerId);//通过答案id获取对应的所有answer-item
            if (answer != null) {
                List<AnswerItem> answerItemList = answer.getAnswerItemList();//获取answer-items
                Map<String, String> map = new HashMap<String, String>(answerItemList.size());//指定map大小,避免扩容

                if (answerItemList != null) {
                    for (AnswerItem item : answerItemList) {//答案信息存入map提高效率,从n^2降到 nlogn;
                        String[] optionIdAndSupply = item.getContent().split(";");//分号分隔每一个选项及其补充内容.
                        for (String oias : optionIdAndSupply) {//若是多选题,则该循环会走多次.
                            String optionId = oias.split("[|]")[0];//竖杠的作用是分隔答案和补充内容,如: "答案|补充内容"
                            map.put(optionId, oias);//分隔后,将唯一的optionId存入map待会用.
                        }
                    }
                }

                for (TopicAndOption tao : topicAndOptionList) {//将题目和答案匹配在一起,存入TopicAndAnswer中.从根据问卷id获取到的题目和选项与map进行匹配.找出对应的题目和答案
                    String optionId = tao.getOptionId();
                    String optionIdAndSupply = map.get(optionId);
                    if (optionIdAndSupply != null) {
                        String topicId = tao.getTopicId();
                        TopicAndAnswer taa = topicAndAnswerMap.get(topicId);
                        if (taa == null) {
                            taa = new TopicAndAnswer();
                            taa.setCustomerName(answer.getCustomerName());
                            taa.setSequence(tao.getTopicSequence());
                            taa.setTitle(tao.getTitle());
                        }

                        String[] optionIdAndSupplyArr = optionIdAndSupply.split("[|]");//竖杠的作用是分隔答案和补充内容,如: "答案|补充内容"
//                        String contentId = optionIdAndSupplyArr[0];
                        String supply = optionIdAndSupplyArr.length > 1 ? optionIdAndSupplyArr[1] : "";//如果有补充内容

                        AnswerAndSupply answerAndSupply = new AnswerAndSupply(tao.getOptionSequence() + "." + tao.getContent(), supply);

                        taa.addAnswerAndSupplys(answerAndSupply);

                        topicAndAnswerMap.put(topicId, taa);
                    }
                }
            }
        }
        Set<Entry<String, TopicAndAnswer>> entrySet = topicAndAnswerMap.entrySet();
        for (Entry<String, TopicAndAnswer> entry : entrySet) {
            TopicAndAnswer taa = entry.getValue();
            taa.buildContentToBeShown();
            topicAndAnswerList.add(taa);
        }
        Collections.sort(topicAndAnswerList);
//        for (TopicAndAnswer taa : topicAndAnswerList) {
//            System.out.println(taa.toString());
//        }
        return topicAndAnswerList;
    }
}
