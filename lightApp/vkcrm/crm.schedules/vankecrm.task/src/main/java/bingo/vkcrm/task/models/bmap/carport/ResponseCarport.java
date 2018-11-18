package bingo.vkcrm.task.models.bmap.carport;

import bingo.vkcrm.task.models.bmap.common.ResponseCommonHead;

/**
 * Created by szsonic on 2015/11/24.
 */
public class ResponseCarport {
    private ResponseCommonHead head;
    private ResultCarport result;

    public ResponseCommonHead getHead() {
        return head;
    }

    public void setHead(ResponseCommonHead head) {
        this.head = head;
    }

    public ResultCarport getResult() {
        return result;
    }

    public void setResult(ResultCarport result) {
        this.result = result;
    }
}
