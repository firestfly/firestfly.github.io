package bingo.vkcrm.task.models.bmap.house;

import bingo.vkcrm.task.models.bmap.common.RequestCommonHead;

/**
 * Created by szsonic on 2015/11/24.
 */
public class RequestHouse {
    private RequestHouseParameter parameter;
    private RequestCommonHead head;

    public RequestHouseParameter getParameter() {
        return parameter;
    }

    public void setParameter(RequestHouseParameter parameter) {
        this.parameter = parameter;
    }

    public RequestCommonHead getHead() {
        return head;
    }

    public void setHead(RequestCommonHead head) {
        this.head = head;
    }
}
