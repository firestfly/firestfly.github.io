package bingo.modules.securityConsole.notity;

import org.lightframework.mvc.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class NotifyController {
    @Autowired
    NotifyService notifyService;

    /**
     * 编辑通知订阅配置
     * @return
     */
    public void editNotifySubscribe(String id) {
        Result.setAttribute("notify", notifyService.getNotifySubscribeById(id));
        Result.forward("/modules/notify/edit_notify.jsp");
    }
}
