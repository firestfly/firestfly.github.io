package bingo.vkcrm.service.house.v1.controller;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.exceptions.ParameterErrorException;
import bingo.vkcrm.service.house.v1.Version;
import bingo.vkcrm.service.house.v1.models.*;
import bingo.vkcrm.service.house.v1.services.GridService;
import bingo.vkcrm.service.house.v1.services.OrganizationService;
import bingo.vkcrm.service.house.v1.services.CarportService;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * 项目层级结构树
 */
@RequestMapping(value = Version.API_PATH + "/organization")
@Controller
public class OrganizationController extends BaseController {

    private static String SERVICECENTER_GROUPLEADER_KEY = "rolecode.servicecenter.groupleader";
    /**
     * 客服中心组长
     */
    private static String GROUPLEADER = ApplicationContext.getProperty(SERVICECENTER_GROUPLEADER_KEY, "客服中心组长");

    /**
     * 项目树层级类型
     */
    public enum Level {
        /**
         * 根节点
         */
        ROOT("1"),
        /**
         * 运营中心
         */
        OC("2"),
        /**
         * 大客户
         */
        BC("7"),
        /**
         * 管理中心
         */
        MC("3"),
        /**
         * 城市公司
         */
        CITY("8"),
        /**
         * 项目
         */
        PRJ("4"),
        /**
         * 楼栋
         */
        BLD("5"),
        /**
         * 车场
         */
        CP("9"),
        /**
         * 单元
         */
        UNIT("6");

        private final String code;

        private Level(String code) {
            this.code = code;
        }

        public String getCode() {
            return code;
        }
    }

    /**
     * 车场名称
     */
    private final String CARPORT_NAME = "车场";
    /**
     * 组织架构服务
     */
    @Autowired
    OrganizationService service;
    /**
     * 网格服务
     */
    @Autowired
    GridService gService;
    /**
     * 车位分组服务
     */
    @Autowired
    CarportService cService;

