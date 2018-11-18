/**
 * This file created at 2015-10-20.
 *
 * Copyright (c) 2015-2025 Bingosoft, Inc. All rights reserved.
 */
package bingo.vkcrm.schedule.sati;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import bingo.common.BaseService;
import bingo.common.core.ApplicationFactory;
import bingo.common.core.utils.DateUtils;
import bingo.vkcrm.schedule.sati.model.SatiQuestionnaireConfig;
import bingo.vkcrm.schedule.sati.model.SatiExtractionProject;
import bingo.vkcrm.schedule.sati.model.SatiExtractionIdentity;
import bingo.vkcrm.schedule.sati.model.SatiExtractionSubscribe;
import bingo.vkcrm.schedule.sati.model.SatiExtractionCompleted;
import bingo.vkcrm.schedule.sati.model.SatiResultProject;


/**
 * <code>{@link SatiSchedule}</code>
 * <br>满意度调查客户抽取定时任务，每天凌晨进行客户抽取
 * 
 * 相关需求：
 *    项目抽取规则：参加调查的项目从前台页面选取，不根据逻辑抽取。
 *    房屋抽取规则：
 *        抽取使用原始房屋，合并、拆分房不加入调查行列
 *        房屋交付日期必须大于6个月，小于100年
 *        最后一个月不加入新房屋
 *    客户抽取规则：
 *        客户种类：抽取房屋常用联系人，如果房屋没有常用联系人则随机抽取一个业主
 *        年龄限制：年龄大于18岁小于65岁 或 生日为空 或 生日=1900-01-01
 *        预约客户：预约客户必须抽取，过时则放入普通用户池
 *        强制抽取：电话无法接通客户第二天强制抽取（无人接听、无法接通、关机），标记为错号后有更正的客户强制抽取；当天完成比例后无需再抽取强制抽取客户
 *        法律纠纷：法律纠纷户在法律纠纷期间不参加调查
 *        不接受调查：调查时表态不接受调查的用户根据主题下配置不接受调查时长，在期间内不接受调查，其他主题不受影响
 *        一个客户在同个问卷、同个项目下不重复接受调查。不同问卷或不同项目可以重复接受调查
 *        
 *    项目完成率计算：
 *        项目完成率粒度细化到网格
 *        保证每个月的完成比例跟问卷完成比例一致，如果突然增加很多房屋，压力堆积到当前月，以保证后续的月份完成比例正确
 *        
 *        
 * 相关计算公式：（细化粒度：网格）
 *    总目标数 = 下满足要求的总房屋数 * 问卷完成比例         (注：总目标数小于30按30算)
 *        
 *    当月目标数量 = 总目标数 - 已完成总数 - 总目标数/总月份*(剩余月份-1)
 *    当月目标数量(最后一个月或延期期间) = 总目标数 - 已完成总数量
 *        
 *    当天目标数量（平铺）= 当月目标数量/剩余天数
 *    当天目标数量（积压）= （当月目标数量 - 昨天剩余)/剩余天数 + 昨天剩余
 *    注：当天未完成数量有2种方式加入到后续天数：1平铺到当月往后天数 2全部数量积压到下一天
 *    
 *    
 * 相关表说明：   
 *    sati_extraction_project:存放满意度调查的项目、网格
 *    sati_extraction_house:存放满意度调查的房屋和客户（满足调查要求的房屋，也用于计算完成目标数；此处的客户未去重，剔除法律纠纷、不接受调查客户）
 *    sati_extraction_identity:存放在期间内的“法律纠纷户”和“不接受调查的客户”
 *    sati_extraction_subscribe:存放预约客户和强制抽取客户，强制抽取客户无预约时间
 *    sati_extraction_customer:存放抽取的客户，会在此表做客户去重，剔除法律纠纷、不接受调查、预约、强制抽取、已完成调查  的客户
 *    sati_extraction_double:去重临时表
 *    sati_extraction_completed:已完成调查的客户
 *    
 *    sati_result_project:计算项目网格完成率，目标数量等信息，抽取客户时再此预扣数量
 *    sati_result_subscribe:存放预约客户，强制抽取客户
 *    sati_result_customer:存放普通抽取客户池
 * 
 * <br>客户抽取步骤
 * <br>1.抽取参与调查的项目，存放到 sati_extraction_project
 * <br>2.抽取满足调查要求的房屋，存放到 sati_extraction_house
 * <br>3.更新特殊客户身份数据：法律纠纷、拒绝调查、强制提取、预约客户、已完成调查客户 sati_extraction_identity，sati_extraction_subscribe，sati_extraction_completed
 * <br>4.抽取调查房屋常用联系人，形成客户池 sati_extraction_customer
 * <br>5.从客户池、预约客户表中剔除重复数据
 * <br>6.计算项目完成度信息，方便前台抽取客户
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 * @version 1.00, 2015-10-20
 * @since JDK 1.6 
 */
