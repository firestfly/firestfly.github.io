package bingo.vkcrm.service.task.v1.services;

import java.text.SimpleDateFormat;
import java.util.*;

import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.task.v1.models.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bingo.dao.Page;
import bingo.vkcrm.service.service.BaseService;

/**
 * Created by szsonic on 2015/9/14.
 */
@Service
public class TaskService extends BaseService {
    @Autowired
    ProjectNoticeService projectNoticeService;
    /**
     * 根据任务ID获取任务信息
     * @param id
     * @return
     */
    public TaskRecords queryTaskRecordsDetail(String id){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("id", id);
        String sql="service.query.taskrecordsdetail";
        return bizRoDao.queryForObject(TaskRecords.class, sql, params);
    }

    /**
     * 新增任务(本地),同时插入任务来源和任务级别
     */
    @Transactional
    public String addTaskRecord4Local(TaskRecords taskRecords,User user){
        taskRecords.setCreator(user.getName());
        taskRecords.setCreatorId(user.getId());
        if(taskRecords.getIsSync()==null){
            taskRecords.setIsSync(false);//保存到本地的任务需要定时同步
        }
        String sql="sql.insert.taskrecord";
        if(bizDao.insert(sql, taskRecords)>0){
            TaskRecordsExtension taskRecordsExtension=new TaskRecordsExtension();
            taskRecordsExtension.setTaskId(taskRecords.getId());
            taskRecordsExtension.setLevelType(taskRecords.getLevelType());
            taskRecordsExtension.setSource(taskRecords.getSource());
            addTaskRecordsExtension(taskRecordsExtension,user);
        }
        return taskRecords.getId();//新增任务时返回id


    }


    /**
     * 更新任务(本地),同时更新任务来源和任务级别
     */
    @Transactional
    public void updateTaskRecord4Local(TaskRecords taskRecords,User user){
        taskRecords.setCreator(user.getName());
        taskRecords.setCreatorId(user.getId());
            if(bizDao.update(taskRecords)>0){
                Map<String,Object> params=new HashMap<String, Object>();
                params.put("taskId",taskRecords.getId());
                params.put("levelType",taskRecords.getLevelType());
                params.put("source", taskRecords.getSource());
                bizDao.update("sql.update.taskrecordextension",params);
            }
    }







    /**
     * 判断一条任务记录是否存在
     * @param id 任务ID
     * @return Boolean
     */

    public Boolean queryTaskRecordExist(String id){
        return bizRoDao.exists(TaskRecords.class,id);
    }



    /**
     * 根据来电号码获取跟当前号码相关的项目、房屋信息草稿
     * @param creatorId 话务员ID
     * @param page 分页信息
     * @return
     */
    public List<TaskRecords> queryTaskDraft(String creatorId,Page page) throws Exception{
        String sql="sql.query.taskDraft";
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("creatorId", creatorId);
        return bizRoDao.queryForListPage(TaskRecords.class, page, sql, null, params, true);
    }



    /**
     * 新增任务来源和任务级别
     * @param taskRecordsExtension
     * @param user
     * @return
     */
    public Boolean addTaskRecordsExtension(TaskRecordsExtension taskRecordsExtension,User user){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("source",taskRecordsExtension.getSource());
        params.put("taskId",taskRecordsExtension.getTaskId());
        params.put("levelType",taskRecordsExtension.getLevelType());
        params.put("creator",user.getName());
        params.put("creatorId",user.getId());
        return bizDao.insert("sql.insert.taskRecordsExtension",params)>0;
    }



    /**
     * 从本地数据库获取任务信息
     * @param taskNo 任务流水号
     * @param title 任务标题
     * @param businessType 任务类型
     * @param source 任务来源
     * @param startTime 开始日期
     * @param endTime 结束日期
     * @param projectCode 项目编码
     * @param houseCode 房屋编码
     * @param mobile 报事人手机
     * @param levelType 任务级别
     * @param status 任务来源
     * @param creatorId 登陆人ID
     * @param page 分页信息
     * @return
     */
    public List<TaskRecords> queryTaskInfoPage(String taskId,String taskNo, String title, String AbusinessType,String BbusinessType,String businessType, String source,
            String startTime, String endTime, String projectCode, String houseCode, String mobile, String levelType,String status,String creatorId,Page page) {
    	Map<String, Object> map = new HashMap<String, Object>();
    	map.put("taskId", taskId);
    	map.put("taskNo", taskNo);
    	map.put("title", title);
    	if(StringUtils.isNotEmpty(businessType)){
        	map.put("businessType", businessType);
    	}else if(StringUtils.isNotEmpty(BbusinessType)){
    		map.put("BbusinessType", BbusinessType);
    	}else if(StringUtils.isNotEmpty(AbusinessType)){
    		map.put("AbusinessType", AbusinessType);
    	}
    	map.put("source", source);
    	if(StringUtils.isNotEmpty(startTime) && StringUtils.isEmpty(endTime)){
    		map.put("startTime", startTime);
    	}else if(StringUtils.isNotEmpty(endTime) && StringUtils.isEmpty(startTime)){
    		map.put("endTime", endTime);
    	}else if(StringUtils.isNotEmpty(startTime) && StringUtils.isNotEmpty(endTime)){
        	map.put("startDate", startTime);
        	map.put("endDate", endTime);
    	}
    	map.put("projectCode", projectCode);
    	map.put("houseCode", houseCode);
    	map.put("mobile", mobile);
    	map.put("status", status);
    	map.put("creatorId", creatorId);
		map.put("levelType", levelType);
		List<TaskRecords> task = bizRoDao.queryForListPage(TaskRecords.class, page, "sql.query.task.bytask", null, map, true);
		return task;
    }


