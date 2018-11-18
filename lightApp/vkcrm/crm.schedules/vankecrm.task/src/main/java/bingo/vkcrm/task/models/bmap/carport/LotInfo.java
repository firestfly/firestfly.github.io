package bingo.vkcrm.task.models.bmap.carport;

/**
 * Created by szsonic on 2015/11/22.
 */
public class LotInfo {
    private String id;
    private String lotnm;
    private String lotcode;
    private String projcode;
    private String status;
    private String statusuptime;
    private Boolean isDeleted;

    public String getLotnm() {
        return lotnm;
    }

    public void setLotnm(String lotnm) {
        this.lotnm = lotnm;
    }

    public String getLotcode() {
        return lotcode;
    }

    public void setLotcode(String lotcode) {
        this.lotcode = lotcode;
    }

    public String getProjcode() {
        return projcode;
    }

    public void setProjcode(String projcode) {
        this.projcode = projcode;
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

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof LotInfo) {
            LotInfo u = (LotInfo) obj;
            return u.getLotcode().equals(this.getLotcode());
        }
        return super.equals(obj);
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
}