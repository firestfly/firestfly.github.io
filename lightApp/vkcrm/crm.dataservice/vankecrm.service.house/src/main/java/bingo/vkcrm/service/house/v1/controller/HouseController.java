package bingo.vkcrm.service.house.v1.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bingo.vkcrm.service.house.v1.services.ProjectService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.StopWatch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.EmptyParameterException;
import bingo.vkcrm.service.house.v1.Version;
import bingo.vkcrm.service.house.v1.models.Grid;
import bingo.vkcrm.service.house.v1.models.HouseBasic;
import bingo.vkcrm.service.house.v1.models.HouseDetail;
import bingo.vkcrm.service.house.v1.models.HouseLite;
import bingo.vkcrm.service.house.v1.models.HouseOverviewMain;
import bingo.vkcrm.service.house.v1.services.GridService;
import bingo.vkcrm.service.house.v1.services.HouseMergeService;
import bingo.vkcrm.service.house.v1.services.HouseService;

@RequestMapping(value = Version.API_PATH)
@Controller
public class HouseController extends BaseController {

    @Autowired
    private HouseService service;
    @Autowired
    private GridService gService;
    @Autowired
    private ProjectService pService;

    /**
     * 查询该楼栋（或单元的）楼层
     *
     * @param projectId
     * @param buildingId
     * @param unitId
     * @return
     */
    @RequestMapping(value = "/house/floor", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryFloor(String projectId, String buildingId, String unitId) throws Exception {
        User loginUser = super.getCurrentUser();
        if (StringUtils.isEmpty(projectId)) {
            throw new EmptyParameterException("projectId", "项目id");
        }
        if (StringUtils.isEmpty(buildingId)) {
            throw new EmptyParameterException("buildingId", "楼栋id");
        }

        String gridId = "";
        if(!loginUser.hasPermission("TREE_VIEW_PROJECT_ALL")){
            gridId = gService.getGridId(loginUser.getId(), projectId);
        }

        Integer[] floor = service.queryFloor(projectId, buildingId, unitId, gridId);
        return ServiceResult.succeed(floor);
    }

    /**
     * 查询该楼栋的所有房屋
     *
     * @param projectId
     * @param buildingId
     * @param unitId
     * @param floor
     * @return
     */
    @RequestMapping(value = "/house/floor/overviews", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryHouseOverview(String projectId, String buildingId, String unitId,
                                            int floor) throws Exception {
        User loginUser = super.getCurrentUser();
        if (StringUtils.isEmpty(projectId)) {
            throw new EmptyParameterException("projectId", "项目id");
        }
        if (StringUtils.isEmpty(buildingId)) {
            throw new EmptyParameterException("buildingId", "楼栋id");
        }

        String gridId = "";
        if(!loginUser.hasPermission("TREE_VIEW_PROJECT_ALL")){
            gridId = gService.getGridId(loginUser.getId(), projectId);
        }

        List<HouseOverviewMain> list = service.queryOverviews(projectId, buildingId, unitId, floor, gridId);       

        Page pager = new Page();
        pager.setPage(1);
        pager.setPageSize(20);
        ListResult<HouseOverviewMain> listResult = new ListResult<HouseOverviewMain>(pager, list);
        return ServiceResult.succeed(listResult);
    }

    /**
     * 展示房屋基本信息
     *
     * @param houseId 房屋id
     * @return
     */
    @RequestMapping(value = "/house/basic", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getHouseBasic(String houseId) throws Exception {
        if (StringUtils.isEmpty(houseId)) {
            throw new EmptyParameterException("houseId", "房屋Id");
        }
        HouseBasic basic = service.getHouseBasic(houseId);
        return ServiceResult.succeed(basic);
    }

    /**
     * 展示房屋基本信息
     *
     * @param houseId 房屋id
     * @return
     */
    @RequestMapping(value = "/house/detail", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getHouseDetail(String houseId) throws Exception {
        if (StringUtils.isEmpty(houseId)) {
            throw new EmptyParameterException("houseId", "房屋Id");
        }
        StopWatch watch = new StopWatch();
        watch.start();
        HouseDetail detail = service.getHouseDetail(houseId);
        // TODO:增加获取房屋布局的方法调用
//        detail.setLayoutText(service.getHouseLayout(detail.getLayout()));
        watch.stop();
        System.out.println(watch.toString());
        return ServiceResult.succeed(detail);
    }

    /**
     * 展示房屋信息及详情、业主入住记录
     *
     * @param houseId 房屋ID
     * @return
     */
    @RequestMapping(value = "/house/full", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getHouse(String houseId) throws Exception {
        // 仅用作向前端提供整合数据
        Map<String, Object> integrated = new HashMap<String, Object>();
        if (StringUtils.isEmpty(houseId)) {
            throw new EmptyParameterException("houseId", "房屋Id");
        }
        integrated.put("basic", service.getHouseBasic(houseId));
        integrated.put("detail", service.getHouseDetail(houseId));
        return ServiceResult.succeed(integrated);
    }

    /**
     * 更新房屋的入住信息以及房屋状态
     *
     * @return
     */
    @RequestMapping(value = "/house/checkinStatus", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateHouseCheckinStatus(HouseBasic houseBasic) {
        boolean zt = service.updateHouseStatus(houseBasic);
        return ServiceResult.succeed(zt);
    }


    /**
     * 根据项目ID 楼栋ID 房屋名称关键字 模糊查询房屋信息(用于呼叫中心)
     *
     * @param projectId  项目ID
     * @param buildingId 楼栋ID
     * @param houseName  房屋名称关键字
     * @return
     */
    @RequestMapping(value = "project/{projectId}/{buildingId}/houses", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryProjectHouse(@PathVariable(value = "projectId") String projectId,
                                           @PathVariable(value = "buildingId") String buildingId,
                                           String houseName) throws Exception {
        if (StringUtils.isEmpty(projectId)) {
            throw new EmptyParameterException("projectId", "项目id");
        }
        if (StringUtils.isEmpty(buildingId)) {
            throw new EmptyParameterException("buildingId", "楼栋id");
        }
        List<HouseLite> list = service.getProjectHouse(projectId, buildingId, houseName);
        return ServiceResult.succeed(list);
    }

    /**
     * 获取管家(呼叫中心)
     *
     * @param houseId 房屋ID
     * @return
     */
    @RequestMapping(value = "grid/{houseId}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryGridManager(@PathVariable(value = "houseId") String houseId) throws Exception {
        if (StringUtils.isEmpty(houseId)) {
            throw new EmptyParameterException("houseId", "房屋ID");
        }
        Grid grid = service.getGridManager(houseId);
        return ServiceResult.succeed(grid);
    }

    /**
     * 根据项目ID获取该项目下的房屋（ID、名称、单元）
     *
     * @param projectId 项目ID
     * @return
     */
    @RequestMapping(value = "/house/queryByProjectId", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getHousesByProjectId(String projectId, String houseName) {
        User loginUser = getCurrentUser();
        String gridId=null;
        if(!loginUser.hasPermission("TREE_VIEW_PROJECT_ALL")) {
            // 如果当前用户是客服中心组长,则不按网格查询,查询该项目的所有房屋
                // 项目节点，获取所属网格id
                gridId = gService.getGridId(loginUser.getId(), projectId);

        }
        return ServiceResult.succeed(service.getHousesByProjectId(projectId, houseName,gridId));
    }


    /**
     * 根据楼栋ID获取该项目下的房屋（过滤网格）
     *
     * @param buildingId 楼栋ID
     * @return
     */
    @RequestMapping(value = "/house/report", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getHouse4Report(String buildingId) {
        User loginUser=getCurrentUser();
        String gridId = null;
        if(!loginUser.hasPermission("TREE_VIEW_PROJECT_ALL")) {
            // 项目节点，获取所属网格id
            gridId = gService.getGridId(loginUser.getId());
        }
        return ServiceResult.succeed(pService.queryHouse(buildingId, gridId));
    }


    /**
     * 根据楼栋ID获取该项目下的房屋
     *
     * @param buildingId 楼栋ID
     * @return
     */
    @RequestMapping(value = "/building/house", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getHouseByBuilding(String buildingId) {
        return ServiceResult.succeed(pService.queryHouse(buildingId, null));
    }


    /**
     * 获取一个管家的网格信息
     * @return
     */
    @RequestMapping(value = "/gridinfo", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getGrid4Report(String projectId) {
        return ServiceResult.succeed(gService.getGrid(getCurrentUser().getId(),projectId));
    }
    
    /**
     * 获取一个管家的网格信息
     * @return
     */
    @RequestMapping(value = "/gridinfo/projectId", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getGridByProjectId(String projectId) {
        return ServiceResult.succeed(gService.getGrid(null,projectId));
    }
}
