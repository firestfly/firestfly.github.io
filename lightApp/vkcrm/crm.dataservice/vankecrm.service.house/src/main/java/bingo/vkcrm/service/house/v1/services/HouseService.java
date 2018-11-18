package bingo.vkcrm.service.house.v1.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.house.v1.models.*;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import bingo.dao.Page;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.exceptions.DataNotExistsException;
import bingo.vkcrm.service.house.v1.models.Grid;
import bingo.vkcrm.service.house.v1.models.House;
import bingo.vkcrm.service.house.v1.models.HouseBasic;
import bingo.vkcrm.service.house.v1.models.HouseDetail;
import bingo.vkcrm.service.house.v1.models.HouseInfo;
import bingo.vkcrm.service.house.v1.models.HouseLite;
import bingo.vkcrm.service.house.v1.models.HouseOverview;
import bingo.vkcrm.service.house.v1.models.HouseOverviewMain;
import bingo.vkcrm.service.house.v1.models.ProjectHouse;
import bingo.vkcrm.service.house.v1.models.YZParam;
import bingo.vkcrm.service.service.BaseService;

/**
 * 房屋数据服务
 */
@Service
public class HouseService extends BaseService {


	/**
     * 查询楼层
     *
     * @param projectId  项目id
     * @param buildingId 楼栋编号
     * @param unitId     单元编号
     * @param gridId     网格id
     * @return
     */
    public Integer[] queryFloor(String projectId, String buildingId, String unitId, String gridId)
            throws DataNotExistsException {
        Map<String, String> parameters = new HashMap<String, String>();
        parameters.put("projectId", projectId);
        parameters.put("buildingId", buildingId);
        parameters.put("unitId", unitId);
        parameters.put("gridId", gridId);

        // 检查该楼栋和单元是否存在
        boolean isExists = centerRoDao.exists("sql.exists.unit", parameters);
        if (!isExists) {
            throw new DataNotExistsException("楼栋id:" + buildingId + " 单元id:" + unitId + " 不存在");
        }

        List<Integer> floor = centerRoDao.queryForList(Integer.class, "sql.query.floor", parameters);
        return floor.toArray(new Integer[0]);
    }

    /**
     * 查询该楼层的所有房屋
     *
     * @param projectId  项目id
     * @param buildingId 楼栋编码
     * @param unitId     单元编码
     * @param floor      楼层编码
     * @param gridId     网格id
     * @return
     */
    public List<HouseOverviewMain> queryOverviews(String projectId, String buildingId, String unitId, int floor, String gridId)
            throws DataNotExistsException {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("projectId", projectId);
        parameters.put("buildingId", buildingId);
        parameters.put("unitId", unitId);
        parameters.put("floor", floor);
        parameters.put("gridId", gridId);

        // 检查该楼栋和单元是否存在
        int units = centerRoDao.queryForInt("sql.exists.unit", parameters);
        if (units == 0) {
            throw new DataNotExistsException("楼栋id:{0} 单元id:{1} 不存在");
        }

        List<HouseOverviewMain> HouseOverviewMainAll = centerRoDao.queryForList(HouseOverviewMain.class,"sql.query.house.byfloor", parameters);
        List<HouseOverviewMain> houseOverviewMainlist = new ArrayList<HouseOverviewMain>();
        
        /**
         * 获取第一次房屋数据
         */
        for(HouseOverviewMain houseOverviewMain : HouseOverviewMainAll){
        	if(StringUtils.isNotEmpty(houseOverviewMain.getIsCombine()) && houseOverviewMain.getIsCombine().equals("1")){
        		houseOverviewMainlist.add(houseOverviewMain);
        		continue;
        	}
        	if(StringUtils.isEmpty(houseOverviewMain.getMergeToHouseId()) && houseOverviewMain.getIsSubRoom().equals("0")){
        		houseOverviewMainlist.add(houseOverviewMain);
        	}
        }
        
        /**
         * 组装房屋的父房屋和子房屋
         */
        for(HouseOverviewMain listItem :  houseOverviewMainlist){
            for(HouseOverviewMain allItem : HouseOverviewMainAll){
            	if(StringUtils.isNotEmpty(allItem.getParentId()) && 
            			allItem.getParentId().equals(listItem.getHouseId())){
            		listItem.getSubHouses().add(allItem);
            		continue;
            	}
            	if(StringUtils.isNotEmpty(allItem.getMergeToHouseId()) && 
            			allItem.getMergeToHouseId().equals(listItem.getHouseId())){
            		listItem.getParentHouses().add(allItem);
            		continue;
            	}
            }
        }

        return houseOverviewMainlist;
    }

