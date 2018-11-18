package bingo.vkcrm.service.questionnaire.v1.services;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bingo.vkcrm.service.exceptions.NotFoundException;
import bingo.vkcrm.service.questionnaire.v1.model.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import bingo.vkcrm.service.questionnaire.v1.model.SatisfactionResultProject;
import bingo.vkcrm.service.service.BaseService;

/**
 * <code>{@link QuestionnaireExtractionService}</code>
 * 客户满意度调查服务类
 *
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 * @version 1.00, 2015-10-26
 * @since JDK 1.6
 */
@Service
public class QuestionnaireExtractionService extends BaseService {


    protected final Logger log = LoggerFactory.getLogger(this.getClass());

    /**
     * 抽取客户
     * 1.查看是否有预约客户，优先抽取
     * 2.查看是否有强制抽取客户，优先抽取
     * 3.从客户池抽取客户
     *
     * @param questionnaireId 问卷ID
     * @return 客户信息
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     * @version 1.00, 2015-10-26
     * @since JDK 1.6
     */
    @Deprecated
    public ExtractionCustomer extraction(String questionnaireId) {

        for (int i = 0; i < 10; i++) {// 优先提取预约客户
            log.debug("开始提取预约客户.....");
            SatisfactionResultSubscribe satisfactionResultSubscribe = centerRoDao.getJdbcDao().queryForObject(SatisfactionResultSubscribe.class,
                    "sql.questionnaire.extraction.subscribe.getCustomer", questionnaireId);
            if (null != satisfactionResultSubscribe) {
                log.debug("有预约客户：房屋ID,{houseId};客户ID,{customerId}。开始预扣客户.....", satisfactionResultSubscribe);
                // 修改预约客户，如果修改失败可能已经被其它人抽取了
                int count = centerDao.getJdbcDao().update("sql.questionnaire.extraction.updateCustomerStatus", satisfactionResultSubscribe.getId());
                if (count > 0) {//返回客户信息
                    return getCustomer(questionnaireId, satisfactionResultSubscribe.getProjectId(),
                            satisfactionResultSubscribe.getGridId(), satisfactionResultSubscribe.getHouseId(), satisfactionResultSubscribe.getCustomerId());
                } else {// 被其它业务员抢了客户，重新抽取
                    log.debug("预扣客户失败");
                    continue;
                }
            } else {
                break;
            }
        }

        for (int i = 0; i < 10; i++) {// 提取强制抽取客户
            log.debug("开始提取强制抽取客户.....");
            SatisfactionResultSubscribe satisfactionResultSubscribe = centerRoDao.getJdbcDao().queryForObject(SatisfactionResultSubscribe.class,
                    "sql.questionnaire.extraction.compulsion.getCustomer", questionnaireId);
            if (null != satisfactionResultSubscribe) {
                log.debug("有强制抽取客户：房屋ID,{houseId};客户ID,{customerId}。开始预扣客户.....", satisfactionResultSubscribe);
                // 修改预约客户，如果修改失败可能已经被其它人抽取了
                int count = centerDao.getJdbcDao().update("sql.questionnaire.extraction.updateCustomerStatus", satisfactionResultSubscribe.getId());
                if (count > 0) {// 预约预扣成功，返回客户信息
                    return getCustomer(questionnaireId, satisfactionResultSubscribe.getProjectId(),
                            satisfactionResultSubscribe.getGridId(), satisfactionResultSubscribe.getHouseId(), satisfactionResultSubscribe.getCustomerId());
                } else {// 被其它业务员抢了客户，重新抽取
                    log.debug("预扣客户失败");
                    continue;
                }
            } else {
                break;
            }
        }

        for (int i = 0; i < 10; i++) {
            // 获取今天完成率最低的项目
            log.debug("开始提取客户池客户，查询今天完成率最低项目......");
            SatisfactionResultProject project = centerRoDao.getJdbcDao().queryForObject(SatisfactionResultProject.class, "sql.questionnaire.extraction.lowComplete.getProject", questionnaireId);
            if (null != project) {
                log.debug("查询项目信息成功。查询客户样本数量。");

                int count = centerDao.getJdbcDao().update("sql.questionnaire.extraction.project.update", project.getId());
                if (count > 0) {// 预扣成功，从客户池随机抽取一个客户
                    Integer customerCount = centerRoDao.getJdbcDao().queryForInt("sql.questionnaire.extraction.project.count", project.getProjectId(), questionnaireId);
                    if (customerCount < 1) {
                        continue;
                    }

                    // 从客户池中随机抽取客户（根据项目、网格ID）
                    SatisfactionResultCustomer satisfactionResultCustomer = null;
                    try {
                        satisfactionResultCustomer = centerRoDao.getJdbcDao().queryForObject(SatisfactionResultCustomer.class,
                                "sql.questionnaire.extraction.stochastic.getCustomer", project.getProjectId(), project.getGridId(),
                                questionnaireId, (int) (Math.random() * customerCount));
                    } catch (Exception e) {
                        log.error("随机抽取客户失败");
                    }
                    // 获取客户信息失败则返回
                    if (null == satisfactionResultCustomer) {
                        continue;
                    }
                    // 预扣客户，如果预扣失败返回0，成功则返回1
                    count = centerDao.getJdbcDao().update("sql.questionnaire.extraction.customer.update", satisfactionResultCustomer.getId());
                    if (count > 0) {// 预约预扣成功，返回客户信息
                        return getCustomer(questionnaireId, satisfactionResultCustomer.getProjectId(), satisfactionResultCustomer.getGridId(),
                                satisfactionResultCustomer.getHouseId(), satisfactionResultCustomer.getCustomerId());
                    } else {// 被其它业务员抢了客户，重新抽取
                        log.debug("预扣客户失败");
                        continue;
                    }
                }
            } else {
                log.debug("查询项目信息失败......");
            }
        }

        return null;
    }

