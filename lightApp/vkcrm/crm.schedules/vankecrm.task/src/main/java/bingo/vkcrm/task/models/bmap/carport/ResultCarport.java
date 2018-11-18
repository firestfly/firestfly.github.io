package bingo.vkcrm.task.models.bmap.carport;

import bingo.vkcrm.task.models.bmap.common.BaseResult;

import java.util.List;

/**
 * Created by szsonic on 2015/11/24.
 */
public class ResultCarport extends BaseResult {
    private List<CarportInfo> parks;

    public List<CarportInfo> getParks() {
        return parks;
    }

    public void setParks(List<CarportInfo> parks) {
        this.parks = parks;
    }
}
