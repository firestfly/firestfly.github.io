package bingo.vkcrm.task.services;

import bingo.common.core.utils.DateUtils;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.task.models.questionnaire.*;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;
import sun.security.krb5.internal.PAData;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Wangzr on 16/2/22.
 */
@Service
public class SurveyService extends BaseService {

    private static final Log log = LogFactory.getLog(SurveyService.class);

    public List<SurveyConfiguration> queryQuestionnaires() {
        log.debug("SurveyService.queryQuestionnaires() -> begin");
        List<SurveyConfiguration> configurations = bizRoDao.queryForList(SurveyConfiguration.class, "sql.query.questionanire", null);
        log.debug("SurveyService.queryQuestionnaires() -> 获取到配置数量:" + configurations.size());
        log.debug("SurveyService.queryQuestionnaires() -> end");
        return configurations;
    }

    /**
     * @param tableName       数据库表名
     * @param questionnaireId 问卷ID
     */
    private void clearTable(String tableName, String questionnaireId) {
        log.debug("SurveyService.clearTable() -> begin <- " + tableName + " | " + questionnaireId);
        String sql = "delete from " + tableName + " where questionnaire_id = ? ";
        centerDao.getJdbcDao().delete(sql, questionnaireId);
        log.debug("SurveyService.queryQuestionnaires() -> 根据问卷id清空表数据");
        log.debug("SurveyService.clearTable() -> end <- " + tableName + " | " + questionnaireId);
    }

    /**
     * 清空表数据
     *
     * @param tableName 表名
     */
    private void truncateTable(String tableName) {
        log.debug("SurveyService.truncateTable() -> begin <- " + tableName);
        String sql = "truncate table " + tableName;
        centerDao.getJdbcDao().delete(sql);
        log.debug("SurveyService.queryQuestionnaires() -> 清空表数据");
        log.debug("SurveyService.truncateTable() -> end <- " + tableName);
    }

    /**
     * 获取要进行问卷调查的项目和网格信息
     * 从项目选择表获取选择的项目信息
     * <p>
     * 抽取项目信息，直接从项目选择表复制数据
     *
     * @param configuration 问卷配置信息
     */
    public void extractProject(SurveyConfiguration configuration) {
        log.debug("SurveyService.extractProject() -> begin <-" + configuration.getQuestionnaireId());

        // 清除项目信息
        clearTable("sati_extraction_project", configuration.getQuestionnaireId());

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("questionnaireId", configuration.getQuestionnaireId());

        // 从问卷的配置中获取选中的项目
        List<String> projects = bizRoDao.queryForList(String.class, "sql.query.questionnaire.project", parameters);
        log.debug("SurveyService.extractProject() -> 获取问卷关联项目:" + projects.size());
        // 加入用于抽取的项目表
        // centerDao.batchInsert(SurveyProject.class, projects);
        log.debug("SurveyService.extractProject() -> 插入关联项目数据到表sati_extraction_project");

        String projectIds = "'" + StringUtils.join(projects, "','") + "'";
        parameters.put("projectIds", projectIds);
        // 获取项目网格信息
        centerDao.insert("sql.insert.questionnaire.project.grid", parameters);


        log.debug("SurveyService.extractProject() -> end <-" + configuration.getQuestionnaireId());
    }

    /**
     * 抽取项目下符合要求的房屋，形成房屋池，此份数据将作为调查的基数
     *
     * @param configuration
     */
    public void extractHouse(SurveyConfiguration configuration) {
        log.debug("SurveyService.extractHouse() -> begin <-" + configuration.getQuestionnaireId());
        // 清除房屋信息
        clearTable("sati_extraction_house", configuration.getQuestionnaireId());

        // 抽取房屋
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("questionnaireId", configuration.getQuestionnaireId());
        parameters.put("deliverMonthMoreThan", configuration.getDeliverMonthMoreThan());
        parameters.put("deliverMonthLessThan", configuration.getDeliverMonthLessThan());

        // 抽取符合交付年限的房屋
        centerDao.insert("sql.insert.questionanire.house", parameters);
        log.debug("SurveyService.extractHouse() -> end <-" + configuration.getQuestionnaireId());
    }