    /**
     * 根据房屋id获取房屋基本信息
     *
     * @param houseId 房屋id
     * @return
     */
    public HouseBasic getHouseBasic(String houseId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("houseId", houseId);
        return centerRoDao.queryForObject(HouseBasic.class, "sql.query.house.basic", parameters);
    }

    /**
     * 根据房屋id获取房屋的详细信息
     *
     * @param houseId 房屋id
     * @return
     */
    public HouseDetail getHouseDetail(String houseId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("houseId", houseId);
        return centerRoDao.queryForObject(HouseDetail.class, "sql.query.house.detail", parameters);

    }

    /**
     * 根据房屋布局编码查询房屋布局名称
     * @param layoutCode 布局编码
     * @return
     *
     * 从KVStore中读取
     */
//    @Cacheable(value = "HouseLayout", key = "'Layout'.concat(#layoutCode)")
    public String getHouseLayout(String layoutCode){
        // TODO:增加缓存,修改获取房屋详情的SQL,移除House_Layout查询条件

        return "";
    }

    /**
     * 根据房屋ID更改房屋状态
     *
     */
    public boolean updateHouseStatus(HouseBasic houseBasic) {
//        Map<String, Object> parameters = new HashMap<String, Object>();
//        parameters.put("houseId", houseId);
//        parameters.put("status", status);
        //修改房屋状态
        Integer effectRows = centerDao.update("sql.update.house.status", houseBasic);
        return effectRows > 0;
    }

