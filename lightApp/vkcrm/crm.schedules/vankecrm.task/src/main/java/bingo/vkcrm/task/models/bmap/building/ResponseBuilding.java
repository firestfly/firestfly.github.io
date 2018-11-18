package bingo.vkcrm.task.models.bmap.building;

import bingo.vkcrm.task.models.bmap.common.ResponseCommonHead;

/**
 * Created by szsonic on 2015/11/22.
 */
public class ResponseBuilding {
    private ResponseCommonHead head;
    private ResultBuilding result;

    public ResponseCommonHead getHead() {
        return head;
    }

    public void setHead(ResponseCommonHead head) {
        this.head = head;
    }

    public ResultBuilding getResult() {
        return result;
    }

    public void setResult(ResultBuilding result) {
        this.result = result;
    }
}
