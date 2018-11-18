package bingo.vkcrm.service.house.v1.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.EmptyParameterException;
import bingo.vkcrm.service.house.v1.Version;
import bingo.vkcrm.service.house.v1.models.HouseInfo;
import bingo.vkcrm.service.house.v1.models.HouseOverview;
import bingo.vkcrm.service.house.v1.services.HouseService;
import bingo.vkcrm.service.house.v1.services.HouseSplitService;
/**
 * <code>{@link HouseSplitController}</code>
 * 房屋拆分 Controller
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */

@RequestMapping(value = Version.API_PATH)
@Controller
public class HouseSplitController extends BaseController {

    @Autowired
    private HouseSplitService service;
    @Autowired
    private HouseService houseService;

    /**
     * 根据房屋ID 获取子房屋
     * @param houseId 主房屋ID
     * @return
     */
    @RequestMapping(value = "/house/subhouse", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult querySubHouse(String houseId) throws Exception {
        if (StringUtils.isEmpty(houseId)) {
            throw new EmptyParameterException("houseId", "房屋id");
        }
        List<HouseOverview> list = service.getSubHouse(houseId);
        return ServiceResult.succeed(list);
    }

    /**
     * 根据房屋ID 获取子房屋(对外)
     * @param houseCode 主房屋code
     * @return
     */
    @RequestMapping(value = "/house/subhouse/listByCode", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult querySubHouseCode(String houseCode) throws Exception {
    	List<HouseInfo> houseList = houseService.getHousesByCodes(new String[]{houseCode});
    	if(houseList.size() != 1){
    		return ServiceResult.error("房屋不存在.");
    	}
        return querySubHouse(houseList.get(0).getId());
    }

    /**
     * 房屋拆分<br>
     * V1.00 熊朝隆<br>
     * V2.00 邱楚生 手机号码:15916451862,13560392970 QQ:65509713：增加面积判断，客房关系处理<br>
     * @param houseId 主房屋ID
     * @param houseName 子房屋名称
     * @param checkInTime 入住日期
     * @param area 面积：子房屋总面积不能大与主房屋
     * @return {@link ServiceResult}
     */
    @RequestMapping(value = "/house/{houseId}/split", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult houseSplit(@PathVariable(value = "houseId") String houseId,String houseName, String checkInTime,float area) throws Exception {
        if (StringUtils.isEmpty(houseId)) {
            throw new EmptyParameterException("houseId", "房屋ID");
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date startdate = sdf.parse(checkInTime);
        return service.split(houseId, houseName, startdate,area,getCurrentUser());
    }

    /**
     * 房屋拆分<br>
     * V1.00 熊朝隆<br>
     * V2.00 邱楚生 手机号码:15916451862,13560392970 QQ:65509713：增加面积判断，客房关系处理<br>
     * @param houseCode 主房屋Code
     * @param houseName 子房屋名称
     * @param checkInTime 入住日期
     * @param area 面积：子房屋总面积不能大与主房屋
     * @return {@link ServiceResult}
     */
    @RequestMapping(value = "/house/{houseCode}/splitByCode", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult houseSplitCode(@PathVariable(value = "houseCode") String houseCode,String roomNumber, String checkInTime,float area) throws Exception {
    	List<HouseInfo> houseList = houseService.getHousesByCodes(new String[]{houseCode});
    	if(houseList.size() != 1){
    		return ServiceResult.error("房屋不存在.");
    	}
    	return houseSplit(houseList.get(0).getId(), roomNumber, checkInTime, area);
    }
    

    /**
     * 删除子房屋<br>
     * @param subHouseId 子房屋ID
     * @return {@link ServiceResult}
     */
    @RequestMapping(value = "/subHouse/{subHouseId}/del", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult deleteSubHouse(@PathVariable(value = "subHouseId") String subHouseId) throws Exception {
        if (StringUtils.isEmpty(subHouseId)) {
            throw new EmptyParameterException("subhouseId", "子房屋ID");
        }
        return service.deleteSubHouse(subHouseId,getCurrentUser());
    }
    

    /**
     * 删除子房屋（对外）
     * @param subHouseCode 子房屋Code
     */
    @RequestMapping(value = "/subHouse/{subHouseCode}/delByCode", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult deleteSubHouseCode(@PathVariable(value = "subHouseCode") String subHouseCode) throws Exception {
    	List<HouseInfo> houseList = houseService.getHousesByCodes(new String[]{subHouseCode});
    	if(houseList.size() != 1){
    		return ServiceResult.error("房屋不存在.");
    	}
        return deleteSubHouse(houseList.get(0).getId());
    }

    /**
     * 子房屋拆分<br>
     * 从子房屋上分割一块面积出来做为新的子房屋<br>
     * 新的子房屋面积必须小于被拆分的子房屋<br>
     * 新的子房屋客户继承被拆分子房屋的客户
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     * @param subHouseId 被拆分子房屋ID
     * @param houseName   新子房屋名称
     * @param checkInTime 入住日期
     * @param area 新子房屋面积
     * @return {@link ServiceResult}
     */
    @RequestMapping(value = "/subHouse/{subHouseId}/split", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult subHouseSplit(@PathVariable(value = "subHouseId") String subHouseId,String houseName, String checkInTime,float area) throws Exception {
        if (StringUtils.isEmpty(subHouseId)) {
            throw new EmptyParameterException("houseId", "房屋ID");
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date startdate = sdf.parse(checkInTime);
    	return service.subHouseSplit(subHouseId, houseName, startdate, area,getCurrentUser());
    }

    /**
     * 子房屋拆分<br>
     * 从子房屋上分割一块面积出来做为新的子房屋<br>
     * 新的子房屋面积必须小于被拆分的子房屋<br>
     * 新的子房屋客户继承被拆分子房屋的客户
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     * @param subHouseCode 被拆分子房屋Code
     * @param houseName   新子房屋名称
     * @param checkInTime 入住日期
     * @param area 新子房屋面积
     * @return {@link ServiceResult}
     */
    @RequestMapping(value = "/subHouse/{subHouseCode}/splitByCode", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult subHouseSplitCode(@PathVariable(value = "subHouseCode") String subHouseCode,String roomNumber, String checkInTime,float area) throws Exception {
    	List<HouseInfo> houseList = houseService.getHousesByCodes(new String[]{subHouseCode});
    	if(houseList.size() != 1){
    		return ServiceResult.error("房屋不存在.");
    	}
    	return subHouseSplit(houseList.get(0).getId(), roomNumber, checkInTime, area);
    }



}
