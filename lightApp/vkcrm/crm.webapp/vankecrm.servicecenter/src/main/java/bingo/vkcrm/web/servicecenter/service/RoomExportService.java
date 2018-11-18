package bingo.vkcrm.web.servicecenter.service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import bingo.security.principal.IUser;
import bingo.vkcrm.service.enums.DictionaryCodes;
import bingo.vkcrm.service.model.DictionaryItem;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.service.DictionaryService;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectResult;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.DVConstraint;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDataValidation;
import org.apache.poi.hssf.usermodel.HSSFDataValidationHelper;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddressList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bingo.common.core.ApplicationContext;
import bingo.dao.Dao;
import bingo.security.SecurityContext;
import bingo.vkcrm.web.servicecenter.model.DeliverHouseCarport;
import bingo.vkcrm.web.servicecenter.model.ExcelPoiUtil;
import bingo.vkcrm.web.servicecenter.model.ExcelPoiUtilWithoutTitle;

@Service
@SuppressWarnings("all")
public class RoomExportService extends BaseService {
	
	@Autowired
	private DictionaryService dictionaryService;
	/**
	 * 导出待交付房屋或车位
	 *
	 * @param projectId 导出人所属项目ID
	 * @throws Exception
	 */
	public HSSFWorkbook export(Map<String, Object> queryMap,String fileName) throws Exception {
		String[]  str = new String[2];
		str[0] = "待交付房屋或车位.xls";
		ExcelPoiUtilWithoutTitle ep = new ExcelPoiUtilWithoutTitle();
		String[] headers = { "客户名称@null@3000",
							 "证件类型@null@3000",
							 "证件号码@null@7000",
							 "手机号码@null@5000",
							 "备用手机号码@null@5000",
							 "客房关系@null@3000",
							 "房屋/车位@type@3000",
							 "名称@name@10000",
							 "单元@unit@2000",
							 "编号@code@10000",
							 "项目名称@projectName@5000",
							 "项目编号@projectCode@5000",
							 "楼栋@buildingName@9000"};
		String uploadPath = ApplicationContext.getProperty("uploadPath")+"/HouseExport";
		queryMap.put("userId", SecurityContext.getCurrentUser().getId());
		List<DeliverHouseCarport> rooms = centerRoDao.queryForList(DeliverHouseCarport.class, "roomsExport.list", queryMap);
	    String path = uploadPath+"/"+Dao.getUUID().toUpperCase()+"待交付房屋或车位.xls";
	    str[1] = path;
	    HSSFWorkbook hssfWorkbook = ep.createExcel2Export("待交付房屋或车位",path, headers, rooms);
	    setValidation(hssfWorkbook);
	    return hssfWorkbook;
	}
	
	/**
	 * 设置单元格有效性
	 * @param hssfWorkbook
	 */
	private void setValidation(HSSFWorkbook hssfWorkbook){
		
		HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(0);
		// 获取证件类型列表、客服关系列表
		List<DictionaryItem> customerCertificateTypeList = dictionaryService.get(DictionaryCodes.CustomerCertificateType.getCode(), "CRMv2");
		List<DictionaryItem> customerRelationTypeList = dictionaryService.get(DictionaryCodes.HouseCustomerRelationType.getCode());
		List<DictionaryItem> carportCustomerRelationList = dictionaryService.get(DictionaryCodes.CarportCustomerRelation.getCode());
		
		// 将列表转成字符串
		String[] customerCertificateTypeArr = getValueArray(customerCertificateTypeList);
		String[] customerRelationTypeArr = getValueArray(customerRelationTypeList);
		String[] carportCustomerRelationTypeArr = getValueArray(carportCustomerRelationList);
		String[] buildingTypeArr = new String[]{"房屋","车位"};
		
		// 设置数据有效性
		addValidation(hssfSheet, customerCertificateTypeArr, 1, hssfSheet.getLastRowNum(),1, 1);
		addValidation(hssfSheet, buildingTypeArr, 1, hssfSheet.getLastRowNum(),6, 6);
		
		int caportIndex = getCaportIndex(hssfSheet, 1, 6);
		addValidation(hssfSheet, customerRelationTypeArr, 1, caportIndex,5,5);
		addValidation(hssfSheet, carportCustomerRelationTypeArr, caportIndex, hssfSheet.getLastRowNum(),5,5);
	}
	
	/**
	 * 导出时房屋在前面，车位在后面，需要修改关系下拉框默认值
	 * @param hssfSheet
	 * @param firstRow
	 * @param col
	 * @return
	 */
	private int getCaportIndex(HSSFSheet hssfSheet,int firstRow,int col){
		for(int i=firstRow;i<hssfSheet.getLastRowNum();i++){
			String value = hssfSheet.getRow(i).getCell(col).getStringCellValue();
			if(StringUtils.isNotEmpty(value) && value.equals("车位")){
				return i-1;
			}
		}
		return hssfSheet.getLastRowNum();
	}
	
	/**
	 * 设置单元格数据有效性
	 * @param hssfSheet Excel表格
	 * @param textList 序列内容
	 * @param firstRow 起始行
	 * @param endRow 终止行
	 * @param firstCol 起始列
	 * @param endCol 终止列
	 */
	private void addValidation(HSSFSheet hssfSheet,String[] textList,int firstRow,int endRow,int firstCol,int endCol){
		//加载下拉列表内容
		DVConstraint constraint = DVConstraint.createExplicitListConstraint(textList);
		//设置数据有效性加载在哪个单元格上。 
		//四个参数分别是：起始行、终止行、起始列、终止列 
		CellRangeAddressList regions = new CellRangeAddressList(firstRow,endRow, firstCol, endCol); 
		//数据有效性对象
		HSSFDataValidation data_validation = new HSSFDataValidation(regions, constraint); 
		hssfSheet.addValidationData(data_validation); 
	}
	
	/**
	 * 获取数据字典名称列表
	 * @param items
	 * @return
	 */
	private String[] getValueArray(List<DictionaryItem> items){
		String[] arr = new String[items.size()];
		for(int i = 0;i<items.size();i++){
			arr[i] = items.get(i).getValue();
		}
		return arr;
	}
	
	
	
}
