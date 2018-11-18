package bingo.vkcrm.task.tasks;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.common.utils.DateUtil;
import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.common.BmapRequestHead;
import bingo.vkcrm.task.models.bmap.building.*;
import bingo.vkcrm.task.models.bmap.common.BmapSyncLog;
import bingo.vkcrm.task.models.bmap.common.ResponseCommonHead;
import bingo.vkcrm.task.models.bmap.house.*;
import bingo.vkcrm.task.models.bmap.tree.TreeInfo;
import bingo.vkcrm.task.models.sync.SyncConfig;
import bingo.vkcrm.task.models.sync.SyncLog;
import bingo.vkcrm.task.services.SyncService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by szsonic on 2015/11/17.
 */
public class SyncBuildTask extends AbstractQuartzTask {
    private static final Log log = LogFactory.getLog(SyncProjectTask.class);
    private static final String SYNC_CODE_BUILD = "syncBuild";//写入同步日志表中的code;用于区别同步数据接口
    private static final String SYNC_CODE_HOUSE = "syncHouse";//写入同步日志表中的code;用于区别同步数据接口
    private static final String SYNC_BUILDFUNCTION_ID = "getbuildinfobyproject";//调用战图的方法ID
    private static final String SYNC_HOUSEFUNCTION_ID = "getpropertyinfobybuild";//调用战图的方法ID
    private static final String SOURCE = "CRM";//调用战图接口的参数之一
    private static final String STATUS_UPDATED = "updated";//数据已发布且在指定时间内有修改
    private static final String STATUS_RECORDED = "recorded";// 新申请项目，未录入战图
    private static final String STATUS_NEW = "new";//战图中已录入且已发布
    private static final String STATUS_DELETED = "deleted";//数据已删除

    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        SyncService syncService = (SyncService) jobExecutionContext.getMergedJobDataMap().get("syncService");
        SyncConfig config = syncService.querySyncConfig(SYNC_CODE_HOUSE);
        Date configSyncTime = config.getNextSyncTime();
        log.debug("*****************同步<战图房屋>定时任务开始*****************");
        if (new Date().getTime() < configSyncTime.getTime()) {
            log.debug("[同步战图房屋定时任务]-开始本次同步开始时间为：" + configSyncTime + "，未到时间10秒后再试");
            log.debug("*****************同步<战图房屋>定时任务结束*****************");
            return true;//如果还没到配置时间，则不开始同步，直接退出
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date requestTime = config.getRequestTime();//获取请求参数（同步时间）
        Date lastRequestTime = config.getLastRequestTime();//上次请求时间（判断上次同步是否成功）
        SyncLog logs = syncService.querySyncLog(lastRequestTime, SYNC_CODE_HOUSE);//同步失败条数
        //有变动的楼栋信息用来调用
        List<BuildingProjectInfo> infos = new LinkedList<BuildingProjectInfo>();
        //获取所有项目，依次调用接口
        List<String> allProjectCodes = syncService.queryAllProject();
        List<TreeInfo> updateBuildingTree = new LinkedList<TreeInfo>();
        List<TreeInfo> insertBuildingTree = new LinkedList<TreeInfo>();
        String syncTime ;
        if (logs == null) {
            syncTime = sdf.format(requestTime);//代表上次同步没有失败
        } else {
            //上次同步失败
            syncTime = sdf.format(lastRequestTime);
            List<String> syncedProjectCodes = syncService.querySyncedProject(SYNC_CODE_HOUSE,syncTime);
            //从所有项目code中剔除已经同步的项目
            allProjectCodes.removeAll(syncedProjectCodes);

            //获取上次同步失败项目和楼栋信息

        }


        Integer pageSize = config.getPageSize();
        //********************续传start***************//

        //因为上次同步到这里，不确定这个项目有没有同步完，所以再加进去同步一次
        //********************续传end***************//
        //每次传一个项目code获取有变动的楼栋信息
        for (String projectCode : allProjectCodes) {
            BuildingProjectInfo buildingProjectInfo = new BuildingProjectInfo();
            infos.add(buildingProjectInfo);
            List<Map<String, String>> buildingInfoList = new LinkedList<Map<String, String>>();
            buildingProjectInfo.setProjectCode(projectCode);
            buildingProjectInfo.setBuildingInfo(buildingInfoList);
            Integer page = 1;//首次取第一页的数据
            boolean hasNextPage = true;
            while (hasNextPage) {
                RequestBuilding requestBuilding = new RequestBuilding();
                RequestBuildingParameter parameter = new RequestBuildingParameter();
                parameter.setProjectcode(projectCode);
                parameter.setPage(page + "");
                parameter.setPagesize(pageSize + "");
                parameter.setSource("ACCESS");
                parameter.setBuildingcode("");
                parameter.setSynctime(syncTime);
                requestBuilding.setHead(BmapRequestHead.getRequestHead(SYNC_BUILDFUNCTION_ID));
                requestBuilding.setParameter(parameter);
                //设置同步参数
                ResponseBuilding response = null;
                response = syncService.syncBuilding(requestBuilding);
                ResponseCommonHead responseHead = response.getHead();
                ResultBuilding resultBuilding = response.getResult();
                if (BMAP_SUCCESS_CODE.equals(responseHead.getCode())) {
                    page++;
                    Integer pageCount = response.getResult().getPagecount();
                    if (pageCount < pageSize) {
                        //如果返回的条数比实际请求的少，代表没有下一页了
                        hasNextPage = false;
                    }
                    if (resultBuilding.getBuildings().size() != 0) {
                        //如果接口调用成功，并且有楼栋信息，代表这个楼栋的信息或者房屋信息有变更
                        for (BuildingInfo buildingInfo : resultBuilding.getBuildings()) {
                            boolean isDeleted = false;
                            String status = buildingInfo.getStatus().toLowerCase();
                            if (StringUtils.isNotEmpty(status)) {
                                isDeleted = STATUS_DELETED.equals(status);
                            }
                            String buildingCode = buildingInfo.getBuildingcode();
                            String abrev = buildingInfo.getAbrev();//楼栋别名
                            String name = buildingInfo.getBuildingname();//楼栋名
                            String takenovertime=buildingInfo.getTakenovertime();//接管时间
                            if (StringUtils.isEmpty(abrev) || name.contains(abrev)) {
                                abrev = name;
                            } else if (!name.contains(abrev)) {
                                abrev = name + "(" + abrev + ")";
                            }
                            if (StringUtils.isNotEmpty(buildingCode)) {
                                //1.更新tree表
                                if (syncService.existBuilding(buildingCode)) {
                                    TreeInfo tree=new TreeInfo();
                                    tree.setId(buildingCode);
                                    tree.setName(abrev);
                                    tree.setDeleted(isDeleted);
                                    updateBuildingTree.add(tree);
                                    //如果这个楼栋编码已经存在于tree表中，则更新tree表中楼栋名称
                                } else {
                                    TreeInfo tree=new TreeInfo();
                                    tree.setId(buildingCode);
                                    tree.setParentId(buildingInfo.getProjectcode());
                                    tree.setName(abrev);
                                    tree.setDeleted(isDeleted);
                                    insertBuildingTree.add(tree);
                                    //如果这个楼栋不存在，插入数据
                                }
                                //2.记下楼栋code，用来调用获取房屋变动信息
                                int size = buildingInfoList.size();
                                if (size == 0) {
                                    Map<String, String> building = new HashMap<String, String>();
                                    building.put("code", buildingCode);
                                    building.put("name", name);
                                    building.put("abrev", abrev);
                                    building.put("takenovertime", takenovertime);
                                    buildingInfoList.add(building);
                                } else {
                                    for (int i = 0; i < buildingInfoList.size(); i++) {
                                        Map<String, String> building = buildingInfoList.get(i);
                                        String code = building.get("code");
                                        if (code.equals(buildingCode)) {
                                            break;
                                        }
                                        if (i == buildingInfoList.size() - 1) {
                                            Map<String, String> build = new HashMap<String, String>();
                                            build.put("code", buildingCode);
                                            build.put("name", name);
                                            build.put("abrev", abrev);
                                            build.put("takenovertime", takenovertime);
                                            buildingInfoList.add(build);
                                            break;
                                        }
                                    }
                                }

                            } else {
                                log.debug("楼栋编码为空字符串,项目code: " + buildingInfo.getProjectcode());
                            }
                        }
                    }
                    //   editCount = 0;
                    //  newCount = 0;
                }

            }

        }
        syncService.insertBuilding(distinctInfo(insertBuildingTree));
        syncService.updateBuilding(distinctInfo(updateBuildingTree));
        //   buildingCodes= syncService.queryBuild();
        System.out.println("=================================楼栋数据同步完毕=================================");
        System.out.println("=================================房屋同步开始=================================");
        syncHouseInfo(syncService, infos,config,syncTime);
        return true;
    }


