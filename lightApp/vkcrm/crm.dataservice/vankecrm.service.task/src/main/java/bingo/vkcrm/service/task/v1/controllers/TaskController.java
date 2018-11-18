package bingo.vkcrm.service.task.v1.controllers;

import java.util.*;
import java.util.regex.Pattern;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.service.exceptions.ServiceException;
import bingo.vkcrm.service.model.DictionaryItem;
import bingo.vkcrm.service.service.DictionaryService;
import bingo.vkcrm.service.task.v1.models.*;

import bingo.vkcrm.service.task.v1.models.callbacks.ProjectManager;
import bingo.vkcrm.service.task.v1.services.AppRestSvc;
import bingo.vkcrm.service.task.v1.services.ProjectNoticeService;
import bingo.vkcrm.common.utils.CacheUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.ResourceAccessException;

import bingo.common.core.utils.StringUtils;
import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.task.v1.Version;
import bingo.vkcrm.service.task.v1.services.TaskService;

/**
 * Created by szsonic on 2015/9/14.
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class TaskController extends BaseController {
    private static final Log log = LogFactory.getLog(TaskController.class);
    @Autowired
    private TaskService taskService;
    @Autowired
    private ProjectNoticeService projectNoticeService;
    /**
     * app接口服务
     */
    @Autowired
    private AppRestSvc appRestSvc;
    @Autowired
    private DictionaryService dictionaryService;

    /**
     * 根据任务ID获取任务信息
     * szsonic
     *
     * @param id 任务ID
     * @return
     */
    @RequestMapping(value = "/callcenter/task/taskdetail", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCustomerDetail(String id) {
        ServiceResult serviceResult = new ServiceResult();
        try {
            TaskRecords taskRecords = taskService.queryTaskRecordsDetail(id);
            serviceResult.setMessage("true");
            serviceResult.setSuccess(true);
            serviceResult.setDetails(taskRecords);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(this, e);
            ServiceResult.error(e);
        }
        return serviceResult;
    }


    /**
     * 新增任务记录
     *
     * @param taskRecords 任务记录
     * @return
     * @author szsonic
     */
    @RequestMapping(value = "/callcenter/task/addTaskRecord", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addTaskRecord(TaskRecords taskRecords) throws Exception {
        ServiceResult serviceResult = new ServiceResult();
        String taskId = taskRecords.getId();
        //判断前台传来的ID是否在数据库中已经存在
        Boolean exist = taskService.queryTaskRecordExist(taskId);
        boolean finishTask;
        Integer taskdeal = taskRecords.getTaskdeal();
        taskRecords.setProcessingWay(taskdeal);
        // 呼叫中心
        //  if (taskRecords.getProcessingWay() != null && taskRecords.getSource().equals("5")) {
        // 如果处理方式选择了“由呼叫中心处理”或“直接归档”，那么直接关闭该任务
        // 1、代表由呼叫中心处理
        // 2、直接归档
        finishTask = taskdeal == 1 || taskdeal == 2 || taskdeal == 4;
        // }
        // 指挥中心
//        if (taskRecords.getTaskdeal() != null && taskRecords.getSource().equals("4")) {
//            // 如果指挥中心处理方式选择了“由呼叫中心处理”或“直接归档”，那么直接关闭该任务
//            // taskdeal = 4代表“直接归档”
//            finishTask = taskRecords.getTaskdeal() == 4;
//        }

        try {
            //是否要调助这儿接口，如果前台点的是保存草稿按钮，则该值1,即不调用接口,否则调用助这儿
            Integer status = taskRecords.getStatus();
            if (status == 1) {
                //如果是保存草稿，则保存到本地
                if (!exist) {
                    taskService.addTaskRecord4Local(taskRecords, getCurrentUser());
                    serviceResult.setMessage("保存本地成功!");
                    serviceResult.setSuccess(true);
                    serviceResult.setDetails(taskId);
                } else {
                    taskService.updateTaskRecord4Local(taskRecords, getCurrentUser());
                    serviceResult.setMessage("更新任务成功！");
                    serviceResult.setSuccess(true);
                }
            } else {
                //否则调用助这儿
                TaskRecordCallback taskRecordCallback = appRestSvc.addTaskRecord(taskRecords, getCurrentUser());
                if ("0".equals(taskRecordCallback.getCode())) {
                    //如果调用接口成功，设置任务流水号（task_no），设置无需同步
                    String taskNo = taskRecordCallback.getResult().getTask_id();//获取助这儿返回的task_No
                    taskRecords.setTaskNo(taskNo);
                    taskRecords.setIsSync(true);
                    taskRecords.setLastSyncTime(new Date());
                    if (!exist) {
                        taskService.addTaskRecord4Local(taskRecords, getCurrentUser());
                        serviceResult.setMessage("app新增任务接口调用成功，保存到本地！");
                        serviceResult.setDetails(taskNo);

                    } else {
                        taskService.updateTaskRecord4Local(taskRecords, getCurrentUser());
                        serviceResult.setMessage("app新增任务接口调用成功,更新到本地!");
                        serviceResult.setDetails(taskNo);
                    }
                    if (finishTask) {
                        TaskRecordCallback finishCallback = appRestSvc.finishTask(taskNo);
                        if ("0".equals(finishCallback.getCode())) {
                            serviceResult.setMessage("app新增任务接口调用成功,成功关闭任务!");
                            serviceResult.setDetails(taskNo);
                        }
                    }
                    //把创建成功的taskNo关联到日志表（timeline）中
                    taskService.updateTimeLine4CreateTask(taskId, taskNo);
                    serviceResult.setSuccess(true);
                } else {
                    //如果住这儿返回的是失败，保存到本地,并设置为需要同步（住这儿APP）
                    taskRecords.setIsSync(false);
                    if (!exist) {
                        taskService.addTaskRecord4Local(taskRecords, getCurrentUser());
                        serviceResult.setMessage("app新增任务接口返回信息失败，保存到本地！接口失败原因：" + taskRecordCallback.getError());
                        serviceResult.setDetails(taskId);
                    } else {
                        taskService.updateTaskRecord4Local(taskRecords, getCurrentUser());
                        serviceResult.setMessage("app新增任务接口返回信息失败,更新到本地!接口失败原因：" + taskRecordCallback.getError());
                    }
                    serviceResult.setSuccess(false);
                }
            }
        } catch (ResourceAccessException rae) {
            //如果接口不通，还是保存到本地
            log.error("接口连接失败！保存到本地!");
            taskRecords.setIsSync(false);
            if (!exist) {
                serviceResult.setMessage("app新增任务接口连接超时，保存到本地！");
                serviceResult.setDetails(taskService.addTaskRecord4Local(taskRecords, getCurrentUser()));
            } else {
                taskService.updateTaskRecord4Local(taskRecords, getCurrentUser());
                serviceResult.setMessage("app新增任务接口连接超时,更新到本地!");
            }
            serviceResult.setSuccess(false);
        }
        return serviceResult;
    }

    /**
     * 根据来电号码获取跟当前号码相关的项目、房屋信息
     *
     * @param phoneNo 来电号码
     * @return
     * @author szsonic
     */
    @RequestMapping(value = "/callcenter/task/queryTaskHouseInfoList/{curPage}/{pageSize}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryTaskHouseInfoList
    (@PathVariable(value = "curPage") Integer curPage, @PathVariable(value = "pageSize") Integer pageSize, String phoneNo) throws Exception {
        ServiceResult serviceResult = new ServiceResult();
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        List<TaskHouseInfo> taskHouseInfoList = null;
        ListResult listResult = null;
        try {
            //taskHouseInfoList=new ListResult<TaskHouseInfo>(page,taskService.queryTaskHouseInfoListFromApp(phoneNo,page));
            TaskListCallback callback = appRestSvc.queryTasks(null, null, null, null, null, null, null, null, phoneNo, null, null, null, null, null, curPage, pageSize);
            page.setTotalRows(callback.getResult().getTotal());
            if ("0".equals(callback.getCode())) {
                //如果返回成功
                taskHouseInfoList = new ArrayList<TaskHouseInfo>();
                List<TaskInfo> taskInfos = callback.getResult().getTasks();
                ArrayList<String> houseCodeList = new ArrayList<String>();
                for (TaskInfo info : taskInfos) {
                    if (houseCodeList.contains(info.getHouse_code())) {
                        continue;
                    }
                    houseCodeList.add(info.getHouse_code());
                    TaskHouseInfo taskHouseInfo = new TaskHouseInfo();
                    String projectCode = info.getProject_code();
                    taskHouseInfo.setProjectCode(projectCode);
                    taskHouseInfo.setProjectName(info.getProject_name());
                    taskHouseInfo.setHouseCode(info.getHouse_code());
                    taskHouseInfo.setHouseName(info.getHouse_name());
                    Map<String, String> proInfo = CacheUtil.get(Map.class, CachePrefix.PrjCode, info.getProject_code());
                    if (proInfo != null) {
                        taskHouseInfo.setProjectId(proInfo.get("id"));
                    }
                    //根据项目CODE去查，该项目下有无公告
                    taskHouseInfo.setIsHasNotice(projectNoticeService.queryHasProjectNotice(info.getProject_code()));
                    taskHouseInfoList.add(taskHouseInfo);
                }
                listResult = new ListResult(page, taskHouseInfoList);
                serviceResult.setMessage("app查询接口调用成功，查询助这儿数据！");
                serviceResult.setSuccess(true);
            } else {
                serviceResult.setMessage("app查询接口调用失败,错误代码:" + callback.getCode());
                serviceResult.setSuccess(false);
            }

        } catch (ResourceAccessException ras) {
            serviceResult.setMessage("app查询接口连接超时！");
            serviceResult.setSuccess(false);

        } finally {
            serviceResult.setDetails(listResult);
        }
        return serviceResult;

    }

    /**
     * 任务追加接口
     *
     * @param taskNo 任务流水号
     * @param remark 备注
     * @return ServiceResult
     * @author szsonic
     */
    @RequestMapping(value = "/callcenter/task/addTaskRemark", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addTaskRemark(String taskNo, String remark) throws Exception {
        ServiceResult serviceResult = new ServiceResult();
        TaskRecordCallback callBackResult = appRestSvc.addTaskRemark(taskNo, remark);
        if ("0".equals(callBackResult.getCode())) {
            serviceResult.setSuccess(true);
            serviceResult.setMessage("任务追加成功！");
        } else {
            serviceResult.setSuccess(false);
            serviceResult.setDetails(callBackResult.getResult());
            serviceResult.setMessage("任务追加失败！错误信息：" + callBackResult.getError());
        }
        return serviceResult;
    }


    /**
     * 任务草稿列表
     *
     * @param curPage  当前页
     * @param pageSize 条目数
     * @return ServiceResult
     * @author szsonic
     */
    @RequestMapping(value = "/callcenter/task/queryTaskDraft/{curPage}/{pageSize}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryTaskDraft(@PathVariable(value = "curPage") Integer curPage, @PathVariable(value = "pageSize") Integer pageSize) throws Exception {
        ServiceResult serviceResult = new ServiceResult();
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        ListResult<TaskRecords> taskDraftList = new ListResult<TaskRecords>(page, taskService.queryTaskDraft(getCurrentUser().getId(), page));
        serviceResult.setDetails(taskDraftList);
        serviceResult.setSuccess(true);
        serviceResult.setMessage("true");
        return serviceResult;
    }


    /**
     * 删除草稿
     *
     * @param id 任务/草稿ID
     * @return ServiceResult
     */
    @RequestMapping(value = "/callcenter/task/taskDraft/{id}", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult queryTaskDraft(@PathVariable(value = "id") String id) throws Exception {
        return ServiceResult.succeed(taskService.deleteTaskDraft(id));
    }


    /**
     * 从其他接口获取任务信息
     *
     * @param taskNo       任务流水号
     * @param title        任务标题
     * @param businessType 任务类型
     * @param source       任务来源
     * @param startTime    开始日期
     * @param endTime      结束日期
     * @param projectCode  项目编码
     * @param houseCode    房屋编码
     * @param mobile       报事人手机
     * @param curPage      查询页 默认 1
     * @param pageSize     单页记录条数 <=30
     * @return
     */
    @RequestMapping(value = "/callcenter/task/app/list", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getAppTaskList(String taskNo, String title, String businessType, String source,
                                        String startTime, String endTime, String projectCode, String houseCode, String mobile, String status, String crm_duty, String crm_source, String crm_evaluation, String crm_priority, Integer curPage, Integer pageSize) throws Exception {
        ServiceResult serviceResult = new ServiceResult();
        try {
            Page page = new Page();
            page.setPage(curPage);
            page.setPageSize(pageSize);
            if (StringUtils.isEmpty(taskNo)) {
                taskNo = null;
            }
            TaskListCallback task = appRestSvc.queryTasks(taskNo, title, businessType, source, startTime, endTime, projectCode, houseCode, mobile, status, crm_duty, crm_source, crm_evaluation, crm_priority, curPage, pageSize);
            if (curPage != null && pageSize != null && task!=null) {
                page.setTotalRows(task.getResult().getTotal());
                return ServiceResult.succeed(new ListResult<TaskInfo>(page, task.getResult().getTasks()));
            } else {
                return ServiceResult.succeed(task);
            }

        } catch (ResourceAccessException rae) {
            serviceResult.setSuccess(false);
            serviceResult.setMessage("接口查询超时!");
            return serviceResult;
        }
    }

    /**
     * 从本地获取任务信息
     *
     * @param taskNo       任务流水号
     * @param title        任务标题
     * @param businessType 任务类型
     * @param source       任务来源
     * @param startTime    开始日期
     * @param endTime      结束日期
     * @param projectCode  项目编码
     * @param houseCode    房屋编码
     * @param mobile       报事人手机
     * @param levelType    任务级别
     * @param status       任务状态(草稿,保存)
     * @param curPage      查询页 默认 1
     * @param pageSize     单页记录条数 <=30
     * @return
     */
    @RequestMapping(value = "/callcenter/task/local/list", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getLocalTaskList(String taskId, String taskNo, String title, String AbusinessType, String BbusinessType, String businessType, String source,
                                          String startTime, String endTime, String projectCode, String houseCode, String mobile, String levelType, String status, int curPage, int pageSize) throws Exception {
        String creatorId = null;
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        if (StringUtils.isNotEmpty(status)) {
            creatorId = getCurrentUser().getId();
        }
        List<TaskRecords> tasklist = taskService.queryTaskInfoPage(taskId, taskNo, title, AbusinessType, BbusinessType, businessType, source, startTime, endTime, projectCode, houseCode, mobile, levelType, status, creatorId, page);
        ListResult<TaskRecords> listResult = new ListResult<TaskRecords>(page, tasklist);
        return ServiceResult.succeed(listResult);
    }

    /**
     * 根据所属业务parentCode 联动查询业务信息
     * 例：
     * 第一级：BUCR01
     * 第二级：BUCR0101
     * 第三级：BUCR010103
     *
     * @return
     */
    @RequestMapping(value = "/callcenter/task/businesstype", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryBusinessType() throws Exception {
        List<Businesstype> list = taskService.getBusinessType();
        List<Businesstype> returnList = new LinkedList<Businesstype>();
        List<Businesstype> level1List = new LinkedList<Businesstype>();
        List<Businesstype> level2List = new LinkedList<Businesstype>();
        List<Businesstype> level3List = new LinkedList<Businesstype>();
        for (Businesstype businesstype : list) {
            String parentCode = businesstype.getParentCode();
            if (parentCode == null) {
                level1List.add(businesstype);
                continue;
            }
            if (parentCode.length() == 6) {
                level2List.add(businesstype);
                continue;
            }
            if (parentCode.length() == 8) {
                level3List.add(businesstype);
            }

        }
        returnList.addAll(level1List);
        returnList.addAll(level2List);
        returnList.addAll(level3List);
        return ServiceResult.succeed(returnList);
    }

    /**
     * 调用app接口结束任务
     */
    @RequestMapping(value = "/callcenter/task/finishTask", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult finishTask(String taskNo, String remark) {
        try {
            ServiceResult serviceResult = new ServiceResult();
            TaskRecordCallback taskRecordCallback = appRestSvc.finishTask(taskNo);
            //如果有信息，要调用app追加接口追加任务信息
            if (remark != null) {
                if (!"".equals(remark)) {
                    appRestSvc.addTaskRemark(taskNo, remark);
                }
            }
            if ("0".equals(taskRecordCallback.getCode())) {
                serviceResult.setSuccess(true);
            } else {
                serviceResult.setSuccess(false);
            }
            serviceResult.setDetails(taskRecordCallback);
            return serviceResult;
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return ServiceResult.error(e);
        }
    }

    /**
     * 调用app接口任务优先级
     *
     * @param taskNo   任务流水号
     * @param priority 任务优先级
     * @return ServiceResult
     */
    @RequestMapping(value = "/callcenter/task/priorityTask", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult priorityTask(String taskNo, String priority) {
        try {
            ServiceResult serviceResult = new ServiceResult();
            TaskRecordCallback taskRecordCallback = appRestSvc.priorityTask(taskNo, priority);
            if ("0".equals(taskRecordCallback.getCode())) {
                serviceResult.setSuccess(true);
            } else {
                serviceResult.setSuccess(false);
            }
            serviceResult.setDetails(taskRecordCallback);
            return serviceResult;
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return ServiceResult.error(e);
        }

    }


    /**
     * 调用app接口添加任务(报事)来源
     *
     * @param taskNo       任务流水号
     * @param businessType 任务来源code
     * @return ServiceResult
     */
    @RequestMapping(value = "/callcenter/task/businessTypeTask", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult businessTypeTask(String taskNo, String businessType) {
        try {
            ServiceResult serviceResult = new ServiceResult();
            TaskRecordCallback taskRecordCallback = appRestSvc.businessTypeTask(taskNo, businessType);
            if ("0".equals(taskRecordCallback.getCode())) {
                serviceResult.setSuccess(true);
            } else {
                serviceResult.setSuccess(false);
            }
            serviceResult.setDetails(taskRecordCallback);
            return serviceResult;
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return ServiceResult.error(e);
        }
    }

    /**
     * 调用app接口任务评价
     *
     * @param content 评价内容
     * @return ServiceResult
     */
    @RequestMapping(value = "/callcenter/task/evaluationTask", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult evaluationTask(String taskNo, String content) {
        try {
            ServiceResult serviceResult = new ServiceResult();
            TaskRecordCallback taskRecordCallback = appRestSvc.evaluationTask(taskNo, content);
            if ("0".equals(taskRecordCallback.getCode())) {
                serviceResult.setSuccess(true);
            } else {
                serviceResult.setSuccess(false);
            }
            serviceResult.setDetails(taskRecordCallback);
            return serviceResult;
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return ServiceResult.error(e);
        }

    }


    /**
     * 调用app添加任务定责数据
     *
     * @param content 评价内容
     * @return ServiceResult
     */
    @RequestMapping(value = "/callcenter/task/dutyTask", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult dutyTask(String taskNo, String content) {
        try {
            ServiceResult serviceResult = new ServiceResult();
            TaskRecordCallback taskRecordCallback = appRestSvc.dutyTask(taskNo, content);
            if ("0".equals(taskRecordCallback.getCode())) {
                serviceResult.setSuccess(true);
            } else {
                serviceResult.setSuccess(false);
            }
            serviceResult.setDetails(taskRecordCallback);
            return serviceResult;
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return ServiceResult.error(e);
        }

    }


    /**
     * 接收无任务类型的超时任务
     *
     * @param task_no 任务流水号
     * @return ServiceResult
     */
    @RequestMapping(value = "/callcenter/task/timeout/noType", method = RequestMethod.GET)
    @ResponseBody
    public ResultToApp noTypeTask(String task_no) {
        ResultToApp resultToApp = new ResultToApp();
        try {
            boolean result = Pattern.matches("^\\d{16,}$", task_no);
            if (result) {
                //1:无任务类型 2:无人处理
                if (taskService.addAbnormalTaskRecord(task_no, 1)) {
                    resultToApp.setStatus("1");
                    resultToApp.setMsg("新增无任务类型的超时任务成功");
                }
            } else {
                resultToApp.setStatus("0");
                resultToApp.setMsg("task_no格式错误!");
            }
        } catch (Exception e) {
            resultToApp.setStatus("0");
            resultToApp.setMsg("task_no error");
            e.printStackTrace();
            log.error(e.getMessage());
        }
        return resultToApp;
    }


    /**
     * 接收无人处理超时任务
     *
     * @param task_no 任务流水号
     * @return ServiceResult
     */
    @RequestMapping(value = "/callcenter/task/timeout/unattendedProcessing", method = RequestMethod.GET)
    @ResponseBody
    public ResultToApp unattendedProcessingTask(String task_no) {
        boolean result = Pattern.matches("^\\d{16,}$", task_no);
        ResultToApp resultToApp = new ResultToApp();
        //1代表无人处理 2无任务类型
        try {
            if (result) {
                if (taskService.addAbnormalTaskRecord(task_no, 2)) {
                    resultToApp.setStatus("1");
                    resultToApp.setMsg("新增无人处理超时任务成功");
                }
            } else {
                resultToApp.setStatus("0");
                resultToApp.setMsg("task_no格式错误!");
            }
        } catch (Exception e) {
            resultToApp.setStatus("0");
            resultToApp.setMsg("task_no error");
            e.printStackTrace();
            log.error(e.getMessage());
        }
        return resultToApp;
    }


    /**
     * 更新超时任务状态
     *
     * @param task_no 任务流水号
     * @return ServiceResult
     * <p>
     * 首先获取这个单号的任务，并且任务状态是null的数据，如果不是null，代表这个任务肯定已经更新过，不管它。
     * 再判断这个任务是类型是1还是2，如果是1（无类型），则只更新任务状态，不更新完成时间
     * 如果是2（无人处理），则两者都更新
     */
    @RequestMapping(value = "/callcenter/task/timeout/status", method = RequestMethod.POST)
    @ResponseBody
    public ResultToApp statusTask(String task_no, String status) {
        ResultToApp resultToApp = new ResultToApp();
        try {
            AbnormalTaskRecord abnormalTaskRecord = taskService.queryAbnormalTask(task_no);//
            Boolean success=false;
            if (abnormalTaskRecord != null) {
                Integer abnormalType = abnormalTaskRecord.getAbnormal_type();
                //Boolean hasUnattendedProcessing = taskService.queryExistAbnormalTask(task_no, 2);
                if (abnormalType == 2) {
                    success = taskService.updateAbnormalTaskRecord(task_no, status, new Date());
                } else {
                    success = taskService.updateAbnormalTaskRecord(task_no, status, null);
                }
            }
            if (success) {
                resultToApp.setStatus("1");
                resultToApp.setMsg("更新状态成功!");
                return resultToApp;
            } else {
                resultToApp.setStatus("0");
                resultToApp.setMsg("超时任务中没有该任务单！");
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
        return resultToApp;
    }


    /**
     * 获取所有超时未处理任务
     *
     * @return ServiceResult
     */
    @RequestMapping(value = "/callcenter/task/allAbnormalTask", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getAbnormalTaskNo() {
        String userId = getCurrentUser().getId();
        //a代表无人跟进并且未完成的任务，b代表所有未完成的任务
        List<Integer> count = new ArrayList<Integer>();
        count.add(taskService.queryAbnormalTaskRecordCount(0));
        count.add(taskService.queryAbnormalTaskRecordCount(null));
        return ServiceResult.succeed(count);
    }

    /**
     * 获取一条超时未处理任务
     *
     * @return ServiceResult
     */
    @RequestMapping(value = "/callcenter/task/allotAbnormalTask", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult allotAbnormalTask() {
        ServiceResult serviceResult = new ServiceResult();
        AbnormalTaskRecord abnormalTaskRecord = taskService.allotAbnormalTask(getCurrentUser().getId());
        if (abnormalTaskRecord == null) {
            serviceResult.setMessage("无异常任务");
            serviceResult.setSuccess(false);
        } else {
            serviceResult.setMessage("获取异常任务成功");
            serviceResult.setSuccess(true);
        }
        serviceResult.setDetails(abnormalTaskRecord);
        return serviceResult;
    }


    /**
     * 获取所有超时未处理任务
     *
     * @param curPage  当前页
     * @param pageSize 页面大小
     * @return ServiceResult
     */
    @RequestMapping(value = "/callcenter/task/abnormalTaskList/{curPage}/{pageSize}", method = RequestMethod.GET)
    @ResponseBody
    public ListResult getAbnormalTaskList(@PathVariable(value = "curPage") Integer curPage, @PathVariable(value = "pageSize") Integer pageSize) throws Exception {
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        return new ListResult<AbnormalTaskRecord>(page, taskService.queryAllotTaskList(getCurrentUser().getId(), page));

    }

    /**
     * 提交无类型超时任务（调用APP接口）
     *
     * @param businessType 业务类型 例如:BUCR030202(业务类型的最后一级的编码)
     * @param taskNo       任务流水号
     * @return ServiceResult
     * 在处理无类型超时任务时，点击提交按钮调用
     */
    @RequestMapping(value = "/callcenter/task/deal/abnormalTaskRecord/noType", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult dealNoTypeAbnormalTaskRecord(String taskNo, String businessType) throws Exception {
        TaskRecordCallback callback = appRestSvc.businessTypeTask(taskNo, businessType);
        ServiceResult serviceResult = new ServiceResult();
        if ("0".equals(callback.getCode())) {
            //如果操作成功,同时先把该异常任务设置为已完成
            //调用发布抢单接口
            TaskRecordCallback publishCallBack = appRestSvc.publish(taskNo);
            if (publishCallBack != null) {
                if ("0".equals(publishCallBack.getCode())) {
                    AbnormalTaskRecord abnormalTaskRecord = taskService.queryAbnormalTask(taskNo, 1, 0);//找到这个已经跟进并且未完成的超时无类型任务
                    abnormalTaskRecord.setCompleted(1);
                    abnormalTaskRecord.setCompleted_time(new Date());
                    taskService.updateAbnormalTask(abnormalTaskRecord);
                    serviceResult.setMessage("提交无类型超时任务成功！");
                    serviceResult.setSuccess(true);
                }
            }
        } else {
            serviceResult.setSuccess(false);
            serviceResult.setMessage("调用接口失败!code:" + callback.getCode() + ",错误原因：" + callback.getError());
        }
        return serviceResult;
    }

    /**
     * 提交无人处理超时任务（调用APP接口）
     *
     * @param taskNo 任务流水号
     * @param remark 任务备注
     * @return ServiceResult
     * 在处理无人处理超时任务，点击提交按钮调用。此时本地CRM数据库没有任何改变。
     */
    @RequestMapping(value = "/callcenter/task/deal/abnormalTaskRecord/unattendedProcessing", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult dealUnattendedProcessingAbnormalTaskRecord(String taskNo, String remark) throws Exception {
        ServiceResult serviceResult = new ServiceResult();
        //调任务追加接口
        TaskRecordCallback taskRecordCallback = appRestSvc.addTaskRemark(taskNo, remark);
        if ("0".equals(taskRecordCallback.getCode())) {
            serviceResult.setSuccess(true);
        } else {
            serviceResult.setSuccess(false);
        }
        serviceResult.setDetails(taskRecordCallback);
        return serviceResult;
    }


    /**
     * 插入本地timeLine日志表，动作说明
     * type说明：
     * 动作编码    动作说明                参数格式
     * 1、       接听电话动作               来电号码：phoneNo,来电时间:callTime
     * 2、       新增客户                  客户名称： name，联系电话：phoneNo
     * 3、       修改客户                  客户名称：name
     * 4、       拨打电话                  拨打电话的号码：phoneNo
     * 5、       保存草稿                 （无需传参）
     * 6、       提交任务                  创建来源source(传选中的文字内容)，处理方法processingWay（checkbox的文字内容）
     * 7、       发送短信                  发送的号码：phoneNo，短信内容content
     * 8、       回访动作                  回访号码phoneNo
     * 9、       任务完成/取消             （无需传参）
     * 10、      任务追加                  追加内容content
     * 11、      获取任务                 （无需传参）
     * 12、      任务升级拨打电话动作        被呼叫人姓名name,呼叫号码phoneNo
     * 13、      任务升级后修改任务类型     （无需传参）
     * 14、      补录任务                  补录任务来源source(传选中的文字内容)，处理方法processingWay（checkbox的文字内容）
     * 通用必传参数为cTime(动作发生时间)，actCode(动作编码),taskId(任务ID)
     * 例如1号动作，参数格式为cTime,phoneNo,actCode,taskId,callTime
     */
    @RequestMapping(value = "/callcenter/task/timeline/local", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addLocalTimeLine(String taskId, String taskNo, String cTime, int actCode, String phoneNo, String callTime, String name, String fullName, String mainMobile, String source, String processingWay, String content) throws Exception {
        return ServiceResult.succeed(taskService.addLocalTimeLine(taskId, taskNo, cTime, actCode, phoneNo, callTime, name, fullName, mainMobile, source, processingWay, content, getCurrentUser()));
    }

    /**
     * 根据任务流水号获取任务timeLine(包括本地和app)
     *
     * @param taskNo 任务流水号
     * @return
     */
    @RequestMapping(value = "/callcenter/task/timeline/local/{taskNo}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getLocalTimeLine(@PathVariable(value = "taskNo") String taskNo) throws Exception {
        List<TimeLine> timelines = new LinkedList<TimeLine>();
        List<TimeLine> localTimelines = taskService.getLocalTimeLine(taskNo);
        List<AppTimeline> appTimelines = appRestSvc.queryTasks(taskNo, null, null, null, null, null, null, null, null, null, null, null, null, null, 1, 5).getResult().getTasks().get(0).getTimeline();
        //先循环本地日志(timeline)并添加(创建前)
        for (TimeLine localTimeline : localTimelines) {
            if (localTimeline.getTaskStage() == 1) {
                timelines.add(localTimeline);
            }
        }
        //添加app日志,把日志按顺序排列，因为APP过来的timeline是倒序
        TimeLine localTl;
        if(appTimelines!=null){
            for (int k = appTimelines.size(), i = k - 1; i >= 0; i--) {
                localTl = new TimeLine();
                localTl.setLogTime(appTimelines.get(i).getTime());
                localTl.setContent(appTimelines.get(i).getMsg());
                localTl.setName(appTimelines.get(i).getCreator());
                localTl.setStatus(appTimelines.get(i).getStatus());
                localTl.setTaskStage(2);//2代表appTimeLine
                timelines.add(localTl);
            }
        }
        //再循环本地日志(timeline)并添加(创建后)
        for (TimeLine localTimeline : localTimelines) {
            if (localTimeline.getTaskStage() == 3) {
                timelines.add(localTimeline);
            }
        }
        return ServiceResult.succeed(timelines);
    }

    /**
     * 获取满意度回访选项内容
     */
    @RequestMapping(value = "/callcenter/task/getTaskSatisfaction", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getTaskSatisfaction() {
        return ServiceResult.succeed(taskService.getTaskSatisfaction());
    }

//    /**
//     *app推送一个任务
//     */
//    public void task(AbnormalTaskRecord abnormalTaskRecord){
//        //1.如果坐席人员点击按钮，获取一个任务后
//        abnormalTaskRecord.setFollowup(1);//设为已经跟进
//        abnormalTaskRecord.setFollowup_uid(getCurrentUser().getId());//设置跟进人ID
//        abnormalTaskRecord.setFollowup_time(new Date());//设置跟进时间
//        //2.如果是无类型任务
//        if(abnormalTaskRecord.getAbnormal_type().equals(1)){
//            //调用APP添加任务类型接口
//            abnormalTaskRecord.setCompleted(1);//标记为已完成
//        }else if(abnormalTaskRecord.getAbnormal_type().equals(2)){
//            //调用APP追加任务接口
//        }
//        //3.app调接口更改状态
//        //
//        //update abnormalTaskRecord set status=XX where followup=1 and completed=0 and type=2 and taskNo=XX
//        //
//    }

    /**
     * 获取超时任务列表（完成和未完成的）
     *
     * @param curPage       当前页
     * @param pageSize      页面大小
     * @param taskNo        任务流水号
     * @param abnormal_type 超时任务类型  //1代表无人处理 2无任务类型
     * @param completed     是否完成 0：未完成  1：已完成
     * @param followupName  跟进人姓名(支持模糊查询)
     * @return 超时任务列表
     */
    @RequestMapping(value = "/callcenter/task/getFollowAbnormalTask/{curPage}/{pageSize}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getFollowAbnormalTask(@PathVariable(value = "curPage") int curPage, @PathVariable(value = "pageSize") int pageSize, String taskNo, String abnormal_type, String completed, String followupName) {
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        return ServiceResult.succeed(new ListResult<AbnormalTaskRecord>(page, taskService.getFollowAbnormalTask(getCurrentUser().getId(), taskNo, abnormal_type, completed, followupName, page)));
    }

    /**
     * 获取房屋下任务完成百分比
     */
    @RequestMapping(value = "/callcenter/task/getTaskPercent/{houseCode}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getTaskPercent(@PathVariable(value = "houseCode") String houseCode) {
        return ServiceResult.succeed(appRestSvc.getTaskPercent(houseCode));
    }

    /**
     * 获取项目负责人数据
     */
    @RequestMapping(value = "/callcenter/task/staffsInfo", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getStaffsInfo(String projectCode, String businessType) throws Exception {
        StaffInfoResult callback = appRestSvc.getStaffsInfo(projectCode, businessType);
        return ServiceResult.succeed(callback);
    }

    /**
     * 获取同步过的任务信息（用于报表）
     */
    @RequestMapping(value = "/callcenter/task/syncTasks", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getSyncTasks(Date startTime, Date endTime, String projectCode, String houseCode, String content, Integer curPage, Integer pageSize) throws Exception {
        if (curPage != null && pageSize != null) {
            Page page = new Page();
            page.setPage(curPage);
            page.setPageSize(pageSize);
            return ServiceResult.succeed(new ListResult<SyncTaskRecord>(page, taskService.querySyncTask(startTime, endTime, projectCode, houseCode, content, page)));
        } else {
            return ServiceResult.succeed(taskService.querySyncTask(startTime, endTime, projectCode, houseCode, content, null));
        }
    }


    /**
     * 获取项目负责人数据
     */
    @RequestMapping(value = "/callcenter/task/staffsName", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getStaffsName(String staffId) throws Exception {
        return ServiceResult.succeed(appRestSvc.getStaffName(staffId));
    }

    @RequestMapping(value = "/projects/{code}/managers")
    @ResponseBody
    public ServiceResult getManagers(@PathVariable(value = "code") String projectCode) throws Exception {
        try {
            List<ProjectManager> managers = appRestSvc.queryProjectManagers(projectCode);
            return ServiceResult.succeed(managers);
        } catch (ServiceException ex) {
            log.error("接口返回失败数据:" + ex.getCode() + " | " + ex.getErrorMessage(), ex);
            return ServiceResult.error(ex.getCode() + "|" + ex.getErrorMessage());
        } catch (Exception ex) {
            log.error("调用接口过程中出现异常", ex);
            return ServiceResult.error("");
        }
    }
}
