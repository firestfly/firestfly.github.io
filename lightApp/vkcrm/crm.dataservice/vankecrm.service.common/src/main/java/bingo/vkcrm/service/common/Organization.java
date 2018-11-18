package bingo.vkcrm.service.common;

/**
 * 组织信息
 */
public interface Organization {
    /**
     * 项目编码
     */
    String projectId = "";

    /**
     * 项目名称
     */
    String projectName = "";

    /**
     * 网格编码
     */
    String gridId = "";

    /**
     * 网格名称
     */
    String gridName = "";

    /**
     * 运营中心编码
     */
    String organizationId = "";

    /**
     * 运营中心名称
     */
    String organizationName = "";

    /**
     * 管理中心编码
     */
    String manageCenterId = "";

    /**
     * 管理中心名称
     */
    String manageCenterName = "";

    void setGridId(String gridId);

    void setGridName(String gridName);

    void setOrganizationId(String organizationId);

    void setOrganizationName(String organizationName);

    void setProjectId(String projectId);

    void setProjectName(String projectName);

    String getGridId();

    String getGridName();

    String getOrganizationId();

    String getOrganizationName();

    String getProjectId();

    String getProjectName();
}

