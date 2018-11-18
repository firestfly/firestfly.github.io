package bingo.vkcrm.webapp.security.servlet;

import bingo.common.core.ApplicationContext;
import bingo.common.core.ApplicationFactory;
import bingo.security.SecurityContext;
import bingo.security.principal.IUser;
import bingo.vkcrm.service.exceptions.UnAuthorizedException;
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
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 *
 */
public class OAuthTokenServlet extends HttpServlet {

    private static Logger logger = LoggerFactory.getLogger(OAuthTokenServlet.class);

    private final String OAUTH_CODE_KEY = ApplicationContext.getProperty("Profile.oauth.code.key", "code");

    private final String OAUTH_PORTAL_URL = ApplicationContext.getProperty("Profile.oauth.portal_url", "");

    private final String ERROR_PAGE_URL = ApplicationContext.getProperty("Profile.error.page_url", "/common/error");

    private final int EXPIRE_TIME = Integer.parseInt(ApplicationContext.getProperty("Profile.token.cookie_expire", "1800"));

    private final String COOKIE_ACCESS_TOKEN_NAME = ApplicationContext.getProperty("Profile.token.cookie_key", "access_token");

    private final String AES_KEY = ApplicationContext.getProperty("Profile.oauth.aes_key", "0102030405060708");

    public OAuthTokenServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //重定向至首页
        logger.info("重定向至：" + req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + req.getContextPath() + OAUTH_PORTAL_URL);
        resp.sendRedirect(req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + req.getContextPath() + OAUTH_PORTAL_URL);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doPost(req, resp);
    }
}
