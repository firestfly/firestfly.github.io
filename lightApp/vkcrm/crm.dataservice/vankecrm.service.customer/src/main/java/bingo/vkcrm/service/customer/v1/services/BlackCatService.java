package bingo.vkcrm.service.customer.v1.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import bingo.dao.Page;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.blackcat.HouseCustomer;
import bingo.vkcrm.service.customer.v1.models.blackcat.HouseCustomerRelation;
import bingo.vkcrm.service.customer.v1.models.blackcat.ProjectCustomer;
import bingo.vkcrm.service.customer.v1.models.blackcat.ProjectHouseCustomer;
import bingo.vkcrm.service.service.BaseService;

/**
 * 提供给黑猫系统的接口服务类
 * Created by Wangzr on 15/9/17.
 */
@Service
public class BlackCatService extends CustomerCommonService {

	
    /**
     * 查询数据量,客房关系信息(黑猫一号项目需要)
     * @param projectCode 项目Code
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return
     */
    public Integer queryHouseCustomerRelationCount(String projectCode,Date startTime,Date endTime){
    	Map<String,Object> map = new HashMap<String,Object>();
    	map.put("projectCode", projectCode);
    	map.put("startTime", startTime);
    	map.put("endTime", endTime);
    	return centerRoDao.queryForInt("sql.query.projectcustomerhouserelationcount", map);
    }
    
    /**
     * 客房关系信息
     *
     * @param projectCode 项目Code
     * @param startTime   开始时间
     * @param endTime     结束时间
     * @return
     */
    public List<ProjectCustomer> queryHouseCustomerRelation(String projectCode,Date startTime,Date endTime,Page page) {
    	Map<String,Object> map = new HashMap<String,Object>();
    	map.put("projectCode", projectCode);
    	map.put("startTime", startTime);
    	map.put("endTime", endTime);
    	//List<ProjectHouseCustomer> list = rnDao.queryForList(ProjectHouseCustomer.class, "sql.query.projectcustomerhouserelation", map);
    	List<ProjectHouseCustomer> list = centerRoDao.queryForListPage(ProjectHouseCustomer.class, page, "sql.query.projectcustomerhouserelation", null, map, true);
    	String code = "";
    	String customerName = "";
    	Integer dataSize =0; //数据大小
    	List<ProjectCustomer> pclist =new ArrayList<ProjectCustomer>();
		List<HouseCustomer> khlist = null;
		List<HouseCustomerRelation> gxlist = null;
		ProjectCustomer pc = new ProjectCustomer();
    	for(int i = 0;i<list.size();i++){
    		ProjectHouseCustomer  a = list.get(i);
    		if(code.equals(a.getProjectCode())){
    			if(customerName.equals(a.getCustomerName())){
        			HouseCustomerRelation hcr = new HouseCustomerRelation();
        			hcr.setBuildingName(a.getBuildingName());
        			hcr.setBuildingCode(a.getBuildingCode());
        			hcr.setHouseName(a.getHouseName());
        			hcr.setHouseCode(a.getHouseCode());
        			hcr.setRelationType(a.getRelationType());
        			hcr.setHouseStatus(a.getHouseStatus());
        			gxlist.add(hcr);
    			}else{
    				customerName = a.getCustomerName();
        		    gxlist= new ArrayList<HouseCustomerRelation>();
    				HouseCustomerRelation hcr = new HouseCustomerRelation();
        		    //{楼栋,房号,关系,状态}
    				hcr.setBuildingName(a.getBuildingName());
    				hcr.setBuildingCode(a.getBuildingCode());
    				hcr.setHouseName(a.getHouseName());
    				hcr.setHouseCode(a.getHouseCode());
    				hcr.setRelationType(a.getRelationType());
    				hcr.setHouseStatus(a.getHouseStatus());
        			gxlist.add(hcr);
        			//人员ID,证件号,姓名,出生日期,性别,更新时间,客房关系:[{楼栋,房号,关系,状态}]
        			HouseCustomer hct = new HouseCustomer();
           		    hct.setCustomerCode(a.getCustomerCode());
        		    hct.setCustomerName(a.getCustomerName());
        		    hct.setSexText(a.getSexText());
        		    hct.setCertificateId(a.getCertificateId());
        		    hct.setBirthday(a.getBirthday());
        		    hct.setCreateTime(a.getCreateTime());
        			hct.setHouseCustomerRelation(gxlist);
        			khlist.add(hct);
        			dataSize+=1;
        		    pc.setDataSize(dataSize);
    			}
    		}else{
    			dataSize=0;
    			code = a.getProjectCode();
    			customerName = a.getCustomerName();
    		    khlist= new ArrayList<HouseCustomer>();
    		    gxlist= new ArrayList<HouseCustomerRelation>();
    			HouseCustomerRelation hcr = new HouseCustomerRelation();
    		    //{楼栋,房号,关系,状态}
    			hcr.setBuildingName(a.getBuildingName());
    			hcr.setBuildingCode(a.getBuildingCode());
    			hcr.setHouseName(a.getHouseName());
    			hcr.setHouseCode(a.getHouseCode());
    			hcr.setRelationType(a.getRelationType());
    			hcr.setHouseStatus(a.getHouseStatus());
    			gxlist.add(hcr);

    			//人员ID,证件号,姓名,出生日期,性别,更新时间,客房关系:[{楼栋,房号,关系,状态}]
    	    	HouseCustomer hct = new HouseCustomer();
    		    hct.setCustomerCode(a.getCustomerCode());
    		    hct.setCustomerName(a.getCustomerName());
    		    hct.setSexText(a.getSexText());
    		    hct.setCertificateId(a.getCertificateId());
    		    hct.setBirthday(a.getBirthday());
    		    hct.setCreateTime(a.getCreateTime());
    			hct.setHouseCustomerRelation(gxlist);
    			khlist.add(hct);
    			
    			//项目code,数据大小,客户房屋信息
    	    	pc = new ProjectCustomer();
    		    pc.setProjectCode(a.getProjectCode());
    		    dataSize+=1;
    		    pc.setHouseCustomer(khlist);
    		    pclist.add(pc);
    		}
    	}
    	
    	return pclist;
    }


}
