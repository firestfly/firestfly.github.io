package bingo.vkcrm.service.house.v1.services;

import bingo.vkcrm.service.house.v1.models.*;
import bingo.vkcrm.service.house.v1.models.OrganizationTreeNode;
import bingo.vkcrm.service.service.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 项目层级树（服务）
 */
@Service
public class OrganizationService extends BaseService {
    /**
     * 获取根节点
     *
     * @param userId 当前用户id
     * @return
     */
    public List<OrganizationTreeNode> queryRootNodes(String userId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userId", userId);

        List<OrganizationTreeNode> list = centerRoDao.queryForList(OrganizationTreeNode.class,
                "sql.tree.query.root", parameters);
        return list;
    }

    /**
     * 获取树节点
     *
     * @param userId     当前用户id
     * @param treeNodeId 树节点id
     * @param gridId     网格id
     * @return
     */
    public List<OrganizationTreeNode> queryNodes(String userId, String treeNodeId, String gridId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userId", userId);
        parameters.put("treeNodeId", treeNodeId);
        parameters.put("gridId", gridId);

        List<OrganizationTreeNode> list = centerRoDao.queryForList(OrganizationTreeNode.class,
                "sql.tree.query", parameters);
        return list;
    }

    public List<OrganizationOptions> queryOption(String userId,String levelType,String parentId,String gridId){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("userId",userId);
        params.put("levelType",levelType);
        if(StringUtils.isNotEmpty(parentId)){
            params.put("parentId",parentId);
        }
        if(StringUtils.isNotEmpty(gridId)){
            params.put("gridId",gridId);
        }

        return centerRoDao.queryForList(OrganizationOptions.class, "sql.items.query", params);
    }


    public List<OrganizationList> getProjectsByOrganizationId(String organizationId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("organizationId", organizationId);
        return centerRoDao.queryForList(OrganizationList.class, "sql.projects", parameters);
    }

    public List<OrganizationList> getGirds(String projectId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("projectId", projectId);
        return centerRoDao.queryForList(OrganizationList.class, "sql.girds", parameters);
    }

    public List<OrganizationList> getOrganizations() {
        return centerRoDao.queryForList(OrganizationList.class, "sql.organizations", null);
    }

    /**
     * 根据当前登录用户获取新项目
     *
     * @return
     */
    public List<Project> getProjectByUser(String userId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("userId", userId);
        return centerRoDao.queryForList(Project.class, "sql.projects.byuser", params);

    }

    /**
     * 根据当前登录用户获取新项目
     * @return
     */
    public List<OrganizationTreeNode> getProjectByUser(String userId,String projectName,String parentId){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("userId",userId);
        if(StringUtils.isNotEmpty(projectName)){
            params.put("projectName",projectName);
        }
        if(StringUtils.isNotEmpty(parentId)){
            params.put("parentId",parentId);
        }
        return centerDao.queryForList(OrganizationTreeNode.class, "sql.projects.byuser", params);
    }








    public  List<OrganizationTreeNode> queryMcAndCompany(String userId,String name){
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("userId",userId);
        if(StringUtils.isNotEmpty(name)){
            params.put("name",name);
        }
        return centerRoDao.queryForList(OrganizationTreeNode.class,"sql.query.mcAndCompany",params);
    }

    /**
     * 根据楼栋id获取所属项目
     *
     * @param buildingId 楼栋id
     * @return
     */
    public String getProjectIdByBuilding(String buildingId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("buildingId", buildingId);
        return centerRoDao.queryForStringQuietly("sql.query.project.by.building", parameters);

    }


    /**
     * 通过项目获取房屋（加了权限控制，支持管家，客服中心管理员等角色）
     * @param projectId
     * @param houseName
     * @param userId
     * @return
     */
    public List<OrganizationTreeNode> getHouseByUserId(String projectId,String houseName,String userId){
        Map<String,String> params=new HashMap<String, String>();
        params.put("projectId",projectId);
        params.put("userId",userId);
        if(StringUtils.isNotEmpty(houseName)){
            params.put("houseName",houseName);
        }
        return centerRoDao.queryForList(OrganizationTreeNode.class,"sql.query.houseByUserId",params);
    }
}

