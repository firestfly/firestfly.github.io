package bingo.vkcrm.service.aspect;

import bingo.common.core.ApplicationContext;
import bingo.common.core.ApplicationFactory;
import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.annotation.FieldInfo;
import bingo.vkcrm.service.annotation.OperationLog;
import bingo.vkcrm.service.annotation.OperationType;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.common.UserContext;
import bingo.vkcrm.service.exceptions.AspectRunTimeException;
import bingo.vkcrm.service.model.Comparison;
import bingo.vkcrm.service.model.DataChangeLog;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.utils.CompareUtil;
import bingo.vkcrm.service.utils.HttpUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 操作日志，AOP拦截器
 */
@Aspect
@Component
public class OperationLogAspect {

    private static final Log log = LogFactory.getLog(OperationLogAspect.class);

    private static final String SERVICE_NAME = ApplicationContext.getProperty("Profile.Application.Name", "服务");

    private static final String CUSTOMER_SERVICE_NAME = ApplicationContext.getProperty("aop.query.customer.service", "customerService");

    private static final String CUSTOMER_METHOD_NAME = ApplicationContext.getProperty("aop.query.customer.method", "queryCustomerInfo");

    @Autowired
    private HttpServletRequest httpServletRequest;

    /**
     * 根据特定注解形成切面
     */
    @Pointcut("@annotation(bingo.vkcrm.service.annotation.OperationLog)")
    public void initPointcut() {
        log.debug("形成切面.");
    }

    /**
     * 环绕通知
     */
    @Around(value = "initPointcut() && @annotation(annotation)", argNames = "annotation")
    public Object aroundPointcut(ProceedingJoinPoint proceedingJoinPoint, OperationLog operationLog) throws Throwable {
        Object result = null;
        log.debug("环绕通知");
        log.debug(operationLog.operationName());
        log.debug(operationLog.operationType());

        if (operationLog.operationType() == OperationType.UpdateEntity) {
            try {
                result = logUpdateEntity(proceedingJoinPoint, operationLog);
            } catch (Exception e) {
                if (e instanceof AspectRunTimeException) {
                    e.printStackTrace();
                    log.error(e.getMessage());
                } else {
                    throw e;
                }
            }
        } else {
            result = proceedingJoinPoint.proceed();
        }
        return result;
    }

    /**
     * 后置通知
     */
    public void afterPointcut() {

    }

    /**
     * 前置通知
     */
    public void beforePointcut() {

    }

