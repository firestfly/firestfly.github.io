/**
 * This file created at 2014-7-30.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.uims.business.task.schedule;

import bingo.uims.business.task.thread.ExcelImportThread;


/**
 * <code>{@link ExcelImportSchedule}</code>
 *
 * TODO : document me
 *
 * @author Administrator
 */
public class ExcelImportSchedule {

	public void schedule(){
		/*
		 * 定时检查需要处理的excel导入记录
		 * 若当前允许新开进程进行处理，则另启动一个新进程处理一个excel导入任务
		 * 否则则等待
		 * 
		 */
//		new Thread(new ExcelImportThread()).start(); //此种方法并发存在问题
		
		new ExcelImportThread().work();
		
	}
	
	// For Test
	public static void main(String[] args){
//		new Thread(new ExcelImportThread()).start();
		try{
			//new ExcelImportThread().work();
			//new ExcelImportThread().work();
			//new ExcelImportThread().work();
			//new ExcelImportThread().work();
			new ExcelImportThread().work();
		}finally{
			System.exit(0);
		}
	}
}
