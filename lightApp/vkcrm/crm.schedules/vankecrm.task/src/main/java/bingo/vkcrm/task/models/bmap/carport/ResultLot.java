package bingo.vkcrm.task.models.bmap.carport;

import bingo.vkcrm.task.models.bmap.common.BaseResult;

import java.util.List;

/**
 * Created by szsonic on 2015/11/22.
 */
public class ResultLot extends BaseResult {
    private List<LotInfo> lots;

    public List<LotInfo> getLots() {
        return lots;
    }

    public void setLots(List<LotInfo> lots) {
        this.lots = lots;
    }
}
