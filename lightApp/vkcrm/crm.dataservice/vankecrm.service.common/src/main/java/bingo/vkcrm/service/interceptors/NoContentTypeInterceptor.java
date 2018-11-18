package bingo.vkcrm.service.interceptors;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 针对IE10以下浏览器，跨域AJAX访问时，Header中无Content-Type的处理
 */
public class NoContentTypeInterceptor implements HandlerInterceptor {

    private static final String FORM_URL_ENCODED_CONTENT_TYPE = "application/x-www-form-urlencoded";
    private static final String CHARSET_ENCODING = "UTF-8";
    private static final Log log = LogFactory.getLog(NoContentTypeInterceptor.class);

    /**
     * 前置处理
     *
     * @param httpServletRequest
     * @param httpServletResponse
     * @param o
     * @return
     * @throws Exception
     */
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        log.debug("Content-Type: " + httpServletRequest.getContentType());
        //针对POST请求进行处理
        if ("POST".equalsIgnoreCase(httpServletRequest.getMethod()) && null == httpServletRequest.getHeader("Content-Type")) {
            httpServletResponse.addHeader("Content-Type", FORM_URL_ENCODED_CONTENT_TYPE);
            httpServletResponse.setCharacterEncoding(CHARSET_ENCODING);
        }
        return true;
    }

    /**
     * 后置处理
     *
     * @param httpServletRequest
     * @param httpServletResponse
     * @param o
     * @param modelAndView
     * @throws Exception
     */
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    /**
     * 渲染视图后处理
     *
     * @param httpServletRequest
     * @param httpServletResponse
     * @param o
     * @param e
     * @throws Exception
     */
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
