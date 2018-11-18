package bingo.vkcrm.common.utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Cookie操作工具类
 */
public class CookieUtil {

    /**
     * 添加Cookie
     *
     * @param httpServletResponse
     * @param name
     * @param value
     * @param age
     */
    public static void addCookie(HttpServletResponse httpServletResponse, String name, String value, int age) {
        Cookie cookies = new Cookie(name, value);
        cookies.setPath("/");
        cookies.setMaxAge(age);
        httpServletResponse.addCookie(cookies);
    }

    /**
     * 添加Cookie
     *
     * @param httpServletResponse
     * @param httpServletRequest
     * @param name
     * @param value
     * @param age
     */
    public static void addCookie(HttpServletResponse httpServletResponse, HttpServletRequest httpServletRequest, String name, String value, int age) {
        String domain = httpServletRequest.getServerName();
        Cookie cookies = new Cookie(name, value);
        cookies.setPath("/");
        cookies.setMaxAge(age);
        cookies.setDomain(domain);
        httpServletResponse.addCookie(cookies);
    }

    public static String getCookieValue(HttpServletRequest httpServletRequest, String cookieName) {
        if (cookieName != null) {
            Cookie cookie = getCookie(httpServletRequest, cookieName);
            if (cookie != null) {
                return cookie.getValue();
            }
        }
        return "";
    }

    /**
     * 获取Cookie
     *
     * @param httpServletRequest
     * @param cookieName
     * @return
     */
    public static Cookie getCookie(HttpServletRequest httpServletRequest, String cookieName) {
        Cookie[] cookies = httpServletRequest.getCookies();
        Cookie cookie = null;
        try {
            if (cookies != null && cookies.length > 0) {
                for (int i = 0; i < cookies.length; i++) {
                    cookie = cookies[i];
                    if (cookie.getName().equals(cookieName)) {
                        return cookie;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 删除Cookie
     *
     * @param httpServletResponse
     * @param httpServletRequest
     * @param cookieName
     * @return
     */
    public static boolean deleteCookie(HttpServletResponse httpServletResponse, HttpServletRequest httpServletRequest, String cookieName) {
        if (cookieName != null) {
            Cookie cookie = getCookie(httpServletRequest, cookieName);
            if (cookie != null) {
                cookie.setMaxAge(0);//如果0，就说明立即删除
                cookie.setPath("/");//不要漏掉
                httpServletResponse.addCookie(cookie);
                return true;
            }
        }
        return false;
    }


}