    /**
     * 通过房屋ID, 客户ID，获取客户，房屋信息
     *
     * @param houseId    房屋ID
     * @param customerId 客户ID
     * @return ExtractionCustomer 客户信息，包括项目，房屋等信息
     */
    private ExtractionCustomer getCustomer(String questionnaireId, String projectId, String gridId, String houseId, String customerId) {
        ExtractionCustomer extractionCustomer = null;
        extractionCustomer = centerRoDao.getJdbcDao().queryForObject(ExtractionCustomer.class,
                "sql.questionnaire.extraction.customer.getCustomer", projectId, houseId, customerId);

        // 设置客户标签
        List<DimAnomalousTags> dimAnomalousTagsList = bizRoDao.getJdbcDao().queryForList
                (DimAnomalousTags.class, "sql.questionnaire.extraction.customer.getAnomalousTags", customerId);

        for (DimAnomalousTags dimAnomalousTags : dimAnomalousTagsList) {
            // 设置客户主要手机号码标签
            if (StringUtils.isEmpty(extractionCustomer.getMainMobileTag()) && dimAnomalousTags.getTagValue().equals(extractionCustomer.getMainMobile())) {
                extractionCustomer.setMainMobileTag(dimAnomalousTags.getErrorCategory());
            }
            // 设置客户备用手机号码标签
            if (StringUtils.isEmpty(extractionCustomer.getStandbyMobileTag()) && dimAnomalousTags.getTagValue().equals(extractionCustomer.getStandbyMobile())) {
                extractionCustomer.setStandbyMobileTag(dimAnomalousTags.getErrorCategory());
            }
            // 设置客户家庭电话号码标签
            if (StringUtils.isEmpty(extractionCustomer.getHomeTelTag()) && dimAnomalousTags.getTagValue().equals(extractionCustomer.getHomeTel())) {
                extractionCustomer.setHomeTelTag(dimAnomalousTags.getErrorCategory());
            }
            // 设置客户办公电话号码标签
            if (StringUtils.isEmpty(extractionCustomer.getOfficeTelTag()) && dimAnomalousTags.getTagValue().equals(extractionCustomer.getOfficeTel())) {
                extractionCustomer.setOfficeTelTag(dimAnomalousTags.getErrorCategory());
            }
        }

        // 查询今天项目完成度
        SatisfactionResultProject satisfactionResultProject = centerRoDao.getJdbcDao().queryForObject
                (SatisfactionResultProject.class, "sql.questionnaire.extraction.project.get", questionnaireId, projectId, gridId);

        if(null == satisfactionResultProject){
            return null;
        }

        // 查询项目未来5天的预约剩余数
        List<SubscribeCount> subscribeCounts =
                bizRoDao.getJdbcDao().queryForList(SubscribeCount.class,
                        "sql.questionnaire.extraction.customer.getSubscribeCustomerCount", questionnaireId, projectId);

        for (SubscribeCount subscribeCount : subscribeCounts) {
            int subscribeTime = subscribeCount.getSubscribeTime();
            //可预约数=今天任务数(每天完成数+前一天剩余数)-未来每一天的预约数-前一天剩余数
            //int count = satisfactionResultProject.getTargetToday() - subscribeCount.getCount() - (satisfactionResultProject.getYesterdayTotal() == null ? 0 : satisfactionResultProject.getYesterdayTotal());
            //由于目前采用前一天剩余数均摊算法,所以可预约数=今天任务数-未来每一天的预约数
            int count = satisfactionResultProject.getTargetToday() - subscribeCount.getCount();
            if (subscribeTime == 1) {
                extractionCustomer.setDate1subscribe(count);
            } else if (subscribeTime == 2) {
                extractionCustomer.setDate2subscribe(count);
            } else if (subscribeTime == 3) {
                extractionCustomer.setDate3subscribe(count);
            } else if (subscribeTime == 4) {
                extractionCustomer.setDate4subscribe(count);
            } else if (subscribeTime == 5) {
                extractionCustomer.setDate5subscribe(count);
            }
        }

        extractionCustomer.setDate1subscribe(extractionCustomer.getDate1subscribe() == null ? satisfactionResultProject.getTargetToday() : extractionCustomer.getDate1subscribe());
        extractionCustomer.setDate2subscribe(extractionCustomer.getDate2subscribe() == null ? satisfactionResultProject.getTargetToday() : extractionCustomer.getDate2subscribe());
        extractionCustomer.setDate3subscribe(extractionCustomer.getDate3subscribe() == null ? satisfactionResultProject.getTargetToday() : extractionCustomer.getDate3subscribe());
        extractionCustomer.setDate4subscribe(extractionCustomer.getDate4subscribe() == null ? satisfactionResultProject.getTargetToday() : extractionCustomer.getDate4subscribe());
        extractionCustomer.setDate5subscribe(extractionCustomer.getDate5subscribe() == null ? satisfactionResultProject.getTargetToday() : extractionCustomer.getDate5subscribe());

        log.debug("预扣客户成功，返回客户信息。", extractionCustomer);
        return extractionCustomer;
    }

