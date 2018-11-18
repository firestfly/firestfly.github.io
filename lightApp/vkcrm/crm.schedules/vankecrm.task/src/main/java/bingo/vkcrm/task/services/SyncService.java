package bingo.vkcrm.task.services;

import bingo.common.core.ApplicationContext;
import bingo.dao.IDao;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.enums.AccessTypes;
import bingo.vkcrm.service.model.InterfaceAccessLog;
import bingo.vkcrm.service.model.RestAccessLog;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.service.DictionaryService;
import bingo.vkcrm.service.utils.*;
import bingo.vkcrm.task.models.bmap.house.House;
import bingo.vkcrm.task.models.bmap.tree.TreeInfo;
import bingo.vkcrm.task.models.sync.SyncConfig;
import bingo.vkcrm.task.models.bmap.building.RequestBuilding;
import bingo.vkcrm.task.models.bmap.building.ResponseBuilding;
import bingo.vkcrm.task.models.bmap.carport.*;
import bingo.vkcrm.task.models.bmap.common.BmapSyncLog;
import bingo.vkcrm.task.models.bmap.house.RequestHouse;
import bingo.vkcrm.task.models.bmap.house.ResponseHouse;
import bingo.vkcrm.task.models.bmap.project.RequestInfo;
import bingo.vkcrm.task.models.bmap.project.ResponseProject;
import bingo.vkcrm.task.models.sync.SyncLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by szsonic on 2015/11/13.
 */
@Service
public class SyncService extends BaseService {
    @Autowired
    IDao centerDao;
    @Autowired
    DictionaryService dictionaryService;

    private final String url = ApplicationContext.getProperty("bmap.hostAndPort");