    /**
     * 根据所属房屋 parentCode 联动查询业务信息，若参数为空 则查询最上级的业务类型
     * @return
     */
    public List<Businesstype> getBusinessType(){
    	Map<String,Object> map = new HashMap<String, Object>();
//    	if(StringUtils.isNotEmpty(parentCode)){
//    		map.put("parentCode", parentCode);
//    	}else{
//    		map.put("bs", 1);
//    	}
    	List<Businesstype> list = bizRoDao.queryForList(Businesstype.class, "sql.query.task.businesstype", map);
    	return list;
    }




    /**
     * 接收超时任务
     * @param taskNo 任务流水号
     * @param abnormalType 异常任务类型
     * @return ResultToApp
     */
    public Boolean addAbnormalTaskRecord(String taskNo,Integer abnormalType){
        AbnormalTaskRecord taskRecord=new AbnormalTaskRecord();
        taskRecord.setAbnormal_type(abnormalType);
        taskRecord.setTaskNo(taskNo);
        taskRecord.setCtime(new Date());
        taskRecord.setCompleted(0);
        taskRecord.setFollowup(0);
        return bizDao.insert(taskRecord)>0;
    }

    /**
     * 返回超时任务的条目数
     * @param followup 是否跟进 0:未跟进，1:已跟进
     * @return 条目数
     */
    public Integer queryAbnormalTaskRecordCount(Integer followup) {
        Map<String,Object> params=new HashMap<String, Object>();
        if(followup!=null){
            params.put("followup",followup);
        }
        //params.put("userId",userId);
        return bizRoDao.queryForInt("sql.query.task.AbnormalTaskCount",params);
    }

    /**
     * 获取超时任务列表
     * @param userId 当前登录人ID
     * @param page 分页信息
     * @return
     */
    public List<AbnormalTaskRecord> queryAllotTaskList(String userId,Page page){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("userId",userId);
        return bizRoDao.queryForListPage(AbnormalTaskRecord.class,page,"sql.query.task.AbnormalTaskList", null, params, true);
    }

    /**
     * 获取一条超时任务信息
     * @param taskNo 任务流水号
     * @return  超时任务信息
     */
    public AbnormalTaskRecord queryAbnormalTask(String taskNo,Integer followup,Integer completed){
        Map<String,Object> params=new HashMap<String, Object>();
        if(taskNo!=null){
            params.put("taskNo",taskNo);
        }
        if(followup!=null){
            params.put("followup",followup);
        }
        if(completed!=null){
            params.put("completed",completed);
        }
        return bizRoDao.queryForObject(AbnormalTaskRecord.class,"sql.query.task.AbnormalTask",params);
    }


    /**
     * 获取一条超时任务信息(用于app更新超时任务的任务状态)
     * @param taskNo 任务流水号
     * @return  超时任务信息
     */
    public AbnormalTaskRecord queryAbnormalTask(String taskNo){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("taskNo",taskNo);
        return bizRoDao.queryForObject(AbnormalTaskRecord.class,"sql.query.task.abnormalTask4App",params);
    }

    /**
     * 更新app任务状态
     * @param taskNo 任务流水号
     * @param task_status app任务状态
     * @return
     */
    public Boolean updateAbnormalTaskRecord(String taskNo,String task_status,Date completed_time){
        Map<String,Object> params=new HashMap<String, Object>();
        if(completed_time!=null){
            params.put("completed_time",completed_time);
        }
        params.put("taskNo",taskNo);
        params.put("task_status",task_status);
        params.put("completed",1);//无论是无类型的还是无人处理的，都再设置成completed
        return bizDao.update("sql.update.task.AbnormalTask",params)>0;
    }


