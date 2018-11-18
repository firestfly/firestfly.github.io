package bingo.vkcrm.web.servicecenter.controller;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.common.ServiceResult;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Map;


@Controller
@RequestMapping(value = "/page")
public class HouseController {
    private static final String ERROR_PAGE_500 = "/error/500";

    private static final Log log = LogFactory.getLog(HouseController.class);

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
     * 房屋首页
     *
     * @return
     */
    @RequestMapping(value = "/houses", method = RequestMethod.GET)
    public ModelAndView forIndex() {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/index");
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView(ERROR_PAGE_500, "errorMessage", ex.getStackTrace());
        }
        return modelAndView;
    }

    /**
     * 跳转房屋详细信息
     * @param houseId 房屋编码
     * @param accessToken access_token
     * @return
     */
    @RequestMapping(value = "/house/{houseId}/details", method = RequestMethod.GET)
    public ModelAndView forHouseDetail(@PathVariable(value = "houseId") String houseId,@CookieValue("access_token")String accessToken) {
        String url = getApiPath();
        ResponseEntity<ServiceResult> restResult;
        ModelAndView modelAndView;
        ServiceResult result;
        try {
            modelAndView = new ModelAndView("/modules/house/view");
            //调用方法进行URL构造
            URI targetUrl = UriComponentsBuilder.fromUriString(url)
                    .path("/house/basic")
                    .queryParam("houseId", houseId)
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
     * 房屋新增客户
     *
     * @param houseId 房屋编码
     * @return
     */
    @RequestMapping(value = "/house/{houseId}/customer", method = RequestMethod.GET)
    public ModelAndView forHouseAddCustomer(@PathVariable(value = "houseId") String houseId) {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/modules/customer/add", "houseId", houseId);
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView(ERROR_PAGE_500, "errorMessage", ex.getStackTrace());
        }
        return modelAndView;
    }
}
