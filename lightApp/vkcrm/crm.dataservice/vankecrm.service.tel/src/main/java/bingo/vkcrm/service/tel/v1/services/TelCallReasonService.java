package bingo.vkcrm.service.tel.v1.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import bingo.security.principal.IUser;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.tel.v1.models.TelCallReason;

/**
 * 采集原因配置
 * @author chengsiyuan
 *
 */
@Service
public class TelCallReasonService extends BaseService{
	/**
	 * 获取全部通话原因
	 * @return
	 */
	public List<TelCallReason> getAllCallReson(String type){
		List<TelCallReason> list = new ArrayList<TelCallReason>();
		Map<String, Object> params = new HashMap<String, Object>();
		// type=0查询全部原因，type=1 呼入,type=2 呼出
		if(!type.equals("0")){
			params.put("type", type);			
		}
		list = bizRoDao.queryForList(TelCallReason.class, TelCallReason.class, "service.telcallreason", params);
		return list;
	}
	/**
	 * 更新通话原因
	 * @param telcallreason
	 */
	public void updateCallReason(TelCallReason telcallreason){
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", telcallreason.getId());
		//获取原来的数�?
		TelCallReason oldtelcallreason = bizRoDao.queryForObject(TelCallReason.class, "service.telcallreason", params);
		//不变的数据重新赋�?
		telcallreason.setEnabled(true);
		telcallreason.setCreateTime(oldtelcallreason.getCreateTime());
		telcallreason.setCreator(oldtelcallreason.getCreator());
		telcallreason.setCreatorId(oldtelcallreason.getCreatorId());
		bizDao.update(telcallreason);
	}
	/**
	 * 删除通话原因
	 */
	public void removeCallReason(String id){
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", id);
		TelCallReason telcallreason = bizRoDao.queryForObject(TelCallReason.class, "service.telcallreason", params);
		telcallreason.setEnabled(false);
		bizDao.update(telcallreason);
	}
	/**
	 * 新增通话原因
	 * @param telcallreason
	 */
	public void addCallReason(TelCallReason telcallreason,IUser creator){
		telcallreason.setEnabled(true);
		telcallreason.setCreateTime(new Date());
		telcallreason.setCreator(creator.getName());
		telcallreason.setCreatorId(creator.getId());
		bizDao.insert(telcallreason);
	}
	
	
	
	
	
}
