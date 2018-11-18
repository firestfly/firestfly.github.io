package bingo.vkcrm.service.house.v1.models.Subscription;

import java.util.List;

/**
 * 物业费返回数据加密部分对象
 * @author chengsiyuan
 *
 */
public class EncryptTxtResponse {

	/**
	 * 未交金额合计
	 */
	private String allUnpaid;
	/**
	 * 房屋辅助编码（营帐系统那边现在用这个做id）
	 */
	private String house_mdscode;
	/**
	 * 预付款
	 */
	private String remain;
	/**
	 * 以下数月未交合计
	 */
	private String totalUnpaid;
	/**
	 * 月份账单项
	 */
	private List<Bis> bis;
	public String getAllUnpaid() {
		return allUnpaid;
	}
	public void setAllUnpaid(String allUnpaid) {
		this.allUnpaid = allUnpaid;
	}
	public String getHouse_mdscode() {
		return house_mdscode;
	}
	public void setHouse_mdscode(String house_mdscode) {
		this.house_mdscode = house_mdscode;
	}
	public String getRemain() {
		return remain;
	}
	public void setRemain(String remain) {
		this.remain = remain;
	}
	public String getTotalUnpaid() {
		return totalUnpaid;
	}
	public void setTotalUnpaid(String totalUnpaid) {
		this.totalUnpaid = totalUnpaid;
	}
	public List<Bis> getBis() {
		return bis;
	}
	public void setBis(List<Bis> bis) {
		this.bis = bis;
	}
	
	
}
