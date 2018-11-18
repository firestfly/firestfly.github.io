package bingo.vkcrm.task.models.bmap.house;

import bingo.vkcrm.task.models.bmap.common.BaseResult;

import java.util.List;

/**
 * Created by szsonic on 2015/11/24.
 */
public class ResultHouse extends BaseResult{
    private List<HouseInfo> props;


    public List<HouseInfo> getProps() {
        return props;
    }

    public void setProps(List<HouseInfo> props) {
        this.props = props;
    }
}
