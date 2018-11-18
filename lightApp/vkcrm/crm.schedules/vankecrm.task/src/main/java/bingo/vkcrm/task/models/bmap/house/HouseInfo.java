package bingo.vkcrm.task.models.bmap.house;

/**
 * Created by szsonic on 2015/11/24.
 */
public class HouseInfo {
    private String propnm;
    private String propcode;
    private String buildcode;
    private String unit;
    private String floor;
    private String roomnmbr;
    private String orient;
    private String layout;
    private String grossarea;
    private String innerarea;
    private String propstatus;
    private String occupydate;
    private String deliverdate;
    private String billingdate;
    private String statusuptime;//修改时间，战图给的该房屋的数据变动时间，包括新增，修改，删除。
    private String prpright;//产权类型
    private String abrev;
    private String supplementarycode;//辅助编码
    private Integer propertytype;
    public String getPropnm() {
        return propnm;
    }

    public void setPropnm(String propnm) {
        this.propnm = propnm;
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

    public String getOrient() {
        return orient;
    }

    public void setOrient(String orient) {
        this.orient = orient;
    }

    public String getLayout() {
        return layout;
    }

    public void setLayout(String layout) {
        this.layout = layout;
    }

    public String getGrossarea() {
        return grossarea;
    }

    public void setGrossarea(String grossarea) {
        this.grossarea = grossarea;
    }

    public String getInnerarea() {
        return innerarea;
    }

    public void setInnerarea(String innerarea) {
        this.innerarea = innerarea;
    }

    public String getPropstatus() {
        return propstatus;
    }

    public void setPropstatus(String propstatus) {
        this.propstatus = propstatus;
    }

    public String getOccupydate() {
        return occupydate;
    }

    public void setOccupydate(String occupydate) {
        this.occupydate = occupydate;
    }

    public String getDeliverdate() {
        return deliverdate;
    }

    public void setDeliverdate(String deliverdate) {
        this.deliverdate = deliverdate;
    }

    public String getBillingdate() {
        return billingdate;
    }

    public void setBillingdate(String billingdate) {
        this.billingdate = billingdate;
    }

    public String getStatusuptime() {
        return statusuptime;
    }

    public void setStatusuptime(String statusuptime) {
        this.statusuptime = statusuptime;
    }

    public String getPrpright() {
        return prpright;
    }

    public void setPrpright(String prpright) {
        this.prpright = prpright;
    }

    public String getAbrev() {
        return abrev;
    }

    public void setAbrev(String abrev) {
        this.abrev = abrev;
    }

    public String getSupplementarycode() {
        return supplementarycode;
    }

    public void setSupplementarycode(String supplementarycode) {
        this.supplementarycode = supplementarycode;
    }

    public Integer getPropertytype() {
        return propertytype;
    }

    public void setPropertytype(Integer propertytype) {
        this.propertytype = propertytype;
    }
}
