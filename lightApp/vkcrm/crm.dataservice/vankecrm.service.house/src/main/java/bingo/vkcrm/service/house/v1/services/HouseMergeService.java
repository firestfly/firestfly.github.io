package bingo.vkcrm.service.house.v1.services;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.house.v1.models.*;
import bingo.vkcrm.service.house.v1.models.bmap.BmapHouse;
import bingo.vkcrm.service.house.v1.models.bmap.BmapResponse;
import bingo.vkcrm.service.house.v1.models.bmap.BmapResponseProps;
import bingo.vkcrm.service.house.v1.models.bmap.RequestHouse;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.service.BaseService;

/**
 * 房屋数据服务
 */
@Service
public class HouseMergeService extends BaseService {
    protected static final String BMAP_SUCCESS_CODE ="000";//战图调用成功的code
    @Autowired
    private HouseSplitService houseSplitService;
    @Autowired
    private HouseService houseService;
    @Autowired
    private BmapService bmapService;
    /**
     * 房屋合并<br>
     * 合并房屋所有面积是被合并房屋的面积之和<br>
     * 合并房屋继承被合并房屋的所有客户关系<br>
     *
     * @param houseIds 主房屋ID数组，房屋ID数量必须大于1
     * @return {@link ServiceResult}
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     */
    public ServiceResult houseMerge(String[] houseIds, String houseName, Date checkInTime, User user) throws Exception {

        // 校验房屋ID是否大于2
        if (null == houseIds || houseIds.length < 2) {
            return ServiceResult.error("必须选择2个或2个以上房屋做合并。");
        }
        String houseIdsCon = getConStr(houseIds);
        Map<String, String> queryParam = new HashMap<String, String>();
        queryParam.put("houseIdsCon", houseIdsCon);

        // 校验房屋是否已经有合并房，房屋不能重复被合并
        List<HouseBasic> hasMergeHouse = centerRoDao.queryForList(HouseBasic.class, "sql.house.merge.queryHasMergeHouse", queryParam);
        if (null != hasMergeHouse && hasMergeHouse.size() > 0) {
            String errorMsg = "已经合并过的房屋不能再合并：";
            for (HouseBasic houseBasic : hasMergeHouse) {
                errorMsg += houseBasic.getName() + "，";
            }
            errorMsg = errorMsg.substring(0, errorMsg.length() - 1);
            return ServiceResult.error(errorMsg);
        }

        // 校验房屋是否有子房屋，有子房屋不给合并
        List<HouseBasic> hasSubHouse = centerRoDao.queryForList(HouseBasic.class, "sql.house.merge.queryHasSubHouse", queryParam);
        if (null != hasSubHouse && hasSubHouse.size() > 0) {
            String errorMsg = "有子房屋的房屋不能再合并：";
            for (HouseBasic houseBasic : hasSubHouse) {
                errorMsg += houseBasic.getName() + "，";
            }
            errorMsg = errorMsg.substring(0, errorMsg.length() - 1);
            return ServiceResult.error(errorMsg);
        }

        // 查询被合并房屋信息，生成新房屋
        List<HouseBasic> houses = centerRoDao.queryForList(HouseBasic.class, "sql.house.merge.queryHouses", queryParam);
        List<HouseDetail> houseDetails = centerRoDao.queryForList(HouseDetail.class, "sql.house.merge.queryHouseDetails", queryParam);

        HouseBasic houseBasicMerge = (HouseBasic) BeanUtils.cloneBean(houses.get(0));

        HouseDetail houseDetailMerge = null;//保留房屋扩展信息
        for (HouseDetail temp : houseDetails) {
            if (temp.getId().equals(houseBasicMerge.getId())) {
                houseDetailMerge = (HouseDetail) BeanUtils.cloneBean(temp);
            }
        }

        // 生成并校验房屋新名称
        String roomNumber = houseName;
        houseName = houseSplitService.getNewName(houseBasicMerge, roomNumber);
        //查询房屋名称是否已经存在
        if (null == houseName) {
            return ServiceResult.error("房号已经存在，不能重复!");
        }


        // 复制第一个房屋信息给合并房屋
        //BeanUtils.copyPrope;(houses.get(0), houseBasicMerge);
        /**
         BeanUtils.copyProperties(houses.get(0), houseBasicMerge, "assistCode",
         "buildingCode", "buildingName", "unit", "floor",
         "status", "statusText", "equityType", "equityTypeText",
         "contactsId", "contactsMobile", "contactsName", "broadband",
         "broadbandText", "checkInTime", "isSecondhand", "roomNumber","virtual");
         **/
        // 设置房屋基本信息
        houseBasicMerge.setId(UUIDUtil.create());
        String houseCode=null;
        BmapResponse responseResult=getNewCode(houses,houseDetails);
        if(responseResult.getHead().getCode().equals(BMAP_SUCCESS_CODE)){
            List<BmapResponseProps> props=responseResult.getResult().getProps();
            if(props.size()>0){
                BmapResponseProps prop=props.get(0);
                houseCode=prop.getPropcode();
            }else{
                log.debug("获取编码失败：错误编码:"+responseResult.getHead().getCode()+"，详细信息："+responseResult.getHead().getDescribe());
                return ServiceResult.error("合并主房屋获取战图编码为空，请联系系统管理员");
            }
        }else{
            log.debug("获取编码失败：错误编码:"+responseResult.getHead().getCode()+"，详细信息："+responseResult.getHead().getDescribe());
            return ServiceResult.error("合并主房屋获取战图编码失败，请稍后再试!");
        }
        houseBasicMerge.setCode(houseCode);
        houseBasicMerge.setParentId("");
        houseBasicMerge.setName(houseName);
        houseBasicMerge.setRoomNumber(roomNumber);
        houseBasicMerge.setHasSubRoom(false);
        houseBasicMerge.setCombine(true);
        houseBasicMerge.setVirtual(true);
        houseBasicMerge.setModifier(user.getName());
        houseBasicMerge.setModifierId(user.getId());
        houseBasicMerge.setModifyTime(new Date());

        // 复制第一个房屋扩展信息给合并房屋
        if (null != houseDetails && houseDetails.size() > 0) {

            //BeanUtils.copyProperties(houseDetails.get(0), houseDetailMerge);
            /**
             BeanUtils.copyProperties(houseDetails.get(0), houseDetailMerge, "address",
             "province", "city", "district", "buildingNo", "floor", "unit",
             "orientation", "salesUnitPrice", "referenceServiceCharge",
             "isSubsidiary", "practicalUse");**/

            // 汇总房屋信息
            summaryIntegerProperties(houseDetails, houseDetailMerge, "roomCount", "hallCount", "kitchenCount", "toiletCount");
            summaryBigDecimalProperties(houseDetails, houseDetailMerge, "areaOfPreSale", "builtUpArea", "actualConstructionArea",
                    "preSaleConstructionArea", "propertyArea", "measuredBasementArea", "terraceArea", "setArea", "measuredPoolArea",
                    "gardenArea", "basementArea", "fieldMeasuredArea", "poolArea", "garageArea");
        }
        houseDetailMerge.setId(houseBasicMerge.getId());
        houseDetailMerge.setModifier(user.getName());
        houseDetailMerge.setModifierId(user.getId());
        houseDetailMerge.setModifyTime(new Date());

        centerDao.insert(houseBasicMerge);//保存合并房屋基本信息
        centerDao.insert(houseDetailMerge);//保存合并房屋扩展信息

        // 保存原房屋和合并房屋的对应关系
        List<MidHouseMerge> midHouseMerges = new ArrayList<MidHouseMerge>();
        for (HouseBasic h : houses) {
            MidHouseMerge midHouseMerge = new MidHouseMerge();
            midHouseMerge.setHouseid(h.getId());
            midHouseMerge.setMergetohouseid(houseBasicMerge.getId());
            midHouseMerge.setCreator(user.getName());
            midHouseMerge.setCreatorid(user.getId());
            midHouseMerge.setIsdeleted("0");
            midHouseMerge.setCreatetime(new Date());
            midHouseMerges.add(midHouseMerge);
        }
        centerDao.batchInsert(MidHouseMerge.class, midHouseMerges);

        /** 合并客房关系 20151210 删除
         queryParam.put("houseMegerId", houseBasicMerge.getId());
         queryParam.put("userName", user.getName());
         queryParam.put("userId", user.getLoginId());
         centerDao.insert("sql.house.merge.mergeCustomer",queryParam);
         **/

        // 修改主房屋的最后修改时间
        for (HouseBasic houseBasic : houses) {
            houseBasic.setModifier(user.getName());
            houseBasic.setModifierId(user.getId());
            houseBasic.setModifyTime(new Date());
            centerDao.updateFields(houseBasic, "modifier", "modifierId", "modifyTime");
        }
        Map<String,Object>projtHouseMap = new HashMap<String, Object>();
        projtHouseMap.put("houseIds",houses.get(0).getId());
        String gridId = centerRoDao.queryForString("sql.mid.project.house.byHouseId",projtHouseMap);
        // 插入房屋项目对应关系
        centerDao.getJdbcDao().insert("sql.house.split.insertProjectRelation", houseBasicMerge.getId(),gridId, houses.get(0).getId());
        return ServiceResult.succeed(houseBasicMerge.getId());


        /** 复制字段
         address
         province
         city
         district
         buildingNo
         floor
         unit
         orientation
         salesUnitPrice
         referenceServiceCharge
         isSubsidiary
         practicalUse
         汇总字段
         roomCount(Integer)
         hallCount(Integer)
         kitchenCount(Integer)
         toiletCount(Integer)
         areaOfPreSale(BigDecimal)
         builtUpArea(BigDecimal)
         actualConstructionArea(BigDecimal)
         preSaleConstructionArea(BigDecimal)
         propertyArea(BigDecimal)
         measuredBasementArea(BigDecimal)
         terraceArea(BigDecimal)
         setArea(BigDecimal)
         measuredPoolArea(BigDecimal)
         gardenArea(BigDecimal)
         basementArea(BigDecimal)
         fieldMeasuredArea(BigDecimal)
         poolArea(BigDecimal)
         garageArea(BigDecimal) **/
    }


