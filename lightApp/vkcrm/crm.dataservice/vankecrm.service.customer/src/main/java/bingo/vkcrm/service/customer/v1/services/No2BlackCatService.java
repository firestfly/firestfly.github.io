package bingo.vkcrm.service.customer.v1.services;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringEscapeUtils;
import org.springframework.stereotype.Service;

import bingo.common.core.utils.StringUtils;
import bingo.dao.Page;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.CustomerHouse;
import bingo.vkcrm.service.customer.v1.models.blackcar.Building;
import bingo.vkcrm.service.customer.v1.models.blackcar.CustomerContact;
import bingo.vkcrm.service.customer.v1.models.blackcar.CustomerOutRecord;
import bingo.vkcrm.service.customer.v1.models.blackcar.HouseCustomerRelation;
import bingo.vkcrm.service.customer.v1.models.blackcar.HouseCustomerRelationResult;
import bingo.vkcrm.service.customer.v1.models.blackcar.Project;
import bingo.vkcrm.service.customer.v1.models.blackcar.TempCustomerCarRelation;

@Service
public class No2BlackCatService extends CustomerCommonService {

	/**
	 * 客房关系
	 * 
	 * @Description: 
	 * @param: @param
	 *             projectId
	 * @param: @param
	 *             updateTime
	 * @param: @param
	 *             page
	 * @param: @return
	 * @throws:
	 * @Author: huangsx
	 * @date: 2016年4月7日 上午10:28:53
	 * @return:{返回参数名}{返回参数说明}
	 * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
	public HouseCustomerRelationResult queryHouseCustomerRelation(String projectCode, String customerCode,Date updateTime, Page page) {

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("projectCode", projectCode);
		map.put("updateTime", updateTime);
		if (StringUtils.isNotEmpty(customerCode)) {
			map.put("customerCode", customerCode);
		}
		HouseCustomerRelationResult result = null;
		List<HouseCustomerRelation> list = centerRoDao.queryForListPage(HouseCustomerRelation.class, page,
				"sql.query.no2.projectcustomerhouserelation", null, map, true);
		if (null != list && list.size()>0) {
			Project project = centerRoDao.queryForObject(Project.class,
					"select id projectId,code projectCode,name projectName from main_project where code = #projectCode# limit 0,1", map);
			
			// 处理身份证号
			//list = dealCertificateId(list);
			long updateTimeInt = updateTime.getTime()/1000;
			
			result = new HouseCustomerRelationResult(page.getPage().intValue(),
					page.getPageSize().intValue(),page.getTotalPages().intValue(), page.getTotalRows().intValue(), 
					String.valueOf( updateTimeInt), projectCode, project.getProjectName(),
					list);
		}
		return result;
	}

	/**
	 * 将身份证除前4位和后4位用*代替
	 * 
	 * @Description: 
	 * @param: @param
	 *             list
	 * @param: @return
	 * @throws:
	 * @Author: huangsx
	 * @date: 2016年4月7日 下午3:37:23
	 * @return:{返回参数名}{返回参数说明}
	 * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
	private List<HouseCustomerRelation> dealCertificateId(List<HouseCustomerRelation> list) {
		for (HouseCustomerRelation hcr : list) {

			String strId = hcr.getCertificateId();
			if (!StringUtils.isEmpty(strId)) {
				if (strId.length() == 18) {
					hcr.setCertificateId(strId.substring(0, 4) + "**********" + strId.substring(strId.length() - 4));
				} else {
					hcr.setCertificateId(strId.substring(0, 4) + "*******" + strId.substring(strId.length() - 4));
				}
			}

		}
		return list;
	}

	/**
	 * 通过客户编码 获取其所有的联系方式
	 * 
	 * @Description: 
	 * @param: @param
	 *             customerCode
	 * @param: @return
	 * @throws:
	 * @Author: huangsx
	 * @date: 2016年4月6日 下午2:50:02
	 * @return:{返回参数名}{返回参数说明}
	 * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
	public CustomerContact queryAllPhoneNumByCustomerCode(String customerCode) {
		CustomerContact customerContact = new CustomerContact();
		Map<String, String> map = new HashMap<String, String>();
		map.put("customerCode", customerCode);
		customerContact = centerRoDao.queryForObject(CustomerContact.class, "sql.query.customer.contact", map);

		return customerContact;
	}

	/**
	 * 获取所有项目列表
	 * 
	 * @Description:
	 * @param: @param
	 *             page
	 * @param: @return
	 * @throws:
	 * @Author: huangsx
	 * @date: 2016年4月6日 下午5:08:17
	 * @return:{返回参数名}{返回参数说明}
	 * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
	public List<Project> queryAllProjectList() {
		return centerRoDao.queryForList(Project.class,
				"select id projectId,name projectName,code projectCode from main_project", null);

	}

	/**
	 * 根据工程id 获取所有楼栋信息
	 * 
	 * @Description: 
	 * @param: @param
	 *             page
	 * @param: @param
	 *             projectid
	 * @param: @return
	 * @throws:
	 * @Author: huangsx
	 * @date: 2016年4月6日 下午5:16:20
	 * @return:{返回参数名}{返回参数说明}
	 * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
	public List<Building> queryBuildingById(String projectCode) {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("projectCode", projectCode);
		return centerRoDao.queryForList(Building.class,
				" select DISTINCT h.buildingCode,h.buildingName from main_project p " 
			   +" left join main_house h on p.id =h.projectId "
			   +" where p.code = #projectCode#", map);
	}
	
	/**
	 * 插入一条进入数据记录
	 * @Description: 
	 * @param: @param cor
	 * @param: @return
	 * @throws:
	 * @Author: huangsx
	 * @date: 2016年4月7日 下午6:10:16
	 * @return:{返回参数名}{返回参数说明} 
	 * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
	public int insertCustomerOutRecord(CustomerOutRecord cor){
		
		return centerDao.insert(CustomerOutRecord.class, cor);
		
	}
	/**
	 * 插入一条 客车关系
	 * @Description: 
	 * @param: @param tccr
	 * @param: @return
	 * @throws:
	 * @Author: huangsx
	 * @date: 2016年4月7日 下午7:14:29
	 * @return:{返回参数名}{返回参数说明} 
	 * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
	public int insertCustomerCarRelation(TempCustomerCarRelation tccr) {
		return centerDao.insert(TempCustomerCarRelation.class, tccr);
	}
	
}
