package bingo.vkcrm.service.house.v1.controller;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.EmptyParameterException;
import bingo.vkcrm.service.house.v1.Version;
import bingo.vkcrm.service.house.v1.models.Project;
import bingo.vkcrm.service.house.v1.services.GridService;
import bingo.vkcrm.service.house.v1.services.ProjectService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * 项目
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class ProjectController extends BaseController {
	
    private static final Log log = LogFactory.getLog(ProjectController.class);

    @Autowired
    ProjectService service;
    @Autowired
    GridService gService;
    /**
     * 根据项目名称，模糊查询项目信息 取前二十条记录用于呼叫中心的项目搜索
     * @param projectName 项目名称关键字
     * @return
     */
    @RequestMapping(value = "/projects", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryProject(String projectName){
        List<Project> list = service.getProject(projectName);
        return ServiceResult.succeed(list);
    }

    /**
     * 根据项目名称，模糊查询“当前用户权限下”项目信息 用于指挥中心的项目搜索
     * 
     * @param projectName 项目名称关键字
     * @return
     */
    @RequestMapping(value = "/roleprojects", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryRoleProject(String projectName,String cityCode,String parentId){
        List<Project> list = service.getRoleProject(projectName,cityCode,parentId,getCurrentUser());
        return ServiceResult.succeed(list);
    }
    


    /**
     * 根据项目ID获取该项目下所有的楼栋(用于呼叫中心)
     * @param projectId 项目ID
     * @return
     */
    @RequestMapping(value = "/project/{projectId}/buildings", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryBuilding(@PathVariable(value = "projectId") String projectId) throws Exception {
        if (StringUtils.isEmpty(projectId)) {
            throw new EmptyParameterException("projectId", "项目ID");
        }
        List list = service.queryBuildings(projectId);
        return ServiceResult.succeed(list);
    }

    /**
     * 根据项目ID获取该项目下所有的楼栋(用于任务报表查询条件)
     * @param projectId 项目ID
     * @return
     */
    @RequestMapping(value = "/project/{projectId}/buildings/report", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryBuilding4Report(@PathVariable(value = "projectId") String projectId) throws Exception {
        if (StringUtils.isEmpty(projectId)) {
            throw new EmptyParameterException("projectId", "项目ID");
        }
        User loginUser=getCurrentUser();
        String gridId = null;
        if(!loginUser.hasPermission("TREE_VIEW_PROJECT_ALL")) {
            // 项目节点，获取所属网格id
            gridId = gService.getGridId(loginUser.getId(), projectId);
        }

        List list = service.queryBuildings(projectId,gridId);
        return ServiceResult.succeed(list);
    }

}
