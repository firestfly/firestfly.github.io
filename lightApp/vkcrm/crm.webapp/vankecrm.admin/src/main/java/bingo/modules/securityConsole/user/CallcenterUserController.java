package bingo.modules.securityConsole.user;

import java.util.HashMap;
import java.util.Map;

import org.lightframework.mvc.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import bingo.common.core.utils.StringUtils;

/**
 * 
 * 用户服务前端控制类
 */
@Controller
public class CallcenterUserController {
	
	@Autowired
	private CallcenterUserService callcenterUserService;

	/**
	 * 进入用户基本信息页面
	 * 
	 * @param userid
	 */
	public void editUser(String userId,String orgId,String orgName) {
		Map<String, Object> secUser = new HashMap<String, Object>();
		if (StringUtils.isNotEmpty(userId)) {
			secUser = callcenterUserService.getUserInfoById(userId);
			secUser.put("actionType", "edit");
			
		} else {
			secUser.put("groupids", orgId);
			secUser.put("groupNames", orgName);
			secUser.put("actionType", "add");
		}
		Result.setAttribute("user", secUser);
		Result.forward("/modules/user/callcenter_edit_user.jsp");
	}
}
