package bingo.vkcrm.service.controller;

import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.common.UserContext;

/**
 * Created by DomYY on 15/8/19.
 */
public class BaseController {

    /**
     * 获取当前用户
     * @return
     */
    protected User getCurrentUser()
    {
        return UserContext.getCurrentUser();
    }
}
