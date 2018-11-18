package bingo.vkcrm.service.report.v1.controllers;

import java.text.SimpleDateFormat;
import java.util.*;

import bingo.vkcrm.component.excel.ExportParameters;
import bingo.vkcrm.component.excel.Exporter;
import bingo.vkcrm.service.model.DictionaryItem;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.report.v1.model.CustomerModifyReport;
import bingo.vkcrm.service.report.v1.model.RelationChangereport;
import bingo.vkcrm.service.report.v1.services.ModifyReportService;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;


@Controller
@RequestMapping("api/v1")
public class ModifyReportController extends BaseController{
	@Autowired
	ModifyReportService service;
    private static final Log log = LogFactory.getLog(ModifyReportController.class);

    /**
     * 客户信息改变记录
     * @param projectId 项目id
     * @param gridId 网格id
     * @param organizationId 管理中心id
     * @param modifyField 修改字段
     * @param userName 用户名
     * @param modifyDateBegin 修改时间区间开始
     * @param modifyDateEnd 修改时间区间结束
     * @param curPage 页号
     * @param pageSize 每页条数
     * @return
     */
    @RequestMapping(value = "/customerModifyReport/get",method = RequestMethod.GET)
	@ResponseBody
    public ServiceResult getCustomerModifyReport(String projectId,String gridId,String organizationId,String modifyField,
    											String userName,String modifyDateBegin,String modifyDateEnd,String customerName,int curPage,int pageSize){
    	Date begin = null;
		Date end = null;
		List<CustomerModifyReport> list =null;
    	try {
    		//String转Date类型
    		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			if (StringUtils.isNotEmpty(modifyDateBegin)) {
				begin = format.parse(modifyDateBegin);
			}
			if (StringUtils.isNotEmpty(modifyDateEnd)) {
				end = format.parse(modifyDateEnd);
			}
			//分页信息
			Page page = new Page();
		    page.setPage(curPage);
		    page.setPageSize(pageSize);
		    list = service.getCustomerModifyReport(projectId, gridId, organizationId, modifyField, userName, begin, end,customerName, page);
		    ListResult<CustomerModifyReport> listResult = new ListResult<CustomerModifyReport>(page, list);
			return ServiceResult.succeed(listResult);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}
	}


	/**
	 * 客户信息改变记录报表导出
	 * @param projectId
	 * @param gridId
	 * @param organizationId
	 * @param modifyField
	 * @param userName
	 * @param modifyDateBegin
	 * @param modifyDateEnd
     * @param response
     * @return
     */
	@RequestMapping(value = "/customerModifyReport/export",method = RequestMethod.GET)
	@ResponseBody
	public ModelAndView exportCustomerModifyReport(String projectId,String gridId,String organizationId,String modifyField,
												   String userName,String modifyDateBegin,String modifyDateEnd, HttpServletResponse response){

		ExportParameters parameters = new ExportParameters();
		// 设置需要导出的列ID
		parameters.setColumnsId(new String[]{"customerName","modifyField", "beforeModift","afterModift", "modifier","modifierGrid","modifierProject", "modifiermanCenter","modifyTime"});
		// 设置对应的列标题
		parameters.setColumnsHeader(new String[]{"客户名称","修改字段名称","修改前数据","修改后数据",  "修改人", "修改人所在网格","修改人所在项目","修改人所在管理中心", "修改时间",});
		// 设置对应列的数据类型
		parameters.setColumnsType(new String[]{"String", "String","String","String","String","String","String","String","String"});
		parameters.setColumnsAlign(new String[]{"left","left","left","left","left","left","left","left","left"});
		// 设置dao名称
		parameters.setDaoName("logRoDao");
		// 设置排序列
		parameters.setOrderBy("createDate desc");

		// 设置查询数据的sql
		parameters.setSqlId("sql-customerModifyReport");
		// 设置查询数据总数的sql
		parameters.setSqlCountId("sql-customerModifyReport-count");

		Map<String,Object> params=new HashMap<String, Object>();
		if(StringUtils.isNotEmpty(projectId)){
			params.put("projectId",projectId);
		}
		if(StringUtils.isNotEmpty(organizationId)){
			params.put("organizationId",organizationId);
		}

		if(StringUtils.isNotEmpty(modifyField)){
			params.put("modifyField",modifyField);
		}

		if(StringUtils.isNotEmpty(userName)){
			params.put("userName",userName);
		}

		if(StringUtils.isNotEmpty(modifyDateBegin)){
			params.put("modifyDateBegin",modifyDateBegin);
		}

		if(StringUtils.isNotEmpty(modifyDateEnd)){
			params.put("modifyDateEnd",modifyDateEnd);
		}
		parameters.setParameters(params);
		// 调用导出方法
		Exporter.getInstance().export("客户修改记录报表"+ new SimpleDateFormat("yyyyMMdd").format(new Date())+".xlsx", parameters, response);


		return new ModelAndView();
	}


    
    /**
     * 客房关系修改记录
     * @param projectId 项目id
     * @param gridId 网格id
     * @param organizationId 管理中心id
     * @param changeType 修改内容
     * @param userName 用户名
     * @param modifyDateBegin 修改时间段开始
     * @param modifyDateEnd 修改时间段结束
     * @param curPage 页码
     * @param pageSize 每页条数
     * @return
     */
    @RequestMapping(value = "/relationChangeReport/get",method = RequestMethod.GET)
	@ResponseBody
    public ServiceResult getRelationChangeReport(String projectId,String gridId,String organizationId,String changeType,
    											String userName,String modifyDateBegin,String modifyDateEnd,int curPage,int pageSize){
    	List<RelationChangereport> list = new ArrayList<RelationChangereport>();
    	Date begin = null;
		Date end = null;
    	try {
    		//String转Date
    		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			if (StringUtils.isNotEmpty(modifyDateBegin)) {
				begin = format.parse(modifyDateBegin);
			}
			if (StringUtils.isNotEmpty(modifyDateEnd)) {
				end = format.parse(modifyDateEnd);
			}
			//设置分页信息
    		Page page = new Page();
		    page.setPage(curPage);
		    page.setPageSize(pageSize);
    		list = service.getRelationChangeReport(projectId, gridId, organizationId, changeType, userName, begin, end, page);
    		ListResult<RelationChangereport> listResult = new ListResult<RelationChangereport>(page, list);
    		return ServiceResult.succeed(listResult);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}
    }