    /**
     * 子房屋合并<br>
     * 多个子房屋合并，客户，面积合并到第一个房屋<br>
     * 其余子房屋做软删除，客户放人历史客户
     *
     * @param houseIds 子房屋ID，多个子房屋ID
     * @return {@link ServiceResult}
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     */
    public ServiceResult subHouseMerge(String[] houseIds, User user) {

        // 校验房屋ID是否大于2
        if (null == houseIds || houseIds.length < 2) {
            return ServiceResult.error("必须选择2个或2个以上房屋做合并。");
        }
        String houseIdsCon = getConStr(houseIds);
        Map<String, String> queryParam = new HashMap<String, String>();
        queryParam.put("houseIdsCon", houseIdsCon);

        // 查询被合并房屋信息，生成新房屋
        List<HouseBasic> houses = centerRoDao.queryForList(HouseBasic.class, "sql.house.merge.queryHouses", queryParam);
        List<HouseDetail> houseDetails = centerRoDao.queryForList(HouseDetail.class, "sql.house.merge.queryHouseDetails", queryParam);

        HouseBasic houseBasicMerge = houses.get(0);//保留房屋基本信息
        HouseDetail houseDetailMerge = null;//保留房屋扩展信息
        for (HouseDetail temp : houseDetails) {
            if (temp.getId().equals(houseBasicMerge.getId())) {
                houseDetailMerge = temp;
            }
        }

        // 删除被合并的子房屋
        for (int i = 1; i < houses.size(); i++) {
            HouseBasic house = houses.get(i);
            Map<String, Object> updateMap = new HashMap<String, Object>();
            updateMap.put("isDeleted", "1");
            updateMap.put("deleter", user.getName());
            updateMap.put("deleterId", user.getId());
            updateMap.put("deleteTime", new Date());
            updateMap.put("id", house.getId());
            centerDao.getJdbcDao().updateByMap("main_house", "id", updateMap, true);
        }

        // 计算合并房面积等于要合并的子房屋的面积之和
        float totalArea = 0;
        for (HouseDetail houseDetail : houseDetails) {
            totalArea += houseDetail.getPropertyArea().floatValue();
        }

        // 更新合并房屋修改信息
        Map<String, Object> updateMap = new HashMap<String, Object>();
        updateMap.put("id", houseBasicMerge.getId());
        updateMap.put("modifier", user.getName());
        updateMap.put("modifierId", user.getId());
        updateMap.put("modifyTime", new Date());
        centerDao.getJdbcDao().updateByMap("main_house", "id", updateMap, true);

        // 更新合并房物业面积
        updateMap = new HashMap<String, Object>();
        updateMap.put("id", houseDetailMerge.getId());
        updateMap.put("propertyArea", totalArea);
        centerDao.getJdbcDao().updateByMap("main_house_detail", "id", updateMap, true);
        return ServiceResult.succeed(houseBasicMerge.getId());
    }


