package bingo.vkcrm.web.servicecenter.controller;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import bingo.vkcrm.web.servicecenter.service.RoomExportService;

/**
 * Created by Administrator on 2015/8/21.
 */
@Controller
@RequestMapping(value = "page")
public class RoomExportController {

    private static final Log log = LogFactory.getLog(RoomExportController.class);
	@Autowired
	RoomExportService roomExportService;
	
	/**
	 * 记录导出线程数，防止内存溢出，系统支持同时5个人做导出
	 */
	private static int exportCount;

	/**
	 * 导出待交付房屋和车位
	 * @throws Exception
	 */
	@RequestMapping(value = "roomsExport/export", method = RequestMethod.GET)
	public void downNotPayCustomerResult(HttpServletRequest request,HttpServletResponse response){
		if(exportCount >= 5 ){
			return;
		}
		try {
			exportCount++;
			log.debug("进入 导出待交付房屋和车位 ...");
			Map<String, Object> queryMap = new HashMap<String, Object>();
			String fileName = "待交付房屋或车位.xls";
			// 生成Excel文件
			HSSFWorkbook hssfWorkbook = roomExportService.export(queryMap,fileName);
			// 设置返回头信息
            response.addHeader("Content-Disposition", "attachment;filename=" + java.net.URLEncoder.encode(fileName, "UTF-8"));
            response.setContentType("application/octet-stream");
            // 将Excel发送到客户端
            OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
            hssfWorkbook.write(toClient);
            toClient.flush();
            toClient.close();			
        } catch (IOException ex) {
            ex.printStackTrace();
        } catch (Exception e) {
			e.printStackTrace();
		}finally{
			exportCount--;
		}
	}
}