    /**
     * 获取项目结构树
     *
     * @param treeNodeId 当前树节点
     * @param levelType  当前树节点类型
     * @return
     */
    @RequestMapping(value = "/tree", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult query(String treeNodeId, String levelType) {
        User loginUser = getCurrentUser();

        if (StringUtils.isEmpty(levelType)) {
            levelType = "0";
        }

        List<OrganizationTreeNode> nodes;
        try {
            if (StringUtils.isEmpty(treeNodeId)) {
                // 初始化根节点
                nodes = service.queryRootNodes(loginUser.getId());
            } else {
                // 加载下一级节点
                String gridId = "";
                if(!loginUser.hasPermission("TREE_VIEW_PROJECT_ALL")) {
                    // 如果当前用户是客服中心组长,则不按网格查询,查询该项目的所有房屋
                    if (levelType.equals(Level.PRJ.getCode())) {
                        // 项目节点，获取所属网格id
                        gridId = gService.getGridId(loginUser.getId(), treeNodeId);
                    } else if (levelType.equals(Level.BLD.getCode())) {
                        // 楼栋节点，获取所属网格id
                        String projectId = service.getProjectIdByBuilding(treeNodeId);
                        gridId = gService.getGridId(loginUser.getId(), projectId);
                    }
                }
                nodes = service.queryNodes(loginUser.getId(), treeNodeId, gridId);
                if (StringUtils.isEmpty(gridId) && levelType.equals(Level.PRJ.getCode())) {
                    // 当前树节点为项目并且不是管家，则增加车场节点
                	List<Carpark> carparks = cService.queryCarparks(loginUser, treeNodeId);
                	if (carparks != null) {
                		for (Carpark carpark : carparks) {
                            OrganizationTreeNode carportNode = new OrganizationTreeNode();
                            carportNode.setId(carpark.getId());
                            carportNode.setName(carpark.getName());


                            carportNode.setLevelType(Integer.parseInt(Level.CP.getCode()));
                            carportNode.setHasChild(false);
                            nodes.add(carportNode);                			
                		}
                	}

                }
            }
            if (levelType.equals(Level.MC.getCode()) || levelType.equals(Level.CITY.getCode())) {
                for (int i = 0; i < nodes.size(); i++) {
                    OrganizationTreeNode node = nodes.get(i);
                    node.setHasChild(true);
                }
            }
            return ServiceResult.succeed(nodes);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ServiceResult.error(ex);
        }
    }

    /**
     * 反向获取项目结构树
     *
     * @param treeNodeId 当前树节点
     * @return
     */
    @RequestMapping(value = "/reverseTree", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult reverseTree(String[] treeNodeId) {

        try {
            User loginUser = getCurrentUser();
            String gridId = "";
            String parentOrgId = "";
            String levelType = "";
            List<OrganizationTreeNode> items = null;
            List<List<OrganizationTreeNode>> nodes = new ArrayList<List<OrganizationTreeNode>>();
            boolean canViewAllBuilding = loginUser.hasPermission("TREE_VIEW_PROJECT_ALL");
            //
            for (int i = 0, length = treeNodeId.length; i < length; i++) {

                if(!canViewAllBuilding) {
                    if (levelType.equals(Level.PRJ.getCode())) {
                        // 项目节点，获取所属网格id
                        gridId = gService.getGridId(loginUser.getId(), parentOrgId);
                    } else if (levelType.equals(Level.BLD.getCode())) {
                        // 楼栋节点，获取所属网格id
                        String projectId = service.getProjectIdByBuilding(parentOrgId);
                        gridId = gService.getGridId(loginUser.getId(), projectId);
                    }
                }

                // 加载根节点
                if (StringUtils.isEmpty(parentOrgId)) {
                    items = service.queryRootNodes(loginUser.getId());
                } else {
                    items = service.queryNodes(loginUser.getId(), parentOrgId, gridId);

                    // 层级为项目并且为非管家,增加车场
                    if (levelType.equals(Level.PRJ.getCode()) && StringUtils.isEmpty(gridId)) {
                        // 当前树节点为项目并且不是管家，则增加车场节点
                    	List<Carpark> carparks = cService.queryCarparks(loginUser, parentOrgId);
                    	if (carparks != null) {
                    		for (Carpark carpark : carparks) {
                                OrganizationTreeNode carportNode = new OrganizationTreeNode();
                                carportNode.setId(carpark.getId());
                                carportNode.setName(carpark.getName());


                                carportNode.setLevelType(Integer.parseInt(Level.CP.getCode()));
                                carportNode.setHasChild(false);
                                items.add(carportNode);                			
                    		}
                    	}

                    }
                }

                if (levelType.equals(Level.MC.getCode()) || levelType.equals(Level.CITY.getCode())) {
                    // 设置所有项目为允许展开
                    for (OrganizationTreeNode item : items) {
                        item.setHasChild(true);
                    }
                }

                // 展开当前层级
                for (OrganizationTreeNode item : items) {
                    if (item.getId().equalsIgnoreCase(treeNodeId[i])) {
                        item.setIsOpen(true);
                        parentOrgId = item.getId();
                        levelType = item.getLevelType() + "";
                        break;
                    }
                }
                nodes.add(items);
            }

            return ServiceResult.succeed(nodes);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ServiceResult.error(ex);
        }
    }

    /**
     * 获取下拉框初始化的值
     *
     * @return
     */
    @RequestMapping(value = "/items", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryOptions(String parentId, String levelType) {
        String userId = getCurrentUser().getId();
        String gridId = gService.getGridId(userId);
        if (levelType == null || StringUtils.isEmpty(levelType)) {
            //默认加载管理中心信息，否则加载需要显示的层级信息
            levelType = Level.MC.getCode();
            return ServiceResult.succeed(service.queryOption(userId, levelType, null,gridId));
        } else {
            return ServiceResult.succeed(service.queryOption(userId, levelType, parentId,gridId));
        }
    }


    /**
     * 通过管理中心id（数组）获取项目
     *
     * @param organizationId
     * @return
     */
    @RequestMapping(value = "/project/get", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getProjects(String organizationId) {
        List<OrganizationList> list;
        try {
            list = service.getProjectsByOrganizationId(organizationId);
            return ServiceResult.succeed(list);
        } catch (Exception e) {
            e.printStackTrace();
            return ServiceResult.error(e);
        }
    }

    /**
     * 获取全部管理中心
     *
     * @return
     */
    @RequestMapping(value = "/organization/get", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getOrganizations() throws Exception {
        return ServiceResult.succeed(service.getOrganizations());
    }

    /**
     * 通过项目id（数组）获取网格
     *
     * @param projectId
     * @return
     */
    @RequestMapping(value = "/gird/get", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getGirds(String projectId) {
        List<OrganizationList> list = new ArrayList<OrganizationList>();
        try {
            list = service.getGirds(projectId);
            return ServiceResult.succeed(list);
        } catch (Exception e) {
            e.printStackTrace();
            return ServiceResult.error(e);
        }
    }

    /**
     * 获取当前登录人的项目信息
     *
     * @return
     */
    @RequestMapping(value = "/project", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryProject(String parentId,String projectName) {
        try {
            String userId=getCurrentUser().getId();
            List<OrganizationTreeNode> projectsList = service.getProjectByUser(userId,projectName,parentId);
            return ServiceResult.succeed(projectsList);
        } catch (Exception e) {
            e.printStackTrace();
            return ServiceResult.error(e);
        }
    }

    /**
     * 通过项目获取房屋（加了权限控制，支持管家角色，客服中心管理员等角色）
     *
     * @param projectId
     * @param houseName
     * @return
     */
    @RequestMapping(value = "/house", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryHouse(String projectId,String houseName) throws Exception{
        if(StringUtils.isEmpty(projectId)){
            throw  new ParameterErrorException("projectId","项目ID","项目ID不能为空");
        }
        return ServiceResult.succeed(service.getHouseByUserId(projectId,houseName,getCurrentUser().getId()));
    }


    /**
     * 获取一个用户拥有的管理中心和服务公司权限(对应非住宅类)
     * @param name 管理中心或者服务公司名称（支持模糊查询）
     * @return 权限信息
     */
    @RequestMapping(value = "/McAndCompany", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryMcAndCompany(String name) throws Exception {
        String userId=getCurrentUser().getId();
        return ServiceResult.succeed(service.queryMcAndCompany(userId,name));
    }
}