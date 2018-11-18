package bingo.vkcrm.service.report.v1.controllers;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.report.v1.Version;
import bingo.vkcrm.service.report.v1.model.BasicInformation;
import bingo.vkcrm.service.report.v1.services.CallCenterReportService;

@Controller
@RequestMapping(value = Version.API_PATH)
public class BasicInformationController extends BaseController {
	private int exportexampleStatus = 0;
	private int exportcatbrandStatus = 0;
	@Autowired
	CallCenterReportService service;

	@RequestMapping(value = "/baseInfoReport", method = RequestMethod.GET)
	@ResponseBody
	public ServiceResult getTaskReport(BasicInformation baseInfo) {
		baseInfo.setSysUserId(getCurrentUser().getId());
		Page page = null;
		if (baseInfo.getCurPage() != null && baseInfo.getPageSize() != null) {
			page = new Page();
			page.setPage(Integer.parseInt(baseInfo.getCurPage()));
			page.setPageSize(Integer.parseInt(baseInfo.getPageSize()));
		}
		ListResult<BasicInformation> result = new ListResult<BasicInformation>(page,
				service.getBaseInfoReport(baseInfo, page));
		return ServiceResult.succeed(result);
	}

	@RequestMapping(value = "/baseInfoReport/export", method = RequestMethod.GET)
	@ResponseBody
	public String exportTaskReport(BasicInformation baseInfo, HttpServletResponse response,
			HttpServletRequest request) {
		baseInfo.setSysUserId(getCurrentUser().getId());
		String path = null;
		try {
			// 1、得到压缩包的名称
			String zipFileName = exportBaseInfoReport(baseInfo);
			path = getClassPath() + zipFileName;
		} catch (Exception e) {
			path = null;
		}
		return path;
	}
	
