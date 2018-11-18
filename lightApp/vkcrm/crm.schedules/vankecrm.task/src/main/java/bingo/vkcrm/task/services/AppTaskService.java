package bingo.vkcrm.task.services;

import bingo.common.core.ApplicationContext;
import bingo.dao.IDao;
import bingo.vkcrm.common.utils.CacheUtil;
import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.service.model.HmacSHA1Result;
import bingo.vkcrm.service.service.RestBaseSvc;
import bingo.vkcrm.service.utils.*;
import bingo.vkcrm.task.models.response.GridHouseData;
import bingo.vkcrm.task.models.response.GridResponse;
import bingo.vkcrm.task.models.sync.SyncConfig;
import bingo.vkcrm.task.models.appTask.*;
import bingo.vkcrm.task.models.bmap.grid.Grid;
import bingo.vkcrm.task.models.bmap.gridhouse.MidProjectHouse;
import bingo.vkcrm.task.models.response.GridHouseResponse;
import bingo.vkcrm.task.models.response.GridStaffResponse;
import bingo.vkcrm.task.models.bmap.manager.SecUser;
import bingo.vkcrm.task.models.business.BusinessType;
import bingo.vkcrm.task.models.business.CallBackResult;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.net.URLDecoder;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by szsonic on 2015/11/27.
 */
