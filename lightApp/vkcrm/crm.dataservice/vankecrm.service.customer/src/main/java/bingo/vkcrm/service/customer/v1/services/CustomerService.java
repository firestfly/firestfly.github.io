package bingo.vkcrm.service.customer.v1.services;

import bingo.dao.Page;
import bingo.vkcrm.common.utils.IDCardUtil;
import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.annotation.OperationLog;
import bingo.vkcrm.service.annotation.OperationType;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.*;
import bingo.vkcrm.service.customer.v1.models.CustomerRelation;
import bingo.vkcrm.service.customer.v1.models.CustomerBasic4Approve;
import bingo.vkcrm.service.customer.v1.models.independent.CustomerSearchResult;
import bingo.vkcrm.service.enums.ResourceTypes;
import bingo.vkcrm.service.exceptions.EmptyParameterException;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


/**
 * Created by 程思远 on 2015/8/25.
 * 查询用户详细信息
 */
@Service
public class CustomerService extends CustomerCommonService {
    @Autowired
    HobbyService hobbyService;
    @Autowired
    SpecialIdentityService specialIdentityService;

    /**
     * 根据客户id查询用户基本信息
     *
     * @param customerId
     * @return
     */
//    @Cacheable(value = "Customer", key = "'CustBasic_'.concat(#customerId)")
    public CustomerBasic queryCustomerBasic(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForObject(CustomerBasic.class, "sql.query.customer.basic", parameters);
    }

    /**
     * 根据客户id查询用户基本信息(临时表pending)
     *
     * @param customerId
     * @return
     */
    public CustomerBasic4Approve queryCustomerBasicPending(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForObject(CustomerBasic4Approve.class, "service.query.customer.queryPendingBasic", parameters);
    }

    /**
     * 根据客户id查询用户详细信息
     *
     * @param customerId
     * @return 客户详情信息
     */
    public CustomerDetail queryCustomerDetails(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForObject(CustomerDetail.class, "sql.query.customer.details", parameters);
    }

    /**
     * 根据客户id查询用户详细信息(临时表pending)
     *
     * @param customerId
     * @return 客户详情信息
     */
    public CustomerDetail queryCustomerDetailsPending(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForObject(CustomerDetail.class, "service.query.customer.queryPendingDetails", parameters);
    }

    /**
     * 查询客户相关物业信息
     *
     * @param customerId 客户id
     * @return
     */
    public List<CustomerEstate> queryCustomerEstates(String customerId, String userId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        parameters.put("userId", userId);
        List<CustomerEstate> list = centerRoDao.queryForList(CustomerEstate.class, "sql.query.customer.estates", parameters);

        return list;
    }

