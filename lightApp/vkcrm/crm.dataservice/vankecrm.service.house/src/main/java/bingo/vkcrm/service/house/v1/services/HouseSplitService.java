package bingo.vkcrm.service.house.v1.services;

import java.math.BigDecimal;
import java.util.*;

import bingo.vkcrm.service.house.v1.models.bmap.BmapResponse;
import bingo.vkcrm.service.house.v1.models.bmap.BmapResponseProps;
import bingo.vkcrm.service.house.v1.models.bmap.BmapResponseResult;
import bingo.vkcrm.service.house.v1.models.bmap.RequestHouse;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.house.v1.models.HouseBasic;
import bingo.vkcrm.service.house.v1.models.HouseDetail;
import bingo.vkcrm.service.house.v1.models.HouseOverview;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.common.utils.UUIDUtil;

/**
 *
 * <code>{@link HouseSplitService}</code>
 *
 * 房屋拆分数据服务类，包括子房屋查询，子房屋合并
 *
 * @author Administrator
 */
@Service
public class HouseSplitService extends BaseService {

    @Autowired
    private HouseService houseService;
    @Autowired
    private BmapService bmapService;
    protected static final String BMAP_SUCCESS_CODE ="000";//战图调用成功的code

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

        HouseBasic basic = houseService.getHouseBasic(houseId);//查询出主房子的信息
        HouseDetail detail = houseService.getHouseDetail(houseId); //查询出主房屋详细信息

        // 子房屋和已合并的房屋不能做房屋拆分
        if(basic.isSubRoom()){
            return ServiceResult.error("子房屋不能再拆分!");
        }
        if(centerRoDao.getJdbcDao().exists("sql.house.split.hasMeger", houseId)){
            return ServiceResult.error("已合并房屋不能再拆分，请在合并的房屋上做拆分!");
        }


        String roomNumber = houseName;
        houseName = getNewName(basic, roomNumber);
        //查询房屋名称是否已经存在
        if(null == houseName){
            return ServiceResult.error("房号已经存在，不能重复!");
        }

        // 查询子房扩展信息
        List<HouseDetail> subHouseDetailList = centerRoDao.getJdbcDao().queryForList(HouseDetail.class, "sql.house.split.querySubHouse", houseId);
        float totalArea = 0;
        float subTotalArea = 0;

