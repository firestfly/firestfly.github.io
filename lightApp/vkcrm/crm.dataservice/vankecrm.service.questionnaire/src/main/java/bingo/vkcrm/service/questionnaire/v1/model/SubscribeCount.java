package bingo.vkcrm.service.questionnaire.v1.model;

/**
 * <code>{@link SubscribeCount}</code>
 * 项目往后5天预约客户数量
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
public class SubscribeCount{
	
	private Integer subscribeTime;// 第几天	
	private Integer count;// 预约数量
	
	public Integer getSubscribeTime() {
		return subscribeTime;
	}
	public void setSubscribeTime(Integer subscribeTime) {
		this.subscribeTime = subscribeTime;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
}
