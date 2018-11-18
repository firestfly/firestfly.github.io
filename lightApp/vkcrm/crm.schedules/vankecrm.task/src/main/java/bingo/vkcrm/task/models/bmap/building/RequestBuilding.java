package bingo.vkcrm.task.models.bmap.building;

import bingo.vkcrm.task.models.bmap.common.RequestCommonHead;

/**
 * Created by szsonic on 2015/11/22.
 */
public class RequestBuilding {
    private RequestCommonHead head;
    private RequestBuildingParameter parameter;

    public RequestCommonHead getHead() {
        return head;
    }

    public void setHead(RequestCommonHead head) {
        this.head = head;
    }

    public RequestBuildingParameter getParameter() {
        return parameter;
    }

    public void setParameter(RequestBuildingParameter parameter) {
        this.parameter = parameter;
    }
}