    /**
     * 抽取常用联系人
     *
     * @param configuration
     */
    public void extractContacts(SurveyConfiguration configuration) {
        log.debug("SurveyService.extractContacts() -> begin <-" + configuration.getQuestionnaireId());

        // 抽取常用联系人
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("questionnaireId", configuration.getQuestionnaireId());
        parameters.put("ageMoreThan", configuration.getCustomerAgeMoreThan());
        parameters.put("ageLessThan", configuration.getCustomerAgeLessThan());

        // 抽取房屋常用联系人
        centerDao.insert("sql.update.questionnaire.contacts", parameters);
        log.debug("SurveyService.extractContacts() -> end <-" + configuration.getQuestionnaireId());
    }

    /**
     * 抽取业主
     *
     * @param configuration
     */
    public void extractOwner(SurveyConfiguration configuration) {
        log.debug("SurveyService.extractOwner() -> begin <-" + configuration.getQuestionnaireId());

        // 抽取常用联系人
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("questionnaireId", configuration.getQuestionnaireId());
        parameters.put("ageMoreThan", configuration.getCustomerAgeMoreThan());
        parameters.put("ageLessThan", configuration.getCustomerAgeLessThan());

        // 抽取房屋常用联系人
        centerDao.insert("sql.update.questionnaire.owner", parameters);
        log.debug("SurveyService.extractOwner() -> end <-" + configuration.getQuestionnaireId());
    }

    /**
     * 问卷调查前更新法律纠纷客户，供所有问卷调查使用
     * <br>客户抽取后使用此方法更新的法律纠纷客户排除客户信息
     * <br>法律纠纷客户在法律纠纷期间不参与调查
     */
    public void extractSpecialIdentityCustomer(SurveyConfiguration configuration) {
        log.debug("SurveyService.extractSpecialIdentityCustomer() -> begin <-" + configuration.getQuestionnaireId());

        boolean hasLegalDispute = false;
        String[] identitiesArr = configuration.getExcludeSpecialidentities().split(",");
        for(int i = 0; i < identitiesArr.length; i++){
            if(identitiesArr[i] == "8"){
                // 法律纠纷客户
                hasLegalDispute = true;
                ArrayUtils.remove(identitiesArr, i);
                break;
            }
        }
        String identities = StringUtils.join(identitiesArr, ",");

        // 查询不接受调查客户
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("anomalousType", 1);
        parameters.put("identities", identities);
        parameters.put("questionnaireId", configuration.getQuestionnaireId());

        // 1.更新法律纠纷客户，拒绝调查客户
        // 清除特殊身份表数据
        truncateTable("sati_extraction_identity");

        // 更新法律纠纷客户
        centerDao.insert("sql.insert.questionnaire.subscribe", parameters);

        if(hasLegalDispute) {
            centerDao.insert("sql.insert.questionnaire.subscribe.legaldispute", parameters);
        }

        List<SurveyCustomer> anomalousCustomers =
                bizRoDao.queryForList(SurveyCustomer.class, "sql.query.questionnaire.anomalous", parameters);

        log.debug("SurveyService.extractSpecialIdentityCustomer() -> 获取不接受调查客户:" + anomalousCustomers.size());

        // 插入不接受调查客户
        centerDao.batchInsert(SurveyCustomer.class, anomalousCustomers);

        // 2.更新预约客户和强制抽取客户
        // 清除预约客户表数据
        truncateTable("sati_extraction_subscribe");

        // 查询预约客户，强制抽取客户
        List<SurveySubscriber> subscribers =
                bizRoDao.queryForList(SurveySubscriber.class, "sql.query.questionnaire.subscribe", parameters);

        log.debug("SurveyService.extractSpecialIdentityCustomer() -> 获取预约客户和强制抽取客户数:" + subscribers.size());

        // 保存预约客户信息
        centerDao.batchInsert(SurveySubscriber.class, subscribers);

        // 3.更新已完成调查客户列表
        // 清除已完成客户表
        truncateTable("sati_extraction_completed");

        List<SurveyCustomerCompleted> completedCustomers =
                bizRoDao.queryForList(SurveyCustomerCompleted.class, "sql.query.questionnaire.customer.completed", parameters);

        log.debug("SurveyService.extractSpecialIdentityCustomer() -> 清除已完成客户表:" + completedCustomers.size());

        centerDao.batchInsert(SurveyCustomerCompleted.class, completedCustomers);

        // 更新网格信息 sati_extraction_subscribe sati_extraction_completed
        centerDao.update("sql.update.questionnaire.subscribe.grid", null);
        log.debug("SurveyService.extractSpecialIdentityCustomer() -> 更新强制抽取客户所属网格");

        centerDao.update("sql.update.questionnaire.completed.grid", null);
        log.debug("SurveyService.extractSpecialIdentityCustomer() -> 更新已完成客户所属网格");

        log.debug("SurveyService.extractSpecialIdentityCustomer() -> end <-" + configuration.getQuestionnaireId());
    }


