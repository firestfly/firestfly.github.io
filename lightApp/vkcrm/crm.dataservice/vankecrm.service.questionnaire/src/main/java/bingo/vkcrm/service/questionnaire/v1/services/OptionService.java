package bingo.vkcrm.service.questionnaire.v1.services;

import bingo.dao.Dao;
import bingo.vkcrm.service.questionnaire.v1.model.Option;
import bingo.vkcrm.service.questionnaire.v1.model.TopicOption;
import bingo.vkcrm.service.service.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 选项服务
 */
@Service
public class OptionService extends BaseService {


    /**
     * 查询选项
     *
     * @param topicId 选项编码
     * @return
     */
    public Option query(String topicId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("TopicId", topicId);
        return bizRoDao.queryForObject(Option.class, "sql.select.options", paramsMap);
    }

    /**
     * 查询选项
     *
     * @param topicId 选项编码
     * @return
     */
    public List<TopicOption> queryOptions(String topicId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("TopicId", topicId);
        return bizRoDao.queryForList(TopicOption.class, "sql.select.options", paramsMap);
    }

    /**
     * 查询选项
     *
     * @param topicId 选项编码
     * @return
     */
    public List<TopicOption> queryOptions4Edit(String topicId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("TopicId", topicId);
        return bizRoDao.queryForList(TopicOption.class, "sql.select.options4Edit", paramsMap);
    }

    /**
     * 删除选项（批量）
     *
     * @param optionList 选项集合
     * @return
     */
    public boolean removeOptions(List<Option> optionList) {
        return true;
    }

    /**
     * 删除选项
     *
     * @param optionId 选项编码
     * @return
     */
    public boolean removeOption(String optionId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("OptionId", optionId);
        return bizDao.update("sql.update.option.deleted", paramsMap) > 0;
    }

    /**
     * 保存选项（批量）
     *
     * @param optionList 选项集合
     * @return
     */
    public boolean saveOptions(List<Option> optionList) {
        return true;
    }

    /**
     * 保存选项
     *
     * @param option 选项信息
     * @return
     */
    private boolean saveOption(Option option) {
        return bizDao.insert(option) > 0;
    }

    /**
     * 更新选项
     *
     * @param option 选项信息
     * @return
     */
    private boolean updateOption(Option option) {
        return bizDao.update(option) > 0;
    }

    /**
     * 新增或修改选项
     *
     * @param option 选项信息
     * @return
     */
    public boolean saveOrUpdateOption(Option option) {
        if (StringUtils.isEmpty(option.getId())) {
            option.setId(Dao.getUUID());
            return saveOption(option);
        } else {
            return updateOption(option);
        }
    }
}
