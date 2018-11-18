package bingo.vkcrm.service.report.v1.controllers;

import bingo.dao.Page;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.report.v1.services.ProjectReportSerivce;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by szsonic on 2016/3/25/025.
 */
@Controller
public class ProjectReportController extends BaseController{

    @Autowired
    ProjectReportSerivce projectReportSerivce;

    @RequestMapping(value = "/projectReport",method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getTaskReport(String start, String end, String content, String projectId, String houseId, Integer curPage, Integer pageSize){
        Page page=null;
        if(curPage!=null&&pageSize!=null){
            page=new Page();
            page.setPage(curPage);
            page.setPageSize(pageSize);
        }
        return ServiceResult.succeed(projectReportSerivce.getProjectReport());
    }
}
