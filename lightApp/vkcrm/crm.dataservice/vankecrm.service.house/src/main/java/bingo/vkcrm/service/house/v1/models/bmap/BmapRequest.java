package bingo.vkcrm.service.house.v1.models.bmap;

/**
 * Created by szsonic on 2016/3/21/021.
 */
public class BmapRequest {
    private BmapRequestHead head;
    private BmapParameter parameter;

    public BmapRequestHead getHead() {
        return head;
    }

    public void setHead(BmapRequestHead head) {
        this.head = head;
    }

    public BmapParameter getParameter() {
        return parameter;
    }

    public void setParameter(BmapParameter parameter) {
        this.parameter = parameter;
    }
}
