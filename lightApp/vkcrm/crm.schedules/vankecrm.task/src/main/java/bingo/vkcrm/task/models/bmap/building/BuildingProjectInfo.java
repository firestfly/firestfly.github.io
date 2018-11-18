package bingo.vkcrm.task.models.bmap.building;

import java.util.List;
import java.util.Map;

/**
 * Created by szsonic on 2016/1/9/009.
 */
public class BuildingProjectInfo {
    private String projectCode;
    private List<Map<String,String>> buildingInfo;


    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }


    public List<Map<String, String>> getBuildingInfo() {
        return buildingInfo;
    }

    public void setBuildingInfo(List<Map<String, String>> buildingInfo) {
        this.buildingInfo = buildingInfo;
    }


}
