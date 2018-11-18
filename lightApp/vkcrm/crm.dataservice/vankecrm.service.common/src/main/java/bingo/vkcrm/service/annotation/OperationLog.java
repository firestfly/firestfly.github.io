package bingo.vkcrm.service.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 操作日志注解
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface OperationLog {
    //操作名称
    String operationName() default "";

    //操作类型
    OperationType operationType() default OperationType.Select;

    //ID参数下标数组
    int[] idIndex() default {0};

    //Spring中对于的Bean名称
    String springServiceName() default "";

    //目标类信息
    Class targetClass() default Object.class;

    //目标执行方法
    String targetMethod() default "getObjectById";

    //返回类型类信息
    Class resultClass() default Object.class;

    //缓存到消息队列中的key
    String queueKey() default  "";
}

