/**
 * This file created at 2014-7-31.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import bingo.common.BaseService;
import bingo.common.core.ApplicationContext;
import bingo.excel.model.ExcelImportLog;
import bingo.excel.util.ExcelHandleCacheManager;
import bingo.security.principal.IUser;
import bingo.security.principal.User;

/**
 * <code>保存excel处理进度、结果等信息到数据库</code> <br/>
 * <code>查询excel处理进度、结果等信息</code>
 * 
 * @author liuzhd
 */
@Service("ExcelImportLogService")
public class ExcelImportLogService extends BaseService {
	
	public ConcurrentHashMap<String,Long> localMap = new ConcurrentHashMap<String,Long>();

	public void startDealExcelFile(ExcelImportLog item) {
		// 更新状态、开始处理时间、记录总数、最后修改人、最后修改时间
		if (item != null) {
			item.setOperateStatus(ApplicationContext.getProperty("async.excel.import.step2.msg", "数据校验中"));
			item.setDealBeginTime(new Date());
			item.setDealingNum(0L);
			item.setErrorNums(0L);
			item.setSuccessNums(0L);

			// 更新缓存
			ExcelHandleCacheManager.updateProcessInfo(item);

			// 更新数据库
			serviceCenterDao.update("ExcelImportLogService.startDealExcelFile", item);
			localMap.put(item.getSrcFileSavePath(), System.currentTimeMillis());
			log.debug("添加："+item.getSrcFileSavePath());
		}
	}

	public void updateDealExcelFile(ExcelImportLog item) {
		// 更新状态、开始处理时间、记录总数、最后修改人、最后修改时间
		if (item != null) {

			// 更新缓存
			ExcelHandleCacheManager.updateProcessInfo(item);

			Long preUpdateTime = localMap.get(item.getSrcFileSavePath());
			if(preUpdateTime !=null){
				if((System.currentTimeMillis() - preUpdateTime.longValue()) >= 3000){
					// 更新数据库，需隔断时间进行一次(当前为3000毫秒)
					log.debug("保存数据库："+item.getFileShortName()+" otalNums:"+item.getTotalNums()+" successNums:"+item.getSuccessNums()+" errorNums:"+item.getErrorNums());
					serviceCenterDao.update("ExcelImportLogService.updateDealExcelFile", item);
					localMap.put(item.getSrcFileSavePath(), System.currentTimeMillis());
				}
			}
		}
	}
	
	public void updateDealExcelFileAsycn(ExcelImportLog item) {
		// 实时更新数据库记录状态、开始处理时间、记录总数、最后修改人、最后修改时间
		if (item != null) {

			// 更新缓存
			ExcelHandleCacheManager.updateProcessInfo(item);

			// 更新数据库，需隔断时间进行一次(当前为3000毫秒)
			log.debug("保存数据库："+item.getFileShortName()+" otalNums:"+item.getTotalNums()+" successNums:"+item.getSuccessNums()+" errorNums:"+item.getErrorNums());
			serviceCenterDao.update("ExcelImportLogService.updateDealExcelFile", item);
		}
	}

	public void endDealExcelFile(ExcelImportLog item) {
		// 更新状态、开始处理时间、记录总数、最后修改人、最后修改时间、处理结果信息
		if (item != null) {
			
			item.setOperateStatus(ApplicationContext.getProperty("async.excel.import.step4.msg", "已处理"));

			// 更新缓存
			ExcelHandleCacheManager.updateProcessResultInfo(item);
			// 更新数据库
			serviceCenterDao.update("ExcelImportLogService.endDealExcelFile", item);
			localMap.remove(item.getSrcFileSavePath());
			log.debug("清理："+item.getSrcFileSavePath());
		}
	}

	/**
	 * 获取需要处理的excel导入记录
	 * 
	 * @return
	 */
	public List<ExcelImportLog> getExcelImportLogList() {
		return serviceCenterRnDao.queryForList(ExcelImportLog.class,
				"ExcelImportLogService.getExcelImportLogList", null);
	}
	
	/**
	 * 获取最早导入且还未处理的excel导入记录
	 * 
	 * @return
	 */
	public ExcelImportLog getExcelImportLog() {
		List<ExcelImportLog> rtnList = rnDao.queryForList(ExcelImportLog.class, "ExcelImportLogService.getExcelImportLog", null);
		if (rtnList != null && rtnList.size() > 0) {
			return rtnList.get(0);
		} else {
			return null;
		}
	}

	/**
	 * 根据srcFileSavePath获取ExcelImportLog对象
	 * 
	 * @param item
	 * @return
	 */
	public ExcelImportLog getExcelImportLogBySrcFilePath(String srcFileSavePath) {
		ExcelImportLog item = null;
		if (srcFileSavePath != null && !"".equals(srcFileSavePath)) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("srcFileSavePath", srcFileSavePath);
			item = serviceCenterRnDao.queryForObjectQuietly(
						ExcelImportLog.class,
						"ExcelImportLogService.getExcelImportLogBySrcFilePath",
						map);
		}
		return item;
	}

	/**
	 * 获取处理指定导入的excel文件的Service的springId
	 * 
	 * @param item
	 * @return
	 */
	public String getDealExcelFileSpringId(ExcelImportLog item) {
		String springId = "";
		if (item != null) {
			try {
				Map<String, Object> map = new HashMap<String, Object>();
				map.put("businessType", item.getBusinessType());
				springId = serviceCenterRnDao.queryForStringQuietly(
						"ExcelImportLogService.getDealExcelFileSpringId", map);
			} catch (Exception e) {
				log.error("when call getDealExcelFileSpringId() exception ocurred:", e);
			}

		}
		return springId;
	}

	/**
	 * 根据loginId获取User信息
	 * 
	 * @param loginId
	 * @return
	 */
	public IUser getIUserByLoginId(String loginId) {
		IUser rtnUser = null;
		if (loginId != null && !"".equals(loginId)) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("loginId", loginId);
			rtnUser = rnDao.queryForObjectQuietly(User.class,"ExcelImportLogService.getIUserByLoginId", map);
		}		
		return rtnUser;
	}
}
