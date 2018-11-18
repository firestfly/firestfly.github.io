package bingo.vkcrm.service.customer.v1.models.Subscription;

import java.util.List;

/**
 * 物业费月份账单项
 * @author Administrator
 *
 */
public class Bis {

	/**
	 * 会计费
	 */
	private String mth;
	/**
	 * 当月应交费合计
	 */
	private String totalExpenses;
	/**
	 * 当月违约金合计
	 */
	private String totalLateFee;
	/**
	 * 当月未交额合计
	 */
	private String totalUnpaid;
	/**
	 * 账单项
	 */
	private List<Costs> costs;
	public String getMth() {
		return mth;
	}
	public void setMth(String mth) {
		this.mth = mth;
	}
	public String getTotalExpenses() {
		return totalExpenses;
	}
	public void setTotalExpenses(String totalExpenses) {
		this.totalExpenses = totalExpenses;
	}
	public String getTotalLateFee() {
		return totalLateFee;
	}
	public void setTotalLateFee(String totalLateFee) {
		this.totalLateFee = totalLateFee;
	}
	public String getTotalUnpaid() {
		return totalUnpaid;
	}
	public void setTotalUnpaid(String totalUnpaid) {
		this.totalUnpaid = totalUnpaid;
	}
	public List<Costs> getCosts() {
		return costs;
	}
	public void setCosts(List<Costs> costs) {
		this.costs = costs;
	}

	
	
}
