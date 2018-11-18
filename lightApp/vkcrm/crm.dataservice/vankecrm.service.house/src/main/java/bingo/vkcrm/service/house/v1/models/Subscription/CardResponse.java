package bingo.vkcrm.service.house.v1.models.Subscription;

/**
 * 一卡通查询返回体
 * @author chengsiyuan
 *
 */
public class CardResponse {

	/**
	 * 返回体头部
	 */
	private ResponseHead head;
	/**
	 * 返回体参数
	 */
	private CardResponseParameter data;
	public ResponseHead getHead() {
		return head;
	}
	public void setHead(ResponseHead head) {
		this.head = head;
	}
	public CardResponseParameter getData() {
		return data;
	}
	public void setData(CardResponseParameter data) {
		this.data = data;
	}

	
}