    /**
     * 合并房屋复原<br>
     * 还原已合并的房屋，合并房屋，合并房屋的子房屋会被删除（软删），合并房屋跟主房屋关系删除（软删），客户关系不动
     *
     * @param houseId 合并房屋的ID
     * @return
     * @throws Exception
     */
    public ServiceResult mergeHouseRestore(String houseId, User user) {

        // 获取房屋信息
        HouseBasic house = houseService.getHouseBasic(houseId);

        // 检查房屋是否合并房
        if (!house.isCombine()) {
            return ServiceResult.error("必须合并房屋才能做还原！");
        }

        //删除子房屋和本身
        centerDao.getJdbcDao().update("sql.house.mergeHouseRestore.deleteHouse", user.getId(), houseId, houseId);
        //删除合并关系
        centerDao.getJdbcDao().update("sql.house.mergeHouseRestore.deleteRelation", user.getId(), houseId);

        return ServiceResult.succeed("合并房屋复原成功");

    }


    /**
     * 获取房屋ID用逗号分隔的字符串
     *
     * @param houseIds
     * @return
     */
    private String getConStr(String[] houseIds) {
        String houseIdsCon = "";
        for (String houseId : houseIds) {
            houseIdsCon += houseId + ",";
        }
        houseIdsCon = houseIdsCon.substring(0, houseIdsCon.length() - 1);
        return houseIdsCon;
    }

