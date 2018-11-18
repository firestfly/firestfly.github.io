package bingo.vkcrm.service.tel.v1.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bingo.vkcrm.service.common.User;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.dao.Page;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.tel.v1.models.CallRecordCount;
import bingo.vkcrm.service.tel.v1.models.CallRecords;
import bingo.vkcrm.service.tel.v1.models.CallReasonRelation;
import bingo.vkcrm.service.tel.v1.models.TelCallReason;
import bingo.vkcrm.service.tel.v1.models.TelCallRecord;
import bingo.vkcrm.common.utils.UUIDUtil;

/**
 * 通话记录service
 *
 * @author chengsiyuan
 */
@Service
public class TelCallRecordService extends BaseService {

    /**
     * 添加通话记录 添加时只记录来电时间，不记录开始时间和结束时间（此时该通话未开始） 添加后返回该通话记录的id
     *
     * @param telcallrecord
     */
    public String addCallRecord(TelCallRecord telcallrecord) {
        Map<String, Object> params = new HashMap<String, Object>();
        String id = UUIDUtil.create();
        params.put("id", id);
        params.put("callId", telcallrecord.getCallId());
        params.put("recordId", telcallrecord.getRecordId());
        params.put("type", telcallrecord.getType());
        params.put("callNumber", telcallrecord.getCallNumber());
        params.put("callTime", telcallrecord.getCallTime());
        params.put("source", telcallrecord.getSource());
        // 先添加该通话记录
        bizDao.insert("service.telcallrecord.add", params);
        // 再查询出该数据的id返回
//		Map<String, Object> parameters = new HashMap<String, Object>();
//		parameters.put("callId", telcallrecord.getCallId());
//		parameters.put("recordId", telcallrecord.getRecordId());
//		parameters.put("callTime", telcallrecord.getCallTime());
//		TelCallRecord newtelcallrecord = bizRoDao.queryForObject(TelCallRecord.class, "service.telcallrecords", parameters);
        return id;
    }

