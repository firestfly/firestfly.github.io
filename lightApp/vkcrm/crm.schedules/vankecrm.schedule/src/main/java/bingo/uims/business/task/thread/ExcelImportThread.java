/**
 * This file created at 2014-8-4.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.uims.business.task.thread;

import bingo.common.CallbackResult;
import bingo.common.core.ApplicationFactory;
import bingo.excel.handle.FileData;
import bingo.excel.model.ExcelImportLog;
import bingo.excel.service.ExcelImportLogService;
import bingo.excel.util.ExcelHandleCacheManager;

/**
 * <code>{@link ExcelImportThread}</code>
 * 
 * Excel队列记录处理类
 * 
 * @author Administrator
 */
public class ExcelImportThread implements Runnable {

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Runnable#run()
	 */
	public void run() {
		work();
	}
	
	public void work(){
		// 从待处理队列中获取一条记录进行处理
		/**
		 * 1、获取当前进行中的线程数，若超过阀值，则结束，否则继续 2、按序获取一条导入记录进行处理 3、保存处理结果信息
		 */
//		System.out.println((new Date()).toString()
//				+ "   excute ExcelImportThread.run()");

		CallbackResult rtn = ExcelHandleCacheManager.getCurThreadNum();
		if (rtn.isSuccess()) {
//			System.out.println((new Date()).toString()
//					+ "   excute ExcelImportThread.run() 001："
//					+ rtn.getMessage());

			CallbackResult rtnItem = ExcelHandleCacheManager.getItemForDeal();
			
			if (rtnItem.isSuccess()) {
				ExcelImportLog itemLog = (ExcelImportLog) rtnItem.getDetails();
//				//还未被处理时才进行后续动作
				if(ExcelHandleCacheManager.checkIsExists(itemLog) == false){
					if (itemLog != null) {
						FileData data = ApplicationFactory.getBeanForName(
								FileData.class, "fileDataImpl");
						try {
							data.dataHandleAsync(itemLog);
						} catch (Exception e) {
							itemLog.setOperateResultInfo("处理失败：" + e.getMessage());
							ExcelImportLogService impLogService = ApplicationFactory
									.getBeanForName(ExcelImportLogService.class,
											"ExcelImportLogService");
							impLogService.endDealExcelFile(itemLog);
						}
					}
				}
			}
			
			// 处理完之后释放一个并发数
			ExcelHandleCacheManager.releaseOneDealNum();

		}
//		else {
//			System.out.println((new Date()).toString()
//					+ "   excute ExcelImportThread.run() 002：获取线程数失败");
//		}
	}

}
