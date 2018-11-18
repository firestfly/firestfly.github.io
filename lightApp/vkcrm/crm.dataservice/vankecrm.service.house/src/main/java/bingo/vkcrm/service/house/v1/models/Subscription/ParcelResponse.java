package bingo.vkcrm.service.house.v1.models.Subscription;

/**
 * 邮包查询返回体结构
 * @author chengsiyuan
 *
 */
public class ParcelResponse {

	private ResponseHead head;
	private ParcelResponseParameter data;
	public ResponseHead getHead() {
		return head;
	}
	public void setHead(ResponseHead head) {
		this.head = head;
	}
	public ParcelResponseParameter getData() {
		return data;
	}
	public void setData(ParcelResponseParameter data) {
		this.data = data;
	}
	
	
}
