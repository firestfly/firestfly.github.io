package bingo.vkcrm.service.common;

import bingo.common.core.utils.StringUtils;
import bingo.security.cache.UserState;
import bingo.security.principal.Role;
import bingo.vkcrm.service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * Created by DomYY on 15/9/19.
 */
@Repository
public class User {

    public User() {
        this.service = new UserService();
    }

    private UserService service;

    private String id;
    private String name;
    private String loginId;
    private String password;
    private String email;
    private String mobilePhone;
    private String sex;
    private Date birthday;
    private Organization organization;
    private List<Role> roles = new ArrayList<Role>();
    private UserState data = new UserState();

    private Map<String, Object> properties = new HashMap<String, Object>();

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

    public List<Role> getRoles() {
        if (null == roles) {
            roles = new ArrayList<Role>();
        }
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public UserState getData() {
        return data;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public boolean hasRole(String roleCode) {
        try {
            return service.hasRole(this.id, roleCode);
        } catch (Throwable ex) {
            return false;
        }
    }

    /**
     * 判断是否当前用户是否拥有功能权限
     * @param permissionCode 功能权限Code
     * @return
     */
    public boolean hasPermission(String permissionCode){
        try {
            return service.hasPermission(this.id, permissionCode);
        } catch (Throwable ex) {
            return false;
        }
    }
}
