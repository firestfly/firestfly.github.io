package bingo.vkcrm.task.models.bmap.house;

import bingo.vkcrm.task.models.bmap.common.BaseResult;
import bingo.vkcrm.task.models.bmap.common.ResponseCommonHead;

/**
 * Created by szsonic on 2015/11/24.
 */
public class ResponseHouse {
    private ResponseCommonHead head;
    private ResultHouse result;



    public ResultHouse getResult() {
        return result;
    }

    public void setResult(ResultHouse result) {
        this.result = result;
    }

    public ResponseCommonHead getHead() {
        return head;
    }

    public void setHead(ResponseCommonHead head) {
        this.head = head;
    }
}