    public ResponseProject syncProject(RequestInfo requestInfo) throws Exception {
        Date startTime = null;
        ResponseProject callback = null;
        String exceptionMsg = null;
        try {
            startTime = new Date();
            callback = HttpClientUtilForAppSubscribe.post(requestInfo, ResponseProject.class, url);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, url, JsonUtil.toJson(requestInfo), JsonUtil.toJson(callback), "调用战图接口获取项目", exceptionMsg);
        }
        return callback;
    }

    public ResponseBuilding syncBuilding(RequestBuilding requestBuilding) throws Exception {
        Date startTime = null;
        ResponseBuilding callback = null;
        String exceptionMsg = null;
        try {
            startTime = new Date();
            callback = HttpClientUtilForAppSubscribe.post(requestBuilding, ResponseBuilding.class, url);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, url, JsonUtil.toJson(requestBuilding), JsonUtil.toJson(callback), "调用战图接口获取楼栋", exceptionMsg);
        }
        return callback;

        //return HttpClientUtilForAppSubscribe.post(requestBuilding, ResponseBuilding.class, url);
    }

    public ResponseHouse syncHouse(RequestHouse requestHouse) throws Exception {
        Date startTime = null;
        ResponseHouse callback = null;
        String exceptionMsg = null;
        try {
            startTime = new Date();
            callback = HttpClientUtilForAppSubscribe.post(requestHouse, ResponseHouse.class, url);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, url, JsonUtil.toJson(requestHouse), JsonUtil.toJson(callback), "调用战图接口获取房屋", exceptionMsg);
        }
        return callback;
        // return HttpClientUtilForAppSubscribe.post(requestHouse, ResponseHouse.class, url);
    }

    public ResponseLot syncLot(RequestLot requestLot) throws Exception {
        Date startTime = null;
        ResponseLot callback = null;
        String exceptionMsg = null;
        try {
            startTime = new Date();
            callback = HttpClientUtilForAppSubscribe.post(requestLot, ResponseLot.class, url);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, url, JsonUtil.toJson(requestLot), JsonUtil.toJson(callback), "调用战图接口获取车场信息", exceptionMsg);
        }
        return callback;
        //return HttpClientUtilForAppSubscribe.post(requestLot, ResponseLot.class, url);
    }

    public ResponseCarport syncCarport(RequestCarport requestCarport) throws Exception {
        Date startTime = null;
        ResponseCarport callback = null;
        String exceptionMsg = null;
        try {
            startTime = new Date();
            callback = HttpClientUtilForAppSubscribe.post(requestCarport, ResponseCarport.class, url);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, url, JsonUtil.toJson(requestCarport), JsonUtil.toJson(callback), "调用战图接口根据车场获取获取车位信息", exceptionMsg);
        }
        return callback;
    }


    public BmapSyncLog getLastSyncTime(String syncCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("syncCode", syncCode);
        return centerDao.queryForObject(BmapSyncLog.class, "sql.select.bmaplog", params);//获取上次同步时间
    }

    public Boolean existProject(String projectCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("projectCode", projectCode);
        return centerDao.exists("sql.exist.project", params);
    }

    public Boolean existHouse(String code) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("code", code);
        return centerDao.exists("sql.exist.house", params);
    }

    /**
     * 根据楼栋编码查询一个楼栋下的房屋编码
     *
     * @return Boolean
     */
    @Transactional
    public List<String> queryHouseCodeByBuildingCode(String buildingCode) {
        Map<String,String> params=new HashMap<String, String>();
        params.put("buildingCode",buildingCode);
        return centerRoDao.queryForList(String.class,"sql.houseCode.byBuildingCode",params);
    }

    /**
     * 更新房屋信息
     *
     * @return Boolean
     */
    @Transactional
    public void updateHouse(List<House> houseList) {
        updateHouseBasic(houseList);
        updateHouseDetails(houseList);
        updateMidProjectHouse(houseList);
    }


    /**
     * 更新房屋基本信息
     *
     * @return Boolean
     */
    public void updateHouseBasic(List<House> houseList) {
        centerDao.batchUpdate("sql.update.houseBasic", houseList);
    }


    /**
     * 更新房屋详细信息
     *
     * @return Boolean
     */
    public void updateHouseDetails(List<House> houseList) {
        centerDao.batchUpdate("sql.update.houseDetails", houseList);
    }


    /**
     * 更新项目房屋中间表
     * @return Boolean
     */
    public void updateMidProjectHouse(List<House> houseList) {
        centerDao.batchUpdate("sql.update.midprojecthouse", houseList);
    }


    /**
     * 插入房屋基本信息
     */
    public void insertHouseBasic(List<House> houseList) {
        centerDao.batchUpdate("sql.insert.houseBasic", houseList);
    }


    /**
     * 插入房屋详细信息
     *
     * @return
     */

    @Transactional
    public void insertHouse(List<House> houseList){
        insertHouseBasic(houseList);
        insertHouseDetail(houseList);
        insertProjectHouse(houseList);
    }

    public void insertHouseDetail(List<House> houseList) {
        centerDao.batchUpdate("sql.insert.houseDetail", houseList);
    }

    public Boolean existBuilding(String buildingCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("buildingCode", buildingCode);
        return centerDao.exists("sql.exist.building", params);
    }

    public Boolean existCarport(String carportCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("code", carportCode);
        return centerDao.exists("sql.exist.carport", params);
    }

    public Boolean updateProject(String projectCode, String abrev, String company, String companyCode, String projectType, String projectSource, String nameFormal, String cityCode, Integer isDeleted) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("projectCode", projectCode);
        params.put("abrev", abrev);
        params.put("company", company);
        params.put("companyCode", companyCode);
        params.put("projectType", projectType);
        params.put("projectSource", projectSource);
        params.put("nameFormal", nameFormal);
        params.put("cityCode", cityCode);
        params.put("isDeleted", isDeleted);
        return centerDao.update("sql.update.sync.project", params) > 0;
    }

    public void updateCarport(List<CarportInfo> carportInfoList) {
        centerDao.batchUpdate("sql.update.carport", carportInfoList);
    }

    public void insertCarport(List<CarportInfo> carportInfoList) {
        centerDao.batchUpdate("sql.insert.carport", carportInfoList) ;
    }


    public void updateBuilding(List<TreeInfo> treeList) {
        centerDao.batchUpdate("sql.update.tree.building", treeList) ;
    }

    /**
     * 更新项目树信息
     *
     * @param projectCode 项目code
     * @param projectName 项目名称
     * @return
     */
    public Boolean updateTree(String projectCode, String projectName, Integer isDeleted) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("projectCode", projectCode);
        params.put("projectName", projectName);
        params.put("isDeleted", isDeleted);
        return centerDao.update("sql.update.sync.tree", params) > 0;
    }

    /**
     * 新增项目数据
     *
     * @param projectCode
     * @param projectName
     * @param company
     * @param companyCode
     * @param projectType
     * @param projectSource
     * @return
     */
    public Boolean insertProject(String id, String projectCode, String abrev, String projectName, String company, String companyCode, String projectType, String projectSource, String cityCode, Integer isDeleted) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("id", id);
        params.put("projectCode", projectCode);
        params.put("projectName", projectName);
        params.put("abrev", abrev);
        params.put("company", company);
        params.put("companyCode", companyCode);
        params.put("projectType", projectType);
        params.put("projectSource", projectSource);
        params.put("cityCode", cityCode);
        params.put("isDeleted", isDeleted);
        return centerDao.insert("sql.insert.sync.project", params) > 0;

    }

    /**
     * 新增楼栋数据（在树结构中）
     *
     * @return 是否成功
     */
    public void insertBuilding(List<TreeInfo> treeList) {
        centerDao.batchUpdate("sql.insert.tree.building", treeList) ;

    }

