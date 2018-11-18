package bingo.vkcrm.service.house.v1.controller;

import java.util.Date;
import java.util.List;

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
import bingo.vkcrm.service.house.v1.services.HouseMergeService;
import bingo.vkcrm.service.house.v1.services.HouseService;

/**
 * <code>{@link HouseMegerController}</code>
 * 房屋合并 Controller
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
@RequestMapping(value = Version.API_PATH)
@Controller
public class HouseMegerController extends BaseController {

    @Autowired
    private HouseMergeService houseMergeService;
    @Autowired
    private HouseService houseService;

    /**
     * 房屋合并<br>
     * 合并房屋所有面积是被合并房屋的面积之和<br>
     * 合并房屋继承被合并房屋的所有客户关系<br>
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     * @param houseIds 主房屋ID数组，房屋ID数量必须大于1
     * @return {@link ServiceResult}
     */
    @RequestMapping(value = "/house/{houseIds}/merge", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult houseMerge(@PathVariable(value = "houseIds") String[] houseIds, String houseName, Date checkInTime) throws Exception {
    	if(null == houseIds || houseIds.length < 1){
            throw new EmptyParameterException("houseIds", "房屋ID");
    	}
    	return houseMergeService.houseMerge(houseIds,houseName,checkInTime,getCurrentUser());
    }
    
    /**
     * 房屋合并<br>
     * 合并房屋所有面积是被合并房屋的面积之和<br>
     * 合并房屋继承被合并房屋的所有客户关系<br>
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     * @param houseCodes 主房屋Code数组，房屋ID数量必须大于1
     * @return {@link ServiceResult}
     */
    @RequestMapping(value = "/house/{houseCodes}/mergeByCode", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult houseMergeCode(@PathVariable(value = "houseCodes") String[] houseCodes, String roomNumber, Date checkInTime) throws Exception {
    	String[] houseIds = houseService.getHouseIdsByCodes(houseCodes);
    	if(null == houseIds || houseIds.length != houseCodes.length){
    		return ServiceResult.error("房屋不存在.");
    	}
    	return houseMerge(houseIds, roomNumber, checkInTime);
    }

    /**
     * 合并房屋复原（对外发布）<br>
     * 还原已合并的房屋，合并房屋，合并房屋的子房屋会被删除（软删），合并房屋跟主房屋关系删除（软删），客户关系不动
     * @param houseCode 合并房屋的编码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/house/{houseId}/mergeHouseRestore", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult mergeHouseRestore(@PathVariable(value = "houseId")String houseId) throws Exception {
        return houseMergeService.mergeHouseRestore(houseId,getCurrentUser());
    }
    
    /**
     * 合并房屋复原（对外发布）<br>
     * 还原已合并的房屋，合并房屋，合并房屋的子房屋会被删除（软删），合并房屋跟主房屋关系删除（软删），客户关系不动
     * @param houseCode 合并房屋的编码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/house/{houseCode}/mergeHouseRestoreByCode", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult mergeHouseRestoreByCode(@PathVariable(value = "houseCode")String houseCode) throws Exception {
    	List<HouseInfo> houseList = houseService.getHousesByCodes(new String[]{houseCode});
    	if(houseList.size() != 1){
    		return ServiceResult.error("房屋不存在.");
    	}
        return mergeHouseRestore(houseCode);
    }
    
    
    /**
     * 获取合并房源房屋<br>
     * 查询合并成当前房屋的源房屋
     * @param houseCode 合并房屋的编码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/house/{houseId}/getMerger", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getMerger(@PathVariable(value = "houseId")String houseId) throws Exception {
        return houseMergeService.getMerger(houseId);
    }    
    /**
     * 获取合并房源房屋(对外发布)<br>
     * 查询合并成当前房屋的源房屋
     * @param houseCode 合并房屋的编码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/house/{houseCode}/getMergerByCode", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getMergerByCode(@PathVariable(value = "houseCode")String houseCode) throws Exception {
    	List<HouseInfo> houseList = houseService.getHousesByCodes(new String[]{houseCode});
    	if(houseList.size() != 1){
    		return ServiceResult.error("房屋不存在.");
    	}
        return houseMergeService.getMerger(houseList.get(0).getId());
    }
    
    
    
    

    /**
     * 子房屋合并<br>
     * 多个子房屋合并，客户，面积合并到第一个房屋<br>
     * 其余子房屋做软删除，客户放人历史客户
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     * @param subHouseIds 子房屋ID，多个子房屋ID
     * @return {@link ServiceResult}
     */
    @RequestMapping(value = "/subHouse/{subHouseIds}/merge", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult subHouseMerge(@PathVariable(value = "subHouseIds") String[] subHouseIds) throws Exception {
    	if(null == subHouseIds || subHouseIds.length < 1){
            throw new EmptyParameterException("houseIds", "房屋ID");
    	}
        return houseMergeService.subHouseMerge(subHouseIds,getCurrentUser());
    }


    /**
     * 子房屋合并（对外）<br>
     * 多个子房屋合并，客户，面积合并到第一个房屋<br>
     * 其余子房屋做软删除，客户放人历史客户
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     * @param houseCodes 子房屋Code，多个子房屋Code
     * @return {@link ServiceResult}
     */
    @RequestMapping(value = "/subHouse/{houseCodes}/mergeByCodes", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult subHouseMergeCode(@PathVariable(value = "houseCodes") String[] houseCodes) throws Exception {
    	String[] houseIds = houseService.getHouseIdsByCodes(houseCodes);
    	if(null == houseIds || houseIds.length != houseCodes.length){
    		return ServiceResult.error("房屋不存在.");
    	}
    	return subHouseMerge(houseIds);
    }


}
