package bingo.vkcrm.service.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by DomYY on 15/9/6.
 */

/**
 * 跨域Filter，为每个请求加上跨域HttpHeader
 */
public class CrossMainFilter implements Filter {

    private final String HTTP_ALLOW_ORIGIN= "Access-Control-Allow-Origin";
    private final String HTTP_ALLOW_METHOD = "Access-Control-Allow-Methods";
    private final String HTTP_ALLOW_HEARDERS = "Access-Control-Allow-Headers";
    private final String HTTP_ALLOW_CREDENTIALS = "Access-Control-Allow-Credentials";

    public void init(FilterConfig filterConfig) throws ServletException {

    }

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse httpServletResponse = (HttpServletResponse)servletResponse;
        //设置Access-Control-Allow-Origin为*，支持跨域请求
        httpServletResponse.addHeader(HTTP_ALLOW_ORIGIN, "*");
        //设置Access-Control-Allow-Headers为Origin, X-Requested-With, Content-Type, Accept，支持跨域请求
        //httpServletResponse.setHeader(HTTP_ALLOW_HEARDERS, "Origin, X-Requested-With, Content-Type, Accept");
        //设置Access-Control-Request-Methods为GET,POST,PUT,DELETE，支持跨域请求方法
        httpServletResponse.addHeader(HTTP_ALLOW_METHOD, "GET, POST, PUT, OPTIONS, DELETE");
        //设置Access-Control-Allow-Headers为Authorization，支持跨域请求
        httpServletResponse.addHeader(HTTP_ALLOW_HEARDERS, "Authorization, X-Requested-With");
        filterChain.doFilter(servletRequest,httpServletResponse);
    }

    public void destroy() {

    }
}
