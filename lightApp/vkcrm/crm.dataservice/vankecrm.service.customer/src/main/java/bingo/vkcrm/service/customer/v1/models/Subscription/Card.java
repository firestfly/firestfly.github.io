package bingo.vkcrm.service.customer.v1.models.Subscription;
import java.util.Date;

/**
 * 一卡通实体
 * @author chengsiyuan
 *
 */
public class Card {

	private String cardNo;
	private Date tranDate;
	private int tranAmt;
	private String custName;
	private String merName;
	private String tranType;
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	public Date getTranDate() {
		return tranDate;
	}
	public void setTranDate(Date tranDate) {
		this.tranDate = tranDate;
	}
	public int getTranAmt() {
		return tranAmt;
	}
	public void setTranAmt(int tranAmt) {
		this.tranAmt = tranAmt;
	}
	public String getCustName() {
		return custName;
	}
	public void setCustName(String custName) {
		this.custName = custName;
	}
	public String getMerName() {
		return merName;
	}
	public void setMerName(String merName) {
		this.merName = merName;
	}
	public String getTranType() {
		return tranType;
	}
	public void setTranType(String tranType) {
		this.tranType = tranType;
	}
	

}
