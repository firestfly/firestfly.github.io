package bingo.vkcrm.component.excel;

import bingo.dao.IDao;

import java.util.Map;

/**
 * Created by Wangzr on 16/3/4.
 */
public class ExportParameters {

    private String[] columnsHeader = null;
    private String[] columnsId = null;
    private String[] columnsType = null;
    private String[] columnsAlign = null;
    private String daoName;
    private String sqlId;
    private String sqlCountId;
    private Map<String, Object> parameters = null;
    private String orderBy;

    public String[] getColumnsHeader() {
        return columnsHeader;
    }

    public void setColumnsHeader(String[] columnsHeader) {
        this.columnsHeader = columnsHeader;
    }

    public String[] getColumnsId() {
        return columnsId;
    }

    public void setColumnsId(String[] columnsId) {
        this.columnsId = columnsId;
    }

    public String[] getColumnsType() {
        return columnsType;
    }

    public void setColumnsType(String[] columnsType) {
        this.columnsType = columnsType;
    }

    public String[] getColumnsAlign() {
        return columnsAlign;
    }

    public void setColumnsAlign(String[] columnsAlign) {
        this.columnsAlign = columnsAlign;
    }

    public String getDaoName() {
        return daoName;
    }

    public void setDaoName(String daoName) {
        this.daoName = daoName;
    }

    public String getSqlCountId() {
        return sqlCountId;
    }

    public void setSqlCountId(String sqlCountId) {
        this.sqlCountId = sqlCountId;
    }

    public String getSqlId() {
        return sqlId;
    }

    public void setSqlId(String sqlId) {
        this.sqlId = sqlId;
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }

    public void setParameters(Map<String, Object> parameters) {
        this.parameters = parameters;
    }

    public String getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(String orderBy) {
        this.orderBy = orderBy;
    }
}
