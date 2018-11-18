package bingo.vkcrm.service.customer.v1.controllers;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.customer.v1.Version;
import bingo.vkcrm.service.customer.v1.models.Hobby;
import bingo.vkcrm.service.customer.v1.services.HobbyService;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.exceptions.NotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * 客户兴趣爱好
 * Created by Wangzr on 15/9/17.
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class HobbyController extends BaseController {
    private static final Log log = LogFactory.getLog(HobbyController.class);

    @Autowired
    private HobbyService service;

    /**
     * 获取该客户的所有兴趣
     *
     * @param customerId 客户id
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/hobbies", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryHobbies(@PathVariable(value = "customerId") String customerId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new BadRequestException("客户编码为空.");
        }
        List<Hobby> hobbies = service.queryAll(customerId);
        if (hobbies == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(hobbies);
    }

    /**
     * 更新该客户的所有兴趣
     *
     * @param customerId 客户id
     * @param contentIds 兴趣爱好id集合
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/hobbies", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateHobbies(@PathVariable(value = "customerId") String customerId, String[] contentIds, String houseId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new BadRequestException("客户编码为空.");
        }
        List<Integer> contentIdslist = new ArrayList<Integer>();
        for (int i = 0; i < contentIds.length; i++) {
            if (contentIds != null) {
                contentIdslist.add(Integer.valueOf(contentIds[i]));
            }
        }
        service.changeHobbies(customerId, houseId, contentIdslist, getCurrentUser());
        return ServiceResult.succeed(true);
    }
    

    /**
     * 更新该客户的所有兴趣（对外服务）
     *
     * @param customerId 客户id
     * @param contentIds 兴趣爱好id集合
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/hobbies/forApp", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateHobbiesByHouseCode(@PathVariable(value = "customerId") String customerId, String[] contentIds, String houseCode) throws Exception {
        return updateHobbies(customerId, contentIds, service.getHouseIdByCode(houseCode));
    }
}
