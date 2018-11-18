package bingo.vkcrm.service.customer.v1.models.Subscription;
import java.util.List;

/**
 * 邮包查询返回体参数
 * @author Administrator
 *
 */
public class ParcelResponseParameter {

//	private int totalPage;
//	private int totalCount;
	private List<Parcel> list;
//	public int getTotalPage() {
//		return totalPage;
//	}
//	public void setTotalPage(int totalPage) {
//		this.totalPage = totalPage;
//	}
//	public int getTotalCount() {
//		return totalCount;
//	}
//	public void setTotalCount(int totalCount) {
//		this.totalCount = totalCount;
//	}
	public List<Parcel> getList() {
		return list;
	}
	public void setList(List<Parcel> list) {
		this.list = list;
	}	
}
