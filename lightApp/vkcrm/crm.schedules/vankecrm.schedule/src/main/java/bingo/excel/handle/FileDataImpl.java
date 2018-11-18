/**
 * This file created at 2014-1-6.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.handle;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import bingo.common.core.ApplicationContext;
import bingo.common.core.ApplicationFactory;
import bingo.excel.model.ExcelImportLog;
import bingo.excel.service.ExcelImportLogService;
import bingo.excel.util.ExcelHandleException;
import bingo.security.principal.IUser;

/**
 * 数据处理
 * 
 * @author liuzhd
 */
@Service("fileDataImpl")
public class FileDataImpl implements FileData {

	@SuppressWarnings("unchecked")
	public Map<String, Object> dataHandle(String filePath, String springId) {
		return dataHandle(filePath, springId, new HashMap());
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see bingo.common.data.FileData#dataHandle(java.lang.String,
	 * java.lang.String, java.util.Map)
	 */
	public Map<String, Object> dataHandle(String filePath, String springId,
			Map<String, Object> par) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		if (bingo.common.core.utils.StringUtils.isEmpty(filePath)) {
			resultMap.put("message", "文件路径为空");
			resultMap.put("filePath", "");
			return resultMap;
		}
		String version = filePath.substring(filePath.lastIndexOf(".") + 1,
				filePath.length());
		String suffixs = ApplicationContext.getProperty("data.suffix");
		boolean v = false;
		for (String suffix : suffixs.split(",")) {
			v = suffix.equals(version);
			if (v)
				break;
		}
		if (!v) {
			resultMap.put("message", "非法文件");
			resultMap.put("filePath", "");
			return resultMap;
		}
		String suffix = ApplicationContext.getProperty(version);

		DataHandle handle = ApplicationFactory.getBeanForName(DataHandle.class,
				suffix);
		
		try {
			return handle.parseFile(filePath, springId, par);
		} catch (ExcelHandleException e) {
			resultMap.put("message", e.getMessage());
			resultMap.put("filePath", "");
			return resultMap;
		}
	}
	

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * bingo.excel.handle.FileData#dataHandleAsync(bingo.excel.model.ExcelImportLog
	 * )
	 */
	@SuppressWarnings("unchecked")
	public void dataHandleAsync(ExcelImportLog importItem) {
		dataHandleAsync(importItem, new HashMap());
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * bingo.excel.handle.FileData#dataHandleAsync(bingo.excel.model.ExcelImportLog
	 * , java.util.Map)
	 */
	public void dataHandleAsync(ExcelImportLog importItem,
			Map<String, Object> par) {
		/*
		 * 1、查询importItem对应的springId 
		 * 2、根据importItem.importLoginId模拟对应的登录用户信息
		 * 3、对excel文件进行解析处理 
		 * 4、更新处理进度信息 
		 * 5、更新结果信息到数据库及队列缓存中
		 */

		// 0、importItem为null,则不做处理
		if (importItem == null) {
			return;
		}

		ExcelImportLogService impLogService = ApplicationFactory
 				.getBeanForName(ExcelImportLogService.class,
						"ExcelImportLogService");

		// 1、查询importItem对应的springId
		String springId = impLogService.getDealExcelFileSpringId(importItem);
		if (springId == null || "".equals(springId)) {
			importItem.setOperateResultInfo("导入的业务数据未配置可用的处理服务");
			impLogService.endDealExcelFile(importItem);
			return;
		}

		// 2、根据importItem.importLoginId模拟对应的登录用户信息
		String importLoginId = importItem.getImportLoginId();
		if (importLoginId != null && !"".equals(importLoginId)) {
			IUser user = impLogService.getIUserByLoginId(importLoginId);
			if(user == null){
				importItem.setOperateResultInfo("查找不到导入用户帐号信息");
				impLogService.endDealExcelFile(importItem);
				return;
			}
			if (par != null) {
				par.put("importUser", user);
				par.put("endTime", importItem.getEndTime());
			}
		} else {
			importItem.setOperateResultInfo("导入人信息为空");
			impLogService.endDealExcelFile(importItem);
			return;
		}
		
		// 3、对excel文件进行解析处理
		String srcFileSavePath = importItem.getSrcFileSavePath();
		Map<String, Object> result = dataHandle(srcFileSavePath, springId, par);
		if (result != null) {
			Long successNums = Long.parseLong(""+result.get("successNum"));
			Long errorNums = Long.parseLong(""+result.get("errorNum"));
			Long dealingNum = Long.parseLong(""+result.get("dealingNum"));
			Long validatePassNums = Long.parseLong(""+result.get("validatePassNums"));
			
			String resultFilePath = ""+result.get("filePath");
			
			importItem.setValidatePassNums(validatePassNums);
			importItem.setSuccessNums(successNums);
			importItem.setErrorNums(errorNums);
			importItem.setDealingNum(dealingNum);
			importItem.setResultFilePath(resultFilePath);
			importItem.setOperateResultInfo(""+result.get("message"));
			importItem.setResultFilePath(resultFilePath);
		}else{
			importItem.setOperateResultInfo("导入处理结束，无返回处理情况信息");
		}
		impLogService.endDealExcelFile(importItem);
	}
}
