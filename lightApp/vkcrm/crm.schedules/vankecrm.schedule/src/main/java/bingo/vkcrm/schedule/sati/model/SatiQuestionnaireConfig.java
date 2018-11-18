package bingo.vkcrm.schedule.sati.model;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import bingo.common.core.utils.DateUtils;


/**
* 满意调查配置实体类
*/
public class SatiQuestionnaireConfig{
	
	private String questionnaireId;
	private Date beginTime;//开始时间（配置问卷中）
	private Date endTime;//结束时间（配置问卷中）
	private Date delayTime;//延迟时间（配置问卷中）
	private String sampleRatio;//抽样比例（配置问卷中，暂时没用到）
	private String annualCompleteRate;//年度完成率（配置问卷中）
	private String annualCompleteCount;//下限，项目最低调查数量（配置问卷中）
	private String anomalousMonths;//不接收调查时长（单位：月）（配置问卷主题中）
	private String deliverTimeLess;//接管日期大于（配置问卷中）
	private String deliverTimeLager;//接管日期小于（配置问卷中）
	private String customerAgeLess;//客户年龄大于（配置问卷中）
	private String customerAgeLager;//客户年龄小于（配置问卷中）
	private String delayHandleType;//延迟处理，指昨天未处理完的任务是积压给下一天还是平铺到往后天数。1平铺2积压到下一天（配置问卷中）
	
	/**
	 * 获取问卷总时长，跨度月份
	 * @return
	 */
	public int getTotalMonth(){		
		Calendar beginCalendar = Calendar.getInstance();
		beginCalendar.setTime(beginTime);
		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(endTime);		
		return (endCalendar.get(Calendar.YEAR) - beginCalendar.get(Calendar.YEAR))*12 + 
				(endCalendar.get(Calendar.MONTH) - beginCalendar.get(Calendar.MONTH)) + 1;		
	}
	
	/**
	 * 获取剩余月份
	 * @return
	 */
	public int getLeftMonth(){
		Calendar beginCalendar = Calendar.getInstance();
		beginCalendar.setTime(new Date());
		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(endTime);		
		return (endCalendar.get(Calendar.YEAR) - beginCalendar.get(Calendar.YEAR))*12 + 
				(endCalendar.get(Calendar.MONTH) - beginCalendar.get(Calendar.MONTH)) + 1;
	}
	
	/**
	 * 1.最后月份或延期时间，获取剩下总额
	 * 2.保证后面月份完成比例，其余的堆到本月（2015-12-21 跟李工确认的需求）
	 * @param leftTotal
	 * @param targetTotal
	 * @return
	 */
	public int getThisMonthTarget(int completeTotal,int targetTotal){

		int leftTotal = targetTotal - completeTotal;//剩余总数
		
		// 最后一个月或延期时间：返回全部
		if(isLastMonth() || isOnDelayTime()){
			return leftTotal;
		}
		// 剩下总数前去后面月份目标
		int average = targetTotal/getTotalMonth();
		int left = leftTotal - average*(getLeftMonth()-1);		
		// 如果剩余天数小于0则返回0
		return left >=0?left:0;
	}
	

	/**
	 * 获取这个月的剩余天数
	 * 1.普通月份计算到月底
	 * 2.最后一个月算到最后一天
	 * 3.进入延期
	 * @return
	 */
	public int getRemainingDay(){
		Date now = new Date();
		if(isOnDelayTime()){// 进入延时阶段
			return getMoreDay(now,delayTime);
		}else{
			// 最后一个月
			if(isLastMonth()){
				return getMoreDay(now,endTime);
			}else{
				Calendar lastDateOfMonth = Calendar.getInstance();
				lastDateOfMonth.setTime(new Date());
				lastDateOfMonth.set(Calendar.DAY_OF_MONTH, 1);
				lastDateOfMonth.add(Calendar.MONTH, 1);
				lastDateOfMonth.add(Calendar.DAY_OF_MONTH, -1);
				lastDateOfMonth.set(Calendar.HOUR_OF_DAY, 0);
				lastDateOfMonth.set(Calendar.MINUTE, 0);
				lastDateOfMonth.set(Calendar.SECOND, 0);
				return getMoreDay(now, lastDateOfMonth.getTime());
			}
		}
	}
	
