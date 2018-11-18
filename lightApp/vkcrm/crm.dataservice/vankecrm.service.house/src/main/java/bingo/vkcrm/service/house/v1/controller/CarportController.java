package bingo.vkcrm.service.house.v1.controller;

import bingo.dao.Page;
import bingo.security.principal.IUser;
import bingo.security.principal.User;
import bingo.vkcrm.service.exceptions.EmptyParameterException;
import bingo.vkcrm.service.house.v1.Version;
import bingo.vkcrm.service.house.v1.models.CarportGroup;
import bingo.vkcrm.service.house.v1.models.CarportOverview;
import bingo.vkcrm.service.house.v1.services.CarportService;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;

/**
 * 车位分组controller
 */
@Controller
@RequestMapping(value = Version.API_PATH + "/carport")
public class CarportController extends BaseController {

    @Autowired
    CarportService service;

    /**
     * 获取项目下所有分组信息
     *
     * @param projectId 所属项目id
     * @param carparkId 所属项目下指定车场的id
     * @return ServiceResult
     */
    @RequestMapping(value = "/groups/{projectId}/{carparkId}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getGroups(@PathVariable("projectId") String projectId, @PathVariable("carparkId") String carparkId) {
    	bingo.vkcrm.service.common.User loginUser = getCurrentUser();
    	try {
            List<CarportGroup> list = service.queryGroups(loginUser, projectId, carparkId);
            return ServiceResult.succeed(list);
        } catch (Exception ex) {
            return ServiceResult.error(ex);
        }
    }
    
    /**
     * 查询项目下指定车场的哪个组中能找到指定的车位
     *
     * @param projectId 所属项目id
     * @param carparkId 所属项目下指定车场的id
     * @return ServiceResult
     */
    @RequestMapping(value = "/querygroup/{projectId}/{carparkId}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getGroupId(String carportName, @PathVariable("projectId") String projectId, @PathVariable("carparkId") String carparkId) {
    	bingo.vkcrm.service.common.User loginUser = getCurrentUser();
    	try {
    		String groupId = service.queryGroupId(carportName, loginUser, projectId, carparkId);
            return ServiceResult.succeed(groupId);
        } catch (Exception ex) {
            return ServiceResult.error(ex);
        }
    }

    /**
     * 查询分组下车位信息
     *
     * @param projectId 所属项目id
     * @param carparkId 所属项目下指定车场的id
     * @param curPage 当前页码
     * @param groupId 分组id
     * @return
     */
    @RequestMapping(value = "/group/{projectId}/{carparkId}/{groupId}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getCarports(int curPage, String carportName, @PathVariable("projectId") String projectId, @PathVariable("carparkId") String carparkId, @PathVariable("groupId") String groupId) {
    	bingo.vkcrm.service.common.User loginUser = getCurrentUser();
    	try {
            Page pager = new Page();
            pager.setPageSize(30);
            pager.setPage(curPage);
            List<CarportOverview> list = service.queryCarports(pager, carportName, loginUser, projectId, carparkId, groupId);
            ListResult<CarportOverview> listResult = new ListResult<CarportOverview>(pager, list);
            return ServiceResult.succeed(listResult);
        } catch (Exception ex) {
            return ServiceResult.error(ex);
        }
    }

    /**
     * 查询当前项目未分组的车位信息
     *
     * @param projectId 所属项目id
     * @param carparkId 所属项目下指定车场的id
     * @param curPage   当前页码
     * @param projectId 所属项目id
     * @return
     */
    @RequestMapping(value = "/{projectId}/{carparkId}/ungroup", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getUnGroupCarports(int curPage, String carportName, @PathVariable("projectId") String projectId, @PathVariable("carparkId") String carparkId) {
    	bingo.vkcrm.service.common.User loginUser = getCurrentUser();
    	try {
            Page pager = new Page();
            pager.setPageSize(30);
            pager.setPage(curPage);
            List<CarportOverview> list = service.queryUnGroupCarports(pager, carportName, loginUser, projectId, carparkId);
            ListResult<CarportOverview> listResult = new ListResult<CarportOverview>(pager, list);
            return ServiceResult.succeed(listResult);
        } catch (Exception ex) {
            return ServiceResult.error(ex);
        }
    }

    /**
     * 根据车位查询车位下的客户
     *
     * @param parkId    车位ID
     * @param isdeleted 0:现有客户 1:历史客户
     * @return
     */
    @RequestMapping(value = "/{carportId}/customer", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getCarportsCustomer(@PathVariable(value = "carportId") String parkId, int isdeleted) throws Exception {
        if (parkId == null) {
            throw new EmptyParameterException("parkId", "车位ID");
        }
        return ServiceResult.succeed(service.queryParkCustomer(parkId, isdeleted));
    }

    /**
     * 添加分组，传入CarportGroup对象
     *
     * @param projectId 所属项目编号
     * @param groupName 分组名称
     * @return
     */
    @RequestMapping(value = "/group", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addGroup(String projectId, String groupName) {
        try {
            boolean isSuccess = service.addGroup(projectId, groupName, new User());
            return ServiceResult.succeed(isSuccess);
        } catch (Exception ex) {
            return ServiceResult.error(ex);
        }
    }

    /**
     * 将车位加入到已建好的分组中
     *
     * @param groupId    分组id
     * @param carportIds 车位id集合
     * @return boolean
     */
    @RequestMapping(value = "/group/carport", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addCarports(String groupId, String[] carportIds) {
        try {
            boolean isSuccess = service.addCarports(groupId, carportIds);
            return ServiceResult.succeed(isSuccess);
        } catch (Exception ex) {
            return ServiceResult.error(ex);
        }
    }

    /**
     * 通过车位ID获取车位详细信息
     *
     * @param carportId 车位ID
     * @return 车位详细信息
     */
    @RequestMapping(value = "/{carportId}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCarportInfo(@PathVariable("carportId") String carportId) {
        ServiceResult serviceResult = new ServiceResult();
        try {
            serviceResult.setDetails(service.queryCarportInfo(carportId));
            serviceResult.setSuccess(true);
            return serviceResult;
        } catch (Exception ex) {
            ex.printStackTrace();
            return ServiceResult.error(ex);
        }
    }


    /**
     * 更新车位相关信息(状态，常用联系人，出租（售）时间)
     *
     * @param carportId 车位ID
     * @return serviceResult
     */
    @RequestMapping(value = "/{carportId}", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateCarportInfo(@PathVariable("carportId") String carportId,String status,String contactsId,Date startTime) {
        ServiceResult serviceResult = new ServiceResult();
        try {
            serviceResult.setDetails(service.updateCarportInfo(carportId, status, contactsId, startTime, getCurrentUser()));
            serviceResult.setSuccess(true);
            return serviceResult;
        } catch (Exception ex) {
            ex.printStackTrace();
            return ServiceResult.error(ex);
        }
    }


//    /**
//     * 车位过户
//     *
//     * @param carportId 车位ID
//     * @param newIds 新的客户ID
//     * @return
//     */
//    @RequestMapping(value = "/carportInfo/{carportId}/carportTransfer", method = RequestMethod.POST)
//    @ResponseBody
//    public ServiceResult carportTransfer(@PathVariable("carportId") String carportId,String[] newIds) {
//        ServiceResult serviceResult=new ServiceResult();
//
//        try{
//            serviceResult.setSuccess(service.carportTransfer(carportId, newIds, getCurrentUser()));
//            serviceResult.setMessage("车位过户成功!");
//            return serviceResult;
//        }catch(Exception ex){
//            ex.printStackTrace();
//            return ServiceResult.error(ex);
//        }
//    }





}
