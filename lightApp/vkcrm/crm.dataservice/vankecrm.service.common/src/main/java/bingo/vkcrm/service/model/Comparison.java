package bingo.vkcrm.service.model;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.gson.annotations.Expose;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 比较器
 */
@Table(name = "log_data_modify_item")
public class Comparison {
    /**
     * 日志id
     */
    private String id;
    /**
     * 字段
     */
    @Column(name = "businessId")
    private String field;
    /**
     * 名称
     */
    @Column(name = "businessFieldName")
    private String fieldName;
    /**
     * 类型
     */
    @Expose
    @Column(update = false)
    private Class<?> fieldType;
    /**
     * 修改前
     */
    private Object before;
    /**
     * 修改后
     */
    private Object after;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public Class<?> getFieldType() {
        return fieldType;
    }

    public void setFieldType(Class<?> fieldType) {
        this.fieldType = fieldType;
    }

    public Object getBefore() {
        return before;
    }

    public void setBefore(Object before) {
        this.before = before;
    }

    public Object getAfter() {
        return after;
    }

    public void setAfter(Object after) {
        this.after = after;
    }

    public boolean isDifferent() {
        if (before == null && after == null) return true;
        if (before == null || after == null) return false;
        if (fieldType.isAssignableFrom(Integer.class)) {
            if ((Integer) before == (Integer) after) return true;
        } else if (fieldType.isAssignableFrom(Boolean.class)) {
            if ((Boolean) before == (Boolean) after) return true;
        } else if (fieldType.isAssignableFrom(Long.class)) {
            if ((Long) before == (Long) after) return true;
        } else if (fieldType.isAssignableFrom(java.util.Date.class) || fieldType.isAssignableFrom(Date.class)) {
            if (((java.util.Date) before).compareTo((java.util.Date) after) == 0) return true;
        } else if (fieldType.isAssignableFrom(Timestamp.class)) {
            if (((Timestamp) before).compareTo((Timestamp) after) == 0) return true;
        } else {
            if (((String) before).equals((String) after)) return true;
        }
        return false;
    }

    private String objectString(Object object) {
        if (object == null) object = null;
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        if (fieldType.isAssignableFrom(Integer.class) || fieldType.isAssignableFrom(Long.class)) {
            return (String) object;
        } else if (fieldType.isAssignableFrom(Boolean.class)) {
            return (((Boolean) object) ? "1" : "0");
        } else if (fieldType.isAssignableFrom(java.util.Date.class) || fieldType.isAssignableFrom(Date.class)) {
            return dateFormat.format((java.util.Date) object);
        } else if (fieldType.isAssignableFrom(Timestamp.class)) {
            return dateFormat.format((Timestamp) object);
        } else {
            return (String) object;
        }
    }
}
