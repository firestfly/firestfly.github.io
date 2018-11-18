package bingo.vkcrm.service.tel.v1.services;

import bingo.vkcrm.service.service.BaseService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Wanger on 15/11/12.
 */
@Service
public class RecordTapeService extends BaseService {

    /**
     * 获取录音文件地址
     * @param recordId 录音文件id
     * @return
     */
    public String getFilePath(String recordId){
        String sql = "sql.get.tape.byid";
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("recordId", recordId);
        return bizRoDao.queryForStringQuietly(sql, parameters);
    }

}