//    /**
//     * 添加同步日志信息
//     *
//     * @param bmapSyncLog
//     * @return
//     */
//    public Boolean addsyncLog(BmapSyncLog bmapSyncLog) {
//        return centerDao.insert(bmapSyncLog) > 0;
//    }

    /**
     * 获取所有项目code
     *
     * @return
     */
    public List<String> queryAllProject() {
        return centerDao.queryForList(String.class, "sql.query.allProjectCode", null);
    }


    /**
     *  获取已经同步的项目code
     *  @return
     */
    public List<String> querySyncedProject(String syncCode,String requestTime) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("requestTime", requestTime);
        params.put("syncCode", syncCode);
        return centerDao.queryForList(String.class, "sql.query.SyncedProjectInfo", params);
    }

    /**
     * 把获取到的项目同步到tree表中（住宅类）
     *
     * @param projectCode 项目code
     * @return 是否插入成功
     */
    public boolean insertTree4Project(String id, String projectCode, String name, Integer isDeleted) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("id", id);
        params.put("projectCode", projectCode);
        params.put("name", name);
        params.put("isDeleted", isDeleted);
        return centerDao.insert("sql.insert.tree.project", params) > 0;
    }


    /**
     * 把获取到的项目同步到tree表中(非住宅类)
     *
     * @param companyCode 公司code
     * @return 是否插入成功
     */
    public boolean insertTree4Project4Office(String id, String companyCode, String name, Integer isDeleted) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("id", id);
        params.put("companyCode", companyCode);
        params.put("name", name);
        params.put("isDeleted", isDeleted);
        return centerDao.insert("sql.insert.tree.project4Office", params) > 0;
    }


    /**
     * 更新公司信息（目前只有公司名称可以更新）
     *
     * @param companyCode 公司code
     * @param companyName 公司名称
     * @return 是否更新成功
     */
    public Boolean updateCompanyInfo(String companyCode, String companyName) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("companyCode", companyCode);
        params.put("companyName", companyName);
        return centerDao.update("sql.update.companyInfo", params) > 0;
    }


    /**
     * 插入公司主表信息
     *
     * @param id          UUID
     * @param companyCode 公司code
     * @param companyName 公司名称
     * @return 是否更新
     */
    public Boolean insertCompanyInfo(String id, String companyCode, String companyName) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("id", id);
        params.put("companyCode", companyCode);
        params.put("companyName", companyName);
        return centerDao.update("sql.insert.companyInfo", params) > 0;
    }


    /**
     * 插入树结构公司数据（目前只有公司名称可以插入）
     *
     * @param id          主键UUID
     * @param rootId      父ID
     * @param companyName 公司名称
     * @return 是否更新
     */
    public Boolean insertCompanyInfo4Tree(String id, String rootId, String companyName) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("id", id);
        params.put("levelType", "8");
        params.put("levelTypeText", "City");
        params.put("isOuter", "0");
        params.put("name", companyName);
        params.put("parentId", rootId);
        return centerDao.update("sql.insert.tree", params) > 0;
    }

    /**
     * 判断一个单元是否存在于树结构中
     *
     * @param unit 单元id
     * @return 是否存在
     */
    public Boolean existUnit(String unit) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("unit", unit);
        return centerDao.exists("sql.exist.unit", params);
    }


    /**
     * 新增单元数据数据（在树结构中）
     */
    public void insertUnit(List<TreeInfo> unitList) {
        centerDao.batchUpdate("sql.insert.tree", unitList);
    }


    public Boolean existProject4Tree(String code) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("code", code);
        return centerRoDao.exists("sql.exist.project4Tree", params);
    }

    public String queryProjectIdByCode(String code) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("code", code);
        return centerRoDao.queryForObjectQuietly(String.class, "sql.query.projectIdByCode", params);
    }


    public String queryProjectBelongMc(String code) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("code", code);
        return centerRoDao.queryForObjectQuietly(String.class, "sql.query.belongMc", params);
    }


    public Boolean existCompany(String code) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("companyCode", code);
        return centerRoDao.exists("sql.exist.company", params);
    }

    public Boolean existCarpark(String code) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("code", code);
        return centerRoDao.exists("sql.exist.carpark", params);
    }


    public Boolean existCompanyIdByCode(String code) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("companyCode", code);
        return centerRoDao.exists("sql.exist.companyByCode4Tree", params);
    }

    public String queryCompanyIdByCode(String companyCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("companyCode", companyCode);
        return centerRoDao.queryForObjectQuietly(String.class, "sql.query.companyIdByCode", params);
    }

    public List<String> queryAllCompanyCode() {
        return centerRoDao.queryForList(String.class, "sql.query.allCompanyCode", null);
    }

    /**
     *批量插入车场信息
     */
    public void insertCarpark(List<LotInfo> lotInfos){
        for (LotInfo lotInfo : lotInfos) {
            lotInfo.setId(UUIDUtil.create());
        }
        centerDao.batchUpdate("sql.insert.carpark",lotInfos);
    }

    /**
     *批量更新车场信息
     */
    public void updateCarpark(List<LotInfo> lotInfos){
        centerDao.batchUpdate("sql.update.carpark",lotInfos);
    }

    public void insertProjectHouse(List<House> houseList) {
        centerDao.batchUpdate("sql.insert.projectHouse", houseList);
    }



    /**
     * 查询同步相关配置
     * @param syncCode
     * @return
     */
    public SyncConfig querySyncConfig(String syncCode){
        Map<String,String> map=new HashMap<String, String>();
        map.put("syncCode",syncCode);
        return centerRoDao.queryForObject(SyncConfig.class,"sql.query.syncConfig",map);
    }


    /**
     * 更新配置信息
     * @return
     */
    public boolean updateSyncConfig(SyncConfig config,Boolean success) throws Exception{
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        Map<String,Object> map=new HashMap<String, Object>();
        Calendar calendar=Calendar.getInstance();

        calendar.setTime(new Date());
        calendar.add(Calendar.MINUTE,-config.getRequestCycle());
        String requestTime=sdf.format(calendar.getTime());
        map.put("syncCode",config.getSyncCode());
        if(success){
            long current=System.currentTimeMillis();//当前时间毫秒数
            long zero=current/(1000*3600*24)*(1000*3600*24)-TimeZone.getDefault().getRawOffset();//今天零点零分零秒的毫秒数
            calendar.setTime(new Timestamp(zero));
            calendar.add(Calendar.MINUTE,config.getSyncCycle());//同步成功
            String nextSyncTime=sdf.format(calendar.getTime());
            if("syncProject".equals(config.getSyncCode())){
                map.put("nextSyncTime",nextSyncTime);
            }else{
                calendar.add(Calendar.MINUTE,10);
                map.put("nextSyncTime",calendar.getTime());
            }
            map.put("requestTime",requestTime);
        }else{
            calendar.setTime(new Date());
            calendar.add(Calendar.MINUTE,5);//如果失败，5分钟后再试
            map.put("nextSyncTime",calendar.getTime());
        }
        map.put("lastRequestTime",config.getLastRequestTime());
        return centerDao.update("sql.update.syncConfig",map)>0;
    }

    /**
     * 查询同步是否成功
     * @param syncCode
     * @return int 失败条数 如果失败条数为"0"则代表成功
     */
    public SyncLog querySyncLog(Date requestTime,String syncCode){
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("syncCode",syncCode);
        map.put("requestTime",requestTime);
        return centerRoDao.queryForObject(SyncLog.class,"sql.query.syncLog",map);
    }
    public void insertSyncLog(SyncLog syncLog){
        centerDao.insert("sql.insert.syncLog",syncLog);
    }

    public void updateSyncLog(String requestTime,String syncCode){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("syncCode",syncCode);
        params.put("requestTime",requestTime);
        centerDao.update("sql.update.syncLog",params);
    }


    public void updateProcedure(){
        centerDao.getJdbcDao().executeProcedureWithTradition("PROD_TREE",null);
    }

    /**
     * 根据楼栋编码更新一个楼栋的房屋的接管时间
     */
    public void updateTakenOverTime(String takenovertime,String buildingCode){
        Map<String,String> params=new HashMap<String, String>();
        params.put("takenovertime",takenovertime);
        params.put("buildingCode",buildingCode);
        centerDao.update("sql.update.takenovertime",params);
    }


    /**
     * 查询系统管理员角色的用户ID
     */
    public List<String> querySystemManagers(){
        return sysRoDao.queryForList(String.class,"sql.query.systemmanagers",null);
    }


    /**
     * 查询所有项目ID
     */
    public List<String> queryProjectids( ){
        return centerRoDao.queryForList(String.class,"sql.query.projectIds",null);
    }

    /**
     * 判断系统管理员是否已经拥有某个项目权限
     */
    public boolean existPermission(String organizationId,String userId){
        Map<String,String> params=new HashMap<String, String>();
        params.put("organizationId",organizationId);
        params.put("userId",userId);
        return centerRoDao.exists("sql.exist.permission",params);
    }

    /**
     * 插入一条权限记录
     */
    public void insertPermission(String organizationId,String userId){
        Map<String,String> params=new HashMap<String, String>();
        params.put("organizationId",organizationId);
        params.put("userId",userId);
        centerDao.insert("sql.insert.permission",params);
    }


    public void updateTelCallRecordExpand(Date startTime,Date endTime){
        reportDao.getJdbcDao().executeProcedure("update_tel_callrecord_expand",startTime,endTime);
    }


    /**
     * 保存日志到Redis
     *
     * @param startDate        调用开始时间
     * @param endDate          返回结果时间
     * @param remoteUrl        url地址
     * @param paramters        参数
     * @param result           返回结果
     * @param actionName       接口说明
     * @param exceptionMessage 异常信息
     */
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
            String oauthAccessLogKey = ApplicationContext.getProperty("log.syncbmaplog.key", "SyncBmapLog");
            JedisUtil.defaultDb().lpush(oauthAccessLogKey.getBytes("UTF-8"), jsonString.getBytes("UTF-8"));
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
            restAccessLog.setActionName(actionName);
            restAccessLog.setAccessType(AccessTypes.Bmap.getValue());
            restAccessLog.setParameterMapJson(parameters);
            restAccessLog.setResultJson(result);
            restAccessLog.setRequestDate(requestDate);
            restAccessLog.setResponseDate(responseDate);
            restAccessLog.setRequestMethod("POST");
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
