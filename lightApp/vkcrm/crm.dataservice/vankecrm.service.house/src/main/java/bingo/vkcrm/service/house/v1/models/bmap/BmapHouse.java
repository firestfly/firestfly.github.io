package bingo.vkcrm.service.house.v1.models.bmap;

/**
 * Created by szsonic on 2016/3/18/018.
 */
public class BmapHouse {
    private String propid;
    private String id;
    private String type;
    private String propertycode;
    private String buildingcode;
    private String propertyarea;
    private String unit;
    private String roomnmbr;
    private String floor;

    public String getPropid() {
        return propid;
    }

    public void setPropid(String propid) {
        this.propid = propid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPropertycode() {
        return propertycode;
    }

    public void setPropertycode(String propertycode) {
        this.propertycode = propertycode;
    }

    public String getBuildingcode() {
        return buildingcode;
    }

    public void setBuildingcode(String buildingcode) {
        this.buildingcode = buildingcode;
    }

    public String getPropertyarea() {
        return propertyarea;
    }

    public void setPropertyarea(String propertyarea) {
        this.propertyarea = propertyarea;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getRoomnmbr() {
        return roomnmbr;
    }

    public void setRoomnmbr(String roomnmbr) {
        this.roomnmbr = roomnmbr;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }
}