@Service
public class SatiSchedule extends BaseService {
    private static final Log log = LogFactory.getLog(SatiSchedule.class);
	
	/**
	 * 启动抽取客户定时器
	 */
	public void scheduleStrat(){
		
		// 616bb7ea3f88439881151df66c40d606
		
		log.debug("开始进行问卷调查抽取......");
		
		// 查询运行中的问卷调查，开始做问卷抽取
		List<SatiQuestionnaireConfig> questionnaireList = 
				callCenterRnDao.getJdbcDao().queryForList(SatiQuestionnaireConfig.class, "sql-sati-questionnaire-select");

		if(null != questionnaireList){
			log.debug("需要进行抽取的问卷有"+questionnaireList.size()+"个");
		}else{
			log.debug("没有需要进行抽取的问卷有");
		}
		
		for(SatiQuestionnaireConfig questionnaire : questionnaireList){
			
			// 第一次问卷数据库缺少规则设置，设置默认值
			//questionnaire.setAnnualCompleteRate("0.08");
			questionnaire.setAnnualCompleteCount("30");
			//questionnaire.setAnomalousMonths("12");
			questionnaire.setDeliverTimeLess("6");
			questionnaire.setDeliverTimeLager("100");
			questionnaire.setCustomerAgeLess("18");
			//questionnaire.setCustomerAgeLager("65"); 12月中旬需求变更，暂时不设置年龄上限
			questionnaire.setDelayHandleType("1");
			
			log.debug("进入问卷调查 "+questionnaire.toString());
			// 进行一个问卷调查抽取			
			extractionAquestionnaire(questionnaire);
		}
	}
	
	/**
	 * 更新一个问卷调查
	 * @param questionnaire 问卷配置信息
	 */
	private void extractionAquestionnaire(SatiQuestionnaireConfig questionnaire){
		
		/**
		 * 最后一个月不再更新房屋，项目数据
		 */
		if(!questionnaire.isLastMonthFirstDateLagerThanToday()){
			log.debug("抽取项目，房屋信息 ");
			extractionProject(questionnaire);//2.抽取项目信息，直接从项目选择表复制数据
			extractionHouse(questionnaire);// 抽取房屋
		}else{
			log.debug("进入最后一个月，不更新项目，房屋信息 ");
		}
		
		// 最后一个月不更新项目，房屋信息，房屋常用联系人、业主需要更新。所以提前到外面
		// 抽取房屋常用联系人
		serviceCenterDao.insert("sql-sati-extractionHouse-setContacts",questionnaire);
		// 没有常用联系人的房屋，随机抽取一个业主
		serviceCenterDao.insert("sql-sati-extractionHouse-setOwner",questionnaire);
		
		//更新特殊身份客户数据
		extractionIdentity(questionnaire);
		//抽取客户，并剔除法律纠纷户、不接受调查客户等客户
		extractionCustomer(questionnaire);
		
		//生成结果
		createResult(questionnaire);
	}
	
	/**
	 * 获取要进行问卷调查的项目和网格信息
	 * 从项目选择表获取选择的项目信息
	 * @param questionnaire 问卷配置信息
	 */
	private void extractionProject(SatiQuestionnaireConfig questionnaire){
		// 清除项目信息
		deleteAllData("sati_extraction_project",questionnaire.getQuestionnaireId());
		
		// 获取项目信息
		List<SatiExtractionProject> SatiExtractionProjectList = 
				callCenterRnDao.getJdbcDao().queryForList(SatiExtractionProject.class,
						"sql-sati-extractionProject-select",questionnaire.getQuestionnaireId());
		serviceCenterDao.batchInsert(SatiExtractionProject.class, SatiExtractionProjectList);

		// 获取项目网格信息
		List<SatiExtractionProject> SatiExtractionProjectGridList = 
				serviceCenterDao.getJdbcDao().queryForList(SatiExtractionProject.class,
						"sql-sati-extractionProjectGrid-select",questionnaire.getQuestionnaireId());
		for(SatiExtractionProject temp : SatiExtractionProjectGridList){
			temp.setId(null);
		}
		serviceCenterDao.batchInsert(SatiExtractionProject.class, SatiExtractionProjectGridList);
	}
	
