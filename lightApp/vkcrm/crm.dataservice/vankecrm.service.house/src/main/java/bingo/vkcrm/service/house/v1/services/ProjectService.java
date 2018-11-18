package bingo.vkcrm.service.house.v1.services;

import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.house.v1.models.Building;
import bingo.vkcrm.service.house.v1.models.House;
import bingo.vkcrm.service.house.v1.models.House4Report;
import bingo.vkcrm.service.house.v1.models.Project;
import bingo.vkcrm.service.service.BaseService;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 项目
 */
@Service
public class ProjectService extends BaseService {

    /**
     * 根据项目名称，模糊查询项目信息 取前十条记录用于呼叫中心的项目搜索
     * @param projectName 项目名称关键字
     * @return
     */
    public List<Project> getProject(String projectName){
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("projectName", projectName);
        List<Project> list= centerRoDao.queryForList(Project.class, "sql.query.project.by.projectName", parameters);
        return list;
    }
    
    /**
     * 根据项目名称，模糊查询“当前用户权限下”项目信息 用于指挥中心的项目搜索
     * 
     * @param projectName 项目名称关键字
     * @return
     */
    public List<Project> getRoleProject(String projectName,String cityCode,String parentId,User user){
        Map<String, Object> parameters = new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(projectName)){
            parameters.put("projectName", projectName);
        }
        if(StringUtils.isNotEmpty(cityCode)){
            parameters.put("cityCode", cityCode);
        }
        if(StringUtils.isNotEmpty(parentId)){
            parameters.put("parentId", parentId);
        }
        parameters.put("userId", user.getId());
        List<Project> list= centerRoDao.queryForList(Project.class, "sql.query.roleproject.by.projectName", parameters);
        return list;
    }



    /**
     * 根据项目ID获取该项目下所有的楼栋
     * @param projectId 项目ID
     * @return
     */
    public List<Building> queryBuildings(String projectId){
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("projectId", projectId);
        List<Building> list = centerRoDao.queryForList(Building.class, "sql.query.building.by.projectId", parameters);
        return list;
    }


    /**
     * 根据项目ID获取该项目下的楼栋（用于报表，加了网格过滤）
     * @param projectId 项目ID
     * @return
     */
    public List<Building> queryBuildings(String projectId,String gridId){
        Map<String, Object> parameters = new HashMap<String, Object>();
        List<Building> list=null;
        parameters.put("projectId", projectId);
        if(StringUtils.isNotEmpty(gridId)){
            parameters.put("gridId", gridId);
        }
        list = centerRoDao.queryForList(Building.class, "sql.query.building.report", parameters);
        return list;
    }

    /**
     * 根据项目ID获取该项目下的楼栋（用于报表，加了网格过滤）
     * @param buildingCode 楼栋code
     * @return
     */
    public List<House4Report> queryHouse(String buildingCode, String gridId){
        Map<String, Object> parameters = new HashMap<String, Object>();
        List<House4Report> list=null;
        parameters.put("buildingCode", buildingCode);
        if(StringUtils.isNotEmpty(gridId)){
            parameters.put("gridId", gridId);
        }
        list = centerRoDao.queryForList(House4Report.class, "sql.query.house.report", parameters);
        return list;
    }
}
