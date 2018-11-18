package bingo.vkcrm.web.servicecenter.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.common.core.ApplicationFactory;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.web.servicecenter.model.BigeyesList;
import bingo.vkcrm.web.servicecenter.model.BigeyesResult;
import net.bioslink.manage.webservice.ImsImgInfoService;

@Controller
@RequestMapping(value = "page")
public class BigEyesController {

    private static final Log log = LogFactory.getLog(BigEyesController.class);

//    @Autowired
//    ImsImgInfoService service;
//	
    // ImsImgInfoService imsImgInfoService = ApplicationFactory.getBeanForName(ImsImgInfoService.class,"imsImgInfoService");

    /**
     * 回写客户代码
     *
     * @param barCode  影像编码
     * @param custCode 客户编码
     */
    @RequestMapping(value = "/bigeyes/writebackcustcode", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult writeBackCustCode(String barCode, String custCode) {
        String json = "false";
        ImsImgInfoService imsImgInfoService = ApplicationFactory.getBeanForName(ImsImgInfoService.class, "clientImsImsImgInfoServiceImplService");
        try {
            json = imsImgInfoService.writeBackCustCode(barCode, custCode);
            BigeyesResult bigeyes = JsonUtil.fromJson(json, BigeyesResult.class);
            if (bigeyes.getResult().equals("success")) {
                return ServiceResult.succeed("true");
            } else {
                return ServiceResult.succeed(json);
            }
        } catch (Throwable ex) {
            log.error(ex.getMessage());
            ex.printStackTrace();
            return ServiceResult.error(ex);
        }
    }

    /**
     * 获取影像编码
     *
     * @param companyCode 所属物业公司编码
     * @param projectCode 项目编码
     * @param docType     文档类型
     * @param year        当前年份
     * @return
     */
    @RequestMapping(value = "/bigeyes/getfilecode", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getFileCode(String companyCode, String projectCode, String docType, int year) {
        String json = null;
        ImsImgInfoService imsImgInfoService = ApplicationFactory.getBeanForName(ImsImgInfoService.class, "clientImsImsImgInfoServiceImplService");
        try {
            json = imsImgInfoService.getFileCode(companyCode, projectCode, docType, year);
            BigeyesResult bigeyes = JsonUtil.fromJson(json, BigeyesResult.class);
            return ServiceResult.succeed(bigeyes);
        } catch (Throwable ex) {
            log.error(ex.getMessage());
            ex.printStackTrace();
            return ServiceResult.error(ex);
        }
    }

    /**
     * 根据客户编码获取所有已扫描的影像资料列表
     *
     * @param companyCode 所属物业公司编码
     * @param projectCode 项目编码
     * @param custCode    客户编码
     * @param houseCode   房屋编码
     * @param code        (未知)
     * @param docType     文档类型
     * @param docSubType  文档子类型
     * @param archDate    归档时间
     * @param count       (未知作用)
     */
    @RequestMapping(value = "/bigeyes/queryimginfo", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryImgInfo(String companyCode, String projectCode, String custCode, String houseCode, String code,
                                      String docType, String docSubType, String archDate, int count) {
        String json = null; //返回的是json需要解析
        ImsImgInfoService imsImgInfoService = ApplicationFactory.getBeanForName(ImsImgInfoService.class, "clientImsImsImgInfoServiceImplService");
        try {
            json = imsImgInfoService.queryImgInfo(companyCode, projectCode, custCode, houseCode, code, docType, docSubType, archDate, count);
            BigeyesList bigeyes = JsonUtil.fromJson("{\"bigeyes\":" + json + "}", BigeyesList.class);
            for (int i = 0; i < bigeyes.getBigeyes().size(); i++) {
                String Type = bigeyes.getBigeyes().get(i).getDocType();
                bigeyes.getBigeyes().get(i).setDocTypeText(Type);
            }
            return ServiceResult.succeed(bigeyes);
        } catch (Throwable ex) {
            log.error(ex.getMessage());
            ex.printStackTrace();
            return ServiceResult.error(ex);
        }
    }

}
