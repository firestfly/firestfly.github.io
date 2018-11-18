package bingo.vkcrm.service.questionnaire.v1.services;

import bingo.dao.Page;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.questionnaire.v1.model.AnswerCallRecords;
import bingo.vkcrm.service.questionnaire.v1.model.CallRecordCondition;
import bingo.vkcrm.service.questionnaire.v1.model.CallRecordResult;
import bingo.vkcrm.service.service.BaseService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 满意度外呼通话记录服务
 */
@Service
public class CallRecordService extends BaseService {

    /**
     * 添加问卷调查通话记录中间表数据
     *
     * @param answerCallRecords
     * @return
     */
    @Transactional
    public boolean saveAnswerCallRecord(AnswerCallRecords answerCallRecords, User user) {
        //answerCallRecords
        int result = bizDao.insert(answerCallRecords);
        Map<String,Object> maps = new HashMap<String, Object>();
        //当前登录用户Id
        maps.put("creatorIds",user.getId());
        //获取callRecordId
        maps.put("callRecordIds",answerCallRecords.getCallRecordId());
        //添加中间信息 “mid_tel_callreason” 表
        bizDao.insert("sql-insert-tel-callreason",maps);
        return result > 0;
    }

    /**
     * 查询
     *
     * @param callRecordCondition
     * @return
     */
    public List<CallRecordResult> getCallRerord(CallRecordCondition callRecordCondition, Page page) {
        List<CallRecordResult> list = bizRoDao.queryForListPage(CallRecordResult.class, page, "sql-query-callRecord", null, callRecordCondition, true);

        // 判断通话原因字符长度
        // for (CallRecordResult callRecordResult : list) {
        //     //判断任务单号长度
        //     if (StringUtils.isNotEmpty(callRecordResult.getTasks())) {
        //         // 长度默认20个字符
        //         if (callRecordResult.getTasks().length() > 20) {
        //             // 大于20个字符的截取前20个，TaskAll存放全部
        //             callRecordResult.setTaskAll(callRecordResult.getTasks());
        //             callRecordResult.setTasks(callRecordResult.getTasks().substring(0, 18) + "...");
        //         } else {
        //             callRecordResult.setTaskAll(callRecordResult.getTasks());
        //         }
        //     }
//            //设置挂机方文本
//            if (StringUtils.isNotEmpty(callRecordResult.getHangUp())) {
//                String hangUp = callRecordResult.getHangUp();
//                if (("1").equalsIgnoreCase(hangUp)) {
//                    callRecordResult.setHangUp("员工挂机");
//                } else if (("0").equalsIgnoreCase(hangUp)) {
//                    callRecordResult.setHangUp("客户挂机");
//                } else {
//                    callRecordResult.setHangUp("未知");
//                }
//            } else {
//                callRecordResult.setHangUp("未知");
//            }
//
//            //设置是否完成调查
//            if (StringUtils.isNotEmpty(callRecordResult.getCompleted())) {
//                String completed = callRecordResult.getCompleted();
//                if (("1").equalsIgnoreCase(completed)) {
//                    callRecordResult.setCompleted("是");
//                } else if (("0").equalsIgnoreCase(completed)) {
//                    callRecordResult.setCompleted("否");
//                } else {
//                    callRecordResult.setCompleted("未知");
//                }
//            } else {
//                callRecordResult.setCompleted("未知");
//            }

        // }
        return list;
    }

}
