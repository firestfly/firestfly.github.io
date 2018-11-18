package bingo.vkcrm.service.interceptors;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.common.utils.AESUtil;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.common.UserContext;
import bingo.vkcrm.service.exceptions.UnAuthorizedException;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Token认证拦截器
 */
public class TokenAuthInterceptor implements HandlerInterceptor {

    private static final Log log = LogFactory.getLog(TokenAuthInterceptor.class);

    private static final int EXPIRE_TIME = Integer.parseInt(ApplicationContext.getProperty("token.cookie.expire", "1800"));

    private static final String AES_KEY = ApplicationContext.getProperty("token.aes.key", "0102030405060708");

    private static final String SERVKCE_NAME = ApplicationContext.getProperty("token.organization.service", "userService");

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

        log.debug("RequestUrl：" + httpServletRequest.getRequestURI());

        String accessToken = StringUtils.isNotEmpty(httpServletRequest.getHeader("Authorization")) ? httpServletRequest.getHeader("Authorization").replace("Bearer ", "") : "";

        accessToken = StringUtils.isEmpty(accessToken) ? httpServletRequest.getParameter("access_token") : accessToken;

        log.debug("AccessToken：" + accessToken);

        Boolean result = false;
        try {
            if (null == httpServletRequest.getAttribute("IP_AUTH")) {
                throw new RuntimeException("");
            }
            //获取当前登陆信息，如果获取得到，则放行
            if (null != UserContext.getCurrentUser()) {
                result = true;
            }
        } catch (RuntimeException e) {
            String aesUserInfo = StringUtils.isNotEmpty(accessToken) ? JedisUtil.defaultDb().get(accessToken.replace("Bearer ", "")) : "";

            //如果抛出用户不存在异常，则校验AccessToken是否存在，不存在则抛出401
            if (StringUtils.isNotBlank(aesUserInfo)) {
                //解密
                String userInfoJson = AESUtil.decrypt2Str(aesUserInfo, AES_KEY);

                User userInfo = JsonUtil.fromJson(userInfoJson, User.class);

                //设置当前用户信息至上下文
                UserContext.setCurrentUser(userInfo);

                //更新Token过期时间
                JedisUtil.defaultDb().expire(accessToken.getBytes("UTF-8"), EXPIRE_TIME);

                result = true;
            } else {
                throw new UnAuthorizedException("access_token验证失败。");
            }
        }

        return result;
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