    /**
     * 获取新房屋编码
     *
     * @param houses
     * @return
     */
    private BmapResponse getNewCode(List<HouseBasic> houses,List<HouseDetail> houseDetails) throws Exception{
        //*************获取从战图获取房屋编码start*************
        StringBuffer houseCodeSb=new StringBuffer();
        StringBuffer areaSb=new StringBuffer();
        for (HouseBasic house : houses) {
            houseCodeSb.append(house.getCode()+"|");
        }

        for (HouseDetail houseDetail : houseDetails) {
            areaSb.append(houseDetail.getPropertyArea()+"|");
        }

        String houseCode=houseCodeSb.toString().substring(0,houseCodeSb.toString().length()-1);
        String area=areaSb.toString().substring(0,areaSb.toString().length()-1);

        RequestHouse requestHouse=new RequestHouse();
        String id=UUIDUtil.create();
        requestHouse.setPropid(id);//用于战图返回json中辨识对应的房屋ID。
        requestHouse.setId("1");//代表要合并的房屋编号，因为一次就只合并一个房屋，所以这里写死1，代表第一个。
        requestHouse.setPropertyarea(area);//要合并的面积，格式为  XXX|XXX|XXX....
        requestHouse.setType("1");//0：拆分  1：合并  2：无产权  3：虚拟房
        requestHouse.setPropertycode(houseCode);//房屋编码，格式为  XXX|XXX|XXX....
        List<RequestHouse> params=new ArrayList<RequestHouse>();
        params.add(requestHouse);
        return  bmapService.getBampHouseCode(params);

        //******************获取从战图获取房屋编码end****************



//        String code = houses.get(0).getCode();
//        boolean isCodeExists = true;
//        int i = 100;
//        do {
//            code = houses.get(0).getCode() + i;
//            isCodeExists = isExists("main_house", "code", code);
//            i++;
//        } while (isCodeExists == true);
//        return code;
    }

