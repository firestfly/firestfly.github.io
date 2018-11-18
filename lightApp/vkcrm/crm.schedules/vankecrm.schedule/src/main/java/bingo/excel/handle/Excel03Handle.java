/**
 * This file created at 2014-1-6.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.handle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Service;

import bingo.common.CallbackResult;
import bingo.common.core.ApplicationContext;
import bingo.common.core.ApplicationFactory;
import bingo.excel.importer.IExcelImporter;
import bingo.excel.model.ExcelImportLog;
import bingo.excel.service.ExcelImportLogService;
import bingo.excel.util.ExcelHandleException;

/**
 * 03版本excel导入解析
 * 
 * @author xunjw
 */
@Service("Excel03Handle")
public class Excel03Handle extends ExcelHandle {

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * bingo.uims.common.data.excel.ExcelHandle#handle(org.apache.poi.ss.usermodel
	 * .Workbook, java.lang.String)
	 */
	@Override
	public Map<String, Object> handle(String filePath, Workbook workbook,
			String springId, Map<String, Object> par) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int successNum = 0;// 成功数
		int errorNum = 0;// 失败数
		int validatePassNums = 0;//校验通过数
		
		IExcelImporter importer = ApplicationFactory.getBeanForName(
				IExcelImporter.class, springId);
		Sheet sheet = workbook.getSheetAt(0);
		int count = sheet.getPhysicalNumberOfRows() - 1;
		int m = 1;  //
		
		if("empStudyStaticImpService".equals(springId)){
			m = 2;
			count -= 1;
		}
		// 开始处理日志保存
		ExcelImportLogService impLogService = ApplicationFactory
				.getBeanForName(ExcelImportLogService.class,
						"ExcelImportLogService");
		ExcelImportLog importLog = impLogService
				.getExcelImportLogBySrcFilePath(filePath);
		if (importLog != null) {
			importLog.setTotalNums(Long.parseLong("" + count));
			impLogService.startDealExcelFile(importLog);
		}
		List<Map<String, Object>> savaDataList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> alreadyData = new ArrayList<Map<String, Object>>();
		// 验证每一行excel数据
		for (int i = m; i < sheet.getPhysicalNumberOfRows(); i++) {
			Row row = sheet.getRow(i);
			if (null == row) {
				continue;
			}
			Map<String, Object> rowMap = null;
			try {
				rowMap = rowToMap(row);
			} catch (ExcelHandleException e) {
				e.printStackTrace();
				errorNum++;
				setErrorResutlt(workbook, row, "数据转换失败：" + e.getMessage(), row
						.getPhysicalNumberOfCells());
				updateImportProcessInfo(successNum, errorNum, successNum, i, impLogService,
						importLog);
				continue;
			}

			CallbackResult result = null;
			try {
				result = importer.validateOneRow(rowMap, par, alreadyData);
			} catch (Exception e) {
				e.printStackTrace();
				errorNum++;
				setErrorResutlt(workbook, row, "校验失败：" + e.getMessage(), row
						.getPhysicalNumberOfCells());
				updateImportProcessInfo(successNum, errorNum, successNum, i, impLogService,
						importLog);
				continue;
			}
			if (result != null) {
				if (result.isSuccess()) {
					successNum++;
					rowMap.put("_excel_row_index_", i);
					savaDataList.add(rowMap);
					setSuccessResutlt(workbook, row, null != result
							.getMessage() ? result.getMessage().toString()
							: "成功", getCellNumber());
				} else {
					errorNum++;
					setErrorResutlt(workbook, row,
							null != result.getMessage() ? result.getMessage()
									.toString() : "导入失败", getCellNumber());
				}
			} else {
				errorNum++;
				setErrorResutlt(workbook, row, "数据校验为空", getCellNumber());
			}
			updateImportProcessInfo(successNum, errorNum, successNum, i, impLogService,	importLog);
		}

		String fielPath = null;
		
		validatePassNums = successNum;
		resultMap.put("validatePassNums", validatePassNums);
		resultMap.put("dealingNum", count);
		resultMap.put("successNum", successNum);
		resultMap.put("errorNum", errorNum);
		
		// 导入成功数为0，返回错误
		if (validatePassNums == 0) {
			try {
				fielPath = savedownloadFile(workbook);
			} catch (ExcelHandleException e) {
				log.error("本次数据导入完成，生成文件失败，不影响导入数据，失败原因可能网络异常造成IO异常");
				// 允许回写Excel失败时仍允许导入数据库，故此处只进行log，不再抛出异常
			}
			resultMap.put("filePath", fielPath);
			if (importLog != null) {
				importLog.setResultFilePath(filePath);
			}
			resultMap.put("message", "记录总数：" + count + "条，校验通过"+validatePassNums+"条，导入失败！");
			return resultMap;
		}
		
		// 如果有校验不通过的行且出错时不允许导入，则返回
		if (errorNum > 0 && importer.isAllowSaveWhenError() == false) {
			try {
				fielPath = savedownloadFile(workbook);
			} catch (ExcelHandleException e) {
				log.error("本次数据导入完成，生成文件失败，不影响导入数据，失败原因可能网络异常造成IO异常");
				// 允许回写Excel失败时仍允许导入数据库，故此处只进行log，不再抛出异常
			}
			resultMap.put("filePath", fielPath);
			if (importLog != null) {
				importLog.setResultFilePath(filePath);
			}
			resultMap.put("message", "记录总数：" + count + "条，校验不通过" + errorNum + "条，导入失败！");
			return resultMap;
		}
		
		if (importLog != null) {
			// 此处进行一次实时更新
			importLog.setOperateStatus(ApplicationContext.getProperty("async.excel.import.step3.msg", "数据处理中"));
			importLog.setErrorNums(Long.valueOf("" + errorNum));
			importLog.setSuccessNums(Long.valueOf("" + successNum));
			importLog.setValidatePassNums(Long.valueOf("" + validatePassNums));
			importLog.setDealingNum(0L);
			impLogService.updateDealExcelFileAsycn(importLog);
		}

		// 导入数据保存到业务表
		for (int j = 0; j < savaDataList.size(); j++) {
			Map<String, Object> rowMap = savaDataList.get(j);
			if (rowMap != null) {
				int rowIndex = Integer.valueOf(""
						+ rowMap.get("_excel_row_index_"));
				Row row = sheet.getRow(rowIndex);
				if (row == null) {
					continue;
				}
				CallbackResult result = null;
				try {
					result = importer.saveOneRow(savaDataList.get(j), par);
				} catch (Exception e) {
					successNum--;
					errorNum++;
					setErrorResutlt(workbook, row,
							"导入失败:" + e.getMessage(), getCellNumber());
				}
				if (result != null) {
					if (!result.isSuccess()) {
						errorNum++;
						successNum--;
						setErrorResutlt(workbook, row, null != result
								.getMessage() ? result.getMessage()
								.toString() : "导入失败", getCellNumber());
					}
				}
				// j是从0开始的，故当前处理记录应为j + 1
				updateImportProcessInfo(successNum, errorNum, validatePassNums, (j + 1),
						impLogService, importLog);
			}
		}
		resultMap.put("dealingNum", savaDataList.size());
		
		try {
			fielPath = savedownloadFile(workbook);
		} catch (ExcelHandleException e) {
			log.error("本次数据导入完成，生成文件失败，不影响导入数据，失败原因可能网络异常造成IO异常");
			// 允许回写Excel失败时仍允许导入数据库，故此处只进行log，不再抛出异常
		}
		
		resultMap.put("successNum", successNum);
		resultMap.put("errorNum", errorNum);
		resultMap.put("filePath", fielPath);
		
		resultMap.put("message", "记录总数：" + count + "条，" + successNum + "条导入成功" + (errorNum == 0 ? "！" : ("，" + errorNum + "条导入失败！")));
		return resultMap;
	}

	/**
	 * @param successNum
	 * @param errorNum
	 * @param impLogService
	 * @param importLog
	 */
	private void updateImportProcessInfo(int successNum, int errorNum,  int validatePassNums, 
			int index, ExcelImportLogService impLogService,
			ExcelImportLog importLog) {
		if (importLog != null) {
			importLog.setErrorNums(Long.valueOf("" + errorNum));
			importLog.setSuccessNums(Long.valueOf("" + successNum));
			importLog.setValidatePassNums(Long.valueOf("" + validatePassNums));
			importLog.setDealingNum(Long.valueOf("" + index));
			impLogService.updateDealExcelFile(importLog);
		}
	}
}
