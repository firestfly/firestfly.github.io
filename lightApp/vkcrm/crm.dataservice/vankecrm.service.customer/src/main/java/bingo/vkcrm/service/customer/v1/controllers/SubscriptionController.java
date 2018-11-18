package bingo.vkcrm.service.customer.v1.controllers;

import bingo.common.core.utils.StringUtils;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.customer.v1.Version;
import bingo.vkcrm.service.customer.v1.services.SubscriptionService;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.customer.v1.models.Subscription.*;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 客户订阅关系控制器
 * @author chengsiyuan
 *
 */
@Controller
@RequestMapping(value = Version.API_PATH + "/subscription")
public class SubscriptionController {

    @Autowired
    SubscriptionService service;

    private static final Log log = LogFactory.getLog(SubscriptionController.class);
    /**
     * 查询客户邮包信息
     * @param customerId
     * @param curPage
     * @param pageSize
     * @return
     * @throws BadRequestException 
     * @throws Exception
     */
    @RequestMapping(value = "/parcel", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getParcel(String customerId, String curPage, String pageSize) throws BadRequestException {
        if (StringUtils.isEmpty(customerId)) {
            throw new BadRequestException("客户id");
        }
        if (StringUtils.isEmpty(curPage) || StringUtils.isEmpty(pageSize)) {
            throw new BadRequestException("分页信息");
        }
        ParcelResponse parcelResponse = new ParcelResponse();
        try {
			parcelResponse = service.getParcel(customerId, curPage, pageSize);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(this, e);
		}
        return ServiceResult.succeed(parcelResponse);
    }
    
    /**
     * 获取客户所拥有房屋的物业费信息
     * @param customerId
     * @return
     * @throws BadRequestException
     */
    @RequestMapping(value = "/propertyFee", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getPropertyFee(String customerId) throws BadRequestException{
    	if (StringUtils.isEmpty(customerId)) {
            throw new BadRequestException("客户id");
        }
    	List<EncryptTxtResponse> list = null;
    	try {
			list = service.getPropertyFee(customerId);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(this, e);
		}
    	return ServiceResult.succeed(list);
    }
}
