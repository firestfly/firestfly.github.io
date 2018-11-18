package bingo.vkcrm.service.questionnaire.v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.questionnaire.v1.Version;
import bingo.vkcrm.service.questionnaire.v1.services.SelectProjectService;

/**
 * 满意度调查选择项目
 */
@Controller
@RequestMapping(value = Version.API_PATH+"/selectProject")
public class SelectProjectController extends BaseController {

    @Autowired
    SelectProjectService selectProjectService;


    /**
     * 添加问卷调查通话记录中间表
     * @param answerCallRecords
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/queryByName", method = RequestMethod.GET)
    @ResponseBody
	public ServiceResult queryProject(String projectName) throws Exception {    	
    	return ServiceResult.succeed(selectProjectService.queryProject(projectName));
	}

    /**
     * 添加问卷调查通话记录中间表
     * @param answerCallRecords
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/querySelected", method = RequestMethod.GET)
    @ResponseBody
	public ServiceResult querySelectedProject(String questionnaireId) throws Exception {
		return ServiceResult.succeed(selectProjectService.querySelectedProject(questionnaireId));
	}
	
	

    /**
     * 添加问卷调查通话记录中间表
     * @param answerCallRecords
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/saveProject", method = RequestMethod.POST)
    @ResponseBody
	public ServiceResult saveProject(String[] projectList, String questionnaireId) throws Exception {		
    	return ServiceResult.succeed(selectProjectService.saveProject(projectList,questionnaireId));		
	}
	
    
}
