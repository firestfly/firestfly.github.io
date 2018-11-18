package bingo.vkcrm.service.house.v1.models.bmap;

/**
 * Created by szsonic on 2016/3/21/021.
 */
public class BmapResponse {
    private BmapResponseHead head;
    private BmapResponseResult result;

    public BmapResponseHead getHead() {
        return head;
    }

    public void setHead(BmapResponseHead head) {
        this.head = head;
    }

    public BmapResponseResult getResult() {
        return result;
    }

    public void setResult(BmapResponseResult result) {
        this.result = result;
    }
}
