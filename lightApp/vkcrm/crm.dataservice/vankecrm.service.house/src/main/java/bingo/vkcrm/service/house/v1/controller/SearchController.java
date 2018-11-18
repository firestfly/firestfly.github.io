package bingo.vkcrm.service.house.v1.controller;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.house.v1.Version;
import bingo.vkcrm.service.house.v1.services.SearchService;
import bingo.vkcrm.service.house.v1.services.SearchService.CostomerSearchType;

/**
 * 
 * <code>{@link SearchController}</code>
 * 首页搜索功能，客服中心部分
 * 不同字段查询分开多次请求，异步加载数据，减少客户等待时间
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
@Controller
@RequestMapping(value = Version.API_PATH + "/search")
public class SearchController extends BaseController {

    @Autowired
    SearchService searchService;

    /**
     * 首页搜索功能
     * @param type
     * @param value
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult search(String code,String value) throws Exception {
        if (StringUtils.isEmpty(code)) {
            throw new BadRequestException("类型编码不能为空。");
        }
        if (StringUtils.isEmpty(value)) {
            throw new BadRequestException("查询值不能为空。");
        }
    	if(null == CostomerSearchType.getCostomerSearchType(code)){
            throw new BadRequestException("无法辨认查询类型。");
    	}
    	return ServiceResult.succeed(searchService.search(code, value,getCurrentUser()));
    }
    
 
    
    


}
