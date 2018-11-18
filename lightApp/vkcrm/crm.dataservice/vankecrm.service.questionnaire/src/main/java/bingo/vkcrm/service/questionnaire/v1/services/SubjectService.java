package bingo.vkcrm.service.questionnaire.v1.services;

import bingo.vkcrm.service.questionnaire.v1.model.Subject;
import bingo.vkcrm.service.service.BaseService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 主题服务
 */
@Service
public class SubjectService extends BaseService {

    public Subject get(String id) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("subjectId", id);
        return bizRoDao.queryForObject(Subject.class, "sql.subject.get", parameters);
    }
}
