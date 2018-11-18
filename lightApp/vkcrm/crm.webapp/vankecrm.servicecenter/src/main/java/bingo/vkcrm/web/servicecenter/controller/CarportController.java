package bingo.vkcrm.web.servicecenter.controller;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.common.ServiceResult;
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

import java.net.URI;
import java.util.Map;


@Controller
@RequestMapping(value = "page")
public class CarportController {

    private static final String ERROR_PAGE_500 = "/error/500";

    private static final Log log = LogFactory.getLog(CarportController.class);

    /**
     * 获取房屋信息的API接口地址
     *
     * @return
     */
    private static String getApiPath() {
        return ApplicationContext.getProperty("service.house.path.domain") + "/v1";
    }

    @Autowired
    RestTemplate restTemplate;

    /**
     * 跳转至车位详情页面
     *
     * @param carportId
     * @return
     */
    @RequestMapping(value = "/carport/{carportId}/details", method = RequestMethod.GET)
    public ModelAndView forCustomerDetail(@PathVariable(value = "carportId") String carportId, @CookieValue("access_token") String accessToken) {
        String url = getApiPath();
        ResponseEntity<ServiceResult> restResult;
        ModelAndView modelAndView;
        ServiceResult result;
        try {
            modelAndView = new ModelAndView("/modules/carport/view");
            //调用方法进行URL构造
            URI targetUrl = UriComponentsBuilder.fromUriString(url)
                    .path("/carport/" + carportId)
                    .build()
                    .toUri();
            HttpHeaders requestHeaders = new HttpHeaders();
            requestHeaders.set("Authorization",accessToken);
            HttpEntity<String> request = new HttpEntity<String>(requestHeaders);
            restResult = restTemplate.exchange(targetUrl, HttpMethod.GET, request, ServiceResult.class);
            if (restResult.hasBody()) {
                result = restResult.getBody();
                if (result.isSuccess()) {
                    Map<String,Object> modelMap = (Map<String,Object>)result.getDetails();
                    modelAndView.addAllObjects(modelMap);
                } else {
                    modelAndView = new ModelAndView(ERROR_PAGE_500,"errorMessage",result.getMessage());
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView(ERROR_PAGE_500, "errorMessage", ex.getStackTrace());
        }
        return modelAndView;
    }


    /**
     * 车位过户
     *
     * @param carportId 车位编码
     * @return
     */
    @RequestMapping(value = "/carport/{carportId}", method = RequestMethod.GET)
    public ModelAndView forCarportTransfer(@PathVariable(value = "carportId") String carportId) {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/modules/carport/carTransfer", "carportId", carportId);
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView(ERROR_PAGE_500, "errorMessage", ex.getStackTrace());
        }
        return modelAndView;
    }


    /**
     * 车位新增客户页面
     *
     * @param carportId 车位编码
     * @return modelAndView
     */
    @RequestMapping(value = "/carport/{carportId}/customer", method = RequestMethod.GET)
    public ModelAndView addCustomer4Carport(@PathVariable(value = "carportId") String carportId) {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/modules/carport_customer/add", "carportId", carportId);
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView(ERROR_PAGE_500, "errorMessage", ex.getStackTrace());
        }
        return modelAndView;
    }


    /**
     * 从车位信息页，点击客户信息进到客户详情页
     *
     * @param customerId 客户ID
     * @return modelAndView
     */
    @RequestMapping(value = "/customer/{customerId}/customer4Carport", method = RequestMethod.GET)
    public ModelAndView carportInfoToCustomerInfo(@PathVariable(value = "customerId") String customerId) {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/modules/customer/view", "customerId", customerId);
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView(ERROR_PAGE_500, "errorMessage", ex.getStackTrace());
        }
        return modelAndView;
    }
}
