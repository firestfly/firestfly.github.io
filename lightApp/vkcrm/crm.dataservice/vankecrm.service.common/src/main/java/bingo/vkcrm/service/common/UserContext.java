package bingo.vkcrm.service.common;

import bingo.dao.IDao;
import bingo.vkcrm.service.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

/**
 * UserInfo上下文信息
 */
public class UserContext {

    static ThreadLocal<UserContext> context = new ThreadLocal<UserContext>();

    User user;

    private UserContext() {

    }

    /**
     * 设置当前请求上下文绑定的登录用户
     */
    public static void setCurrentUser(User user) {
        getContext().user = user;
    }

    /**
     * 获取当前请求上下文的登录用户
     */
    public static User getCurrentUser(){
        UserContext context = getContext();
        User user = context.user;
        if(null == user){
            throw new RuntimeException("UserContext为实例化。");
        }
        return user;
    }

    private static UserContext getContext() {
        UserContext userContext = context.get();

        if (null == userContext) {
            userContext = new UserContext();
            context.set(userContext);
        }
        return userContext;
    }
}