    /**
     * 根据项目ID,楼栋ID,房屋名称关键字，模糊查询房屋信息
     *
     * @param projectId  项目ID
     * @param buildingId 楼栋id
     * @param houseName  房屋关键字
     * @return
     */
    public List<HouseLite> getProjectHouse(String projectId, String buildingId, String houseName) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("projectId", projectId);
        parameters.put("buildingId", buildingId);
        parameters.put("houseName", houseName);
        List<HouseLite> list = centerRoDao.queryForList(HouseLite.class, "sql.search.house", parameters);
        return list;
    }

    /**
     * 根据房屋ID 获取子房屋
     * @param houseId 房屋ID
     * @return
     */
    public List<HouseOverview> getSubHouse(String houseId){
		Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("houseId", houseId);
		return centerRoDao.getJdbcDao().queryForList(HouseOverview.class, "sql.query.subhouse.byhouseid", houseId);
	}

    /**
     * 主房屋或合并房屋拆分
     * @param houseId     主房屋ID
     * @param houseName   子房屋名称
     * @param checkInTime 入住日期
     * @param area 面积
     * @return
     * @throws Exception
     */
    public ServiceResult split(String houseId, String houseName, Date checkInTime,float area,User user) throws Exception {
        
        //查询房屋名称是否已经存在
       	if(centerRoDao.getJdbcDao().exists("sql.query.housename", houseName)){
       		return ServiceResult.error("房屋名称已经存在!");
       	}

        HouseBasic basic = this.getHouseBasic(houseId);//查询出主房子的信息
        HouseDetail detail = this.getHouseDetail(houseId); //查询出主房屋详细信息
       	// 3.查询子房扩展信息
       	List<HouseDetail> subHouseDetailList = centerRoDao.getJdbcDao().queryForList(HouseDetail.class, "sql.house.split.querySubHouse", houseId);   	
       	float totalArea = 0;
       	float subTotalArea = 0;

       	if(null == detail.getPropertyArea()){//计算主房屋物业面积
       		totalArea = 0;
       	}else{
       		totalArea = detail.getPropertyArea().floatValue();
       	}
       	for(HouseDetail houseDetail : subHouseDetailList){//计算子房屋物业面积总和
       		float propertyArea = 0;
       		if(null == houseDetail.getPropertyArea()){
       			propertyArea = 0;
       		}else{
       			propertyArea = houseDetail.getPropertyArea().floatValue();
       		}
       		subTotalArea = subTotalArea + propertyArea;
       	}
       	
       	if(totalArea < subTotalArea + area){//校验子房屋面积不能大于住房网
       		return ServiceResult.error("子房屋“物业面积”不能大于主房屋!");
       	}

       	HouseBasic subBasic = (HouseBasic)BeanUtils.cloneBean(basic);//初始化子房屋信息
        HouseDetail subDetail = (HouseDetail)BeanUtils.cloneBean(detail);//初始化子房屋信息
       	

        // 生成子房屋的房屋编码(主房屋编码+01...)
        Integer count = centerRoDao.getJdbcDao().queryForInt("sql.count.subHouse1",houseId)+1;
        subBasic.setId(UUIDUtil.create());
        subBasic.setName(houseName);
        if(count > 9){
        	subBasic.setCode(basic.getCode() + count);
        }else{
        	subBasic.setCode(basic.getCode() + "0" + count);
        }
        subBasic.setCheckInTime(checkInTime);
        subBasic.setParentId(houseId);
        subBasic.setHasSubRoom(false);
        subBasic.setIsSubRoom(true);
        subBasic.setVirtual(true);
        subBasic.setCombine(false);
        subBasic.setModifier(user.getName());
        subBasic.setModifierId(user.getId());
        subBasic.setModifyTime(new Date());        

		// 复制房屋扩展信息给拆分房屋
        /**
		BeanUtils.copyProperties(detail, subDetail, "address",
				"province", "city", "district", "buildingNo", "floor", "unit",
				"orientation", "salesUnitPrice", "referenceServiceCharge",
				"isSubsidiary", "practicalUse");*/
        subDetail.setRoomCount(0);
        subDetail.setHallCount(0);
        subDetail.setKitchenCount(0);
        subDetail.setToiletCount(0);
        
        subDetail.setAreaOfPreSale(new BigDecimal(0));
        subDetail.setBuiltUpArea(new BigDecimal(0));
        subDetail.setActualConstructionArea(new BigDecimal(0));
        subDetail.setPreSaleConstructionArea(new BigDecimal(0));
        subDetail.setMeasuredBasementArea(new BigDecimal(0));
        subDetail.setTerraceArea(new BigDecimal(0));
        subDetail.setSetArea(new BigDecimal(0));
        subDetail.setMeasuredPoolArea(new BigDecimal(0));
        subDetail.setGardenArea(new BigDecimal(0));
        subDetail.setBasementArea(new BigDecimal(0));
        subDetail.setFieldMeasuredArea(new BigDecimal(0));
        subDetail.setPoolArea(new BigDecimal(0));
        subDetail.setGarageArea(new BigDecimal(0));
        subDetail.setModifier(user.getName());
        subDetail.setModifierId(user.getId());
        subDetail.setModifyTime(new Date());
        
		subDetail.setId(subBasic.getId());
		subDetail.setPropertyArea(new BigDecimal(area));
        
        //插入子房屋数据
        centerDao.insert(subBasic);
        //插入子房屋详细数据
        centerDao.insert(subDetail);
        //更改主房屋拥有子房屋
        basic.setModifier(user.getName());
        basic.setModifierId(user.getId());
        basic.setModifyTime(new Date());
        basic.setHasSubRoom(true);
        centerDao.updateFields(basic,"hasSubRoom","modifier","modifierId","modifyTime");
        
        // 复制主房屋的客户信息
    	Map<String, String> queryParam = new HashMap<String, String>();
    	queryParam.put("houseIdsCon", basic.getId());
		queryParam.put("houseMegerId", subBasic.getId());
		queryParam.put("userName", user.getName());
		queryParam.put("userId", user.getId());
		centerDao.insert("sql.house.merge.mergeCustomer",queryParam);

        //插入对应的grid
        Map<String,Object>projtHouseMap = new HashMap<String, Object>();
        projtHouseMap.put("houseIds",houseId);
        String gridId = centerRoDao.queryForString("sql.mid.project.house.byHouseId",projtHouseMap);
		// 插入房屋项目对应关系
		centerDao.getJdbcDao().insert("sql.house.split.insertProjectRelation", subBasic.getId(),gridId,basic.getId());
        
        return ServiceResult.succeed(subBasic.getId());
    }
    

    /**
     * 主房屋或合并房屋拆分
     * @param houseId     主房屋ID
     * @param houseName   子房屋名称
     * @param checkInTime 入住日期
     * @param area 面积
     * @return
     */
    public ServiceResult subHouseSplit(String houseId, String houseName, Date checkInTime,float area,User user) throws Exception{
        
        //查询房屋名称是否已经存在
       	if(centerRoDao.getJdbcDao().exists("sql.query.housename", houseName)){
       		return ServiceResult.error("房屋名称已经存在!");
       	}

        HouseBasic basic = this.getHouseBasic(houseId);// 查询出主房子的信息        
        HouseDetail detail = this.getHouseDetail(houseId);// 查询出主房屋详细信息
        HouseBasic parentBasic = this.getHouseBasic(basic.getParentId());//查询主房屋信息
        
       	
       	if(null == detail.getPropertyArea() || detail.getPropertyArea().floatValue() <= area){
       		return ServiceResult.error("子房屋“物业面积”不能大于等于被拆分子房屋!");
       	}
       	
       	HouseBasic subBasic = (HouseBasic)BeanUtils.cloneBean(basic);
        HouseDetail subDetail = (HouseDetail)BeanUtils.cloneBean(detail);
        
        // 复制房屋基本信息
        subBasic.setId(UUIDUtil.create());
        subBasic.setName(houseName);
        // 生成子房屋的房屋编码(主房屋编码+01...)
        Integer count = centerRoDao.getJdbcDao().queryForInt("sql.count.subHouse1",basic.getParentId())+1;
        if(count > 9){
        	subBasic.setCode(parentBasic.getCode() + count);
        }else{
        	subBasic.setCode(parentBasic.getCode() + "0" + count );
        }
        subBasic.setCheckInTime(checkInTime);
        subBasic.setModifier(user.getName());
        subBasic.setModifierId(user.getId());
        subBasic.setModifyTime(new Date());

		// 复制房屋扩展信息给拆分房屋
        /**
		BeanUtils.copyProperties(detail, subDetail, "address",
				"province", "city", "district", "buildingNo", "floor", "unit",
				"orientation", "salesUnitPrice", "referenceServiceCharge",
				"isSubsidiary", "practicalUse");**/
        
		subDetail.setId(subBasic.getId());
		subDetail.setPropertyArea(new BigDecimal(area));
        subDetail.setModifier(user.getName());
        subDetail.setModifierId(user.getId());
        subDetail.setModifyTime(new Date());
        
        //插入子房屋数据
        centerDao.insert(subBasic);
        //插入子房屋详细数据
        centerDao.insert(subDetail);
        
        // 更新主房屋信息
       	basic.setModifier(user.getName());
       	basic.setModifierId(user.getId());
       	basic.setModifyTime(new Date());
        centerDao.updateFields(detail, "modifier","modifierId","modifyTime");
        detail.setPropertyArea(new BigDecimal(detail.getPropertyArea().floatValue()-area));
        centerDao.updateFields(detail, "propertyArea");

        parentBasic.setModifier(user.getName());
        parentBasic.setModifierId(user.getId());
        parentBasic.setModifyTime(new Date());
        centerDao.updateFields(parentBasic, "modifier","modifierId","modifyTime");

        //插入对应的grid
        Map<String,Object>projtHouseMap = new HashMap<String, Object>();
        projtHouseMap.put("houseIds",houseId);
        String gridId = centerRoDao.queryForString("sql.mid.project.house.byHouseId",projtHouseMap);
		// 插入房屋项目对应关系
		centerDao.getJdbcDao().insert("sql.house.split.insertProjectRelation", subBasic.getId(),gridId,basic.getId());
        
        
        return ServiceResult.succeed(subBasic.getId());
    }
    

    /**
     * 删除子房屋
     * @param houseId 房屋ID
     * @return
     */
    public ServiceResult deleteSubHouse(String houseId,User user){    	
    	HouseBasic subBasic = getHouseBasic(houseId);
    	HouseBasic parentBasic = new HouseBasic();
    	parentBasic.setId(subBasic.getParentId());
    	
    	// 删除子房屋
    	subBasic.setIsDeleted("1");
    	subBasic.setDeleter(user.getName());
    	subBasic.setDeleterId(user.getId());
    	subBasic.setDeleteTime(new Date());
    	int ts = centerDao.updateFields(subBasic, "isDeleted","deleter","deleterId","deleteTime");
        if(ts==0)return ServiceResult.error("删除子房屋失败。");

        // 获取主房屋是否还有子房屋
    	boolean hasSubroom = centerRoDao.getJdbcDao().queryForInt("sql.count.subHouse", parentBasic.getParentId()) > 0;
        // 3.更改主房屋拥有子房屋
        if(!hasSubroom) {
        	parentBasic.setHasSubRoom(false);
        }else{
        	parentBasic.setHasSubRoom(true);
        }
        parentBasic.setModifier(user.getName());
        parentBasic.setModifierId(user.getId());
        parentBasic.setModifyTime(new Date());
        centerDao.updateFields(parentBasic, "hasSubRoom","modifier","modifierId","modifyTime");
        return ServiceResult.succeed(subBasic.getId());
    }
    
    /**
     * 获取管家(呼叫中心)
     * @param houseId 房屋ID
     * @return
     */
    public Grid getGridManager(String houseId){
    	Map<String,Object> map = new HashMap<String, Object>();
    	map.put("houseId", houseId);
    	Grid grid = new Grid();
    	grid = centerRoDao.queryForObject(Grid.class, "sql.query.grid.byhouseid", map);
    	if(grid!=null && StringUtils.isNotEmpty(grid.getManagerId())){
        	map.put("id", grid.getManagerId());
        	String mobilePhone = sysRoDao.queryForStringQuietly("sql.query.grid.managerphone", map);
        	grid.setMobilePhone(mobilePhone);
    	}
    	return grid;
    }

    /**
     * 根据项目ID获取该项目下的房屋（ID、名称、单元）
     * @param projectId 项目ID
     * @return
     */
    public List<HouseInfo> getHousesByProjectId(String projectId,String houseName,String gridId){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("projectId",projectId);
        params.put("houseName",houseName);
        if(StringUtils.isNotEmpty(gridId)){
            params.put("gridId",gridId);
        }
        return centerRoDao.queryForList(HouseInfo.class,"sql.query.house.getHousesByProjectId",params);
    }
    

    /**
     * 根据项目ID获取该项目下的房屋（ID、名称、单元）
     * @param codes 项目ID
     * @return
     */
    public List<HouseInfo> getHousesByCodes(String[] codes ){    	
    	String[] codesTemp = new String[codes.length];
    	for(int i=0;i<codesTemp.length;i++){
    		codesTemp[i] = "'"+codes[i]+"'";
    	}    	
        Map<String,Object> params=new HashMap<String, Object>();
        String houseCodes = StringUtils.join(codesTemp, ",");        
        params.put("houseCodes",houseCodes);
        return centerRoDao.queryForList(HouseInfo.class,"sql.house.getHouseByCode",params);
    }
    
    /**
     * 
     * @param codes
     * @return
     */
    public String[] getHouseIdsByCodes(String[] codes ){
    	List<HouseInfo> houseList = getHousesByCodes(codes);
    	if(null == houseList || houseList.size() < 1){
    		return null;
    	}
    	String[] houseIds = new String[houseList.size()];
    	for(int i=0;i<houseList.size();i++){
    		houseIds[i] = houseList.get(i).getId();
    	}
    	return houseIds;
    }


    /**
     * 根据楼栋id/code获取房屋（加了网格过滤）
     * @param buildingId 楼栋编码
     * @param gridId 网格ID
     * @return
     */
    public List<House4Report> getHouse4Report(String buildingId,String gridId){
        Map<String,String> params=new HashMap<String, String>();
        params.put("buildingId",buildingId);
        if(StringUtils.isNotEmpty(gridId)){
           params.put("gridId",gridId);
        }
        return centerRoDao.queryForList(House4Report.class,"sql.house.byBuildCode4Report",params);
    }
    
    /**
   	 * @Description: 分页获取楼栋信息
   	 * @param: curPage当前页
   	 * @param pageSize当前页行数
   	 * @param YZParam 请求对象
   	 * @throws:Exception
   	 * @Author: luoml01
   	 * @date: 2016年3月15日 下午6:37:47
   	 * @return:List<ProjectHouse> 楼栋信息集合
        * @exception:
   	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
   	 */
       public List<ProjectHouse> getBuildingInfoPage(Page pager,YZParam yzParam) {
           //有查询条件，做自动分页
           Map<String, Object> parameters = new HashMap<String, Object>();
           if (StringUtils.isNotEmpty(yzParam.getProjectCode())) {
          	 	parameters.put("projectCode", yzParam.getProjectCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getBuildingCode())) {
          	 	parameters.put("buildingCode", yzParam.getBuildingCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getModifyTime())) {
          	 	parameters.put("modifyTime", yzParam.getModifyTime());
          	 	parameters.put("timestamp", yzParam.getTimestamp());
   		}
           List<ProjectHouse> list = centerRoDao.queryForListPage(ProjectHouse.class,pager,"sql.query.getBuildingInfo",null, parameters,true);
           return list;
       }
       
       /**
   	 * @Description: 分页获取房屋信息
   	 * @param: curPage当前页
   	 * @param pageSize当前页行数
   	 * @param YZParam 请求对象
   	 * @throws:
   	 * @Author: luoml01
   	 * @date: 2016年3月15日 下午6:37:47
   	 * @return:List<House>房屋信息集合
        * @exception:
   	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
   	 */
       public List<House> getHousePage(Page pager,YZParam yzParam) {
           //有查询条件，做自动分页
           Map<String, Object> parameters = new HashMap<String, Object>();
           if (StringUtils.isNotEmpty(yzParam.getProjectCode())) {
          	 	parameters.put("projectCode", yzParam.getProjectCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getBuildingCode())) {
          	 	parameters.put("buildingCode", yzParam.getBuildingCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getHouseCode())) {
          	 	parameters.put("houseCode", yzParam.getHouseCode());
   		}
           if (null != yzParam.getHouseCodes() && yzParam.getHouseCodes().length>0) {
        	   parameters.put("houseCodes", "'" + StringUtils.join(yzParam.getHouseCodes(), "','") + "'");
  		}
           if (StringUtils.isNotEmpty(yzParam.getModifyTime())) {
          	 	parameters.put("modifyTime", yzParam.getModifyTime());
          	 	parameters.put("timestamp", yzParam.getTimestamp());
   		}
           List<House> list = centerRoDao.queryForListPage(House.class,pager,"sql.query.getHouse",null, parameters,true);
           return list;
       }
    
}
