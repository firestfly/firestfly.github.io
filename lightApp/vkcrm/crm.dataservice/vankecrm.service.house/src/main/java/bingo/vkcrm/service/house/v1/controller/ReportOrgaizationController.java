package bingo.vkcrm.service.house.v1.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.house.v1.models.OrganizationList;
import bingo.vkcrm.service.house.v1.services.ReportOrgaizationService;

/**
 * 报表中心获取项目、网格、管理中心
 * 联动查询
 * @author chengsiyuan
 *
 */
@Controller
@RequestMapping("api/v1")
public class ReportOrgaizationController extends BaseController{
	@Autowired
	ReportOrgaizationService service;
	private static final Log log = LogFactory.getLog(ReportOrgaizationController.class);

		/**
		 * 通过管理中心id（数组）获取项目
		 * @param organizationIds
		 * @return
		 */
	 	@RequestMapping(value = "/project/get",method = RequestMethod.GET)
		@ResponseBody
	    public ServiceResult getProjects(String organizationId){
		 List<OrganizationList> list = new ArrayList<OrganizationList>();
		 try {
			 list = service.getProjects(organizationId);
			 return ServiceResult.succeed(list);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}
	 }
	 	/**
	 	 * 获取全部管理中心
	 	 * @return
	 	 */
	 	@RequestMapping(value = "/organization/get",method = RequestMethod.GET)
		@ResponseBody
	    public ServiceResult getOrganizations(){
		 List<OrganizationList> list = new ArrayList<OrganizationList>();
		 try {
			 list = service.getOrganizations();
			 return ServiceResult.succeed(list);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}
	 }
	 	/**
	 	 * 通过项目id（数组）获取网格
	 	 * @param projects
	 	 * @return
	 	 */
	 	@RequestMapping(value = "/gird/get",method = RequestMethod.GET)
		@ResponseBody
	    public ServiceResult getGirds(String projectId){
		 List<OrganizationList> list = new ArrayList<OrganizationList>();
		 try {
			 list = service.getGirds(projectId);
			 return ServiceResult.succeed(list);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}
	 }
}
