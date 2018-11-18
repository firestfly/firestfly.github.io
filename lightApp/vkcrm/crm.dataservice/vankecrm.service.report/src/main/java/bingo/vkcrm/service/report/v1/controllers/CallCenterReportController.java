package bingo.vkcrm.service.report.v1.controllers;

import bingo.dao.Page;
import bingo.vkcrm.component.excel.ExportParameters;
import bingo.vkcrm.component.excel.Exporter;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.report.v1.Version;
import bingo.vkcrm.service.report.v1.model.CallRecords;
import bingo.vkcrm.service.report.v1.model.TaskRecordReport;
import bingo.vkcrm.service.report.v1.services.CallCenterReportService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by szsonic on 2016/3/2/014.
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class CallCenterReportController extends BaseController{

    @Autowired
    CallCenterReportService service;

    /**查询条件
     * 管理中心、项目、网格、楼栋、房屋、城市、开始时间、结束时间（跨度一个月）、任务来源
     * @param mcId  管理中心ID
     * @param projectId 项目ID
     * @param gridId 网格ID
     * @param buildingCode 楼栋编码
     * @param houseId 房屋ID
     * @param cityCode 城市编码
     * @param start 开始时间
     * @param end  结束时间
     * @param source 任务来源
     * @param content 任务内容
     * @param curPage 当前页
     * @param pageSize 每页数量
     * @return
     */
    @RequestMapping(value = "/taskReport",method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getTaskReport(String mcId,String gridId,String buildingCode,String cityCode,String start, String end, String source,String content, String projectId, String houseId,Integer curPage,Integer pageSize){
        // mcId, gridId, buildingCode, cityCode, start,  end,  source, content,  projectId,  houseId
        Page page=null;
        if(curPage!=null&&pageSize!=null){
            page=new Page();
            page.setPage(curPage);
            page.setPageSize(pageSize);
        }

        ListResult<TaskRecordReport> result=new ListResult<TaskRecordReport>(page,service.getTaskReport(mcId, gridId, buildingCode, cityCode, start,  end,  source, content,  projectId,  houseId,page,getCurrentUser().getId()));
        return ServiceResult.succeed(result);
    }

    @RequestMapping(value = "/taskReport/export",method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView exportTaskReport(String mcId, String gridId, String buildingCode, String cityCode, String start, String end, String source, String content, String projectId, String houseId, HttpServletResponse response){
        // mcId, gridId, buildingCode, cityCode, start,  end,  source, content,  projectId,  houseId
        //创建时间、任务编号、任务来源、任务类型、任务状态、任务内容、城市、管理中心、项目、网格、楼栋、房屋、
        //是否超时、处理人、系统回访评价、人工回访评价、是否取消

        ExportParameters parameters = new ExportParameters();
        // 设置需要导出的列ID
        parameters.setColumnsId(new String[]{"created", "taskNo","source", "businessType","status", "content","city", "mcname","projectName", "gridName","buildName","houseName","isTimeout","staff","score","crmEvaluation"});
        // 设置对应的列标题
        parameters.setColumnsHeader(new String[]{"创建时间", "任务编号", "任务来源", "任务类型", "任务状态","任务内容", "城市", "管理中心", "项目", "网格","楼栋", "房屋", "是否超时", "处理人", "系统回访评价", "人工回访评价"});
        // 设置对应列的数据类型
        parameters.setColumnsType(new String[]{"String", "String","String","String","String","String","String","String","String","String","String","String","String","String","String","String"});
        parameters.setColumnsAlign(new String[]{"left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left"});
        // 设置dao名称
        parameters.setDaoName("reportRoDao");
        // 设置排序列
        parameters.setOrderBy("created asc");

        // 设置查询数据的sql
        parameters.setSqlId("sql.query.taskReport");
        // 设置查询数据总数的sql
        parameters.setSqlCountId("sql.query.taskReport.count");

        String userId=getCurrentUser().getId();
        Map<String,Object> params=new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(mcId)){
            params.put("mcId",mcId);
        }else{
            params.put("mcuserId",userId);//传入用户ID，去查当前用户拥有的项目权限
        }

        if(StringUtils.isNotEmpty(gridId)){
            params.put("gridId",gridId);
        }

        if(StringUtils.isNotEmpty(buildingCode)){
            params.put("buildingCode",buildingCode);
        }

        if(StringUtils.isNotEmpty(cityCode)){
            params.put("cityCode",cityCode);
        }

        if(StringUtils.isNotEmpty(start)){
            params.put("start",start);
        }

        if(StringUtils.isNotEmpty(end)){
            params.put("end",end);
        }

        if(StringUtils.isNotEmpty(source)){
            params.put("source",source);
        }

        if(StringUtils.isNotEmpty(content)){
            params.put("content",content);
        }

        if(StringUtils.isNotEmpty(projectId)){
            params.put("projectId",projectId);
        }else{
            if(StringUtils.isNotEmpty(mcId)) {
                params.put("prouserId", userId);
            }
        }
        if(StringUtils.isNotEmpty(houseId)){
            params.put("houseId",houseId);
        }
        parameters.setParameters(params);
        // 调用导出方法
        Exporter.getInstance().export("任务报表"+ new SimpleDateFormat("yyyyMMdd").format(new Date())+".xlsx", parameters, response);


        return new ModelAndView();
    }



    /**查询条件
     * 管理中心、项目、网格、楼栋、房屋、城市、开始时间、结束时间（跨度一个月）、任务来源
     * @param mcId  管理中心ID
     * @param projectId 项目ID
     * @param gridId 网格ID
     * @param buildingCode 楼栋编码
     * @param houseId 房屋ID
     * @param cityCode 城市编码
     * @param start 开始时间
     * @param end  结束时间
     * @param source 任务来源
     * @param content 任务内容
     * @param curPage 当前页
     * @param pageSize 每页数量
     * @return
     */
    @RequestMapping(value = "/call/taskreport",method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getPrjReport(String mcId,String gridId,String buildingCode,String cityCode,String start, String end, String source,String content, String projectId, String houseId,Integer curPage,Integer pageSize){
        Page page=null;
        if(curPage!=null&&pageSize!=null){
            page=new Page();
            page.setPage(curPage);
            page.setPageSize(pageSize);
        }

        ListResult<TaskRecordReport> result=new ListResult<TaskRecordReport>(page,service.getTaskReport4Prj(mcId, gridId, buildingCode, cityCode, start,  end,  source, content,  projectId,  houseId,page,getCurrentUser().getId()));
        return ServiceResult.succeed(result);
    }

    @RequestMapping(value = "/call/taskreport/export",method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView exportPrjReport(String mcId, String gridId, String buildingCode, String cityCode, String start, String end, String source, String content, String projectId, String houseId, HttpServletResponse response){
        // mcId, gridId, buildingCode, cityCode, start,  end,  source, content,  projectId,  houseId
        //创建时间、任务编号、任务来源、任务类型、任务状态、任务内容、城市、管理中心、项目、网格、楼栋、房屋、
        //是否超时、处理人、系统回访评价、人工回访评价、是否取消

        ExportParameters parameters = new ExportParameters();
        // 设置需要导出的列ID
        parameters.setColumnsId(new String[]{"created", "taskNo","contact","source", "businessType","status", "creator","reportUserMobile","mobile","process","content","isOrder","city", "mcname","projectName", "gridName","buildName","houseName","isTimeout","staff","score","crmEvaluation","isCancel","crmDuty"});
        // 设置对应的列标题
        parameters.setColumnsHeader(new String[]{"创建时间", "任务编号", "客户姓名","任务来源", "任务类型", "任务状态","创建人","来电号码","联系电话","处理方式","是否预约","任务内容", "城市", "管理中心", "项目", "网格","楼栋", "房屋", "是否超时", "处理人", "系统回访评价", "人工回访评价","是否取消","投诉定责"});
        // 设置对应列的数据类型
        parameters.setColumnsType(new String[]{"String", "String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String"});
        parameters.setColumnsAlign(new String[]{"left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left"});
        // 设置dao名称
        parameters.setDaoName("reportRoDao");
        // 设置排序列
        parameters.setOrderBy("created asc");

        // 设置查询数据的sql
        parameters.setSqlId("sql.query.taskReport4Call");
        // 设置查询数据总数的sql
        parameters.setSqlCountId("sql.query.taskReport.count");

        String userId=getCurrentUser().getId();
        Map<String,Object> params=new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(mcId)){
            params.put("mcId",mcId);
        }else{
            params.put("mcuserId",userId);//传入用户ID，去查当前用户拥有的项目权限
        }

        if(StringUtils.isNotEmpty(gridId)){
            params.put("gridId",gridId);
        }

        if(StringUtils.isNotEmpty(buildingCode)){
            params.put("buildingCode",buildingCode);
        }

        if(StringUtils.isNotEmpty(cityCode)){
            params.put("cityCode",cityCode);
        }

        if(StringUtils.isNotEmpty(start)){
            params.put("start",start);
        }

        if(StringUtils.isNotEmpty(end)){
            params.put("end",end);
        }

        if(StringUtils.isNotEmpty(source)){
            params.put("source",source);
        }

        if(StringUtils.isNotEmpty(content)){
            params.put("content",content);
        }

        if(StringUtils.isNotEmpty(projectId)){
            params.put("projectId",projectId);
        }else{
            if(StringUtils.isNotEmpty(mcId)) {
                params.put("prouserId", userId);
            }
        }
        if(StringUtils.isNotEmpty(houseId)){
            params.put("houseId",houseId);
        }
        parameters.setParameters(params);
        // 调用导出方法
        Exporter.getInstance().export("任务清单报表"+ new SimpleDateFormat("yyyyMMdd").format(new Date())+".xlsx", parameters, response);


        return new ModelAndView();
    }



    /**话务查询（用于报表）
     * @param curPage 当前页
     * @param pageSize 每页数量
     * @return
     */
    @RequestMapping(value = "/callcenter/telreport",method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult callCenterTelReport(String fromTime, String toTime, Integer curPage,Integer pageSize){
        List<CallRecords> list;

        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        try {
            list = service.getCallRecord(fromTime, toTime, page);
            ListResult<CallRecords> listResult = new ListResult<CallRecords>(page, list);
            return ServiceResult.succeed(listResult);
        } catch (Exception e) {
            e.printStackTrace();
            return ServiceResult.error(e);
        }
    }




    /**话务查询（用于报表）
     * @param fromTime 通话时间（查询条件）
     * @param toTime 通话时间（查询条件）
     * @return
     */
    @RequestMapping(value = "/callcenter/telreport/export",method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView exportCallCenterTelReport(String fromTime, String toTime,HttpServletResponse response){
        ExportParameters parameters = new ExportParameters();
        // 设置需要导出的列ID
        parameters.setColumnsId(new String[]{"callNumber", "callTime","beginTime", "typeText","endTime", "hangUp","telephonist","reasons", "tasks","taskCreateTime", "hasCheck","projectName","houseName","grid"});
        // 设置对应的列标题
        parameters.setColumnsHeader(new String[]{"主叫号码", "振铃开始时间", "通话开始时间", "通话类型", "挂机时间","挂机方", "受理人", "采集原因", "任务编号","任务创建时间", "质检情况","项目", "房屋" ,"网格"});
        // 设置对应列的数据类型
        parameters.setColumnsType(new String[]{"String", "String","String","String","String","String","String","String","String","String","String","String","String","String"});
        parameters.setColumnsAlign(new String[]{"left","left","left","left","left","left","left","left","left","left","left","left","left","left"});
        // 设置dao名称
        parameters.setDaoName("bizRoDao");
        // 设置排序列
        parameters.setOrderBy("calltime desc");

        // 设置查询数据的sql
        parameters.setSqlId("sql.query.callcenter.tel");
        // 设置查询数据总数的sql
        parameters.setSqlCountId("sql.query.callcenter.tel.count");

        String userId=getCurrentUser().getId();
        Map<String,Object> params=new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(fromTime)){
            params.put("fromTime",fromTime);
        }
        if(StringUtils.isNotEmpty(toTime)){
            params.put("toTime",toTime);
        }
        parameters.setParameters(params);
        // 调用导出方法
        Exporter.getInstance().export("话务清单报表"+ new SimpleDateFormat("yyyyMMdd").format(new Date())+".xlsx", parameters, response);


        return new ModelAndView();
    }

}
