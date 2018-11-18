package bingo.vkcrm.webapp.security.service;

import bingo.common.core.ApplicationContext;
import bingo.dao.IDao;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.enums.AccessTypes;
import bingo.vkcrm.service.model.RestAccessLog;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.utils.HttpUtil;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.webapp.security.model.AccessToken;
import bingo.vkcrm.webapp.security.model.OAuthAccessLog;
import bingo.vkcrm.webapp.security.model.Result;
import bingo.vkcrm.webapp.security.model.UserInfo;
import com.sun.org.apache.xml.internal.serializer.Method;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.http.*;
import org.apache.http.HttpRequest;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.entity.BasicHttpEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.SystemDefaultHttpClient;
import org.apache.http.message.BasicHttpEntityEnclosingRequest;
import org.apache.http.message.BasicHttpRequest;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.HttpParams;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URLEncoder;
import java.util.*;

/**
 * OAuth服务
 */
@Service
public class OAuthService {

    private static final String OAUTH_ACCESS_TOKEN_URL = ApplicationContext.getProperty("Profile.oauth.access_token_url", "http://wyapp.vanke.com/api/zhuzher/oauth/access_token");
    private static final String OAUTH_USER_INFO_URL = ApplicationContext.getProperty("Profile.oauth.user_info_url", "http://wyapp.vanke.com/api/zhuzher/users/me?access_token=");
    private static final String OAUTH_CLIENT_ID = ApplicationContext.getProperty("Profile.oauth.client_id", "xxxxx");
    private static final String OAUTH_CLIENT_SECRET = ApplicationContext.getProperty("Profile.oauth.client_secret", "xxxxx");
    private static final String OAUTH_ACCESS_TOKEN_GRANT_TYPE = ApplicationContext.getProperty("Profile.oauth.access_token_grant_type", "authorization_code");
    private static final String OAUTH_REFRESH_TOKEN_GRANT_TYPE = ApplicationContext.getProperty("Profile.oauth.refresh_token_grant_type", "refresh_token");
    private static final String OAUTH_REDIRECT_URI = ApplicationContext.getProperty("Profile.oauth.redirect_uri", "http://tvkcrm.vanke.com/oauth/token");
    private static final String OAUTH_REVOKE_URL = ApplicationContext.getProperty("Profile.oauth.revoke_url", "http://wyapp.vanke.com/api/lebang/oauth/revoke");


    private final String OAUTH_GET_USER_NAME_SQL_ID = ApplicationContext.getProperty("Profile.oauth.getusersql", "security.getUserNameByMobile");

    private IDao dao;

    public IDao getDao() {
        return dao;
    }

    public void setDao(IDao dao) {
        this.dao = dao;
    }

    protected final Logger log = LoggerFactory.getLogger(OAuthService.class);

    @Autowired
    private HttpServletRequest httpServletRequest;

