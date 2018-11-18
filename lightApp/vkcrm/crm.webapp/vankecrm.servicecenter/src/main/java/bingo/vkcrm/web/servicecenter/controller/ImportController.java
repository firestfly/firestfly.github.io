package bingo.vkcrm.web.servicecenter.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import bingo.dao.Page;
import bingo.security.SecurityContext;
import bingo.security.principal.IUser;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.web.servicecenter.model.ExcelImportLog;
import bingo.vkcrm.web.servicecenter.service.CustomerService;
import bingo.vkcrm.web.servicecenter.service.ImportService;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.OSSObject;


@Controller
@RequestMapping(value = "page")
public class ImportController {
	
    private static final String ERROR_PAGE_500 = "/error/500";
    private static final Log log = LogFactory.getLog(ImportController.class);	

    @Autowired
    CustomerService service;
    @Autowired
    ImportService importService;

    /**
     * 导入列表
     *
     * @return
     */
    @RequestMapping(value = "/import/list", method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView importList(String importType) {
        ModelAndView modelAndView;
    	// 获取导入类型，默认为“未交付客户导入”
    	if(StringUtils.isEmpty(importType)){
    		importType = "notPayCustomer";
    	}    	
    	ImportType importTypeObj = ImportType.getImportType(importType);    	
    	
        try {
            modelAndView = new ModelAndView("/modules/import/list");
            modelAndView.addObject("importTypeName", importTypeObj.name);
            modelAndView.addObject("importTypeCode", importTypeObj.code);
            
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView(ERROR_PAGE_500, "errorMessage", ex.getStackTrace());
        }
        return modelAndView;
    }
    

    /**
     * 上传待交付客户信息Excel
     * @param request
     * @return
     * @throws IOException 
     */
    @RequestMapping(value = "/customer/notPay/upload", method = RequestMethod.POST)
    @ResponseBody
    public ModelAndView uploadNotPayCustomer(HttpServletRequest request) throws IOException {
        IUser user = SecurityContext.getCurrentUser();
    	ModelAndView modelAndView = new ModelAndView("/modules/customer/uploadCallbackPage");
        String importType = "";
        ImportType importTypeObj = null;
    	
        try {
            if (ServletFileUpload.isMultipartContent(request)) {
                DiskFileItemFactory factory = new DiskFileItemFactory(); 
                
                // 指定在内存中缓存数据大小,单位为byte,这里设为1Mb
                factory.setSizeThreshold(1 * 1024 * 1024);
                // 设置一旦文件大小超过getSizeThreshold()的值时数据存放在硬盘的目录
                ServletFileUpload sfu = new ServletFileUpload(factory);
                // 指定单个上传文件的最大尺寸,单位:字节，这里设为1Mb
                sfu.setFileSizeMax(1 * 1024 * 1024);
                // 指定一次上传多个文件的总尺寸,单位:字节，这里设为10Mb
                sfu.setSizeMax(10 * 1024 * 1024);
                sfu.setHeaderEncoding("UTF-8"); //设置编码，因为我的jsp页面的编码是utf-8的                

                FileItemIterator fii = sfu.getItemIterator(request);// 解析request请求
                while (fii.hasNext()) {
                    FileItemStream fis = fii.next();// 从集合中获得一个文件流                    
                    if(fis.isFormField()){//读取importType的值
	                    if (fis.isFormField() && fis.getFieldName().equals("importType")){ 
	                    	importType = Streams.asString(fis.openStream());
	                    }
                    }else{
                    	// 获取导入类型，默认为“未交付客户导入”
                    	importTypeObj = ImportType.getImportType(StringUtils.isEmpty(importType)?"notPayCustomer":importType);
                    	// 获取文件名称
	                    String filename = fis.getName();
	                    filename = filename.replace("\\", "/");
	                    if(filename.indexOf("/") > 0){
		                    filename = filename.substring(filename.indexOf("/")+1, filename.length());
	                    }
	                    
	                    // 验证上传文件格式是否正确
	                    if (!(filename.toUpperCase().indexOf(".XLS") > 0 || filename.toUpperCase().indexOf(".XLSX") > 0)) {
	                        request.setAttribute("jsonResult", JsonUtil.toJson(new ServiceResult(false, "上传文件必须为Excel文件。")));
	                        return modelAndView;
	                    }
	                    // 建立唯一文件名称
	                    String time = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
	                    String uploadFileName = filename.substring(0, filename.indexOf("."))
	                            + "_" + user.getLoginId() + "_" + time + filename.substring(filename.indexOf("."), filename.length());
	
	                    String[] result;
	                	// 阿里云扩展
	                	boolean isLocal = false;//true:从本地获取文件，false阿里云上获取文件。本地开发连接不上阿里云才需要本参数，正常情况下为true
                        if(isLocal){//如果本地测试需要将文件保存到本地文件目录，本地连接不到阿里云
                        	result = importService.uploadFileToLocal(uploadFileName, importTypeObj, fis.openStream());
                        }else{
                        	result = importService.uploadFileToOss(uploadFileName, importTypeObj, fis.openStream());
                        }
                        // 保存文件上传目录
                        ExcelImportLog excelImportLog = new ExcelImportLog();
                        excelImportLog.setAttachmentId(result[0]);
                        excelImportLog.setFileShortName(filename);
                        excelImportLog.setSrcFileSavePath(result[1]);
                        excelImportLog.setImportLoginId(SecurityContext.getCurrentUser().getId());
                        excelImportLog.setBusinessType(importTypeObj.serviceId);
                        excelImportLog.setOperateStatus("初始");
                        excelImportLog.setOperateResultInfo("文件已上传");
                        excelImportLog.setUploadTime(new Date());
                        excelImportLog.setCreatedBy(SecurityContext.getCurrentUser().getName());
                        excelImportLog.setCreatedDate(new Date());
                        excelImportLog.setLastUpdatedBy(SecurityContext.getCurrentUser().getId());
                        excelImportLog.setLastUpdatedDate(new Date());
                        service.saveExcelImportLog(excelImportLog);
	                }
                }
            }
        } catch (org.apache.commons.fileupload.FileUploadBase.FileUploadIOException ex) {
            ex.printStackTrace();
            request.setAttribute("jsonResult", JsonUtil.toJson(new ServiceResult(false, "上传文件失败。错误信息：上传文件大小不得超过1M")));
        } catch (Exception ex) {
            ex.printStackTrace();
            request.setAttribute("jsonResult", JsonUtil.toJson(new ServiceResult(false, "上传文件失败。错误信息："+ex.getMessage())));
        }
        request.setAttribute("jsonResult", JsonUtil.toJson(new ServiceResult(true, "上传文件成功！")));
        return modelAndView;
    }


    /**
     * 查询未交付客户导入结果
     * @return
     */
    @RequestMapping(value = "/customer/notPayCustomer/list", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult notPayCustomerList(String createdBy,String beginTime,String importType,String endTime,Integer curPage,Integer pageSize){
        try{
            // 设置分页信息，查询导入日志信息
            Page page = new Page();
            page.setPageSize(7);
            if(null != pageSize){
                page.setPageSize(pageSize);
            }
            page.setPage(curPage);
            Map<String, Object> queryMap = new HashMap<String, Object>();
            queryMap.put("CREATED_BY", createdBy);
            queryMap.put("TIME_BEGIN", beginTime);
            queryMap.put("TIME_END", endTime);
            queryMap.put("LOGIN_ID", SecurityContext.getCurrentUser().getId());
        	if(StringUtils.isNotEmpty(importType)){
                queryMap.put("IMPORT_TYPE", ImportType.getImportType(importType).serviceId);
        	}
            List<ExcelImportLog> list = service.queryNotPayCustomerImportLog(queryMap, page);
            ListResult<ExcelImportLog> listResult = new ListResult<ExcelImportLog>(page, list);
            return ServiceResult.succeed(listResult);
        }catch(Exception ex){
            ex.printStackTrace();
            return new ServiceResult(false, "渲染列表失败。错误信息：" + ex.getMessage());
        }
    }


    /**
     * 下载待交付客户导入处理结果Excel文件
     *
     * @param request
     * @param response
     * @return
     * @throws Exception 
     */
    @RequestMapping(value = "/customer/notPayCustomer/download", method = RequestMethod.GET)
    public void downNotPayCustomerResult(String pid, HttpServletRequest request, HttpServletResponse response) throws Exception {

        // 查询导入日志，获取处理结果文件路径
        Map<String, Object> queryMap = new HashMap<String, Object>();
        queryMap.put("PID", pid);
        ExcelImportLog excelImportLog = service.queryNotPayCustomerImportLog(queryMap);
        
        // 取得文件名。
        String filenameTemp = excelImportLog.getFileShortName();
		String t1 = filenameTemp.substring(filenameTemp.lastIndexOf("."),filenameTemp.length());
		String t2 = filenameTemp.substring(0, filenameTemp.lastIndexOf("."))+ "-导入结果";
		String fileName = t2 + t1;
        
        response.reset();// 清空response
        // 设置response的Header
        //response.setCharacterEncoding("UTF-8");
        response.addHeader("Content-Disposition", "attachment;filename=" + java.net.URLEncoder.encode(fileName, "UTF-8"));
        response.setContentType("application/octet-stream");
        
        try {
        	// 阿里云扩展
        	boolean isLocal = false;//true:从本地获取文件，false阿里云上获取文件。本地开发连接不上阿里云才需要本参数，正常情况下为true
	        if(isLocal){
	            // path是指欲下载的文件的路径。
	            File file = new File(excelImportLog.getResultFilePath());
	            // 以流的形式下载文件。
	            InputStream fis = new BufferedInputStream(new FileInputStream(excelImportLog.getResultFilePath()));
	            byte[] buffer = new byte[fis.available()];
	            fis.read(buffer);
	            fis.close();	
	            response.addHeader("Content-Length", "" + file.length());
	            OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
	            toClient.write(buffer);
	            toClient.flush();
	            toClient.close();
	        }else{
				OSSClient ossClient = new OSSClient(ImportService.OSS_ENDPOINT, ImportService.OSS_ID, ImportService.OSS_SECRET);
				OSSObject ossObject = ossClient.getObject(ImportService.OSS_BUCKETNAME, excelImportLog.getResultFilePath());
	        	
	            InputStream fis = ossObject.getObjectContent();
	            response.addHeader("Content-Length", "" + ossObject.getObjectMetadata().getContentLength());

	            //3.通过response获取ServletOutputStream对象(out)  
	            OutputStream out = response.getOutputStream();
	            int b = 0;  
	            byte[] buffer = new byte[1024];  
	            while (b != -1){
	                b = fis.read(buffer);
	                //4.写到输出流(out)中  
	                if(b != -1){
		                out.write(buffer,0,b);
	                }
	            }  
	            fis.close();  
	            out.close();  
	            out.flush();
	        }				
        } catch (IOException ex) {
            ex.printStackTrace();
        }        	
    }
    

    /**
     * 下载模板
     *
     * @param request
     * @param response
     * @return
     * @throws Exception 
     */
    @RequestMapping(value = "/customer/template/download", method = RequestMethod.GET)
    public void downTemplate(String importType, HttpServletRequest request, HttpServletResponse response) throws Exception {

    	// 获取导入类型，默认为“未交付客户导入”
    	ImportType importTypeObj = ImportType.getImportType(StringUtils.isEmpty(importType)?"notPayCustomer":importType);
        
        // 取得文件名。
        String fileName = importTypeObj.name + "导入模板.xlsx";        
        response.reset();// 清空response
        // 设置response的Header
        //response.setCharacterEncoding("UTF-8");
        response.addHeader("Content-Disposition", "attachment;filename=" + java.net.URLEncoder.encode(fileName, "UTF-8"));
        response.setContentType("application/octet-stream");
        
        try {
        	String key = ImportService.OSS_UPLOADROOTNAME+"/"+fileName;
			OSSClient ossClient = new OSSClient(ImportService.OSS_ENDPOINT, ImportService.OSS_ID, ImportService.OSS_SECRET);
			OSSObject ossObject = ossClient.getObject(ImportService.OSS_BUCKETNAME,key);
        	
            InputStream fis = ossObject.getObjectContent();
            response.addHeader("Content-Length", "" + ossObject.getObjectMetadata().getContentLength());
            //3.通过response获取ServletOutputStream对象(out)  
            OutputStream out = response.getOutputStream();
            int b = 0;  
            byte[] buffer = new byte[1024];  
            while (b != -1){
                b = fis.read(buffer);
                //4.写到输出流(out)中  
                if(b != -1){
	                out.write(buffer,0,b);
                }
            }  
            fis.close();  
            out.close();  
            out.flush();
        } catch (IOException ex) {
            ex.printStackTrace();
        }        	
    }    
    
    /**
     * <code>{@link CostomerSearchType}</code>
     * 查询类型定义枚举类
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     */
    public enum ImportType {
    	//枚举定义
        未交付客户("已交付客户","notPayCustomer","notPayCustomer","notPayCustomerImpService"),
        法律纠纷户("法律纠纷户","specialidentity","specialidentity","specialIdentityImpService");
        
        // 成员变量
        public String code;//类型编码
        public String name;//名称
        public String path;//数据库字段
        public String serviceId;//查询sqlId

        // 构造方法
        private ImportType(String name,String code,String path,String serviceId) {
            this.name = name;
            this.code = code;
            this.path = path;
            this.serviceId = serviceId;
        }
        
        /**
         * 通过code获取枚举
         * @param code
         * @return
         */
        public static ImportType getImportType(String code){
        	for(ImportType item : ImportType.values()){
        		if(item.code.equals(code)){
        			return item;
        		}
        	}
        	return null;
        }
    }
    
    
    
    
    
}
