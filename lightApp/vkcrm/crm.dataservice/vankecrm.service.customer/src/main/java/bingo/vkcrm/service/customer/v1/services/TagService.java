package bingo.vkcrm.service.customer.v1.services;
import bingo.security.principal.IUser;
import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.Tag;
import bingo.vkcrm.service.enums.RelationTypes;
import bingo.vkcrm.service.enums.ResourceTypes;
import bingo.vkcrm.service.service.BaseService;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TagService extends CustomerCommonService {

    /**
     * 查询所有标签
     * @param customerId 客户id
     * @return
     */
	public List<Tag> queryAll(String customerId){
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForList(Tag.class, "sql.query.tags", parameters);
    }

    /**
     * 添加客户标签
     * @param customerId 客户iD
     * @param contentIds 标签编号
     * @param creator 操作人
     */
    public void addTag(String customerId, String houseId, List<Integer> contentIds, User creator) {
        for (Integer contentId : contentIds) {
            String uuid = UUIDUtil.create();
            Tag tag=new Tag();
            tag.setId(uuid);
            tag.setCustomerId(customerId);
            tag.setContentId(contentId);
            tag.setCreatorId(creator.getId());
            tag.setCreator(creator.getName());
            if (centerDao.insert("sql.insert.tag", tag) > 0) {
                logRelation2RedisMQ(customerId, houseId, uuid, "新增", ResourceTypes.Tag.getValue(), RelationTypes.Owner.getCode());
            }
        }
    }

    /**
     * 标记删除
     * @param tagIds 标签id集合
     * @param deletor 删除人
     * @return
     */
    public boolean markedDelete(String[] tagIds, IUser deletor){
        return false;
    }


    /**
     * 变更客户标签
     * @param customerId 客户ID
     * @param contentIds 标签code
     * @param creator 操作人信息
     */
    public void updateTags(String customerId, String houseId, List<Integer> contentIds, User creator) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        //存放将要添加的标签code
        List<Integer> addContentId = new ArrayList<Integer>();
        //存放将要移除的标签code
        List<String> removeTagIds = new ArrayList<String>();
        //获取原来已选的标签
        List<Tag> oldTags = centerRoDao.queryForList(Tag.class, "sql.query.tags", parameters);
        //判断传来的标签code是否已存在，不存则放入addContentId
        for (Integer contentId : contentIds) {
            boolean unexist = true;
            for (Tag tag : oldTags) {
                if(tag.getContentId() == contentId){
                    unexist = false;
                }

            }
            if(unexist){
                addContentId.add(contentId);
            }
        }
        //判断原来的标签是否应删除
        for (Tag tag : oldTags) {
            boolean unexist = true;
            for (Integer contentId : contentIds) {
                if(tag.getContentId() == contentId){
                    unexist = false;
                }
            }
            if(unexist){
                removeTagIds.add(tag.getId());
            }
        }
        addTag(customerId, houseId, addContentId, creator);
        removeTag(customerId, houseId, removeTagIds, creator);
    }



    /**
     * 删除客户标签
     * @param customerId
     * @param tagIds
     * @param creator
     */
    public void removeTag(String customerId, String houseId, List<String> tagIds, User creator) {
        for (String tagId : tagIds) {
            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("id", tagId);
            parameters.put("deleter", creator.getName());
            parameters.put("deleterId", creator.getId());
            if (centerDao.update("sql.delete.tag", parameters) > 0) {
                logRelation2RedisMQ(customerId, houseId, tagId, "移除", ResourceTypes.Tag.getValue(), RelationTypes.Owner.getCode());
            }
        }
    }
}
