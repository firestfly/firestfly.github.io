package bingo.vkcrm.service.customer.v1.models.Subscription;
import java.util.Date;

/**
 * 邮包请求体参数结构
 * @author Administrator
 *
 */
public class ParcelRequestParameter {

	private String[] mobile;
	private String type;
	private String beginDate;
	private String endDate;
	private String pageNo;
	private String pageSize;
	public String[] getMobile() {
		return mobile;
	}
	public void setMobile(String[] mobile) {
		this.mobile = mobile;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	public String getBeginDate() {
		return beginDate;
	}
	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getPageNo() {
		return pageNo;
	}
	public void setPageNo(String pageNo) {
		this.pageNo = pageNo;
	}
	public String getPageSize() {
		return pageSize;
	}
	public void setPageSize(String pageSize) {
		this.pageSize = pageSize;
	}
	

	

}