	/**
	 * 计算是否延时时间
	 * 计算逻辑：当前日期大于最后一天（凌晨0点）+1
	 * @return
	 */
	public boolean isOnDelayTime(){
		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(endTime);
		endCalendar.set(Calendar.DAY_OF_MONTH, 1);//最后一天加一天	
		Date now = new Date();		
		return now.compareTo(endCalendar.getTime()) > 0;		
	}
	
	/**
	 * 计算是否进入最后一个月
	 * @return
	 */
	public boolean isLastMonth(){
		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(endTime);
		Calendar nowCalendar = Calendar.getInstance();
		nowCalendar.setTime(new Date());		
		return (endCalendar.get(Calendar.YEAR) == nowCalendar.get(Calendar.YEAR) 
				&& endCalendar.get(Calendar.MONTH) == nowCalendar.get(Calendar.MONTH));
	}
	
	/**
	 * 计算是否问卷调查最后一天
	 * 如果是问卷调查最后一天 返回ture，如果不是计算是否计算是否延迟时间最后一天
	 * @return
	 */
	public boolean isLastDateOfQuestionnaire(){
		String nowDateStr = DateUtils.toString(new Date(), DateUtils.DATE_FORMAT);
		String endDateStr = DateUtils.toString(endTime, DateUtils.DATE_FORMAT);
		// 如果是问卷调查最后一天(判断年月日是否一样) 返回ture，如果不是计算是否计算是否延迟时间最后一天
		if(nowDateStr.equals(endDateStr)){return true;}		
		// 没有延迟返回false
		if(null == delayTime){return false;}
		String delayDateStr = DateUtils.toString(delayTime, DateUtils.DATE_FORMAT);		
		// 如果是问卷调查最后一天(判断年月日是否一样)
		return (nowDateStr.equals(delayDateStr));
	}
	
	/**
	 * 计算今天是否当月最后一天
	 * @return
	 */
	public static boolean isLastDateOfMonth(){
		Calendar nowCalendar = Calendar.getInstance();
		nowCalendar.setTime(new Date());
		int month = nowCalendar.get(Calendar.MONTH);
		nowCalendar.add(Calendar.DAY_OF_MONTH, 1);
		return month != nowCalendar.get(Calendar.MONTH);
	}
	
	/**
	 * 计算结束时间比开始时间多几天，少于一天算一天
	 * 注意：不支持开始时间大于结束时间
	 * @param begin
	 * @param end
	 * @return
	 */
	public int getMoreDay(Date begin,Date end){
		String beginDateStr = DateUtils.toString(begin, DateUtils.DATE_FORMAT);
		String endDateStr = DateUtils.toString(end, DateUtils.DATE_FORMAT);
		// 如果是同一天，返回1
		if(beginDateStr.equals(endDateStr)){
			return 1;
		}
		Calendar beginCalendar = Calendar.getInstance();
		beginCalendar.setTime(begin);
		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(end);		
		return (int)((endCalendar.getTimeInMillis() - beginCalendar.getTimeInMillis())/(60*60*24*1000))+2;
	}
	

	
	/**
	 * 判断最后一个月第一天是否大于今天
	 * 最后一个月不再更新房屋，项目数据
	 * @param endDate
	 * @return
	 */
	public boolean isLastMonthFirstDateLagerThanToday(){
        GregorianCalendar gc = new GregorianCalendar();
        gc.setTime(endTime);
        gc.set(Calendar.DAY_OF_MONTH, 1);//计算最后一个月第一天
        return gc.getTime().compareTo(new Date()) < 0;
	}
	