    /**
     * 更新一条超时任务信息
     * @param abnormalTaskRecord 超时任务信息
     * @return Boolean
     */
    public Boolean updateAbnormalTask(AbnormalTaskRecord abnormalTaskRecord){
        return bizDao.update(abnormalTaskRecord)>0;
    }


    /**
     * 插入本地timeLine日志表，动作说明
     * type说明：
     * 动作编码    动作说明             参数格式
     * 1、       接听电话动作       来电号码：phoneNo,来电时间:callTime
     * 2、       新增客户          客户名称： name，联系电话：phoneNo
     * 3、       修改客户          客户名称：name
     * 4、       拨打电话          拨打电话的号码：phoneNo
     * 5、       保存草稿         （无需传参）
     * 6、       提交任务         创建来源source(传选中的文字内容)，处理方法processingWay（checkbox的文字内容）
     * 7、       发送短信         发送的号码：phoneNo，短信内容content
     * 8、       回访动作         回访号码phoneNo
     * 9、       任务完成/取消     （无需传参）
     * 10、      任务追加         追加内容content
     * 11、      获取任务         （无需传参）
     * 12、      任务升级拨打电话动作  被呼叫人姓名name,呼叫号码phoneNo
     * 13、      任务升级后修改任务类型 （无需传参）
     * 通用参数为cTime(动作发生时间)，actCode(动作编码),taskId(任务ID)
     * 例如1号动作，参数格式为(cTime,phoneNo,1)
     * 5号动作，参数格式为(cTime,5)
     */
    public Boolean addLocalTimeLine(String taskId,String taskNo,String cTime,int actCode,String phoneNo,String callTime,String name,String fullName,String mainMobile,String source,String processingWay,String content,User user) throws Exception{
        Map<String,Object> params=new HashMap<String, Object>();
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time=sdf.format(new Date());
        params.put("telephonistId",user.getId());
        params.put("logTime",time);
        params.put("taskId",taskId);
        params.put("taskNo",taskNo);
        StringBuffer  logInfo=new StringBuffer();
        logInfo=logInfo.append("呼叫中心").append(user.getName()).append("在").append(time);
        switch (actCode){
            case 1:
                logInfo=new StringBuffer();
                params.put("taskStage",1);
                logInfo.append("呼叫中心").append(user.getName()).append("在").append(callTime);
                logInfo.append("接听了").append(phoneNo).append("号码的来电");
                break;
            case 2:
                params.put("taskStage",1);
                logInfo.append("新增了客户,姓名：").append(fullName).append(",电话号码:").append(mainMobile);
                break;
            case 3:
                params.put("taskStage",1);
                logInfo.append("修改了客户信息");
                break;
            case 4:
                params.put("taskStage", 1);
                logInfo.append("拨打了电话:").append(phoneNo);
                break;
            case 5:
                params.put("taskStage", 1);
                logInfo.append("保存了草稿");
                break;
            case 6:
                params.put("taskStage", 1);
                logInfo.append("因").append(source).append("创建了任务，该任务的当前状态为:").append(processingWay);
                break;
            case 7:
                params.put("taskStage", 1);
                logInfo.append("给").append(phoneNo).append("发送了短信，短信内容为：").append(content);
                break;
            case 8:
                params.put("taskStage", 3);
                logInfo.append("因为回访而给").append(phoneNo).append("拨打了电话");
                break;
            case 9:
                params.put("taskStage", 3);
                logInfo.append("操作了任务完成/取消");
                if(content!=null&&!"".equals(content)){
                    logInfo.append(",原因是：").append(content);
                }
                break;
            case 10:
                params.put("taskStage", 3);
                logInfo.append("添加了任务描述:").append(content);
                break;
            case 11:
                params.put("taskStage", 3);
                logInfo.append("正在核查任务超时的原因");
                break;
            case 12:
                params.put("taskStage", 3);
                logInfo.insert(0, "因任务超时，").append("给值班经理（姓名：").append(name).append("，电话:").append(phoneNo).append("）拨打了电话");
                break;
            case 13:
                params.put("taskStage",3);
                logInfo.insert(0,"因任务超时，").append("对任务分派了业务类型");
                break;
            case 14:
                params.put("taskStage", 1);
                logInfo.append("因").append(source).append("补录了任务，该任务的当前状态为:").append(processingWay);
                break;
            case 15:
                params.put("taskStage", 1);
                logInfo=new StringBuffer();
                logInfo.append("呼叫中心").append(fullName).append("在").append(callTime).append("接听了").append(phoneNo).append("号码");
                break;
        }
        params.put("content",logInfo.toString());
        bizDao.insert("sql.insert.task.localTimeline",params);
        Map<String,String> param=new HashMap<String, String>();
        param.put("taskId",taskId);
        if(StringUtils.isEmpty(taskNo)){
            String task_no=bizRoDao.queryForObjectQuietly(String.class,"sql.query.tasknobyid",param);
            if(StringUtils.isNotEmpty(task_no)){
                param.put("taskNo",task_no);
                bizDao.update("sql.update.timelinebytaskno",param);
            }
        }

        return true;
    }

