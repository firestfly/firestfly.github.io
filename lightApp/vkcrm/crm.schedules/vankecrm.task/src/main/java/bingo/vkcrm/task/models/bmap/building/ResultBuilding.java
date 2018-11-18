package bingo.vkcrm.task.models.bmap.building;

import bingo.vkcrm.task.models.bmap.common.BaseResult;

import java.util.List;

/**
 * Created by szsonic on 2015/11/22.
 */
public class ResultBuilding extends BaseResult {
    private List<BuildingInfo> buildings;

    public List<BuildingInfo> getBuildings() {
        return buildings;
    }

    public void setBuildings(List<BuildingInfo> buildings) {
        this.buildings = buildings;
    }
}
