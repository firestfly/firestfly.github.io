/**
 * This file created at 2014年8月14日.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.handle;

import java.util.HashMap;
import java.util.Map;

import bingo.excel.model.ExcelImportLog;

/**
 * <code>{@link EmpStudyFileDataImpl}</code>
 *
 * TODO : document me
 *
 * @author Administrator
 */
public class EmpStudyFileDataImpl extends FileDataImpl {
	public void getEndTime(ExcelImportLog importItem){
		Map<String, Object> par = new HashMap<String, Object>();
		par.put("endTime", importItem.getEndTime());
		this.dataHandleAsync(importItem, par);
	}
}