	@RequestMapping(value = "/baseInfoReport/downdload", method = RequestMethod.GET)
	@ResponseBody
	public void download(HttpServletRequest request, HttpServletResponse response,String filePath) {
		File file = new File(filePath);
		try {
			// 2、下载压缩包
			if (file.exists()) {
				InputStream ins = new FileInputStream(filePath);
				BufferedInputStream bins = new BufferedInputStream(ins);// 放到缓冲流里面
				OutputStream outs = response.getOutputStream();// 获取文件输出IO流
				BufferedOutputStream bouts = new BufferedOutputStream(outs);
				response.setContentType("application/x-download");// 设置response内容的类型
				response.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(file.getName(), "UTF-8"));// 设置头部信息 
				int bytesRead = 0;
				byte[] buffer = new byte[8192];
				// 开始向网络传输文件流
				while ((bytesRead = bins.read(buffer, 0, 8192)) != -1) {
					bouts.write(buffer, 0, bytesRead);
				}
				bouts.flush();// 这里一定要调用flush()方法
				ins.close();
				bins.close();
				outs.close();
				bouts.close();
				this.exportcatbrandStatus = 1;
			} else {
				this.exportcatbrandStatus = 2;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private String exportBaseInfoReport(BasicInformation baseInfo) {
		/** Excel 07-2003一个工作表最多可有65536行 */
		Page page = new Page();
		page.setPage(1);// 第一页开始
		page.setTotalRows(10000);// 每个EXCEL条数据
		page.setPageSize(10000);
		String zipFileName = "BASE_INFO_REPORT_" + getDateNo() + ".zip"; // 压缩包的名称
		int total = service.getBaseInfoReportCount(baseInfo);// 总记录数
		if (total > 0) {
			List<File> excelFiles = new ArrayList<File>();
			int totalPage = total / page.getTotalRows();
			if (total % page.getTotalRows() != 0) {
				totalPage += 1;
			}
			for (int sheetNum = 1; sheetNum <= totalPage; sheetNum++) {
				// 将每一页的数据生成一个对应的Excel文件
				page.setPage(sheetNum);
				List<BasicInformation> basicInformations = service.getBaseInfoReport(baseInfo, page);
				excelFiles.add(BaseInfoReportSheet(basicInformations, sheetNum));
				basicInformations = null;
			}
			// 4、将所有生成的excel文件打包成zip，最后删除所有生成的excel文件
			if (CollectionUtils.isNotEmpty(excelFiles)) {
				try {
					fileToZip(zipFileName, excelFiles);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		return zipFileName;
	}

	private File BaseInfoReportSheet(List<BasicInformation> basicInformations, int sheetNum) {
		Workbook workbook = new HSSFWorkbook();
		Sheet sheet = workbook.createSheet("BASE_INFO_REPORT_" + sheetNum);
		// 生成标题
		Row rowTitle = sheet.createRow(0);
		// 管理中心
		rowTitle.createCell(0).setCellValue("管理中心 ");
		// 城市
		rowTitle.createCell(1).setCellValue("城市 ");
		// 项目
		rowTitle.createCell(2).setCellValue("项目");
		// 网格
		rowTitle.createCell(3).setCellValue("网格");
		// 总户数
		rowTitle.createCell(4).setCellValue("总户数");
		// 已接管户数
		rowTitle.createCell(5).setCellValue("已接管户数");
		// 已入住户数
		rowTitle.createCell(6).setCellValue("已入住户数");
		// 常住户数
		rowTitle.createCell(7).setCellValue("常住户数");
		// 出租户数
		rowTitle.createCell(8).setCellValue("出租户数 ");
		// 空置户数
		rowTitle.createCell(9).setCellValue("空置户数");
		// 度假户数
		rowTitle.createCell(10).setCellValue("度假户数");
		// 车辆数
		rowTitle.createCell(11).setCellValue("车辆数");
		// 宠物数
		rowTitle.createCell(12).setCellValue("宠物数");
		// 总人数
		rowTitle.createCell(13).setCellValue("总人数");
		// 业主数量
		rowTitle.createCell(14).setCellValue("业主数量");
		// 住户
		rowTitle.createCell(15).setCellValue("住户");
		// 行数据
		for (int i = 0; i < basicInformations.size(); i++) {
			BasicInformation basicInformation = basicInformations.get(i);
			Row row = sheet.createRow(i + 1);
			row.createCell(0).setCellValue(basicInformation.getOrganizationText());
			row.createCell(1).setCellValue(basicInformation.getCityText());
			row.createCell(2).setCellValue(basicInformation.getProjectText());
			row.createCell(3).setCellValue(basicInformation.getGridText());
			row.createCell(4).setCellValue(basicInformation.getHouseCount());
			row.createCell(5).setCellValue(basicInformation.getTakeOverCount());
			row.createCell(6).setCellValue(basicInformation.getCheckConut());
			row.createCell(7).setCellValue(basicInformation.getResidentCount());
			row.createCell(8).setCellValue(basicInformation.getLeaseCount());
			row.createCell(9).setCellValue(basicInformation.getNullCount());
			row.createCell(10).setCellValue(basicInformation.getVacation());
			row.createCell(11).setCellValue(basicInformation.getCarCount());
			row.createCell(12).setCellValue(basicInformation.getPetsCount());
			row.createCell(13).setCellValue(basicInformation.getPersonCount());
			row.createCell(14).setCellValue(basicInformation.getOwnerCount());
			row.createCell(15).setCellValue(basicInformation.getUnOwnerCount());
		}
		String fileNamePath = getClassPath() + "BASE_INFO_REPORT_" + getDateNo() + "_" + sheetNum + ".xls";
		return getFile(workbook, fileNamePath);
	}

	/**
	 * 
	 * @return
	 * @Description:获取classs目录
	 */
	public static String getClassPath() {
		return Thread.currentThread().getContextClassLoader().getResource("/").getPath();
	}

	public static String getDateNo() {
		return new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
	}

	public static File getFile(Workbook workbook, String fileNamePath) {
		FileOutputStream out = null;
		File file = null;
		try {
			file = new File(fileNamePath);
			file.createNewFile();
			out = new FileOutputStream(file);
			workbook.write(out);
			out.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (null != out) {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			workbook = null;
			out = null;
		}
		return file;
	}

	/**
	 * 压缩文件成zip包
	 * 
	 * @param realPath
	 *            项目真实路径
	 * @param zipName
	 *            zip包的名称
	 * @param files
	 *            需要打包到zip中的Files
	 */
	public static void fileToZip(String zipFileName, List<File> files) throws Exception {
		byte[] buffer = new byte[1024];
		String strZipPath = getClassPath() + zipFileName;
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(strZipPath));
		if (CollectionUtils.isNotEmpty(files)) {
			// 1、读取临时的excel文件
			for (File file : files) {
				if (null != file && file.exists()) {
					FileInputStream fis = new FileInputStream(file);
					out.putNextEntry(new ZipEntry(file.getName()));
					int len;
					// 2、 读入需要下载的文件的内容，打包到zip文件
					while ((len = fis.read(buffer)) > 0) {
						out.write(buffer, 0, len);
					}
					out.closeEntry();
					fis.close();

					// 3、删除临时的excel文件
					file.delete();
					System.err.println(file.exists());
				}
			}
			out.close();
		}
	}
}