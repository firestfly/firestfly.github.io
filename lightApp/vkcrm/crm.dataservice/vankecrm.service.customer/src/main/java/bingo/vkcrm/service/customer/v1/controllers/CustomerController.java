package bingo.vkcrm.service.customer.v1.controllers;

import bingo.common.core.ApplicationContext;
import bingo.dao.Page;
import bingo.vkcrm.common.utils.IDCardUtil;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.customer.v1.Version;

import bingo.vkcrm.service.customer.v1.models.*;
import bingo.vkcrm.service.customer.v1.models.independent.CustomerSearchResult;
import bingo.vkcrm.service.customer.v1.models.CustomerBasic4Approve;
import bingo.vkcrm.service.customer.v1.services.CustomerService;
import bingo.vkcrm.service.customer.v1.services.SpecialIdentityService;
import bingo.vkcrm.service.enums.BuildingTypes;
import bingo.vkcrm.service.exceptions.*;
import bingo.vkcrm.service.service.DictionaryService;
import bingo.vkcrm.service.customer.v1.services.HobbyService;
import bingo.vkcrm.service.model.DictionaryItem;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

/**
 * 查询用户详细信息
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class CustomerController extends BaseController {
    private static final Log log = LogFactory.getLog(CustomerController.class);

    @Autowired
    CustomerService service;
    @Autowired
    HobbyService hobbyService;
    @Autowired
    DictionaryService dictionaryService;
    @Autowired
    SpecialIdentityService specialIdentityService;
    /**
     * 每页最大数据量
     */
    private final int MAX_SIZE_PER_PAGE = 30;

    /**
     * 客户与房屋的关系类型
     */
    public enum RelationTypes {
        /**
         * 拥有
         */
        Owner(1),
        /**
         * 居住
         */
        Live(2),
        /**
         * 租赁
         */
        Rent(3),
        /**
         * 账单
         */
        Bill(4),
        /**
         * 分润
         */
        Profit(5),
        /**
         * 其他
         */
        Other(99);

        private Integer code = 0;

        private RelationTypes(Integer code) {
            this.code = code;
        }

        public Integer getCode() {
            return code;
        }
    }


    /**
     * 查询客户信息
     *
     * @param customerName    客户姓名
     * @param certificateType 证件类型id
     * @param certificateId   证件号码
     * @param mobileNumber    联系电话
     * @param curPage         当前页码
     * @param pageSize        每页数据量
     * @return
     */
    @RequestMapping(value = "/customers", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryAll(String customerName, Integer certificateType,
                                  String certificateId, String mobileNumber, String licenseNumber, int curPage, int pageSize) throws Exception {
        if (pageSize > MAX_SIZE_PER_PAGE) {
            throw new ParameterErrorException("pageSize", "每页数据量", "每页数据量不能超过" + MAX_SIZE_PER_PAGE + "条数据");
        }
        User user = getCurrentUser();
        Page pager = new Page();
        pager.setPage(curPage);
        pager.setPageSize(pageSize);
        List<CustomerSearchResult> list = service.search(pager, customerName, licenseNumber, certificateType, certificateId, mobileNumber, user.getId());
        ListResult<CustomerSearchResult> listResult = new ListResult<CustomerSearchResult>(pager, list);
        if (listResult == list) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(listResult);
    }

    /**
     * 根据客户id查询客户所有信息
     *
     * @param customerId 客户id
     * @param houseId    房屋ID。如果不传，则查出一个客户所有的客户房屋关系
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/info", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryFull(@PathVariable(value = "customerId") String customerId, String houseId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new EmptyParameterException("customerId", "客户ID为空或不存在");
        }
        User user = getCurrentUser();
        Map<String, Object> info = new HashMap<String, Object>();
        CustomerBasic basic = service.queryCustomerBasic(customerId);
        CustomerDetail details = service.queryCustomerDetails(customerId);
        info.put("basic", basic);
        info.put("details", details);
        info.put("specialIdentity", specialIdentityService.queryAll(customerId));
        info.put("hobby", hobbyService.queryAll(customerId));
        info.put("houseRelation", service.queryCustomerHouseRelation(customerId, houseId, user.getId()));
        if (info.isEmpty()) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(info);
    }



    /**
     * 根据客户id查询临时客户所有信息(用于加载临时客户信息)
     *
     * @param customerId 客户id
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/temp/info", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryTmpCustomer(@PathVariable(value = "customerId") String customerId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new EmptyParameterException("customerId", "客户ID为空或不存在");
        }
        User user = getCurrentUser();
        Map<String, Object> info = new HashMap<String, Object>();
        CustomerBasic4Approve basic = service.queryCustomerBasicPending(customerId);
        info.put("basic", basic);
        info.put("details", null);
        info.put("specialIdentity", null);
        info.put("hobby", null);
        info.put("houseRelation",null);
        if (info.isEmpty()) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(info);
    }




    /**
     * 根据客户id查询客户基本信息
     *
     * @param customerId 客户id
     * @return 客户基本信息
     */
    @RequestMapping(value = "/customer/{customerId}/basic", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryBasic(@PathVariable(value = "customerId") String customerId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new EmptyParameterException("customerId", "客户ID为空或不存在");
        }
        CustomerBasic basic = service.queryCustomerBasic(customerId);
        if (basic == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(basic);
    }

    /**
     * 根据客户id查询客户详细资料
     *
     * @param customerId 客户id
     * @return 客户详细信息
     */
    @RequestMapping(value = "/customer/{customerId}/details", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryDetails(@PathVariable(value = "customerId") String customerId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new EmptyParameterException("customerId", "客户ID为空或不存在");
        }
        CustomerDetail detail = service.queryCustomerDetails(customerId);
        if (detail == null) {
            throw new NotFoundException("查询结果为空.");
        }
        System.out.print(detail.getBirthday());
        return ServiceResult.succeed(detail);
    }


    /**
     * 根据房屋的ID，获取业主/客户信息。
     *
     * @param houseId 房屋id
     * @return
     */
    @RequestMapping(value = "/house/{id}/customers", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCustomers(@PathVariable(value = "id") String houseId) throws Exception {
        if (StringUtils.isEmpty(houseId)) {
            throw new EmptyParameterException("houseId", "房屋ID为空或不存在");
        }
        List<CustomerOverview> list = service.queryCustomers(houseId, null);
        if (list == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(list);
    }


    /**
     * 根据房屋的Code，获取业主/客户信息。（对外服务）
     *
     * @param houseCode 房屋Code
     * @return
     */
    @RequestMapping(value = "/house/{houseCode}/getCustomersByHouseCode", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getCustomersByHouseCode(@PathVariable(value = "houseCode") String houseCode) throws Exception {
        return queryCustomers(service.getHouseIdByCode(houseCode));
    }

    /**
     * 根据房屋的ID，获取业主信息。
     *
     * @param houseId 房屋id
     * @return
     */
    @RequestMapping(value = "/customer/house/{houseId}/owners", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryOwners(@PathVariable(value = "houseId") String houseId) throws Exception {
        List<CustomerOverview> list = service.queryCustomers(houseId, new Integer[]{RelationTypes.Owner.getCode()});
        if (list == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(list);
    }

    /**
     * 根据房屋的Code，获取业主信息。（对外服务）
     *
     * @param houseCode 房屋Code
     * @return
     */
    @RequestMapping(value = "/customer/house/{houseCode}/getOwnersHouseCode", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getOwnersHouseCode(@PathVariable(value = "houseCode") String houseCode) throws Exception {
        return queryOwners(service.getHouseIdByCode(houseCode));
    }

    /**
     * 根据房屋的ID，获取历史业主/客户信息。
     *
     * @param houseId 房屋id
     * @return
     */
    @RequestMapping(value = "/customer/house/history", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryHistoryCustomers(String houseId) throws Exception {
        List<CustomerOverview> list = service.queryHistoryCustomers(houseId);
        if (list == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(list);
    }


    /**
     * 根据房屋的Code，获取历史业主/客户信息。（对外服务）
     *
     * @param houseCode 房屋code
     * @return
     */
    @RequestMapping(value = "/customer/house/getHistoryCustomersByCode", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getHistoryCustomersByCode(String houseCode) throws Exception {
        return queryHistoryCustomers(service.getHouseIdByCode(houseCode));
    }

    /**
     * 获取客户间的关系
     *
     * @param customerId    业主客户ID
     * @param toCustomerIds 要获取关系的客户ID数组
     * @return
     */
    @RequestMapping(value = "/customer/relation", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryOwnerCustomerRelation(String customerId, String[] toCustomerIds) throws Exception {
        List<CustomerRelation> list = service.queryCustomerRelation(customerId, toCustomerIds);
        if (list == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(list);
    }

    /**
     * 新增客户与房屋的关系
     *
     * @param houseId      房屋ID
     * @param customerId   客户ID
     * @param relationType 关系
     * @return
     */
    @RequestMapping(value = "/customer/houseRelation/bind", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addHouseRelation(String houseId, String customerId, Integer[] relationType) throws Exception {
        boolean isExists = false,
                isConflict = false,
                isChange = false;
        if (StringUtils.isEmpty(houseId) || StringUtils.isEmpty(customerId) || relationType == null) {
            throw new BadRequestException("参数异常");
        }
        for (int i = 0; i < relationType.length; i++) {
            isExists = service.hasCustomerHouseRelation(houseId, customerId, relationType[i]);
            if (isExists) {
                throw new NotModifyiedException("该客房关系已存在");
            }
        }
        for (int i = 0; i < relationType.length; i++) {
            isConflict = service.isHouseRelationConflict(houseId, customerId, relationType[i]);
            if (isConflict) {
                throw new NotModifyiedException("该客户与房屋的关系冲突");
            }
        }
        isChange = service.addCustomerHouseRelations(houseId, customerId, relationType, getCurrentUser());
        if (false == isChange) {
            throw new NotModifyiedException("数据未修改");
        }
        return ServiceResult.succeed(true);

    }


    /**
     * 新增客户与房屋的关系（对外接口）
     *
     * @param houseCode    房屋Code
     * @param customerId   客户ID
     * @param relationType 关系
     * @return
     */
    @RequestMapping(value = "/customer/houseRelation/bindByHouseCode", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addHouseRelationByHouseCode(String houseCode, String customerId, Integer[] relationType) throws Exception {
        return addHouseRelation(service.getHouseIdByCode(houseCode), customerId, relationType);
    }

    /**
     * 删除一个用户并插入到客房关系历史表中（用于房屋详情页右侧客户信息）
     *
     * @param houseId       房屋ID
     * @param customerId    客户ID
     * @return
     */
    @RequestMapping(value = "/customer/houseRelation/remove", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult removeHouseRelation(String customerId,String houseId) throws Exception {
        //查出常用联系人ID
        String contactId = service.queryContactId(houseId);
        if (customerId.equals(contactId)) {
            //如果传过来的客户包含常用联系人，删除联系人信息（ID,姓名，联系人电话）（更新main_house内容）
            service.updateHouseInfo4Contact(houseId, null, null, null);//把房屋的常用联系人信息置空
        }

        service.removeHouseRelations(houseId, customerId,getCurrentUser());
        return ServiceResult.succeed(true);
    }

    /**
     * 解除房屋用户关系
     *
     * @param houseId       房屋ID
     * @param customerIds   客户ID
     * @param relationTypes 关系类型（如：业主、租户等）
     * @return
     */
    @RequestMapping(value = "/customer/houseRelation/unbind", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult unbindHouseRelation(String houseId, String[] customerIds, int[] relationTypes) throws Exception {
        //查出常用联系人ID
        String contactId = service.queryContactId(houseId);
        for (String customerId : customerIds) {
            if (customerId.equals(contactId)) {
                //如果传过来的客户包含常用联系人，删除联系人信息（ID,姓名，联系人电话）（更新main_house内容）
                service.updateHouseInfo4Contact(houseId, null, null, null);//把房屋的常用联系人信息置空
            }
        }
        service.removeHouseRelations(houseId, customerIds, relationTypes, getCurrentUser());
        return ServiceResult.succeed(true);
    }


    /**
     * 解除房屋用户关系（对外接口）
     *
     * @param houseCode     房屋Code
     * @param customerIds   客户ID
     * @param relationTypes 关系类型（如：业主、租户等）
     * @return
     */
    @RequestMapping(value = "/customer/houseRelation/unbindByHouseCode", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult removeHouseRelationByHouseCode(String houseCode, String[] customerIds, int[] relationTypes) throws Exception {
        return unbindHouseRelation(service.getHouseIdByCode(houseCode), customerIds, relationTypes);
    }

    /**
     * 查询客户相关物业信息action
     *
     * @param customerId 客户id
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/estates", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCustomerEstates(@PathVariable(value = "customerId") String customerId) throws Exception {
        User user = getCurrentUser();
        List<CustomerEstate> list = service.queryCustomerEstates(customerId, user.getId());
        if (list == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(list);
    }

    /**
     * 获取客户编码
     *
     * @return 新客户唯一编码(10位数字)
     */
    @RequestMapping(value = "/customer/newCode", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult genNewCustomerCode() throws Exception {
        String code = service.newCustomerCode();
        return ServiceResult.succeed(code);
    }

    /**
     * 验证客户信息
     *
     * @param info 客户信息
     * @return
     * @throws Exception
     */
    private Boolean validCustomerExists(CustomerInfo info) throws Exception {
        if (info == null) {
            throw new EmptyParameterException("客户信息", "客户信息为空,请检查表单填写字段");
        }
        if (info.getBasic() == null) {
            throw new EmptyParameterException("客户基本信息", "客户基本信息为空,请检查表单填写字段");
        }
        String fullName = info.getBasic().getFullName();
        Integer certificateType = info.getBasic().getCertificateType();
        String certificateId = info.getBasic().getCertificateId();
        String id = info.getBasic().getId();
        String mainMobile = info.getBasic().getMainMobile();
        if (service.isExists(certificateType, certificateId, id)) {
            throw new NotModifyiedException(ApplicationContext.getProperty("validate.idcard.error"));
        }
        //当证件类型为身份证时，判断身份证格式
        if (certificateType == CertificateType.身份证.getCode()) {
            if (!IDCardUtil.isIdCardNo(certificateId)) {
                throw new BadRequestException("身份证格式错误！");
            }
            //使用老的身份证（15位）时，加多三个数字
            if (certificateId.length() == 15) {
                info.getBasic().setCertificateId(IDCardUtil.from15to18(certificateId));
            }
        }
        return true;
    }

    /**
     * 新增客户信息
     *
     * @param info
     * @return
     */
    @RequestMapping(value = "/customer", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addCustomerWithHouse(CustomerInfo info, String houseId) throws Exception {
        if (validCustomerExists(info)) {
            if (StringUtils.isNotEmpty(houseId)) {
                service.addCustomerWithHouse(info, houseId, getCurrentUser());
            } else {
                throw new ParameterErrorException("houseId", "房屋ID", "房屋ID不能为空");
            }
        }
        return ServiceResult.succeed(info.getBasic().getId());
    }


    /**
     * 新增客户信息（用于车位）
     *
     * @param info
     * @return
     */
    @RequestMapping(value = "/customer/carport", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addCustomerWithCarport(CustomerInfo info, String carportId) throws Exception {
        if (validCustomerExists(info)) {
            if (StringUtils.isNotEmpty(carportId)) {
                service.addCustomerWithCarport(info, carportId, getCurrentUser());
            } else {
                throw new ParameterErrorException("carportId", "车位ID", "车位ID不能为空");
            }
        }
        return ServiceResult.succeed(info.getBasic().getId());
    }

    /**
     * 车位过户
     *
     * @param carportId 车位ID
     * @param newIds    新的客户ID
     * @return
     */
    @RequestMapping(value = "/carportInfo/{carportId}/carportTransfer", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult carportTransfer(@PathVariable("carportId") String carportId, String[] newIds) {
        ServiceResult serviceResult = new ServiceResult();
        try {
            serviceResult.setSuccess(service.carportTransfer(carportId, newIds, getCurrentUser()));
            serviceResult.setMessage("车位过户成功!");
            return serviceResult;
        } catch (Exception ex) {
            ex.printStackTrace();
            return ServiceResult.error(ex);
        }
    }

    /**
     * 车位过户（对外服务）
     *
     * @param carportCode 车位Code
     * @param newIds      新的客户ID
     * @return
     */
    @RequestMapping(value = "/carportInfo/{carportCode}/carportTransferByCode", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult carportTransferByCode(@PathVariable("carportCode") String carportCode, String[] newIds) {
        return carportTransfer(service.getCarportIdByCode(carportCode), newIds);
    }


    /**
     * 新增客户与车位的关系
     *
     * @param carportId 车位ID
     * @return 车位详细信息
     */
    @RequestMapping(value = "/carport/relation", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addCarportRelation(String carportId, String[] customerIds) {
        ServiceResult serviceResult = new ServiceResult();
        try {
            List<CustomerInfo4Search> customers=service.queryCustomerByCarport(carportId,0);
            for (CustomerInfo4Search customer : customers) {
                String id=customer.getId();
                for (String customerId : customerIds) {
                    if(id.equals(customerId)){
                        throw  new NotModifyiedException("该客户与车位已经存在关系！");
                    }
                }
            }
            List<String> customerList = new ArrayList<String>();
            for (String customerId : customerIds) {
                customerList.add(customerId);
            }
            serviceResult.setDetails(service.addCarportRelation(carportId, customerList, getCurrentUser()));
            serviceResult.setSuccess(true);
            return serviceResult;
        } catch (Exception ex) {
            ex.printStackTrace();
            return ServiceResult.error(ex);
        }
    }


    /**
     * 移除客户与车位的关系
     *
     * @param carportId   车位ID
     * @param customerIds 客户ID集合
     * @return serviceResult
     */
    @RequestMapping(value = "/carport/removeRelation", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult removeCarportRelation(String carportId, String[] customerIds) {
        ServiceResult serviceResult = new ServiceResult();
        try {
            serviceResult.setDetails(service.removeCarportRelation(carportId, customerIds, getCurrentUser()));
            serviceResult.setSuccess(true);
            return serviceResult;
        } catch (Exception ex) {
            ex.printStackTrace();
            return ServiceResult.error(ex);
        }
    }


    /**
     * 房屋过户
     *
     * @param houseId       房屋ID
     * @param customerIds   老的客户ID集合
     * @param relationTypes 老的客户与房屋关系集合
     * @param ownerIds      新的业主
     */
    @RequestMapping(value = "/customer/houseRelation/houseTransfer", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult houseTransfer(String houseId, String[] customerIds, int[] relationTypes, String[] ownerIds) throws Exception {
        String contactId = service.queryContactId(houseId);
        for (String customerId : customerIds) {
            if (customerId.equals(contactId)) {
                //如果传过来的客户包含常用联系人，删除联系人信息（ID,姓名，联系人电话）（更新main_house内容）
                service.updateHouseInfo4Contact(houseId, null, null, null);//把房屋的常用联系人信息置空
            }
        }
        service.saveHouseTransfer(houseId, customerIds, relationTypes, ownerIds, getCurrentUser());
        //Arrays.asList(ownerIds);
        return ServiceResult.succeed("过户成功");
    }


    /**
     * 房屋过户（对外接口）
     *
     * @param houseCode     房屋Code
     * @param customerIds   老的客户ID集合
     * @param relationTypes 老的客户与房屋关系集合
     * @param ownerIds      新的业主
     */
    @RequestMapping(value = "/customer/houseRelation/houseTransferByCode", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult houseTransferByCode(String houseCode, String[] customerIds, int[] relationTypes, String[] ownerIds) throws Exception {
        return houseTransfer(service.getHouseIdByCode(houseCode), customerIds, relationTypes, ownerIds);
    }


    /**
     * 修改客户基本信息
     */
    @RequestMapping(value = "/customer/updateBasic", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateCustomerBasic(CustomerBasic customerBasic, String buildingId, String buildingType) throws Exception {
        CustomerInfo customerInfo = new CustomerInfo();
        customerInfo.setBasic(customerBasic);
        validCustomerExists(customerInfo);
        service.updateCustomerBasic(customerBasic.getId(), buildingId, buildingType, customerBasic, getCurrentUser());
        return ServiceResult.succeed("修改成功.");
    }


    /**
     * 修改客户基本信息（对外服务）
     */
    @RequestMapping(value = "/customer/updateBasicByCode", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateCustomerBasicByBuildingCode(CustomerBasic customerBasic, String buildingCode, String buildingType) throws Exception {
        if (StringUtils.isEmpty(buildingCode) || StringUtils.isEmpty(buildingType)) {
            throw new EmptyParameterException("编码或者类型不能为空", "编码或者类型不能为空");
        }

        String buildingId = null;
        // 接口对外发布，外部系统传Code不传id，需要将房屋code转成id
        if (BuildingTypes.House.equals(buildingType)) {
            buildingId = service.getHouseIdByCode(buildingCode);
        } else if (BuildingTypes.Carport.equals(buildingType)) {
            buildingId = service.getCarportIdByCode(buildingCode);
        }

        return updateCustomerBasic(customerBasic, buildingId, buildingType);
    }

    /**
     * 修改客户详细信息（对外服务）
     */
    @RequestMapping(value = "/customer/updateDetails", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateCustomerDetail(CustomerDetail customerDetail, String buildingId, String buildingType) throws Exception {
        if (service.hasCustomerDetail(customerDetail.getId())) {
            service.updateCustomerDetail(customerDetail.getId(), buildingId, buildingType, customerDetail, getCurrentUser());
        } else {
            service.saveCustomerDetail(customerDetail, getCurrentUser());
        }
        return ServiceResult.succeed("修改成功.");
    }


    /**
     * 修改客户详细信息（对外服务）
     */
    @RequestMapping(value = "/customer/updateDetailsByCode", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateCustomerDetailByBuildingCode(CustomerDetail customerDetail, String buildingCode, String buildingType) throws Exception {
        if (StringUtils.isEmpty(buildingCode) || StringUtils.isEmpty(buildingType)) {
            throw new EmptyParameterException("编码或者类型不能为空", "编码或者类型不能为空");
        }

        String buildingId = null;
        // 接口对外发布，外部系统传Code不传id，需要将房屋code转成id
        if (BuildingTypes.House.equals(buildingType)) {
            buildingId = service.getHouseIdByCode(buildingCode);
        } else if (BuildingTypes.Carport.equals(buildingType)) {
            buildingId = service.getCarportIdByCode(buildingCode);
        }

        if (service.hasCustomerDetail(customerDetail.getId())) {
            service.updateCustomerDetail(customerDetail.getId(), buildingId, buildingType, customerDetail, getCurrentUser());
        } else {
            service.saveCustomerDetail(customerDetail, getCurrentUser());
        }
        return ServiceResult.succeed("修改成功.");
    }

    /**
     * 通过搜索框查询客户的姓名、电话、证件号码
     *
     * @param name    客户姓名
     * @param phone   电话号码
     * @param cardNum 证件号码
     * @return
     */
    @RequestMapping(value = "/customer/queryCustomer4Search/{curPage}/{pageSize}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCustomer4Search(@PathVariable(value = "curPage") Integer curPage, @PathVariable(value = "pageSize") Integer pageSize,
                                              String name, String phone, String cardNum, String houseId) throws Exception {
        if (StringUtils.isEmpty(name + phone + cardNum)) {
            throw new BadRequestException("查询条件为空.");
        }
        Page page = new Page();
        page.setPageSize(pageSize);
        page.setPage(curPage);

        ListResult<CustomerInfo4Search> customers = new ListResult<CustomerInfo4Search>(page, service.queryCustomer4Search(name, phone, cardNum, houseId, "", page));
        List<DictionaryItem> items = dictionaryService.get("HouseCustomerRelationType");
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("customers", customers);
        data.put("items", items);
        if (customers == null) {
            throw new NotFoundException("查询结果为空.");
        }

        return ServiceResult.succeed(data);
    }


    /**
     * 根据项目ID和客户姓名模糊匹配一个项目下的客户信息
     *
     * @param name 客户姓名
     */
    @RequestMapping(value = "/customer/queryCustomer4CarportTransfer/{projectId}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCustomer4CarportTransfer(@PathVariable(value = "projectId") String projectId, String name) throws Exception {
        List<CustomerBasic> customerBasics = service.queryCustomer4CarportTransfer(projectId, name);
        if (customerBasics == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(customerBasics);
    }


    /**
     * 根据项目ID和客户姓名模糊匹配一个项目下的客户信息（对外接口）
     *
     * @param name 客户姓名
     */
    @RequestMapping(value = "/customer/queryCustomer4CarportTransferByProjectCode/{projectCode}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCustomer4CarportTransferByProjectCode(@PathVariable(value = "projectCode") String projectCode, String name) throws Exception {
        return queryCustomer4CarportTransfer(service.getProjectIdByCode(projectCode), name);
    }

    /**
     * 查询penging相关的客户信息列表
     *
     * @param curPage  页码
     * @param pageSize 页面大小
     */
    @RequestMapping(value = "/customers/pending/{curPage}/{pageSize}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryPendingCustomerList(@PathVariable(value = "curPage") Integer curPage, @PathVariable(value = "pageSize") Integer pageSize,
                                                  Date startTime, Date endTime, Integer from, Integer operator, String projectCode) throws Exception {
        Page page = null;
        //
        if (curPage == null || pageSize == null) {
            throw new ParameterErrorException("curPage,pageSize", "分页信息", "请传入分页信息");
        }
        String userId=getCurrentUser().getId();
        page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        return ServiceResult.succeed(new ListResult<CustomerBasic4Approve>(page, service.queryPendingCustomer(page, startTime, endTime, from, operator, projectCode,userId)));
    }

    /**
     * 查询临时表已审批客户
     *
     * @param curPage
     * @param pageSize
     * @param startTime
     * @param endTime
     * @param from
     * @param operator
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customers/pending/approved/{curPage}/{pageSize}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryApprovedPendingCustomerList(@PathVariable(value = "curPage") Integer curPage, @PathVariable(value = "pageSize") Integer pageSize,
                                                          Date startTime, Date endTime, Integer from, Integer operator, String projectCode) throws Exception {
        Page page = null;
        if (curPage == null || pageSize == null) {
            throw new ParameterErrorException("curPage,pageSize", "分页信息", "请传入分页信息");
        }
        page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        String userId=getCurrentUser().getId();
        return ServiceResult.succeed(new ListResult<CustomerBasic4Approve>(page, service.queryApprovedPendingCustomer(page, startTime, endTime, from, operator, projectCode,userId)));
    }

    /**
     * 撤销管家审批任务
     * 设置审批状态
     * 审核状态（1、待审核、2、审核通过、3、审核未通过）
     *
     * @param pendingId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customers/pending/cancel", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult cancelPendingCustomer(String pendingId) throws Exception {
        boolean result = service.saveCancelPendingCustomer(pendingId, getCurrentUser());
        return ServiceResult.succeed(result);
    }


    /**
     * 通过客户ID查询penging相关的客户信息
     *
     * @param customerId 客户ID
     */
    @RequestMapping(value = "/customer/{customerId}/pending", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryPendingCustomer(@PathVariable(value = "customerId") String customerId, String houseId) throws Exception {
        if (customerId == null || houseId == null) {
            throw new ParameterErrorException("customerId,houseId", "客户ID，房屋ID", "客户和房屋ID不能为空");
        }
        Map<String, Object> info = new HashMap<String, Object>();
        info.put("basic", service.queryCustomerBasicPending(customerId));
        info.put("details", service.queryCustomerDetailsPending(customerId));
        info.put("specialIdentity", specialIdentityService.queryAllPending(customerId));
        info.put("hobby", hobbyService.queryAllPending(customerId));
        info.put("houseRelation", service.queryPendingCustomerHouseRelation(customerId, houseId));

        return ServiceResult.succeed(info);

    }

    /**
     * 更新客户信息（用于客户审批）
     *
     * @param customerInfo 客户ID
     */
    @RequestMapping(value = "/customer/{id}", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateCustomer(@PathVariable(value = "id") String id, CustomerInfo4Update customerInfo) throws Exception {
        if (StringUtils.isEmpty(customerInfo.getCustomerId()) || StringUtils.isEmpty(customerInfo.getCrmCustomerId())) {
            throw new ParameterErrorException("customerInfo.customerId,customerInfo.crmCustomerId", "临时表客户ID，正式表客户ID", "不能为空");
        }
        return ServiceResult.succeed(service.updateCustomer(customerInfo, getCurrentUser()));
    }

    /**
     * 新增客户信息（用于客户审批）
     *
     * @param info
     * @return
     */
    @RequestMapping(value = "/customer/{pendingId}/approve", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addCustomer(@PathVariable(value = "pendingId") String pendingId, CustomerInfo info, String houseId) throws Exception {
        boolean result = false;
        if (validCustomerExists(info)) {
            if (StringUtils.isNotEmpty(houseId)) {
                result = service.addCustomerWithHouse(info, houseId, getCurrentUser());
            } else {
                throw new ParameterErrorException("houseId", "房屋ID", "房屋ID不能为空");
            }
            //更改审批状态
            if (result) {
                service.saveAprrovePendingCustomer(pendingId, info.getBasic().getId(), 2, getCurrentUser());
            }
        }
        return ServiceResult.succeed(info.getBasic().getId());
    }


    /**
     * 新增客户基本信息
     * 对外接口
     *
     * @param certificateId   证件号码
     * @param houseCode       房屋编码
     * @param certificateType 证件类型
     * @param name            客户名称
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customer/app", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addCustomerForApp(String certificateId, String houseCode,
                                           Integer certificateType, String name, String mainMobile, Integer[] relations) throws Exception {

        if (StringUtils.isEmpty(certificateId)) {
            throw new BadRequestException("证件id为空");
        }
        if (certificateType == null) {
            throw new BadRequestException("证件id为空");
        }
        if (StringUtils.isEmpty(name)) {
            throw new BadRequestException("姓名为空");
        }
        if (service.isExists(certificateType, certificateId)) {
            throw new NotModifyiedException("当前客户已经存在");
        }
        if (relations == null) {
            throw new BadRequestException("客房关系为空");
        }
        List<Integer> relation = new ArrayList<Integer>();
        for (Integer integer : relations) {
            relation.add(integer);
        }
        //通过房屋编码获取房屋id，不存在抛出
        String houseId = service.queryHouseId(houseCode);
        if (houseId == null) {
            throw new BadRequestException("该房屋不存在");
        }

        //判断身份证格式
        if (certificateType == 1) {
            if (!IDCardUtil.isIdCardNo(certificateId)) {
                throw new BadRequestException("身份证格式错误！");
            }
            if (certificateId.length() == 15) {
                certificateId = IDCardUtil.from15to18(certificateId);
            }
        }
        //创建者暂留
        User user = new User();
        user.setId(null);
        user.setName(null);
        boolean result = service.addCustomerForApp(certificateId, houseId, certificateType, name, relation, user);
        return ServiceResult.succeed(result);
    }

    /**
     * 查询客户信息（对外）
     *
     * @param customerName
     * @param certificateType
     * @param certificateId
     * @param mobileNumber
     * @param houseName
     * @param curPage
     * @param pageSize
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customers/app", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCustomerForApp(String customerName, Integer certificateType,
                                             String certificateId, String mobileNumber, String houseName, int curPage, int pageSize) throws Exception {
        if (pageSize > MAX_SIZE_PER_PAGE) {
            throw new ParameterErrorException("pageSize", "每页数据量", "每页数据量不能超过" + MAX_SIZE_PER_PAGE + "条数据");
        }
        Page pager = new Page();
        pager.setPage(curPage);
        pager.setPageSize(pageSize);
        List<CustomerSearchResult> list = service.queryCustomerForApp(pager, customerName, houseName, certificateType, certificateId, mobileNumber);
        ListResult<CustomerSearchResult> listResult = new ListResult<CustomerSearchResult>(pager, list);
        if (listResult == list) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(listResult);
    }

    /**
     * 逻辑删除客户与房屋的一个关系
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customer/houseRelation/unbindByType", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult queryCustomerForApp(String customerId, String houseId, String[] relationType) throws Exception {
        if (StringUtils.isEmpty(customerId) || StringUtils.isEmpty(houseId) || relationType == null || relationType.length == 0) {
            throw new ParameterErrorException("customerId,houseId,relationType", "客户ID，房屋ID，关系CODE", "客户ID，房屋ID，关系CODE不能为空!");
        }
        return ServiceResult.succeed(service.changeHouseRelation(customerId, houseId, relationType, getCurrentUser()));
    }

    /**
     * 通过搜索框查询客户的姓名、电话、证件号码
     * (用于车位搜索客户)
     *
     * @param name    客户姓名
     * @param phone   电话号码
     * @param cardNum 证件号码
     * @return
     */
    @RequestMapping(value = "/customer/queryCustomer4Carport/{curPage}/{pageSize}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCustomer4Carport(@PathVariable(value = "curPage") Integer curPage, @PathVariable(value = "pageSize") Integer pageSize,
                                               String name, String phone, String cardNum) throws Exception {
        if (StringUtils.isEmpty(name + phone + cardNum)) {
            throw new BadRequestException("查询条件为空.");
        }
        Page page = new Page();
        page.setPageSize(pageSize);
        page.setPage(curPage);
        return ServiceResult.succeed(new ListResult<CustomerInfo4Search>(page, service.queryCustomer4Carport(name, phone, cardNum, page)));
    }

    /**
     * 车位历史客户(isdeleted=1)
     *
     * @return 客户信息
     */
    @RequestMapping(value = "/customer/carport/history", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryHistoryCustomer4Carport(String carportId) throws Exception {
        if (StringUtils.isEmpty(carportId)) {
            throw new ParameterErrorException("carportId", "车位ID", "车位ID不能为空");
        }
        return ServiceResult.succeed(service.queryCustomerByCarport(carportId, 1));
    }


    /**
     * 车位现有客户(isdeleted=0)
     *
     * @return 客户信息
     */
    @RequestMapping(value = "/customer/carport/existing", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCustomer4Carport(String carportId) throws Exception {
        if (StringUtils.isEmpty(carportId)) {
            throw new ParameterErrorException("carportId", "车位ID", "车位ID不能为空");
        }
        return ServiceResult.succeed(service.queryCustomerByCarport(carportId, 0));
    }

    /**
     * 更新临时表审批状态，并设置正式表客户ID，用于客户审批
     *
     * @param customerId
     * @param crmCustomerId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customer/approveStatus", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult customerApproveStatus(String customerId, String crmCustomerId) throws Exception {
        if (StringUtils.isEmpty(customerId) && StringUtils.isEmpty(crmCustomerId)) {
            throw new ParameterErrorException("customerId,crmCustomerId", "临时表客户ID，正式表生成的ID", "临时表客户ID或正式表生成的ID不能为空!");
        }
        return ServiceResult.succeed(service.updateApproveStatus(customerId, crmCustomerId));
    }

    // add by liaochao 20160121 begin

    /**
     * 根据业主ID，获取与业主有关系的其他客户
     *
     * @param ownerId 业主客户ID
     * @return
     */
    @RequestMapping(value = "/customer/{ownerId}/relations", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryOwnerCustomerRelations(@PathVariable("ownerId") String ownerId) throws Exception {
        List<CustomerRelation> list = service.queryCustomerRelations(ownerId);
        if (list == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(list);
    }

    // add by liaochao 20160121 end

}
