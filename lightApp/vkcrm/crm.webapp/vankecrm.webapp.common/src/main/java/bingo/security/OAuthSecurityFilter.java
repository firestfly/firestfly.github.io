package bingo.security;

import bingo.common.core.ApplicationContext;
import bingo.common.core.ApplicationFactory;
import bingo.security.exceptions.UserNotFoundException;
import bingo.security.principal.IUser;
import bingo.security.utils.Util;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.common.utils.AESUtil;
import bingo.vkcrm.common.utils.CookieUtil;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.webapp.security.model.AccessToken;
import bingo.vkcrm.webapp.security.model.UserInfo;
import bingo.vkcrm.webapp.security.service.OAuthService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.UUID;

/**
 * OAUTH2.0安全拦截器
 */
public class OAuthSecurityFilter extends SecurityFilter {
    public static final String LOCAL_LOGIN = "local";
    public static final String OAUTH_LOGIN = "oauth";
    private static String LOCAL_LOGIN_URL = "/login.jsp";
    private static final String OAUTH_LOGIN_URL = ApplicationContext.getProperty("Profile.oauth.url", "http://wyapp.vanke.com/api/zhuzher/oauth/authorize");
    public static final String OAUTH_SCOPES = ApplicationContext.getProperty("Profile.oauth.scopes", "r-user rp-user");
    public static final String OAUTH_REDIRECT_URI = ApplicationContext.getProperty("Profile.oauth.redirect_uri", "http://tvkcrm.vanke.com/oauth/token");
    public static final String OAUTH_RESPONSE_TYPE = ApplicationContext.getProperty("Profile.oauth.response_type", "code");
    private static final String OAUTH_CLIENT_ID = ApplicationContext.getProperty("Profile.oauth.client_id", "xxxxx");
    private static final String OAUTH_CLIENT_SECRET = ApplicationContext.getProperty("Profile.oauth.client_secret", "xxxxx");
    private final int EXPIRE_TIME = Integer.parseInt(ApplicationContext.getProperty("Profile.token.cookie_expire", "1800"));
    private final String OAUTH_PORTAL_URL = ApplicationContext.getProperty("Profile.oauth.portal_url", "");
    private final String OAUTH_CODE_KEY = ApplicationContext.getProperty("Profile.oauth.code.key", "code");
    private final String AES_KEY = ApplicationContext.getProperty("Profile.oauth.aes_key", "0102030405060708");
    private final String COOKIE_ACCESS_TOKEN_NAME = ApplicationContext.getProperty("Profile.token.cookie_key", "access_token");
    private final String ERROR_PAGE_URL = ApplicationContext.getProperty("Profile.error.page_url", "/common/error");
    private final String ENCODING_CHARSET = "UTF-8";

    private static Logger logger = LoggerFactory.getLogger(OAuthSecurityFilter.class);

    private String providerName;


    private String loginMode = "local";

    private String loginUrl = "/common/login/login.jsp";

    public OAuthSecurityFilter() {
    }

    public String getLoginMode() {
        return this.loginMode;
    }

    public void setLoginMode(String loginMode) {
        if (!OAUTH_LOGIN.equalsIgnoreCase(loginMode) && !LOCAL_LOGIN.equalsIgnoreCase(loginMode)) {
            throw new IllegalArgumentException(String.format("you set login mode is not correct-->%s", new Object[]{loginMode}));
        } else {
            this.loginMode = loginMode;
        }
    }

