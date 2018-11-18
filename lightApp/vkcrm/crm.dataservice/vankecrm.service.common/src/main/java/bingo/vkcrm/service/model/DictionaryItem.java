package bingo.vkcrm.service.model;


import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;

/**
 * 字典表对象
 */
public class DictionaryItem implements Serializable {

    private static final long serialVersionUID = 522889572773714584L;

    /**
     * 数据项ID
     */
    private String id;
    /**
     * 数据项编码
     */
    private String code;
    /**
     * 数据值
     */
    private String value;
    /**
     * 类型名称
     */
    private String typeName;
    /**
     * 字典编码
     */
    private String dictionaryCode;
    /**
     * 是否已删除
     */
    private Boolean isDeleted;
    /**
     * 使用系统
     */
    private String useIn;
    /**
     * 使用方
     */
    private String[] useInArr;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getDictionaryCode() {
        return dictionaryCode;
    }

    public void setDictionaryCode(String dictionaryCode) {
        this.dictionaryCode = dictionaryCode;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public String getUseIn() {
        return useIn;
    }

    public void setUseIn(String useIn) {
        this.useIn = useIn;
        if (StringUtils.isEmpty(this.useIn)) {
            this.useInArr = new String[0];
        } else {
            this.useInArr = StringUtils.split(this.useIn, ",");
        }
    }

    public String[] getUseInArr() {
        return this.useInArr;
    }
}
