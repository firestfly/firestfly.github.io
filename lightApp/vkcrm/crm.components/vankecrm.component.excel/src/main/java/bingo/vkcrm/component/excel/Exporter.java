package bingo.vkcrm.component.excel;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFCellUtil;
import org.apache.poi.xssf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.sql.Clob;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by Wangzr on 16/3/3.
 */
public class Exporter {

    private static final Logger logger = LoggerFactory.getLogger(Exporter.class);
    private XSSFCellStyle leftCellStyle = null;
    private XSSFCellStyle centerCellStyle = null;
    private XSSFCellStyle rightCellStyle = null;
    private IDataQuerier dataQuerier;
    private IRowConverter rowConverter;

    private static Exporter instance;

    public synchronized static Exporter getInstance() {
        if (instance == null) {
            instance = new Exporter();
        }
        return instance;
    }


    public Exporter() {
        this.dataQuerier = new KissUDaoQuerier();
        this.rowConverter = new BasicRowConverter();

    }

    public void export(String fileName, ExportParameters parameters, HttpServletResponse response) {

        try {
            String filenameEncode = URLEncoder.encode(fileName, "UTF-8");//处理中文文件名
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-disposition", "attachment;filename=" + filenameEncode);

            XSSFWorkbook workbook = null;
            XSSFSheet sheet = null;
            workbook = new XSSFWorkbook();
            sheet = this.getNextWritableSheet(workbook, sheet);
            this.writeFieldTitles(workbook, sheet, parameters.getColumnsHeader());
            this.writeDatas(workbook, sheet, parameters);

            OutputStream outputStream = response.getOutputStream();
            workbook.write(outputStream);

            outputStream.flush();
            outputStream.close();
        } catch (IOException var8) {
            logger.error("导出表格数据写到Excel时发生错误", var8);
        } catch (Throwable ex) {
            logger.error("导出过程中发生错误:" + ex.getMessage());
            ex.printStackTrace();
        }
    }

    private XSSFCellStyle getCellStyle(XSSFWorkbook workbook) {
        XSSFCellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setAlignment((short) 2);
        cellStyle.setVerticalAlignment((short) 1);
        cellStyle.setFillPattern((short) 1);
        cellStyle.setFillForegroundColor((short) 22);
        cellStyle.setBorderTop((short) 1);
        cellStyle.setBorderBottom((short) 1);
        cellStyle.setBorderLeft((short) 1);
        cellStyle.setBorderRight((short) 1);
        XSSFFont font = workbook.createFont();
        font.setBoldweight((short) 700);
        font.setColor((short) 8);
        cellStyle.setFont(font);
        return cellStyle;
    }

    private void writeFieldTitles(XSSFWorkbook workbook, XSSFSheet sheet, String[] columnHeaders) {
        XSSFRow row = sheet.createRow(0);
        int i = 0;
        String[] arr$ = columnHeaders;
        int len$ = columnHeaders.length;

        for (int i$ = 0; i$ < len$; ++i$) {
            String header = arr$[i$];
//            XSSFCellUtil.createCell(row, i++, header, this.getCellStyle(workbook));
            XSSFCell cell = row.createCell(i++);
            cell.setCellStyle(this.getCellStyle(workbook));
            cell.setCellValue(this.convertToString(header));
            sheet.autoSizeColumn(i);
        }

    }

    protected void writeDatas(XSSFWorkbook workbook, XSSFSheet sheet, ExportParameters parameters) {
        int total = dataQuerier.queryTotal(parameters.getDaoName(), parameters.getSqlCountId(), parameters.getSqlId(), parameters.getParameters());
        char size = '\ufffa';
        int pages = Math.round((float) (total / size)) + 1;
        List dataSet = null;
        int rowIndex = 1;
        int columnIndex = 0;
        String[] columnsIds = parameters.getColumnsId();
        String[] alignIds = parameters.getColumnsAlign();

        int i;
        for (i = 0; i < pages; ++i) {
            dataSet = dataQuerier.queryPage(parameters.getDaoName(), parameters.getSqlId(), i * size, (i + 1) * size, parameters.getOrderBy(), parameters.getParameters());

            for (Iterator i$ = dataSet.iterator(); i$.hasNext(); ++rowIndex) {
                Map rowData = (Map) i$.next();
                if (null != rowConverter) {
                    rowData = rowConverter.convert(rowData, columnsIds, parameters.getColumnsType());
                }

                XSSFRow row = sheet.createRow(rowIndex);
                columnIndex = 0;
                String[] arr$ = columnsIds;
                int len$ = columnsIds.length;

                for (int i$1 = 0; i$1 < len$; ++i$1) {
                    String id = arr$[i$1];
                    XSSFCell cell = row.createCell(columnIndex);
                   // cell.setCellStyle(this.getCellStyle(workbook, alignIds[columnIndex]));
                    cell.setCellValue(this.convertToString(rowData.get(id.toUpperCase())));
                    ++columnIndex;
                }
            }
        }

        for (i = 0; i < columnIndex; ++i) {
            sheet.autoSizeColumn(i);
        }

    }

    private XSSFCellStyle getCellStyle(XSSFWorkbook workbook, String align) {
        if ("left".equalsIgnoreCase(align) && this.leftCellStyle != null) {
            return this.leftCellStyle;
        } else if ("center".equalsIgnoreCase(align) && this.centerCellStyle != null) {
            return this.centerCellStyle;
        } else if ("right".equalsIgnoreCase(align) && this.rightCellStyle != null) {
            return this.rightCellStyle;
        } else {
            XSSFCellStyle cellStyle = this.getCellStyle(workbook);
            XSSFFont font = workbook.createFont();
            font.setBoldweight((short) 400);
            cellStyle.setFont(font);
            cellStyle.setFillForegroundColor((short) 9);
            if ("left".equalsIgnoreCase(align)) {
                cellStyle.setAlignment((short) 1);
                this.leftCellStyle = cellStyle;
            } else if ("center".equalsIgnoreCase(align)) {
                cellStyle.setAlignment((short) 2);
                this.centerCellStyle = cellStyle;
            } else {
                cellStyle.setAlignment((short) 3);
                this.rightCellStyle = cellStyle;
            }

            return cellStyle;
        }
    }

    private String convertToString(Object value) {
        if (value == null) {
            return "";
        } else if (value instanceof String) {
            return (String) value;
        } else if (value instanceof Date) {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            return format.format((Date) value);
        } else if (value instanceof Clob) {
            Clob v = (Clob) value;

            try {
                return v.getSubString(1L, (int) v.length());
            } catch (SQLException var4) {
                throw new RuntimeException("读取SQL的Clob字段时发生错误", var4);
            }
        } else {
            return String.valueOf(value);
        }
    }

    private XSSFSheet getNextWritableSheet(XSSFWorkbook workbook, XSSFSheet sheet) {
        if (sheet == null) {
            return workbook.createSheet("Sheet1");
        } else {
            int currentIndex = Integer.valueOf(sheet.getSheetName()).intValue();
            return workbook.createSheet("Sheet" + String.valueOf(currentIndex + 1));
        }
    }
}