	/**
	 * 获取文件详细信息
	 */
	public String toString(){		
		StringBuffer sb = new StringBuffer();
		sb.append("questionnaireId(问卷ID) = ").append(questionnaireId).append(";");
		sb.append("beginTime(开始时间) = ").append(DateUtils.toString(beginTime)).append(";");
		sb.append("endTime(结束时间) = ").append(DateUtils.toString(endTime)).append(";");
		sb.append("delayTime(延迟时间) = ").append(DateUtils.toString(delayTime)).append(";");
		sb.append("sampleRatio(抽样比例) = ").append(sampleRatio).append(";");
		sb.append("annualCompleteRate(年度完成率) = ").append(annualCompleteRate).append(";");
		sb.append("annualCompleteCount(网格调查下限) = ").append(annualCompleteCount).append(";");
		sb.append("anomalousMonths(不接受调查时长) = ").append(anomalousMonths).append(";");
		sb.append("deliverTimeLess(接管日期大于) = ").append(deliverTimeLess).append(";");
		sb.append("deliverTimeLager(接管日期小于) = ").append(deliverTimeLager).append(";");
		sb.append("customerAgeLess(客户年龄大于) = ").append(customerAgeLess).append(";");
		sb.append("customerAgeLager(客户年龄小于) = ").append(customerAgeLager).append(";");
		sb.append("delayHandleType(延迟处理方式) = ").append(delayHandleType).append(";");
		sb.append("总月份 = ").append(getTotalMonth()).append(";");
		sb.append("剩下月份 = ").append(getLeftMonth()).append(";");
		sb.append("剩余天数 = ").append(getRemainingDay()).append(";");
		return sb.toString();		
	}
	

	public String getQuestionnaireId() {
		return questionnaireId;
	}
	public void setQuestionnaireId(String questionnaireId) {
		this.questionnaireId = questionnaireId;
	}
	public Date getBeginTime() {
		return beginTime;
	}
	public void setBeginTime(Date beginTime) {
		this.beginTime = beginTime;
	}
	public Date getEndTime() {
		return endTime;
	}
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	public Date getDelayTime() {
		return delayTime;
	}
	public void setDelayTime(Date delayTime) {
		this.delayTime = delayTime;
	}
	public String getSampleRatio() {
		return sampleRatio;
	}
	public void setSampleRatio(String sampleRatio) {
		this.sampleRatio = sampleRatio;
	}
	public String getAnnualCompleteRate() {
		return annualCompleteRate;
	}
	public void setAnnualCompleteRate(String annualCompleteRate) {
		this.annualCompleteRate = annualCompleteRate;
	}
	public String getAnnualCompleteCount() {
		return annualCompleteCount;
	}
	public void setAnnualCompleteCount(String annualCompleteCount) {
		this.annualCompleteCount = annualCompleteCount;
	}
	public String getAnomalousMonths() {
		return anomalousMonths;
	}
	public void setAnomalousMonths(String anomalousMonths) {
		this.anomalousMonths = anomalousMonths;
	}
	public String getDeliverTimeLess() {
		return deliverTimeLess;
	}
	public void setDeliverTimeLess(String deliverTimeLess) {
		this.deliverTimeLess = deliverTimeLess;
	}
	public String getDeliverTimeLager() {
		return deliverTimeLager;
	}
	public void setDeliverTimeLager(String deliverTimeLager) {
		this.deliverTimeLager = deliverTimeLager;
	}
	public String getCustomerAgeLess() {
		return customerAgeLess;
	}
	public void setCustomerAgeLess(String customerAgeLess) {
		this.customerAgeLess = customerAgeLess;
	}
	public String getCustomerAgeLager() {
		return customerAgeLager;
	}
	public void setCustomerAgeLager(String customerAgeLager) {
		this.customerAgeLager = customerAgeLager;
	}
	public String getDelayHandleType() {
		return delayHandleType;
	}
	public void setDelayHandleType(String delayHandleType) {
		this.delayHandleType = delayHandleType;
	}
	
	
	public static void main(String[] args) {

		Date beginTime = DateUtils.toDate("2016-12-31 03:12:12");
		Date endTime = DateUtils.toDate("2016-12-31");
		
		Calendar beginCalendar = Calendar.getInstance();
		beginCalendar.setTime(beginTime);

		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(endTime);
		
		System.out.println((endCalendar.getTimeInMillis() - beginCalendar.getTimeInMillis())/(60*60*24*1000));
	}

	
	
	
}













