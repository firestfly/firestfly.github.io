/**
 * This file created at 2014-8-4.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import bingo.common.CallbackResult;
import bingo.common.core.ApplicationContext;
import bingo.common.core.ApplicationFactory;
import bingo.excel.model.ExcelImportLog;
import bingo.excel.service.ExcelImportLogService;
import bingo.uims.business.task.thread.ExcelImportThread;

/**
 * <code>{@link ExcelHandleCacheManager}</code>
 * 
 * excel导入记录的处理信息维护管理类 负责及时更新处理进度信息，并发控制，与其他工程的信息交互
 * 
 * @author liuzhd
 */
public class ExcelHandleCacheManager {
	
	// 最多允许并发处理记录数
	private static Integer THREAD_NUM = Integer.parseInt(ApplicationContext.getProperty("async.excel.import.thread.maxnum", "10"));
	
	// excel导入导出保存数据时间间隔 单位毫秒
	private static Long SAVE_DATA_TIME = Long.parseLong(ApplicationContext.getProperty("async.excel.import.saveData.time", "300000"));

	// 当前并发数
	private static Integer curThreadNum = 0;

	// 当前并发数
	private static final Object lockObject = new Object();

	// excel导入处理队列 taskList
	private static final ConcurrentHashMap<String, Object> TASK_ITEMS = new ConcurrentHashMap<String, Object>();
	
	// 当前并发数
	private static Long preLoadDataFromDBTime = 0L;
	
	/**
	 * 判断是否已有线程开始处理
	 * @param importItem
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static boolean checkIsExists(ExcelImportLog importItem) {
		synchronized (lockObject) {
			boolean rtnFlag = false;
			ConcurrentHashMap<String, ExcelImportLog> dealingMap = (ConcurrentHashMap<String, ExcelImportLog>) TASK_ITEMS.get("dealingMap");
			ConcurrentHashMap<String, String> dealingCountMap = (ConcurrentHashMap<String, String>) TASK_ITEMS.get("dealingCountMap");
			if (importItem != null) {
				if (dealingMap != null) {
					if (dealingMap.containsKey(importItem.getSrcFileSavePath())) {
						if (dealingCountMap != null) {
							String tmp = dealingCountMap.get(importItem.getSrcFileSavePath());
							if (tmp != null && "1".equals(tmp)) {
								rtnFlag = true;
							}
						}
					}
				}
			}

			if (rtnFlag == false) {
				dealingCountMap.put(importItem.getSrcFileSavePath(), "1");
			}

			return rtnFlag;
		}
	}

	public static CallbackResult getCurThreadNum() {
		synchronized (lockObject) {
			if (curThreadNum.intValue() >= THREAD_NUM.intValue()) {
				return new CallbackResult(false);
			} else {
				curThreadNum++;
				return new CallbackResult(true, curThreadNum.toString());
			}
		}
	}

	public static void releaseOneDealNum() {
		synchronized (lockObject) {
			if (curThreadNum >= 0) {
				curThreadNum--;
			}
		}
	}

	@SuppressWarnings("unchecked")
	public static CallbackResult getItemForDealFromData() {
		synchronized (lockObject) {

			ConcurrentHashMap<String, ExcelImportLog> dealingMap = (ConcurrentHashMap<String, ExcelImportLog>) TASK_ITEMS.get("dealingMap");
			ConcurrentHashMap<String, String> dealingCountMap = (ConcurrentHashMap<String, String>) TASK_ITEMS.get("dealingCountMap");

			if (dealingMap == null) {
				dealingMap = new ConcurrentHashMap<String, ExcelImportLog>();
				dealingCountMap = new ConcurrentHashMap<String, String>();
				TASK_ITEMS.put("dealingMap", dealingMap);
				TASK_ITEMS.put("dealingCountMap", dealingCountMap);
			}

			ExcelImportLogService impLogService = ApplicationFactory.getBeanForName(ExcelImportLogService.class, "ExcelImportLogService");
			ExcelImportLog excelImportLog = impLogService.getExcelImportLog();

			if (excelImportLog != null) {

				dealingMap.put(excelImportLog.getSrcFileSavePath(), excelImportLog); // 添加到处理中的队列中

				return new CallbackResult(true, "", excelImportLog);
			} else {
				// 没有需要处理的数据时，返回false
				return new CallbackResult(false, "没有需要处理的excel导入记录");
			}
		}
	}

	@SuppressWarnings("unchecked")
	public static CallbackResult getItemForDeal() {
		synchronized (lockObject) {
			List<ExcelImportLog> taskList = (List<ExcelImportLog>) TASK_ITEMS.get("taskList");

			ConcurrentHashMap<String, ExcelImportLog> dealingMap = (ConcurrentHashMap<String, ExcelImportLog>) TASK_ITEMS.get("dealingMap");
			ConcurrentHashMap<String, Integer> dealingCountMap = (ConcurrentHashMap<String, Integer>) TASK_ITEMS.get("dealingCountMap");

			if (dealingMap == null) {
				dealingMap = new ConcurrentHashMap<String, ExcelImportLog>();
				dealingCountMap = new ConcurrentHashMap<String, Integer>();
				TASK_ITEMS.put("dealingMap", dealingMap);
				TASK_ITEMS.put("dealingCountMap", dealingCountMap);
			}

			if (taskList == null || taskList.size() <= 0) {
				// 对数据库的访问频率不能过高，限制为5分钟一次
				if((System.currentTimeMillis() - preLoadDataFromDBTime.longValue()) >= SAVE_DATA_TIME){
					// 从数据库初始化数据
					ExcelImportLogService impLogService = ApplicationFactory.getBeanForName(ExcelImportLogService.class, "ExcelImportLogService");
					taskList = Collections.synchronizedList(impLogService.getExcelImportLogList());
					
					TASK_ITEMS.put("taskList", taskList);
					
					preLoadDataFromDBTime = System.currentTimeMillis();
				}
			}

			if (taskList != null && taskList.size() > 0) {
				// 获取第一条记录进行返回
				ExcelImportLog excelImportLog = taskList.get(0);
				taskList.remove(0);// 从队列中移除

				dealingMap.put(excelImportLog.getSrcFileSavePath(), excelImportLog); // 添加到处理中的队列中

				return new CallbackResult(true, "", excelImportLog);
			} else {
				// 没有需要处理的数据时，返回false
				return new CallbackResult(false, "没有需要处理的excel导入记录");
			}
		}
	}

	/**
	 * 更新处理进度信息
	 * 
	 * @param importItem
	 */
	@SuppressWarnings("unchecked")
	public static void updateProcessInfo(ExcelImportLog importItem) {
		synchronized (lockObject) {
			if (importItem != null) {
				String itemKey = importItem.getSrcFileSavePath();
				if (itemKey != null && !"".equals(itemKey)) {
					ConcurrentHashMap<String, ExcelImportLog> dealingMap = (ConcurrentHashMap<String, ExcelImportLog>) TASK_ITEMS.get("dealingMap");

					if (dealingMap == null) {
						return;
					}
					dealingMap.remove(itemKey);

					dealingMap.put(itemKey, importItem);
				}
			}
		}
	}

