/**
 * This file created at 2013-6-23.
 *
 * Copyright (c) 2002-2013 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.util;

import java.math.BigDecimal;
import java.util.Date;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * excel工具
 * 
 * @author xunjw
 */
public class ExcelHandleUtil {

	protected final static Logger log = LoggerFactory
			.getLogger(ExcelHandleUtil.class);

	public static CellStyle setErrorStyle(Workbook wb) {
		CellStyle style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_LEFT);
		Font font = wb.createFont();
		font.setColor(IndexedColors.RED.getIndex());
		style.setFont(font);
		return style;
	}

	public static CellStyle setSuccessStyle(Workbook wb) {
		CellStyle style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_LEFT);
		Font font = wb.createFont();
		font.setColor(IndexedColors.BLUE.getIndex());
		style.setFont(font);
		return style;
	}

	/**
	 * 设置模板文件的横向表头单元格的样式
	 * 
	 * @param wb
	 * @return
	 */
	public static CellStyle getTitleStyle(Workbook wb) {
		CellStyle style = wb.createCellStyle();
		// 对齐方式设置
		style.setAlignment(CellStyle.ALIGN_CENTER);
		// 边框颜色和宽度设置
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setFillBackgroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		// 设置背景颜色
		style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		// 粗体字设置
		Font font = wb.createFont();
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		style.setFont(font);
		return style;
	}

	/**
	 * 设置模板文件的横向表头单元格的样式
	 * 
	 * @param wb
	 * @return
	 */
	public static CellStyle getTitleStyleRed(Workbook wb) {
		CellStyle style = wb.createCellStyle();
		// 对齐方式设置
		style.setAlignment(CellStyle.ALIGN_CENTER);
		// 边框颜色和宽度设置
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setFillBackgroundColor(IndexedColors.GREY_25_PERCENT.getIndex());

		// 设置背景颜色
		style.setFillForegroundColor(IndexedColors.RED.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		// 粗体字设置
		Font font = wb.createFont();
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		style.setFont(font);
		return style;
	}

	/**
	 * 获取数据转换
	 * 
	 * @param n
	 * @return
	 */
	public static String transform(int n) {
		String returnString = null;
		String[] str = new String[] { "A", "B", "C", "D", "E", "F", "G", "H",
				"I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
				"U", "V", "W", "X", "Y", "Z" };
		if (n > 26) {
			returnString = str[n / 26 - 1] + str[n % 26 - 1];
		} else {
			returnString = str[n - 1];
		}
		return returnString;
	}

	/**
	 * 只返回String
	 * 
	 * @param cell
	 * @return
	 */
	public static String getStringCell(Cell cell) {
		String strCell = cell.getStringCellValue();
		return strCell.trim();
	}

	/**
	 * 获取单元格数据内容为字符串类型的数据
	 * 
	 * @param cell
	 * @return
	 * @throws ExcelHandleException
	 */
	public static Object getStringCellValue(Cell cell)
			throws ExcelHandleException {
		if (cell == null)
			return "";
		Object obj = null;
		switch (cell.getCellType()) {
		case Cell.CELL_TYPE_NUMERIC: // 数字
			if (HSSFDateUtil.isCellDateFormatted(cell)) {
				obj = cell.getDateCellValue();
			} else {
				Object o = cell.getNumericCellValue();
				BigDecimal bd = new BigDecimal(String.valueOf(o));
				String str = bd.toPlainString();
				obj = subZeroAndDot(str);
			}
			break;
		case Cell.CELL_TYPE_STRING: // 字符串
			obj = cell.getStringCellValue();
			break;
		case Cell.CELL_TYPE_BOOLEAN: // Boolean
			obj = cell.getBooleanCellValue();
			break;
		case Cell.CELL_TYPE_FORMULA: // 公式
			try {
				Object o = cell.getNumericCellValue();
				BigDecimal bd = new BigDecimal(String.valueOf(o));
				String str = bd.toPlainString();
				obj = subZeroAndDot(str);
			} catch (IllegalStateException e) {
				obj = String.valueOf(cell.getRichStringCellValue());
			}
			break;
		case Cell.CELL_TYPE_BLANK: // 空值
			obj = "";
			break;
		case Cell.CELL_TYPE_ERROR: // 故障
			obj = "";
			throw new ExcelHandleException("获取excel值失败");
		default:
			obj = "";
			break;
		}
		return obj;
	}

	/**
	 * 获取单元格数据内容为日期类型的数据
	 * 
	 * @param cell
	 * @return
	 * @throws ExcelHandleException
	 */
	@SuppressWarnings("deprecation")
	public static String getDateCellValue(Cell cell)
			throws ExcelHandleException {
		String result = "";
		try {
			int cellType = cell.getCellType();
			if (cellType == Cell.CELL_TYPE_NUMERIC) {
				Date date = cell.getDateCellValue();
				result = (date.getYear() + 1900) + "-" + (date.getMonth() + 1)
						+ "-" + date.getDate();
			} else if (cellType == Cell.CELL_TYPE_STRING) {
				String date = getStringCellValue(cell).toString();
				result = date.replaceAll("[年月]", "-").replace("日", "").trim();
			} else if (cellType == Cell.CELL_TYPE_BLANK) {
				result = "";
			}
		} catch (Exception e) {
			throw new ExcelHandleException("日期格式不正确" + e);
		}
		return result;
	}

	/**
	 * 使用java正则表达式去掉多余的.与0
	 * 
	 * @param s
	 * @return
	 */
	public static String subZeroAndDot(String s) {
		if (s.indexOf(".") > 0) {
			s = s.replaceAll("0+?$", "");// 去掉多余的0
			s = s.replaceAll("[.]$", "");// 如最后一位是.则去掉
		}
		return s;
	}
}
