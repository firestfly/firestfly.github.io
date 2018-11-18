package bingo.vkcrm.task.models.bmap.manager;

import java.util.Date;

public class SecUser {
	public static String TYPE="local";
	public static String STATUS="disabled";
	public static String ORG_ID="64C731630D15E31194CE0050568D7315";
	public static String CREATED_BY="c7ec9ef5ecb011e59e7bd00dbfc6c054";
	public static String LAST_UPDATED_BY="c7ec9ef5ecb011e59e7bd00dbfc6c054";
	public static String SEX= "男";
	private String id;
	private String mobile_phone;
	public SecUser() {

	}
	

	public SecUser(String id, String mobile_phone, String name, String type, String login_id, String sex, String status,
			String org_id, String created_by, Date created_date, Date last_updated_date, String last_updated_by) {
		super();
		this.id = id;
		this.mobile_phone = mobile_phone;
		this.name = name;
		this.type = type;
		this.login_id = login_id;
		this.sex = sex;
		this.status = status;
		this.org_id = org_id;
		this.created_by = created_by;
		this.created_date = created_date;
		this.last_updated_date = last_updated_date;
		this.last_updated_by = last_updated_by;
	}

	public String getMobile_phone() {
		return mobile_phone;
	}

	public void setMobile_phone(String mobile_phone) {
		this.mobile_phone = mobile_phone;
	}

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
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getLogin_id() {
		return login_id;
	}
	public void setLogin_id(String login_id) {
		this.login_id = login_id;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getOrg_id() {
		return org_id;
	}
	public void setOrg_id(String org_id) {
		this.org_id = org_id;
	}
	public String getCreated_by() {
		return created_by;
	}
	public void setCreated_by(String created_by) {
		this.created_by = created_by;
	}
	public Date getCreated_date() {
		return created_date;
	}
	public void setCreated_date(Date created_date) {
		this.created_date = created_date;
	}
	public Date getLast_updated_date() {
		return last_updated_date;
	}
	public void setLast_updated_date(Date last_updated_date) {
		this.last_updated_date = last_updated_date;
	}
	public String getLast_updated_by() {
		return last_updated_by;
	}
	public void setLast_updated_by(String last_updated_by) {
		this.last_updated_by = last_updated_by;
	}
	private String name;
	private String type;
	private String login_id;
	private String sex;
	private String status;
	private String org_id;
	private String created_by;
	private Date created_date;
	private Date last_updated_date;
	private String last_updated_by;
	


	   
}
