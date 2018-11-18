/**
 * This file created at 2011-5-10.
 *
 * Copyright (c) 2002-2011 Bingosoft, Inc. All rights reserved.
 */
package bingo.security.principal;

import java.util.Date;
import java.util.List;
import java.util.Map;

import bingo.security.cache.IUserState;

/**
 * 自定义一个系统的用户
 *
 * @author xuzhh
 */
public interface IUser {
	
	/** 读取唯一标识 */
	String getId();
	
	void setId(String id);
	
	/** 显示名称 */
	String getName();
	
	void setName(String name);
	
	/** 登录账号 */
	String getLoginId();
	
	void setLoginId(String loginId);
	
	/** 登录密码 */
	String getPassword();
	
	void setPassword(String password);

	/** Email地址 */
	String getEmail();
	
	void setEmail(String email);
	
	/** 移动电话 */
	String getMobilePhone();
	
	void setMobilePhone(String mobilePhond);
	
	/** 性别 */
	String getSex();
	
	void setSex(String sex);
 
	/** 出生日期 */
	Date getBirthday();
	
	void setBirthday(Date birthday);
	
	/** 通过key-value方式获取某个属性的值 */
	Object getProperty(String name);
	
	/** 以key-value存储的所有用户属性 */
	Map<String, Object> getProperties();
	
	/**
	 * @return 用户的角色集合
	 */
	List<? extends IRole> getRoles();
	
	void setRoles(List<? extends IRole> roles);
	
	/**
	 * 用户的会话数据，应用可以使用此对象存储用户会话相关的数据
	 */
	IUserState getData();
	/**
	 * 组织路径
	 * @return
	 */
	String getPath();
	void setPath(String path);
	
	String getFullname();
	void setFullname(String fullname);
	/**
	 * 公司
	 * @return
	 */
	String getCompanyId();
	void setCompanyId(String companyId);
	String getCompany();
	void setCompany(String company);
	/**
	 * 部门
	 * @return
	 */
	String getDeptId();
	void setDeptId(String deptId);
	String getDept();
	void setDept(String dept);
	
	/**
	 * 组织
	 * @return
	 */
	String getOrgId();
	void setOrgId(String orgId);

	
	String getEmployeeId();
	void setEmployeeId(String employeeId);
}
