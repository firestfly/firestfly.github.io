package bingo.vkcrm.service.house.v1.services;

import bingo.dao.Page;
import bingo.security.principal.IUser;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.house.v1.models.*;
import bingo.vkcrm.service.service.BaseService;
import org.springframework.stereotype.Service;
import org.apache.commons.lang3.StringUtils;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.*;

/**
 * 车位分组service
 */
@Service
public class CarportService extends BaseService {

    /**
     * 查询项目下的车位分组信息
     *
     * @param projectId 所属项目id
     * @return List<CarportGroup>
     */
    public List<CarportGroup> queryGroups(User user, String projectId, String carparkId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("projectId", projectId);
        parameters.put("carparkId", carparkId);
        parameters.put("userId", user.getId());
        List<CarportGroup> list = centerRoDao.queryForList(CarportGroup.class, "sql.carportGroup.queryAll", parameters);
        
        int existUngroupCount = 0;
        existUngroupCount = centerRoDao.queryForInt("sql.carportGroup.existUngroup", parameters);
        if (existUngroupCount > 0) {
        	CarportGroup carportUnGroup = new CarportGroup();
        	carportUnGroup.setId("");
        	carportUnGroup.setProjectId(projectId);
        	carportUnGroup.setCarparkId(carparkId);
        	carportUnGroup.setName("UNGROUP");
        	carportUnGroup.setCount(existUngroupCount);
        	list.add(0, carportUnGroup);
        }
        
        return list;
    }
    
    /**
     * 查询项目下指定车场的哪个组中能找到指定的车位
     *
     * @param projectId 所属项目id
     * @param carparkId 所属项目下指定车场的id
     * @return String
     */
    public String queryGroupId(String carportName, User user, String projectId, String carparkId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("projectId", projectId);
        params.put("carparkId", carparkId);
        params.put("userId", user.getId());
        params.put("carportName", carportName);
        String groupId = centerRoDao.queryForStringQuietly("sql.carportGroup.query", params);
        return (groupId == null ? "" : groupId);
    }

    /**
     * 根据车位分组的id查询组下车位信息
     *
     * @param pager   分页参数
     * @param groupId 车位分组id
     * @return List<Carport>
     */
    public List<CarportOverview> queryCarports(Page pager, String carportName, User user, String projectId, String carparkId, String groupId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("projectId", projectId);
        params.put("carparkId", carparkId);
        params.put("userId", user.getId());
        params.put("groupId", groupId);
        params.put("carportName", carportName);
        List<CarportOverview> list = centerRoDao.queryForListPage(CarportOverview.class,
                pager, "sql.carport.group.queryAll", null, params, true);
        return list;
    }

    /**
     * 查询该项目下的所有未分组车位
     *
     * @param pager     分页参数
     * @param projectId 项目名
     * @return
     */
    public List<CarportOverview> queryUnGroupCarports(Page pager, String carportName, User user, String projectId, String carparkId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("projectId", projectId);
        params.put("carparkId", carparkId);
        params.put("userId", user.getId());
        params.put("carportName", carportName);
        List<CarportOverview> list = centerRoDao.queryForListPage(CarportOverview.class,
                pager, "sql.carport.ungroup.queryAll", null, params, true);
        return list;
    }

    /**
     * 添加分组
     *
     * @param projectId
     * @param groupName
     * @return 操作是否成功
     */
    public boolean addGroup(String projectId, String groupName, IUser user) throws ParseException {

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("id", UUID.randomUUID().toString().replaceAll("-", ""));
        parameters.put("name", groupName);
        parameters.put("projectId", projectId);
        parameters.put("creator", user.getName());
        parameters.put("creatorId", user.getId());
        int effectRow = centerRoDao.insert("sql.carport.addgroup", parameters);
        return effectRow > 0;
    }


    /**
     * 将车位加入到原有的车位分组中
     *
     * @param groupId    分组id
     * @param carportIds 车位id集合
     * @return 操作是否成功
     */
    public boolean addCarports(String groupId, String[] carportIds) throws SQLException {
        Map<String, String> parameters = new HashMap<String, String>();
        parameters.put("groupId", groupId);
        parameters.put("carportId", "");
        for (int i = 0; i < carportIds.length; i++) {
            parameters.put("carportId", carportIds[i]);
            centerDao.insert("sql.carportGroup.addCarports", parameters);
        }
        return true;
    }


