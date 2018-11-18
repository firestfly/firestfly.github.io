/**
 * This file created at 2013-6-26.
 *
 * Copyright (c) 2002-2013 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 异常处理 自动记录异常到日志
 * 
 * @author xunjw
 */
public class ExcelHandleException extends Exception {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	protected final Logger log = LoggerFactory.getLogger(this.getClass());

	public ExcelHandleException(String message) {
		super(message);
		log.error(message);
	}

	public ExcelHandleException(String message, Throwable e) {
		super(message, e);
		log.error(message + e);
	}
}
