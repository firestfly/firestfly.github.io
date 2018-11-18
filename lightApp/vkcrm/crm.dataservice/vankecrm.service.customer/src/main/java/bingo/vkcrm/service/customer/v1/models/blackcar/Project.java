package bingo.vkcrm.service.customer.v1.models.blackcar;
/**
 * 项目列表
 * @ClassName: Project   
 * @Description:
 * @author: huangsx 
 * @date: 2016年4月6日 下午3:55:44   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */
public class Project {
	private String projectId ;
	private String projectCode;
	private String projectName;
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getProjectCode() {
		return projectCode;
	}
	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public Project(String projectId, String projectCode, String projectName) {
		super();
		this.projectId = projectId;
		this.projectCode = projectCode;
		this.projectName = projectName;
	}
	public Project() {
		super();
	}
	
	
}
