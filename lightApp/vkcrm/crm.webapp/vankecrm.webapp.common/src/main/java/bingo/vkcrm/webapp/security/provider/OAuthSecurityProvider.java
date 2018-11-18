package bingo.vkcrm.webapp.security.provider;

import bingo.security.SecurityFilter;
import bingo.security.SecurityProvider;
import bingo.security.principal.IUser;

import javax.servlet.http.HttpServletRequest;

/**
 *
 */
public class OAuthSecurityProvider extends SecurityProvider {

    /**
     * 系统登录
     *
     * @param request
     * @param username
     * @return
     */
    @Override
    public IUser signIn(HttpServletRequest request, String username) {
        return super.signIn(request, username);
    }

    /**
     * 系统登出
     *
     * @param request
     */
    @Override
    public void signOut(HttpServletRequest request) {
        super.signOut(request);
    }
}