    /**
     * 根据code获取AccessToken
     *
     * @param code
     * @return
     */
    public AccessToken getAccessToken(String code) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        Date startDate = new Date();
        String exceptionMessage = null;
        AccessToken accessToken = null;
        try {
            accessToken = restTemplate.postForObject(OAUTH_ACCESS_TOKEN_URL, getAccessTokenVariables(code), AccessToken.class);
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            exceptionMessage = StringEscapeUtils.unescapeJava(e.getResponseBodyAsString());
            throw new RuntimeException("OAuth认证服务器认证过程出错,返回异常信息:" + exceptionMessage);
        } finally {
            Date endDate = new Date();
            String userAgent = httpServletRequest.getHeader("User-Agent");
            log2RedisMQ(startDate, endDate, OAUTH_ACCESS_TOKEN_URL, JsonUtil.toJson(getAccessTokenVariables(code)), JsonUtil.toJson(accessToken), "根据code获取AccessToken", userAgent, HttpMethod.POST.toString(), exceptionMessage);
        }
        return accessToken;
    }

    /**
     * 根据RefreshToken刷新AccessToken
     *
     * @param refreshToken
     * @return
     */
    public AccessToken refreshAccessToken(String refreshToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        Date startDate = new Date();
        String exceptionMessage = null;
        AccessToken accessToken = null;
        try {
            accessToken = restTemplate.postForObject(OAUTH_ACCESS_TOKEN_URL, getRefreshTokenVariables(refreshToken), AccessToken.class);
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            exceptionMessage = StringEscapeUtils.unescapeJava(e.getResponseBodyAsString());
            throw new RuntimeException("OAuth认证服务器认证过程出错,返回异常信息:" + exceptionMessage);
        } finally {
            Date endDate = new Date();
            String userAgent = httpServletRequest.getHeader("User-Agent");
            log2RedisMQ(startDate, endDate, OAUTH_ACCESS_TOKEN_URL, JsonUtil.toJson(getRefreshTokenVariables(refreshToken)), JsonUtil.toJson(accessToken), "根据RefreshToken刷新AccessToken", userAgent, HttpMethod.POST.toString(), exceptionMessage);
        }
        return accessToken;
    }

    /**
     * 根据AccessToken获取用户信息
     *
     * @param accessToken
     * @return
     */
    public UserInfo getUserInfo(AccessToken accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        Date startDate = new Date();
        String exceptionMessage = null;
        Result result = null;
        try {
            result = restTemplate.getForObject(getUserInfoUrl(accessToken.getAccessToken()), Result.class);
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            exceptionMessage = StringEscapeUtils.unescapeJava(e.getResponseBodyAsString());
            throw new RuntimeException("OAuth认证服务器认证过程出错,返回异常信息:" + exceptionMessage);
        } finally {
            Date endDate = new Date();
            String userAgent = httpServletRequest.getHeader("User-Agent");
            log2RedisMQ(startDate, endDate, getUserInfoUrl(accessToken.getAccessToken()), "", JsonUtil.toJson(result), "根据AccessToken获取用户信息", userAgent, HttpMethod.GET.toString(), exceptionMessage);
        }
        return null == result ? null : result.getUserInfo();
    }

    /**
     * 根据AccessToken获取用户信息
     *
     * @param accessToken
     * @return
     */
    public UserInfo getUserInfo(String accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        Date startDate = new Date();
        String exceptionMessage = null;
        Result result = null;
        try {
            result = restTemplate.getForObject(getUserInfoUrl(accessToken), Result.class);
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            exceptionMessage = StringEscapeUtils.unescapeJava(e.getResponseBodyAsString());
            throw new RuntimeException("OAuth认证服务器认证过程出错,返回异常信息:" + exceptionMessage);
        } finally {
            Date endDate = new Date();
            String userAgent = httpServletRequest.getHeader("User-Agent");
            log2RedisMQ(startDate, endDate, getUserInfoUrl(accessToken), "", JsonUtil.toJson(result), "根据AccessToken获取用户信息", userAgent, HttpMethod.GET.toString(), exceptionMessage);
        }
        return null == result ? null : result.getUserInfo();
    }

    /**
     * 根据AccessToken注销系统
     *
     * @param accessToken
     * @return
     * @throws Exception
     */
    public String oauthLogout(String accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        Date startDate = new Date();
        String exceptionMessage = null;
        ResponseEntity<String> result = null;
        log.debug("accessToken：" + accessToken);
        Map<String, String> parameters = new HashMap<String, String>();
        parameters.put("token", accessToken);
        try {
            result = restTemplate.postForEntity(OAUTH_REVOKE_URL, parameters, String.class);
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            exceptionMessage = StringEscapeUtils.unescapeJava(e.getResponseBodyAsString());
            throw new RuntimeException("OAuth认证服务器认证过程出错,返回异常信息:" + exceptionMessage);
        } finally {
            Date endDate = new Date();
            String userAgent = httpServletRequest.getHeader("User-Agent");
            log2RedisMQ(startDate, endDate, OAUTH_REVOKE_URL, JsonUtil.toJson(parameters), JsonUtil.toJson(result), "根据AccessToken注销系统", userAgent, HttpMethod.POST.toString(), exceptionMessage);
        }
        return null == result ? "" : null == result.getBody() ? "" : result.getBody();
    }

    /**
     * 根据手机号码，获取用户名
     *
     * @param mobile
     * @return
     */
    public String getUserName(String mobile) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("Mobile", mobile);
        return dao.queryForString(OAUTH_GET_USER_NAME_SQL_ID, paramsMap);
    }

    /**
     * 构建获取AccessToken的参数列表
     *
     * @param code
     * @return
     */
    private Map<String, String> getAccessTokenVariables(String code) {
        Map<String, String> paramsMap = new HashMap<String, String>();
        paramsMap.put("client_id", OAUTH_CLIENT_ID);
        paramsMap.put("client_secret", OAUTH_CLIENT_SECRET);
        paramsMap.put("code", code);
        paramsMap.put("grant_type", OAUTH_ACCESS_TOKEN_GRANT_TYPE);
        paramsMap.put("redirect_uri", OAUTH_REDIRECT_URI);
        return paramsMap;
    }

    /**
     * 构建刷新AccessToken的参数列表
     *
     * @param refreshToken
     * @return
     */
    private Map<String, String> getRefreshTokenVariables(String refreshToken) {
        Map<String, String> paramsMap = new HashMap<String, String>();
        paramsMap.put("client_id", OAUTH_CLIENT_ID);
        paramsMap.put("client_secret", OAUTH_CLIENT_SECRET);
        paramsMap.put("grant_type", OAUTH_REFRESH_TOKEN_GRANT_TYPE);
        paramsMap.put("refresh_token", refreshToken);
        paramsMap.put("redirect_uri", OAUTH_REDIRECT_URI);
        return paramsMap;
    }

    /**
     * 构建获取用户信息的URL
     *
     * @param accessToken
     * @return
     */
    private String getUserInfoUrl(String accessToken) {
        StringBuffer stringBuffer = new StringBuffer().append(OAUTH_USER_INFO_URL).append(URLEncoder.encode(accessToken));
        return stringBuffer.toString();
    }

    /**
     * 存入Redis消息队列
     *
     * @param requestDate      请求时间
     * @param responseDate     响应时间
     * @param remoteUrl        访问地址
     * @param parameters       参数
     * @param result           结果
     * @param actionName       动作
     * @param requestMethod    请求类型
     * @param exceptionMessage 异常信息
     */
    private void log2RedisMQ(Date requestDate, Date responseDate, String remoteUrl, String parameters, String result, String actionName, String userAgent, String requestMethod, String exceptionMessage) {
        RestAccessLog restAccessLog = new RestAccessLog();
        restAccessLog.setClientIP(HttpUtil.getIpAddress(httpServletRequest));
        restAccessLog.setActionName(actionName);
        restAccessLog.setAccessType(AccessTypes.OAuth.getValue());
        restAccessLog.setParameterMapJson(parameters);
        restAccessLog.setResultJson(result);
        restAccessLog.setRequestDate(requestDate);
        restAccessLog.setResponseDate(responseDate);
        restAccessLog.setRequestMethod(requestMethod);
        restAccessLog.setRequestUrl(remoteUrl);
        restAccessLog.setUserAgent(userAgent);
        restAccessLog.setExceptionMessage(exceptionMessage);
        restAccessLog.setCreateDate(new Date());
        try {
            String jsonString = JsonUtil.toJson(restAccessLog);
            String accessLogKey = ApplicationContext.getProperty("log.restaccesslog.key", "RestAccessLog");
            JedisUtil.defaultDb().lpush(accessLogKey.getBytes("UTF-8"), jsonString.getBytes("UTF-8"));
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }

}