        if(null ==detail || null == detail.getPropertyArea()){//计算主房屋物业面积
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
        // Integer count = centerRoDao.getJdbcDao().queryForInt("sql.count.subHouse1",houseId)+1;

        //*************获取从战图获取房屋编码start*************
        RequestHouse requestHouse=new RequestHouse();
        String id=UUIDUtil.create();
        requestHouse.setPropid(id);//用于战图返回json中辨识对应的房屋ID。
        requestHouse.setId("1");//代表要拆分的房屋编号，因为一次就只拆分一个房屋，所以这里写死1，代表第一个。
        requestHouse.setPropertyarea(String.valueOf(area));//要拆分的面积
        requestHouse.setType("0");//0：拆分  1：合并  2：无产权  3：虚拟房
        requestHouse.setPropertycode(basic.getCode());//房屋编码
        List<RequestHouse> params=new ArrayList<RequestHouse>();
        params.add(requestHouse);
        BmapResponse responseResult= bmapService.getBampHouseCode(params);
        String houseCode=null;
        if(responseResult.getHead().getCode().equals(BMAP_SUCCESS_CODE)){
            List<BmapResponseProps> props=responseResult.getResult().getProps();
            if(props.size()>0){
                BmapResponseProps prop=props.get(0);
                houseCode=prop.getPropcode();
            }else{
                log.debug("获取编码失败：错误编码:"+responseResult.getHead().getCode()+"，详细信息："+responseResult.getHead().getDescribe());
                return ServiceResult.error("获取战图编码为空，请联系系统管理员");
            }
        }else{
            log.debug("获取编码失败：错误编码:"+responseResult.getHead().getCode()+"，详细信息："+responseResult.getHead().getDescribe());
            return ServiceResult.error("获取战图编码失败，请稍后再试!");
        }
        //******************获取从战图获取房屋编码end****************

        subBasic.setId(id);
        subBasic.setName(houseName);
//        if(count > 9){
//        	subBasic.setCode(basic.getCode() + count);
//        }else{
//        	subBasic.setCode(basic.getCode() + "0" + count);
//        }
        subBasic.setCode(houseCode);//把从战图获取的房屋编码设置到拆分后的房屋中
        subBasic.setRoomNumber(roomNumber);
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

        /** 复制主房屋的客户信息 20151210 删除
         Map<String, String> queryParam = new HashMap<String, String>();
         queryParam.put("houseIdsCon", basic.getId());
         queryParam.put("houseMegerId", subBasic.getId());
         queryParam.put("userName", user.getName());
         queryParam.put("userId", user.getId());
         centerDao.insert("sql.house.merge.mergeCustomer",queryParam);
         **/

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

        HouseBasic basic = houseService.getHouseBasic(houseId);//查询出主房子的信息
        HouseDetail detail = houseService.getHouseDetail(houseId); //查询出主房屋详细信息
        String roomNumber = houseName;
        houseName = getNewName(basic, roomNumber);

        //查询房屋名称是否已经存在
        if(null == houseName){
            return ServiceResult.error("房号已经存在，不能重复!");
        }
        HouseBasic parentBasic = houseService.getHouseBasic(basic.getParentId());//查询主房屋信息

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
        //*************获取从战图获取房屋编码start*************
        RequestHouse requestHouse=new RequestHouse();
        String id=UUIDUtil.create();
        requestHouse.setPropid(id);//用于战图返回json中辨识对应的房屋ID。
        requestHouse.setId("1");//代表要拆分的房屋编号，因为一次就只拆分一个房屋，所以这里写死1，代表第一个。
        requestHouse.setPropertyarea(String.valueOf(area));//要拆分的面积
        requestHouse.setType("0");//0：拆分  1：合并  2：无产权  3：虚拟房
        requestHouse.setPropertycode(parentBasic.getCode());//房屋编码
        List<RequestHouse> params=new ArrayList<RequestHouse>();
        params.add(requestHouse);
        BmapResponse responseResult= bmapService.getBampHouseCode(params);
        String subHouseCode=null;
        if(responseResult.getHead().getCode().equals(BMAP_SUCCESS_CODE)){
            List<BmapResponseProps> props=responseResult.getResult().getProps();
            if(props.size()>0){
                BmapResponseProps prop=props.get(0);
                subHouseCode=prop.getPropcode();
            }else{
                log.debug("获取编码失败：错误编码:"+responseResult.getHead().getCode()+"，详细信息："+responseResult.getHead().getDescribe());
                return ServiceResult.error("获取战图编码为空，请联系系统管理员");
            }
        }else{
            log.debug("获取编码失败：错误编码:"+responseResult.getHead().getCode()+"，详细信息："+responseResult.getHead().getDescribe());
            return ServiceResult.error("获取战图编码失败，请稍后再试!");
        }
//        if(count > 9){
//        	subBasic.setCode(parentBasic.getCode() + count);
//        }else{
//        	subBasic.setCode(parentBasic.getCode() + "0" + count );
//        }
        subBasic.setCode(subHouseCode);
        //*************获取从战图获取房屋编码end*************
        subBasic.setRoomNumber(roomNumber);
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
        HouseBasic subBasic = houseService.getHouseBasic(houseId);
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
     * 获取并校验新项目名称，名称已存在返回null
     * @param oldHouse
     * @param newRoomNumber
     * @return
     */
    public String getNewName(HouseBasic oldHouse,String newRoomNumber){

        // 新房屋名称=旧房屋名称-就房号+新房号
        String parentName = oldHouse.getName();
        String parentNumber = oldHouse.getRoomNumber();
        if(parentName.endsWith(parentNumber)){
            parentName = (parentName+",").replace(parentNumber+",", "");
        }
        String newHouseName = parentName+newRoomNumber;
        if(centerRoDao.getJdbcDao().exists("sql.query.housename", newHouseName)){
            return null;
        }else{
            return newHouseName;
        }
    }


}
