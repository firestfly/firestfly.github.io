package bingo.vkcrm.task.models.bmap.carport;

import java.text.SimpleDateFormat;

/**
 * Created by szsonic on 2015/11/24.
 */
public class CarportInfo {
    private String id;
    private String location;
    private String parkcode;
    private String lotcode;
    private String parktype;
    private String prpright;
    private String parkarea;
    private String status;
    private String projectCode;
    private String statusuptime;
    private Boolean isDeleted;

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getParkcode() {
        return parkcode;
    }

    public void setParkcode(String parkcode) {
        this.parkcode = parkcode;
    }

    public String getLotcode() {
        return lotcode;
    }

    public void setLotcode(String lotcode) {
        this.lotcode = lotcode;
    }

    public String getParktype() {
        return parktype;
    }

    public void setParktype(String parktype) {
        this.parktype = parktype;
    }

    public String getPrpright() {
        return prpright;
    }

    public void setPrpright(String prpright) {
        this.prpright = prpright;
    }

    public String getParkarea() {
        return parkarea;
    }

    public void setParkarea(String parkarea) {
        this.parkarea = parkarea;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getStatusuptime() {
        return statusuptime;
    }

    public void setStatusuptime(String statusuptime) {
        this.statusuptime = statusuptime;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object obj) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        boolean flag=false;
        try {
            if (obj instanceof CarportInfo) {
                CarportInfo carportInfo = (CarportInfo) obj;
                if (carportInfo.getParkcode().equals(this.getParkcode())) {
                    if (carportInfo.getStatusuptime() != null) {
                        if (sdf.parse(carportInfo.getStatusuptime()).getTime() > sdf.parse(this.getStatusuptime()).getTime()) {

                            flag= false;
                        } else {
                            flag= true;
                        }
                    } else {
                        flag= false;
                    }
                } else {
                    flag= false;
                }
            } else {
                flag= false;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            return flag;
        }
    }
}
