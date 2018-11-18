package bingo.vkcrm.service.customer.v1.models.blackcat;

import java.util.List;

/**
 * 项目客户信息
 * @author Administrator
 *
 */
public class ProjectCustomer {
	/**
	 * 项目Code
	 */
	private String projectCode;
	
	/**
	 * 总数据量:用于校验同步后数据量与服务器是否一致
	 */
	private Integer dataSize;
	
	/**
	 * 客房信息
	 */
	private List<HouseCustomer> houseCustomer;

	public String getProjectCode() {
		return projectCode;
	}

	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}

	public Integer getDataSize() {
		return dataSize;
	}

	public void setDataSize(Integer dataSize) {
		this.dataSize = dataSize;
	}

	public List<HouseCustomer> getHouseCustomer() {
		return houseCustomer;
	}

	public void setHouseCustomer(List<HouseCustomer> houseCustomer) {
		this.houseCustomer = houseCustomer;
	}

}