	/**
	 * 更新处理结果信息
	 * 
	 * @param importItem
	 */
	@SuppressWarnings("unchecked")
	public static void updateProcessResultInfo(ExcelImportLog importItem) {
		synchronized (lockObject) {
			if (importItem != null) {
				String itemKey = importItem.getSrcFileSavePath();
				if (itemKey != null && !"".equals(itemKey)) {
					ConcurrentHashMap<String, ExcelImportLog> dealingMap = (ConcurrentHashMap<String, ExcelImportLog>) TASK_ITEMS.get("dealingMap");
					ConcurrentHashMap<String, Integer> dealingCountMap = (ConcurrentHashMap<String, Integer>) TASK_ITEMS.get("dealingCountMap");

					if (dealingMap == null) {
						return;
					}

					ConcurrentHashMap<String, ExcelImportLog> dealedMap = (ConcurrentHashMap<String, ExcelImportLog>) TASK_ITEMS.get("dealedMap");
					ConcurrentHashMap<String, Long> dealedTimeMap = (ConcurrentHashMap<String, Long>) TASK_ITEMS.get("dealedTimeMap");
					
					if (dealedMap == null) {
						dealedMap = new ConcurrentHashMap<String, ExcelImportLog>();
						dealedTimeMap = new ConcurrentHashMap<String, Long>();
						TASK_ITEMS.put("dealedMap", dealedMap);
						TASK_ITEMS.put("dealedTimeMap", dealedTimeMap);
					}

					// 更新状态、结束处理时间、结果文件信息
					ExcelImportLog tmp = dealingMap.get(itemKey);
					if (dealingMap.get(itemKey) == null) {
						return;
					}
					tmp.setOperateStatus(importItem.getOperateStatus());
					tmp.setOperateResultInfo(importItem.getOperateResultInfo());
					tmp.setResultFilePath(importItem.getResultFilePath());

					// 从处理中队列移除
					dealingMap.remove(itemKey);
					if(dealingCountMap != null){
						dealingCountMap.remove(itemKey);
					}

					// 添加到已处理队列 需定期清理 只保留一天
					dealedMap.put(itemKey, tmp);
					dealedTimeMap.put(itemKey, System.currentTimeMillis());
					Object[] dealedRecs = dealedTimeMap.keySet().toArray();
					for (int i = 0; i < dealedRecs.length; i++) {
						Long tmpL = dealedTimeMap.get(dealedRecs[i]);
						if ((System.currentTimeMillis() - tmpL.longValue()) > (24 * 3600 * 1000)) {
							dealedTimeMap.remove(dealedRecs[i]);
							dealedMap.remove(dealedRecs[i]);
						}
					}
				}
			}
		}
	}

