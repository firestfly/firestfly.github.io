/**
 * This file created at 2015-10-20.
 * <p/>
 * Copyright (c) 2015-2025 Bingosoft, Inc. All rights reserved.
 */
package bingo.vkcrm.task.tasks;

import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.models.questionnaire.SurveyConfiguration;
import bingo.vkcrm.task.services.RecordService;
import bingo.vkcrm.task.services.SurveyService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


/**
 * <code>{@link QuestionnaireSurveyTask}</code>
 * <br>满意度调查客户抽取定时任务，每天凌晨进行客户抽取
 * <p/>
 * 相关需求：
 * 项目抽取规则：参加调查的项目从前台页面选取，不根据逻辑抽取。
 * 房屋抽取规则：
 * 抽取使用原始房屋，合并、拆分房不加入调查行列
 * 房屋交付日期必须大于6个月，小于100年
 * 最后一个月不加入新房屋
 * 客户抽取规则：
 * 客户种类：抽取房屋常用联系人，如果房屋没有常用联系人则随机抽取一个业主
 * 年龄限制：年龄大于18岁小于65岁 或 生日为空 或 生日=1900-01-01
 * 预约客户：预约客户必须抽取，过时则放入普通用户池
 * 强制抽取：电话无法接通客户第二天强制抽取（无人接听、无法接通、关机），标记为错号后有更正的客户强制抽取；当天完成比例后无需再抽取强制抽取客户
 * 法律纠纷：法律纠纷户在法律纠纷期间不参加调查
 * 不接受调查：调查时表态不接受调查的用户根据主题下配置不接受调查时长，在期间内不接受调查，其他主题不受影响
 * 一个客户在同个问卷、同个项目下不重复接受调查。不同问卷或不同项目可以重复接受调查
 * <p/>
 * 项目完成率计算：
 * 项目完成率粒度细化到网格
 * 保证每个月的完成比例跟问卷完成比例一致，如果突然增加很多房屋，压力堆积到当前月，以保证后续的月份完成比例正确
 * <p/>
 * <p/>
 * 相关计算公式：（细化粒度：网格）
 * 总目标数 = 下满足要求的总房屋数 * 问卷完成比例         (注：总目标数小于30按30算)
 * <p/>
 * 当月目标数量 = 总目标数 - 已完成总数 - 总目标数/总月份*(剩余月份-1)
 * 当月目标数量(最后一个月或延期期间) = 总目标数 - 已完成总数量
 * <p/>
 * 当天目标数量（平铺）= 当月目标数量/剩余天数
 * 当天目标数量（积压）= （当月目标数量 - 昨天剩余)/剩余天数 + 昨天剩余
 * 注：当天未完成数量有2种方式加入到后续天数：1平铺到当月往后天数 2全部数量积压到下一天
 * <p/>
 * <p/>
 * 相关表说明：
 * sati_extraction_project:存放满意度调查的项目、网格
 * sati_extraction_house:存放满意度调查的房屋和客户（满足调查要求的房屋，也用于计算完成目标数；此处的客户未去重，剔除法律纠纷、不接受调查客户）
 * sati_extraction_identity:存放在期间内的“法律纠纷户”和“不接受调查的客户”
 * sati_extraction_subscribe:存放预约客户和强制抽取客户，强制抽取客户无预约时间
 * sati_extraction_customer:存放抽取的客户，会在此表做客户去重，剔除法律纠纷、不接受调查、预约、强制抽取、已完成调查  的客户
 * sati_extraction_double:去重临时表
 * sati_extraction_completed:已完成调查的客户
 * <p/>
 * sati_result_project:计算项目网格完成率，目标数量等信息，抽取客户时再此预扣数量
 * sati_result_subscribe:存放预约客户，强制抽取客户
 * sati_result_customer:存放普通抽取客户池
 * <p/>
 * <br>客户抽取步骤
 * <br>1.抽取参与调查的项目，存放到 sati_extraction_project
 * <br>2.抽取满足调查要求的房屋，存放到 sati_extraction_house
 * <br>3.更新特殊客户身份数据：法律纠纷、拒绝调查、强制提取、预约客户、已完成调查客户 sati_extraction_identity，sati_extraction_subscribe，sati_extraction_completed
 * <br>4.抽取调查房屋常用联系人，形成客户池 sati_extraction_customer
 * <br>5.从客户池、预约客户表中剔除重复数据
 * <br>6.计算项目完成度信息，方便前台抽取客户
 *
 */