    /**
     * 抽取客户：抽取房屋下满足调查的客户
     *
     * @param configuration
     */
    public void extractCustomer(SurveyConfiguration configuration) {
        log.debug("SurveyService.extractCustomer() -> begin <-" + configuration.getQuestionnaireId());

        // 抽取常用联系人
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("questionnaireId", configuration.getQuestionnaireId());
        parameters.put("ageMoreThan", configuration.getCustomerAgeMoreThan());
        parameters.put("ageLessThan", configuration.getCustomerAgeLessThan());

        truncateTable("sati_extraction_customer");
        // 插入客户信息
        centerDao.insert("sql.insert.questionnaire.customer", parameters);
        log.debug("SurveyService.extractCustomer() -> 已插入客户信息");

        // 清除 已调查，强制抽取，预约，法律纠纷，拒绝调查客户 begin
        // 清理客户表数据 需要加上项目判断
        centerDao.getJdbcDao().delete("delete c5 from sati_extraction_customer c5 inner join sati_extraction_identity  i3 on c5.customer_id = i3.customer_id");
        centerDao.getJdbcDao().delete("delete c5 from sati_extraction_customer c5 inner join sati_extraction_subscribe s4 on c5.customer_id = s4.customer_id and c5.project_id = s4.project_id");
        centerDao.getJdbcDao().delete("delete c5 from sati_extraction_customer c5 inner join sati_extraction_subscribe s4 on c5.house_id = s4.house_id");
        centerDao.getJdbcDao().delete("delete c5 from sati_extraction_customer c5 inner join sati_extraction_completed c7 on c5.customer_id = c7.customer_id and c5.project_id = c7.project_id");
        centerDao.getJdbcDao().delete("delete c5 from sati_extraction_customer c5 inner join sati_extraction_completed c7 on c5.house_id = c7.house_id");
        // 清理预约客户表数据 需要加上项目判断
        centerDao.getJdbcDao().delete("delete s4 from sati_extraction_subscribe s4 inner join sati_extraction_identity  i3 on s4.customer_id = i3.customer_id");
        centerDao.getJdbcDao().delete("delete s4 from sati_extraction_subscribe s4 inner join sati_extraction_completed c7 on s4.customer_id = c7.customer_id and s4.project_id = c7.project_id");
        centerDao.getJdbcDao().delete("delete s4 from sati_extraction_subscribe s4 inner join sati_extraction_completed c7 on s4.house_id = c7.house_id");
        // end

        log.debug("SurveyService.extractCustomer() -> 已清除已调查，强制抽取，预约，法律纠纷，拒绝调查客户");

        // 去重 begin
        // 清理主要电话号码重复的客户 保留一个
        truncateTable("sati_extraction_double");
        // 将重复手机号码插入到临时表，并携带重复手机号码中的最大记录ID，此ID房屋将保留做调查
        // 将重复数据的手机号码置空
        // 回写重复手机号码对应ID
        // 将没有号码的记录删除，剩下的就是100%样本
        centerDao.getJdbcDao().execute("sql.exec.questionnaire.duplicate.mobile.insert");
        log.debug("SurveyService.extractCustomer() -> 添加重复的手机号到临时表");

        centerDao.getJdbcDao().execute("sql.exec.questionnaire.duplicate.mobile.updateByMobile");
        log.debug("SurveyService.extractCustomer() -> 将重复数据的手机号码置空");

        centerDao.getJdbcDao().execute("sql.exec.questionnaire.duplicate.mobile.updateById");
        log.debug("SurveyService.extractCustomer() -> 回写重复手机号码对应ID");

        centerDao.getJdbcDao().execute("sql.exec.questionnaire.duplicate.mobile.delete");
        log.debug("SurveyService.extractCustomer() -> 将没有号码的记录删除，剩下的就是100%样本");

        log.debug("SurveyService.extractCustomer() -> 已清除号码重复的客户");

        // 预约客户跟强制抽取客户可能会重复，需要去重
        truncateTable("sati_extraction_double");
        centerDao.getJdbcDao().execute("sql.exec.questionnaire.duplicate.customer.subscribe.insert");
        centerDao.getJdbcDao().execute("sql.exec.questionnaire.duplicate.customer.subscribe.delete");
        log.debug("SurveyService.extractCustomer() -> 已去重预约客户和强制抽取客户");

        // 强制抽取客户可能会重复，需要去重
        truncateTable("sati_extraction_double");
        // 将重复客户ID插入到临时表，并携带重复客户ID中的最大记录ID，此客户将保留做调查
        // 将重复数据的客户ID置空
        // 回写重复客户ID对应ID
        // 将没有客户ID的记录删除，剩下的就是100%样本
        centerDao.getJdbcDao().execute("sql.exec.questionnaire.duplicate.customer.force.insert");
        centerDao.getJdbcDao().execute("sql.exec.questionnaire.duplicate.customer.force.updateNull");
        centerDao.getJdbcDao().execute("sql.exec.questionnaire.duplicate.customer.force.update");
        centerDao.getJdbcDao().execute("sql.exec.questionnaire.duplicate.customer.force.delete");
        log.debug("SurveyService.extractCustomer() -> 已去重强制抽取客户");

        log.debug("SurveyService.extractCustomer() -> end <-" + configuration.getQuestionnaireId());
    }


