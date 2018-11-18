package bingo.vkcrm.service.task.v1.services;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.common.utils.CacheUtil;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.enums.AccessTypes;
import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.service.exceptions.ServiceException;
import bingo.vkcrm.service.model.HmacSHA1Result;
import bingo.vkcrm.service.model.InterfaceAccessLog;
import bingo.vkcrm.service.model.RestAccessLog;
import bingo.vkcrm.service.service.RestBaseSvc;
import bingo.vkcrm.service.task.v1.models.*;
import bingo.vkcrm.service.task.v1.models.callbacks.AppCallback;
import bingo.vkcrm.service.task.v1.models.callbacks.ProjectManager;
import bingo.vkcrm.service.utils.*;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import javax.servlet.http.HttpServletRequest;
import javax.xml.ws.WebServiceException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by szsonic on 2015/10/28.
 */
@Service
public class AppRestSvc extends RestBaseSvc {

    @Autowired
    protected ProjectService pService;

    @Autowired
    protected HouseService hService;

    @Autowired
    protected BizTypeService bizService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Override
    protected String getMainUrl(String url, Map<String, String> param) {
        String hostAndPort = ApplicationContext.getProperty("app.hostAndPort");
        HmacSHA1Result hmacSHA1Result = new HmacSHA1Result();
        try {
            hmacSHA1Result = HMACSHA1.getHmacSHA1Encrypt(url, param);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return hostAndPort + url + "?" + hmacSHA1Result.getNewUri();
    }

    @Override
    protected String getMainUrlForGet(String url, Map<String, String> param) {
        String hostAndPort = ApplicationContext.getProperty("app.hostAndPort");
        HmacSHA1Result hmacSHA1Result = null;
        String newUri = null;
        try {
            hmacSHA1Result = HMACSHA1.getHmacSHA1Encrypt(url, param);
            newUri = hmacSHA1Result.getNewUri();
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
        }
        String cs = "";
        for (String key : param.keySet()) {
            if (!key.equals("ts") && StringUtils.isNotEmpty(param.get(key))) {
                cs += "&" + key + "=" + param.get(key);
            }
        }
        String s = hostAndPort + url + "?" + newUri + cs;
        return s;
    }

    /**
     * 从其他接口获取任务信息
     *
     * @param taskNo       任务流水号
     * @param title        任务标题
     * @param businessType 业务类型
     * @param source       任务来源
     * @param startTime    开始日期
     * @param endTime      结束日期
     * @param projectCode  项目编码
     * @param houseCode    房屋编码
     * @param mobile       报事人手机
     * @param curPage      查询页 默认 1
     * @param pageSize     单页记录条数 <=30
     *                     JSON格式为：
     *                     {
     *                     "code": CODE_OK,//实际上这个接口成功返回的是“0”
     *                     "result":{
     *                     "total": 123, # 总记录条数
     *                     "tasks": # 任务列表
     *                     [
     *                     {
     *                     "title": "送一桶水给A301",
     *                     "desc": "业主电话来叫，带零钱找钱",
     *                     "contact": "李先生",
     *                     "mobile": "13812345667",
     *                     "address": "xx花园x期xx栋xxx房",
     *                     "project_code": 4403001234567,
     *                     "house_code": "some_house_code",
     *                     "business_type": "BRCU0102",
     *                     "report_user_mobile": 13812345667,
     *                     "report_user_type": 1,
     *                     "source": 1001,
     *                     "appointment_time": "2015-01-30 19:01:01",
     *                     "image": [
     *                     "http://www.qiniu.com/2015/01/30/abcdef12345.jpg",
     *                     "http://www.qiniu.com/2015/01/30/abcdef23456.jpg",
     *                     ],
     *                     "cooperator": [
     *                     {
     *                     "id": 1234567,
     *                     "mobile": 18912345555,
     *                     }
     *                     ],
     *                     "timeline": [{
     *                     "time": "2015-01-10 10:01:01",
     *                     "creator": 39301139,
     *                     "status": TASK_STATUS_PUBLISHED_FOR_GRAB,
     *                     "msg": "补充信息文本(如有)",
     *                     "images: [], # 补充图片，如有
     *                     }, …]
     *                     }
     *                     …
     *                     ]
     *                     }
     * @return
     * @throws ResourceAccessException
     */
    public TaskListCallback queryTasks(String taskNo, String title, String businessType, String source,
                                       String startTime, String endTime, String projectCode, String houseCode,
                                       String mobile, String status, String crm_duty, String crm_source, String crm_evaluation, String crm_priority, Integer curPage, Integer pageSize) throws Exception {
        String exceptionMsg = null;
        Map<String, String> map = null;
        TaskListCallback callBackResult = new TaskListCallback();
        Date start = null;
        try {
            map = new HashMap<String, String>();
            map.put("task_no", taskNo);
            map.put("title", title);
            map.put("business_type", businessType);
            map.put("source", source);
            map.put("start", startTime);
            map.put("end", endTime);
            map.put("project_code", projectCode);
            map.put("house_code", houseCode);
            map.put("mobile", mobile);
            map.put("status", status);//任务状态编码
            map.put("crm_duty", crm_duty);//crm 系统的定责字段
            map.put("crm_source", crm_source);//crm的任务来源字段
            map.put("crm_evaluation", crm_evaluation);// crm的任务评价
            map.put("crm_priority", crm_priority);//crm的任务优先级
            map.put("timeline", "1");
            map.put("page", curPage + "");
            map.put("per_page", pageSize + "");
            start = new Date();
            callBackResult = super.get(TaskListCallback.class, "/api/partner/tasks", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date end = new Date();
            log2RedisMQ(start, end, getMainUrlForGet("/api/partner/tasks", map), JsonUtil.toJson(map), JsonUtil.toJson(callBackResult), "调用APP查询任务接口", exceptionMsg);
        }
        if (callBackResult.getResult() != null) {
            for (int i = 0; i < callBackResult.getResult().getTasks().size(); i++) {
                TaskInfo taskInfo = callBackResult.getResult().getTasks().get(i);
                if (StringUtils.isNotEmpty(taskInfo.getProject_code())) {
                    Map<String, String> proInfo = CacheUtil.get(Map.class, CachePrefix.PrjCode, taskInfo.getProject_code());
                    if (proInfo != null) {
                        taskInfo.setProject_name(proInfo.get("name").toString());
                    } else {
                        taskInfo.setProject_name("");
                    }
                }
                String house_Code = taskInfo.getHouse_code();
                if (StringUtils.isNotEmpty(house_Code)) {//因为房屋CODE可能为空
                    taskInfo.setHouse_name(CacheUtil.get(CachePrefix.HouseCode, house_Code));
                }
                List<AppTimeline> appTimelineList = taskInfo.getTimeline();
                if (appTimelineList != null) {
                    for (AppTimeline appTimeline : appTimelineList) {
                        String creatorId = appTimeline.getCreator();
                        if (StringUtils.isNotEmpty(creatorId)) {//如果APPtimeline返回了创建人
                            String creator = CacheUtil.get(CachePrefix.TaskUser, creatorId);//先从缓存中取
                            if (StringUtils.isEmpty(creator)) {//如果没取到
                                //如果缓存中没有数据，调接口查询员工姓名，并在缓存中设置进去
                                TaskStaffCallback callback = getStaffName(creatorId);
                                if ("0".equals(callback.getCode())) {//如果APP返回成功
                                    if (callback.getResult() != null) {
                                        List<StaffInfo> staffInfos = callback.getResult().getStaffs();
                                        if (staffInfos.size() > 0) {//如果返回的结果中有数据
                                            creator = staffInfos.get(0).getFullname();//如果能查到数据，取第一条。
                                            if (StringUtils.isNotEmpty(creator)) {
                                                CacheUtil.set(CachePrefix.TaskUser, creatorId, creator, 604800);//默认缓存7天,604800秒
                                                appTimeline.setCreator(creator);
                                            }
                                        }
                                    }
                                }
                            } else {
                                appTimeline.setCreator(creator);
                            }
                        }
                    }
                }


                // taskInfo.setBusiness_name(bizRoDao.queryForStringQuietly("sql.query.businessName.byBusinessType", m));
                taskInfo.setBusiness_name(CacheUtil.get(CachePrefix.BizType, taskInfo.getBusiness_type()));
                if (taskInfo.getContent().length() > 20) {
                    taskInfo.setContentText(taskInfo.getContent().substring(0, 20) + "...");
                } else {
                    taskInfo.setContentText(taskInfo.getContent());
                }
            }
        }

        return callBackResult;
    }

    /**
     * 任务关闭（调用App）
     *
     * @param taskNo 任务流水号
     * @return
     * @throws Exception
     */
    public TaskRecordCallback finishTask(String taskNo) throws Exception {
        Date startTime = null;
        TaskRecordCallback callback = null;
        Map<String, String> map = null;
        String exceptionMsg = null;
        try {
            map = new HashMap<String, String>();
            map.put("task_no", taskNo);
            for (String key : map.keySet()) {
                if (StringUtils.isEmpty(map.get(key))) {
                    map.remove(key);
                }
            }
            startTime = new Date();
            callback = super.post(TaskRecordCallback.class, "/api/partner/tasks/" + taskNo + "/close", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, getMainUrl("/api/partner/tasks/", map), JsonUtil.toJson(map), JsonUtil.toJson(callback), "调用APP接口结束/关闭任务", exceptionMsg);
        }
        return callback;
    }


    /**
     * 任务评价（调用App）
     *
     * @param taskNo  任务流水号
     * @param content 评价内容
     * @return TaskRecordCallback
     * @throws Exception
     */
    public TaskRecordCallback evaluationTask(String taskNo, String content) throws Exception {
        Date startTime = null;
        TaskRecordCallback callback = null;
        Map<String, String> map = null;
        String exceptionMsg = null;

        try {
            map = new HashMap<String, String>();
            map.put("content", content);
            for (String key : map.keySet()) {
                if (StringUtils.isEmpty(map.get(key))) {
                    map.remove(key);
                }
            }
            startTime = new Date();
            callback = super.post(TaskRecordCallback.class, "/api/partner/tasks/crm/task/" + taskNo + "/evaluation", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, getMainUrl("/api/partner/tasks/crm/task/" + taskNo + "/evaluation", map), JsonUtil.toJson(map), JsonUtil.toJson(callback), "调用APP接口添加任务评价", exceptionMsg);
        }
        return callback;
    }

    /**
     * 添加任务优先级（调用App）
     *
     * @param taskNo   任务流水号
     * @param priority 优先级
     * @return TaskRecordCallback
     * @throws Exception
     */
    public TaskRecordCallback priorityTask(String taskNo, String priority) throws Exception {
        Date startTime = null;
        TaskRecordCallback callback = null;
        Map<String, String> map = null;
        String exceptionMsg = null;
        try {
            map = new HashMap<String, String>();
            map.put("priority", priority);
            for (String key : map.keySet()) {
                if (StringUtils.isEmpty(map.get(key))) {
                    map.remove(key);
                }
            }
            startTime = new Date();
            callback = super.post(TaskRecordCallback.class, "/api/partner/tasks/crm/task/" + taskNo + "/priority", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, getMainUrl("/api/partner/tasks/crm/task/" + taskNo + "/priority", map), JsonUtil.toJson(map), JsonUtil.toJson(callback), "调用APP接口添加任务优先级", exceptionMsg);
        }
        return callback;
    }

    /**
     * 添加任务定责数据（调用App）
     *
     * @param taskNo  任务流水号
     * @param content 定责数据
     * @return TaskRecordCallback
     * @throws Exception
     */
    public TaskRecordCallback dutyTask(String taskNo, String content) throws Exception {
        Date startTime = null;
        TaskRecordCallback callback = null;
        Map<String, String> map = null;
        String exceptionMsg = null;
        try {
            map = new HashMap<String, String>();
            map.put("content", content);
            for (String key : map.keySet()) {
                if (StringUtils.isEmpty(map.get(key))) {
                    map.remove(key);
                }
            }
            startTime = new Date();
            callback = super.post(TaskRecordCallback.class, "/api/partner/tasks/crm/task/" + taskNo + "/duty", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, getMainUrl("/api/partner/tasks/crm/task/" + taskNo + "/duty", map), JsonUtil.toJson(map), JsonUtil.toJson(callback), "调用APP接口添加任务定责数据", exceptionMsg);
        }
        return callback;
    }

    /**
     * 调用app接口添加任务(报事)来源
     *
     * @param taskNo       任务流水号
     * @param businessType 任务来源code
     */
    public TaskRecordCallback businessTypeTask(String taskNo, String businessType) throws Exception {
        Date startTime = null;
        TaskRecordCallback callback = null;
        Map<String, String> map = null;
        String exceptionMsg = null;
        try {
            map = new HashMap<String, String>();
            map.put("business_type", businessType);
            for (String key : map.keySet()) {
                if (StringUtils.isEmpty(map.get(key))) {
                    map.remove(key);
                }
            }
            startTime = new Date();
            callback = super.post(TaskRecordCallback.class, "/api/partner/tasks/" + taskNo + "/business_type", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, getMainUrl("/api/partner/tasks/" + taskNo + "/business_type", map), JsonUtil.toJson(map), JsonUtil.toJson(callback), "调用APP接口添加任务(报事)来源", exceptionMsg);
        }
        return callback;
    }

    /**
     * 新增任务(调用APP)
     *
     * @param taskRecords 用户提交的任务记录
     * @param user        操作人
     * @return 调用住这儿返回信息
     */
    public TaskRecordCallback addTaskRecord(TaskRecords taskRecords, User user) throws Exception {
        Date startTime = null;
        TaskRecordCallback callback = null;
        Map<String, String> map = null;
        String exceptionMsg = null;
        try {
            map = new HashMap<String, String>();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            if (StringUtils.isNotEmpty(taskRecords.getTitle())) {
                map.put("title", taskRecords.getTitle());
            }

            map.put("desc", taskRecords.getContent());
            map.put("contact", taskRecords.getContactsName());
            map.put("mobile", taskRecords.getContactsMobile());
            String address = " ";
            if (StringUtils.isEmpty(taskRecords.getHouseName())) {
                address = taskRecords.getProjectName();
            } else {
                address = taskRecords.getProjectName() + "-" + taskRecords.getHouseName();
            }
            map.put("address", address);
            Map project_info = CacheUtil.get(Map.class, CachePrefix.PrjId, taskRecords.getProjectId());
            String project_code = String.valueOf(project_info.get("code"));
            map.put("project_code", project_code);
            if (StringUtils.isNotEmpty(taskRecords.getHouseCode())) {
                map.put("house_code", taskRecords.getHouseCode());
            }
            map.put("business_type", taskRecords.getBusinessType());
            map.put("report_user_mobile", taskRecords.getReportUserMobile());
            map.put("crm_source", taskRecords.getSource());
            map.put("crm_priority", taskRecords.getLevelType() + "");
            if (taskRecords.getAppointmentStartTime() != null) {
                map.put("appointment_start_time", URLDecoder.decode(sdf.format(taskRecords.getAppointmentStartTime()), "UTF-8"));
            }
            map.put("content", taskRecords.getContent());
            Integer taskdeal = taskRecords.getTaskdeal();//处理方式：1.呼叫中心处理 2、直接归档 3、项目跟进处理
            if (taskdeal != null) {
                if (taskdeal == 1 || taskdeal == 2 || taskdeal == 4) {
                    map.put("auto_publish", "0");//处理方式如果是“直接归档”或者“由呼叫中心处理”，则不自动发布抢单；
                } else {
                    map.put("auto_publish", "1");//如果是项目跟进处理，则发布抢单
                }
            }
            for (String key : map.keySet()) {
                if (StringUtils.isEmpty(map.get(key))) {
                    map.remove(key);
                }
            }
            startTime = new Date();
            callback = super.post(TaskRecordCallback.class, "/api/partner/tasks/crm", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, getMainUrl("/api/partner/tasks/crm", map), JsonUtil.toJson(map), JsonUtil.toJson(callback), "调用APP接口创建任务", exceptionMsg);
        }
        return callback;
    }

    /**
     * 添加任务备注
     *
     * @param taskNo 任务流水号
     * @param remark 任务备注信息
     * @return
     * @throws Exception
     */
    public TaskRecordCallback addTaskRemark(String taskNo, String remark) throws Exception {
        Date startTime = null;
        TaskRecordCallback callback = null;
        Map<String, String> map = null;
        String exceptionMsg = null;
        try {
            map = new HashMap<String, String>();
            map.put("task_no", taskNo);
            map.put("remark", remark);
            for (String key : map.keySet()) {
                if (StringUtils.isEmpty(map.get(key))) {
                    map.remove(key);
                }
            }
            startTime = new Date();
            callback = super.put(TaskRecordCallback.class, "/api/partner/tasks/" + taskNo + "/remark", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, getMainUrl("/api/partner/tasks/" + taskNo + "/remark", map), JsonUtil.toJson(map), JsonUtil.toJson(callback), "调用APP接口添加任务备注", exceptionMsg);
        }
        return callback;
    }

    /**
     * 查询房屋下任务完成百分比
     *
     * @param houseCode
     * @return
     */
    public List<Integer> getTaskPercent(String houseCode) {
        List<Integer> percent = new ArrayList<Integer>();
        List<TaskInfo> tasks;
        int undone = 0;
        int total = 0;
        int times = 0;
        try {
            TaskListCallback taskListCallback = queryTasks(null, null, null, null, null, null, null, houseCode,
                    null, null, null, null, null, null, 1, 30);
            total = taskListCallback.getResult().getTotal();
            tasks = taskListCallback.getResult().getTasks();
            if (total > 30) {
                if (total % 30 > 0) {
                    times = total / 30;
                } else if (total % 30 <= 0) {
                    times = (total / 30) - 1;
                }
                for (int i = 0; i < times; i++) {
                    TaskListCallback taskListCallback1 = queryTasks(null, null, null, null, null, null, null, houseCode,
                            null, null, null, null, null, null, i + 2, 30);
                    tasks.addAll(taskListCallback1.getResult().getTasks());
                }
            }
            for (TaskInfo taskInfo : tasks) {
                String status = taskInfo.getStatus();
                if (!AppTaskStatus.员工工作完成.getCode().equals(status) ||
                        (!AppTaskStatus.任务完成.getCode().equals(status)) ||
                        (!AppTaskStatus.任务已评价.getCode().equals(status)) ||
                        (!AppTaskStatus.用户取消任务.getCode().equals(status))) {
                    undone++;
                }
                //循环遍历一个task中的status,判断该任务是否已经完成
            }
            percent.add(undone);
            percent.add(total);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return percent;
    }

    /**
     * 调用APP接口获取项目系统负责人的信息
     *
     * @param projectCode  项目编码
     * @param businessType 任务类型
     * @return TaskRecordCallback
     * @throws Exception
     */
    public StaffInfoResult getStaffsInfo(String projectCode, String businessType) throws Exception {
        String exceptionMessage = null;
        StaffInfoResult result = null;
        Date startDate = new Date();
        Map<String, String> map = null;
        try {
            map = new HashMap<String, String>();
            map.put("project", projectCode);
            map.put("business_type", businessType);
            result = super.get(StaffInfoResult.class, "/api/partner/staffs/head", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMessage = e.getMessage();
        } finally {
            Date endDate = new Date();
            log2RedisMQ(startDate, endDate, getMainUrlForGet("/api/partner/staffs/head", map), JsonUtil.toJson(map), JsonUtil.toJson(result), "根据项目code和业务类型获取负责人信息", exceptionMessage);
        }
        return result;
    }

    public TaskStaffCallback getStaffName(String staffId) throws Exception {
        String exceptionMessage = null;
        Date startDate = new Date();
        Map<String, String> map = null;
        TaskStaffCallback callback = null;
        try {
            map = new HashMap<String, String>();
            if (StringUtils.isNotEmpty(staffId)) {
                map.put("staff_id", staffId);
            }
            map.put("page", "1");
            map.put("per_page", "20");
            callback = super.get(TaskStaffCallback.class, "/api/partner/staffs", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMessage = e.getMessage();
        } finally {
            Date endDate = new Date();
            log2RedisMQ(startDate, endDate, getMainUrlForGet("/api/partner/staffs", map), JsonUtil.toJson(map), JsonUtil.toJson(null), "根据员工ID获取员工信息", exceptionMessage);
        }
        return callback;
    }


    /**
     * 发布抢单
     *
     * @param taskNo
     * @return
     * @throws Exception
     */
    public TaskRecordCallback publish(String taskNo) throws Exception {
        String exceptionMessage = null;
        Date startDate = new Date();
        Map<String, String> map = null;
        TaskRecordCallback callback = null;
        try {
            map = new HashMap<String, String>();//虽然这里没参数，也要传个对象过去，不然会空指针。
            callback = super.post(TaskRecordCallback.class, "/api/partner/tasks/" + taskNo + "/publish", map);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMessage = e.getMessage();
        } finally {
            Date endDate = new Date();
            log2RedisMQ(startDate, endDate, getMainUrl("/api/partner/tasks/" + taskNo + "/publish", map), JsonUtil.toJson(map), JsonUtil.toJson(null), "发布抢单", exceptionMessage);
        }
        return callback;
    }

    /**
     * 获取项目值班经理
     * @param projectCode 项目编码
     * @return
     * @throws Exception
     */
    public List<ProjectManager> queryProjectManagers(String projectCode) throws Exception {
        Date startTime = new Date();
        Map<String, String> parameter = new HashMap<String, String>();
        String exceptionMessage = "";
        try {
            AppCallback<List<ProjectManager>> callback = new AppCallback<List<ProjectManager>>();
            callback = super.get(callback.getClass(), "/api/partner/staffs/projects/" + projectCode + "/managers", parameter);
            if(callback.getCode() == 0){
                return callback.getResult();
            } else {
                throw new ServiceException(callback.getCode(), callback.getError());
            }
        } catch (Exception ex) {
            exceptionMessage = ex.getMessage();
            throw ex;
        } finally {
            log2RedisMQ(startTime, new Date(), getMainUrl("/api/partner/projects/" + projectCode + "/managers", parameter), JsonUtil.toJson(parameter), JsonUtil.toJson(null), "获取值班经理", exceptionMessage);
        }
    }


    /**
     * 保存日志到Redis
     *
     * @param startDate
     * @param endDate
     * @param remoteUrl
     * @param paramters
     * @param result
     * @param actionName
     * @param exceptionMessage
     */
    @Deprecated
    private void log2Redis(Date startDate, Date endDate, String remoteUrl, String paramters, String result, String actionName, String exceptionMessage) {
        InterfaceAccessLog interfaceAccessLog = new InterfaceAccessLog();
        interfaceAccessLog.setActionName(actionName);
        interfaceAccessLog.setEndDate(endDate);
        interfaceAccessLog.setParamterJson(paramters);
        interfaceAccessLog.setRemoteUrl(remoteUrl);
        interfaceAccessLog.setResultJson(result);
        interfaceAccessLog.setStartDate(startDate);
        interfaceAccessLog.setExceptionMessage(exceptionMessage);
        try {
            String jsonString = JsonUtil.toJson(interfaceAccessLog);
            String key = ApplicationContext.getProperty("log.interfaceAccessLog.key", "InterfaceAccessLog");
            JedisUtil.defaultDb().lpush(key.getBytes("UTF-8"), jsonString.getBytes("UTF-8"));
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }

    /**
     * 存入Redis消息队列
     *
     * @param requestDate      请求时间
     * @param responseDate     响应时间
     * @param remoteUrl        访问地址
     * @param parameters       参数
     * @param result           结果
     * @param actionName       动作
     * @param exceptionMessage 异常信息
     */
    private void log2RedisMQ(Date requestDate, Date responseDate, String remoteUrl, String parameters, String result, String actionName, String exceptionMessage) {
        try {
            RestAccessLog restAccessLog = new RestAccessLog();
            restAccessLog.setClientIP(HttpUtil.getIpAddress(httpServletRequest));
            restAccessLog.setActionName(actionName);
            restAccessLog.setAccessType(AccessTypes.App.getValue());
            restAccessLog.setParameterMapJson(parameters);
            restAccessLog.setResultJson(result);
            restAccessLog.setRequestDate(requestDate);
            restAccessLog.setResponseDate(responseDate);
            restAccessLog.setRequestMethod(httpServletRequest.getMethod());
            restAccessLog.setRequestUrl(remoteUrl);
            restAccessLog.setExceptionMessage(exceptionMessage);
            restAccessLog.setCreateDate(new Date());
            String jsonString = JsonUtil.toJson(restAccessLog);
            String accessLogKey = ApplicationContext.getProperty("log.restaccesslog.key", "RestAccessLog");
            JedisUtil.defaultDb().lpush(accessLogKey.getBytes("UTF-8"), jsonString.getBytes("UTF-8"));
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }

}
