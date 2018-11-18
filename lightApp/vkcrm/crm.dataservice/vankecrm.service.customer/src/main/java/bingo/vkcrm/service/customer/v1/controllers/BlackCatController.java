package bingo.vkcrm.service.customer.v1.controllers;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.common.core.utils.StringUtils;
import bingo.dao.Page;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.customer.v1.Version;
import bingo.vkcrm.service.customer.v1.models.blackcar.Building;
import bingo.vkcrm.service.customer.v1.models.blackcar.CustomerContact;
import bingo.vkcrm.service.customer.v1.models.blackcar.CustomerOutRecord;
import bingo.vkcrm.service.customer.v1.models.blackcar.HouseCustomerRelationResult;
import bingo.vkcrm.service.customer.v1.models.blackcar.Project;
import bingo.vkcrm.service.customer.v1.models.blackcar.TempCustomerCarRelation;
import bingo.vkcrm.service.customer.v1.models.blackcat.ProjectCustomer;
import bingo.vkcrm.service.customer.v1.services.BlackCatService;
import bingo.vkcrm.service.customer.v1.services.No2BlackCatService;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.exceptions.NotFoundException;

/**
 * 提供给黑猫系统的接口
 * Created by Wangzr on 15/9/17.
 */
@Controller
@RequestMapping(value = Version.API_PATH + "/blackcat")
public class BlackCatController {

	private static final Log log = LogFactory.getLog(BlackCatController.class);
    @Autowired
    BlackCatService service;
    @Autowired
    No2BlackCatService no2Service;

