package bingo.vkcrm.service.resolver;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.enums.AccessTypes;
import bingo.vkcrm.service.exceptions.ServiceException;
import bingo.vkcrm.service.model.ExceptionLog;
import bingo.vkcrm.service.model.RestAccessLog;
import bingo.vkcrm.service.utils.HttpUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

/**
 * 异常日志处理类
 */
@Component
public class ExceptionLogResolver implements HandlerExceptionResolver {

    private static final Log log = LogFactory.getLog(ExceptionLogResolver.class);

    private static final String SERVICE_NAME = ApplicationContext.getProperty("Profile.Application.Name", "服务");

    private static final String CHARACTER_ENCODING = "UTF-8";

    private static final String CONTENT_TYPE = "application/json;charset=UTF-8";

    public ModelAndView resolveException(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception ex) {
        try {
            // 获取access_token
            String accessToken = StringUtils.isNotEmpty(httpServletRequest.getHeader("Authorization"))?httpServletRequest.getHeader("Authorization").replace("Bearer ", ""):"";

            accessToken = StringUtils.isEmpty(accessToken) ? httpServletRequest.getParameter("access_token") : accessToken;
            httpServletResponse.reset();
            //设置Encode，防止乱码
            httpServletResponse.setCharacterEncoding(CHARACTER_ENCODING);
            httpServletResponse.setContentType(CONTENT_TYPE);
            log.debug("RequestUrl：" + httpServletRequest.getRequestURI());
            log.debug("ClientIp：" + HttpUtil.getIpAddress(httpServletRequest));
            log.debug("AccessToken：" + accessToken);
            log.debug("RequestMethod：" + httpServletRequest.getMethod());

            Date date = new Date();

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
            restAccessLog.setExceptionMessage(ex.getMessage());
            log2RedisMQ(restAccessLog);



            ExceptionLog exceptionLog = new ExceptionLog();
            exceptionLog.setClientIP(HttpUtil.getIpAddress(httpServletRequest));
            exceptionLog.setAccessToken(accessToken);
            exceptionLog.setRequestMethod(httpServletRequest.getMethod());
            exceptionLog.setRequestUrl(httpServletRequest.getRequestURI());
            exceptionLog.setAppId("--- --- --- ---");
            exceptionLog.setServiceName(SERVICE_NAME);
            exceptionLog.setExceptionMessage(ex.getMessage());
            exceptionLog.setExceptionStackTrace(ExceptionUtils.getStackTrace(ex));
            exceptionLog.setCreateDate(new Date());

            if (ex instanceof ServiceException) {

                httpServletResponse.setStatus(((ServiceException) ex).getCode());
                httpServletResponse.getWriter().write(JsonUtil.toJson(ServiceResult.error((ServiceException) ex)));
            } else {

                httpServletResponse.setStatus(ServiceResult.CODE_SERVER_ERROR);
                httpServletResponse.getWriter().write(JsonUtil.toJson(ServiceResult.error(ex)));
            }

            //打印异常信息
            ex.printStackTrace();
            log.error(ex.getMessage());

            //记录日志到Redis消息队列
            log2RedisMQ(exceptionLog);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(ex.getMessage());
        }

        return new ModelAndView();
    }

    /**
     * 存入Redis消息队列
     *
     * @param exceptionLog
     */
    private void log2RedisMQ(ExceptionLog exceptionLog) {
        try {
            if (exceptionLog != null) {
                String jsonString = JsonUtil.toJson(exceptionLog);
                String accessLogKey = ApplicationContext.getProperty("log.exceptionlog.key", "ExceptionLog");
                JedisUtil.defaultDb().lpush(accessLogKey.getBytes("UTF-8"), jsonString.getBytes("UTF-8"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
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