    /**
     * 抽取客户：抽取房屋下满足调查的客户
     *
     * @param configuration
     */
    public void runExtract(SurveyConfiguration configuration) {

        log.debug("SurveyService.runExtract() -> begin <-" + configuration.getQuestionnaireId());

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("questionnaireId", configuration.getQuestionnaireId());

        int remainingDay = configuration.getRemainingDay();

        log.debug("SurveyService.runExtract() -> remaningDay " + configuration.getRemainingDay());

        // 保存预约客户信息 需要加上网格
        clearTable("sati_result_subscribe", configuration.getQuestionnaireId());

        centerDao.insert("sql.insert.questionnaire.result.subscribe.customer", parameters);
        log.debug("SurveyService.runExtract() -> 保存预约客户信息");

        // 计算项目网格完成率
        List<SurveyProjectResult> projects =
                centerRoDao.queryForList(SurveyProjectResult.class, "sql.query.questionnaire.result.project", parameters);

        log.debug("SurveyService.runExtract() -> 获取项目网格信息:" + projects.size());
        for (SurveyProjectResult project : projects) {
            project.setQuestionnaireId(configuration.getQuestionnaireId());

            log.debug("SurveyService.runExtract() -> for");
            log.debug("SurveyService.runExtract() -> " + project.toString());

            // 总房屋数
            int total = project.getTotal();
            // 年度完成比例
            float annualCompleteRate = Float.parseFloat(configuration.getAnnualCompleteRate());
            log.debug("SurveyService.runExtract() -> 年度完成比例: " + annualCompleteRate);

            // 年度完成最低限额
            int annualCompleteCount = Integer.parseInt(configuration.getAnnualCompleteCount());
            log.debug("SurveyService.runExtract() -> 年度完成最低限额: " + annualCompleteCount);

            // 已完成总数
            int completeTotal = project.getCompleteTotal();

            int targetTotal = (int) (total * annualCompleteRate) + 1;//年度总完成数
            if (targetTotal < annualCompleteCount) {
                targetTotal = annualCompleteCount;
            }
            log.debug("SurveyService.runExtract() -> 年度总完成数: " + targetTotal);

            // 获取本月目标数
            int thisMonTarget = configuration.getThisMonthTarget(completeTotal, targetTotal);
            log.debug("SurveyService.runExtract() -> 本月目标数: " + thisMonTarget);

            /**
             * 计算今天目标数
             * DelayHandleType = 1，目标数平均到后面天数
             * DelayHandleType = 2，今天目标=今天目标+昨天未完成的
             *     本月剩余数 - 昨天剩余 = 往后目标
             *     往后目标/剩余天天 = 今天目标（平均）
             *     今天目标（平均） + 昨天剩余 = 今天真正目标
             */
            int targetToday = 0;
            int targetTodayOriginal = thisMonTarget / remainingDay;
            if (configuration.getDelayHandleType().equals("1")) {
                targetToday = targetTodayOriginal;
            } else {
                // 昨天剩余数
                int leftYestoday = project.getLeftYestoday();
                targetToday = (thisMonTarget - leftYestoday) / remainingDay + leftYestoday;
            }
            log.debug("SurveyService.runExtract() -> 今天目标数: " + targetToday);

            project.setTargetTotal(targetTotal);
            project.setTargetToday(targetToday);
            project.setTargetTodayOriginal(targetTodayOriginal);
            project.setRecordDate(DateUtils.toDate(DateUtils.toString(new Date(), DateUtils.DATE_FORMAT)));

            if (null == project.getCompleteToday()) {
                project.setCompleteToday(0);
            }

            log.debug("SurveyService.runExtract() -> 今天是否已完成: " + project.getCompleteToday());
        }

        // 保存项目完成率信息
        centerDao.delete("delete p from sati_result_project p where p.questionnaire_id = #questionnaireId# and p.record_date = DATE_FORMAT(NOW(), '%Y-%m-%d')", configuration);
        centerDao.batchInsert(SurveyProjectResult.class, projects);

        log.debug("SurveyService.runExtract() -> 保存项目完成率信息");

        // 保存结果客户信息
        clearTable("sati_result_customer", configuration.getQuestionnaireId());
        centerDao.insert("sql.insert.questionnaire.result.customer", parameters);

        log.debug("SurveyService.runExtract() -> 保存结果客户信息");

        // 当强制抽取客户大于当天目标时，删除多余强制抽取客户
        List<SurveyCustomerResult> subscribeCustomers =
                centerRoDao.queryForList(SurveyCustomerResult.class, "sql.query.questionnaire.result.duplicate.subscribe", parameters);

        log.debug("SurveyService.runExtract() -> 获取多余强制抽取的客户:" + subscribeCustomers.size());

        if (null != subscribeCustomers && subscribeCustomers.size() > 0) {
            for (SurveyCustomerResult customer : subscribeCustomers) {
                parameters.clear();
                parameters.put("questionnaireId", configuration.getQuestionnaireId());
                parameters.put("projectId", customer.getProjectId());
                parameters.put("gridId", customer.getGridId());
                parameters.put("limit", customer.getCount());
                centerDao.delete("sql.delete.questionnaire.result.duplicate.subscribe", parameters);

                log.debug("SurveyService.runExtract() -> 删除多余强制抽取的客户: ProjectId:" + customer.getProjectId() + ", GridId:" + customer.getGridId() + ", Limit:" + customer.getCount());
            }
        }

        log.debug("SurveyService.runExtract() -> end <-" + configuration.getQuestionnaireId());
    }

}
