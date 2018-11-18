package bingo.vkcrm.service.customer.v1.models.Subscription;

/**
 * 邮包查询请求体结构
 * @author chengsiyuan
 *
 */
public class ParcelRequest {

	private RequestHead head;
	private ParcelRequestParameter parameter;
	public RequestHead getHead() {
		return head;
	}
	public void setHead(RequestHead head) {
		this.head = head;
	}
	public ParcelRequestParameter getParameter() {
		return parameter;
	}
	public void setParameter(ParcelRequestParameter parameter) {
		this.parameter = parameter;
	}
	
	
}
