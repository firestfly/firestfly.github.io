package bingo.vkcrm.service.house.v1.controller;


import bingo.vkcrm.service.house.v1.Version;
import bingo.vkcrm.service.house.v1.models.VirtualHouse;
import bingo.vkcrm.service.house.v1.services.VirtualHouseService;
import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.BadRequestException;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 虚拟房屋控制器
 */
@Controller
@RequestMapping(value = Version.API_PATH + "/virtual")
public class VirtualHouseController extends BaseController {

    @Autowired
    VirtualHouseService service;
    private static final Log log = LogFactory.getLog(VirtualHouseController.class);
    
    @RequestMapping(value = "/get", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getVirtualHouses(String beginTime,Integer curPage,Integer pageSize) throws BadRequestException {
    	if(curPage == null && pageSize == null){
    		throw new BadRequestException("分页信息!");
    	}
        try {
        	if(pageSize > 200){
        		pageSize = 200;
        	}
        	Page pager = new Page();
            pager.setPage(curPage);
            pager.setPageSize(pageSize);
        	List<VirtualHouse> list = service.getVirtualHouses(beginTime,pager);
        	ListResult<VirtualHouse> listResult = new ListResult<VirtualHouse>(pager,list);
            return ServiceResult.succeed(listResult);
        } catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
            return ServiceResult.error("error");
        }
    }

    
}
