/**
 * This file created at 2014-1-6.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.handle;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import bingo.common.core.ApplicationContext;
import bingo.excel.util.ExcelHandleException;
import bingo.excel.util.ExcelHandleUtil;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.internal.OSSConstants;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectResult;

/**
 * excel处理
 * 
 * @author xunjw
 */
@SuppressWarnings("unchecked")
public abstract class ExcelHandle implements DataHandle {
	protected final Logger log = LoggerFactory.getLogger(this.getClass());
	protected int m = 0;
	private final ThreadLocal headersThread = new ThreadLocal();
	

	private final String OSS_ID         = ApplicationContext.getProperty("oss.id");//OSS ID
	private final String OSS_SECRET     = ApplicationContext.getProperty("oss.secret");//OSS SECRET
	private final String OSS_ENDPOINT   = ApplicationContext.getProperty("oss.endpoint");
	private final String OSS_BUCKETNAME = ApplicationContext.getProperty("oss.bucket");//bucket：
	
	

	private String getHeaders() {
		String headers = (String) headersThread.get();
		if (headers == null) {
			headers = "";
		}
		return headers;
	}

	private void setHeaders(String headers) {
		headersThread.set(headers);
	}

	private final ThreadLocal filePathThread = new ThreadLocal();

	private String getFilePath() {
		String filePath = (String) filePathThread.get();
		if (filePath == null) {
			filePath = "";
		}
		return filePath;
	}

	private void setFilePath(String filePath) {
		filePathThread.set(filePath);
	}

	private final ThreadLocal cellNumberThread = new ThreadLocal();

	protected Integer getCellNumber() {
		Integer cellNumber = (Integer) cellNumberThread.get();
		if (cellNumber == null) {
			cellNumber = Integer.valueOf("0");
			cellNumberThread.set(cellNumber);
		}
		return cellNumber;
	}

	private void setCellNumber(int cellNumber) {
		cellNumberThread.set(cellNumber);
	}
	
	public Map<String, Object> parseFile(String filePath, String springId,Map<String, Object> par)
			throws ExcelHandleException {
		if("empStudyStaticImpService".equals(springId)){
			m=1;
		}
		return handle(filePath, getWorkbook(filePath), springId,par);
	}

	private Workbook getWorkbook(String filePath) throws ExcelHandleException {
//		this.filePath = filePath;
		setFilePath(filePath);
		InputStream in = null;
		Workbook book = null;
		try {
			String repTo = ApplicationContext.getProperty("excel.server.ip");
			String tmp = filePath;
			if(repTo != null && !"".equals(repTo)){
				tmp = filePath.replaceFirst("\\d+\\.\\d+\\.\\d+\\.\\d+", repTo);
			}
			// 阿里云扩展
			boolean isLocal = false;//true:从本地获取文件，false阿里云上获取文件。本地开发连接不上阿里云才需要本参数，正常情况下为true
			if(isLocal){
				in = new FileInputStream(new File(tmp));
			}else{
				OSSClient ossClient = new OSSClient(OSS_ENDPOINT, OSS_ID, OSS_SECRET);
				in = ossClient.getObject(OSS_BUCKETNAME, filePath).getObjectContent();
				System.out.println("====================="+filePath);
			}			
			String version = tmp.substring(tmp.lastIndexOf(".") + 1,tmp.length());
			if (version.equals("xls")) {
				book = new HSSFWorkbook(in);
			} else {
				book = new XSSFWorkbook(in);
			}
			parseHeader(book);
			return book;
		} catch (FileNotFoundException e) {
			throw new ExcelHandleException("文件找不到路径" + e);
		} catch (IOException e) {
			throw new ExcelHandleException("读取文件失败" + e);
		} finally {
			try {
				if (null != in)
					in.close();
			} catch (IOException e) {
				throw new ExcelHandleException("关闭读取文件流失败" + e);
			}
		}
	}

	public abstract Map<String, Object> handle(String filePath, Workbook workbook,
			String springId,Map<String, Object> par);

