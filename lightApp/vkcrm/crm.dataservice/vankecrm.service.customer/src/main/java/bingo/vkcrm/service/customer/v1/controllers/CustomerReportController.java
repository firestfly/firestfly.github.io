package bingo.vkcrm.service.customer.v1.controllers;

import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.customer.v1.models.independent.CustomerSearchResult;
import bingo.vkcrm.service.customer.v1.models.report.*;
import bingo.vkcrm.service.customer.v1.services.CustomerReportService;
import bingo.vkcrm.service.exceptions.EmptyParameterException;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 客户信息相关报表控制器
 * @author chengsiyuan
 *
 */
@RequestMapping(value = "api/v1")
@Controller
public class CustomerReportController extends BaseController {

    private static final Log log = LogFactory.getLog(CustomerReportController.class);

    @Autowired
    CustomerReportService service;
    
    /**
     * 获取客户车辆信息报表
     * @param carReportCondition
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customer/report/cars", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCarsReport(CarReportCondition carReportCondition) throws Exception {
    	if(carReportCondition.getPageSize() == null || carReportCondition.getCurPage() == null){
    		throw new EmptyParameterException("pageSize/curpage", "分页信息错误");
    	}
    	Page pager = new Page();
        pager.setPage(carReportCondition.getCurPage());
        pager.setPageSize(carReportCondition.getPageSize());
    	List<CarReport> carReportList = null;
    	carReportList = service.queryCarsReport(carReportCondition,pager);
    	 ListResult<CarReport> listResult = new ListResult<CarReport>(pager, carReportList);
        return ServiceResult.succeed(listResult);
    }
    
    /**
     * 获取客户宠物信息报表
     * @param petsReportCondition
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customer/report/pets", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryPetsReport(PetsReportCondition petsReportCondition) throws Exception {
    	if(petsReportCondition.getPageSize() == null || petsReportCondition.getCurPage() == null){
    		throw new EmptyParameterException("pageSize/curpage", "分页信息错误");
    	}
    	Page pager = new Page();
        pager.setPage(petsReportCondition.getCurPage());
        pager.setPageSize(petsReportCondition.getPageSize());
    	List<PetsReport> PetsReportList = null;
    	PetsReportList = service.queryPetsReport(petsReportCondition,pager);
   	 	ListResult<PetsReport> listResult = new ListResult<PetsReport>(pager, PetsReportList);
        return ServiceResult.succeed(listResult);
    }
    
    /**
     * 获取客户信息报表
     * @param customerReportCondition
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customer/report/cus", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCusReport(CustomerReportCondition customerReportCondition) throws Exception {
    	if(customerReportCondition.getPageSize() == null || customerReportCondition.getCurPage() == null){
    		throw new EmptyParameterException("pageSize/curpage", "分页信息错误");
    	}
    	Page pager = new Page();
        pager.setPage(customerReportCondition.getCurPage());
        pager.setPageSize(customerReportCondition.getPageSize());
    	List<CustomerReport> customerReportList = null;
    	Date now = new Date();
    	if(customerReportCondition.getAgeTypeBegin() != null){
    		Calendar c = Calendar.getInstance();  
            c.setTime(now);  
            c.add(Calendar.YEAR, -customerReportCondition.getAgeTypeBegin());
            customerReportCondition.setBirthdayTo(c.getTime());
    	}
    	if(customerReportCondition.getAgeTypeEnd() != null){
    		Calendar c = Calendar.getInstance();  
            c.setTime(now);  
            c.add(Calendar.YEAR, -customerReportCondition.getAgeTypeEnd());
            customerReportCondition.setBirthdayForm(c.getTime());
    	}
    	customerReportList = service.queryCusReport(customerReportCondition,pager);
   	 	ListResult<CustomerReport> listResult = new ListResult<CustomerReport>(pager, customerReportList);
        return ServiceResult.succeed(listResult);
    }

   
}