	/**
	 * 抽取项目下符合要求的房屋，形成房屋池，此份数据将作为调查的基数
	 * @param questionnaireId
	 * @param questionnaireName
	 */
	private void extractionHouse(SatiQuestionnaireConfig questionnaire){
		// 清除房屋信息
		deleteAllData("sati_extraction_house",questionnaire.getQuestionnaireId());
		// 抽取房屋
		serviceCenterDao.insert("sql-sati-extractionHouse-insert",questionnaire);
	}
	
	/**
	 * 问卷调查前更新法律纠纷客户，供所有问卷调查使用
	 * <br>客户抽取后使用此方法更新的法律纠纷客户排除客户信息
	 * <br>法律纠纷客户在法律纠纷期间不参与调查
	 */
	private void extractionIdentity(SatiQuestionnaireConfig questionnaire){		
		
		// 1.更新法律纠纷客户，拒绝调查客户
		clearTable("sati_extraction_identity");//清除特殊身份表数据
		// 更新法律纠纷客户
		serviceCenterDao.getJdbcDao().insert("sql-sati-extractionJiufen-insert1");
		// 查询不接受调查客户
		List<SatiExtractionIdentity> SatiExtractionIdentityList = 
				callCenterRnDao.getJdbcDao().queryForList(SatiExtractionIdentity.class, 
						"sql-sati-extractionJiufen-selectAnomalous", questionnaire.getAnomalousMonths());
		// 插入不接受调查客户
		serviceCenterDao.batchInsert(SatiExtractionIdentity.class, SatiExtractionIdentityList);

		// 2.更新预约客户和强制抽取客户
		clearTable("sati_extraction_subscribe");// 清除预约客户表数据		
		// 查询预约客户，强制抽取客户
		List<SatiExtractionSubscribe> satiExtractionSubscribes = callCenterRnDao.getJdbcDao().queryForList(SatiExtractionSubscribe.class, 
				"sql-sati-extractionCustomerQiangz-select-bizSubscribe", questionnaire.getQuestionnaireId(), questionnaire.getQuestionnaireId()
					,questionnaire.getQuestionnaireId());
		// 保存预约客户信息
		serviceCenterDao.batchInsert(SatiExtractionSubscribe.class, satiExtractionSubscribes);
		
		// 3.更新已完成调查客户列表
		clearTable("sati_extraction_completed");//清除已完成客户表
		List<SatiExtractionCompleted> SatiExtractionCompletedList = 
				callCenterRnDao.getJdbcDao().queryForList(SatiExtractionCompleted.class, 
						"sql-sati-extractionCustomer-select-completed", questionnaire.getQuestionnaireId());		
		serviceCenterDao.batchInsert(SatiExtractionCompleted.class, SatiExtractionCompletedList);
		
		// 更新网格信息 sati_extraction_subscribe sati_extraction_completed
		serviceCenterDao.update("sql-sati-extractionCustomerQiangz-update-bizSubscribe-setGridid",null);
		serviceCenterDao.update("sql-sati-extractionCustomer-update-completed-setGridId",null);
	}
	
