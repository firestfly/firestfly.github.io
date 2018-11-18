package bingo.modules.securityConsole.organization;

import org.lightframework.mvc.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class CallcenterOrganizationController {
	
	
	@Autowired
	private CallcenterOrganizationService callcenterOrganizationService;

	public void editOrganization(String orgId, String parentName) {
		TelGroup organization = callcenterOrganizationService.findById(orgId);
		Result.setAttribute("org", organization);
		Result.forward("/modules/organization/edit_callcenter_organization.jsp?parentName" + parentName);
	}
}