    @Override
    protected void doSecurityFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws IOException, ServletException {
        if (OAUTH_LOGIN.equalsIgnoreCase(loginMode)) {
            HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
            HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;

            String requestUrl = ((HttpServletRequest) servletRequest).getRequestURI();
            logger.debug("请求的URL：" + requestUrl);

            //请求路径(不包含context)
            String path = Util.getRequestPath(httpServletRequest);

            initSecurityProvider();

            //初始化上下文
            SecurityContext context = new SecurityContext(httpServletRequest, provider);
            SecurityContext.context.set(context);

            //获取当前认证用户对象
            if (!provider.authenticate(httpServletRequest)) {
                logger.debug("path：" + path);

                //回调认证开始
                if ("/oauth/token".equalsIgnoreCase(path)) {
                    logger.debug("开始回调认证登录");
                    handleCallBackAuthentication(httpServletRequest, httpServletResponse);
                }

                //判断请求是否被忽略
                if (ignores(path) || isLoginPath(path)) {
                    chain.doFilter(servletRequest, httpServletResponse);
                    return;
                }

                //尝试获取Cookie
                Cookie accessTokenCookie = CookieUtil.getCookie(httpServletRequest, COOKIE_ACCESS_TOKEN_NAME);
                if (null != accessTokenCookie) {
                    logger.debug("开始Cookie认证登录");
                    String accessToken = accessTokenCookie.getValue();
                    //通过Cookie进行登录
                    handleAccessTokenAuthentication(accessToken, httpServletRequest, httpServletResponse, chain);
                } else {
                    handleNotAuthenticated(httpServletRequest, httpServletResponse);
                }
            } else {
                //绑定用户
                context.user = provider.getCurrentUser(httpServletRequest);
                //进行授权访问控制
                if (!provider.authorize(httpServletRequest)) {
                    handleNotAuthorized(httpServletRequest, httpServletResponse);
                } else {
                    //通过安全验证，继续访问用户请求的地址
                    chain.doFilter(servletRequest, servletResponse);
                }
            }
        } else {
            HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
            HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
            String requestUrl = ((HttpServletRequest) servletRequest).getRequestURI();
            logger.debug("请求的URL：" + requestUrl);

            //请求路径(不包含context)
            String path = Util.getRequestPath(httpServletRequest);

            initSecurityProvider();

            //初始化上下文
            SecurityContext context = new SecurityContext(httpServletRequest, provider);
            SecurityContext.context.set(context);

            //获取当前认证用户对象
            if (!provider.authenticate(httpServletRequest)) {
                logger.debug("path：" + path);

                //判断请求是否被忽略
                if (ignores(path) || isLoginPath(path)) {
                    chain.doFilter(servletRequest, httpServletResponse);
                    return;
                }

                //尝试获取Cookie
                Cookie accessTokenCookie = CookieUtil.getCookie(httpServletRequest, COOKIE_ACCESS_TOKEN_NAME);
                if (null != accessTokenCookie) {
                    logger.debug("开始Cookie认证登录");
                    String accessToken = accessTokenCookie.getValue();
                    //通过Cookie进行登录
                    handleAccessTokenAuthentication(accessToken, httpServletRequest, httpServletResponse, chain);
                } else {
                    super.doSecurityFilter(servletRequest, servletResponse, chain);
                }
            }  else {
                super.doSecurityFilter(servletRequest, servletResponse, chain);
            }
        }

    }

