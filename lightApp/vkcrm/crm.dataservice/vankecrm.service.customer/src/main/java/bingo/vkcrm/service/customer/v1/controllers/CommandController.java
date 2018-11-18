package bingo.vkcrm.service.customer.v1.controllers;

import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.customer.v1.Version;
import bingo.vkcrm.service.customer.v1.models.CustomerInfo4Command;
import bingo.vkcrm.service.customer.v1.services.CommandService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;


/**
 * Created by szsonic on 2015/11/16.
 */
@Controller
@RequestMapping(value = Version.API_PATH + "/command")
public class CommandController extends BaseController{
    private static final Log log = LogFactory.getLog(CommandController.class);
    @Autowired
    CommandService commandService;
    /**
     * 查询客户信息
     * 这里的perojectCode对应的是main_project表中的projectId
     * @return ServiceResult
     */
    @RequestMapping(value = "/queryCustomer/{curPage}/{pageSize}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCustomer(@PathVariable(value = "curPage") Integer curPage, @PathVariable(value = "pageSize") Integer pageSize,
                                       String fullName,String mainMobile,String licenseNumber,String houseId,String buildingCode,String projectCode,String customerId) throws Exception{
        Page page = new Page();
        page.setPageSize(pageSize);
        page.setPage(curPage);
        List<CustomerInfo4Command>  list=commandService.queryCustomer(customerId,fullName,mainMobile,licenseNumber,houseId,buildingCode,projectCode,page);
        for (CustomerInfo4Command customerInfo4Command : list) {
            if(customerInfo4Command.getCertificateType()==1){//1代表身份证
                String cardNo=customerInfo4Command.getCertificateId();
                if(StringUtils.isNotEmpty(cardNo)){
                    if(cardNo.length()==18){//如果是18身份证
                        String birthday=cardNo.substring(6,14);
                        customerInfo4Command.setCertificateId(cardNo.replace(birthday,"********"));
                    }
                }
            }
        }
        return ServiceResult.succeed(new ListResult<CustomerInfo4Command>(page,list));
    }
}



