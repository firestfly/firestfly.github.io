package bingo.vkcrm.service.customer.v1.services;

import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.common.UserContext;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.SpecialIdentity;


import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 特殊身份服务
 * Created by Wangzr on 15/9/17.
 */
@Service
public class SpecialIdentityService extends CustomerCommonService{

    /**
     * 获取所有特殊身份
     *
     * @param customerId 客户id
     * @return
     */
    public List<SpecialIdentity> queryAll(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForList(SpecialIdentity.class, "sql.query.customer.specialIdentity", parameters);
    }


    /**
     * 获取所有特殊身份(临时表pending)
     *
     * @param customerId 客户id
     * @return
     */
    public List<SpecialIdentity> queryAllPending(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForList(SpecialIdentity.class, "service.query.customer.queryPendingCustomerSpecialIdentity", parameters);
    }

    /**
     * 添加客户特殊身份
     *
     * @param customerId
     * @param specialIdentities
     * @param creator
     */
    public Boolean addSpecialIdentity(String customerId, List<Integer> specialIdentities,Date beginDate,Integer duration, User creator) {
        SpecialIdentity specialIdentity;
        for (int i = 0; i < specialIdentities.size(); i++) {
            String id = UUIDUtil.create();
            Integer identity = specialIdentities.get(i);
            specialIdentity=new SpecialIdentity();
            if (specialIdentities.get(i)== 8) {//如果是法律纠纷客户，计算结束时间，并添加
                Calendar newDate = Calendar.getInstance();
                newDate.setTime(beginDate);
                newDate.add(Calendar.MONTH,duration);
                specialIdentity.setEndDate(newDate.getTime());
                specialIdentity.setBeginDate(beginDate);
                specialIdentity.setDuration(duration);
            } else {
                //由于前台会把不是“法律纠纷”特殊身份的“开始时间”和“持续时间”传来，所以这里要手动设置为空和0。
                specialIdentity.setBeginDate(null);
                specialIdentity.setDuration(0);
            }
            specialIdentity.setIdentity(specialIdentities.get(i));
            specialIdentity.setId(id);
            specialIdentity.setCustomerId(customerId);
            specialIdentity.setCreator(creator.getName());
            specialIdentity.setCreatorId(creator.getId());
            centerDao.insert("sql.insert.customer.specialidentity", specialIdentity);
        }


        return true;
    }


    public Boolean updateSpecialIdentities(String customerId,Integer[] specialIdentities,Date beginDate,Integer duration,User user){

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        //存放将要添加的特殊身份code
        List<Integer> addIdentities = new ArrayList<Integer>();
        //存放将要移除的特殊身份code
        List<String> removeIdentities = new ArrayList<String>();
        //获取原来已选的特殊身份
        List<SpecialIdentity> oldSpecialIdentites = centerRoDao.queryForList(SpecialIdentity.class, "sql.query.customer.specialIdentity", parameters);
        //判断传来的特殊身份code是否已存在，不存则放入addContentId
        for (Integer specialIdentity : specialIdentities) {
            boolean unexist = true;
            for (SpecialIdentity oldSpecialIdentity : oldSpecialIdentites) {
                if (oldSpecialIdentity.getIdentity() == specialIdentity) {
                    if(specialIdentity==8){//法律纠纷客户
                        if(oldSpecialIdentity.getBeginDate()==beginDate&&oldSpecialIdentity.getDuration()==duration){
                            unexist = false;
                        }
                    }else {
                        unexist=false;
                    }

                }
            }
            if (unexist) {
                addIdentities.add(specialIdentity);
            }
        }
        //判断原来的特殊身份是否应删除
        for (SpecialIdentity specialIdentity : oldSpecialIdentites) {
            boolean unexist = true;
            for (Integer identity: specialIdentities) {
                if (specialIdentity.getIdentity() == identity) {
                    unexist = false;
                    if(identity==8){
                        unexist=true;
                    }
                }
            }
            if (unexist) {
                removeIdentities.add(specialIdentity.getId());
            }
        }
        addSpecialIdentity(customerId, addIdentities,beginDate,duration,user);
        removeHobby(customerId, removeIdentities, user);
        return true;
    }


    /**
     * 删除客户兴趣爱好
     *
     * @param customerId 客户ID
     * @param Identities 特殊身份ID
     */
    public Boolean removeHobby(String customerId, List<String> Identities, User creator) {
        for (String IdentityId : Identities) {
            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("id", IdentityId);
            parameters.put("deleter", creator.getName());
            parameters.put("deleterId", creator.getId());
            centerDao.update("sql.remove.customer.Identities", parameters);
        }
        return true;
    }
}
