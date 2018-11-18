package bingo.vkcrm.service.customer.v1.services;

import bingo.dao.Page;
import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.*;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.StopWatch;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomerCallcenterService extends CustomerCommonService {
    /**
     * 根据来电号码查询客户列表（临时表+主表）
     * 临时表只查询待审核状态，并且不是进行删除操作的数据
     *
     * @param callnumber
     * @param page
     * @return
     */
    @Deprecated
    public List<CallerCustomer> getCustomerList(String callnumber, Page page) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        // 来电号码均与客户资料中的主用手机、备用手机、家庭固定电话以及办公室电话号码进行匹配
        parameters.put("mainMobile", callnumber);
        parameters.put("standbyMobile", callnumber);
        parameters.put("homeTel", callnumber);
        parameters.put("officeTel", callnumber);
        List<CallerCustomer> list = centerRoDao.queryForListPage(CallerCustomer.class, page, "sql.query.customer.list", null, parameters, true);
        return list;
    }


    /**
     * 从缓存中读取来电的客户信息和未审核的临时客户信息
     *
     * @param callnumber
     * @return
     */
    public List<CallerCustomer> queryCustomersFromCache(String callnumber) {
        List<CallerCustomer> customers = new ArrayList<CallerCustomer>();
        // 根据[Tel_电话号码]去Redis中匹配对应的客户ID集合
        // 根据客户ID集合在Redis中匹配对应的客户信息
        // 读取CRM客户数据
        StopWatch watch = new StopWatch();
        watch.start();
        String[] customerIds = CacheUtil.smembers(CachePrefix.Tel, callnumber);
        for (String id : customerIds) {
            CallerCustomer customer = CacheUtil.get(CallerCustomer.class, CachePrefix.Cust, id);
            if(customer!=null) {
                customer.setHasApprove("1");
                customers.add(customer);
            }
        }
        // 读取未审核客户数据
        customerIds = CacheUtil.smembers(CachePrefix.TMP_TEL, callnumber);
        for (String id : customerIds) {
            CallerCustomer customer = CacheUtil.get(CallerCustomer.class, CachePrefix.TMP_CUST, id);
            if(customer!=null) {
                customer.setHasApprove("0");
                customers.add(customer);
            }
        }
        watch.stop();
        log.debug("根据来电获取用户列表耗时:" + watch.toString());
        return customers;
    }

    /**
     * 查询客户特殊身份
     * 只查询审核过的，不包括临时表数据
     *
     * @param id
     * @return
     */
    public List<SpecialIdentityPending> getCustomerSpecialId(String id) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", id);
        return centerRoDao.queryForList(SpecialIdentityPending.class, SpecialIdentityPending.class, "sql.query.customer.specialid.callcenter", parameters);
    }

    /**
     * 查询客户兴趣爱好
     * 只查询验证通过的兴趣爱好，不查询临时表
     *
     * @param code
     * @return
     */
    public List<HobbyPending> getCustomerHobbies(String code) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", code);
        return centerRoDao.queryForList(HobbyPending.class, HobbyPending.class, "sql.query.customer.hobbies.callcenter", parameters);
    }

    /**
     * 更新客户信息、新增客户
     * (临时表数据，用于客户审批)
     *
     * @param customerBasic 客户基本信息
     * @param creator
     */
    public String updateCustomer(CustomerBasicPending customerBasic, User creator, String houseId, List<String> relationTypes) throws Exception{
        Map<String, Object> parameters = new HashMap<String, Object>();
        Map<String, Object> customerparams = new HashMap<String, Object>();
        String projectCode = customerBasic.getProjectCode();
        //String projectId=CacheUtil.get(Map.class,CachePrefix.PrjCode,projectCode).get("id")+"";
        String projectId=customerBasic.getProjectId();
        parameters.put("customerId", customerBasic.getId());
        Boolean hasExistCustomer = false;
        //查看该客户是否存在（主表）
        CallerCustomer customer = centerRoDao.queryForObject(CallerCustomer.class, "sql.query.customer.list.id", parameters);//代表带V客户
        //不存在则作为新增客户操作
        if (customer == null || !(customer.getCustomerId().equals(customerBasic.getId()))) {
            //生成id
            customerBasic.setId(UUIDUtil.create());
            customerparams.put("id", customerBasic.getId());
            customerparams.put("fullName", customerBasic.getFullName());
            customerparams.put("sex", customerBasic.getSex());
            customerparams.put("mainMobile", customerBasic.getMainMobile());
            customerparams.put("creator", creator.getName());
            customerparams.put("creatorId", creator.getId());
            customerparams.put("approveStatus", 1);
            customerparams.put("from", 1);
            customerparams.put("operator", 1);
            centerDao.insert("sql.customerpending.add", customerparams);
            CallerCustomer callerCustomer=new CallerCustomer();
            callerCustomer.setCustomerId(customerBasic.getId());
            callerCustomer.setName(customerBasic.getFullName());
            callerCustomer.setSex(customerBasic.getSex());
            callerCustomer.setPhone(customerBasic.getMainMobile());
            JedisUtil.cacheDb().sadd(CachePrefix.TMP_TEL.getVal()+"_"+customerBasic.getMainMobile(),customerBasic.getId());
            CacheUtil.set(CachePrefix.TMP_CUST,customerBasic.getId(),JsonUtil.toJson(callerCustomer));

        }
        //若客服中心存在该数据，则作为修改处理
        else if (customer.getCustomerId().equals(customerBasic.getId())) {
            if (customer.getSex() == customerBasic.getSex() &&
                    customer.getName().equals(customerBasic.getFullName()) &&
                    customer.getIdentity().equals(customerBasic.getIdentity()) &&
                    customer.getPhone().equals(customerBasic.getMainMobile()) &&
                    customer.getContentId().equals(customerBasic.getContentIds())) {
                hasExistCustomer = true;
                //如果客户点了带V的客户，如果没有任何改变创建客户，这时不往临时表中创建客户
                //判断改变的条件是：姓名，性别，客户标签（兴趣爱好），特殊身份，电话号码，如果只有任何一个发生改变，就要插入数据，需要管家审批
            }
            if (!hasExistCustomer) {
                //如果不存在该客户，则插入一个“修改”类型的客户
                //生成id
                String id =UUIDUtil.create();
                customerBasic.setId(id);
                customerparams.put("id", customerBasic.getId());
                customerparams.put("crmCustomerId", customer.getCustomerId());
                customerparams.put("fullName", customerBasic.getFullName());
                customerparams.put("sex", customerBasic.getSex());
                customerparams.put("mainMobile", customerBasic.getMainMobile());
                customerparams.put("creator", creator.getName());
                customerparams.put("creatorId", creator.getId());
                customerparams.put("approveStatus", 1);
                customerparams.put("from", 1);
                customerparams.put("operator", 2);
                centerDao.insert("sql.customerpending.add", customerparams);
                CallerCustomer callerCustomer=new CallerCustomer();
                callerCustomer.setCustomerId(id);
                callerCustomer.setName(customerBasic.getFullName());
                callerCustomer.setSex(customerBasic.getSex());
                callerCustomer.setPhone(customerBasic.getMainMobile());
                JedisUtil.cacheDb().sadd(CachePrefix.TMP_TEL.getVal()+"_"+customerBasic.getMainMobile(),customerBasic.getId());
                CacheUtil.set(CachePrefix.TMP_CUST,customerBasic.getId(),JsonUtil.toJson(callerCustomer));
            }
        }
        //填加房屋关系（临时表）
        if (relationTypes.size() > 0) {
            for (String relationType : relationTypes) {
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("houseId", houseId);
                params.put("projectId", projectId);
                params.put("customerId", customerBasic.getId());
                params.put("relationType", relationType);
                params.put("creator", creator.getName());
                params.put("creatorId", creator.getId());
                centerDao.insert("sql.insert.customer.house.relationPending", params);
            }
        } else {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("houseId", houseId);
            params.put("projectId", projectId);
            params.put("customerId", customerBasic.getId());
            params.put("creator", creator.getName());
            params.put("creatorId", creator.getId());
            centerDao.insert("sql.insert.customer.house.relationPending", params);
        }

        String identity = customerBasic.getIdentity();
        if (StringUtils.isNotEmpty(identity) && !hasExistCustomer) {
            insertPendingCustomerIdentity(customerBasic.getId(), identity, creator);
        }
        String contentIds = customerBasic.getContentIds();
        if (StringUtils.isNotEmpty(contentIds) && !hasExistCustomer) {
            insertPendingCustomerHobbies(customerBasic.getId(), contentIds, creator);
        }
        return customerBasic.getId();

    }


    /**
     * 插入临时表客户兴趣爱好
     *
     * @param customerId 客户ID
     * @param hobbies    兴趣爱好编码（用逗号拼接后的值）
     * @param creator    创建人
     */
    public Boolean insertPendingCustomerHobbies(String customerId, String hobbies, User creator) {
        String[] hobbyArr = hobbies.split(",");
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("customerId", customerId);
        params.put("creator", creator.getName());
        params.put("creatorId", creator.getId());
        params.put("isDeleted", 0);
        for (String hobby : hobbyArr) {
            params.put("id", UUIDUtil.create());
            params.put("contentId", hobby);
            centerDao.insert("sql.insert.customerPending.hobby", params);
        }
        return true;
    }

    public String existApprovedPendingCustomer(String name, String projectCode, String phone) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("fullName", name);
        params.put("projectCode", projectCode);
        params.put("mainMobile", phone);
        return centerRoDao.queryForObjectQuietly(String.class, "sql.exist.customerPending", params);
    }


    /**
     * 插入临时表客户特殊身份
     *
     * @param customerId 客户ID
     * @param identities 特殊身份编码（用逗号拼接后的值）
     * @param creator    创建人
     */
    public Boolean insertPendingCustomerIdentity(String customerId, String identities, User creator) {
        String[] identityArr = identities.split(",");
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("customerId", customerId);
        params.put("creator", creator.getName());
        params.put("creatorId", creator.getId());
        params.put("isDeleted", 0);
        for (String identity : identityArr) {
            params.put("id", UUIDUtil.create());
            params.put("contentId", identity);
            centerDao.insert("sql.insert.customerPending.identity", params);
        }
        return true;
    }


    /**
     * 更新客户兴趣爱好
     *
     * @param customerId
     * @param hobbies
     * @param creator
     */
    public void updateCustomerHobbies(String customerId, List<Integer> hobbies, User creator) {
        //根据客户id获取该客户所有兴趣爱好（主表）
        List<HobbyPending> list = getCustomerHobbies(customerId);
        //存放将要作为新增操作的兴趣选项
        List<Integer> addList = new ArrayList<Integer>();
        //存放将要作为删除操作的兴趣选项
        List<Integer> removeList = new ArrayList<Integer>();
        //遍历新的兴趣选项，查找原有数据中需要移除的选项
        for (HobbyPending oldhobbies : list) {
            boolean exist = false;
            for (Integer newhobbies : hobbies) {
                if (oldhobbies.getContentId() == newhobbies) {
                    exist = true;
                }
            }
            if (exist == false) {
                removeList.add(oldhobbies.getContentId());
            }
        }
        //遍历原有的数据，查找新数据中需要做新增操作的选项
        for (Integer newhobbies : hobbies) {
            boolean exist = false;
            for (HobbyPending oldhobbies : list) {
                if (oldhobbies.getContentId() == newhobbies) {
                    exist = true;
                }
            }
            if (exist == false) {
                addList.add(newhobbies);
            }
        }
        //将需要移除插入临时表，operator设置为2
        for (Integer contentId : removeList) {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("id", UUIDUtil.create());
            params.put("customerId", customerId);
            params.put("contentId", contentId);
            params.put("creator", creator.getName());
            params.put("creatorId", creator.getId());
            params.put("approveStatus", 1);
            params.put("operator", 2);
            params.put("from", 1);
            centerDao.insert("sql.insert.customer.hobbypending", params);
        }
        //将需要新增插入临时表，operator设置为1
        for (Integer contentId : addList) {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("id", UUIDUtil.create());
            params.put("customerId", customerId);
            params.put("contentId", contentId);
            params.put("creator", creator.getName());
            params.put("creatorId", creator.getId());
            params.put("approveStatus", 1);
            params.put("operator", 1);
            params.put("from", 1);
            centerDao.insert("sql.insert.customer.hobbypending", params);
        }
    }

    /**
     * 更新客户特殊身份
     *
     * @param customerId
     * @param identity
     * @param creator
     */
    public void updateCustomerSpecialId(String customerId, List<Integer> identity, User creator) {
        //根据客户id获取该客户所有特殊身份（主表）
        List<SpecialIdentityPending> list = getCustomerSpecialId(customerId);
        //存放将要作为新增操作的特殊身份
        List<Integer> addList = new ArrayList<Integer>();
        //存放将要作为删除操作的特殊身份
        List<Integer> removeList = new ArrayList<Integer>();
        for (SpecialIdentityPending specialIdentityPending : list) {
            boolean exist = false;
            for (Integer integer : identity) {
                if (specialIdentityPending.getIdentity() == integer) {
                    exist = true;
                }
            }
            if (exist == false) {
                removeList.add(specialIdentityPending.getIdentity());
            }
        }
        for (Integer integer : identity) {
            boolean exist = false;
            for (SpecialIdentityPending specialIdentityPending : list) {
                if (specialIdentityPending.getIdentity() == integer) {
                    exist = true;
                }
            }
            if (exist == false) {
                addList.add(integer);
            }
        }
        //将需要移除插入临时表，operator设置为2
        for (Integer identities : removeList) {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("id", UUIDUtil.create());
            params.put("customerId", customerId);
            params.put("identity", identities);
            params.put("creator", creator.getName());
            params.put("creatorId", creator.getId());
            params.put("approveStatus", 1);
            params.put("operator", 2);
            params.put("from", 1);
            centerDao.insert("sql.insert.customer.specialidentitypending", params);
        }
        //将需要新增插入临时表，operator设置为1
        for (Integer identities : addList) {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("id", UUIDUtil.create());
            params.put("customerId", customerId);
            params.put("identity", identities);
            params.put("creator", creator.getName());
            params.put("creatorId", creator.getId());
            params.put("approveStatus", 1);
            params.put("operator", 1);
            params.put("from", 1);
            centerDao.insert("sql.insert.customer.specialidentitypending", params);
        }

    }

    /**
     * 根据客户code获取客户id
     *
     * @param customerCode
     * @return
     */
    public String getCustomerId(String customerCode) {
        if (StringUtils.isBlank(customerCode)) {
            return null;
        }
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("customerCode", customerCode);
        String customerId = null;
        customerId = centerRoDao.queryForStringQuietly("sql.query.customerCode.id", params);
        return customerId;
    }

    /**
     * 根据房屋code获取房屋id
     *
     * @param houseCode
     * @return
     */
    public String getHouseId(String houseCode) {
        if (StringUtils.isBlank(houseCode)) {
            return null;
        }
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("houseCode", houseCode);
        String houseId = null;
        houseId = centerRoDao.queryForStringQuietly("sql.query.houseCode.id", params);
        return houseId;
    }


    /**
     * 根据来电号码查询客户详细信息
     *
     * @return
     */
    public List<CallerCustomerDetail> queryCustomersDetails(String callNumber, Page page) {
        if (StringUtils.isBlank(callNumber)) {
            return null;
        }
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("callNumber", callNumber);
        return centerRoDao.queryForListPage(CallerCustomerDetail.class,page,"sql.query.callercustomer",null,params,true);

    }


    public CallCenterCustomer queryTempCustomerInfo(String customerId){
        Map<String,String> params=new HashMap<String, String>();
        params.put("customerId",customerId);
        return centerRoDao.queryForObject(CallCenterCustomer.class,"sql.query.tmpcustinfo",params);
    }

    public CallCenterCustomer queryMainCustomerInfo(String customerId){
        Map<String,String> params=new HashMap<String, String>();
        params.put("customerId",customerId);
        return centerRoDao.queryForObject(CallCenterCustomer.class,"sql.query.maincustinfo",params);
    }
}
