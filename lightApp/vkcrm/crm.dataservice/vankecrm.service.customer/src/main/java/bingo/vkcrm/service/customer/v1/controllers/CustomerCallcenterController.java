package bingo.vkcrm.service.customer.v1.controllers;

import bingo.common.core.utils.StringUtils;
import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.customer.v1.Version;
import bingo.vkcrm.service.customer.v1.models.*;
import bingo.vkcrm.service.customer.v1.services.CustomerCallcenterService;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.exceptions.NotFoundException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * 提供呼叫中心查询客户信息
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class CustomerCallcenterController extends BaseController {

    @Autowired
    CustomerCallcenterService service;
    private static final Log log = LogFactory.getLog(CustomerController.class);

    /**
     * 通过来电号码获取客户列表（主表+临时表）
     *
     * @param callNumber 来电号码
     * @param curPage    当前页码
     * @param pageSize   每页数据条数
     * @return
     */
    @RequestMapping(value = "/{callNumber}/customers", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getCustomerList(@PathVariable(value = "callNumber") String callNumber,
                                         int curPage, int pageSize) throws Exception {
        // 来电号码不能为空，为空时抛出异常
        if (StringUtils.isEmpty(callNumber)) {
            throw new BadRequestException("来电号码为空.");
        }
        // 设置分页数据
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        // 查询客户列表，返回CustomerList对象的list
        List<CallerCustomer> list = service.queryCustomersFromCache(callNumber);
        page.setTotalRows(list.size());
        return ServiceResult.succeed(new ListResult<CallerCustomer>(page, list.subList(page.getRowStart(), page.getRowEnd())));
    }


    /**
     * 通过来电号码获取客户列表详细信息（主表+临时表）
     *
     * @param callNumber 来电号码
     * @param curPage    当前页码
     * @param pageSize   每页数据条数
     * @return
     */
    @RequestMapping(value = "/{callNumber}/customers/details", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getCustomerListDetails(@PathVariable(value = "callNumber") String callNumber,
                                         Integer curPage, Integer pageSize) throws Exception {
        // 来电号码不能为空，为空时抛出异常
        if (StringUtils.isEmpty(callNumber)) {
            throw new BadRequestException("来电号码为空.");
        }
        // 设置分页数据
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        // 查询客户列表，返回CustomerList对象的list
        return ServiceResult.succeed(new ListResult<CallerCustomerDetail>(page, service.queryCustomersDetails(callNumber,page)));
    }


    /**
     * 修改/添加客户包括兴趣爱好和特殊身份
     *
     * @param customerBasicPending
     * @return
     */
    @RequestMapping(value = "/callcenter/customer/update", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateCustomer(CustomerBasicPending customerBasicPending) throws Exception {
        //客户与房屋关系数组
        String[] relationTypes = customerBasicPending.getHcRelationTypes();
        if (customerBasicPending.getSex() == null) {
            customerBasicPending.setSex(3);
        }
        //如果前台新增客户没有选择性别，则给个默认性别“3”，代表未知。（字典表中有该选项）
        //房屋id
        String houseId = customerBasicPending.getHouseId();
        //customerBasicPending.getCrmCustomerId()
        List<String> relationType = new ArrayList<String>();
        //与房屋关系数组不为空时转换为list数组
        if (relationTypes != null) {
            for (int i = 0; i < relationTypes.length; i++) {
                if (StringUtils.isNotEmpty(relationTypes[i])) {
                    relationType.add(relationTypes[i]);
                }
            }
        }
        String customerId = service.updateCustomer(customerBasicPending, getCurrentUser(), houseId, relationType);
        return ServiceResult.succeed(customerId);
    }

    /**
     * 修改/添加客户包括兴趣爱好和特殊身份
     * 对外接口
     *
     * @param customerBasicPending
     * @return
     */
    @RequestMapping(value = "/callcenter/customer/change", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateCustomerForOut(CustomerBasicPending customerBasicPending) throws Exception {
        //客户与房屋关系数组
        String[] relationTypes = customerBasicPending.getHcRelationTypes();
        //房屋id
        String houseCode = customerBasicPending.getHouseId();
        String customerCode = customerBasicPending.getId();
        String customerId = service.getCustomerId(customerCode);
        String houseId = service.getHouseId(houseCode);
        if (StringUtils.isEmpty(houseId)) {
            throw new BadRequestException("找不到该房屋.");
        }
        List<String> relationType = new ArrayList<String>();
        //与房屋关系数组不为空时转换为list数组
        if (relationTypes != null) {
            for (int i = 0; i < relationTypes.length; i++) {
                if (StringUtils.isNotEmpty(relationTypes[i])) {
                    relationType.add(relationTypes[i]);
                }
            }
        } else {
            throw new BadRequestException("房客关系类型为空.");
        }
        customerBasicPending.setId(customerId);
        String result = service.updateCustomer(customerBasicPending, getCurrentUser(), houseId, relationType);
        if (StringUtils.isEmpty(result)) {
            return ServiceResult.error("error");
        }
        return ServiceResult.succeed(null);
    }


    /**
     * 修改/添加客户包括兴趣爱好和特殊身份
     *
     * @param name        客户姓名
     * @param phone       电话号码
     * @param projectCode 项目code
     * @return
     */
    @RequestMapping(value = "/callcenter/customer/exist", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult updateCustomerExist(String name, String projectCode, String phone) throws Exception {
        return ServiceResult.succeed(service.existApprovedPendingCustomer(name, projectCode, phone));

    }


    /**
     * 获取客户详细信息
     * @param customerId
     * @param type 1、临时客户  2、正式客户
     * @return 客户信息（id，性别，姓名，特殊身份，兴趣爱好）
     */
    @RequestMapping(value = "/callcenter/customer/info", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getCallCustomerInfo(String customerId,Integer type){
        if(type==null){
            return ServiceResult.error("请传入客户类型！");
        }
        if(type==1){
            //代表该客户是临时客户，拿到临时客户信息传给前端
            return ServiceResult.succeed(service.queryTempCustomerInfo(customerId));
        }else if(type==2){
            return ServiceResult.succeed(service.queryMainCustomerInfo(customerId));
        }
        return ServiceResult.error("请传入正确的客户类型！");
    }

}
