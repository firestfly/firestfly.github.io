package bingo.vkcrm.webapp.security.filter;

import bingo.common.core.ApplicationContext;
import bingo.common.core.ApplicationFactory;
import bingo.security.SecurityContext;
import bingo.security.principal.IUser;
import bingo.vkcrm.common.utils.CookieUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.exceptions.UnAuthorizedException;
import bingo.vkcrm.webapp.security.model.UserInfo;
import bingo.vkcrm.webapp.security.service.OAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * OAUTH2.0Cookie认证拦截器
 */
public class OAuthCookieFilter implements Filter {

    private static Logger logger = LoggerFactory.getLogger(OAuthCookieFilter.class);

    private final String OAUTH_CODE_KEY = ApplicationContext.getProperty("Profile.oauth.code.key", "code");

    private final String OAUTH_PORTAL_URL = ApplicationContext.getProperty("Profile.oauth.portal_url", "");

    private final String ERROR_PAGE_URL = ApplicationContext.getProperty("Profile.error.page_url", "/common/error");

    private final int EXPIRE_TIME = Integer.parseInt(ApplicationContext.getProperty("Profile.token.cookie_expire", "1800"));

    private final String COOKIE_ACCESS_TOKEN_NAME = ApplicationContext.getProperty("Profile.token.cookie_key", "access_token");

    private final String AES_KEY = ApplicationContext.getProperty("Profile.oauth.aes_key", "0102030405060708");


    public void init(FilterConfig filterConfig) throws ServletException {

    }

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
        Cookie accessTokenCookie = CookieUtil.getCookie(httpServletRequest, COOKIE_ACCESS_TOKEN_NAME);
        String requestUrl = ((HttpServletRequest) servletRequest).getRequestURI();
        logger.debug("请求的URL：" + requestUrl);
        if (accessTokenCookie == null) {
            logger.debug("Cookie为空,进入安全过滤器");
        } else {
            logger.debug("Cookie不为空,登陆");
            String accessToken = accessTokenCookie.getValue();
            try {
                handleCookieAuthentication(accessToken, httpServletRequest);

            } catch (Exception ex) {
                ex.printStackTrace();
                logger.error(ex.getMessage());
                //重定向至错误页面
                logger.info("重定向至：" + httpServletRequest.getScheme() + "://" + httpServletRequest.getServerName() + ":" + httpServletRequest.getServerPort() + httpServletRequest.getContextPath() + ERROR_PAGE_URL);
                httpServletResponse.sendRedirect(httpServletRequest.getScheme() + "://" + httpServletRequest.getServerName() + ":" + httpServletRequest.getServerPort() + httpServletRequest.getContextPath() + ERROR_PAGE_URL);
            }
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    public void destroy() {

    }

    /**
     * 使用Cookie进行登陆
     */
    private void handleCookieAuthentication(String accessToken, HttpServletRequest httpServletRequest) throws Exception {
        OAuthService oAuthService = (OAuthService) ApplicationFactory.getBeanForName("oAuthService");
        UserInfo userInfo = oAuthService.getUserInfo(accessToken);
        if (userInfo == null) {
            throw new UnAuthorizedException("用户信息为空");
        }
        logger.debug("通过access_token获取得到用户信息：" + JsonUtil.toJson(userInfo));
        //登陆
        SecurityContext.getProvider().signIn(httpServletRequest, userInfo.getMobile());
    }
}