public class QuestionnaireSurveyTask extends AbstractQuartzTask {

    private static final Log log = LogFactory.getLog(QuestionnaireSurveyTask.class);

    private SurveyService service;

    @Override
    public boolean onAfter(JobExecutionContext jobExecutionContext) throws Exception {
        return true;
    }

    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        log.debug("<======问卷调查抽取开始======>");
        service = (SurveyService) jobExecutionContext.getMergedJobDataMap().get("surveyService");

        // 查询运行中的问卷调查，开始做问卷抽取
        List<SurveyConfiguration> questionnaires = service.queryQuestionnaires();

        if (questionnaires != null) {
            log.debug("需要进行抽取的问卷有" + questionnaires.size() + "个");
        } else {
            log.debug("没有需要进行抽取的问卷有");
        }

        for (SurveyConfiguration configuration : questionnaires) {

            // 第一次问卷数据库缺少规则设置，设置默认值
            configuration.setAnnualCompleteCount("30");
            // 接管时间大于6个月
            configuration.setDeliverMonthMoreThan(6);
            // 接管时间小于100年
            configuration.setDeliverMonthLessThan(1200);
            // 客户年龄大于18岁
            configuration.setCustomerAgeMoreThan(18);
            configuration.setDelayHandleType("2");

            log.info("准备开始进行问卷 " + configuration.getQuestionnaireId() + " 的用户抽取");
            log.debug("问卷规则: " + configuration.toString());

            // 进行一个问卷调查抽取
            extractQuestionnaire(configuration);
        }

        log.debug("<======问卷调查抽取结束======>");

        return true;
    }

    /**
     * 更新一个问卷调查
     *
     * @param configuration 问卷配置信息
     */
    private void extractQuestionnaire(SurveyConfiguration configuration) {

        /**
         * 由于防止结束日期最后一个月出现大量交付的房屋
         * 所以,结束日期的最后一个月不再更新房屋，项目数据
         * 例如:开始时间是1月份,结束时间是12月份,那么6月份交付房屋,12月份开始进行抽取,则会出现12月份出现抽取大量房屋和客户,
         * 所以结束日期的最后一个月不再进行项目和房屋的抽取
         */
        if (configuration.isLastMonthFirstDateLagerThanToday()) {
            log.info("QuestionnaireId: " + configuration.getQuestionnaireId() + " 最后一个月,不进行抽取项目和房屋 ");

        } else {
            log.info("QuestionnaireId: " + configuration.getQuestionnaireId() + " 开始抽取项目");
            service.extractProject(configuration);

            log.info("QuestionnaireId: " + configuration.getQuestionnaireId() + " 开始抽取房屋");
            service.extractHouse(configuration);
        }

        // 最后一个月不更新项目，房屋信息，房屋常用联系人、业主需要更新。所以提前到外面
        log.info("QuestionnaireId: " + configuration.getQuestionnaireId() + " 开始抽取常用联系人");
        service.extractContacts(configuration);

        // 没有常用联系人的房屋，随机抽取一个业主
        log.info("QuestionnaireId: " + configuration.getQuestionnaireId() + " 开始抽取业主");
        service.extractOwner(configuration);

        // 更新特殊身份客户数据
        log.info("QuestionnaireId: " + configuration.getQuestionnaireId() + " 开始抽取特殊身份客户数据");
        service.extractSpecialIdentityCustomer(configuration);

        // 抽取客户，并剔除法律纠纷户、不接受调查客户等客户
        log.info("QuestionnaireId: " + configuration.getQuestionnaireId() + " 开始抽取客户");
        service.extractCustomer(configuration);

        // 生成结果
        log.info("QuestionnaireId: " + configuration.getQuestionnaireId() + " 生成抽取结果");
        service.runExtract(configuration);
    }

    @Override
    public boolean onBefore(JobExecutionContext jobExecutionContext) throws Exception {
        return true;
    }

    @Override
    public void onException(JobExecutionContext jobExecutionContext, String fromMethod, Exception exception) {

    }

}























