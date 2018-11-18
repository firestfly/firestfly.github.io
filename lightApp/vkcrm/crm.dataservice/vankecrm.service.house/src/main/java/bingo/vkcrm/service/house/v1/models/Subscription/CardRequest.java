package bingo.vkcrm.service.house.v1.models.Subscription;

/**
 * 一卡通请求结构
 * @author chengsiyuan
 *
 */
public class CardRequest {

	/**
	 * 请求体头部
	 */
	private RequestHead head;
	/**
	 * 请求体参数
	 */
	private CardRequestParameter parameter;
	public RequestHead getHead() {
		return head;
	}
	public void setHead(RequestHead head) {
		this.head = head;
	}
	public CardRequestParameter getParameter() {
		return parameter;
	}
	public void setParameter(CardRequestParameter parameter) {
		this.parameter = parameter;
	}
	
}
