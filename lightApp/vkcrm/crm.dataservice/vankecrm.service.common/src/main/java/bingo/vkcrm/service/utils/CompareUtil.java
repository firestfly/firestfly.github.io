package bingo.vkcrm.service.utils;

import bingo.vkcrm.service.model.Comparison;
import org.apache.commons.lang3.StringUtils;

import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 *  数据字段比较器工具类
 */
public class CompareUtil {

    /**
     * 比较两个对象差异数据
     *
     * @param beforeObject 修改前
     * @param afterObject  修改后
     * @param fields       比较字段
     * @param different    差异？
     * @return
     * @throws Exception
     */
    public static List<Comparison> compareObject(Object beforeObject, Object afterObject, Map<String, String> fields, boolean different) throws Exception {
        List<Comparison> sames = new ArrayList<Comparison>();
        List<Comparison> differents = new ArrayList<Comparison>();
        if (beforeObject == null) throw new Exception("beforeObject不能为空!");
        if (afterObject == null) throw new Exception("afterObject不能为空!");
        if (!beforeObject.getClass().isAssignableFrom(afterObject.getClass())) {
            throw new Exception("类元数据信息不同，无法比较");
        }
        //去除对象所有字段
        PropertyDescriptor[] propertyDescriptors = Introspector.getBeanInfo(beforeObject.getClass()).getPropertyDescriptors();
        Set<String> keys = fields.keySet();
        for (String key : keys) {
            for (PropertyDescriptor descriptor : propertyDescriptors) {
                String propertyName = descriptor.getName();
                if (StringUtils.isNotEmpty(propertyName) && propertyName.equalsIgnoreCase(key)) {
                    Comparison comparison = new Comparison();
                    Method readMethod = descriptor.getReadMethod();
                    comparison.setBefore(readMethod.invoke(beforeObject));
                    comparison.setAfter(readMethod.invoke(afterObject));
                    comparison.setFieldType(descriptor.getPropertyType());
                    comparison.setField(propertyName);
                    comparison.setFieldName(fields.get(key));
                    if (comparison.isDifferent()) {
                        sames.add(comparison);
                    } else {
                        differents.add(comparison);
                    }
                }
            }
        }
        if (different) {
            return differents;
        } else {
            return sames;
        }
    }
}
