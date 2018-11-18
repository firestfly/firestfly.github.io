package bingo.vkcrm.service.tel.v1.controllers;

import bingo.dao.Page;
import bingo.vkcrm.component.notify.DaoFactory;
import bingo.vkcrm.component.notify.NotifyCenter;
import bingo.vkcrm.component.notify.NotifyPublisher;
import bingo.vkcrm.component.notify.models.Notify;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.model.DictionaryItem;
import bingo.vkcrm.service.service.DictionaryService;
import bingo.vkcrm.service.tel.v1.Version;
import bingo.vkcrm.service.tel.v1.services.NotifyService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Wangzr on 16/1/20.
 */
@Controller
@RequestMapping(Version.API_PATH + "/notify")
public class NotifyController extends BaseController {

    @Autowired
    NotifyService service;

    @Autowired
    DictionaryService dictionaryService;

    @Autowired
    DaoFactory notifyDaoFactory;

    private NotifyCenter getNotifyCenter() {
        NotifyCenter center = NotifyCenter.getInstance(notifyDaoFactory);
        return center;
    }

    @RequestMapping(value = "/publish", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult publish(String type, String content) throws Throwable {
        NotifyCenter center = getNotifyCenter();

        User loginUser = getCurrentUser();
        center.publish(type, content, loginUser.getId());
        return ServiceResult.succeed(true);
    }

    @RequestMapping(value = "/unread/count", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getUnReadNotifies() {
        NotifyCenter center = getNotifyCenter();

        User loginUser = getCurrentUser();

        int totalCount = center.getUnReadCount(loginUser.getId());
        return ServiceResult.succeed(totalCount);
    }

    @RequestMapping(value = "/unread", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getUnReadNotifies(String type, String startTime, String endTime, String content, int pageIndex, int pageSize) throws Throwable {
        NotifyCenter center = getNotifyCenter();


        Date startTimeParse = null;
        Date endTimeParse = null;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            if (!StringUtils.isEmpty(startTime)) {
                startTimeParse = format.parse(startTime);
            }
            if (!StringUtils.isEmpty(endTime)) {
                endTimeParse = format.parse(endTime);
            }
        } catch (ParseException ex) {
            throw new Exception("时间格式有误", ex);
        }

        User loginUser = getCurrentUser();
        Page pager = new Page();
        pager.setPage(pageIndex);
        pager.setPageSize(pageSize);
        List<Notify> notifies = center.getUnRead(loginUser.getId(), type, startTimeParse, endTimeParse, content, pager);
        ListResult<Notify> notifiesPages = new ListResult<Notify>(pager, notifies);
        return ServiceResult.succeed(notifiesPages);
    }

    @RequestMapping(value = "/read", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getReadNotifies(String type, String startTime, String endTime, String content, int pageIndex, int pageSize) throws Throwable {
        NotifyCenter center = getNotifyCenter();

        Date startTimeParse = null;
        Date endTimeParse = null;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            if (!StringUtils.isEmpty(startTime)) {
                startTimeParse = format.parse(startTime);
            }
            if (!StringUtils.isEmpty(endTime)) {
                endTimeParse = format.parse(endTime);
            }
        } catch (ParseException ex) {
            throw new Exception("时间格式有误", ex);
        }

        User loginUser = getCurrentUser();
        Page pager = new Page();
        pager.setPage(pageIndex);
        pager.setPageSize(pageSize);
        List<Notify> notifies = center.getRead(loginUser.getId(), type, startTimeParse, endTimeParse, content, pager);
        ListResult<Notify> notifiesPages = new ListResult<Notify>(pager, notifies);
        return ServiceResult.succeed(notifiesPages);
    }

    @RequestMapping(value = "/read", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult markRead(String type, String[] ids) {
        NotifyCenter center = getNotifyCenter();

        User loginUser = getCurrentUser();
        boolean success = center.readAll(loginUser.getId(), type, ids);
        return ServiceResult.succeed(success);
    }

    @RequestMapping(value = "/readAll", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult markReadAll(String type, String startTime, String endTime, String content) throws Throwable {
        NotifyCenter center = getNotifyCenter();

        Date startTimeParse = null;
        Date endTimeParse = null;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            if (!StringUtils.isEmpty(startTime)) {
                startTimeParse = format.parse(startTime);
            }
            if (!StringUtils.isEmpty(endTime)) {
                endTimeParse = format.parse(endTime);
            }
        } catch (ParseException ex) {
            throw new Exception("时间格式有误", ex);
        }

        User loginUser = getCurrentUser();
        boolean success = center.readAll(loginUser.getId(), type, startTimeParse, endTimeParse, content);
        return ServiceResult.succeed(success);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult markDelete(String type, String[] ids) {
        NotifyCenter center = getNotifyCenter();

        User loginUser = getCurrentUser();
        boolean success = center.deleteAll(loginUser.getId(), type, ids);
        return ServiceResult.succeed(success);
    }


    @RequestMapping(value = "/deleteAll", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult markDeleteAll(String type, String startTime, String endTime, String content) throws Throwable {
        NotifyCenter center = getNotifyCenter();

        Date startTimeParse = null;
        Date endTimeParse = null;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            if (!StringUtils.isEmpty(startTime)) {
                startTimeParse = format.parse(startTime);
            }
            if (!StringUtils.isEmpty(endTime)) {
                endTimeParse = format.parse(endTime);
            }
        } catch (ParseException ex) {
            throw new Exception("时间格式有误", ex);
        }

        User loginUser = getCurrentUser();
        boolean success = center.deleteAll(loginUser.getId(), type, startTimeParse, endTimeParse, content);
        return ServiceResult.succeed(success);
    }


    @RequestMapping(value = "/tel/publish", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult telPublishCheckout(String type, String skillName, String telNo) throws Throwable {
        if(!type.equals("checkin") && !type.equals("checkout")){
            throw new BadRequestException("话务类型参数错误");
        }

        String typeText = type.equals("checkin") ? "签入" : (type.equals("checkout") ? "签出" : "未知操作");

        NotifyCenter center = getNotifyCenter();
        User loginUser = getCurrentUser();

        SimpleDateFormat format = new SimpleDateFormat("HH点mm分");
        String time = format.format(new Date());

        String content = time + "," + loginUser.getName() + typeText + skillName + " ( 工号:" + telNo + " )";

        center.publish("1", content, loginUser.getId());
        return ServiceResult.succeed(true);
    }

}
