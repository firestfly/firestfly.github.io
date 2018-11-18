package bingo.vkcrm.service.house.v1.models.bmap;

/**
 * Created by szsonic on 2016/3/21/021.
 */
public class BmapResponseProps {
    private String propid;
    private String abrev;
    private String propcode;
    private String buildcode;
    private String unit;
    private String floor;
    private String roomnmbr;
    private String propertyarea;
    private String status;
    private String statusuptime;

    public String getPropid() {
        return propid;
    }

    public void setPropid(String propid) {
        this.propid = propid;
    }

    public String getAbrev() {
        return abrev;
    }

    public void setAbrev(String abrev) {
        this.abrev = abrev;
    }

    public String getPropcode() {
        return propcode;
    }

    public void setPropcode(String propcode) {
        this.propcode = propcode;
    }

    public String getBuildcode() {
        return buildcode;
    }

    public void setBuildcode(String buildcode) {
        this.buildcode = buildcode;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getRoomnmbr() {
        return roomnmbr;
    }

    public void setRoomnmbr(String roomnmbr) {
        this.roomnmbr = roomnmbr;
    }

    public String getPropertyarea() {
        return propertyarea;
    }

    public void setPropertyarea(String propertyarea) {
        this.propertyarea = propertyarea;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusuptime() {
        return statusuptime;
    }

    public void setStatusuptime(String statusuptime) {
        this.statusuptime = statusuptime;
    }
}
