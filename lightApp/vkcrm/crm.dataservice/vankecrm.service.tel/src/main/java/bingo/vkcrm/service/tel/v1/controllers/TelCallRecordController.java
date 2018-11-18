package bingo.vkcrm.service.tel.v1.controllers;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import bingo.vkcrm.service.common.User;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.EmptyParameterException;
import bingo.vkcrm.service.tel.v1.models.CallRecordCount;
import bingo.vkcrm.service.tel.v1.models.CallRecords;
import bingo.vkcrm.service.tel.v1.models.CallReasonRelation;
import bingo.vkcrm.service.tel.v1.models.TelCallReason;
import bingo.vkcrm.service.tel.v1.models.TelCallRecord;
import bingo.vkcrm.service.tel.v1.services.TelCallRecordService;

/**
 * 通话记录controller
 */
@Controller
@RequestMapping("api/v1/telrecord")
public class TelCallRecordController extends BaseController {

    @Autowired
    TelCallRecordService service;

    private static final Log log = LogFactory.getLog(TelCallRecordController.class);

    /**
     * modified by liaochao 20160128 :新增taskCode参数
     * 话务查询
     *
     * @param fromTime     查询时间段开始时间
     * @param toTime       查询时间段结束时间
     * @param fromDuration 查询通话时长最小值
     * @param toDuration   查询通话时长最大值
     * @param type         通话类型 int
     * @param callNumber   来电号码
     * @param telephonist  话务员姓名
     * @param tapeCode     流水号
     * @param hasCheck     是否质检 Boolean
     * @return
     */
    @RequestMapping(value = "/callrecords/get", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getCallRecords(String reasonId, String fromTime, String toTime, Integer fromDuration, Integer toDuration, String type, String callNumber,
                                        String telephonist, String tapeCode, Integer hasCheck, int curPage, int pageSize, String taskCode) {
        List<CallRecords> list = new ArrayList<CallRecords>();

        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        try {
            list = service.getCallRecord(reasonId, telephonist, callNumber, type, tapeCode, hasCheck, fromDuration, toDuration, fromTime, toTime, page, taskCode);
            ListResult<CallRecords> listResult = new ListResult<CallRecords>(page, list);
            return ServiceResult.succeed(listResult);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(this, e);
            return ServiceResult.error(e);
        }


    }

    /**
     * 通过来电号码查询该号码历史通话记录
     *
     * @param callNumber 来电号码
     * @return
     */
    @RequestMapping(value = "/telcallrecord/get", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getTelCallRecord(String callNumber) {
        List<TelCallRecord> list = new ArrayList<TelCallRecord>();
        try {
            list = service.getTelCallRecord(callNumber);
            return ServiceResult.succeed(list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(this, e);
            return ServiceResult.error(e);
        }
    }

    /**
     * 添加通话记录
     * 来电时调用，此时通话未开始
     *
     * @param telcallrecord 通话记录对象
     * @return
     */
    @RequestMapping(value = "/callrecord/add", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addTelCallRecord(TelCallRecord telcallrecord) {

        try {
            if (telcallrecord == null) {
                throw new EmptyParameterException("telcallrecord", "无参数");
            }
            if (telcallrecord.getType() == null) {
                throw new EmptyParameterException("type", "类型设置错误");
            }
            if (telcallrecord.getCallId() == null) {
                throw new EmptyParameterException("CallId", "CallId");
            }
            if (telcallrecord.getRecordId() == null) {
                throw new EmptyParameterException("RecordId", "流水号");
            }
            if (telcallrecord.getSource() == null) {
                telcallrecord.setSource(1);
            }
            String id = service.addCallRecord(telcallrecord);
            return ServiceResult.succeed(id);
        } catch (Throwable e) {
            e.printStackTrace();
            log.error(this, e);
            return ServiceResult.error(e);
        }
    }

    /**
     * 更新通话记录
     * 通话结束后调用，返回通话结束时间，该通话记录添加完整
     *
     * @param telcallrecord 通话记录对象
     * @param hangUp        挂机方，0、客户挂机, 1、员工挂机
     * @return
     */
    @RequestMapping(value = "/callrecord/update", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateTelCallRecord(String id, String beginTime, String endTime, boolean isConnect, Integer hangUp) {

        Date begin = null;
        Date end = null;
        try {
            if (StringUtils.isEmpty(id)) {
                throw new EmptyParameterException("id", "id为空");
            }
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            if (StringUtils.isNotEmpty(beginTime)) {
                begin = format.parse(beginTime);
            }
            if (StringUtils.isNotEmpty(endTime)) {
                end = format.parse(endTime);
            }

            User loginUser = getCurrentUser();
            service.updateCallRecord(id, begin, end, isConnect, loginUser, hangUp);
            return ServiceResult.succeed(null);
        } catch (Throwable e) {
            e.printStackTrace();
            log.error(this, e);
            return ServiceResult.error(e);
        }
    }

    /**
     * 查询某个时间段内的话务统计
     *
     * @param fromTime 查询时间段起始时间
     * @param toTime   结束时间
     * @return
     */
    @RequestMapping(value = "/callrecord/count", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getTelCallRecordCount(String reasonId, String fromTime, String toTime, Integer fromDuration, Integer toDuration,
                                               String type, String callNumber, String telephonist, String tapeCode, Integer hasCheck) {
        try {
            CallRecordCount callrecordcount = service.getCallRecordCount(reasonId, telephonist, callNumber, type, tapeCode, hasCheck, fromDuration, toDuration, fromTime, toTime);
            return ServiceResult.succeed(callrecordcount);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(this, e);
            return ServiceResult.error(e);
        }
    }

    /**
     * 获取通话记录的通话原因
     *
     * @param code 通话记录code
     * @return
     */
    @RequestMapping(value = "/callrecord/reasons", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getCallrecordReason(String callId) {
        List<CallReasonRelation> midtelcallreason = new ArrayList<CallReasonRelation>();
        try {
            //通话记录id不能为空
            if (StringUtils.isEmpty(callId)) {
                throw new EmptyParameterException("callId", "通话记录ID");
            }
            midtelcallreason = service.getCallRecordReason(callId);
            return ServiceResult.succeed(midtelcallreason);
        } catch (Throwable e) {
            e.printStackTrace();
            log.error(this, e);
            return ServiceResult.error(e);
        }
    }

    /**
     * 保存通话记录的通话原因
     *
     * @param callId
     * @param reasonIds
     * @return
     */
    @RequestMapping(value = "/reason", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult saveCallReasons(String callId, String reasonIds) {
        try {
            if (StringUtils.isEmpty(callId)) {
                throw new EmptyParameterException("callId", "通话记录ID");
            }

            User loginUser = getCurrentUser();
            // 提取通话原因id
            String[] ReasonId = reasonIds.split(",");
            service.update(callId, ReasonId, loginUser);
            return ServiceResult.succeed(true);
        } catch (Throwable e) {
            e.printStackTrace();
            log.error(this, e);
            return ServiceResult.error(e);
        }
    }

    /**
     * 获取通话类型id
     *
     * @return
     */
    @RequestMapping(value = "/calltype", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getType() {
        try {
            List<TelCallReason> list = new ArrayList<TelCallReason>();
            list = service.getType();
            return ServiceResult.succeed(list);
        } catch (Exception e) {
            return ServiceResult.error(e);
        }
    }
}
