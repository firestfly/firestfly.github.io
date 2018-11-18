package bingo.vkcrm.service.tel.v1.controllers;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.EmptyParameterException;
import bingo.vkcrm.service.tel.v1.services.TelRecordService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;

/**
 * 话务控制器
 */
@Controller
@RequestMapping("/api/v1/telrecord")
public class TelRecordController extends BaseController{

    private static final Log log = LogFactory.getLog(TelRecordController.class);

    @Autowired
    private TelRecordService telRecordService;

    /**
     * 判断工号是否离线
     *
     * @param agentId 工号ID
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/agent/isoffline")
    @ResponseBody
    public ServiceResult isOffline(String agentId) throws Exception {
        if (StringUtils.isEmpty(agentId)) {
            throw new EmptyParameterException("agentId", "坐席号不能为空.");
        }
        return ServiceResult.succeed(telRecordService.isOffline(agentId));
    }

    /**
     * 获取空闲坐席列表
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/set/idles")
    @ResponseBody
    public ServiceResult getIdleSets() throws Exception {
        return ServiceResult.succeed(telRecordService.getIdleSets());
    }

    /**
     * 获取空闲坐席组列表
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/set/idleGroups")
    @ResponseBody
    public ServiceResult getIdleGroupSet() throws Exception {
        return ServiceResult.succeed(telRecordService.getIdleGroupSet(getCurrentUser()));
    }

    /**
     * 获取坐席列表
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/sets")
    @ResponseBody
    public ServiceResult getSets() throws Exception {
        return ServiceResult.succeed(telRecordService.getSets());
    }

    /**
     * 话务事件开始
     *
     * @param telephonistId
     * @param telephonistName
     * @param seatId
     * @param status
     * @return
     */
    @RequestMapping(value = "/televent/start", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult onEventStart(String uuid, String telephonistId, String telephonistName, String seatId, String status) {
        ServiceResult serviceResult;
        String messageQueueKey;
        try {
            Date date = new Date();
            messageQueueKey = ApplicationContext.getProperty("vkcrm.mq.key", "vkcrm.telrecord");
            StringBuffer messages = new StringBuffer();
            String message;
            message = StringUtils.isNotBlank(uuid) ? messages.append("").toString() : messages.append("UUID为空").toString();
            message = StringUtils.isNotBlank(telephonistId) ? messages.append("").toString() : messages.append("话务员编号为空").toString();
            message = StringUtils.isNotBlank(telephonistName) ? messages.append("").toString() : messages.append("话务员名称为空").toString();
            message = StringUtils.isNotBlank(seatId) ? messages.append("").toString() : messages.append("坐席号为空").toString();
            message = StringUtils.isNotBlank(status) ? messages.append("").toString() : messages.append("状态标识为空").toString();
            if (StringUtils.isBlank(message)) {
                boolean flag = telRecordService.saveStartTelEvent(messageQueueKey, uuid, telephonistId, telephonistName, seatId, status, date);
                serviceResult = ServiceResult.succeed(flag);
            } else {
                serviceResult = new ServiceResult();
                serviceResult.setSuccess(false);
                serviceResult.setMessage(message);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            serviceResult = ServiceResult.error(ex);
        }
        return serviceResult;
    }

    /**
     * 话务事件结束
     *
     * @param telephonistId
     * @param telephonistName
     * @param seatId
     * @param status
     * @return
     */
    @RequestMapping(value = "/televent/end", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult onEventEnd(String uuid, String telephonistId, String telephonistName, String seatId, String status) {
        ServiceResult serviceResult;
        String messageQueueKey;
        try {
            Date date = new Date();
            messageQueueKey = ApplicationContext.getProperty("vkcrm.mq.key", "vkcrm.telrecord");
            StringBuffer messages = new StringBuffer();
            String message;
            message = StringUtils.isNotBlank(uuid) ? messages.append("").toString() : messages.append("UUID为空").toString();
            message = StringUtils.isNotBlank(telephonistId) ? messages.append("").toString() : messages.append("话务员编号为空").toString();
            message = StringUtils.isNotBlank(telephonistName) ? messages.append("").toString() : messages.append("话务员名称为空").toString();
            message = StringUtils.isNotBlank(seatId) ? messages.append("").toString() : messages.append("坐席号为空").toString();
            message = StringUtils.isNotBlank(status) ? messages.append("").toString() : messages.append("状态标识为空").toString();
            if (StringUtils.isBlank(message)) {
                boolean flag = telRecordService.saveEndTelEvent(messageQueueKey, uuid, telephonistId, telephonistName, seatId, status, date);
                serviceResult = ServiceResult.succeed(flag);
            } else {
                serviceResult = new ServiceResult();
                serviceResult.setSuccess(false);
                serviceResult.setMessage(message);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            serviceResult = ServiceResult.error(ex);
        }
        return serviceResult;
    }
}
