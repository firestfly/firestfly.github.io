package bingo.vkcrm.service.customer.v1.models.blackcar;

import java.util.List;
/**
 * 客房关系返回结果
 * @ClassName: HouseCustomerRelationResult   
 * @Description:
 * @author: huangsx 
 * @date: 2016年4月7日 下午7:53:34   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */
public class HouseCustomerRelationResult {
	private int page ;
	private int size ;
	private int total ;
	private int totalRow;
	private String update;
	private String projectCode ;
	private String projectName ;
	
	private List<HouseCustomerRelation> data;
	
	public HouseCustomerRelationResult() {
		super();
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public String getUpdate() {
		return update;
	}

	public void setUpdate(String update) {
		this.update = update;
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

	public List<HouseCustomerRelation> getData() {
		return data;
	}

	public void setData(List<HouseCustomerRelation> data) {
		this.data = data;
	}

	public int getTotalRow() {
		return totalRow;
	}

	public void setTotalRow(int totalRow) {
		this.totalRow = totalRow;
	}

	public HouseCustomerRelationResult(int page, int size, int total, int totalRow, String update, String projectCode,
			String projectName, List<HouseCustomerRelation> data) {
		super();
		this.page = page;
		this.size = size;
		this.total = total;
		this.totalRow = totalRow;
		this.update = update;
		this.projectCode = projectCode;
		this.projectName = projectName;
		this.data = data;
	}

	

	
	

	
	
}	