    /**
     * 根据任务流水号获取本地timeLine
     * @param taskNo 任务流水号
     * @return
     */
    public List<TimeLine> getLocalTimeLine(String taskNo){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("taskNo",taskNo);
        return bizRoDao.queryForList(TimeLine.class, "sql.query.task.localTimeline",params);
    }


    /**
     * 联动查询满意度回访内容选项
     * @return
     */
    public List<TaskSatisfaction> getTaskSatisfaction(){
        return bizRoDao.queryForList(TaskSatisfaction.class, "sql.query.task.satisfaction",null);
    }


    /**
     * 分配一个任务给前端
     * @param userId
     * @return
     */
    @Transactional
    public AbnormalTaskRecord allotAbnormalTask(String userId) {
        AbnormalTaskRecord abnormalTaskRecord=queryAbnormalTask(null,0,0);
        //获取一个无人跟进并且无人处理的超时任务，获取到以后设置为已经跟进，跟进时间，跟进人信息等。
        if(abnormalTaskRecord!=null){
            abnormalTaskRecord.setFollowup_time(new Date());
            abnormalTaskRecord.setFollowup(1);
            abnormalTaskRecord.setFollowup_uid(userId);
            updateAbnormalTask(abnormalTaskRecord);
            return abnormalTaskRecord;
        }else{
            return null;
        }

    }


    public List<AbnormalTaskRecord> getFollowAbnormalTask(String userId,String taskNo,String abnormal_type,String completed,String followName,Page page){
        Map<String,Object> params=new HashMap<String, Object>();
        //params.put("userId",userId);
        if(taskNo!=null){
            if(!"".equals(taskNo)){
                params.put("taskNo",taskNo);
            }
        }
        if(abnormal_type!=null){
            if(!"".equals(abnormal_type)){
                params.put("abnormal_type",abnormal_type);
            }
        }
        if(completed!=null){
            if(!"".equals(completed)){
                params.put("completed",completed);
            }
        }
        if(followName!=null){
            if(!"".equals(followName)){
                params.put("followName",followName);
            }
        }
        return bizRoDao.queryForListPage(AbnormalTaskRecord.class,page,"sql.query.task.followAbnormalTask",null,params,true);
    }

    /**
     * 由于创建任务时，没有任务流水号(taskNo)，所以在创建任务后把taskNo关联到任务表中以便查询timeline
     * @return
     */
    public Integer updateTimeLine4CreateTask(String taskId,String taskNo){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("taskId",taskId);
        params.put("taskNo",taskNo);
        return  bizDao.update("sql.update.task.timeline4createTask",params);


    }

    /**
     * 展示任务(同步任务表)的基本信息(用于报表)
     * @param startTime
     * @param endTime
     * @param projectCode
     * @param houseCode
     * @param content
     * @return
     */
    public List<SyncTaskRecord> querySyncTask(Date startTime,Date endTime,String projectCode,String houseCode,String content,Page page){
        Map<String,Object> params=new HashMap<String, Object>();
        if(startTime!=null){
            params.put("startTime",startTime);
        }
        if(endTime!=null){
            params.put("endTime",endTime);
        }
        if(projectCode!=null){
            params.put("projectCode",projectCode);
        }
        if(houseCode!=null){
            params.put("houseCode",houseCode);
        }
        if(content!=null){
            params.put("content",content);
        }
        if(page!=null){
            return bizRoDao.queryForListPage(SyncTaskRecord.class,page,"sql.query.syncTask",null,params,true);
        }else{
            return bizRoDao.queryForList(SyncTaskRecord.class,"sql.query.syncTask",params);
        }

    }

    /**
     * 根据任务(草稿)ID删除草稿
     */
    public Boolean deleteTaskDraft(String id) {
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("id",id);
        return bizDao.delete("sql.delete.taskDraft",params)>0;
    }

    /**
     * 查询一个超时任务是否存在
     * @param taskNo
     * @return
     */
    public Boolean queryExistAbnormalTask(String taskNo,Integer abnormalType){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("taskNo",taskNo);
        params.put("abnormalType",abnormalType);
        return bizDao.exists("sql.exist.abnormalTask",params);

    }
}







