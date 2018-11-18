package bingo.vkcrm.service.house.v1.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.dao.Page;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.common.utils.RequestUtils;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.NotFoundException;
import bingo.vkcrm.service.house.v1.Version;
import bingo.vkcrm.service.house.v1.models.CarportInfo;
import bingo.vkcrm.service.house.v1.models.House;
import bingo.vkcrm.service.house.v1.models.ProjectHouse;
import bingo.vkcrm.service.house.v1.models.YZParam;
import bingo.vkcrm.service.house.v1.services.CarportService;
import bingo.vkcrm.service.house.v1.services.HouseService;

/**
 * Created by szsonic on 2016/3/11/011.
 * （营帐用相关接口）
 */
@RequestMapping(value = Version.API_PATH)
@Controller
public class YZController extends BaseController{
	private static final Log log = LogFactory.getLog(YZController.class);
	 @Autowired
	 HouseService houseService;
	 @Autowired
	 CarportService carportService;

	/**
	 * @Description: 分页获取楼栋信息
	 * @param: curPage当前页
	 * @param pageSize当前页行数
	 * @param HttpServletRequest 对象
	 * @throws:Exception
	 * @Author: luoml01
	 * @date: 2016年3月15日 下午6:37:47
	 * @return:ServiceResult 字符串
     * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
    @RequestMapping(value = "/yz/building/{curPage}/{pageSize}", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult getBuildingInfoByProject(@PathVariable(value = "curPage")Integer curPage,
                                                  @PathVariable(value = "pageSize")Integer pageSize,
                                                  HttpServletRequest request)throws Exception{
    	String parameters = RequestUtils.getStrParam(request);
    	Page pager = new Page();
        pager.setPage(curPage);
        pager.setPageSize(pageSize);
        YZParam yzParam = new YZParam();
        yzParam.setTimestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        if (StringUtils.isNotEmpty(parameters)) {
        	yzParam = JsonUtil.fromJson(parameters, YZParam.class);
        }
        List<ProjectHouse> list = houseService.getBuildingInfoPage(pager,yzParam);
        ListResult<ProjectHouse> listResult = new ListResult<ProjectHouse>(pager, list);
        if (listResult == list) {
            throw new NotFoundException("查询结果为空.");
        }
        listResult.getPagination().setTimestamp(yzParam.getTimestamp());
        return ServiceResult.succeed(listResult);
    }

    /**
	 * @Description: 分页获取房屋信息
	 * @param: curPage当前页
	 * @param pageSize当前页行数
	 * @param HttpServletRequest 对象
	 * @throws:Exception
	 * @Author: luoml01
	 * @date: 2016年3月15日 下午6:37:47
	 * @return:ServiceResult 字符串
     * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
    @RequestMapping(value = "/yz/house/{curPage}/{pageSize}", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult getHouseInfoByProject(@PathVariable(value = "curPage")Integer curPage,
                                               @PathVariable(value = "pageSize")Integer pageSize,
                                               HttpServletRequest request)throws Exception{
    	String parameters = RequestUtils.getStrParam(request);
    	Page pager = new Page();
        pager.setPage(curPage);
        pager.setPageSize(pageSize);
        YZParam yzParam = new YZParam();
        yzParam.setTimestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        if (StringUtils.isNotEmpty(parameters)) {
        	yzParam = JsonUtil.fromJson(parameters, YZParam.class);
        }
        List<House> list = houseService.getHousePage(pager,yzParam);
        ListResult<House> listResult = new ListResult<House>(pager, list);
        if (listResult == list) {
            throw new NotFoundException("查询结果为空.");
        }
        listResult.getPagination().setTimestamp(yzParam.getTimestamp());
        return ServiceResult.succeed(listResult);
    }

    /**
	 * @Description: 分页获取车位信息
	 * @param: curPage当前页
	 * @param pageSize当前页行数
	 * @param HttpServletRequest 对象
	 * @throws:Exception
	 * @Author: luoml01
	 * @date: 2016年3月15日 下午6:37:47
	 * @return:ServiceResult 字符串
     * @exception:TODO
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
    @RequestMapping(value = "/yz/carport/{curPage}/{pageSize}", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult getCarportInfoByProject(@PathVariable(value = "curPage")Integer curPage,
                                                 @PathVariable(value = "pageSize")Integer pageSize,
                                                 HttpServletRequest request)throws Exception{
    	String parameters = RequestUtils.getStrParam(request);
    	Page pager = new Page();
        pager.setPage(curPage);
        pager.setPageSize(pageSize);
        YZParam yzParam = new YZParam();
        yzParam.setTimestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        if (StringUtils.isNotEmpty(parameters)) {
        	yzParam = JsonUtil.fromJson(parameters, YZParam.class);
        }
        List<CarportInfo> list = carportService.getCarportPage(pager,yzParam);
        ListResult<CarportInfo> listResult = new ListResult<CarportInfo>(pager, list);
        if (listResult == list) {
            throw new NotFoundException("查询结果为空.");
        }
        listResult.getPagination().setTimestamp(yzParam.getTimestamp());
        return ServiceResult.succeed(listResult);
    }
}
