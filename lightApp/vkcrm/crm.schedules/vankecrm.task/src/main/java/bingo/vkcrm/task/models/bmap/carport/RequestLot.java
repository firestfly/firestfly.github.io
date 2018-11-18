package bingo.vkcrm.task.models.bmap.carport;

import bingo.vkcrm.task.models.bmap.common.RequestCommonHead;

/**
 * Created by szsonic on 2015/11/22.
 */
public class RequestLot {
    private RequestCommonHead head;
    private RequestLotParameter parameter;

    public RequestCommonHead getHead() {
        return head;
    }

    public void setHead(RequestCommonHead head) {
        this.head = head;
    }

    public RequestLotParameter getParameter() {
        return parameter;
    }

    public void setParameter(RequestLotParameter parameter) {
        this.parameter = parameter;
    }
}