    /**
     * 回调认证登录
     *
     * @param request
     * @param response
     * @throws IOException
     * @throws ServletException
     */
    private void handleCallBackAuthentication(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        OAuthService oAuthService = (OAuthService) ApplicationFactory.getBeanForName("oAuthService");
        logger.debug("OAuth回调");
        String code = request.getParameter(OAUTH_CODE_KEY);
        String state = request.getParameter("state");
        if (!JedisUtil.defaultDb().exists(state)) {
            throw new RuntimeException("state参数不匹配,请重新登录.");
        }
        if (StringUtils.isEmpty(code)) {
            throw new RuntimeException("code参数为空,请重新登录.");
        }
        logger.debug("从URL中取得code：" + code);
        UserInfo userInfo;
        AccessToken accessToken;
        try {
            accessToken = oAuthService.getAccessToken(code);
            logger.debug("通过code获取得到access_token信息：" + JsonUtil.toJson(accessToken));
            userInfo = oAuthService.getUserInfo(accessToken);
            logger.debug("通过access_token获取得到用户信息：" + JsonUtil.toJson(userInfo));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        //登录
        IUser crmUserInfo = SecurityContext.getProvider().signIn(request, userInfo.getMobile());
        String userInfoJsonString;
        //序列化用户信息
        try {
            userInfoJsonString = AESUtil.encrypt2Str(JsonUtil.toJson(crmUserInfo), AES_KEY);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        //存储至Redis服务器
        JedisUtil.defaultDb().set(accessToken.getAccessToken().getBytes("UTF-8"), userInfoJsonString.getBytes("UTF-8"), EXPIRE_TIME);
        //删除Cookie
        CookieUtil.deleteCookie(response, request, COOKIE_ACCESS_TOKEN_NAME);
        //添加access_token至Cookie
        CookieUtil.addCookie(response, request, COOKIE_ACCESS_TOKEN_NAME, accessToken.getAccessToken(), -1);
        //重定向至首页
//        logger.debug("重定向至：" + request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + OAUTH_PORTAL_URL);
//        response.sendRedirect(request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + OAUTH_PORTAL_URL);
    }

    @Override
    protected void handleNotAuthenticated(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (isAjax(request)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            String requestUrl = request.getRequestURL().toString();
            String queryString = request.getQueryString();
            if (null != queryString) {
                requestUrl = requestUrl + "?" + queryString;
            }
            requestUrl = URLEncoder.encode(requestUrl, encoding);
            String redirectUrl = getRedirectUrl(request, requestUrl);
            response.sendRedirect(redirectUrl);
        }
        SecurityContext.context.set(null);
    }

    public String getLoginUrl() {
        return StringUtils.isEmpty(this.loginUrl) ? ("local".equalsIgnoreCase(this.loginMode) ? LOCAL_LOGIN_URL : OAUTH_LOGIN_URL) : super.getLoginUrl();
    }

    public void setLoginUrl(String loginUrl) {
        LOCAL_LOGIN_URL = loginUrl;
    }

    /**
     * 构建重定向URL
     *
     * @param request
     * @param requestUrl
     * @return
     */
    private String getRedirectUrl(HttpServletRequest request, String requestUrl) throws IOException {
        String redirectUrl = "";
        String state = UUID.randomUUID().toString().replace("-", "");
        //记录state至Redis
        JedisUtil.defaultDb().set(state.getBytes(ENCODING_CHARSET), state.getBytes(ENCODING_CHARSET), EXPIRE_TIME);
        if (loginMode.equals(OAUTH_LOGIN)) {
            redirectUrl = new StringBuffer().append(OAUTH_LOGIN_URL).append("?scopes=")
                    .append(URLEncoder.encode(OAUTH_SCOPES, ENCODING_CHARSET))
                    .append("&state=").append(URLEncoder.encode(state, ENCODING_CHARSET))
                    .append("&redirect_uri=").append(URLEncoder.encode(OAUTH_REDIRECT_URI, ENCODING_CHARSET))//TODO :后续考虑是否可加入returnUrl
                    .append("&response_type=").append(URLEncoder.encode(OAUTH_RESPONSE_TYPE, ENCODING_CHARSET))
                    .append("&client_id=").append(URLEncoder.encode(OAUTH_CLIENT_ID, ENCODING_CHARSET))
                    .append("&sign=n").toString();//TODO :避免Cookie自动登陆

        } else if (loginMode.equals(LOCAL_LOGIN)) {
            redirectUrl = Util.appendQueryParam(request.getContextPath() + this.getLoginUrl(), "returnUrl", requestUrl);
        }
        return redirectUrl;
    }


    /**
     * 使用Cookie进行登录
     */
    private void handleAccessTokenAuthentication(String accessToken, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain chain) throws IOException, ServletException {
        //OAuthService oAuthService = (OAuthService) ApplicationFactory.getBeanForName("oAuthService");
        //UserInfo userInfo;
        User user;
        try {
            String aesUserInfo = StringUtils.isNotEmpty(accessToken) ? JedisUtil.defaultDb().get(accessToken) : "";

            if (StringUtils.isEmpty(aesUserInfo)) {
                throw new RuntimeException("通过AccessToken读取用户信息为空.");
            }

            //解密
            String userInfoJson = AESUtil.decrypt2Str(aesUserInfo, AES_KEY);

            if (StringUtils.isEmpty(aesUserInfo)) {
                throw new RuntimeException("用户信息解密失败.");
            }

            user = JsonUtil.fromJson(userInfoJson, User.class);

            if (null == user) {
                throw new RuntimeException("用户信息为空.");
            }

            //登陆
            SecurityContext.getProvider().signIn(httpServletRequest, user.getMobilePhone());

            //通过安全验证，继续访问用户请求的地址
            chain.doFilter(httpServletRequest, httpServletResponse);
        } catch (Exception e) {
            e.printStackTrace();
            //throw new RuntimeException(e.getMessage());
            //抛出异常，则进行未登录处理
            handleNotAuthenticated(httpServletRequest, httpServletResponse);
        }
    }

    /**
     * 初始化安全provider，因为不能在应用服务器启动时从IOC容器中获取bean，所以改由在使用时，避免IOC中bean多次加载
     */
    private void initSecurityProvider() {
        logger.debug("尝试初始化SecurityProvider");
        if (null == provider) {
            synchronized (ISecurityProvider.class) {
                if (null == provider) {
                    if (Util.isNullOrEmpty(providerName)) {
                        providerName = "securityProvider";
                    }
                    if (ApplicationFactory.containsBean(providerName)) {
                        provider = ApplicationFactory.getBeanForName(ISecurityProvider.class, providerName);
                    } else {
                        provider = ApplicationFactory.getFirstBeanOfType(ISecurityProvider.class);
                    }
                    logger.info("Security Framework Inited, Provider : {}", provider.getClass().getName());
                }
            }
        }
    }
}