    public List<CustomerInfo> queryParkCustomer(String parkId, int isdeleted) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("id", parkId);
        params.put("isdeleted", isdeleted);
        return centerRoDao.queryForList(CustomerInfo.class, "sql.query.carportCustomerInfo.relation", params);

    }

    /**
     * 通过车位ID获取车位详细信息
     *
     * @param carportId 车位ID
     * @return 操作是否成功
     */
    public Carport queryCarportInfo(String carportId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("id", carportId);
        Carport carport = centerRoDao.queryForObject(Carport.class, "sql.query.carportInfoById", params);
        return carport;
    }



    public boolean updateCarportInfo(String carportId,String status,String contactsId,Date startTime,User user){
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("id", carportId);
        params.put("status", status);
        params.put("contactsId", contactsId);
        params.put("startTime", startTime);
        params.put("modifierId", user.getId());
        params.put("modifier", user.getName());
        return centerDao.update("sql.update.carportInfoById",params)>0;

    }
    
    /**
     * 查询项目下的车场信息
     *
     * @param projectId 所属项目id
     * @return List<CarportGroup>
     */
    public List<Carpark> queryCarparks(User user, String projectId) {
    	if(! this.hasPermission(user.getId(), "CARPARK_TREE")) 
    		return new ArrayList<Carpark>();

    	Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("projectId", projectId);
        parameters.put("userId", user.getId());
        List<Carpark> list = centerRoDao.queryForList(Carpark.class, "sql.carpark.queryAll", parameters);
        return list;
    }


//    /**
//     * 变更客车关系
//     *
//     * @param carportId
//     * @param customerIds
//     */
//    public Boolean carportTransfer(String carportId, String[] customerIds, User creator) {
//        Map<String, Object> parameters = new HashMap<String, Object>();
//        parameters.put("carportId", carportId);
//        //存放将要添加的客户ID
//        List<String> addCustomerIds = new ArrayList<String>();
//        //存放将要移除的客户ID
//        List<String> removeCustomerIds = new ArrayList<String>();
//        //获取原来车位下的主人
//        List<CarportCustomerRelation> oldCustomerRelations = rnDao.queryForList(CarportCustomerRelation.class, "sql.query.carportCustomer.relation", parameters);
//        //判断传来的customerIds是否已存在，不存则放入addCustomerId
//        for (String customerId : customerIds) {
//            boolean unexist = true;
//            for (CarportCustomerRelation relation : oldCustomerRelations) {
//                if (relation.getCustomerId().equals(customerId)) {
//                    unexist = false;
//                }
//            }
//            if (unexist) {
//                addCustomerIds.add(customerId);
//            }
//        }
//        //判断原来客户是否应删除
//        for (CarportCustomerRelation relation : oldCustomerRelations) {
//            boolean unexist = true;
//            for (String customerId : customerIds) {
//                if (relation.getCustomerId().equals(customerId)) {
//                    unexist = false;
//                }
//            }
//            if (unexist) {
//                removeCustomerIds.add(relation.getId());
//            }
//        }
//        addCarportRelation(carportId,addCustomerIds, creator);
//        removeCarportRelation(removeCustomerIds, creator);
//        return true;
//    }
//
//    public void addCarportRelation(String carportId,List<String> customerIds,User creator){
//        CarportCustomerRelation relation=new CarportCustomerRelation();
//        for (String customerId : customerIds) {
//            relation.setCarportId(carportId);
//            relation.setCustomerId(customerId);
//            relation.setCreator(creator.getName());
//            relation.setCreatorId(creator.getId());
//            relation.setCreateTime(new Date());
//            relation.setIsDeleted(false);
//            dao.insert(relation);
//        }
//    }
//
//    /**
//     * 删除客户兴趣爱好
//     *
//     * @param relationIds
//     * @param deletor 操作人
//     */
//    public void removeCarportRelation(List<String> relationIds,User deletor){
//        for (String relationId : relationIds) {
//            Map<String, Object> parameters = new HashMap<String, Object>();
//            parameters.put("id", relationId);
//            parameters.put("deletor", deletor.getName());
//            parameters.put("deletorId", deletor.getId());
//            dao.update("sql.remove.carportCustomer.relation", parameters);
//        }
//    }
    
    /**
   	 * @Description: 分页获取车位信息
   	 * @param: curPage当前页
   	 * @param pageSize当前页行数
   	 * @param YZParam 请求对象
   	 * @throws:
   	 * @Author: luoml01
   	 * @date: 2016年3月15日 下午6:37:47
   	 * @return:List<CarportInfo>车位信息集合
     * @exception:TODO
   	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
   	 */
     public List<CarportInfo> getCarportPage(Page pager,YZParam yzParam) {
           //有查询条件，做自动分页
           Map<String, Object> parameters = new HashMap<String, Object>();
           if (StringUtils.isNotEmpty(yzParam.getProjectCode())) {
          	 	parameters.put("projectCode", yzParam.getProjectCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getCarportCode())) {
          	 	parameters.put("carparkCode", yzParam.getCarportCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getCarportCode())) {
          	 	parameters.put("carportCode", yzParam.getCarportCode());
   		}
           if (null != yzParam.getCarportCodes() &&yzParam.getCarportCodes().length>0) {
        	   parameters.put("carportCodes", "'" + StringUtils.join(yzParam.getCarportCodes(), "','") + "'");
 		}
           if (StringUtils.isNotEmpty(yzParam.getModifyTime())) {
          	 	parameters.put("modifyTime", yzParam.getModifyTime());
          	 	parameters.put("timestamp", yzParam.getTimestamp());
   		}
           List<CarportInfo> list = centerRoDao.queryForListPage(CarportInfo.class,pager,"sql.query.carport",null, parameters,true);
           return list;
       }
}
