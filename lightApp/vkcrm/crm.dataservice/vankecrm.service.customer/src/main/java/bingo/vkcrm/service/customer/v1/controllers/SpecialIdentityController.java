package bingo.vkcrm.service.customer.v1.controllers;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.customer.v1.Version;
import bingo.vkcrm.service.customer.v1.models.SpecialIdentity;
import bingo.vkcrm.service.customer.v1.services.SpecialIdentityService;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.exceptions.NotFoundException;
import bingo.vkcrm.service.exceptions.NotModifyiedException;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;

/**
 * 特殊身份
 * Created by Wangzr on 15/9/17.
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class SpecialIdentityController extends BaseController{
    private static final Log log = LogFactory.getLog(SpecialIdentityController.class);

    @Autowired
    private SpecialIdentityService service;

    /**
     * 查询所有特殊身份
     *
     * @param customerId
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/specialIdentities")
    @ResponseBody
    public ServiceResult queryAll(@PathVariable(value = "customerId") String customerId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new BadRequestException("客户编码为空.");
        }
        List<SpecialIdentity> list = service.queryAll(customerId);
        if (list == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(list);
    }


    /**
     * 更新所有特殊身份
     *
     * @param customerId
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/update/specialIdentities")
    @ResponseBody
    public ServiceResult updateSpecialIdentities(@PathVariable(value = "customerId") String customerId,Integer[]identities,Date beginDate,Integer duration) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new BadRequestException("客户编码为空.");
        }
        return ServiceResult.succeed(service.updateSpecialIdentities(customerId,identities,beginDate,duration,getCurrentUser()));
    }


}
