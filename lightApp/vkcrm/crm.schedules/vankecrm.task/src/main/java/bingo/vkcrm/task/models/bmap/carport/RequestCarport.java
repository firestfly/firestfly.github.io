package bingo.vkcrm.task.models.bmap.carport;

import bingo.vkcrm.task.models.bmap.common.RequestCommonHead;

/**
 * Created by szsonic on 2015/11/24.
 */
public class RequestCarport {
    private RequestCarportParameter parameter;
    private RequestCommonHead head;

    public RequestCarportParameter getParameter() {
        return parameter;
    }

    public void setParameter(RequestCarportParameter parameter) {
        this.parameter = parameter;
    }

    public RequestCommonHead getHead() {
        return head;
    }

    public void setHead(RequestCommonHead head) {
        this.head = head;
    }
}