	/**
	 * 抽取客户：抽取房屋下满足调查的客户
	 * @param questionnaire
	 */
	private void extractionCustomer(SatiQuestionnaireConfig questionnaire){
		

		clearTable("sati_extraction_customer");
		// 插入客户信息
		serviceCenterDao.insert("sql-sati-extractionCustomer-insert",questionnaire);
				
		// 清除 已调查，强制抽取，预约，法律纠纷，拒绝调查客户 begin
		// 清理客户表数据 需要加上项目判断
		serviceCenterDao.getJdbcDao().delete("delete c5 from sati_extraction_customer c5 inner join sati_extraction_identity  i3 on c5.customer_id = i3.customer_id");
		serviceCenterDao.getJdbcDao().delete("delete c5 from sati_extraction_customer c5 inner join sati_extraction_subscribe s4 on c5.customer_id = s4.customer_id and c5.project_id = s4.project_id");
		serviceCenterDao.getJdbcDao().delete("delete c5 from sati_extraction_customer c5 inner join sati_extraction_subscribe s4 on c5.house_id = s4.house_id");
		serviceCenterDao.getJdbcDao().delete("delete c5 from sati_extraction_customer c5 inner join sati_extraction_completed c7 on c5.customer_id = c7.customer_id and c5.project_id = c7.project_id");
		serviceCenterDao.getJdbcDao().delete("delete c5 from sati_extraction_customer c5 inner join sati_extraction_completed c7 on c5.house_id = c7.house_id");
		// 清理预约客户表数据 需要加上项目判断
		serviceCenterDao.getJdbcDao().delete("delete s4 from sati_extraction_subscribe s4 inner join sati_extraction_identity  i3 on s4.customer_id = i3.customer_id");
		serviceCenterDao.getJdbcDao().delete("delete s4 from sati_extraction_subscribe s4 inner join sati_extraction_completed c7 on s4.customer_id = c7.customer_id and s4.project_id = c7.project_id");
		serviceCenterDao.getJdbcDao().delete("delete s4 from sati_extraction_subscribe s4 inner join sati_extraction_completed c7 on s4.house_id = c7.house_id");
		// end
		
		// 去重 begin
		// 清理主要电话号码重复的客户 保留一个 
		clearTable("sati_extraction_double");
		// 将重复手机号码插入到临时表，并携带重复手机号码中的最大记录ID，此ID房屋将保留做调查
		serviceCenterDao.getJdbcDao().insert("sql-sati-extractionCustomerRemoveDouble-insert-tmp1");
		// 将重复数据的手机号码置空
		serviceCenterDao.getJdbcDao().update("sql-sati-extractionCustomerRemoveDouble-update-tmp2");
		// 回写重复手机号码对应ID
		serviceCenterDao.getJdbcDao().update("sql-sati-extractionCustomerRemoveDouble-update-tmp3");
		// 将没有号码的记录删除，剩下的就是100%样本
		serviceCenterDao.getJdbcDao().delete("sql-sati-extractionCustomerRemoveDouble-delete-tmp4");
		// end
		
		// 预约客户跟强制抽取客户可能会重复，需要去重
		clearTable("sati_extraction_double");
		serviceCenterDao.getJdbcDao().insert("sql-sati-extractionCustomerRemoveDouble-insert-tmp11");
		serviceCenterDao.getJdbcDao().delete("sql-sati-extractionCustomerRemoveDouble-delete-tmp12");
		
		// 强制抽取客户可能会重复，需要去重
		clearTable("sati_extraction_double");
		// 将重复客户ID插入到临时表，并携带重复客户ID中的最大记录ID，此客户将保留做调查
		serviceCenterDao.getJdbcDao().insert("sql-sati-extractionCustomerRemoveDouble-insert-tmp21");
		// 将重复数据的客户ID置空
		serviceCenterDao.getJdbcDao().update("sql-sati-extractionCustomerRemoveDouble-update-tmp22");
		// 回写重复客户ID对应ID
		serviceCenterDao.getJdbcDao().update("sql-sati-extractionCustomerRemoveDouble-update-tmp23");
		// 将没有客户ID的记录删除，剩下的就是100%样本
		serviceCenterDao.getJdbcDao().delete("sql-sati-extractionCustomerRemoveDouble-delete-tmp24");
	}
	

