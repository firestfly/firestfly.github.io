package bingo.vkcrm.service.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 *  字段说明注解
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface FieldInfo {
    //字段中文名称
    String fieldChineseName() default "";
    //字段说明
    String fieldDescription() default  "";
}
