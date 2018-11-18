package bingo.vkcrm.service.tel.v1.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.tel.v1.models.Telecomno;

@Service
public class TelUserService extends BaseService{

	/**
	 * 获取电信工号
	 * @param telephonistId
	 * @return
	 */
	public List<Telecomno> getTelNumer(String telephonistId){
		List<Telecomno> numbers = new ArrayList<Telecomno>();
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("telephonistId", telephonistId) ;
		numbers = bizRoDao.queryForList(Telecomno.class,Telecomno.class, "service.telUser.get", parameters);
		return numbers;
	}
}
