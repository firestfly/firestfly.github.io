/**
 * This file created at 2014-8-1.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.importer;

import bingo.common.BaseService;
import bingo.common.CallbackResult;

/**
 * <code>{@link DefaultExcelImporter}</code>
 * 
 * TODO : document me
 * 
 * @author Administrator
 */
public abstract class DefaultExcelImporter extends BaseService implements
		IExcelImporter {
	
	protected boolean isAllowSaveWhenErrorFlag = false;
	
	public CallbackResult success(String message) {
		return new CallbackResult(true, message);
	}

	public CallbackResult fail(String message) {
		return new CallbackResult(false, message);
	}

	public CallbackResult success(String message, Object details) {
		return new CallbackResult(true, message, details);
	}

	public CallbackResult fail(String message, Object details) {
		return new CallbackResult(false, message, details);
	}
}
