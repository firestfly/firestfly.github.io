package bingo.vkcrm.web.servicecenter.controller;

import java.net.URI;
import java.util.Map;

import bingo.vkcrm.service.enums.BuildingTypes;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.UriComponentsBuilder;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.web.servicecenter.service.BuildingService;
import bingo.vkcrm.web.servicecenter.service.RoomExportService;


@Controller
@RequestMapping(value = "/page")
public class CustomerController {

    private static final String ERROR_PAGE_500 = "/error/500";

    private static final Log log = LogFactory.getLog(CustomerController.class);

    @Autowired
    RoomExportService roomExportService;

    @Autowired
    BuildingService buildingService;

    @Autowired
    RestTemplate restTemplate;

    /**
     * 获取客户信息的API接口地址
     *
     * @return
     */
    private static String getApiPath() {
        return ApplicationContext.getProperty("service.customer.path.domain").concat("/v1");
    }

    /**
     * 客户首页
     *
     * @return
     */
    @RequestMapping(value = "/customers", method = RequestMethod.GET)
    public ModelAndView forCustomerDetail() {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/modules/customer/list");
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView(ERROR_PAGE_500, "errorMessage", ex.getStackTrace());
        }
        return modelAndView;
    }


    /**
     * 跳转客户详细页面
     *
     * @param customerId  客户编码
     * @param houseId     房屋编码
     * @param accessToken access_token
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/details", method = RequestMethod.GET)
    public ModelAndView forCustomerDetail(@PathVariable(value = "customerId") String customerId, String houseId, String carportId, @CookieValue("access_token") String accessToken) {
        String url = getApiPath();
        ResponseEntity<ServiceResult> restResult;
        ModelAndView modelAndView;
        ServiceResult result;
        try {
            modelAndView = new ModelAndView("/modules/customer/view");
            //调用方法进行URL构造
            URI targetUrl = UriComponentsBuilder.fromUriString(url)
                    .path("/customer/" + customerId + "/basic")
                    .build()
                    .toUri();
            HttpHeaders requestHeaders = new HttpHeaders();
            requestHeaders.set("Authorization", accessToken);
            HttpEntity<String> request = new HttpEntity<String>(requestHeaders);
            restResult = restTemplate.exchange(targetUrl, HttpMethod.GET, request, ServiceResult.class);
            if (restResult.hasBody()) {
                result = restResult.getBody();
                if (result.isSuccess()) {
                    Map<String, Object> modelMap = (Map<String, Object>) result.getDetails();
                    //获取房屋所属项目以及物业公司用于大眼睛扫描
                    Map<String, Object> map = null;
                    if (StringUtils.isNotEmpty(houseId)) {
                        map = buildingService.getProjectCompany(houseId, BuildingTypes.House.getValue());
                        modelMap.put("houseId", houseId);
                        modelMap.put("buildingId", houseId);
                        modelMap.put("buildingType", BuildingTypes.House);
                    }
                    if (StringUtils.isNotEmpty(carportId)) {
                        map = buildingService.getProjectCompany(carportId, BuildingTypes.Carport.getValue());
                        modelMap.put("carportId", carportId);
                        modelMap.put("buildingId", carportId);
                        modelMap.put("buildingType", BuildingTypes.Carport);
                    }
                    if (map != null) {
                        modelMap.put("projectCode", map.get("code"));
                        modelMap.put("companyCode", map.get("companyCode"));
                    }
                    modelAndView.addAllObjects(modelMap);
                } else {
                    modelAndView = new ModelAndView(ERROR_PAGE_500);//如果错误链接到一个错误页面
                    modelAndView.addObject("errorMessage", result.getMessage());
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView(ERROR_PAGE_500, "errorMessage", ex.getStackTrace());
        }
        return modelAndView;
    }


}
