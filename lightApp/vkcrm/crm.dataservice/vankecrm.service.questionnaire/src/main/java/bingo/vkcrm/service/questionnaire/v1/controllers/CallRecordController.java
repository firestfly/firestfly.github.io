package bingo.vkcrm.service.questionnaire.v1.controllers;

import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.questionnaire.v1.Version;
import bingo.vkcrm.service.questionnaire.v1.model.AnswerCallRecords;
import bingo.vkcrm.service.questionnaire.v1.model.CallRecordCondition;
import bingo.vkcrm.service.questionnaire.v1.model.CallRecordResult;
import bingo.vkcrm.service.questionnaire.v1.services.CallRecordService;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 满意度调查外呼记录控制器
 * return 返回新增的答卷Id
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class CallRecordController extends BaseController {

    @Autowired
    CallRecordService service;

    /**
     * 添加问卷调查通话记录中间表
     *
     * @param answerCallRecords
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/callrecord/add", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult saveAnswerCallRecord(AnswerCallRecords answerCallRecords) throws Exception {
        //答卷id和通话记录id 都不为空
        if (StringUtils.isBlank(answerCallRecords.getAnswerId()) || StringUtils.isBlank(answerCallRecords.getCallRecordId())) {
            throw new BadRequestException("参数错误!");
        }
        boolean result = service.saveAnswerCallRecord(answerCallRecords,getCurrentUser());
        return ServiceResult.succeed(result);
    }


    /**
     * 查询满意度外呼记录
     *
     * @return
     */
    @RequestMapping(value = "/callrecord/get", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult getCallRerord(CallRecordCondition callRecordCondition, Integer curPage, Integer pageSize) throws Exception {
        List<CallRecordResult> list;
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        //问卷标题id必选
        if (null == callRecordCondition) {
            throw new BadRequestException("参数错误!");
        }
        list = service.getCallRerord(callRecordCondition, page);
        return ServiceResult.succeed(new ListResult<CallRecordResult>(page, list));
    }
}