    /**
     * 返回后通知
     */
    @AfterReturning(value = "initPointcut() && @annotation(annotation)", argNames = "annotation")
    public void afterReturningPointcut(JoinPoint joinPoint, OperationLog operationLog) {
        log.debug("返回后通知");
        log.debug(operationLog.operationName());
        log.debug(operationLog.operationType());
        try {

        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }

    /**
     * 抛出异常后通知
     */
    public void afterThrowingPointcut() {

    }

    /**
     * 记录查询操作的日志
     */
    private void logSelect(ProceedingJoinPoint proceedingJoinPoint, OperationLog operationLog) throws Exception {

    }

    /**
     * 记录更新数据操作的日志
     */
    private Object logUpdateEntity(ProceedingJoinPoint proceedingJoinPoint, OperationLog operationLog) throws Throwable {
        //获取access_token
        String accessToken = StringUtils.isNotEmpty(httpServletRequest.getHeader("Authorization")) ? httpServletRequest.getHeader("Authorization").replace("Bearer ", "") : "";

        Object result;
        String buildingId = null;
        String buildingType = null;
        Map<String, Object> customerInfo;
        String customerId = null;
        String customerName = null;

        int idIndex = 0;

        //代理方法中得参数数组
        Object[] args = proceedingJoinPoint.getArgs();

        //获取ID参数所在参数数组下标
        int customerIdIndex = operationLog.idIndex()[0];

        if (operationLog.idIndex().length > 1) {
            int buildingIdIndex = operationLog.idIndex()[1];
            int buildingTypeIndex = operationLog.idIndex()[2];
            buildingId = args[buildingIdIndex] != null ? args[buildingIdIndex].toString() : "";
            buildingType = args[buildingTypeIndex] != null ? args[buildingTypeIndex].toString() : "";
            customerId = args[customerIdIndex] != null ? args[customerIdIndex].toString() : "";
            BaseService customerService = (BaseService) ApplicationFactory.getBeanForName(CUSTOMER_SERVICE_NAME);

            Method customerMethod = BaseService.class.getDeclaredMethod(CUSTOMER_METHOD_NAME, String.class);

            customerInfo = (Map<String, Object>) customerMethod.invoke(customerService, args[customerIdIndex]);

            if (customerInfo != null) {
                customerName = customerInfo.get("fullName") != null ? customerInfo.get("fullName").toString() : "";
            }
        }

        if (operationLog.idIndex().length > 3) {
            idIndex = operationLog.idIndex()[3];
        } else {
            idIndex = customerIdIndex;
        }

        // 查询方法名称
        String targetMethod = operationLog.targetMethod();
        //获取服务类信息
        Class serviceClazz = operationLog.targetClass();
        if (serviceClazz == null) {
            throw new AspectRunTimeException("服务类信息为空");
        }
        //获取返回结果类信息
        Class resultClazz = operationLog.resultClass();
        if (resultClazz == null) {
            throw new AspectRunTimeException("结果类信息为空");
        }

        //spring上下文中的service类实例名
        String springServiceName = operationLog.springServiceName();
        if (StringUtils.isEmpty(springServiceName)) {
            throw new AspectRunTimeException("spring服务名为空");
        }
        //从spring上下文中取出对应的service实例
        BaseService springService = (BaseService) ApplicationFactory.getBeanForName(springServiceName);
        //获取返回结果字段信息
        Field[] fields = resultClazz.getDeclaredFields();
        //获取具体的执行方法
        Method method = serviceClazz.getDeclaredMethod(targetMethod, String.class);

        //执行方法，通过service实例，参数数组执行，获取数据
        Object currentResult = method.invoke(springService, args[idIndex]);

        result = proceedingJoinPoint.proceed();

        Object updatedResult = method.invoke(springService, args[idIndex]);

        Map<String, String> fieldInfoMap = getFiledInfoMap(fields);
        //获取比较后得出的变化值信息
        List<Comparison> comparisonList = CompareUtil.compareObject(currentResult, updatedResult, fieldInfoMap, true);
        //获取注解的表名
        Table table = (Table) resultClazz.getAnnotation(Table.class);
        String tableName;
        if (table == null) {
            throw new AspectRunTimeException("该实体类未配置Table注解，无法获得表名");
        }
        tableName = table.name();
        //获取客户端IP地址
        String clientIP = HttpUtil.getIpAddress(httpServletRequest);
        User user = UserContext.getCurrentUser();
        DataChangeLog dataChangeLog = new DataChangeLog();
        dataChangeLog.setAppId("--- --- --- ---");
        dataChangeLog.setServiceName(SERVICE_NAME);
        dataChangeLog.setAccessToken(accessToken);
        dataChangeLog.setClientIP(clientIP);
        dataChangeLog.setChangeEntityClass(resultClazz.toString());
        dataChangeLog.setTableName(tableName);
        dataChangeLog.setComparisonList(comparisonList);
        dataChangeLog.setCreateDate(new Date());
        dataChangeLog.setBuildingId(buildingId);
        dataChangeLog.setBuildingType(buildingType);
        dataChangeLog.setCustomerId(customerId);
        dataChangeLog.setCustomerName(customerName);
        dataChangeLog.setUserId(user.getLoginId());
        dataChangeLog.setUserName(user.getName());
        log2RedisMQ(dataChangeLog);

        return result;
    }

    /**
     * 记录更新关联操作的日志
     */
    private void logUpdateRelation(ProceedingJoinPoint proceedingJoinPoint, OperationLog operationLog) throws Exception {

    }

    /**
     * 记录创建操作的日志
     */
    private void logCreate(ProceedingJoinPoint proceedingJoinPoint, OperationLog operationLog) throws Exception {

    }

    /**
     * 记录删除操作的日志
     */
    private void logDelete(ProceedingJoinPoint proceedingJoinPoint, OperationLog operationLog) throws Exception {

    }

    /**
     * 获取目标类中的字段信息以及说明信息
     *
     * @param fields
     * @return
     */
    private Map<String, String> getFiledInfoMap(Field[] fields) throws Exception {
        Map<String, String> fieldInfoMap = new HashMap<String, String>();
        for (Field field : fields) {
            //获取字段中特定的注解信息
            FieldInfo fieldInfo = field.getAnnotation(FieldInfo.class);
            if (fieldInfo != null && StringUtils.isNotEmpty(fieldInfo.fieldChineseName())) {
                fieldInfoMap.put(field.getName(), fieldInfo.fieldChineseName());
            }
        }
        return fieldInfoMap;
    }

    /**
     * 存入Redis消息队列
     *
     * @param dataChangeLog
     */
    private void log2RedisMQ(DataChangeLog dataChangeLog) {
        try {
            if (dataChangeLog != null) {
                String jsonString = JsonUtil.toJson(dataChangeLog);
                String accessLogKey = ApplicationContext.getProperty("log.dataChangeLog.key", "DataChangeLog");
                JedisUtil.defaultDb().lpush(accessLogKey.getBytes("UTF-8"), jsonString.getBytes("UTF-8"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }

}
