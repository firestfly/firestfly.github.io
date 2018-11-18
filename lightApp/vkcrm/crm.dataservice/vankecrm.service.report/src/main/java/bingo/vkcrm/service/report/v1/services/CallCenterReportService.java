package bingo.vkcrm.service.report.v1.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.dao.Page;
import bingo.vkcrm.service.report.v1.model.BasicInformation;
import bingo.vkcrm.service.report.v1.model.CallRecords;
import bingo.vkcrm.service.report.v1.model.CarInfo;
import bingo.vkcrm.service.report.v1.model.PetsInfo;
import bingo.vkcrm.service.report.v1.model.TaskRecordReport;
import bingo.vkcrm.service.report.v1.model.UserInfo;
import bingo.vkcrm.service.service.BaseService;

/**
 * Created by szsonic on 2016/3/14/014.
 */
@Service
public class CallCenterReportService extends BaseService{

    //mcId, gridId, buildingCode, cityCode, start,  end,  source, content,  projectId,  houseId
    public List<TaskRecordReport> getTaskReport(String mcId,String gridId,String buildingCode,String cityCode,String start, String end, String source,String content, String projectId, String houseId, Page page,String userId){
        Map<String,Object> params=new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(mcId)){
            params.put("mcId",mcId);
        }else{
            params.put("mcuserId",userId);//传入用户ID，去查当前用户拥有的项目权限
        }

        if(StringUtils.isNotEmpty(gridId)){
            params.put("gridId",gridId);
        }

        if(StringUtils.isNotEmpty(buildingCode)){
            params.put("buildingCode",buildingCode);
        }

        if(StringUtils.isNotEmpty(cityCode)){
            params.put("cityCode",cityCode);
        }

        if(StringUtils.isNotEmpty(start)){
            params.put("start",start);
        }

        if(StringUtils.isNotEmpty(end)){
            params.put("end",end);
        }

        if(StringUtils.isNotEmpty(source)){
            params.put("source",source);
        }

        if(StringUtils.isNotEmpty(content)){
            params.put("content",content);
        }

        if(StringUtils.isNotEmpty(projectId)){
            params.put("projectId",projectId);
        }else{
            if(StringUtils.isNotEmpty(mcId)) {
                params.put("prouserId", userId);
            }
        }

        if(StringUtils.isNotEmpty(houseId)){
            params.put("houseId",houseId);
        }