    /**
     * 客房关系信息
     *
     * @param projectCode 项目ID
     * @param startTime   开始时间
     * @param endTime     结束时间
     * @return
     */
    @RequestMapping(value = "/project/relation", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryProjectAllRelation(String projectCode, String startTime, String endTime, int curPage, int pageSize) throws Exception {
        if (StringUtils.isEmpty(startTime)) {
            throw new BadRequestException("开始时间为空.");
        }
        if (StringUtils.isEmpty(startTime)) {
            throw new BadRequestException("结束时间为空.");
        }
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date startdate = sdf.parse(startTime);
        Date enddate = sdf.parse(endTime);
//			Integer count = service.queryHouseCustomerRelationCount(projectCode,startdate,enddate);
//			if(count>6000){
//				return ServiceResult.succeed("数据量不能大于6000");
//			}else{
        List<ProjectCustomer> pc = service.queryHouseCustomerRelation(projectCode, startdate, enddate, page);
        ListResult<ProjectCustomer> listResult = new ListResult<ProjectCustomer>(page, pc);
        if (listResult == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(listResult);
    }
    
    
    
    
    
    /**
     * 黑猫2号 
     * 客房关系同步接口
     * @Description: 
     * @param: @param projectId
     * @param: @param lastUpdate
     * @param: @param page
     * @param: @param size
     * @param: @return
     * @param: @throws BadRequestException
     * @param: @throws ParseException
     * @param: @throws NotFoundException
     * @throws:
     * @Author: huangsx
     * @date: 2016年4月8日 下午2:28:02
     * @return:{返回参数名}{返回参数说明} 
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    @RequestMapping(value = "/houseCustomerRelation", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryHouseCustomerRelation(String projectCode ,String customerCode,long lastUpdate, int page,int size) throws BadRequestException, ParseException, NotFoundException{
    	log.info("开始 调用客房关系houseCustomerRelation接口");
    	
    	/*校验参数*/
    	if(StringUtils.isEmpty(projectCode)){    		
    		 throw new BadRequestException("projectCode 不能为空");
    	}
    	if(lastUpdate<=0){
    		throw new BadRequestException(" lastUpdate 必填");
    	}
    	if(page == 0){    	
    		throw new BadRequestException("page 必填");
    	}
    	if(size == 0 || size >500){
    		throw new BadRequestException("size 必填并且不可以大于500");
    	}
    	/*设置分页*/
    	Page pager = new Page();
    	pager.setPage(page);
    	pager.setPageSize(size);
    	
    	Date lastUpdateTime = new Date(lastUpdate*1000);
    	
    	/*查询数据*/
        HouseCustomerRelationResult result = no2Service.queryHouseCustomerRelation(projectCode,customerCode,lastUpdateTime,pager);
        if(result == null||result.getTotal()==0){
        	log.info("查询结果为空-结束");
//        	throw new NotFoundException("查询结果为空");
        	//不抛这个结果为空的异常 结果更为直观
        	
        }
        log.info("结束-调用客房关系houseCustomerRelation接口");
        return ServiceResult.succeed(result);
        
    	
    }
    
    /**
     * 黑猫2号 
     * 根据客户的编码获取客户的全部联系方式
     * @Description: 
     * @param: @param customerCode
     * @param: @return
     * @param: @throws Exception
     * @throws:
     * @Author: huangsx
     * @date: 2016年4月8日 下午2:28:24
     * @return:{返回参数名}{返回参数说明} 
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
     @RequestMapping(value = "/customerContact", method = RequestMethod.GET)
     @ResponseBody
    public ServiceResult queryAllPhoneNumByCustomerId(String customerCode) throws Exception{
    	 log.info("调用 客户的全部联系方式customerContact接口-开始");
    	//判断参数
    	if(StringUtils.isEmpty(customerCode)){
    	
    		throw new BadRequestException("用户编码为空");
    	}
        CustomerContact  cc= no2Service.queryAllPhoneNumByCustomerCode(customerCode);
        if(cc == null){
        	 log.info("查询结果为空-结束");
        	throw new NotFoundException("查询结果为空");
        }
        log.info("调用 客户的全部联系方式customerContact接口-结束");
    	return ServiceResult.succeed(cc);
    }
    /**
     * 黑猫2号 
     * 获取所有项目列表
     * @Description: 
     * @param: @return
     * @param: @throws NotFoundException
     * @param: @throws IOException
     * @throws:
     * @Author: huangsx
     * @date: 2016年4月8日 下午2:28:37
     * @return:{返回参数名}{返回参数说明} 
     * @exception
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    @RequestMapping(value="/projectList",method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryAllProjectList() throws NotFoundException, IOException{
    	log.info("调用 所有项目列表projectList接口-开始");
    	List<Project> list ;
    	String jsonListStr = JedisUtil.cacheDb().get("projectAllList");//从缓存中那数据
    	/*判断缓存中有没有数据*/
    	if(StringUtils.isEmpty(jsonListStr)){ 
    		list = no2Service.queryAllProjectList();//去数据库中查询
    		jsonListStr =  JsonUtil.toJson(list);
        	JedisUtil.cacheDb().set("projectAllList", jsonListStr);
    	}else {
    		list  = JsonUtil.fromJson(jsonListStr, ArrayList.class);
    	}
    	
    	if(list==null || list.size()==0){
    		log.info("查询结果为空-结束");
    		throw new NotFoundException("查询结果为空");
    	}
    	log.info("调用 所有项目列表projectList接口-结束");
    	return ServiceResult.succeed(list);
    	
    }
    /**
     * 黑猫2号 
     * 根据工程id 获取所有楼栋信息
     * @Description: 
     * @param: @param projectId
     * @param: @return
     * @param: @throws BadRequestException
     * @param: @throws NotFoundException
     * @param: @throws IOException
     * @throws:
     * @Author: huangsx
     * @date: 2016年4月8日 下午2:28:52
     * @return:{返回参数名}{返回参数说明} 
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    @RequestMapping(value="buildingList",method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryBuildingById(String  projectCode) throws BadRequestException, NotFoundException, IOException{
    	log.info("调用 根据工程code 获取所有楼栋信息buildingList接口-开始");
    	if(StringUtils.isEmpty(projectCode)){
    		throw new BadRequestException("工程编码 projectCode 为空");
    	}
    
    	/*查询数据*/
    	List<Building> list =  no2Service.queryBuildingById(projectCode);
    	if(list==null || list.size()==0){
    		log.info("查询结果为空-结束");
    		throw new NotFoundException("查询结果为空");
    	}
    	log.info("调用 根据工程id 获取所有楼栋信息buildingList接口-结束");
    	return ServiceResult.succeed(list);
    }
    
    /**
     * 黑猫2号 
     * 上传客户出入道闸记录
     * 进出口数据 插入接口
     * @Description: 
     * @param: @param cor
     * @param: @return
     * @param: @throws BadRequestException
     * @param: @throws IOException
     * @throws:
     * @Author: huangsx
     * @date: 2016年4月8日 下午2:29:06
     * @return:{返回参数名}{返回参数说明} 
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    @RequestMapping(value="/customerOutRecord" ,method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addCustomerOutRecord(CustomerOutRecord cor) throws BadRequestException, IOException{
    	log.info("调用 上传客户出入道闸记录customerOutRecord接口-开始-");
    	/*校验参数*/
    	if(StringUtils.isEmpty(cor.getCustomerCode())){
    		throw new BadRequestException("客户ID customerCode 为空");
    	}
    	if(StringUtils.isEmpty(cor.getDoorCode())){
    		throw new BadRequestException("门禁ID doorCode 为空");
    	}
    	if(StringUtils.isEmpty(cor.getInOutTime())){
    		throw new BadRequestException("进出时间 inOutTime 为空");
    	}
    	if(StringUtils.isEmpty(cor.getDirection())){
    		throw new BadRequestException("进/出方向direction  为空");
    	}
    	if(cor.getPrice() ==null){
    		throw new BadRequestException("费用price 为空");
    	}
    	if(StringUtils.isEmpty(cor.getRelation())){
    		throw new BadRequestException(" 身份relation 为空");
    	}
    	//设置表数据字段
    	Date nowDate= new Date();
    	Date inOutTime = new Date(Long.parseLong(cor.getInOutTime())*1000);  
    	cor.setId(UUIDUtil.create());
    	cor.setInOutTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(inOutTime));
    	cor.setCreateName(CustomerOutRecord.CREATE_NAME);
    	cor.setCreateTime(nowDate);
    	cor.setModifyTime(nowDate);
    	//插入数据库
    	int x =  no2Service.insertCustomerOutRecord(cor);
    	Map<String,Object> mapResult = new HashMap<String,Object>();
    	
    	if(x>0){
    		mapResult.put("code", ServiceResult.CODE_OK);
    		mapResult.put("result", "success");
    	}else {
    		mapResult.put("code", ServiceResult.CODE_BAD_REQUEST);
    		mapResult.put("result", "direction isinvalid");
    	}
    	log.info("调用 上传客户出入道闸记录customerOutRecord接口-结束");
    	return ServiceResult.succeed(mapResult);
    }
    /**
     * 黑猫2号 
     * 接收黑猫上传的客车关系
     * 插入一条 客车关系
     * @Description: 
     * @param: @param tccr
     * @param: @return
     * @param: @throws BadRequestException
     * @throws:
     * @Author: huangsx
     * @date: 2016年4月8日 下午2:29:19
     * @return:{返回参数名}{返回参数说明} 
     * @exception:
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    @RequestMapping(value="/customerCarRelation" ,method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addCustomerCarRelation(TempCustomerCarRelation tccr) throws BadRequestException{
    	//校验参数
    	if(StringUtils.isEmpty(tccr.getCustomerCode())){
    		throw new BadRequestException("客户ID customerCode 为空");
    	}
    	if(StringUtils.isEmpty(tccr.getCarCode())){
    		throw new BadRequestException("车牌号码  carCode 为空");
    		
    	}
    	Date  nowDate = new Date();
    	//设置表数据参数
    	tccr.setId(UUIDUtil.create());
    	tccr.setCreateName(TempCustomerCarRelation.CREATE_NAME);
    	tccr.setCreateTime(nowDate);
    	tccr.setModifyTime(nowDate);
    	
    	//插入数据
    	int x =  no2Service.insertCustomerCarRelation(tccr);
    	Map<String,Object> mapResult = new HashMap<String,Object>();
    	if(x>0){
    		mapResult.put("code", ServiceResult.CODE_OK);
    		mapResult.put("result", "success");
    	}else {
    		mapResult.put("code", ServiceResult.CODE_BAD_REQUEST);
    		mapResult.put("result", "direction isinvalid");
    	}
    	return ServiceResult.succeed(mapResult);
    }
    
}