    /**
     * BigDecimal 类型字段汇总
     *
     * @param souses
     * @param target
     * @param ignoreProperties
     */
    private void summaryBigDecimalProperties(List<HouseDetail> souses, Object target, String... ignoreProperties) {
        for (String property : ignoreProperties) {
            BigDecimal total = new BigDecimal(0);
            for (Object souse : souses) {
                total = total.add(getFieldValueByNameBigDecimal(property, souse));
            }
            setFieldValueByName(property, total, target);
        }
    }

    /**
     * Integer 类型字段汇总
     *
     * @param souses
     * @param target
     * @param ignoreProperties
     */
    private void summaryIntegerProperties(List<HouseDetail> souses, Object target, String... ignoreProperties) {
        for (String property : ignoreProperties) {
            Integer total = 0;
            for (Object souse : souses) {
                total += getFieldValueByNameInteger(property, souse);
            }
            setFieldValueByName(property, total, target);
        }
    }

    /**
     * 获取一个对象的属性值
     *
     * @param fieldName
     * @param o
     * @return
     */
    private Integer getFieldValueByNameInteger(String fieldName, Object o) {
        Object value = null;
        try {
            String firstLetter = fieldName.substring(0, 1).toUpperCase();
            String getter = "get" + firstLetter + fieldName.substring(1);
            Method method = o.getClass().getMethod(getter, new Class[]{});
            value = method.invoke(o, new Object[]{});
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        if (null == value) return 0;
        return (Integer) value;
    }

    /**
     * 获取一个对象的属性值
     *
     * @param fieldName
     * @param o
     * @return
     */
    private BigDecimal getFieldValueByNameBigDecimal(String fieldName, Object o) {
        Object value = null;
        try {
            String firstLetter = fieldName.substring(0, 1).toUpperCase();
            String getter = "get" + firstLetter + fieldName.substring(1);
            Method method = o.getClass().getMethod(getter, new Class[]{});
            value = method.invoke(o, new Object[]{});
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        if (null == value) return new BigDecimal(0);
        return (BigDecimal) value;
    }

    /**
     * 设置一个对象的属性值
     *
     * @param fieldName
     * @param o
     * @return
     */
    private void setFieldValueByName(String fieldName, Object value, Object o) {
        try {
            String firstLetter = fieldName.substring(0, 1).toUpperCase();
            String getter = "set" + firstLetter + fieldName.substring(1);
            Method method = o.getClass().getMethod(getter, new Class[]{value.getClass()});
            method.invoke(o, new Object[]{value});
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }


    /**
     * 校验数据是否存在
     *
     * @param tableName
     * @param colName
     * @param value
     * @return
     */
    private boolean isExists(String tableName, String colName, String value) {
        String sql = "select count(*) from " + tableName + " where " + colName + " = ? ";
        return centerRoDao.getJdbcDao().exists(sql, value);
    }

    /**
     * 获取合并房源房屋<br>
     * 查询合并成当前房屋的源房屋
     *
     * @param houseId 合并房屋的编码
     * @return
     * @throws Exception
     */
    public ServiceResult getMerger(String houseId) {
        //查询源房屋
        return ServiceResult.succeed(centerDao.getJdbcDao().queryForList(HouseOverview.class, "sql.house.mergeHouse.getMerger", houseId));

    }

}
