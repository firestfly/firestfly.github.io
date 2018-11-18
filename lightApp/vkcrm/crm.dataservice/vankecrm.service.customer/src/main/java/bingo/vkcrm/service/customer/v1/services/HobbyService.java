package bingo.vkcrm.service.customer.v1.services;

import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.Hobby;
import bingo.vkcrm.service.enums.RelationTypes;
import bingo.vkcrm.service.enums.ResourceTypes;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Wangzr on 15/9/17.
 */
@Service
public class HobbyService extends CustomerCommonService {

    /**
     * 获取该客户的所有兴趣爱好
     *
     * @param customerId 客户id
     * @return
     */
    public List<Hobby> queryAll(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForList(Hobby.class, "sql.query.customer.hobbies", parameters);
    }

    /**
     * 获取该客户的所有兴趣爱好(临时表pending)
     *
     * @param customerId 客户id
     * @return
     */
    public List<Hobby> queryAllPending(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForList(Hobby.class, "service.query.customer.queryPendingCustomerHobby", parameters);
    }



    /**
     * 变更客户兴趣爱好
     *
     * @param customerId
     * @param contentIds
     * @param creator
     */
    public void changeHobbies(String customerId, String houseId, List<Integer> contentIds, User creator) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        //存放将要添加的兴趣爱好code
        List<Integer> addContentId = new ArrayList<Integer>();
        //存放将要移除的兴趣爱好code
        List<String> removeHobbyIds = new ArrayList<String>();
        //获取原来已选的兴趣爱好
        List<Hobby> oldhobbies = centerRoDao.queryForList(Hobby.class, "sql.query.customer.hobbies", parameters);
        //判断传来的兴趣爱好code是否已存在，不存则放入addContentId
        for (Integer contentId : contentIds) {
            boolean unexist = true;
            for (Hobby hobby : oldhobbies) {
                if (hobby.getContentId() == contentId) {
                    unexist = false;
                }
            }
            if (unexist) {

                addContentId.add(contentId);
            }
        }
        //判断原来的兴趣爱好是否应删除
        for (Hobby hobby : oldhobbies) {
            boolean unexist = true;
            for (Integer contentId : contentIds) {
                if (hobby.getContentId() == contentId) {
                    unexist = false;
                }
            }
            if (unexist) {
                removeHobbyIds.add(hobby.getId());
            }
        }
        addHobby(customerId, houseId, addContentId, creator);
        removeHobby(customerId, houseId, removeHobbyIds, creator);
    }

    /**
     * 添加客户兴趣爱好
     *
     * @param customerId
     * @param contentIds
     * @param creator
     */
    public void addHobby(String customerId, String houseId, List<Integer> contentIds, User creator) {
        for (Integer contentId : contentIds) {
            String uuid = UUIDUtil.create();
            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("id", uuid);
            parameters.put("customerId", customerId);
            parameters.put("contentId", contentId);
            parameters.put("creator", creator.getName());
            parameters.put("creatorId", creator.getId());
            if (centerDao.insert("sql.add.customer.hobbies", parameters) > 0) {
                logRelation2RedisMQ(customerId, houseId, uuid, "新增", ResourceTypes.Hobby.getValue(), RelationTypes.Owner.getCode());
            }
        }
    }

    /**
     * 添加客户兴趣爱好(用于车位)
     *
     * @param customerId
     * @param contentIds
     * @param creator
     */
    public void addHobby4Carport(String customerId, String carportId, List<Integer> contentIds, User creator) {
        for (Integer contentId : contentIds) {
            String uuid = UUIDUtil.create();
            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("id", uuid);
            parameters.put("customerId", customerId);
            parameters.put("contentId", contentId);
            parameters.put("creator", creator.getName());
            parameters.put("creatorId", creator.getId());
            if (centerDao.insert("sql.add.customer.hobbies", parameters) > 0) {
                logRelation2RedisMQ(customerId, carportId, uuid, "新增", ResourceTypes.Hobby.getValue(), RelationTypes.Owner.getCode());
            }
        }
    }



    /**
     * 删除客户兴趣爱好
     *
     * @param customerId
     * @param hobbyIds
     * @param creator
     */
    public void removeHobby(String customerId, String houseId, List<String> hobbyIds, User creator) {
        for (String hobbyId : hobbyIds) {
            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("id", hobbyId);
            parameters.put("customerId",customerId);
            parameters.put("deleter", creator.getName());
            parameters.put("deleterId", creator.getId());
            if (centerDao.insert("sql.remove.customer.hobbies", parameters) > 0) {
                logRelation2RedisMQ(customerId, houseId, hobbyId, "移除", ResourceTypes.Hobby.getValue(), RelationTypes.Owner.getCode());
            }
        }
    }
}
