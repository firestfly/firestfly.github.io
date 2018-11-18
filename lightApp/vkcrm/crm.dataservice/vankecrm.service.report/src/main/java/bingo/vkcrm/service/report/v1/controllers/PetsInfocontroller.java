package bingo.vkcrm.service.report.v1.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import bingo.dao.Page;
import bingo.vkcrm.component.excel.ExportParameters;
import bingo.vkcrm.component.excel.Exporter;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.report.v1.Version;
import bingo.vkcrm.service.report.v1.model.PetsInfo;
import bingo.vkcrm.service.report.v1.services.CallCenterReportService;

@Controller
@RequestMapping(value = Version.API_PATH)
public class PetsInfocontroller extends BaseController{
    @Autowired
    CallCenterReportService service;
    @RequestMapping(value = "/petsInfoReport",method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getTaskReport(PetsInfo petInfo){
    	petInfo.setSysUserId(getCurrentUser().getId());
        Page page=null;
        if(petInfo.getCurPage()!=null&&petInfo.getPageSize()!=null){
            page=new Page();
            page.setPage(Integer.parseInt(petInfo.getCurPage()));
            page.setPageSize(Integer.parseInt(petInfo.getPageSize()));
        }
        ListResult<PetsInfo> result=new ListResult<PetsInfo>(page,service.getpetInfoReport(petInfo,page));
    	return ServiceResult.succeed(result);
    }
    
    @RequestMapping(value = "/petsInfoReport/export",method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView exportTaskReport(PetsInfo petsInfo,HttpServletResponse response){
    	//显示内容：宠物名称、品种、宠物性别、领养时间、描述、管理中心、项目、网格、单元、楼栋、房屋、房屋状态、客户姓名、主用手机、证件类型、证件号码；
        ExportParameters parameters = new ExportParameters();
        // 设置需要导出的列ID
        parameters.setColumnsId(new String[]{"name", "breed","sex", "adoptTime","description", "guanli","projectText", "gridName","unit", "buildingName","houseName","statusText","fullName","mainMobile","certificateText","certificateId"});
        // 设置对应的列标题
        parameters.setColumnsHeader(new String[]{"宠物名称", "品种", "宠物性别", "领养时间", "描述","管理中心", "项目", "网格", "单元", "楼栋","房屋", "房屋状态", "客户姓名", "主用手机", "证件类型", "证件号码"});
        // 设置对应列的数据类型
        parameters.setColumnsType(new String[]{"String", "String","String","String","String","String","String","String","String","String","String","String","String","String","String","String"});
        parameters.setColumnsAlign(new String[]{"left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left"});
        // 设置dao名称
        parameters.setDaoName("centerRoDao");
        // 设置排序列
        //parameters.setOrderBy("created asc");

        // 设置查询数据的sql
        parameters.setSqlId("sql.query.petsInfoReport");
        // 设置查询数据总数的sql
        parameters.setSqlCountId("sql.query.petsInfoReport.count");

        //管理中心、项目、网格、楼栋、房间、房屋状态（全部、常住、空置、出租、度假）、客户姓名、主用手机、证件类型、证件号码、领养时间段；
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("sysUserId",getCurrentUser().getId());//传入用户ID，去查当前用户拥有的项目权限
        if(StringUtils.isNotEmpty(petsInfo.getMcId())){
            params.put("mcId",petsInfo.getMcId());
        }
        // params.put("sysUserId","55D27C655372E5119F4E0050568D7315");
        if(StringUtils.isNotEmpty(petsInfo.getAdoptTimeStart())){
        	params.put("adoptTimeStart",petsInfo.getAdoptTimeStart());
        }
        if(StringUtils.isNotEmpty(petsInfo.getAdoptTimeEnd())){
        	params.put("aoptTimeEnd",petsInfo.getAdoptTimeEnd());
        }
        if(StringUtils.isNotEmpty(petsInfo.getMcId())){
        	params.put("mcId",petsInfo.getMcId());
        }
        if(StringUtils.isNotEmpty(petsInfo.getProjectId())){
        	params.put("projectId",petsInfo.getProjectId());
        }
        if(StringUtils.isNotEmpty(petsInfo.getGridId())){
        	params.put("gridId",petsInfo.getGridId());
        }
        if(StringUtils.isNotEmpty(petsInfo.getGridCode())){
        	params.put("gridCode",petsInfo.getGridCode());
        }
        if(StringUtils.isNotEmpty(petsInfo.getBuildingCode())){
        	params.put("buildingCode",petsInfo.getBuildingCode());
        }
        if(StringUtils.isNotEmpty(petsInfo.getHouseId())){
        	params.put("houseId",petsInfo.getHouseId());
        }
        if(StringUtils.isNotEmpty(petsInfo.getHouseCode())){
        	params.put("houseCode",petsInfo.getHouseCode());
        }
        if(StringUtils.isNotEmpty(petsInfo.getHouseStatus())){
        	params.put("houseStatus",petsInfo.getHouseStatus());
        }
        if(StringUtils.isNotEmpty(petsInfo.getFullName())){
        	params.put("fullName",petsInfo.getFullName());
        }
        if(StringUtils.isNotEmpty(petsInfo.getMainMobile())){
        	params.put("MainMobile",petsInfo.getMainMobile());
        }
        if(StringUtils.isNotEmpty(petsInfo.getCertificateType())){
        	params.put("certificateType",petsInfo.getCertificateType());
        }
        if(StringUtils.isNotEmpty(petsInfo.getCertificateId())){
        	params.put("CertificateId",petsInfo.getCertificateId());
        }
        parameters.setParameters(params);
        
        // 调用导出方法
        Exporter.getInstance().export("任务报表"+ new SimpleDateFormat("yyyyMMdd").format(new Date())+".xlsx", parameters, response);
        return new ModelAndView();
    }
}
