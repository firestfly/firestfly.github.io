/**
 * This file created at 2011-5-10.
 *
 * Copyright (c) 2002-2011 Bingosoft, Inc. All rights reserved.
 */
package bingo.security.principal;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bingo.common.core.utils.StringUtils;
import bingo.security.cache.IUserState;
import bingo.security.cache.UserState;

/**
 * {@link IUser}自定义实现
 * 
 * @author xuzhh
 */
public class User implements IUser {

	protected String      id;
	protected String      name;
	protected String      loginId;
	protected String      password;
	protected String      email;
	protected String      mobilePhone;
	protected String      sex;
	protected String 	  path;
	protected String      companyId;
	protected String	  company;
	protected String 	  deptId;
	protected String      dept;
	protected String 	  fullname;
	protected Date        birthday;
	protected String 	  employeeId;
	protected String 	  orgId;
	protected List<? extends IRole> roles = new ArrayList<IRole>();
	protected IUserState  data = new UserState(); 
	
	protected Map<String, Object> properties = new HashMap<String, Object>();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobilePhone() {
		return mobilePhone;
	}

	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	
	/**
	 * 获取用户的扩展属性，属性名不区分大小
	 */
	public Object getProperty(String name) {
		if (StringUtils.isEmpty(name)) {
			return null;
		}
		
		name = name.replaceAll(" ", "_");
		if (getProperties().containsKey(name)) {
			return getProperties().get(name);
		}
		
		name = name.toLowerCase();
		if (getProperties().containsKey(name)) {
			return getProperties().get(name);
		}
		
		name = name.toUpperCase();
		if (getProperties().containsKey(name)) {
			return getProperties().get(name);
		}
		
		return null;
	}

	public Map<String, Object> getProperties() {
		return properties;
	}

	public void setProperties(Map<String, Object> properties) {
		this.properties = properties;
	}
	
	public List<? extends IRole> getRoles() {
		if(null == roles){
			roles = new ArrayList<IRole>();
		}
		return roles;
	}

	public void setRoles(List<? extends IRole> roles) {
		this.roles = roles;
	}

	public IUserState getData() {
		return data;
	}

	/**
	 * @return the path
	 */
	public String getPath() {
		return path;
	}

	/**
	 * @param path the path to set
	 */
	public void setPath(String path) {
		this.path = path;
		if(null == path || "".equals(path))return;
		String[] orgId = path.split("\\.");
		if(orgId.length>1){
			this.setCompanyId(orgId[1]);
		}
		if(orgId.length>2){
			this.setDeptId(orgId[2]);
		}
	}

	/**
	 * @return the orgId
	 */
	public String getOrgId() {
		return orgId;
	}

	/**
	 * @param orgId the orgId to set
	 */
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	/**
	 * @return the companyId
	 */
	public String getCompanyId() {
		return companyId;
	}

	/**
	 * @param companyId the companyId to set
	 */
	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}

	/**
	 * @return the company
	 */
	public String getCompany() {
		return company;
	}

	/**
	 * @param company the company to set
	 */
	public void setCompany(String company) {
		this.company = company;
	}

	/**
	 * @return the deptId
	 */
	public String getDeptId() {
		return deptId;
	}

	/**
	 * @param deptId the deptId to set
	 */
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	/**
	 * @return the dept
	 */
	public String getDept() {
		return dept;
	}

	/**
	 * @param dept the dept to set
	 */
	public void setDept(String dept) {
		this.dept = dept;
	}

	/**
	 * @return the fullName
	 */
	public String getFullname() {
		return fullname;
	}

	/**
	 * @param fullName the fullName to set
	 */
	public void setFullname(String fullname) {
		this.fullname = fullname;
		if(null == fullname || "".equals(fullname))return;
		String[] names = fullname.split("\\.");
		if(names.length>1){
			this.setCompany(names[1]);
		}
		if(names.length>2){
			this.setDept(names[2]);
		}
	}

	/**
	 * @return the employeeId
	 */
	public String getEmployeeId() {
		return employeeId;
	}

	/**
	 * @param employeeId the employeeId to set
	 */
	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}
	
}