	/**
	 * 抽取客户：抽取房屋下满足调查的客户
	 * @param questionnaire
	 */
	private void createResult(SatiQuestionnaireConfig questionnaire){
		
		int remainingDay = questionnaire.getRemainingDay();		
		
		// 保存预约客户信息 需要加上网格
		deleteAllData("sati_result_subscribe", questionnaire.getQuestionnaireId());
		serviceCenterDao.getJdbcDao().insert("sql-sati-createresule-result2", questionnaire.getQuestionnaireId());
		
		// 计算项目网格完成率
		List<SatiResultProject> satiResult1ProjectList = 
				serviceCenterRnDao.getJdbcDao().queryForList(SatiResultProject.class, 
						"sql-sati-createresule-result1", questionnaire.getQuestionnaireId());
		
		for(SatiResultProject satiResult1Project:satiResult1ProjectList){
			satiResult1Project.setQuestionnaireId(questionnaire.getQuestionnaireId());
			
			int total                = satiResult1Project.getTotal();//总房屋数
			float annualCompleteRate = Float.parseFloat(questionnaire.getAnnualCompleteRate());//年度完成比例
			int annualCompleteCount  = Integer.parseInt(questionnaire.getAnnualCompleteCount());//年度完成最低限额
			int completeTotal        = satiResult1Project.getCompleteTotal();//已完成总数
			
			int targetTotal = (int)(total * annualCompleteRate)+1;//年度总完成数
			if(targetTotal < annualCompleteCount){
				targetTotal = annualCompleteCount;
			}	
			
			// 获取本月目标数
			int thisMonTarget = questionnaire.getThisMonthTarget(completeTotal, targetTotal);
			
			/**
			 * 计算今天目标数
			 * DelayHandleType = 1，目标数平均到后面天数
			 * DelayHandleType = 2，今天目标=今天目标+昨天未完成的
			 *     本月剩余数 - 昨天剩余 = 往后目标
			 *     往后目标/剩余天天 = 今天目标（平均）
			 *     今天目标（平均） + 昨天剩余 = 今天真正目标
			 */
			int targetToday = 0;
			int targetTodayOriginal = thisMonTarget/remainingDay;
			if(questionnaire.getDelayHandleType().equals("1")){
				targetToday = targetTodayOriginal;				
			}else{
				int leftYestoday = satiResult1Project.getLeftYestoday();//昨天剩余数
				targetToday = (thisMonTarget-leftYestoday)/remainingDay+leftYestoday;
			}
			satiResult1Project.setTargetTotal(targetTotal);
			satiResult1Project.setTargetToday(targetToday);
			satiResult1Project.setTargetTodayOriginal(targetTodayOriginal);
			satiResult1Project.setRecordDate(DateUtils.toDate(DateUtils.toString(new Date(), DateUtils.DATE_FORMAT)));
			if(null == satiResult1Project.getCompleteToday()){
				satiResult1Project.setCompleteToday(0);
			}
			
		}
		// 保存项目完成率信息
		serviceCenterDao.delete("delete p from sati_result_project p where p.questionnaire_id = #questionnaireId# and p.record_date = DATE_FORMAT(NOW(), '%Y-%m-%d')", questionnaire);
		serviceCenterDao.batchInsert(SatiResultProject.class, satiResult1ProjectList);
		
		// 保存结果客户信息
		deleteAllData("sati_result_customer", questionnaire.getQuestionnaireId());
		serviceCenterDao.getJdbcDao().insert("sql-sati-createresule-result3", questionnaire.getQuestionnaireId());
		
		//当强制抽取客户大于当天目标时，删除多余强制抽取客户
		List<Map<String, Object>> cxcessBubscribeList = 
				serviceCenterRnDao.getJdbcDao().queryForListMap("sql-sati-extractionCustomer-select-subscribe1",
						questionnaire.getQuestionnaireId(),questionnaire.getQuestionnaireId());
		if(null != cxcessBubscribeList && cxcessBubscribeList.size() > 0){
			for(Map<String, Object> cxcessBubscribe : cxcessBubscribeList){
				serviceCenterDao.getJdbcDao().delete("sql-sati-extractionCustomer-delete-subscribe2",
						questionnaire.getQuestionnaireId(),cxcessBubscribe.get("PROJECT_ID"),cxcessBubscribe.get("GRID_ID"),cxcessBubscribe.get("COUNT"));
			}
		}
	}	
	
	/**
	 * 删除某个表下指定问卷的数据
	 * @param tableName 数据库表名
	 * @param questionnaireId 问卷ID
	 */
	private void deleteAllData(String tableName,String questionnaireId){		
		String sql = "delete from " + tableName + " where questionnaire_id = ? ";
		serviceCenterDao.getJdbcDao().delete(sql, questionnaireId);
	}
	
	/**
	 * 清除整张表的数据
	 * @param tableName 数据库表名
	 */
	private void clearTable(String tableName){
		String sql = "TRUNCATE " + tableName;
		serviceCenterDao.getJdbcDao().execute(sql);
	}
	
	// For Test
	public static void main(String[] args){
		try{
			SatiSchedule service = ApplicationFactory.getBeanForName(SatiSchedule.class,"satiSchedule");
			service.scheduleStrat();
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			System.exit(0);
		}
		//System.out.println(MD5.encrypt("20151113162740vkcrmwymap"));
		
		//System.out.println(getRemainingDay());
	}
	
	
}