    /**
     * 抽取客户
     *
     * @param questionnaireId 问卷ID
     * @param userId          用户ID
     * @return
     */
    public ExtractionCustomer extraction(String questionnaireId, String userId) throws Exception {
        ExtractionCustomer customer;
        //线程休眠
        Thread.sleep((int) Math.random() * 1000);
        //抽取预约客户
        customer = extractionSubscribeCustomer(questionnaireId, userId);
        if (null != customer) {
            return customer;
        }
        //抽取强制抽取客户
        customer = extractionCompulsionCustomer(questionnaireId, userId);
        if (null != customer) {
            return customer;
        }
        //抽取客户池客户
        customer = extractionCustomer(questionnaireId, userId);
        return customer;
    }

    /**
     * 抽取预约客户
     *
     * @param questionnaireId 问卷ID
     * @return
     */
    private ExtractionCustomer extractionSubscribeCustomer(String questionnaireId, String userId) throws Exception {
        log.debug("开始提取预约客户.....");
        //随机更新一条预约客户数据为已处理,且话务员ID为当前用户以及更新时间为当前时间
        Date currentDate = new Date();
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("userId", userId);
        paramMap.put("currentDate", currentDate);
        paramMap.put("formatDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(currentDate));
        paramMap.put("questionnaireId", questionnaireId);

        centerDao.update("sql.questionnaire.extraction.appointment.customer.update", paramMap);

        SatisfactionResultSubscribe satisfactionResultSubscribe = centerDao.queryForObject(SatisfactionResultSubscribe.class, "sql.questionnaire.extraction.appointment.customer.get", paramMap);

        if (null != satisfactionResultSubscribe) {
            log.debug("抽取到预约客户：房屋ID：{houseId};客户ID：{customerId}。开始预扣客户.....", satisfactionResultSubscribe);
            return getCustomer(questionnaireId, satisfactionResultSubscribe.getProjectId(),
                    satisfactionResultSubscribe.getGridId(), satisfactionResultSubscribe.getHouseId(), satisfactionResultSubscribe.getCustomerId());
        } else {
            return null;
        }
    }

    /**
     * 强制抽取客户
     *
     * @param questionnaireId 问卷ID
     * @return
     */
    private ExtractionCustomer extractionCompulsionCustomer(String questionnaireId, String userId) throws Exception {
        log.debug("开始提取强制抽取客户.....");
        //随机更新一条强制抽取客户数据为已处理,且话务员ID为当前用户以及更新时间为当前时间
        Date currentDate = new Date();
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("userId", userId);
        paramMap.put("currentDate", currentDate);
        paramMap.put("formatDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(currentDate));
        paramMap.put("questionnaireId", questionnaireId);

        centerDao.update("sql.questionnaire.extraction.compulsion.customer.update", paramMap);

        SatisfactionResultSubscribe satisfactionResultSubscribe = centerDao.queryForObject(SatisfactionResultSubscribe.class, "sql.questionnaire.extraction.compulsion.customer.get", paramMap);

        if (null != satisfactionResultSubscribe) {
            log.debug("抽取到强制抽取客户：房屋ID：{houseId};客户ID：{customerId}。开始预扣客户.....", satisfactionResultSubscribe);
            return getCustomer(questionnaireId, satisfactionResultSubscribe.getProjectId(),
                    satisfactionResultSubscribe.getGridId(), satisfactionResultSubscribe.getHouseId(), satisfactionResultSubscribe.getCustomerId());
        } else {
            return null;
        }
    }

    /**
     * 抽取客户池客户
     *
     * @param questionnaireId 问卷ID
     * @return
     */
    private ExtractionCustomer extractionCustomer(String questionnaireId, String userId) throws Exception {
        log.debug("开始提取客户池客户，查询今天完成率最低项目......");
        //已排除无网格ID的数据
        SatisfactionResultProject project = centerDao.getJdbcDao().queryForObject(SatisfactionResultProject.class, "sql.questionnaire.extraction.lowComplete.getProject", questionnaireId);

        if (null != project) {
            log.debug("查询项目信息成功。查询客户样本数量。");
            Date currentDate = new Date();
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("userId", userId);
            paramMap.put("currentDate", currentDate);
            paramMap.put("formatDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(currentDate));
            paramMap.put("questionnaireId", questionnaireId);
            paramMap.put("projectId", project.getProjectId());
            paramMap.put("gridId", project.getGridId());

            centerDao.update("sql.questionnaire.extraction.stochastic.customer.update", paramMap);

            //随机更新一条客户池客户数据为已处理,且话务员ID为当前用户以及更新时间为当前时间
            SatisfactionResultCustomer satisfactionResultCustomer = centerDao.queryForObject(SatisfactionResultCustomer.class, "sql.questionnaire.extraction.stochastic.customer.get", paramMap);

            // 获取客户信息失败则返回
            if (null == satisfactionResultCustomer) {
                return null;
            }

            log.debug("抽取到客户,扣除目标任务数");
            //扣除目标任务数
            centerDao.getJdbcDao().update("sql.questionnaire.extraction.project.updateComplete", project.getId(), project.getProjectId(), project.getGridId(), project.getQuestionnaireId());

            log.debug("预扣成功,返回客户信息");
            // 预约预扣成功，返回客户信息
            return getCustomer(questionnaireId, satisfactionResultCustomer.getProjectId(), satisfactionResultCustomer.getGridId(),
                    satisfactionResultCustomer.getHouseId(), satisfactionResultCustomer.getCustomerId());
        }
        return null;
    }


    /**
     * 扣减今天完成数：满意度调查不成功时需要扣减今天的完成数
     * 1.客户拒绝调查扣减完成数
     * 2.客户预约且预约时间不在今天的，扣减
     * 3.断线
     * 4.用户4个号码都无法接通
     */
    public void deductionTodayCompleteCount(String questionnaireId, String projectId, String houseId, String customerId) {
//        List<String> projectIds = getProjects(customerId);
//        deductionTodayCompleteProject(projectIds);
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("projectId", projectId);
        paramsMap.put("questionnaireId", questionnaireId);
        paramsMap.put("customerId", customerId);
        paramsMap.put("houseId", houseId);
        centerDao.update("sql.questionnaire.extraction.deductionTodayCompleteProject", paramsMap);
    }

    /**
     * 根据客户ID查询出相关联的项目编码
     *
     * @param customerId
     * @return
     */
    public List<String> getProjects(String customerId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("customerId", customerId);
        return centerRoDao.queryForList(String.class, "sql.questionnaire.extraction.projects", paramsMap);
    }

    /**
     * 根据项目ID扣减今日完成数
     *
     * @param projectIds
     */
    public void deductionTodayCompleteProject(List<String> projectIds) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        if (null != projectIds && projectIds.size() > 0) {
            for (String projectId : projectIds) {
                paramsMap.put("projectId", projectId);
                centerDao.update("sql.questionnaire.extraction.deductionTodayCompleteProject", paramsMap);
            }
        }
    }

    /**
     * 客户预约时间为当天时，将客户插入到预约队列表
     */
    public void addToSubscribe(SubscribeCustomer subscribeCustomer) {
        Map<String,Object> paramMap = new HashMap<String, Object>();
        paramMap.put("questionnaireId",subscribeCustomer.getQuestionnaireId());
        paramMap.put("projectId",subscribeCustomer.getProjectId());
        paramMap.put("houseId",subscribeCustomer.getHouseId());
        paramMap.put("customerId",subscribeCustomer.getCustomerId());
        paramMap.put("appointmentTime",subscribeCustomer.getSubscribeTime());
        paramMap.put("telephonistId",subscribeCustomer.getTelephonistId());
        paramMap.put("status","0");
        centerDao.insert("sql.questionnaire.extraction.appointment.customer.insert",paramMap);
    }


}
