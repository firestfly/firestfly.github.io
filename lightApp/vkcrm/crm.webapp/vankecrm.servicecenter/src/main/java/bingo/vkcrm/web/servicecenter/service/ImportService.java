package bingo.vkcrm.web.servicecenter.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import bingo.security.principal.IUser;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.service.BaseService;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSSClient;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectResult;

import org.apache.commons.fileupload.util.Streams;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.common.core.ApplicationContext;
import bingo.dao.Dao;
import bingo.security.SecurityContext;
import bingo.vkcrm.web.servicecenter.controller.ImportController.ImportType;
import bingo.vkcrm.web.servicecenter.model.DeliverHouseCarport;
import bingo.vkcrm.web.servicecenter.model.ExcelImportLog;
import bingo.vkcrm.web.servicecenter.model.ExcelPoiUtil;

@Service
@SuppressWarnings("all")
public class ImportService extends BaseService {
	
	public final static String OSS_ID         = ApplicationContext.getProperty("oss.id");//OSS ID
	public final static String OSS_SECRET     = ApplicationContext.getProperty("oss.secret");//OSS SECRET
	public final static String OSS_ENDPOINT   = ApplicationContext.getProperty("oss.endpoint");
	public final static String OSS_BUCKETNAME = ApplicationContext.getProperty("oss.bucket");//bucket：
	public final static String OSS_UPLOADROOTNAME = ApplicationContext.getProperty("oss.uploadRootName");//上传阿里云的根目录
	
	/**
	 * 上传文件到阿里云
	 * @param uploadFileName 文件长名称，唯一
	 * @param importTypeObj 上传业务信息
	 * @param is 输入流
	 * @return 上传成功后返回的ID（UUID），文件存储路径
	 * @throws Exception
	 */
	public String[] uploadFileToOss(String uploadFileName,ImportType importTypeObj,InputStream is) throws Exception{
        String ossPath = new SimpleDateFormat("yyyy/MMdd").format(new Date());
        //上传文件到阿里云OSS（阿里云根目录/CRM上传根目录/业务目录（如待交付客户、法律纠纷户）/年/月日/唯一文件名称）
        String key = OSS_UPLOADROOTNAME+"/"+importTypeObj.path+"/"+ossPath+"/"+uploadFileName;
		OSSClient ossClient=new OSSClient(OSS_ENDPOINT, OSS_ID, OSS_SECRET);
		ObjectMetadata objectMeta = new ObjectMetadata();
		PutObjectResult result = ossClient.putObject(OSS_BUCKETNAME, key, is, objectMeta);
		return new String[]{result.getETag(),key};
	}
	
	/**
	 * 上传文件到本地
	 * @param uploadFileName 文件长名称，唯一
	 * @param importTypeObj 上传业务信息
	 * @param is 输入流
	 * @return 上传成功后返回的ID（UUID），文件存储路径
	 * @throws Exception
	 */
	public String[] uploadFileToLocal(String uploadFileName,ImportType importTypeObj,InputStream is) throws Exception{		
		// 本地文件存储目录
        String uploadPath = ApplicationContext.getProperty("uploadPath")+"/"+importTypeObj.path;        
        // 创建文件临时目录
        if (!new File(uploadPath).isDirectory()){
            new File(uploadPath).mkdirs(); //选定上传的目录此处为当前目录，没有则创建
        }
        BufferedInputStream in = new BufferedInputStream(is);        
        BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(new File(uploadPath + "/" + uploadFileName)));
        Streams.copy(in, out, true); // 开始把文件写到你指定的上传文件夹		
		return new String[]{"",uploadPath + "/" + uploadFileName};		
	}
	
	/**
	 * 上传模板文件到阿里云
	 * 只运行一次就可以了，换了阿里云需要上传模板文件，否则无法下载
	 * @param localpath 本地模板文件路径，绝对路径
	 * @param importType 导入类型
	 * @throws FileNotFoundException 
	 * @throws ClientException 
	 * @throws OSSException 
	 */
	private static void uploadTemplateFileToOss(String localpath,String importType) throws OSSException, ClientException, FileNotFoundException{
    	// 获取导入类型，默认为“未交付客户导入”
    	ImportType importTypeObj = ImportType.getImportType(StringUtils.isEmpty(importType)?"notPayCustomer":importType);
        
        // 取得文件名。
        String fileName = importTypeObj.name + "导入模板.xlsx";
		
        //上传文件到阿里云OSS（阿里云根目录/CRM上传根目录/业务目录（如待交付客户、法律纠纷户）/年/月日/唯一文件名称）
        String key = OSS_UPLOADROOTNAME+"/"+fileName;
		OSSClient ossClient=new OSSClient(OSS_ENDPOINT, OSS_ID, OSS_SECRET);
		ObjectMetadata objectMeta = new ObjectMetadata();
		PutObjectResult result = ossClient.putObject(OSS_BUCKETNAME, key,new FileInputStream(localpath), objectMeta);
	}
	
	public static void main(String[] args) throws Exception{
		uploadTemplateFileToOss("E:/法律纠纷户导入模板.xlsx", "specialidentity");
		uploadTemplateFileToOss("E:/导入已交付客户信息.xlsx", "notPayCustomer");
	}
	
}
