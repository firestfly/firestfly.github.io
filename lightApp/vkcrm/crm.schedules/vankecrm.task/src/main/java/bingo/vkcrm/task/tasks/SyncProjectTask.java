package bingo.vkcrm.task.tasks;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.service.DictionaryService;
import bingo.vkcrm.common.utils.DateUtil;
import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.common.BmapRequestHead;
import bingo.vkcrm.task.models.sync.SyncConfig;
import bingo.vkcrm.task.models.bmap.common.BmapSyncLog;
import bingo.vkcrm.task.models.bmap.common.ResponseCommonHead;
import bingo.vkcrm.task.models.bmap.project.*;
import bingo.vkcrm.task.services.SyncService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by szsonic on 2015/11/11.
 */
public class SyncProjectTask extends AbstractQuartzTask {
    private static final Log log = LogFactory.getLog(SyncProjectTask.class);
    private static final String SYNC_CODE = "syncProject";//写入同步日志表中的code;用于区别同步数据接口
    private static final String FUNCTION_ID = "getpagedprojects";//同步项目的方法ID（用于调战图接口，固定参数）
    private static final String STATUS_UPDATED = "updated";//数据已发布且在指定时间内有修改
    private static final String STATUS_RECORDED = "recorded";// 新申请项目，未录入战图
    private static final String STATUS_NEW = "new";//战图中已录入且已发布
    private static final String STATUS_DELETED = "deleted";//数据已删除

    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        SyncService syncService = (SyncService) jobExecutionContext.getMergedJobDataMap().get("syncService");
        SyncConfig config = syncService.querySyncConfig(SYNC_CODE);
        Date configSyncTime= config.getNextSyncTime();
        System.out.println("*****************同步<战图项目>定时任务开始*****************");
        if (new Date().getTime() < configSyncTime.getTime()) {
            System.out.println("[同步战图项目定时任务]-开始本次同步开始时间为："+configSyncTime+"，未到时间10秒后再试");
            System.out.println("*****************同步<战图项目>定时任务结束*****************");
            return true;//如果还没到配置时间，则不开始同步，直接退出
        }
        DictionaryService dictionaryService = new DictionaryService();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date requestTime=config.getRequestTime();//获取请求参数（同步时间）
        // Date lastRequestTime=config.getLastRequestTime();//上次请求时间（判断上次同步是否成功）
        //  int failCount=syncService.querySyncLog(lastRequestTime,SYNC_CODE);//同步失败条数
        String syncTime = sdf.format(requestTime);
        Integer page = 1;//首次取第一页的数据
        Integer pageSize = config.getPageSize();
        boolean hasNextpage = true;
        while (hasNextpage) {

            RequestInfo requestInfo = new RequestInfo();
            RequestParameter parameter = new RequestParameter();
            parameter.setPage(page + "");
            parameter.setPagesize(pageSize + "");
            parameter.setSynctime(syncTime);
            requestInfo.setHead(BmapRequestHead.getRequestHead(FUNCTION_ID));
            requestInfo.setParameter(parameter);
            ResponseProject response = syncService.syncProject(requestInfo);
            ResponseCommonHead responseHead = response.getHead();
            ResultProject bmapResult = response.getResult();

            //调用战图接口发送请求,如果调用成功并且有数据,则处理数据
            if ((BMAP_SUCCESS_CODE.equals(responseHead.getCode())) && (bmapResult.getPagecount() > 0)) {
                List<String> projectCodeList = syncService.queryAllProject();//同步前数据库所有的项目code
                List<String> companyCodeList = syncService.queryAllCompanyCode();
                List<Map<String, String>> companyInfo = new LinkedList<Map<String, String>>();//一次请求中所有的公司信息
                List<ProjectInfo> projectInfos = bmapResult.getProjects();//战图返回的项目信息

                page++;//下次调用下一页的数据

                //遍历数据，先获取一次请求中所有的公司信息（不重复的，用于更新或插入公司数据）
                for (ProjectInfo projectInfo : projectInfos) {
                    String companyCode = projectInfo.getCompanycode();//战图获取到的公司code
                    String companyName = projectInfo.getCompany();//战图获取到的公司名称
                    Map<String, String> companyMap = new HashMap<String, String>();
                    if (StringUtils.isNotEmpty(companyCode)) {
                        if (companyInfo.size() == 0) {
                            companyMap.put("companyCode", companyCode);
                            companyMap.put("companyName", companyName);
                            companyInfo.add(companyMap);
                        } else {
                            for (int i = 0; i < companyInfo.size(); i++) { //重复的公司数据不需要添加（因为一次请求中可能有很多项目属于同一个公司，这样不用每个项目每次都更新公司数据）
                                Map<String, String> map = companyInfo.get(i);
                                if (companyCode.equals(map.get("companyCode"))) {
                                    break;//退出当前循环，继续遍历projectInfo集合
                                }
                                if (i == companyInfo.size() - 1) {
                                    companyMap.put("companyCode", companyCode);
                                    companyMap.put("companyName", companyName);
                                    companyInfo.add(companyMap);//已经更新的
                                }
                            }
                        }
                    }
                }
                //更新公司信息
                for (Map<String, String> map : companyInfo) {
                    String officeRootId = ApplicationContext.getProperty("tree.root.officeId", "c835e4f8513711e599cad00d52eb478c");
                    String companyCode = map.get("companyCode");
                    String companyName = map.get("companyName");
                    //1.先判断公司表中有无此公司
                    //2 如果有，更新公司数据。如果没有，代表树结构中一定没有
                    //直接更新数据名称
                    if (companyCodeList.contains(companyCode)) {
                        syncService.updateCompanyInfo(companyCode, companyName);
                    } else {
                        //如果这个公司不存在，且tree表中肯定也不存在；那么插入一条公司数据(main_company)和一条树结构数据（挂在非住宅类层级下）；
                        String companyId = UUIDUtil.create().toUpperCase();//创建一个UUID，用于关联公司表和树结构表
                        syncService.insertCompanyInfo(companyId, companyCode, companyName);//往公司表插入数据
                        syncService.insertCompanyInfo4Tree(companyId, officeRootId, companyName);//往树结构表插入数据
                    }
                    //3.判断树结构中有无company（根据项目code取，有的话直接取出company表中的ID用于插入到树结构中）
                    Boolean hasCompany4Tree = syncService.existCompanyIdByCode(companyCode);//这是判断
                    if (!hasCompany4Tree) {
                        String companyId = syncService.queryCompanyIdByCode(companyCode);
                        //String companyId =syncService
                        //更新树结构中公司信息
                        //代表项目树中不存在该公司
                        syncService.insertCompanyInfo4Tree(companyId, officeRootId, companyName);//往树结构表插入数据
                    }
                }

                for (ProjectInfo projectInfo : projectInfos) {
                    //处理调用接口获取到的项目信息
                    Integer isDeleted = 0;//默认插入不是已经删除的数据
                    String status = projectInfo.getStatus().toLowerCase();//该项目的状态
                    if (StringUtils.isNotEmpty(status)) {
                        if (STATUS_RECORDED.equals(status)) {
                            continue;//如果是“新申请项目，未录入战图”的状态，则不做任何处理；
                        } else {
                            isDeleted = STATUS_DELETED.equals(status) ? 1 : 0;
                        }
                    }
                    String projectCode = projectInfo.getProjectcode();
                    String companyCode = projectInfo.getCompanycode();
                    String projectName = projectInfo.getProjectname();
                    String cityCode = dictionaryService.getCodeFuzzy("CityCode", projectInfo.getCity());
                    //根据数据字典的value拿code，蛋疼。
                    String abrev = projectInfo.getAbrev();//项目别名
                    if (StringUtils.isEmpty(abrev) || projectName.contains(abrev)) {
                        abrev = projectName;//别名如果为空,或者项目全名包含了项目别名，则用项目全名
                    } else if (!projectName.contains(abrev)) {
                        abrev = projectName + "(" + abrev + ")";//如果项目全名不包含项目别名，则用“项目全名（项目别名）”此种格式
                    }

                    if (StringUtils.isNotEmpty(projectCode)) {
                        //去查询该项目code是否已经存在，不存在新增，否则修改
                        Boolean hasProject = projectCodeList.contains(projectCode);
                        if (hasProject) {
                            syncService.updateProject(projectCode, abrev, projectInfo.getCompany(), projectInfo.getCompanycode(), projectInfo.getProjecttype(), projectInfo.getProjectsource(), projectName, cityCode, isDeleted);
                            //如果存在则更新项目数据//
                            if (syncService.existProject4Tree(projectCode)) {
                                syncService.updateTree(projectCode, abrev, isDeleted);
                            } else {
                                //项目存在，树不存在
                                //查出项目ID，插入数据
                                //String id = UUIDUtil.create();
                                String id=syncService.queryProjectIdByCode(projectCode);

                                String mcCode = syncService.queryProjectBelongMc(projectCode);//如果能查到运营中心code，代表这个项目是非住宅类
                                boolean isOffice = false;
                                if (mcCode == null) {
                                    isOffice = true;
                                } else {
                                    if ("NULL".equals(mcCode) || ("null").equals(mcCode)) {
                                        isOffice = true;
                                    }
                                }
                                if (!isOffice) {//住宅类
                                    syncService.insertTree4Project(id, projectCode, abrev, isDeleted);
                                } else {//非住宅类
                                    syncService.insertTree4Project4Office(id, companyCode, abrev, isDeleted);
                                }
                            }
                        } else {
                            //否则新增数据
                            String id = UUIDUtil.create();
                            syncService.insertProject(id, projectCode, abrev, projectInfo.getProjectname(), projectInfo.getCompany(), projectInfo.getCompanycode(), projectInfo.getProjecttype(), projectInfo.getProjectsource(), cityCode, isDeleted);
                            if (syncService.existProject4Tree(projectCode)) {
                                syncService.updateTree(projectCode, abrev, isDeleted);
                            } else {
                                //项目不存在，树不存在
                                //查出项目ID，插入数据
                                //去mid_project_mc表查询，该项目属于哪个运营中心
                                String mcName = syncService.queryProjectBelongMc(projectCode);
                                boolean isOffice = false;
                                if (mcName == null) {
                                    isOffice = true;
                                } else {
                                    if ("NULL".equals(mcName) || ("null").equals(mcName)) {
                                        isOffice = true;
                                    }
                                }
                                if (!isOffice) {//住宅类
                                    syncService.insertTree4Project(id, projectCode, abrev, isDeleted);
                                } else {//非住宅类
                                    syncService.insertTree4Project4Office(id, companyCode, abrev, isDeleted);
                                }
                            }
                        }


                    }
                }
                if (bmapResult.getPagecount() < pageSize) {
                    //如果返回的记录条数比定义的小，代表是最后一页
                    hasNextpage = false;//不再调用战图接口
                }
            }
        }
        log.debug("*****************检查管理员是否拥有所有的项目权限开始*****************");
        //查出管理员角色的用户ID
//        List<String> managers=syncService.querySystemManagers();
//        //查出所有的项目ID
//        List<String> projectIds=syncService.queryProjectids();
//        //判断管理员是否有该项目权限，如果没有则添加
//        for (String managerId : managers) {
//            for (String projectId : projectIds) {
//                //如果不存在，则插入权限数据
//                if(!syncService.existPermission(projectId,managerId)){
//                    syncService.insertPermission(projectId,managerId);
//                }
//            }
//        }
        log.debug("*****************检查管理员是否拥有所有的项目权限结束*****************");
        log.debug("*****************同步战图项目定时任务结束*****************");
        config.setLastRequestTime(config.getRequestTime());
        syncService.updateSyncConfig(config,true);
        return true;
    }
    @Override
    public boolean onBefore(JobExecutionContext jobExecutionContext) throws Exception {
        return true;
    }

    @Override
    public void onException(JobExecutionContext jobExecutionContext, String fromMethod, Exception exception) {

    }

    @Override
    public boolean onAfter(JobExecutionContext jobExecutionContext) throws Exception {
        return true;
    }


}