    /**
     * 同步房屋信息
     *
     * @param syncService         同步服务
     * @param buildingProjectInfo 有变动的楼栋编码集合(只要房屋信息有变动，楼栋信息也会有变动)
     * @return
     */
    public boolean syncHouseInfo(SyncService syncService, List<BuildingProjectInfo> buildingProjectInfo,SyncConfig config,String syncTime) throws Exception {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Integer pageSize  = config.getPageSize();
        Date nextSyncTime = config.getNextSyncTime();
        int i=0;
        for (BuildingProjectInfo buildingProject : buildingProjectInfo) {//循环请求每个楼栋下有变动的房屋信息
            i++;
            Boolean successed=true;
//            List<String> buildingCodes=new ArrayList<String>();//本次循环中要调用的楼栋code
//            for (Map<String, String> map : buildingProject.getBuildingInfo()) {
//                buildingCodes.add(map.get("code"));
//            }
            SyncLog syncLog;
            String projectCode=buildingProject.getProjectCode();
            String buildCode=null;
            String exceptionMsg=null;
            try {
                int j=0;
                for (Map<String, String> buildingInfo : buildingProject.getBuildingInfo()) {
                    j++;
                    log.debug("当前请求第"+i+"个项目的第"+j+"个楼栋");
                    boolean hasNextPage = true;
                    Integer page = 1;//首次取第一页的数据
                    List<House> insertHouseList=new ArrayList<House>();
                    List<House> updateHouseList=new ArrayList<House>();
                    List<TreeInfo> insertUnitList=new ArrayList<TreeInfo>();
                    //更新楼栋相关信息

                    while (hasNextPage) {
                        //创建日志信息
                        RequestHouseParameter houseParameter = new RequestHouseParameter();
                        houseParameter.setSource(SOURCE);
                        houseParameter.setPage(page + "");
                        houseParameter.setPagesize(pageSize + "");
                        houseParameter.setBuildcode(buildingInfo.get("code"));
                        houseParameter.setPropcode("");
                        houseParameter.setSynctime(syncTime);
                        RequestHouse requestHouse = new RequestHouse();
                        requestHouse.setHead(BmapRequestHead.getRequestHead(SYNC_HOUSEFUNCTION_ID));
                        requestHouse.setParameter(houseParameter);
                        //设置请求参数
                        ResponseHouse responseHouse = syncService.syncHouse(requestHouse);//发送请求
                        if (BMAP_SUCCESS_CODE.equals(responseHouse.getHead().getCode())) {
                            String buildingCode=buildingInfo.get("code");
                            //先查出一个楼栋下所有的房屋（包括未删除的）
                            List<String> houseCodes=syncService.queryHouseCodeByBuildingCode(buildingCode);
                           // buildingCodes.remove(buildingCode);//把获取成功的楼栋code从本次同步列表中移除
                            Integer resultCount = responseHouse.getResult().getPagecount();
                            if (resultCount == null || resultCount < pageSize) {
                                hasNextPage = false;
                                //如果战图返回的结果集条目数为空或者小于当前请求条目数，则跳出循环
                            } else {
                                page++;//否则准备请求第二页数据
                            }
                            ResultHouse resultHouse = responseHouse.getResult();
                            List<HouseInfo> houseInfos = resultHouse.getProps();//获取战图传过来的房屋信息
                            if (houseInfos != null && houseInfos.size() > 0) {
                                String buildingName = buildingInfo.get("name");
                                String buildingAbrev = buildingInfo.get("abrev");
                                for (HouseInfo houseInfo : houseInfos) {
                                    House house=new House();
                                    house.setProjectCode(projectCode);
                                    house.setBuildingName(buildingName);
                                    house.setBuildingAbrev(buildingAbrev);
                                    buildCode=houseInfo.getBuildcode();
                                    house.setBuildCode(buildCode);//楼栋code);

                                    house.setDeliverTime(houseInfo.getDeliverdate());//对应deliverTime （交付日期）
                                    house.setCheckInTime(houseInfo.getOccupydate());//对应checkInTime（入住日期）
                                    house.setSetArea(houseInfo.getInnerarea());//套内面积,对应setArea
                                    house.setBuiltUpArea(houseInfo.getGrossarea());//建筑面积，对应builtUpArea
                                    house.setFloor(houseInfo.getFloor());//楼层
                                    String unit=houseInfo.getUnit();
                                    house.setUnit(houseInfo.getUnit());//单元
                                    house.setUnitId(unit+"unit"+buildCode);
                                    house.setOrientation(houseInfo.getOrient());//朝向,对应orientation
                                    String nameFormal = houseInfo.getPropnm();//房屋名称,对应name_formal（main_house）
                                    house.setNameFormal(nameFormal);
                                    house.setAssistCode(houseInfo.getSupplementarycode());//辅助编码
                                    house.setType(houseInfo.getPropertytype());//房屋类型
                                    String name = houseInfo.getAbrev();//房屋别名
                                    if (StringUtils.isEmpty(name) || nameFormal.contains(name)) {
                                        name = nameFormal;
                                    } else if (!nameFormal.contains(name)) {
                                        name = nameFormal + "(" + name + ")";
                                    }
                                    house.setName(name);
                                    house.setRoomNumber(houseInfo.getRoomnmbr());//房号,对应roomNumber（main_house）
                                    String code=houseInfo.getPropcode();
                                    house.setCode(code);//房屋编码.对应code(main_house)
                                    house.setLayout(houseInfo.getLayout());//对应layout(main_house_detail)需要从layout字典表中获取对应的code再插入
                                    house.setStatusuptime(houseInfo.getStatusuptime());//修改时间
                                    house.setEquityType(houseInfo.getPrpright());
                                    house.setSyncTime(nextSyncTime);
                                    //判断该房屋存不存在
                                    if (houseCodes.contains(code)) {
                                        updateHouseList.add(house);
                                    } else {
                                        //插入房屋数据
                                        String id = UUIDUtil.create();//创建一个ID用于创建房屋基本信息(主键)和详细信息
                                        house.setId(id);
                                        house.setStatus("0");
                                        house.setHouseId(id);//用于插入项目房屋中间表
                                        insertHouseList.add(house);
                                    }
                                    //确认树结构中存不存在单元层级，单元ID规则为“单元名+"unit"+楼栋code”，如：00unit1018A110000000000MC1。
                                    if (StringUtils.isNotEmpty(unit)) {//有些房屋数据有问题，有楼层，没单元
                                        String treeUnit = unit + "unit" + buildingInfo.get("code");
                                        if (!syncService.existUnit(treeUnit)) {
                                            TreeInfo treeInfo=new TreeInfo();
                                            treeInfo.setId(unit + "unit" + buildingInfo.get("code"));
                                            treeInfo.setParentId(buildingInfo.get("code"));
                                            treeInfo.setName(unit);
                                            treeInfo.setLevelType("6");
                                            treeInfo.setLevelTypeText("UNIT");
                                            treeInfo.setIsOuter("0");//单元不涉及内外盘，给个默认值
                                            if(!insertUnitList.contains(treeInfo)){
                                                insertUnitList.add(treeInfo);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(insertHouseList.size()!=0){
                        syncService.insertHouse(insertHouseList);
                    }
                    if(insertUnitList.size()!=0){
                        syncService.insertUnit(insertUnitList);
                    }
                    if(updateHouseList.size()!=0){
                        syncService.updateHouse(updateHouseList);
                    }
                    //更新该楼栋下的楼栋接管时间
                    String takenovertime=buildingInfo.get("takenovertime");
                    syncService.updateTakenOverTime(takenovertime,buildingInfo.get("code"));
                    //操作数据
                }
            } catch (Exception e) {
                successed=false;
                exceptionMsg=e.getMessage();
                log.info(e.getMessage());
                syncService.updateSyncConfig(config,false);//如果同步失败，5分钟后再次调用
                return true;
            } finally {
                syncLog=new SyncLog();
                syncLog.setSuccessed(successed);
                syncLog.setId(UUIDUtil.create());
                syncLog.setProjectCode(projectCode);
                syncLog.setBuildingCode(buildCode);
                syncLog.setMsg(exceptionMsg);
                syncLog.setSyncCode(SYNC_CODE_HOUSE);
                syncLog.setRequestTime(sdf.parse(syncTime));
                syncService.insertSyncLog(syncLog);
            }
        }
        config.setLastRequestTime(sdf.parse(syncTime));

        syncService.updateSyncConfig(config,true);//代表同步成功
        syncService.updateSyncLog(syncTime,SYNC_CODE_HOUSE);
        syncService.updateProcedure();
        return true;
    }

    public List<TreeInfo> distinctInfo(List<TreeInfo> list) {
        List<TreeInfo> distinctList = new ArrayList<TreeInfo>();
        // List<CarportInfo> rtList=new ArrayList<CarportInfo>();
        for (int i = 0; i < list.size(); i++) {
            if(i==0){
                distinctList.add(list.get(i));
            }
            TreeInfo tmp=list.get(i);
            for (int j = 0; j < distinctList.size(); j++) {
                TreeInfo distinct= distinctList.get(j);
                if (tmp.equals(distinct)) {
                    distinctList.remove(j);
                    distinctList.add(j, tmp);
                    break;
                }
                if (j == distinctList.size() - 1) {
                    distinctList.add(tmp);
                    break;
                }
            }
        }
        return distinctList;
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
