/**
 * This file created at 2014-7-31.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.importer;

import java.util.List;
import java.util.Map;

import bingo.common.CallbackResult;

/**
 * <code>{@link IExcelImporter}</code>
 * 
 * TODO : Excel导入接口
 * 
 * @author liuzhd
 */
public interface IExcelImporter {

	/**
	 * 
	 * @param item
	 *            从excel中读取到的一行记录
	 * @param param
	 *            上下文参数，也可保存已验证记录的信息（如用于验重）
	 * @param alreadyData
	 *            已经验证过的行数据
	 * @return 校验结果
	 * @throws Exception
	 *             异常信息
	 */
	public abstract CallbackResult validateOneRow(Map<String, Object> item,
			Map<String, Object> param, List<Map<String, Object>> alreadyData) throws Exception;

	/**
	 * 
	 * @param item
	 *            从excel中读取到的一行记录
	 * @param param
	 *            上下文参数
	 * @return 数据保存结果
	 * @throws Exception异常信息
	 */
	public abstract CallbackResult saveOneRow(Map<String, Object> item,
			Map<String, Object> param) throws Exception;

	/**
	 * 当有某行或多行数据校验不通过时是否允许保存校验通过行的数据 默认：不允许
	 * 
	 * @return
	 */
	public abstract boolean isAllowSaveWhenError();

}
