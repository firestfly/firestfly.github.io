/**
 * This file created at 2011-5-10.
 *
 * Copyright (c) 2002-2011 Bingosoft, Inc. All rights reserved.
 */
package bingo.vkcrm.webapp.security.authentication;

import bingo.security.authorization.SecurityAuthorizer;
import bingo.security.permission.GenericPermission;
import bingo.security.principal.IUser;
import bingo.security.store.IAuthStore;

import java.util.List;

/**
 * {@link MultiSecurityAuthorizer}判断用户权限{@link IAuthStore}
 * 
 * 	判断权限支持多个
 * 
 * @author qiuchsh
 */
public class MultiSecurityAuthorizer extends SecurityAuthorizer {

	/**
	 * 判断用户是否有权限，支持多个，用逗号分隔
	 */
	public boolean isUserHasPermission(IUser user, String operation) {
		List<GenericPermission> permissions = getAllUserPermissions(user);
		
		String[] operations = operation.split(",");
		for(String operationTemp : operations){
			for (GenericPermission p : permissions) {
				if(operationTemp.equals(p.getOperation())){
					return true;
				}
			}
		
		}
		
		return false;
	}
}
