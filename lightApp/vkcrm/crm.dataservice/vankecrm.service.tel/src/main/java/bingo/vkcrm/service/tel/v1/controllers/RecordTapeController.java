package bingo.vkcrm.service.tel.v1.controllers;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.model.ExceptionLog;
import bingo.vkcrm.service.tel.v1.Version;
import bingo.vkcrm.service.tel.v1.services.RecordTapeService;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by Wangzr on 15/11/12.
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class RecordTapeController extends BaseController {

    private static final String SERVER_PATH = ApplicationContext.getProperty("Tape.Server.Path");

    @Autowired
    RecordTapeService service;

    /**
     * 获取录音文件地址
     *
     * @param recordId 录音文件编号
     * @return
     */
    @RequestMapping(value = "/tape/{id}/listen", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult listen(@PathVariable(value = "id") String recordId) {
        String filePath = service.getFilePath(recordId);
        return ServiceResult.succeed(pathCombine(SERVER_PATH, filePath));
    }


    /**
     * 下载录音
     *
     * @param recordId 录音id
     * @return
     */
    @RequestMapping(value = "/tape/{id}/download", method = RequestMethod.GET)
    public ResponseEntity<byte[]> download(@PathVariable(value = "id") String recordId) {
        String filePath = service.getFilePath(recordId);
        String fullPath = pathCombine(SERVER_PATH, filePath);

        HttpGet httpGet = new HttpGet(fullPath);
        HttpClient client = new DefaultHttpClient();

        try {
            HttpResponse response = client.execute(httpGet);
            InputStream stream = response.getEntity().getContent();
            byte[] buffer = IOUtils.toByteArray(stream);;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", recordId + ".wav");
            return new ResponseEntity<byte[]>(buffer, headers, HttpStatus.OK);

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }

    private String pathCombine(String path1, String path2) {
        // path1 以 / 结尾, path2 以 / 开始
        // path1 以 / 结尾
        // path2 以 / 开始
        // path1 没有以 / 结尾, path2 没有以 / 开始
        if (StringUtils.lastIndexOf(path1, '/') == path1.length() - 1) {
            // path1 以 / 结尾
            if (StringUtils.indexOf(path2, '/') == 0) {
                // path2 以 / 开头
                return StringUtils.substring(path1, 0, path1.length() - 1) + path2;
            }
        } else {
            // path1 没有以 / 结尾
            if (StringUtils.indexOf(path2, '/') != 0) {
                // path2 以 / 开头
                return StringUtils.substring(path1, 0, path1.length() - 1) + "/" + path2;
            }
        }
        return path1 + path2;
    }
}