        List<TaskRecordReport> reportList=reportRoDao.queryForListPage(TaskRecordReport.class,page,"sql.query.taskReport",null,params,true);
//        for (TaskRecordReport taskRecordReport : reportList) {
//            String houseCode=taskRecordReport.getHouseCode();
//         //   taskRecordReport.setIsTimeout(isTimeOut(taskRecordReport.getTaskNo()));
//
//        }
        return reportList;
    }


    public String getGridName(String houseCode){
        Map<String,String> params=new HashMap<String, String>();
        params.put("houseCode",houseCode);
        return reportRoDao.queryForStringQuietly("sql.query.gridname",params);
    }

    public Boolean isTimeOut(String taskNo){
        Map<String,String> params=new HashMap<String, String>();
        params.put("taskNo",taskNo);
        return bizRoDao.exists("sql.query.istimeout",params);
    }
	
    public List<TaskRecordReport> getTaskReport4Prj(String mcId,String gridId,String buildingCode,String cityCode,String start, String end, String source,String content, String projectId, String houseId, Page page,String userId){
        Map<String,Object> params=new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(mcId)){
            params.put("mcId",mcId);
        }else{
            params.put("mcuserId",userId);//传入用户ID，去查当前用户拥有的项目权限
        }

        if(StringUtils.isNotEmpty(gridId)){
            params.put("gridId",gridId);
        }

        if(StringUtils.isNotEmpty(buildingCode)){
            params.put("buildingCode",buildingCode);
        }

        if(StringUtils.isNotEmpty(cityCode)){
            params.put("cityCode",cityCode);
        }

        if(StringUtils.isNotEmpty(start)){
            params.put("start",start);
        }

        if(StringUtils.isNotEmpty(end)){
            params.put("end",end);
        }

        if(StringUtils.isNotEmpty(source)){
            params.put("source",source);
        }

        if(StringUtils.isNotEmpty(content)){
            params.put("content",content);
        }

        if(StringUtils.isNotEmpty(projectId)){
            params.put("projectId",projectId);
        }else{
            if(StringUtils.isNotEmpty(mcId)) {
                params.put("prouserId", userId);
            }
        }

        if(StringUtils.isNotEmpty(houseId)){
            params.put("houseId",houseId);
        }

        List<TaskRecordReport> reportList=reportRoDao.queryForListPage(TaskRecordReport.class,page,"sql.query.taskReport4Call",null,params,true);

        return reportList;
    }


    /**
     * 话务查询
     *
     * @param fromTime
     * @param toTime
     * @return
     */
    public List<CallRecords> getCallRecord(String fromTime, String toTime, Page page) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("fromTime", fromTime);
        parameters.put("toTime", toTime);
        return   bizRoDao.queryForListPage(CallRecords.class, page, "sql.query.callcenter.tel", null, parameters, true);
    }


    public List<BasicInformation> getBaseInfoReport(BasicInformation baseInfo,Page page){
    	List<BasicInformation> reportList= centerRoDao.queryForListPage(BasicInformation.class,page,"sql.query.baseInfoReport",null,baseInfo,true);
    	if (null != reportList && reportList.size()>0) {
			for (BasicInformation basicInformation : reportList) {
				//根据项目查询总户数 过滤失效房屋（main_house）
				basicInformation.setHouseCount(getCount("sql.query.houseCount","gridId",basicInformation.getGridId()));
				//根据项目网格查询已接管户数 接管时间非空
				basicInformation.setTakeOverCount(getCount("sql.query.takeOverCount","gridId",basicInformation.getGridId()));
				//根据项目网格查询已入住户数 入住时间非空的房屋
				basicInformation.setCheckConut(getCount("sql.query.checkConut","gridId",basicInformation.getGridId()));
				//根据项目网格查询常住户数
				basicInformation.setResidentCount(getCount("sql.query.residentCount","gridId",basicInformation.getGridId()));
				//根据项目网格查询出租户数
				basicInformation.setNullCount(getCount("sql.query.nullCount","gridId",basicInformation.getGridId()));
				//根据项目网格查询空置户数
				basicInformation.setVacation(getCount("sql.query.vacation","gridId",basicInformation.getGridId()));
				//根据项目网格查询度假户数
				basicInformation.setLeaseCount(getCount("sql.query.leaseCount","gridId",basicInformation.getGridId()));
				//根据项目网格查询车辆数 有效的
				basicInformation.setCarCount(getCount("sql.query.carCount","gridId",basicInformation.getGridId()));
				//根据项目网格查询宠物数 有效的
				basicInformation.setPetsCount(getCount("sql.query.petsCount","gridId",basicInformation.getGridId()));
				//根据项目网格查询 总人数 客房关系有效的数量（cusid排重）
				basicInformation.setPersonCount(getCount("sql.query.personCount","gridId",basicInformation.getGridId()));
				//根据项目网格查询 业主数量
				basicInformation.setOwnerCount(getCount("sql.query.ownerCount","gridId",basicInformation.getGridId()));
				//根据项目网格查询 住户（家庭成员）
				basicInformation.setUnOwnerCount(getCount("sql.query.unOwnerCount","gridId",basicInformation.getGridId()));
			}
		}
    	return reportList;
    }
    
    public int getBaseInfoReportCount(BasicInformation baseInfo){
    	return centerRoDao.queryForPageCount("sql.query.baseInfoReport", baseInfo);
    }
    
    public List<BasicInformation> exportBaseInfoReport(BasicInformation baseInfo,Page page){
    	List<BasicInformation> reportList= centerRoDao.queryForListPage(BasicInformation.class,page,"sql.query.baseInfoReport",null,baseInfo,true);
    	return reportList;
    }
    
    public int getCount(String sqlId,String key,String value){
    	Map<String, Object> parameters = new HashMap<String, Object>();
    	parameters.put(key, value);
    	return centerRoDao.queryForInt(sqlId, parameters);
    }
    
    /**
     * @Description: 客户信息查询报表（迭代三）
     * @param:userInfo
     * @param:page
     * @throws:
     * @Author: luoml01
     * @date: 2016年5月5日 下午4:00:07
     * @return:{返回参数名}{返回参数说明} 
     * @exception:TODO
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
  	public List<UserInfo> getCustomerInfoReport(UserInfo userInfo,Page page){
  		return centerRoDao.queryForListPage(UserInfo.class,page,"sql.query.customerInfo.report",null,userInfo,true);
  	}    
  	
  	public List<CarInfo> getCarInfoReport (CarInfo carInfo,Page page){
    	List<CarInfo> reportList= centerRoDao.queryForListPage(CarInfo.class,page,"sql.query.carInfoReport",null,carInfo,true);
    	return reportList;
    }
  	

    public List<PetsInfo> getpetInfoReport(PetsInfo petInfo,Page page){
    	List<PetsInfo> petsInfoList= centerRoDao.queryForListPage(PetsInfo.class,page,"sql.query.petsInfoReport",null,petInfo,true);
    	return petsInfoList;
    }
}
