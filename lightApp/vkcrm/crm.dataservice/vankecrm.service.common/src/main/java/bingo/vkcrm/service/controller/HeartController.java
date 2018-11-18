package bingo.vkcrm.service.controller;

import bingo.vkcrm.service.common.ServiceResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Wangzr on 15/12/16.
 */
@Controller
public abstract class HeartController {

    @RequestMapping(value = "/heart/beat", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult beat() {
        return ServiceResult.succeed(true);
    }
}
