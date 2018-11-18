package bingo.vkcrm.task.models.bmap.project;

import bingo.vkcrm.task.models.bmap.common.RequestCommonHead;

/**
 * Created by szsonic on 2015/11/13.
 */
public class RequestInfo {
    private RequestCommonHead head;
    private RequestParameter parameter;


    public RequestCommonHead getHead() {
        return head;
    }

    public void setHead(RequestCommonHead head) {
        this.head = head;
    }

    public RequestParameter getParameter() {
        return parameter;
    }

    public void setParameter(RequestParameter parameter) {
        this.parameter = parameter;
    }
}