	public void parseHeader(Workbook workbook) throws ExcelHandleException {
		Row row = workbook.getSheetAt(0).getRow(m);
		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < row.getPhysicalNumberOfCells(); i++) {
			if (i == row.getPhysicalNumberOfCells() - 1) {
				if (ExcelHandleUtil.getStringCellValue(row.getCell(i)) == null)
					continue;
				buffer.append(ExcelHandleUtil
						.getStringCellValue(row.getCell(i)));
			} else {
				if (ExcelHandleUtil.getStringCellValue(row.getCell(i)) == null)
					continue;
				buffer.append(
						ExcelHandleUtil.getStringCellValue(row.getCell(i)))
						.append(",");
			}
		}
		String str = buffer.toString();
		if (str.lastIndexOf(",") == str.length() - 1) {
			str = str.substring(0, str.length() - 1);
		}
//		headers = str;
		setHeaders(str);
	}

	public Map<String, Object> rowToMap(Row row) throws ExcelHandleException {
		Map<String, Object> item = new HashMap<String, Object>();
//		String[] cells = headers.split(",");
		String[] cells = getHeaders().split(",");
		for (int i = 0; i < cells.length; i++) {
			item.put(cells[i], ExcelHandleUtil.getStringCellValue(row
					.getCell(i)));
		}
//		cellNumber = cells.length;
		setCellNumber(cells.length);
		return item;
	}

	public void setErrorResutlt(Workbook book, Row row, String errorInfo,
			int cellNum) {
		Cell newCell = row.createCell(cellNum);
		newCell.setCellStyle(ExcelHandleUtil.setErrorStyle(book));
		newCell.setCellValue(errorInfo);
	}

	public void setSuccessResutlt(Workbook book, Row row, String successInfo,
			int cellNum) {
		Cell newCell = row.createCell(cellNum);
		newCell.setCellStyle(ExcelHandleUtil.setSuccessStyle(book));
		newCell.setCellValue(successInfo);
	}

	public String savedownloadFile(Workbook book) throws ExcelHandleException {
		
//		String t1 = this.filePath.substring(this.filePath.lastIndexOf("."),
//				this.filePath.length());
//		String t2 = this.filePath.substring(0, this.filePath.lastIndexOf("."))
//				+ "-导入结果";
		String filePath = getFilePath();
		String t1 = filePath.substring(filePath.lastIndexOf("."),filePath.length());
		String t2 = filePath.substring(0, filePath.lastIndexOf("."))+ "-导入结果";
		String repTo = ApplicationContext.getProperty("excel.server.ip");
		String tmp = t2 + t1;
		if(repTo != null && !"".equals(repTo)){
			tmp = tmp.replaceFirst("\\d+\\.\\d+\\.\\d+\\.\\d+", repTo);
		}
		// 阿里云扩展
		boolean isLocal = false;//true:从本地获取文件，false阿里云上获取文件。本地开发连接不上阿里云才需要本参数，正常情况下为true
		if(isLocal){//Excel文件保存到本地
			OutputStream os = null;
			try {
				os = new FileOutputStream(new File(tmp));
				book.write(os);
			} catch (Exception e) {
				throw new ExcelHandleException("回写Excel文件失败" + e);
			} finally {
				if (null != os) {
					try {
						os.flush();
						os.close();
					} catch (IOException e) {
						throw new ExcelHandleException("回写EXCEL数据异常" + e);
					}
				}
			}
		}else{//Excel文件保存到阿里云
			OSSClient ossClient = new OSSClient(OSS_ENDPOINT, OSS_ID, OSS_SECRET);
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			try {
				book.write(os);
			} catch (IOException e) {
				e.printStackTrace();
			}
			InputStream is = new ByteArrayInputStream(os.toByteArray());
			ObjectMetadata objectMeta = new ObjectMetadata();
			PutObjectResult result = ossClient.putObject(OSS_BUCKETNAME,tmp,is,objectMeta);
		}
		return t2 + t1;
		
	}
}
