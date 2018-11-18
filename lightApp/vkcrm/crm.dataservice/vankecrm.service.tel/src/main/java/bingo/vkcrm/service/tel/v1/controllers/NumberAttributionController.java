package bingo.vkcrm.service.tel.v1.controllers;

import bingo.vkcrm.service.tel.v1.Version;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.tel.v1.models.NumberAttribution;
import bingo.vkcrm.service.tel.v1.services.TelNumSegmentService;

@Controller
@RequestMapping(Version.API_PATH)
public class NumberAttributionController extends BaseController {

    @Autowired
    TelNumSegmentService service;
    private static final Log log = LogFactory.getLog(NumberAttributionController.class);

    /**
     * 根据电话号码查询归属地
     *
     * @param callNumber
     * @return
     */
    @RequestMapping(value = "/{callNumber}/attribution", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getAttribution(@PathVariable(value = "callNumber") String callNumber) {
        NumberAttribution numbers;
        numbers = service.getAttribution(callNumber);
        return ServiceResult.succeed(numbers);
    }

    /**
     * 电话号码处理
     *
     * @param callNumber
     * @return
     */
    @RequestMapping(value = "/{callNumber}/process", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult handleNumber(@PathVariable(value = "callNumber") String callNumber) {
        String callNumberAfterProcess = callNumber;
        callNumberAfterProcess = service.handleNumber(callNumber);
        return ServiceResult.succeed(callNumberAfterProcess);
    }

}
