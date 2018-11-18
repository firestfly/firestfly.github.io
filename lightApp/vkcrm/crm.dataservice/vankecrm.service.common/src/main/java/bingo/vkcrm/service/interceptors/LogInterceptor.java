package bingo.vkcrm.service.interceptors;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.enums.AccessTypes;
import bingo.vkcrm.service.model.RestAccessLog;
import bingo.vkcrm.service.utils.HttpUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.Map;

/**
 * 服务请求日志拦截器
 */
public class LogInterceptor implements HandlerInterceptor {

    private static final Log log = LogFactory.getLog(LogInterceptor.class);
    private static final String SERVICE_NAME = ApplicationContext.getProperty("Profile.Application.Name", "服务");

    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        Date date = new Date();
        Map<String, Object> parameterMap = httpServletRequest.getParameterMap();
        String requestUrl = httpServletRequest.getRequestURI();
        httpServletRequest.setAttribute("ParameterMap", parameterMap);
        httpServletRequest.setAttribute("RequestDate", date);
        log.debug("ParameterMap：" + JsonUtil.toJson(httpServletRequest.getAttribute("ParameterMap")));
        log.debug("RequestDate：" + httpServletRequest.getAttribute("RequestDate"));
        log.debug("RequestUrl：" + requestUrl);
        log.debug("ClientIp：" + HttpUtil.getIpAddress(httpServletRequest));
        log.debug("RequestMethod：" + httpServletRequest.getMethod());
        return true;
    }

    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
        Date date = new Date();

        //获取access_token
        String accessToken = StringUtils.isNotEmpty(httpServletRequest.getHeader("Authorization")) ? httpServletRequest.getHeader("Authorization").replace("Bearer ", "") : "";

        accessToken = StringUtils.isEmpty(accessToken) ? httpServletRequest.getParameter("access_token") : accessToken;

        httpServletRequest.setAttribute("ResponseDate", date);
        log.debug("ResponseDate：" + httpServletRequest.getAttribute("ResponseDate"));
        log.debug("AccessToken：" + accessToken);
        RestAccessLog restAccessLog = new RestAccessLog();
        restAccessLog.setClientIP(HttpUtil.getIpAddress(httpServletRequest));
        restAccessLog.setAccessToken(accessToken);
        restAccessLog.setAccessType(AccessTypes.Rest.getValue());
        restAccessLog.setParameterMapJson(JsonUtil.toJson(httpServletRequest.getAttribute("ParameterMap")));
        restAccessLog.setRequestDate((Date) httpServletRequest.getAttribute("RequestDate"));
        restAccessLog.setResponseDate((Date) httpServletRequest.getAttribute("ResponseDate"));
        restAccessLog.setRequestMethod(httpServletRequest.getMethod());
        restAccessLog.setRequestUrl(httpServletRequest.getRequestURI());
        restAccessLog.setAppId("--- --- --- ---");
        restAccessLog.setServiceName(SERVICE_NAME);
        restAccessLog.setCreateDate(new Date());
        log2RedisMQ(restAccessLog);
    }

    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }

    /**
     * 存入Redis消息队列
     *
     * @param restAccessLog
     */
    private void log2RedisMQ(RestAccessLog restAccessLog) {
        try {
            if (restAccessLog != null) {
                String jsonString = JsonUtil.toJson(restAccessLog);
                String accessLogKey = ApplicationContext.getProperty("log.restaccesslog.key", "RestAccessLog");
                JedisUtil.defaultDb().lpush(accessLogKey.getBytes("UTF-8"), jsonString.getBytes("UTF-8"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }
}
