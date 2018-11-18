package bingo.vkcrm.service.house.v1.services;

import bingo.vkcrm.service.house.v1.models.Grid;
import bingo.vkcrm.service.house.v1.models.OrganizationTreeNode;
import bingo.vkcrm.service.house.v1.models.Project;
import bingo.vkcrm.service.service.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 网格服务
 * Created by Wangzr on 15/9/3.
 */
@Service
public class GridService extends BaseService {

    /**
     * 获取当前用户所属的网格id，以判断当前用户是否网格管理员
     * @param userId 当前用户Id
     * @return
     */
    public String getGridId(String userId){
        Map<String, Object> parameters= new HashMap<String, Object>();
        parameters.put("managerId", userId);

        String gridId = centerRoDao.queryForStringQuietly("sql.query.grid.id", parameters);
        return gridId;
    }

    /**
     * 获取当前用户所属的网格id，以判断当前用户是否网格管理员
     * @param userId 当前用户Id
     * @return
     */
    public String getGridId(String userId, String projectId){
        Map<String, Object> parameters= new HashMap<String, Object>();
        parameters.put("managerId", userId);
        parameters.put("projectId", projectId);
        String gridId = centerRoDao.queryForStringQuietly("sql.query.grid.id.inProject", parameters);
        return gridId;
    }


    public List<Grid> getGrid(String userId,String projectId){
        Map<String,String> params=new HashMap<String, String>();
        if(StringUtils.isNotEmpty(userId)){
            params.put("userId",userId);
        }
        if(StringUtils.isNotEmpty(projectId)){
            params.put("projectId",projectId);
        }
        return  centerRoDao.queryForList(Grid.class,"sql.query.gridinfo",params);
    }



}
