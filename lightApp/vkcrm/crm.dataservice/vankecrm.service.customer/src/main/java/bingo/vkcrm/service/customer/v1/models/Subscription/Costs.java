package bingo.vkcrm.service.customer.v1.models.Subscription;

/**
 * 账单项
 * @author chengsiyuan
 *
 */
public class Costs {

	/**
	 * 费用项目id
	 */
	private String expenseId;
	/**
	 * 费用条目
	 */
	private String expenseName;
	/**
	 * 费用金额
	 */
	private String expenses;
	/**
	 * 违约金
	 */
	private String lateFee;
	/**
	 * 已交金额
	 */
	private String paid;
	/**
	 * 缴费状态
	 */
	private String status;
	public String getExpenseId() {
		return expenseId;
	}
	public void setExpenseId(String expenseId) {
		this.expenseId = expenseId;
	}
	public String getExpenseName() {
		return expenseName;
	}
	public void setExpenseName(String expenseName) {
		this.expenseName = expenseName;
	}
	public String getExpenses() {
		return expenses;
	}
	public void setExpenses(String expenses) {
		this.expenses = expenses;
	}
	public String getLateFee() {
		return lateFee;
	}
	public void setLateFee(String lateFee) {
		this.lateFee = lateFee;
	}
	public String getPaid() {
		return paid;
	}
	public void setPaid(String paid) {
		this.paid = paid;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
}