	/**
	 * 客房关系修改记录报表导出
	 * @param projectId
	 * @param gridId
	 * @param organizationId
	 * @param userName
	 * @param modifyDateBegin
	 * @param modifyDateEnd
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/relationChangeReport/export",method = RequestMethod.GET)
	@ResponseBody
	public ModelAndView exportRelationChangeReport(String projectId,String gridId,String organizationId,String changeType,
												   String userName,String modifyDateBegin,String modifyDateEnd, HttpServletResponse response){


		ExportParameters parameters = new ExportParameters();
		// 设置需要导出的列ID
		parameters.setColumnsId(new String[]{ "houseName","houseId", "customerName","customerId","relationText","userName","gridName","projectName", "organizationName","createDate","changeType"});
		// 设置对应的列标题
		parameters.setColumnsHeader(new String[]{"所属房屋", "房屋编码", "客户名称", "客户编码","客房关系","修改人","修改人所在网格","修改人所在项目","修改人所在管理中心","修改时间", "操作类型"});
		// 设置对应列的数据类型
		parameters.setColumnsType(new String[]{"String", "String","String","String","String","String","String","String","String","String","String"});
		parameters.setColumnsAlign(new String[]{"left","left","left","left","left","left","left","left","left","left","left"});
		// 设置dao名称
		parameters.setDaoName("logRoDao");
		// 设置排序列
		parameters.setOrderBy("createDate desc");

		// 设置查询数据的sql
		parameters.setSqlId("sql-relationChangeReport");
		// 设置查询数据总数的sql
		parameters.setSqlCountId("sql-relationChangeReport-count");

		Map<String,Object> params=new HashMap<String, Object>();
		if(StringUtils.isNotEmpty(projectId)){
			params.put("projectId",projectId);
		}
		if(StringUtils.isNotEmpty(organizationId)){
			params.put("organizationId",organizationId);
		}

		if(StringUtils.isNotEmpty(gridId)){
			params.put("gridId",gridId);
		}

		if(StringUtils.isNotEmpty(userName)){
			params.put("userName",userName);
		}

		if(StringUtils.isNotEmpty(modifyDateBegin)){
			params.put("modifyDateBegin",modifyDateBegin);
		}

		if(StringUtils.isNotEmpty(modifyDateEnd)){
			params.put("modifyDateEnd",modifyDateEnd);
		}
		if(StringUtils.isNotEmpty(changeType)){
			params.put("changeType",changeType);
		}
		parameters.setParameters(params);
		// 调用导出方法
		Exporter.getInstance().export("客房关系修改记录报表"+ new SimpleDateFormat("yyyyMMdd").format(new Date())+".xlsx", parameters, response);


		return new ModelAndView();
	}

	/**
	 * 客户信息改变记录
	 * @return
	 */
	@RequestMapping(value = "/modifyitems",method = RequestMethod.GET)
	@ResponseBody
	public ServiceResult getModifyItems(){
		Date begin = null;
		Date end = null;
		try {
			return ServiceResult.succeed(service.getModifyItem());
		} catch (Exception e) {
			e.printStackTrace();
			log.error(this, e);
			return ServiceResult.error(e);
		}
	}

}

