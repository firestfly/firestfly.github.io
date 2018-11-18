/**
 * This file created at 2010-10-22.
 *
 * Copyright (c) 2002-2010 Bingosoft, Inc. All rights reserved.
 */
package bingo.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import bingo.dao.IDao;

/**
 * <code>{@link BaseService}</code>
 *
 * 服务类基类
 *
 * @author lixiaohong
 */
public class BaseService {
	protected static final Logger log = LoggerFactory.getLogger(BaseService.class);

	@Autowired
	protected IDao dao;
	@Autowired
	protected IDao rnDao;
	@Autowired
	protected IDao serviceCenterDao;
	@Autowired
	protected IDao serviceCenterRnDao;
	@Autowired
	protected IDao callCenterDao;
	@Autowired
	protected IDao callCenterRnDao;
	
	
	/**
	 * @param dao the dao to set
	 */
	public void setDao(IDao dao) {
		this.dao = dao;
	}
	/**
	 * @param rnDao the rnDao to set
	 */
	public void setRnDao(IDao rnDao) {
		this.rnDao = rnDao;
	}
	/**
	 * @param serviceCenterDao the serviceCenterDao to set
	 */
	public void setServiceCenterDao(IDao serviceCenterDao) {
		this.serviceCenterDao = serviceCenterDao;
	}
	/**
	 * @param serviceCenterRnDao the serviceCenterRnDao to set
	 */
	public void setServiceCenterRnDao(IDao serviceCenterRnDao) {
		this.serviceCenterRnDao = serviceCenterRnDao;
	}
	/**
	 * @param callCenterDao the callCenterDao to set
	 */
	public void setCallCenterDao(IDao callCenterDao) {
		this.callCenterDao = callCenterDao;
	}
	/**
	 * @param callCenterRnDao the callCenterRnDao to set
	 */
	public void setCallCenterRnDao(IDao callCenterRnDao) {
		this.callCenterRnDao = callCenterRnDao;
	}

	
	
	
	
}