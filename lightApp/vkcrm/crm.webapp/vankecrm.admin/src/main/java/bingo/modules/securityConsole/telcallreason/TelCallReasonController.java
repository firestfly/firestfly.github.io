package bingo.modules.securityConsole.telcallreason;

import org.apache.commons.lang3.StringUtils;
import org.lightframework.mvc.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

/**
 * 
 * 通话原因前端控制类
 */
@Controller
public class TelCallReasonController {
	
	@Autowired
	private TelCallReasonService telCallReasonService;

	/**
	 * 进入用户通话原因编辑页面
	 * 
	 * @param userid
	 */
	public void editTelcallreason(String id) {
		if(StringUtils.isNotEmpty(id)){
			Result.setAttribute("telCallReason", telCallReasonService.getTelCallReson(id));
		}
		Result.forward("/modules/telcallreason/edit_telcallreason.jsp");
	}
}
