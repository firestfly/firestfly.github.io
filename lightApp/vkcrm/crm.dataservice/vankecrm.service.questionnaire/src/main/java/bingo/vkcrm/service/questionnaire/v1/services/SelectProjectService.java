package bingo.vkcrm.service.questionnaire.v1.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bingo.vkcrm.service.service.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.vkcrm.service.questionnaire.v1.model.Project;

@Service
public class SelectProjectService extends BaseService {
	
	/**
	 * 通过项目名称查询项目信息
	 * @param projectName
	 * @return
	 */
	public List<Map<String, Object>> queryProject(String projectName) {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		queryMap.put("PROJECT_NAME", projectName);		
		return centerRoDao.queryForListMap("project.function.queryProject", queryMap);
	}

	/**
	 * 通过问卷ID，查询问卷项目信息
	 * @param questionnaireId
	 * @return
	 */
	public List<Project> querySelectedProject(String questionnaireId) {
		return bizRoDao.getJdbcDao().queryForList(Project.class, "project.function.querySelectedProject", questionnaireId);
	}

	/**
	 * 保存组织和项目的权限
	 * @param projectList 选择项目列表
	 * @param questionnaireId 用户ID
	 */
	public String saveProject(String[] projectList, String questionnaireId) {
		
		// 把项目信息转换成对象
		List<Project> projects = new ArrayList<Project>();		
		for(String projectStr : projectList){
			String[] projectArr = projectStr.split(":");
			if(StringUtils.isNotEmpty(projectArr[0])){
				Project project = new Project();
				project.setProjectId(projectArr[0]);
				project.setProjectName(projectArr[1]);
				project.setQuestionnaireId(questionnaireId);
				projects.add(project);
			}
		}
		// 清除旧项目信息
		bizDao.getJdbcDao().delete("project.function.delproject", questionnaireId);
		// 插入新项目信息
		bizDao.batchInsert(Project.class, projects);
		return "保存项目信息成功。";
		
	}
	
	
	
}