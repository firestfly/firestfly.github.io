package bingo.vkcrm.service.house.v1.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.common.core.utils.StringUtils;
import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.house.v1.Version;
import bingo.vkcrm.service.house.v1.models.Subscription.*;
import bingo.vkcrm.service.house.v1.services.SubscriptionService;

/**
 * 订阅关系控制器
 *
 * @author Administrator
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class SubscriptionController extends BaseController {

    @Autowired
    SubscriptionService service;

    private static final Log log = LogFactory.getLog(SubscriptionController.class);

    /**
     * 一卡通查询
     *
     * @param cardNo
     * @param curPage
     * @param pageSize
     * @return
     */
    @RequestMapping(value = "/subscription/card", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getCard(String[] cardNo, String curPage, String pageSize) throws Exception{
        return ServiceResult.succeed(service.getCard(cardNo, curPage, pageSize));
    }

    /**
     * 物业费查询
     * @param houseId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/subscription/propertyFee", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getPropertyFee(String houseId) throws Exception {
        if (StringUtils.isEmpty(houseId)) {
            throw new BadRequestException("房屋Id");
        }
        return ServiceResult.succeed(service.getProperty(houseId));
    }

    /**
     * 判断物业费是否已交
     * @param houseId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/subscription/propertyFee/isPaid", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult isPaid(String houseId) throws Exception {
        Double unpaid = 0.0;
        if (StringUtils.isEmpty(houseId)) {
            throw new BadRequestException("房屋Id");
        }
        EncryptTxtResponse encryptTxtResponse = null;
        boolean result = true;
        encryptTxtResponse = service.getProperty(houseId);
        //获取总的未交物业费
        if (encryptTxtResponse != null) {
            String allUnpaid = encryptTxtResponse.getAllUnpaid();
            //转为double类型
            unpaid = Double.parseDouble(allUnpaid);
        } else {
            return ServiceResult.error("未知");
        }
        if (unpaid > 0) {
            result = false;
        }
        return ServiceResult.succeed(result);
    }

    /**
     * 邮包查询
     * @param houseId
     * @param curPage
     * @param pageSize
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/subscription/parcel", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getParcel(String houseId, String curPage, String pageSize) throws Exception {
        if (StringUtils.isEmpty(houseId)) {
            throw new BadRequestException("房屋Id");
        }
        if (StringUtils.isEmpty(curPage) || StringUtils.isEmpty(pageSize)) {
            throw new BadRequestException("分页信息");
        }
        ParcelResponse parcelResponse = null;
        parcelResponse = service.getParcel(houseId, curPage, pageSize);
        Page page = new Page();
        page.setPage(Integer.parseInt(curPage));
        page.setPageSize(Integer.parseInt(pageSize));
        if (parcelResponse == null) {
            page.setTotalRows(0);
        } else {
            page.setTotalRows(parcelResponse.getData().getTotalCount());
        }
        ListResult<Parcel> listResult = new ListResult<Parcel>(page, parcelResponse.getData().getList());
        return ServiceResult.succeed(listResult);
    }


}
