/**
 * This file created at 2014-1-6.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.handle;

import java.util.Map;

import bingo.common.CallbackResult;
import bingo.excel.model.ExcelImportLog;

/**
 * 数据导入接口
 * 
 * @author xunjw
 */
public interface FileData {
	/**
	 * excel文件处理
	 * 
	 * @param filePath
	 *            文件路径
	 * @param springId
	 *            处理规则
	 * @return
	 */
	public Map<String, Object> dataHandle(String filePath, String springId);

	/**
	 * excel文件处理
	 * 
	 * @param filePath
	 *            文件路径
	 * @param springId
	 *            处理规则
	 * @param par
	 *            验证数据处理参数
	 * @return
	 */
	public Map<String, Object> dataHandle(String filePath, String springId,
			Map<String, Object> par);

	/**
	 * 
	 * @param importItem
	 *            excel导入记录
	 * @return
	 */
	public void dataHandleAsync(ExcelImportLog importItem);

	/**
	 * 
	 * @param importItem
	 *            excel导入记录
	 * @param par
	 *            验证数据处理参数
	 * @return
	 */
	public void dataHandleAsync(ExcelImportLog importItem,
			Map<String, Object> par);
}
