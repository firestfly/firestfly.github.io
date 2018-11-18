package bingo.vkcrm.task.models.bmap.carport;

import bingo.vkcrm.task.models.bmap.common.ResponseCommonHead;

/**
 * Created by szsonic on 2015/11/22.
 */
public class ResponseLot {
    private ResponseCommonHead head;
    private ResultLot result;

    public ResponseCommonHead getHead() {
        return head;
    }

    public void setHead(ResponseCommonHead head) {
        this.head = head;
    }

    public ResultLot getResult() {
        return result;
    }

    public void setResult(ResultLot result) {
        this.result = result;
    }
}
