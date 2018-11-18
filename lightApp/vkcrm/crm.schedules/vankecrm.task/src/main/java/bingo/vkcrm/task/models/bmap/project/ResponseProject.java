package bingo.vkcrm.task.models.bmap.project;

import bingo.vkcrm.task.models.bmap.common.ResponseCommonHead;
import bingo.vkcrm.task.models.bmap.project.ResultProject;

/**
 * Created by szsonic on 2015/11/13.
 */
public class ResponseProject {
    private ResponseCommonHead head;
    private ResultProject result;


    public ResponseCommonHead getHead() {
        return head;
    }

    public void setHead(ResponseCommonHead head) {
        this.head = head;
    }

    public ResultProject getResult() {
        return result;
    }

    public void setResult(ResultProject result) {
        this.result = result;
    }
}
