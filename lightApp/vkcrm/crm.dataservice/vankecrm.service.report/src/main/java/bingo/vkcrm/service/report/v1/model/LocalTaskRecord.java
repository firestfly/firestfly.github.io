package bingo.vkcrm.service.report.v1.model;

/**
 * Created by szsonic on 2016/1/23/023.
 */
public class LocalTaskRecord {
    private String tsakNo;
    private String processingWay;
    private String creator;
    public String getTsakNo() {
        return tsakNo;
    }

    public void setTsakNo(String tsakNo) {
        this.tsakNo = tsakNo;
    }

    public String getProcessingWay() {
        return processingWay;
    }

    public void setProcessingWay(String processingWay) {
        this.processingWay = processingWay;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }
}
