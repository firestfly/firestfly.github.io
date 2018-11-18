package bingo.vkcrm.service.customer.v1.models.Subscription;

import java.util.Date;
/**
 * 一卡通请求体参数
 * @author chengsiyuan
 *
 */
public class CardRequestParameter {


	private String[] cardNo;
	private String beginDate;
	private String endDate;
	private String pageNo;
	private String pageSize;
	public String[] getCardNo() {
		return cardNo;
	}
	public void setCardNo(String[] cardNo) {
		this.cardNo = cardNo;
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
