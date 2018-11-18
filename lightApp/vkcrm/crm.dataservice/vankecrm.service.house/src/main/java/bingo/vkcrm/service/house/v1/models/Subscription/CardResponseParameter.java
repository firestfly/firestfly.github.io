package bingo.vkcrm.service.house.v1.models.Subscription;

import java.util.List;

/**
 * 一卡通查询返回参数
 * @author chengsiyuan
 *
 */
public class CardResponseParameter {

	private int totalPage;
	private int totalCount;
	private List<Card> list;
	public int getTotalPage() {
		return totalPage;
	}
	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}
	public int getTotalCount() {
		return totalCount;
	}
	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}
	public List<Card> getList() {
		return list;
	}
	public void setList(List<Card> list) {
		this.list = list;
	}
	
}
