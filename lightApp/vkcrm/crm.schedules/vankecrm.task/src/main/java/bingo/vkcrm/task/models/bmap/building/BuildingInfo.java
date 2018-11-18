package bingo.vkcrm.task.models.bmap.building;

/**
 * Created by szsonic on 2015/11/22.
 */
public class BuildingInfo {
    private String buildingname;
    private String buildingcode;
    private String supplementarycode;
    private String projectcode;
    private String period;
    private String status;
    private String abrev;//别名
    private String takenovertime;//接管时间

    public String getBuildingname() {
        return buildingname;
    }

    public void setBuildingname(String buildingname) {
        this.buildingname = buildingname;
    }

    public String getBuildingcode() {
        return buildingcode;
    }

    public void setBuildingcode(String buildingcode) {
        this.buildingcode = buildingcode;
    }

    public String getSupplementarycode() {
        return supplementarycode;
    }

    public void setSupplementarycode(String supplementarycode) {
        this.supplementarycode = supplementarycode;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProjectcode() {
        return projectcode;
    }

    public void setProjectcode(String projectcode) {
        this.projectcode = projectcode;
    }

    public String getAbrev() {
        return abrev;
    }

    public void setAbrev(String abrev) {
        this.abrev = abrev;
    }

    public String getTakenovertime() {
        return takenovertime;
    }

    public void setTakenovertime(String takenovertime) {
        this.takenovertime = takenovertime;
    }
}