    /**
     * 根据房屋id获取有关系的客户信息
     *
     * @param houseId       房屋id
     * @param relationTypes 与房屋的关系类型集合
     * @return
     */
    public List<CustomerOverview> queryCustomers(String houseId, Integer[] relationTypes) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("houseId", houseId);
        if (relationTypes != null && relationTypes.length > 0) {
            parameters.put("relationTypes", StringUtils.join(relationTypes, ','));
        }
        List<CustomerOverview> list = centerRoDao.queryForList(CustomerOverview.class,
                "sql.query.customer.by.houseid", parameters);
        return list;
    }

    /**
     * 根据房屋ID获取历史有关系的客户信息
     *
     * @param houseId 房屋id
     * @return
     */
    public List<CustomerOverview> queryHistoryCustomers(String houseId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("houseId", houseId);
        List<CustomerOverview> list = centerRoDao.queryForList(CustomerOverview.class,
                "sql.query.history.customer.by.houseid", parameters);
        return list;
    }

    /**
     * 根据业主ID，和需要获取获取关系的客户ID,获取他们之间的关系
     *
     * @param ownerId     业主id
     * @param customerIds 客户id数组
     * @return
     */
    public List<CustomerRelation> queryCustomerRelation(String ownerId, String[] customerIds) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("ownerId", ownerId);
        parameters.put("customerIds", StringUtils.join(customerIds, ","));
        return centerRoDao.queryForList(CustomerRelation.class, "sql.query.customer.to.customer.relation", parameters);
    }

    /**
     * 批量插入一条客户房屋关系记录
     *
     * @param houseId      房屋ID
     * @param customerId   客户ID
     * @param relationType 关系数组
     * @param creator      创建人
     * @return
     */
    public boolean addCustomerHouseRelations(String houseId, String customerId, Integer[] relationType, User creator) {
        int flag = 0;
        for (Integer type : relationType) {
            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("houseId", houseId);
            parameters.put("customerId", customerId);
            parameters.put("relationType", type);
            parameters.put("creator", creator.getName());
            parameters.put("creatorId", creator.getId());
            flag += centerDao.insert("sql.insert.houseRelation", parameters);
            logRelation2RedisMQ(customerId, houseId, houseId, "新增", ResourceTypes.House.getValue(), type);
        }
        return relationType.length == flag;
    }

    /**
     * 插入一条客户房屋关系记录
     *
     * @param houseId      房屋ID
     * @param customerId   客户ID
     * @param relationType 关系
     * @param creator      创建人
     * @return
     */
    public boolean addCustomerHouseRelation(String houseId, String customerId, Integer relationType, User creator) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("houseId", houseId);
        parameters.put("customerId", customerId);
        parameters.put("relationType", relationType);
        parameters.put("creator", creator.getName());
        parameters.put("creatorId", creator.getId());

        if (centerDao.insert("sql.insert.houseRelation", parameters) > 0) {
            //记录客房关系修改日志
            logRelation2RedisMQ(customerId, houseId, houseId, "新增", ResourceTypes.House.getValue(), relationType);
        }

        return true;
    }


    /**
     * 验证插入的房屋客户关系是否已经存在
     *
     * @param houseId      房屋ID
     * @param customerId   客户ID
     * @param relationType 关系
     * @return
     */
    public Boolean isHouseRelationExists(String houseId, String customerId, int relationType) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("houseId", houseId);
        parameters.put("customerId", customerId);
        parameters.put("relationType", relationType);
        boolean isExists = centerRoDao.exists("sql.exists.houseRelation", parameters);
        return isExists;
    }


    /**
     * 验证插入的房屋客户关系是否冲突,即既是业主又是租户
     *
     * @param houseId      房屋ID
     * @param customerId   客户ID
     * @param relationType 关系
     * @return
     */
    public boolean isHouseRelationConflict(String houseId, String customerId, int relationType) {
        Map<String, Object> params = new HashMap<String, Object>();
        if (relationType == 1) {
            params.put("relationType", 3);
        } else if (relationType == 3) {
            params.put("relationType", 1);
        }
        params.put("houseId", houseId);
        params.put("customerId", customerId);
        return centerRoDao.exists("service.query.customer.hasCustomerHouseRelation", params);
    }


    /**
     * 验证插入的房屋客户关系是否已经存在
     *
     * @param houseId      房屋ID
     * @param customerId   客户ID
     * @param relationType 关系
     * @return
     */
    public Boolean hasCustomerHouseRelation(String houseId, String customerId, int relationType) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("houseId", houseId);
        params.put("customerId", customerId);
        params.put("relationType", relationType);
        return centerRoDao.exists("service.query.customer.hasCustomerHouseRelation", params);
    }


    /**
     * 移除当前房屋与客户的关系
     *
     * @param houseId       房屋ID
     * @param customerIds   客户ID集合
     * @param relationTypes 客户关系
     * @param deletor       删除者
     * @return
     */
    @Transactional
    public Boolean removeHouseRelations(String houseId, String[] customerIds, int[] relationTypes, User deletor) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("houseId", houseId);
        parameters.put("user", deletor.getName());
        parameters.put("userId", deletor.getId());

        for (int i = 0; i < customerIds.length; i++) {
            parameters.put("customerId", customerIds[i]);
            parameters.put("relationType", relationTypes[i]);
            // 添加到客房关系历史表
            int effectRows = centerDao.insert("sql.insert.houseRelation.history", parameters);
            if (effectRows > 0) {
                // 从客房关系表中删除
                if (centerDao.delete("sql.delete.houseRelation", parameters) > 0) {
                    //记录客房关系修改日志
                    logRelation2RedisMQ(customerIds[i], houseId, houseId, "移除", ResourceTypes.House.getValue(), relationTypes[i]);
                }
            }
        }
        return true;
    }


    /**
     * 移除当前房屋与客户的关系
     *
     * @param houseId       房屋ID
     * @param customerId   客户ID集合
     * @param deletor       删除者
     * @return
     */
    @Transactional
    public Boolean removeHouseRelations(String houseId, String customerId, User deletor) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("houseId", houseId);
        parameters.put("user", deletor.getName());
        parameters.put("userId", deletor.getId());
        parameters.put("customerId", customerId);
        // 添加到客房关系历史表
        //查询一个客户现在有的客户关系
        List<Integer> relationTypes=centerRoDao.queryForList(Integer.class,"sql.query.houseRelation",parameters);
        for (Integer relationType : relationTypes) {
            parameters.put("relationType",relationType);
            centerDao.insert("sql.insert.houseRelation.history", parameters);//插入历史客户表
            centerDao.delete("sql.delete.houseRelation", parameters);//删除关系
            //记录客房关系修改日志
            logRelation2RedisMQ(customerId, houseId, houseId, "移除", ResourceTypes.House.getValue(),relationType);
        }
        return true;
    }

    /**
     * 查出一个房屋下的常用联系人ID
     *
     * @param houseId 房屋ID
     * @return 常用联系人ID
     */
    public String queryContactId(String houseId) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("houseId", houseId);
        return centerRoDao.queryForStringQuietly("sql.query.house.contactsId", params);
    }

    /**
     * 更新房屋的常用联系人
     *
     * @param houseId 房屋ID
     * @return 常用联系人ID
     */
    public Boolean updateHouseInfo4Contact(String houseId, String contactsId, String contactsName, String contactsMobile) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("houseId", houseId);
        params.put("contactsId", contactsId);
        params.put("contactsName", contactsName);
        params.put("contactsMobile", contactsMobile);
        return centerDao.update("sql.update.house.contact", params) > 0;
    }


    /**
     * 生成新客户编码
     *
     * @return 客户编码
     * @throws Exception
     */
    public String newCustomerCode() throws Exception {

        // 插入客户ID生成表
        CustCodeGen codeGenerate = new CustCodeGen();
        long code = 0;
        boolean isCodeSingo = false;
        int count = 0;//循环次数

        do {
            if (count > 100) {
                throw new Exception("获取客户ID失败，多次获取到重复的客户ID，请重试！");
            }
            count++;
            codeGenerate.setValue(UUIDUtil.create());
            codeGenerate.setPid(null);
            centerDao.insert(codeGenerate);

            // 获取生成的pid再+10亿，预防客户ID小于10位数
            Map<String, Object> queryMap = new HashMap<String, Object>();
            queryMap.put("VALUE", codeGenerate.getValue());
            codeGenerate = centerDao.queryForObject(CustCodeGen.class, "sql.customer.queryCustCodeGem", queryMap);
            code = Long.parseLong(codeGenerate.getPid());
            code = code + 1200000000;

            if (!centerDao.getJdbcDao().exists("sql.customer.checkCode", code)) {
                isCodeSingo = true;
            }
        } while (!isCodeSingo);

        return code + "";

    }


    /**
     * 根据客户名、邮箱、手机号码查询客户列表（三个条件可选）
     *
     * @param customerName
     * @param certificateType
     * @param mobileNumber
     * @return list<CustomerBasic>
     */
    public List<CustomerSearchResult> search(Page pager, String customerName, String licenseNumber,
                                             Integer certificateType, String certificateId, String mobileNumber, String userId) {
        final int DEFAULT_MAX_ROWS = 100;
        // 如果没有输入搜索条件，默认只查前10页数据
//        if (StringUtils.isBlank(customerName) && StringUtils.isBlank(certificateId)
//                && StringUtils.isBlank(mobileNumber) && certificateType == null) {
//            //不做总数查询
//            pager.setQueryTotalRows(false);
//            //默认一万条数据
//            pager.setTotalRows(DEFAULT_MAX_ROWS);
//            Map<String, Object> parameters = new HashMap<String, Object>();
//            parameters.put("userId", userId);
//            parameters.put("start", pager.getRowStart());
//            parameters.put("end", pager.getPageSize());
//            parameters.put("licenseNumber", licenseNumber);
//            List<CustomerSearchResult> list = centerRoDao.queryForList(CustomerSearchResult.class, CustomerSearchResult.class, "sql.search.customer.all", parameters);
//            return list;
//        }
        //有查询条件，做自动分页
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userId", userId);
        parameters.put("customerName", customerName);
        parameters.put("mobileNumber", mobileNumber);
        parameters.put("licenseNumber", licenseNumber);
        if (certificateType != null) {
            parameters.put("certificateType", certificateType);
        }
        parameters.put("certificateId", certificateId);
        List<CustomerSearchResult> list = centerRoDao.queryForListPage(CustomerSearchResult.class, pager,
                "sql.search.customer", "", parameters, true);
        return list;
    }


    /**
     * 判断要新增的用户是否存在
     *
     * @param certificateType 证件类型
     * @param certificateId   证件号码
     * @return 如果存在相同的用户则返回true，不存在返回false
     */
    @Deprecated
    public Boolean isExists(Integer certificateType, String certificateId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("certificateType", certificateType);
        parameters.put("certificateId", certificateId);
        return centerRoDao.exists("sql.exists.customer", parameters);

    }

    /**
     * 判断要新增的用户是否存在
     *
     * @param certificateType 证件类型
     * @param certificateId   证件号码
     * @return 如果存在相同的用户则返回true，不存在返回false
     */
    public Boolean isExists(Integer certificateType, String certificateId, String code) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("certificateType", certificateType);
        parameters.put("certificateId", certificateId);
        parameters.put("code", code);
        return centerRoDao.queryForInt("sql.exists.customer", parameters) > 0;

    }


    /**
     * 添加客户信息及与房屋的关系
     *
     * @param customerInfo 客户信息
     * @param houseId      房屋Id
     * @param user         当前用户
     * @return
     * @throws Exception
     */
    public Boolean addCustomerWithHouse(CustomerInfo customerInfo, String houseId, User user)
            throws Exception {
        boolean success = this.addCustomer4House(customerInfo, houseId, user);
        if (success) {
            return addCustomerToHouse(customerInfo, houseId, user);
        }
        return success;
    }

    /**
     * 添加客户信息及与车位的关系
     *
     * @param customerInfo 客户信息
     * @param carportId    车位id
     * @param carportId    车位id
     * @param user         当前用户
     * @return
     * @throws Exception
     */
    public Boolean addCustomerWithCarport(CustomerInfo customerInfo, String carportId, User user)
            throws Exception {
        boolean success = this.addCustomer4Carport(customerInfo, carportId, user);
        if (success) {
            return addCustomerToCarport(customerInfo, carportId, user);
        }
        return success;
    }


    /**
     * 新增客户
     *
     * @param customerInfo 客户全部信息
     * @return Boolean
     */
    private Boolean addCustomer4House(CustomerInfo customerInfo, String houseId, User user) throws Exception {
        String customerId = UUIDUtil.create();
        String customerCode = newCustomerCode();

        customerInfo.getBasic().setId(customerId);
        customerInfo.getBasic().setCode(customerCode);
        String certificateId = customerInfo.getBasic().getCertificateId();//证件号码
        //如果是身份证，则默认设置客户生日、性别信息
        if (customerInfo.getBasic().getCertificateType() == 1) {
            if (certificateId.length() == 15) {
                customerInfo.getBasic().setCertificateId(IDCardUtil.from15to18(certificateId));//如果是15位默认设置为18位
            }
            customerInfo.getDetails().setBirthday(IDCardUtil.getBrithday(certificateId));//设置客户生日
            customerInfo.getBasic().setSex(IDCardUtil.getCustomerSex(certificateId));//设置客户性别
        }
        this.addCustomerBasic(customerInfo.getBasic());
        //添加客户详情
        CustomerDetail detail = customerInfo.getDetails();
        if (detail != null) {
            detail.setId(customerId);
            addCustomerDetail(detail);
        }
        //添加兴趣爱好
        List<Integer> hobby = customerInfo.getHobbies();
        if (hobby != null) {
            hobbyService.addHobby(customerId, houseId, hobby, user);
        }
        //添加特殊身份
        List<SpecialIdentity> specialIdentityList = customerInfo.getIdentities();
        Date beginDate = null;
        Integer dur = null;
        if (specialIdentityList != null) {
            List<Integer> ids = new ArrayList<Integer>();
            for (SpecialIdentity specialIdentity : specialIdentityList) {
                Integer identityCode = specialIdentity.getIdentity();
                ids.add(identityCode);
                if (identityCode == 8) {//法律纠纷客户
                    beginDate = specialIdentity.getBeginDate();
                    dur = new Long(specialIdentity.getDuration()).intValue();
                }
            }
            specialIdentityService.addSpecialIdentity(customerId, ids, beginDate, dur, user);
        }
        return true;
    }


    /**
     * 新增客户
     *
     * @param customerInfo 客户全部信息
     * @return Boolean
     */
    private Boolean addCustomer4Carport(CustomerInfo customerInfo, String carportId, User user) throws Exception {
        String customerId = UUIDUtil.create();
        String customerCode = newCustomerCode();

        customerInfo.getBasic().setId(customerId);
        customerInfo.getBasic().setCode(customerCode);
        this.addCustomerBasic(customerInfo.getBasic());
        //添加客户详情
        CustomerDetail detail = customerInfo.getDetails();
        if (detail != null) {
            detail.setId(customerId);
            addCustomerDetail(detail);
        }
        //添加兴趣爱好
        List<Integer> hobby = customerInfo.getHobbies();
        if (hobby != null) {
            hobbyService.addHobby4Carport(customerId, carportId, hobby, user);
        }
        //添加特殊身份
        List<SpecialIdentity> specialIdentityList = customerInfo.getIdentities();
        Date beginDate = null;
        Integer dur = null;
        if (specialIdentityList != null) {
            List<Integer> ids = new ArrayList<Integer>();
            for (SpecialIdentity specialIdentity : specialIdentityList) {
                Integer identityCode = specialIdentity.getIdentity();
                ids.add(identityCode);
                if (identityCode == 8) {//法律纠纷客户
                    beginDate = specialIdentity.getBeginDate();
                    dur = new Long(specialIdentity.getDuration()).intValue();
                }
            }
            specialIdentityService.addSpecialIdentity(customerId, ids, beginDate, dur, user);
        }
        return true;
    }


    /**
     * 更新正式表客户信息，用于客户审批
     *
     * @param customerInfo 客户信息
     * @param user         操作人
     * @return Boolean
     */
    public Boolean updateCustomer(CustomerInfo4Update customerInfo, User user) {
        String customerId = customerInfo.getCustomerId();//临时表的客户ID
        String crmCustomerId = customerInfo.getCrmCustomerId();//正式表的客户ID
        String houseId = customerInfo.getHouseId();//房屋ID
        String buildingId = customerInfo.getBuildingId();
        String buildingType = customerInfo.getBuildingType();
        List<Integer> hobbyIds = customerInfo.getHobbyIds();//兴趣爱好集合
        List<Integer> houseRelations = customerInfo.getHouseRelations();//客房关系集合
        Integer cardType = customerInfo.getCardType();//证件类型
        String cardNo = customerInfo.getCardNo();//证件号码
        String mainMobile = customerInfo.getMainMobile();//手机号码
        String standbyMobile = customerInfo.getStandbyMobile();//备用手机
        String homeTel = customerInfo.getHomeTel();//住宅电话
        String officeTel = customerInfo.getOfficeTel();//办公电话
        String name = customerInfo.getName();
        Integer sex = customerInfo.getSex();
        //1、更新main_customer表数据
        CustomerBasic basic = new CustomerBasic();
        basic.setSex(sex);
        basic.setFullName(name);
        basic.setId(crmCustomerId);
        basic.setCertificateType(cardType);
        basic.setCertificateId(cardNo);
        basic.setMainMobile(mainMobile);
        basic.setStandbyMobile(standbyMobile);
        basic.setHomeTel(homeTel);
        basic.setOfficeTel(officeTel);
        updateCustomerBasic(crmCustomerId, buildingId, buildingType, basic, user);
        //2、更新兴趣爱好
        hobbyService.changeHobbies(crmCustomerId, houseId, hobbyIds, user);
        //3、更新房屋关系
        updateCustomerToHouse(crmCustomerId, houseId, houseRelations, user);
        //4、把临时表的客户记录设置为已处理
        updatePendingCustomerApproveStatus(customerId, crmCustomerId);
        return true;
    }

    /**
     * 添加客房关系
     *
     * @param customerInfo 客户信息
     * @param houseId      房屋Id
     * @param user         当前用户
     * @return
     */
    private Boolean addCustomerToHouse(CustomerInfo customerInfo, String houseId, User user) {
        String customerId = customerInfo.getBasic().getId();
        //添加客房关系
        List<Integer> houseRelationTypes = customerInfo.getHouseRelationTypes();
        if (houseRelationTypes != null) {
            for (Integer houseRelationType : houseRelationTypes) {
                addCustomerHouseRelation(houseId, customerId, houseRelationType, user);
            }
        }
        //添加与业主关系
        List<CustomerRelation> customerRelations = customerInfo.getCustomerRelations();
        if (customerRelations != null) {
            saveCustomerToCustomerRelation(customerRelations, user, customerId);
        }
        return true;
    }

    /**
     * 更新客房关系，不会存进历史客户表中
     *
     * @param customerId         客户ID
     * @param houseId            房屋ID
     * @param houseRelationTypes 关系集合
     * @param user               操作人
     * @return Boolean
     */
    public Boolean updateCustomerToHouse(String customerId, String houseId, List<Integer> houseRelationTypes, User user) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        parameters.put("houseId", houseId);
        //存放将要添加的客房关系
        List<Integer> addRelations = new ArrayList<Integer>();
        //存放将要移除的客房关系
        List<Integer> removeRelations = new ArrayList<Integer>();
        //获取原来已有的客户关系
        List<CustomerHouseRelation> oldRelations = centerRoDao.queryForList(CustomerHouseRelation.class, "service.query.customer.houseRelation", parameters);
        //判断传来的关系是否已存在，不存则放入addRelations
        if (houseRelationTypes != null) {
            for (Integer relationId : houseRelationTypes) {
                boolean unExist = true;
                for (CustomerHouseRelation relation : oldRelations) {
                    if (relation.getRelationType() == relationId) {
                        unExist = false;
                    }
                }
                if (unExist) {
                    addRelations.add(relationId);
                }
            }
        }

        //判断原来的客房关系是否应删除
        if (houseRelationTypes != null) {
            for (CustomerHouseRelation relation : oldRelations) {
                boolean unExist = true;
                for (Integer relationId : houseRelationTypes) {
                    if (relation.getRelationType() == relationId) {
                        unExist = false;
                    }
                }
                if (unExist) {
                    removeRelations.add(relation.getRelationType());
                }
            }
        }
        addCustomerHouseRelation(customerId, houseId, addRelations, user);
        removeCustomerHouseRelation(customerId, houseId, removeRelations, user);
        return true;
    }

    /**
     * 更新临时表客户信息为“已审批”
     *
     * @param customerId    临时表客户ID
     * @param crmCustomerId 对应的正式表的ID(main_customer中的id)
     * @return Boolean
     */
    public Boolean updatePendingCustomerApproveStatus(String customerId, String crmCustomerId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("customerId", customerId);
        params.put("crmCustomerId", crmCustomerId);
        return centerDao.update("service.update.pendingCustomer.approveStatus", params) > 0;

    }

    /**
     * 添加客房关系
     *
     * @param customerId   客户ID
     * @param houseId      房屋ID
     * @param addRelations 关系集合
     * @param user         操作人
     */
    private void addCustomerHouseRelation(String customerId, String houseId, List<Integer> addRelations, User user) {
        for (Integer relation : addRelations) {
            String uuid = UUIDUtil.create();
            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("id", uuid);
            parameters.put("customerId", customerId);
            parameters.put("houseId", houseId);
            parameters.put("relationType", relation);
            parameters.put("creator", user.getName());
            parameters.put("creatorId", user.getId());
            if (centerDao.insert("service.insert.customer.houseRelation", parameters) > 0) {
                logRelation2RedisMQ(customerId, houseId, uuid, "新增", ResourceTypes.Customer.getValue(), relation);
            }
        }
    }

    /**
     * 移除客房关系，逻辑删除，不会存进历史表
     *
     * @param customerId      客户ID
     * @param houseId         房屋ID
     * @param removeRelations 要移除的关系集合
     * @param user            操作人
     */
    public void removeCustomerHouseRelation(String customerId, String houseId, List<Integer> removeRelations, User user) {
        for (Integer relation : removeRelations) {
            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("houseId", houseId);
            parameters.put("customerId", customerId);
            parameters.put("relationType", relation);
            parameters.put("deleter", user.getName());
            parameters.put("deleterId", user.getId());
            if (centerDao.insert("sql.remove.customer.houseRelation", parameters) > 0) {
                logRelation2RedisMQ(customerId, houseId, relation + "", "移除", ResourceTypes.Customer.getValue(), relation);
            }
        }
    }

    /**
     * 添加客户与车位的关系
     *
     * @param customerInfo 客户信息
     * @param carportId    车位Id
     * @param user         当前用户
     * @return
     */
    private Boolean addCustomerToCarport(CustomerInfo customerInfo, String carportId, User user) {
        // 新增客车关系
        List<String> customerIds = new ArrayList<String>();
        customerIds.add(customerInfo.getBasic().getId());
        addCarportRelation(carportId, customerIds, user);
        return true;
    }


    /**
     * 变更客车关系
     *
     * @param carportId
     * @param customerIds
     */
    public Boolean carportTransfer(String carportId, String[] customerIds, User creator) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("carportId", carportId);
        //存放将要添加的客户ID
        List<String> addCustomerIds = new ArrayList<String>();
        //存放将要移除的客户ID
        List<String> removeCustomerIds = new ArrayList<String>();
        //获取原来车位下的主人
        List<CarportCustomerRelation> oldCustomerRelations = centerRoDao.queryForList(CarportCustomerRelation.class, "sql.query.carportCustomer.relation", parameters);
        //判断传来的customerIds是否已存在，不存则放入addCustomerId
        for (String customerId : customerIds) {
            boolean unexist = true;
            for (CarportCustomerRelation relation : oldCustomerRelations) {
                if (relation.getCustomerId().equals(customerId)) {
                    unexist = false;
                }
            }
            if (unexist) {
                addCustomerIds.add(customerId);
            }
        }
        //判断原来客户是否应删除
        for (CarportCustomerRelation relation : oldCustomerRelations) {
            boolean unexist = true;
            for (String customerId : customerIds) {
                if (relation.getCustomerId().equals(customerId)) {
                    unexist = false;
                }
            }
            if (unexist) {
                removeCustomerIds.add(relation.getId());
            }
        }
        ;
        addCarportRelation(carportId, addCustomerIds, creator);
        removeCarportRelation(removeCustomerIds, creator);
        return true;
    }

    /**
     * 添加客户与车位的关系
     *
     * @param carportId   车位ID
     * @param customerIds 客户ID（集合）
     * @param creator     操作人
     */
    public boolean addCarportRelation(String carportId, List<String> customerIds, User creator) {
        CarportCustomerRelation relation = new CarportCustomerRelation();
        relation.setCarportId(carportId);
        relation.setCreator(creator.getName());
        relation.setCreatorId(creator.getId());
        relation.setIsDeleted(false);
        relation.setRelationType(1);//暂时只有一种关系，以后可能会有多种，预留防坑。目前默认为1
        for (String customerId : customerIds) {
            relation.setCustomerId(customerId);
            relation.setCreateTime(new Date());
            centerDao.insert(relation);
        }
        return true;
    }

    /**
     * 删除客户与车位的关系（通过主键逻辑删除）
     *
     * @param relationIds
     * @param deletor     操作人
     */
    public void removeCarportRelation(List<String> relationIds, User deletor) {
        for (String relationId : relationIds) {
            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("id", relationId);
            parameters.put("deletor", deletor.getName());
            parameters.put("deletorId", deletor.getId());
            centerDao.update("sql.remove.carportCustomer.relation", parameters);
        }
    }


    /**
     * 删除客户与车位的关系（通过关系、客户、车位ID逻辑删除）
     *
     * @param customerIds 客户ID（集合）
     * @param carportId   车位ID
     * @param deletor     操作人
     */
    public boolean removeCarportRelation(String carportId, String[] customerIds, User deletor) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("carportId", carportId);
        parameters.put("deletor", deletor.getName());
        parameters.put("deletorId", deletor.getId());
        for (String customerId : customerIds) {
            parameters.put("customerId", customerId);
            centerDao.update("sql.remove.carportCustomer.relationByCustomerId", parameters);
        }
        return true;
    }


    /**
     * 添加客户基本信息
     *
     * @param basic 客户基本信息
     * @return
     */
    private boolean addCustomerBasic(CustomerBasic basic) {
        return centerDao.insert("sql.insert.customer.basic", basic) > 0;
    }

    /**
     * 添加客户详细信息
     *
     * @param detail 客户详细信息
     * @return
     */
    private boolean addCustomerDetail(CustomerDetail detail) {
        return centerDao.insert("sql.insert.customer.detail", detail) > 0;
    }


    /**
     * 新增 “业主与新增客户”的关系
     *
     * @param ownerRelationList 关系
     * @param customerId        新增客户ID
     * @return true 插入成功 false 插入失败
     */
    public Boolean saveCustomerToCustomerRelation(List<CustomerRelation> ownerRelationList, User user, String customerId) {
        int result = 0;
        for (int i = 0; i < ownerRelationList.size(); i++) {
            String sql = "sql.insert.customer.customerRelation";
            CustomerRelation ownerRelation = ownerRelationList.get(i);
            ownerRelation.setToCustomerId(customerId);
            ownerRelation.setCreator(user.getName());
            ownerRelation.setCreatorId(user.getId());
            centerDao.insert(sql, ownerRelation);
            result++;
        }
        return result == ownerRelationList.size();
    }


    /**
     * 根据姓名，电话，证件号码查询客户信息
     */
    public List<CustomerInfo4Search> queryCustomer4Search(String name, String phone, String cardNum, String houseId,
                                                          String carportId, Page page) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("houseId", houseId);
        if (StringUtils.isNotEmpty(name)) {
            params.put("name", name);
        }
        if (StringUtils.isNotEmpty(phone)) {
            params.put("phone", phone);
        }
        if (StringUtils.isNotEmpty(cardNum)) {
            params.put("cardNum", cardNum);
        }
        if (StringUtils.isNotEmpty(carportId)) {
            params.put("carportId", carportId);
        }
        String sql = "service.query.customerInfo4Search";
        return centerRoDao.queryForListPage(CustomerInfo4Search.class, page, sql, null, params, true);
    }


    /**
     * 根据姓名，电话，证件号码查询客户信息
     */
    public List<CustomerInfo4Search> queryCustomer4Carport(String name, String phone, String cardNum, Page page) {
        Map<String, Object> params = new HashMap<String, Object>();
        if (StringUtils.isNotEmpty(name)) {
            params.put("name", name);
        }
        if (StringUtils.isNotEmpty(phone)) {
            params.put("phone", phone);
        }
        if (StringUtils.isNotEmpty(cardNum)) {
            params.put("cardNum", cardNum);
        }
        return centerRoDao.queryForListPage(CustomerInfo4Search.class, page, "service.query.carport.customerInfo4Search", null, params, true);
    }


    /**
     * 根据车位ID获取车位下的客户(isDeleted =0 为现有客户，1为历史客户)
     */
    public List<CustomerInfo4Search> queryCustomerByCarport(String carportId, int isDeleted) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("carportId", carportId);
        params.put("isDeleted", isDeleted);
        return centerRoDao.queryForList(CustomerInfo4Search.class, "service.query.carport.customer", params);
    }

    /**
     * 更新客户基本信息
     *
     * @param customerBasic 客户基本信息
     * @param user          操作人
     * @return true 成功 false 失败
     */
    @OperationLog(operationType = OperationType.UpdateEntity, operationName = "修改客户基本信息", springServiceName = "customerService", targetClass = CustomerService.class, resultClass = CustomerBasic.class, targetMethod = "queryCustomerBasic", queueKey = "datachangelog.key", idIndex = {0, 1, 2})
    public Boolean updateCustomerBasic(String customerId, String buildingId, String buildingType, CustomerBasic customerBasic, User user) {
        customerBasic.setModifier(user.getName());
        customerBasic.setModifierId(user.getId());
        // 判断用户是否有编辑客户敏感数据的权限
        if (hasPermission(user.getId(), "CUSTOMER_EDIT_HIGH")) {
            return centerDao.update("sql.update.customer.basic", customerBasic) > 0;
        } else {
            return centerDao.update("sql.update.customer.basic1", customerBasic) > 0;
        }
    }


    /**
     * 更新客户详细信息
     *
     * @param customerId
     * @param detail
     * @param user
     * @return
     */
    @OperationLog(operationType = OperationType.UpdateEntity, operationName = "修改客户详细信息", springServiceName = "customerService", targetClass = CustomerService.class, resultClass = CustomerDetail.class, targetMethod = "queryCustomerDetails", queueKey = "datachangelog.key", idIndex = {0, 1, 2})
    public Boolean updateCustomerDetail(String customerId, String buildingId, String buildingType, CustomerDetail detail, User user) {
        detail.setModifier(user.getName());
        detail.setModifierId(user.getId());
        return centerDao.update("sql.update.customer.detail", detail) > 0;
    }

    /**
     * 更新或插入客户详细信息
     *
     * @param customerId 客户编码
     * @param detail     客户详细信息
     * @param user       操作人
     * @return true 成功 false 失败
     */
    public Boolean updateOrInsertCustomerDetail(String customerId, String buildingId, String buildingType, CustomerDetail detail, User user) {
        //判断这个用户ID是否存在于deatil表中
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("id", customerId);
        if (centerRoDao.exists("service.query.customer.hasCustomerDetails", params)) {
            return updateCustomerDetail(customerId, buildingId, buildingType, detail, user);
        } else {
            return saveCustomerDetail(detail, user);
        }
    }

    public Boolean hasCustomerDetail(String customerId) {
        //判断这个用户ID是否存在于deatil表中
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("id", customerId);
        return centerRoDao.exists("service.query.customer.hasCustomerDetails", params);
    }

    /**
     * 保存客户详细信息
     *
     * @param detail
     * @param user
     * @return
     */
    public Boolean saveCustomerDetail(CustomerDetail detail, User user) {
        detail.setModifierId(user.getId());
        detail.setModifier(user.getName());
        detail.setModifyTime(new Date());
        return centerDao.insert(detail) > 0;
    }


    /**
     * 房屋过户
     *
     * @param houseId       房屋ID
     * @param customerIds   老的客户ID集合
     * @param relationTypes 老的客户与房屋关系集合
     * @param ownerIds      新的业主
     * @param user          操作人
     * @return true插入成功 false  插入失败
     */
    @Transactional
    public Boolean saveHouseTransfer(String houseId, String[] customerIds, int[] relationTypes, String[] ownerIds, User user) {
        //移除选中的关系
        removeHouseRelations(houseId, customerIds, relationTypes, user);
        //添加新的业主
        for (String ownerId : ownerIds) {
            addCustomerHouseRelation(houseId, ownerId, 1, user);//关系code值：“1” 为拥有，即业主。
        }
        saveHouserLog(houseId,customerIds,ownerIds,user); //插入过户日志信息
        return true;
    }

    /**
     * 房屋过户日志
     *
     * @param houseId       房屋ID
     * @param customerIds   老的客户ID集合
     * @param ownerIds      新的业主
     * @param user          操作人
     * @return true插入成功 false  插入失败
     */
    public Boolean saveHouserLog(String houseId,String[] customerIds,String[] ownerIds,User user){
        String exOwnerIds = "";
        String curOwnerids = "";
        for (String customerId:customerIds) {
            exOwnerIds+=customerId+"|";
        }
        for (String ownerId:ownerIds) {
            curOwnerids+=ownerId+"|";
        }
        exOwnerIds= exOwnerIds.substring(0,exOwnerIds.length()-1);
        curOwnerids= curOwnerids.substring(0,curOwnerids.length()-1);
        Map<String,Object> logMap = new HashMap<String, Object>();
        logMap.put("houseId",houseId);
        logMap.put("exOwnerId",exOwnerIds);
        logMap.put("curOwnerid",curOwnerids);
        logMap.put("creator",user.getName());
        logMap.put("creatorId",user.getId());
        centerDao.insert("sql.insert.transfer.log",logMap);
        return true;
    }

    /**
     * 通过姓名和项目模糊查询该项目下的客户(车位变更客户时用到)
     *
     * @param projectId 项目ID
     * @param name      客户姓名(用于模糊匹配)
     * @return 查询到的客户信息集合
     */
    public List<CustomerBasic> queryCustomer4CarportTransfer(String projectId, String name) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("projectId", projectId);
        params.put("name", name);
        String sql = "service.query.customer.queryCustomer4CarportTransfer";
        return centerRoDao.queryForList(CustomerBasic.class, sql, params);
    }


    /**
     * 获取待审批客户列表
     *
     * @param page 分页信息
     * @return 待审批的客户列表
     */
    public List<CustomerBasic4Approve> queryPendingCustomer(Page page, Date startTime, Date endTime, Integer from, Integer operator, String projectId,String userId) {
        //查询基本信息
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("userId", userId);
        if (startTime != null) {
            params.put("startTime", startTime);
        }
        if (endTime != null) {
            params.put("endTime", endTime);
        }
        if (from != null) {
            params.put("from", from);
        }
        if (operator != null) {
            params.put("operator", operator);
        }
        if (StringUtils.isNotEmpty(projectId)) {
            params.put("projectId", projectId);
        }
        return centerRoDao.queryForListPage(CustomerBasic4Approve.class, page, "service.query.customer.queryPendingCustomer", null, params, true);
    }

    /**
     * 获取已审批客户列表
     *
     * @param page 分页信息
     * @return 待审批的客户列表
     */
    public List<CustomerBasic4Approve> queryApprovedPendingCustomer(Page page, Date startTime, Date endTime, Integer from, Integer operator, String projectId,String userId) {
        //查询基本信息
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("userId", userId);
        if (startTime != null) {
            params.put("startTime", startTime);
        }
        if (endTime != null) {
            params.put("endTime", endTime);
        }
        if (from != null) {
            params.put("from", from);
        }
        if (operator != null) {
            params.put("operator", operator);
        }
        if (StringUtils.isNotEmpty(projectId)) {
            params.put("projectId", projectId);
        }
        return centerRoDao.queryForListPage(CustomerBasic4Approve.class, page, "service.query.customer.queryPendingCustomer.approved", null, params, true);
    }

    /**
     * 更新临时表审批状态
     *
     * @param id
     * @param user
     * @return
     */
    public boolean saveAprrovePendingCustomer(String id, String crmCustomerId, int approve, User user) {
        boolean result = false;
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("modifierId", user.getId());
        params.put("modifier", user.getName());
        params.put("id", id);
        params.put("approve", approve);
        params.put("crmCustomerId", crmCustomerId);
        int i = centerDao.update("service.approve.customer.PendingCustomer", params);
        result = i > 0;
        return result;
    }

    /**
     * 更新临时表审批状态(管家撤销时)
     *
     * @param id
     * @param user
     * @return
     */
    public boolean saveCancelPendingCustomer(String id, User user) {
        boolean result = false;
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("modifierId", user.getId());
        params.put("modifier", user.getName());
        params.put("id", id);
        params.put("approve", 3);
        int i = centerDao.update("service.cancel.customer.PendingCustomer", params);
        result = i > 0;
        return result;
    }

    /**
     * 获取客户与房屋关系(正式表)
     *
     * @param customerId 客户ID（正式表）
     * @return
     */
    public List<CustomerHouseRelation> queryCustomerHouseRelation(String customerId, String houseId, String userId) throws Exception {
        Map<String, Object> params = new HashMap<String, Object>();
        if (StringUtils.isNotEmpty(customerId)) {
            params.put("customerId", customerId);
        }
        if (StringUtils.isNotEmpty(houseId)) {
            params.put("houseId", houseId);
        }
        if (params.isEmpty()) {
            throw new EmptyParameterException("customerId,houseId", "客户编码,房屋编码不能同时为空.");
        }
        params.put("userId", userId);
        //查询客户与房屋关系
        return centerRoDao.queryForList(CustomerHouseRelation.class, "service.query.customer.houseRelation", params);
    }

    /**
     * 获取客户与房屋关系(临时表pending)
     *
     * @param customerId 客户ID（临时表）
     * @return
     */
    public List<CustomerHouseRelation> queryPendingCustomerHouseRelation(String customerId, String houseId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("customerId", customerId);
        params.put("houseId", houseId);
        //查询客户与房屋关系
        return centerRoDao.queryForList(CustomerHouseRelation.class, "service.query.customer.queryPendingCustomerHouseRelation", params);
    }


    /**
     * 新增客户基本信息
     * 对外接口
     *
     * @param certificateId   证件id
     * @param houseId         房屋id
     * @param certificateType 证件类型
     * @param name            客户姓名
     * @param relation        客房关系数组
     * @param user            创建者暂为空
     * @return
     * @throws Exception
     */
    public Boolean addCustomerForApp(String certificateId, String houseId,
                                     Integer certificateType, String name, List<Integer> relation, User user) throws Exception {
        Map<String, Object> params = new HashMap<String, Object>();
        String customerId = UUIDUtil.create();
        String customerCode = newCustomerCode();
        params.put("id", customerId);
        params.put("code", customerCode);
        params.put("name", name);
        params.put("certificateType", certificateType);
        params.put("certificateId", certificateId);
        //客户类型默认为普通客户
        int addCustomer = centerDao.insert("sql.insert.customer.app", params);
        //添加客房关系
        if (relation != null) {
            for (Integer integer : relation) {
                addCustomerHouseRelation(houseId, customerId, integer, user);
            }
        }
        return addCustomer > 0;
    }

    /**
     * 根据房屋code查询房屋id
     *
     * @param houseCode
     * @return
     */
    public String queryHouseId(String houseCode) {
        if (StringUtils.isBlank(houseCode)) {
            return null;
        }
        String houseId = null;
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("houseCode", houseCode);
        houseId = centerRoDao.queryForStringQuietly("sql.query.house.code", params);
        return houseId;
    }

    public List<CustomerSearchResult> queryCustomerForApp(Page pager, String customerName, String houseName,
                                                          Integer certificateType, String certificateId, String mobileNumber) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerName", customerName);
        parameters.put("mobileNumber", mobileNumber);
        parameters.put("houseName", houseName);
        parameters.put("certificateType", certificateType);
        parameters.put("certificateId", certificateId);
        List<CustomerSearchResult> list = centerRoDao.queryForListPage(CustomerSearchResult.class, pager,
                "sql.search.customer.forApp", "", parameters, true);
        return list;
    }

    /**
     * 删除客房关系，用于维护客户与房屋关系(逻辑删除)
     *
     * @param customerId    客户ID
     * @param houseId       房屋ID
     * @param relationTypes 关系code
     * @return 是否成功
     */
    public boolean changeHouseRelation(String customerId, String houseId, String[] relationTypes, User user) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        parameters.put("houseId", houseId);
        parameters.put("isDeleted", "1");
        parameters.put("deleter", user.getName());
        parameters.put("deleterId", user.getId());
        parameters.put("deleteTime", new Date());
        for (String relationType : relationTypes) {
            parameters.put("relationType", relationType);
            centerDao.update("sql.update.customer.unbindByType", parameters);
            logRelation2RedisMQ(customerId, houseId, houseId, "移除", ResourceTypes.House.getValue(), Integer.parseInt(relationType));
        }

        return true;
    }

    /**
     * 更新临时表审批状态，并设置正式表客户ID，用于客户审批(新增客户时)
     *
     * @param customerId    客户ID（临时表客户ID）
     * @param crmCustomerId 正式表新增客户生成的ID
     * @return 是否成功
     */
    public boolean updateApproveStatus(String customerId, String crmCustomerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        parameters.put("crmCustomerId", crmCustomerId);
        return centerDao.update("sql.update.customer.approveStatus", parameters) > 0;
    }

    // add by liaochao 20160121 begin
    /**
     * 根据业主ID，获取业主亲戚
     *
     * @param ownerId     业主id
     * @return
     */
    public List<CustomerRelation> queryCustomerRelations(String ownerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("ownerId", ownerId);
        return centerRoDao.queryForList(CustomerRelation.class, "sql.query.customer.relations", parameters);
    }
    // add by liaochao 20160121 end
    
    /**
   	 * @Description: 分页查询客户信息
   	 * @param: curPage当前页
   	 * @param pageSize当前页行数
   	 * @param YZParam 参数对象
   	 * @throws:
   	 * @Author: luoml01
   	 * @date: 2016年3月14日 下午6:37:47
   	 * @return:List<Customer> 客户信息集合
        * @exception:
   	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
   	 */
       public List<Customer> getCustomerPage(Page pager, YZParam yzParam) {
           //有查询条件，做自动分页
           Map<String, Object> parameters = new HashMap<String, Object>();
           if (null != yzParam.getCarportCodes() && yzParam.getCarportCodes().length>0) {
        	   parameters.put("carportCodes", "'" + StringUtils.join(yzParam.getCarportCodes(), "','") + "'");
   		}
           if (null != yzParam.getHouseCodes() && yzParam.getHouseCodes().length>0) {
          	 	parameters.put("houseCodes", "'" + StringUtils.join(yzParam.getHouseCodes(), "','") + "'");
   		}
           if (StringUtils.isNotEmpty(yzParam.getCustomerCode())) {
          	 	parameters.put("customerCode", yzParam.getCustomerCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getModifyTime())) {
          	 	parameters.put("modifyTime", yzParam.getModifyTime());
          	    parameters.put("timestamp", yzParam.getTimestamp());
   		}
           List<Customer> list = centerRoDao.queryForListPage(Customer.class, pager,"sql.query.Customer", "", parameters, true);
           //TODO，暂时不需要
//           if (null != list && list.size()>0) {
//           	for (Customer customer : list) {
//           		//查询特殊身份
//           		List<SpecialIdentity> specialIdentitys= specialIdentityService.queryAll(customer.getId());
//           		customer.setSpecialIdentitys(specialIdentitys);
//           		//兴趣爱好
//           		List<Hobby> hobbys = hobbyService.queryAll(customer.getId());
//           		customer.setHobbys(hobbys);
//           		//客房关系
//           		parameters = new HashMap<String, Object>();
//           		parameters.put("customerId", customer.getId());
//                   List<CustomerHouse> customerHouses = centerRoDao.queryForList(CustomerHouse.class, "sql.query.customer.house.relation", parameters);
//                   customer.setCustomerHouses(customerHouses);
//           	}
//   		}
           return list;
       }
       
       /**
   	 * @Description: 分页获取客房关系
   	 * @param: curPage当前页
   	 * @param: pageSize 当前页行数
   	 * @param: yzParam 请求对象
   	 * @throws:
   	 * @Author: luoml01
   	 * @date: 2016年3月14日 下午6:37:47
   	 * @return:List<CustomerHouse> 客房关系集合
        * @exception:
   	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
   	 */
       public List<CustomerHouse> getCustomerHousePage(Page pager,YZParam yzParam) {
           //有查询条件，做自动分页
           Map<String, Object> parameters = new HashMap<String, Object>();
           if (StringUtils.isNotEmpty(yzParam.getHouseCode())) {
          	 	parameters.put("houseCode", yzParam.getHouseCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getCustomerCode())) {
          	 	parameters.put("customerCode", yzParam.getCustomerCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getModifyTime())) {
           	parameters.put("modifyTime", yzParam.getModifyTime());
          	 	parameters.put("timestamp", yzParam.getTimestamp());
   		}
           List<CustomerHouse> list = centerRoDao.queryForListPage(CustomerHouse.class,pager,"sql.query.customer.house.relation",null, parameters,true);
           return list;
       }
       
       /**
   	 * @Description: 分页获取客车关系
   	 * @param: curPage当前页
   	 * @param pageSize当前页行数
   	 * @param YZParam 请求对象
        * @param customerCode 客户编码
        * @param modifyTime 修改开始时间
        * @param timestamp 修改结束时间
   	 * @throws:Exception
   	 * @Author: luoml01
   	 * @date: 2016年3月14日 下午6:37:47
   	 * @return:List<CarportCustomer> 客车关系集合
        * @exception:TODO
   	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
   	 */
       public List<CarportCustomer> getCustomerCarportPage(Page pager,YZParam yzParam) {
           //有查询条件，做自动分页
           Map<String, Object> parameters = new HashMap<String, Object>();
           if (StringUtils.isNotEmpty(yzParam.getCarportCode())) {
          	 	parameters.put("carportCode", yzParam.getCarportCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getCustomerCode())) {
          	 	parameters.put("customerCode", yzParam.getCustomerCode());
   		}
           if (StringUtils.isNotEmpty(yzParam.getModifyTime())) {
          	 	parameters.put("modifyTime", yzParam.getModifyTime());
          	 	parameters.put("timestamp", yzParam.getTimestamp());
   		}
           List<CarportCustomer> list = centerRoDao.queryForListPage(CarportCustomer.class,pager,"sql.query.customer.carport.relation",null, parameters,true);
           return list;
       }
}
