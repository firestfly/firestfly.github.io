package bingo.vkcrm.service.task.v1.models;

/**
 * Created by szsonic on 2015/9/29.
 */
public class TaskHouseInfo {
    private String projectId;
    private String projectCode;
    private String projectName;
    private String houseCode;
    private String houseName;
    private String houseId;
    private Boolean isHasNotice;

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getHouseCode() {
        return houseCode;
    }

    public void setHouseCode(String houseCode) {
        this.houseCode = houseCode;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public Boolean getIsHasNotice() {
        return isHasNotice;
    }

    public void setIsHasNotice(Boolean isHasNotice) {
        this.isHasNotice = isHasNotice;
    }


    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }
}