@Service
public class AppTaskService extends RestBaseSvc {
    @Autowired
    IDao bizDao;
    @Autowired
    IDao centerDao;
    @Autowired
    IDao reportDao;
    @Autowired
    IDao logDao;
    protected static final Log log = LogFactory.getLog(AppTaskService.class);

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
        String hostAndPort = ApplicationContext.getProperty("app.domain");
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
            if (key != "ts" && StringUtils.isNotEmpty(param.get(key))) {
                cs += "&" + key + "=" + param.get(key);
            }
        }
        String s = hostAndPort + url + "?" + newUri + cs;
        log.debug("本次请求URL：" + s);
        return s;
    }

    protected String getMainUrlForGet(String url, Map<String, String> param, String host) {
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
            if (key != "ts" && StringUtils.isNotEmpty(param.get(key))) {
                cs += "&" + key + "=" + param.get(key);
            }
        }
        String s = host + url + "?" + newUri + cs;
        log.debug("本次请求URL：" + s);
        return s;
    }

    /**
     * get
     *
     * @param responseType
     * @param url
     * @param param
     * @return
     * @throws Exception
     */
    public <T> T get(Class<T> responseType, String url, Map<String, String> param, String host) throws Exception {
        return new RestTemplate().getForObject(getMainUrlForGet(url, param, host), responseType);
    }

    /**
     * 新增任务(调用APP)
     *
     * @param taskRecords 用户提交的任务记录
     * @return 调用住这儿返回信息
     */
    public TaskRecordCallback addTaskRecord(TaskRecords taskRecords) throws Exception {

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Map<String, String> map = new HashMap<String, String>();
        if (taskRecords.getTitle() != null && !"".equals(taskRecords.getTitle())) {
            map.put("title", taskRecords.getTitle());
        }
        map.put("desc", taskRecords.getContent());
        map.put("contact", taskRecords.getContactsName());
        map.put("mobile", taskRecords.getContactsMobile());
        map.put("address", taskRecords.getHouseName());
        map.put("project_code", taskRecords.getProjectCode());
        if (taskRecords.getHouseCode() != null) {
            map.put("house_code", taskRecords.getHouseCode());
        }
        map.put("business_type", taskRecords.getBusinessType());
        map.put("report_user_mobile", taskRecords.getReportUserMobile());
        if (taskRecords.getAppointmentStartTime() != null) {
            map.put("appointment_start_time", URLDecoder.decode(sdf.format(taskRecords.getAppointmentStartTime()), "UTF-8"));
        }
        map.put("content", taskRecords.getContent());

        for (String key : map.keySet()) {
            if (StringUtils.isEmpty(map.get(key))) {
                map.remove(key);
            }
        }
        return super.post(TaskRecordCallback.class, "/api/partner/tasks/crm", map);
    }


    /**
     * 获取创建任务时失败的任务列表
     */
    public List<TaskRecords> getFailedTask() {
        return bizDao.queryForList(TaskRecords.class, "sql.query.failedTask", null);
    }

    /**
     * 更新任务状态，设置流水号(taskNo)且无需同步
     *
     * @param taskId 任务ID
     * @param taskNo 任务流水号
     * @return
     */
    public boolean updateTaskInfo(String taskId, String taskNo) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("taskId", taskId);
        params.put("taskNo", taskNo);
        return bizDao.update("sql.update.failedTask", params) > 0;
    }

    /**
     * 从app接口获取所有任务
     *
     * @param curPage  当前页
     * @param pageSize 页面大小(接口返回不能大于30)
     * @return 任务列表
     */
    public TaskListCallback queryAllTasks(Integer curPage, Integer pageSize) throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        map.put("page", curPage + "");
        map.put("per_page", pageSize + "");
        map.put("start", "2016-01-14 00:00:00");
        map.put("end", "2016-01-18 00:00:00");
        TaskListCallback taskListCallback = super.get(TaskListCallback.class, "/api/partner/tasks", map);
        if ("0".equals(taskListCallback.getCode())) {
            List<SyncTaskRecords> taskList = taskListCallback.getResult().getTasks();
            for (SyncTaskRecords taskRecord : taskList) {
                taskRecord.setContent(EmojiUtil.filterEmoji(taskRecord.getContent()));
                String retSource = taskRecord.getSource();
                if (!retSource.equals("crm")) {
                    taskRecord.setCrm_source(retSource);
                }
                if (StringUtils.isNotEmpty(taskRecord.getProject_code())) {
                    //Map<String,String> map=CacheUtil.get(Map.class, CachePrefix.PrjCode,taskRecord.getProject_code());
                    taskRecord.setProject_name(CacheUtil.get(Map.class, CachePrefix.PrjCode, taskRecord.getProject_code()).get("name").toString());
                }
                String house_Code = taskRecord.getHouse_code();
                if (StringUtils.isNotEmpty(house_Code)) {//因为房屋CODE可能为空
                    taskRecord.setHouse_name(CacheUtil.get(CachePrefix.HouseCode, house_Code));
                }
                taskRecord.setStaff_name(getStaffNameById(taskRecord.getStaff()));
                taskRecord.setSystem_head_name(getStaffNameById(taskRecord.getSystem_head()));
                taskRecord.setHousekeeper_name(getStaffNameById(taskRecord.getHousekeeper()));
                List<AppTimeline> appTimelineList = taskRecord.getTimeline();
                if (appTimelineList != null) {
                    for (AppTimeline appTimeline : appTimelineList) {
                        String creatorId = appTimeline.getCreator();
                        if (StringUtils.isNotEmpty(creatorId)) {//如果APPtimeline返回了创建人
                            String creator = CacheUtil.get(CachePrefix.TaskUser, creatorId);//先从缓存中取
                            if (StringUtils.isEmpty(creator)) {//如果没取到
                                //如果缓存中没有数据，调接口查询员工姓名，并在缓存中设置进去
                                appTimeline.setCreator(getStaffNameById(creatorId));
                            } else {
                                appTimeline.setCreator(creator);
                            }
                        }
                    }
                }
                // appTaskService.insertSyncTask(taskRecord);
            }
        }
        return taskListCallback;
    }


    /**
     * 从app接口获取所有任务(用于报表)
     *
     * @param curPage  当前页
     * @param pageSize 页面大小(接口返回不能大于30)
     * @return 任务列表
     */
    public TaskCallBack4Report queryAllTasks4Report(Integer curPage, Integer pageSize, String start, String end, String host) throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        map.put("page", curPage + "");
        map.put("per_page", pageSize + "");
        map.put("timeline", "1");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        map.put("start", start);
        map.put("end", end);
        return this.get(TaskCallBack4Report.class, "/api/partner/tasks", map, host);
    }


    /**
     * 根据项目code查询项目名
     *
     * @param code 项目code
     * @return 项目名
     */
    public Map queryProjectNameByCode(String code) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("code", code);
        return centerDao.queryForObject(Map.class, "sql.query.project.byCode", params);
    }

    /**
     * 根据房屋code查询房屋名
     *
     * @param code 房屋code
     * @return 房屋名
     */
    public Map queryhouseNameByCode(String code) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("code", code);
        return centerDao.queryForObject(Map.class, "sql.query.house.byCode", params);
    }

    /**
     * 判断一个任务是否已经存在于同步任务表中
     *
     * @param task_no 任务流水号
     * @return 是否存在
     */
    public boolean queryExistSyncTask(String task_no) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("task_no", task_no);
        return bizDao.exists("sql.exist.syncTask", params);
    }

    /**
     * 插入一条同步任务
     *
     * @param syncTaskRecord 任务信息
     * @return boolean
     */
    public boolean insertSyncTask(SyncTaskRecords syncTaskRecord) {
        return bizDao.insert(SyncTaskRecords.class, syncTaskRecord) > 0;
    }

    /**
     * 更新同步任务信息
     *
     * @param syncTaskRecords 任务信息
     * @return boolean
     */
    public boolean updateSyncTask(SyncTaskRecords syncTaskRecords) {
        return bizDao.update("sql.update.syncTask", syncTaskRecords) > 0;
    }

    /**
     * 从app获取任务类型(每次获取所有数据)
     *
     * @return 报事类型
     */
    public CallBackResult queryBusinessType(String host) throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        return this.get(CallBackResult.class, "/api/partner/business/types", map, host);
    }

    /**
     * 从app获取任务类型(每次获取所有数据)
     *
     * @return 报事类型
     */
    public List<BusinessType> queryBusinessType4Local() throws Exception {
        return bizRoDao.queryForList(BusinessType.class, "sql.query.businessType", null);
    }


    /**
     * 判断一个任务类型是否存在
     *
     * @param code 任务类型code
     * @return Boolean
     */
    public Boolean existBusinessType(String code) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("code", code);
        return bizRoDao.exists("sql.exist.businessType", map);
    }

    /**
     * 插入一个任务类型
     *
     * @param businessType 任务类型信息
     * @return Boolean
     */
    public Boolean insertBusinessType(BusinessType businessType) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("businessCode", businessType.getCode());
        map.put("parentCode", businessType.getParent_code());
        map.put("businessName", businessType.getName());
        return bizDao.insert("sql.insert.businessType", map) > 0;
    }

    /**
     * 更新一个任务类型
     *
     * @param businessType 任务类型信息
     * @return Boolean
     */
    public Boolean updateBusinessType(BusinessType businessType) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("businessCode", businessType.getCode());
        map.put("parentCode", businessType.getParent_code());
        map.put("businessName", businessType.getName());
        return bizDao.update("sql.update.businessType", map) > 0;
    }

    /**
     * 删除一个任务类型，逻辑删除
     *
     * @param businessType 任务类型信息
     * @return Boolean
     */
    public Boolean deleteBusinessType(BusinessType businessType) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("businessCode", businessType.getCode());
        return bizDao.update("sql.delete.businessType", map) > 0;
    }

    public String getStaffNameById(String staffId) throws Exception {
        if (StringUtils.isNotEmpty(staffId)) {
            TaskStaffCallback callback = getStaffName(staffId);
            if (callback != null) {
                if ("0".equals(callback.getCode())) {//如果APP返回成功
                    if (callback.getResult() != null) {
                        List<StaffInfo> staffInfos = callback.getResult().getStaffs();
                        if (staffInfos.size() > 0) {//如果返回的结果中有数据
                            String staffName = staffInfos.get(0).getFullname();//如果能查到数据，取第一条。
                            if (StringUtils.isNotEmpty(staffId)) {
                                CacheUtil.set(CachePrefix.TaskUser, staffId, staffName, 604800);//默认缓存7天,604800秒
                                return staffName;
                            }
                        }
                    }
                }
            }

        }
        return staffId;
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
            //   log2RedisMQ(startDate, endDate, getMainUrlForGet("/api/partner/staffs", map), JsonUtil.toJson(map), JsonUtil.toJson(null), "根据员工ID获取员工信息", exceptionMessage);
        }
        return callback;


    }


    @Transactional
    public void insertSyncTask4Report(List<AppTaskRecord> taskList) {
        List<Cooperator> cooperatorList = new LinkedList<Cooperator>();
        List<AppTimeline> appTimelineList = new LinkedList<AppTimeline>();
        for (AppTaskRecord taskRecord : taskList) {
            List<Cooperator> cooperator = taskRecord.getCooperator();
            if (cooperator != null && cooperator.size() != 0) {
                for (Cooperator tmpCooperator : cooperator) {
                    tmpCooperator.setTask_no(taskRecord.getTask_no());
                }
                cooperatorList.addAll(cooperator);
            }
            List<AppTimeline> timeline = taskRecord.getTimeline();
            if (timeline != null && timeline.size() != 0) {
                for (AppTimeline appTimeline : timeline) {
                    appTimeline.setTask_no(taskRecord.getTask_no());
                }
                appTimelineList.addAll(timeline);
            }
        }
        insertTaskTimeLine4Report(appTimelineList);
        insertTaskCooperator(cooperatorList);
        reportDao.batchUpdate("sql.insert.appTaskRecord", taskList);

    }


    public void updateSyncTask4Report(List<AppTaskRecord> taskList) {
        reportDao.batchUpdate("sql.update.appTaskRecord", taskList);
    }


    public void insertTaskTimeLine4Report(List<AppTimeline> appTimeLine) {
        reportDao.batchUpdate("sql.insert.apptimeline", appTimeLine);
        //reportDao.batchInsert(AppTimeline.class, appTimeLine);
    }


    public boolean existTask(String taskNo) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("taskNo", taskNo);
        return reportRoDao.exists("sql.exist.appTaskRecord", params);
    }

    public void insertTaskCooperator(List<Cooperator> cooperator) {
        reportDao.batchUpdate("sql.insert.cooperator", cooperator);
    }

    /**
     * 查询同步相关配置
     *
     * @param syncCode
     * @return
     */
    public SyncConfig querySyncConfig(String syncCode) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("syncCode", syncCode);
        return centerRoDao.queryForObject(SyncConfig.class, "sql.query.syncConfig", map);
    }


    /**
     * 更新配置信息
     *
     * @return
     */
    public boolean updateSyncConfig(SyncConfig config, Boolean success) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Map<String, Object> map = new HashMap<String, Object>();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        long current = System.currentTimeMillis();//当前时间毫秒数
        long zero = current / (1000 * 3600 * 24) * (1000 * 3600 * 24) - TimeZone.getDefault().getRawOffset();//今天零点零分零秒的毫秒数

        calendar.setTime(new Timestamp(zero));
        calendar.add(Calendar.MINUTE, config.getSyncCycle());
        String nextSyncTime = sdf.format(calendar.getTime());
        //下次同步时间

        calendar.setTime(new Timestamp(zero));
        calendar.add(Calendar.MINUTE, -config.getRequestCycle());
        String requestTime = sdf.format(calendar.getTime());
        //下次同步请求时间
        map.put("syncCode", config.getSyncCode());
        if (success) {
            map.put("nextSyncTime", nextSyncTime);
        }
        map.put("requestTime", requestTime);
        map.put("lastRequestTime", config.getLastRequestTime());
        return centerDao.update("sql.update.syncConfig", map) > 0;
    }


    /**
     * @Description: 批量更新数据
     * @param: @param taskList
     * @throws:
     * @Author: 周强
     * @date: 2016年3月17日 下午4:31:22
     * @return:{返回参数名}{返回参数说明}
     * @exception:TODO
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public void updateSyncTask4Tabletd(List<TackTableResult> taskList) {
        centerDao.batchUpdate("sql.update.appTaskTabletd", taskList);
    }

    /**
     * @Description: 批量插入数据
     * @param: @param tasklist
     * @throws:
     * @Author: 周强
     * @date: 2016年3月17日 下午4:31:41
     * @return:{返回参数名}{返回参数说明}
     * @exception:TODO
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public void insertSyncTask4Tabletd(List<TackTableResult> tasklist) {
        centerDao.batchUpdate("sql.insert.appTaskTabletd", tasklist);

    }

    /**
     * @Description: 根据grid_id获取project_code
     * @param: @param code
     * @param: @return string
     * @throws:
     * @Author: 周强
     * @date: 2016年3月18日 上午10:28:37
     * @return:{返回参数名}返回String project_code 项目编码
     * @exception:TODO
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public String queryProjectcode4Tabletask(String code) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("code", code);
        return centerDao.queryForString("query.projectcode.for.tabletask", map);
    }

    /**
     * 获取房屋-网格
     *
     * @Description:
     * @param: @param curPage
     * @param: @param pageSize
     * @param: @param updated
     * @param: @return
     * @param: @throws Exception
     * @throws:
     * @Author: 周强
     * @date: 2016年3月26日 下午12:31:23
     * @return:{返回参数名}{返回参数说明}
     * @exception:TODO
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public GridHouseResponse getGridHouseResponse(int curPage, int pageSize, long updated) throws Exception {
        Map<String, String> parameters = new HashMap<String, String>();
        parameters.put("page", curPage + "");
        parameters.put("perpage", pageSize + "");
        parameters.put("updated", updated + "");
        GridHouseResponse result = super.get(GridHouseResponse.class, "/api/partner/houses/gridhouses", parameters);
        return result;
    }


    public GridResponse getGridResponse(int curPage, int pageSize, long updated) throws Exception {
        Map<String, String> parameters = new HashMap<String, String>();
        parameters.put("updated", updated + "");
        parameters.put("page", curPage + "");
        parameters.put("perpage", pageSize + "");
        GridResponse result = super.get(GridResponse.class, "/api/partner/houses/grids", parameters);
        return result;
    }

    /**
     * 调用 网格管家接口
     *
     * @Description:
     * @param: @param curPage
     * @param: @param pageSize
     * @param: @return
     * @param: @throws Exception
     * @throws:
     * @Author: huangsx
     * @date: 2016年3月26日 下午2:15:50
     * @return:{返回参数名}{返回参数说明}
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public GridStaffResponse getGridStaffResponse(Integer curPage, Integer pageSize) throws Exception {
        Map<String, String> parameters = new HashMap<String, String>();
        parameters.put("page", curPage + "");
        parameters.put("perpage", pageSize + "");
        GridStaffResponse result = super.get(GridStaffResponse.class, "/api/partner/keepers/keepergrids", parameters);
        return result;
    }

    /**
     * 根据housecode 获取houseid
     *
     * @Description:
     * @param: @param code 房屋编码
     * @param: @return
     * @throws:
     * @Author: huangsx
     * @date: 2016年3月26日 下午2:15:56
     * @return:{返回参数名}{返回参数说明}
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public String getHouseIdByHouseCode(String code) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("code", code);
        return centerDao.queryForString("query.house.id.housecode", map);
    }

    /**
     * 根据网格code获取网格id
     *
     * @Description:
     * @param: @param code网格编码
     * @param: @return
     * @throws:
     * @Author: huangsx
     * @date: 2016年3月26日 下午2:15:54
     * @return:{返回参数名}{返回参数说明}
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public String getGridIdByGridCode(String code) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("code", code);
        return centerDao.queryForString("query.grid.id.gridcode", map);
    }

    /**
     * 批量更新mid_project_house
     *
     * @Description:
     * @param: @param list
     * @throws:
     * @Author: huangsx
     * @date: 2016年3月26日 下午2:15:52
     * @return:{返回参数名}{返回参数说明}
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public void updateMidProjectHouse(List<MidProjectHouse> list) {
        centerDao.batchUpdate("sql.update.midprojecthouse2", list);
    }

    public <T> void addSyncResult(Class<T> c, List<T> list){
        centerDao.batchInsert(c, list);
    }


    /**
     * 根据电话号码获取管家信息 没有返回null
     *
     * @Description:
     * @param: @param mobile
     * @param: @return
     * @throws:
     * @Author: huangsx
     * @date: 2016年3月26日 下午2:15:47
     * @return:{返回参数名}{返回参数说明}
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public SecUser getSecUserByMobile(String mobile) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("mobile", mobile);
        return sysDao.queryForObject(SecUser.class, "query.secuser.mobile", map);
    }

    /**
     * 批量插入管家
     *
     * @Description:
     * @param: @param insertList
     * @throws:
     * @Author: huangsx
     * @date: 2016年3月26日 下午2:15:40
     * @return:{返回参数名}{返回参数说明}
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public void insertSecUserList(List<SecUser> insertList) {
        sysDao.batchInsert(SecUser.class, insertList);

    }

    /**
     * 批量更新Grid
     *
     * @Description:
     * @param: @param gridList
     * @throws:
     * @Author: huangsx
     * @date: 2016年3月26日 下午2:15:14
     * @return:{返回参数名}{返回参数说明}
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public void updateGridListByManager(List<Grid> gridList) {
        centerDao.batchUpdate(Grid.class, gridList);

    }


    /**
     * 更新冗余字段（gridName,houseName等等）
     *
     * @param requestTime
     * @return
     */
    public void updateNames(Date requestTime) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("requestTime", requestTime);
        reportDao.update("sql.update.mc_name", map);
        reportDao.update("sql.update.city_name", map);
        reportDao.update("sql.update.gridId_buildingName", map);
        reportDao.update("sql.update.grid_name", map);
        reportDao.update("sql.update.house_name", map);
        reportDao.update("sql.update.project_name", map);
        reportDao.update("sql.update.system_head_name", map);
        reportDao.update("sql.update.staff_name", map);
        reportDao.update("sql.update.status_name", map);
        reportDao.update("sql.update.business_type_name", map);
        reportDao.update("sql.update.housekeeper_name", map);
        reportDao.update("sql.update.process_way", map);
    }

    //TODO 修改类名
    public TaskCallBack4Table queryAllTask4Table(Integer curPage, Integer pageSize, String start, String end, String host) throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        map.put("page", curPage + "");
        map.put("perpage", pageSize + "");
        map.put("timeline", "1");
        map.put("updated", start);

        return this.get(TaskCallBack4Table.class, "/api/partner/houses/grids", map, host);

    }

    /**
     * @Description: Check the data after the synchronization update or insert the local table
     * @param: @param code
     * @param: @return
     * @throws:
     * @Author: 周强
     * @date: 2016年3月17日 下午4:30:01
     * @return:{返回参数名}{返回参数说明}
     * @exception:TODO
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public boolean existTabletd(String code) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("code", code);
        return centerDao.exists("sql.exist.appTaskTableTd", params);
    }
    
}
