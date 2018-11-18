package bingo.vkcrm.service.interceptors;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.common.utils.AESUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.common.UserContext;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.regex.Pattern;

/**
 * IP认证拦截器
 */
public class IPAuthInterceptor implements HandlerInterceptor {

    private static final Log log = LogFactory.getLog(IPAuthInterceptor.class);

    private static final int EXPIRE_TIME = Integer.parseInt(ApplicationContext.getProperty("token.cookie.expire", "1800"));

    private static final String AES_KEY = ApplicationContext.getProperty("token.aes.key", "0102030405060708");

    private static final String TEMP_USER_AES_IFNO = ApplicationContext.getProperty("Profile.TEMP_USER_AES_INFO", "BAG/6APKQgUGiWNhvm3WoES/aweD5jH+AUghEe61STbCPJn+NIwwQDtfaVaGeEXwUAvMmnZIYCQUOT1yFe9XoE/KZKuDq1qWc/KdFJs7iqpti26R7Vnnphl1UFYpd7YVNdBJyMVqUd+uquZpcXM6Tt05SgTJ7ARO3rspqZ5mxcB1RHLR0Fj+yqQdY9Cj2dfRpuhIFaU8vzlf4Zrzyq92syI9v7rJ+fH6G/Ak550Yqm/KjM9kEC730R1EE7F0gIyV6HKPseqIYdMDDPQx35eBr0BhQg51Hw7OONK1sfyRjWiXa0DBrH7WKizuDTMn8xRYOIbocKVr2nHdv1SNA+4LXFkGx/haB0Z7f9dQFoCqPt8lswXki+lIa1coVw26iWlfwxcBgt6LwLjKu70SaH4QDMEqn5ffixCMlmy7cUBClxsYo1QURR3B6aCLfM5xoKxS+0twbtyfsPBbjLyfpycV3ycfMk0tttOp0TKT7yp/P95VGcDVr53thnP25S71XNSoah+sdHnl7isl6TNoTPvbuXyEScEtgHksEMOGGNp9ePSyLdLz3ochVhB2QzSwyxWBH/WjP+ob1dm6eHjxisPP6d+RpucDexo81+PCLpK7tnoCjyDQ5lvw3vlRqHBkMl2ylR8UxKEJeM5wjKPntcRy4HtCyd96JeY5fRe/uXflH29qDiaZjvkAay1TC0k53Ey0+j2NivFnS+bjAh0i/Q1geTWHPAuIpObSVSMLoKp6V9x1kI73JVByTkfpHr2oYjiAuf/l1JiUFofpJYAEHmbkeOwZkHRaD+pI2FbfcYludKe/0S37yHIHEmLhajq7dCBD+YrfD+QkwDtCAn4TIqEQXU/Mv2qAojIjSxDavuamLRhM6dv/nLqGpn5fxa5mQKQQHoq+bA2EiemQFinlkeywUW3+6Qf2waiwb1uU1PLjw0h5JoJ4ttVKsbbFvKg9rp/lHGFa0m1L1U4t3l2NC03ZSrjIphDmeE4H0Nq0+08Qix76ci85YuQHrptHGSQ0dbcVA3M6Dtg9kHeMAFTLiIKzeMPLh+c576jJBf/+uAifohw=");

    private static final String IP_WHITE_LIST = ApplicationContext.getProperty("Profile.IP_White_list", "^10\\.39\\.\\d{1,3}\\.\\d{1,3}$`^127\\.0\\.\\d{1,3}\\.\\d{1,3}$");


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

        boolean isAuthenticated = isIPAuthenticated(httpServletRequest);
        if (isAuthenticated) {
            log.info("该IP地址存在于白名单内，模拟登陆.");

            String aesUserInfo = TEMP_USER_AES_IFNO;

            //解密
            String userInfoJson = AESUtil.decrypt2Str(aesUserInfo, AES_KEY);

            User userInfo = JsonUtil.fromJson(userInfoJson, User.class);

            //设置当前用户信息至上下文
            UserContext.setCurrentUser(userInfo);

            httpServletRequest.setAttribute("IP_AUTH",true);

            //TODO : 是否改为为该请求插入Authorization Bearer的AccessToken头更为合适？
            //httpServletResponse.addHeader("Authorization Bearer","access_token");

            return true;
        } else {

            return true;
        }

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


    /**
     * 取出Header中的IP地址，进行白名单校验
     *
     * @param request
     * @return
     */
    private boolean isIPAuthenticated(HttpServletRequest request) {
        //由于CRM目前仅支持域名访问,且域名映射为Web服务器,服务域名是通过Web服务器中的Nginx转发,所以去除RemoteAddressIP过滤
        boolean result = false;
        String ipXForwardedForAddress = request.getHeader("X-FORWARDED-FOR");
        String ipRemoteAddress = request.getRemoteAddr();
        log.debug("IPAddress-X-FORWARDED-FOR：" + ipXForwardedForAddress);
        log.debug("IPAddress-getRemoteAddress：" + ipRemoteAddress);

        ipXForwardedForAddress = !StringUtils.isNotBlank(ipXForwardedForAddress) ? "127.0.0.1" : ipXForwardedForAddress;

        String[] XForwardedForAddressIpList = ipXForwardedForAddress.split(",", -1);
        String[] RemoteAddressIpList = ipRemoteAddress.split(",", -1);

        boolean XForwardedForAddressResult = validateWhiteList(XForwardedForAddressIpList[0].trim());
        boolean RemoteAddressResult = validateWhiteList(RemoteAddressIpList[0].trim());

        log.debug("XForwardedForAddressResult-RemoteAddressResult：" + XForwardedForAddressResult + "-" + RemoteAddressResult);
        result = XForwardedForAddressResult;

        return result;
    }

    /**
     * 校验是否存在于白名单列表中
     *
     * @param ip
     * @return
     */
    private boolean validateWhiteList(String ip) {
        boolean result = false;
        String ipWhiteList = IP_WHITE_LIST;
        log.debug("IP白名单列表：" + ipWhiteList);
        String[] ipList = ipWhiteList.split("`", -1);
        for (String ipRecord : ipList) {
            log.debug("ipRecord：" + ipRecord);
            result = Pattern.matches(ipRecord, ip);
            if (result) {
                break;
            }
        }
        return result;
    }
}
