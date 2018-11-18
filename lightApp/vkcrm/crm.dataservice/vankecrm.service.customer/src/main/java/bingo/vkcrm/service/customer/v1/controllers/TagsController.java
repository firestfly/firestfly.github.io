package bingo.vkcrm.service.customer.v1.controllers;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.customer.v1.models.Tag;
import bingo.vkcrm.service.customer.v1.services.TagService;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.exceptions.NotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * 客户标签控制器
 */
@Controller
@RequestMapping(value = "api/v1")
public class TagsController extends BaseController {

    @Autowired
    TagService service;

    /**
     * 查询客户标签
     * @param customerId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customer/{customerId}/tags", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryAll(@PathVariable(value = "customerId") String customerId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new BadRequestException("客户编码为空.");
        }
        List<Tag> tags = service.queryAll(customerId);
        if (tags == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(tags);
    }

    /**
     * 保存客户标签
     *
     * @param customerId 客户id
     * @param tagIds     标签id集合
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/updateTags", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult update(@PathVariable(value = "customerId") String customerId, Integer[] tagIds, String houseId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new BadRequestException("客户编码为空.");
        }
        List<Integer> tagidList = new ArrayList<Integer>();
        if (tagIds != null) {
            for (Integer tagId : tagIds) {
                tagidList.add(tagId);
            }
        }
        service.updateTags(customerId, houseId, tagidList, getCurrentUser());
        return ServiceResult.succeed("修改成功.");
    }


    /**
     * 保存客户标签（对外接口）
     *
     * @param customerId 客户id
     * @param tagIds     标签id集合
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/updateTags/forApp", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateByHouseCode(@PathVariable(value = "customerId") String customerId, Integer[] tagIds, String houseCode) throws Exception {
    	return update(customerId, tagIds, service.getHouseIdByCode(houseCode));
    }
}