    /**
     * 更新通话记录
     */
    public void updateCallRecord(String id, Date beginTime, Date endTime, boolean isConnect, User creator, int hangUp) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        // 计算通话
        int duration = 0;
        if (beginTime != null && endTime != null) {
            Long durationlong = (endTime.getTime() - beginTime.getTime()) / 1000;
            duration = durationlong.intValue();
        }
        parameters.put("duration", duration);
        parameters.put("beginTime", beginTime);
        parameters.put("endTime", endTime);
        parameters.put("isConnect", isConnect);
        parameters.put("hangUp", hangUp);
        parameters.put("telephonist", creator.getName());
        parameters.put("telephonistId", creator.getId());
        parameters.put("id", id);
        bizDao.update("service.telcallrecord.update", parameters);
    }

    /**
     * 话务查询
     *
     * @param telephonist
     * @param callNumber
     * @param type
     * @param tapeCode
     * @param hasCheck
     * @param fromDuration
     * @param toDuration
     * @param fromTime
     * @param toTime
     * @return
     */
    public List<CallRecords> getCallRecord(String reasonId, String telephonist, String callNumber, String type, String tapeCode,
                                           Integer hasCheck, Integer fromDuration, Integer toDuration, String fromTime, String toTime, Page page, String taskCode) {
        List<CallRecords> list = new ArrayList<CallRecords>();
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("telephonist", telephonist);
        parameters.put("callNumber", callNumber);
        parameters.put("type", type);
        parameters.put("tapeCode", tapeCode);
        parameters.put("hasCheck", hasCheck);
        parameters.put("fromDuration", fromDuration);
        parameters.put("toDuration", toDuration);
        parameters.put("fromTime", fromTime);
        parameters.put("toTime", toTime);
        parameters.put("reasonId", reasonId);
        parameters.put("taskCode", taskCode);
        list = bizRoDao.queryForListPage(CallRecords.class, page, "service.tel.call.records", null, parameters, true);
        // 判断通话原因字符长度
        for (CallRecords callRecords : list) {
            //设置挂机方文本
            if (StringUtils.isNotEmpty(callRecords.getHangUp())) {
                String HangUp = callRecords.getHangUp();
                if (HangUp.equals("1")) {
                    callRecords.setHangUp("员工挂机");
                } else if (HangUp.equals("0")) {
                    callRecords.setHangUp("客户挂机");
                } else {
                    callRecords.setHangUp("未知");
                }
            }

        }
        return list;
    }

    /**
     * 根据来电号码查询通话记录
     *
     * @param callNumber
     * @return
     */
    public List<TelCallRecord> getTelCallRecord(String callNumber) {
        List<TelCallRecord> list = new ArrayList<TelCallRecord>();
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("callNumber", callNumber);
        list = bizRoDao.queryForList(TelCallRecord.class, TelCallRecord.class, "service.telcallrecords", params);

        return list;
    }


    /**
     * 添加通话记录的通话原因
     */
    public int addCallRecordReason(String callId, String[] reasonIds) {
        // 记录成功插入的记录数
        int result = 0;
        // 遍历数组reasonIds分别添加通话原因
        for (int i = 0; i < reasonIds.length; i++) {
            if (StringUtils.isEmpty(reasonIds[i])) {
                return 0;
            }
            CallReasonRelation midtelcallreason = new CallReasonRelation();
            midtelcallreason.setCallId(callId);
            midtelcallreason.setReasonId(reasonIds[i]);
            i = i + bizDao.insert(midtelcallreason);
        }
        return result;
    }

    /**
     * 根据通话记录ID获取该通话记录所有通话原因，查询结果由逗号隔开
     *
     * @return String
     */
    public List<CallReasonRelation> getCallRecordReason(String callId) {
        Map<String, Object> params = new HashMap<String, Object>();
        List<CallReasonRelation> midtelcallreason = new ArrayList<CallReasonRelation>();
        params.put("callId", callId);
        midtelcallreason = bizRoDao.queryForList(CallReasonRelation.class, CallReasonRelation.class,
                "service.telcallrecord.reason", params);
        return midtelcallreason;
    }

    /**
     * 更新通话记录的通话原因
     *
     * @param recordId
     * @param reasons
     */
    public void update(String recordId, String[] reasons, User loginUser) {
        Date now = new Date();

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("recordId", recordId);

        String[] exists =
                bizDao.queryForList(String.class, "sql.query.callreason.bycallid", parameters).toArray(new String[0]);

        List<CallReasonRelation> deleteds = new ArrayList<CallReasonRelation>();
        List<CallReasonRelation> adds = new ArrayList<CallReasonRelation>();

        // 标记删除
        for (String id : exists) {
            if (!ArrayUtils.contains(reasons, id)) {
                CallReasonRelation item = new CallReasonRelation();
                item.setCallRecordId(recordId);
                item.setReasonId(id);
                item.setIsDeleted(true);
                item.setDeletorId(loginUser.getId());
                item.setDeleteTime(now);
                deleteds.add(item);
            }
        }

        // 新增
        for (String id : reasons) {
            if (!ArrayUtils.contains(exists, id)) {
                CallReasonRelation item = new CallReasonRelation();
                item.setCallRecordId(recordId);
                item.setReasonId(id);
                item.setCreatorId(loginUser.getId());
                item.setCreateTime(now);
                item.setIsDeleted(false);
                adds.add(item);
            }
        }

        bizDao.batchUpdate("sql.delete.callreason.bycallid", deleteds);
        bizDao.batchInsert(CallReasonRelation.class, adds);
    }

    /**
     * 通过数据字典查询通话类型内容
     *
     * @return
     */
    public List<TelCallReason> getType() {
        List<TelCallReason> list = new ArrayList<TelCallReason>();
        list = bizRoDao.queryForList(TelCallReason.class, TelCallReason.class, "service.telcalltype", null);
        return list;
    }

    /**
     * 查询某个时间段内的通话记录统计
     *
     * @param fromTime
     * @param toTime
     * @return
     */
    public CallRecordCount getCallRecordCount(String reasonId, String telephonist, String callNumber, String type, String tapeCode,
                                              Integer hasCheck, Integer fromDuration, Integer toDuration, String fromTime, String toTime) {
        CallRecordCount callrecordcount = new CallRecordCount();
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("telephonist", telephonist);
        parameters.put("callNumber", callNumber);
        parameters.put("type", type);
        parameters.put("tapeCode", tapeCode);
        parameters.put("hasCheck", hasCheck);
        parameters.put("fromDuration", fromDuration);
        parameters.put("toDuration", toDuration);
        parameters.put("fromTime", fromTime);
        parameters.put("toTime", toTime);
        parameters.put("reasonId", reasonId);
        callrecordcount = bizRoDao.queryForObject(CallRecordCount.class, "service.telcallrecord.count", parameters);
        return callrecordcount;
    }

}
