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
import bingo.vkcrm.service.report.v1.model.CarInfo;
import bingo.vkcrm.service.report.v1.services.CallCenterReportService;

@Controller
@RequestMapping(value = Version.API_PATH)
public class CarInfoController  extends BaseController{
    @Autowired
    CallCenterReportService service;
    @RequestMapping(value = "/carInfoReport",method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getTaskReport(CarInfo carInfo){
    	carInfo.setSysUserId(getCurrentUser().getId());
        Page page=null;
        if(carInfo.getCurPage()!=null&&carInfo.getPageSize()!=null){
            page=new Page();
            page.setPage(Integer.parseInt(carInfo.getCurPage()));
            page.setPageSize(Integer.parseInt(carInfo.getPageSize()));
        }
        ListResult<CarInfo> result=new ListResult<CarInfo>(page,service.getCarInfoReport(carInfo,page));
    	 return ServiceResult.succeed(result);
    }
    
    @RequestMapping(value = "/carInfoReport/export",method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView exportTaskReport(CarInfo carInfo,HttpServletResponse response){
        // 车牌号、购置时间、车辆品牌、车辆颜色、管理中心、项目、网格、楼栋、房屋、单元、房屋状态、客户姓名、主用手机、证件类型、证件号码；
        ExportParameters parameters = new ExportParameters();
        // 设置需要导出的列ID
        parameters.setColumnsId(new String[]{"licenseNumber", "buyTime","branText", "colorText","mcName", "projectText","gridName", "buildingName","huoseName", "unit","statusText","fullName","mainMobile","certificateText","certificateId"});
        // 设置对应的列标题
        parameters.setColumnsHeader(new String[]{"车牌号", "购置时间", "车辆品牌", "车辆颜色", "管理中心","项目", "网格", "楼栋", "房屋", "单元","房屋状态", "客户姓名", "主用手机", "证件类型", "证件号码"});
        // 设置对应列的数据类型
        parameters.setColumnsType(new String[]{"String", "String","String","String","String","String","String","String","String","String","String","String","String","String","String"});
        parameters.setColumnsAlign(new String[]{"left","left","left","left","left","left","left","left","left","left","left","left","left","left","left"});
        // 设置dao名称
        parameters.setDaoName("centerRoDao");
        // 设置排序列
        //parameters.setOrderBy("created asc");

        // 设置查询数据的sql
        parameters.setSqlId("sql.query.carInfoReport");
        // 设置查询数据总数的sql
        parameters.setSqlCountId("sql.query.carInfoReport.count");
        
        Map<String,Object> params=new HashMap<String, Object>();
        //管理中心、项目、网格、楼栋、房屋、客户姓名、主用手机、房屋状态（全部、常住、空置、出租、度假）、证件类型、证件号码、车牌号；
        params.put("sysUserId",getCurrentUser().getId());//传入用户ID，去查当前用户拥有的项目权限
        if(StringUtils.isNotEmpty(carInfo.getMcId())){
        	params.put("mcId",carInfo.getMcId());
        }
		if(StringUtils.isNotEmpty(carInfo.getRegisterTimeStar())){
            params.put("registerTimeStar",carInfo.getRegisterTimeStar());
        }
		if(StringUtils.isNotEmpty(carInfo.getRegisterTimeEnd())){
            params.put("registerTimeEnd",carInfo.getRegisterTimeEnd());
        }
        if(StringUtils.isNotEmpty(carInfo.getMcId())){
            params.put("mcId",carInfo.getMcId());
        }
        if(StringUtils.isNotEmpty(carInfo.getProjectId())){
            params.put("projectId",carInfo.getProjectId());
        }
        if(StringUtils.isNotEmpty(carInfo.getGridId())){
            params.put("gridId",carInfo.getGridId());
        }
        if(StringUtils.isNotEmpty(carInfo.getBuildingCode())){
            params.put("buildingCode",carInfo.getBuildingCode());
        }
        if(StringUtils.isNotEmpty(carInfo.getHouseId())){
            params.put("houseId",carInfo.getHouseId());
        }
        if(StringUtils.isNotEmpty(carInfo.getStatus())){
            params.put("status",carInfo.getStatus());
        }
        if(StringUtils.isNotEmpty(carInfo.getFullName())){
            params.put("fullName",carInfo.getFullName());
        }
        if(StringUtils.isNotEmpty(carInfo.getMainMobile())){
            params.put("mainMobile",carInfo.getMainMobile());
        }
        if(StringUtils.isNotEmpty(carInfo.getCertificateType())){
            params.put("certificateType",carInfo.getCertificateType());
        }
        if(StringUtils.isNotEmpty(carInfo.getCertificateId())){
            params.put("certificateId",carInfo.getCertificateId());
        }
        if(StringUtils.isNotEmpty(carInfo.getLicenseNumber())){
            params.put("licenseNumber",carInfo.getLicenseNumber());
        }
        parameters.setParameters(params);
        // 调用导出方法
        Exporter.getInstance().export("任务报表"+ new SimpleDateFormat("yyyyMMdd").format(new Date())+".xlsx", parameters, response);
        return new ModelAndView();
    }  
}