	/**
	 * 获取excel导入记录的处理情况
	 * 
	 * @param importItem
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static ExcelImportLog getProcessResultInfo(String srcPath) {
		String itemKey = srcPath;
		if (itemKey == null || "".equals(itemKey)) {
			return null;
		}
		synchronized (lockObject) {
			ConcurrentHashMap<String, ExcelImportLog> dealedMap = (ConcurrentHashMap<String, ExcelImportLog>) TASK_ITEMS.get("dealedMap");
			if (dealedMap != null && !dealedMap.isEmpty()) {
				if (dealedMap.containsKey(itemKey) && dealedMap.get(itemKey) != null) {
					return dealedMap.get(itemKey);
				}
			}

			ConcurrentHashMap<String, ExcelImportLog> dealingMap = (ConcurrentHashMap<String, ExcelImportLog>) TASK_ITEMS.get("dealingMap");
			if (dealingMap != null && !dealingMap.isEmpty()) {
				if (dealingMap.containsKey(itemKey) && dealingMap.get(itemKey) != null) {
					return dealingMap.get(itemKey);
				}
			}

			List<ExcelImportLog> taskList = (List<ExcelImportLog>) TASK_ITEMS.get("taskList");
			if (taskList != null && taskList.size() > 0) {
				for (int i = 0; i < taskList.size(); i++) {
					ExcelImportLog tmp = taskList.get(i);
					if (tmp != null) {
						if (itemKey.equals(tmp.getSrcFileSavePath())) {
							return tmp;
						}
					}
				}
			}

			return null;
		}
	}
	
	@SuppressWarnings("unchecked")
	public static CallbackResult addExcelImportLogBySrcPath(String srcPath) {
		// 根据参数srcPath，从数据库找那个查找到ExcelImportLog，添加到待处理队列中，若待处理队列为空，则直接触发启动处理
		// 注意验重，避免重复不断的加入

		if (srcPath == null || "".equals(srcPath)) {
			return new CallbackResult(false, "参数不能为空！");
		}

		boolean flag = false;
		
		synchronized (lockObject) {
			ExcelImportLogService impLogService = ApplicationFactory.getBeanForName(ExcelImportLogService.class, "ExcelImportLogService");
			ExcelImportLog excelImportLog = impLogService.getExcelImportLogBySrcFilePath(srcPath);
			if (excelImportLog == null) {
				return new CallbackResult(false, "未从数据库中找到详细信息！");
			}
			
			List<ExcelImportLog> taskList = (List<ExcelImportLog>) TASK_ITEMS.get("taskList");
			if (taskList != null && taskList.size() > 0) {
				// 添加到队列中
				taskList.add(excelImportLog);
			} else {
				taskList = Collections.synchronizedList(new ArrayList<ExcelImportLog>());
				taskList.add(excelImportLog);
				TASK_ITEMS.put("taskList", taskList);
				
				//直接触发一次
				flag = true;
			}
			if(flag == false){
				return new CallbackResult(true, "添加到队列成功！");
			}
		}
		
		if(flag){
			new Thread(new ExcelImportThread()).start(); 
		}
		
		return new CallbackResult(true, "添加到队列成功！");
	}
	
}
