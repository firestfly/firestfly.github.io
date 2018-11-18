package bingo.vkcrm.service.house.v1.models;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;

/**
 * Created by Wangzr on 15/8/30.
 */
@Table(name = "main_building")
public class Demo {

    /**
     * 房屋编码
     */
    @Column(name = "building_code")
    public String buildingCode;

    /**
     * 房屋名称
     */
    @Column(name = "building_name")
    public String buildingName;

    public String getBuildingCode() {
        return buildingCode;
    }

    public void setBuildingCode(String buildingCode) {
        this.buildingCode = buildingCode;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }
}
