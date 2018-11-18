/**
 * This file created at 2014-1-7.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.handle;

import java.util.Map;

import bingo.excel.util.ExcelHandleException;

/**
 * 数据解析接口
 * 
 * @author xunjw
 */
public interface DataHandle {
	public Map<String, Object> parseFile(String filePath, String springId ,Map<String, Object> par)
			throws ExcelHandleException;
}
