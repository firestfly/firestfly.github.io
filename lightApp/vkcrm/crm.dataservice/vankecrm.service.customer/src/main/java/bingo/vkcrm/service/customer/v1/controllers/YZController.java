package bingo.vkcrm.service.customer.v1.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.dao.Page;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.common.utils.RequestUtils;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.customer.v1.Version;
import bingo.vkcrm.service.customer.v1.models.CarportCustomer;
import bingo.vkcrm.service.customer.v1.models.Customer;
import bingo.vkcrm.service.customer.v1.models.CustomerHouse;
import bingo.vkcrm.service.customer.v1.models.YZParam;
import bingo.vkcrm.service.customer.v1.services.CustomerService;
import bingo.vkcrm.service.exceptions.NotFoundException;

/**
 * Created by szsonic on 2016/3/11/011.
 * （营帐用相关接口）
 */
@RequestMapping(value = Version.API_PATH)
@Controller
public class YZController extends BaseController {
	private static final Log log = LogFactory.getLog(HobbyController.class);
	 @Autowired
	 CustomerService customerService;
	 
	/**
	 * @Description: 分页获取客房关系
	 * @param: curPage当前页
	 * @param: pageSize 当前页行数
	 * @param HttpServletRequest 对象
	 * @throws:Exception
	 * @Author: luoml01
	 * @date: 2016年3月14日 下午6:37:47
	 * @return:ServiceResult 字符串
     * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
    @RequestMapping(value = "/yz/houseRelation/{curPage}/{pageSize}", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult getCustomerHouseRelation(@PathVariable(value = "curPage")Integer curPage,
                                                  @PathVariable(value = "pageSize")Integer pageSize,
                                                  HttpServletRequest request)throws Exception{
    	String parameters = RequestUtils.getStrParam(request);
    	Page pager = new Page();
        pager.setPage(curPage);
        pager.setPageSize(pageSize);
        YZParam yzParam = new YZParam();
        yzParam.setTimestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        if (StringUtils.isNotEmpty(parameters)) {
        	yzParam = JsonUtil.fromJson(parameters, YZParam.class);
        }
        List<CustomerHouse> list = customerService.getCustomerHousePage(pager,yzParam);
        ListResult<CustomerHouse> listResult = new ListResult<CustomerHouse>(pager, list);
        if (listResult == list) {
            throw new NotFoundException("查询结果为空.");
        }
        listResult.getPagination().setTimestamp(yzParam.getTimestamp());
        return ServiceResult.succeed(listResult);
    }

    /**
	 * @Description: 分页获取客车关系
	 * @param: curPage当前页
	 * @param pageSize当前页行数
	 * @param HttpServletRequest 对象
	 * @throws:Exception
	 * @Author: luoml01
	 * @date: 2016年3月14日 下午6:37:47
	 * @return:ServiceResult 字符串
     * @exception:TODO
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
    @RequestMapping(value = "/yz/carportRelation/{curPage}/{pageSize}", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult getCustomerCarportRelation(@PathVariable(value = "curPage")Integer curPage,
                                                    @PathVariable(value = "pageSize")Integer pageSize,
                                                    HttpServletRequest request)throws Exception{
    	String parameters = RequestUtils.getStrParam(request);
    	Page pager = new Page();
        pager.setPage(curPage);
        pager.setPageSize(pageSize);
        YZParam yzParam = new YZParam();
        yzParam.setTimestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        if (StringUtils.isNotEmpty(parameters)) {
        	yzParam = JsonUtil.fromJson(parameters, YZParam.class);
        }
        List<CarportCustomer> list = customerService.getCustomerCarportPage(pager,yzParam);
        ListResult<CarportCustomer> listResult = new ListResult<CarportCustomer>(pager, list);
        if (listResult == list) {
            throw new NotFoundException("查询结果为空.");
        }
        listResult.getPagination().setTimestamp(yzParam.getTimestamp());
        return ServiceResult.succeed(listResult);
    }

    /**
	 * @Description: 分页查询客户信息
	 * @param: curPage当前页
	 * @param pageSize当前页行数
	 * @param HttpServletRequest 对象
	 * @throws:Exception
	 * @Author: luoml01
	 * @date: 2016年3月14日 下午6:37:47
	 * @return:ServiceResult 字符串
     * @exception:TODO
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
    @RequestMapping(value = "/yz/customer/{curPage}/{pageSize}", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult getCustomer(@PathVariable(value = "curPage")Integer curPage,
                                     @PathVariable(value = "pageSize")Integer pageSize,
                                     HttpServletRequest request)throws Exception{
    	String parameters = RequestUtils.getStrParam(request);
        Page pager = new Page();
        pager.setPage(curPage);
        pager.setPageSize(pageSize);
        YZParam yzParam = new YZParam();
        yzParam.setTimestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        if (StringUtils.isNotEmpty(parameters)) {
        	yzParam = JsonUtil.fromJson(parameters, YZParam.class);
        }
        List<Customer> list = customerService.getCustomerPage(pager, yzParam);
        ListResult<Customer> listResult = new ListResult<Customer>(pager, list);
        if (listResult == list) {
            throw new NotFoundException("查询结果为空.");
        }
    	listResult.getPagination().setTimestamp(yzParam.getTimestamp());
        return ServiceResult.succeed(listResult);
    }
}
