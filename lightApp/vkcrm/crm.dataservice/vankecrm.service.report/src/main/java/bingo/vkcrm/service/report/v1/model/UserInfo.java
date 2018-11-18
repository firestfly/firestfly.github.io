package bingo.vkcrm.service.report.v1.model;

import bingo.vkcrm.service.model.BaseModel;

public class UserInfo  extends BaseModel{
	
	private  String  code; //客户编号,
	private  String fullName ;//客户姓名,
	private  String sex ;//性别,
	private  String age;//年龄,
	private  String customerType; //客户类型,
	private  String mainMobile;// 主用手机,
	private  String standbyMobile; //备用手机,
	private  String affiliation;// 客户归属,
	private  String certificateType;// 证件类型,
	private  String certificateId ;//证件号码,
	private  String birthday ;//生日,
	private  String urgencyContacts ;//紧急联系人,
	private  String urgencyMobileNumber; //紧急联系人手机,
	private  String urgencyPhoneNumber ;//紧急联系人电话 ,
	private  String isHaveCar; //有无车liang ,
	private  String postCode ;//邮编,
	private  String contactAddr; //通讯地址,
	private  String registerAddr;// 户籍 ,
	private  String email; //eail ,
	private  String qq; //qq,
	private  String weChat;// 微信,
	private  String blood; //血型,
	private  String occupation; //职业,
	private  String company ;//工作单位,
	private  String companyAddr; //工作单位地址,
	
	private String relationType; //客户关系
	
    private String status;//房屋状态
    
    private String gridcode;//网格
     
    private String buildingCode;//楼栋
    
    private String houseCode;//房屋编号
    
    private String startAge ;//年龄类型开始时间
    
    private String endAge ;//年龄类型结束时间
    
    private String isSecondhand;//是否二手房
    
    private String startDeliversTime; //交付时间,开始
    
    private String endDeliverTime;//交付时间，结束
    
    private String checkInTimeStart; //入住时间开始
    
    private String checkInTimeEnd; //入住时间结束
	
	private String curPage;
	
	private String pageSize;
	
	private String projectId;
	
	private String organization; //管理中心
	
	private String ageType;//年龄类型
	
	private String ageQuery;//年查询条件
	
	private int StartPagePra;
	
	private int pageSizeParm;
	
	private String sysUserId;
	
	
	private String houseId;
	
	private String gridId;
	
	private String houseStatus;
	
	private String houseCustomerRelationType;

	private String customerAffilication;
	
	private String uerReportAgeTP;
	
	private String  customerCertificateType;
	
	private String mcId;
	
	private String identity;
	
    private String startPage;
    
    
	
	public String getStartPage() {
		return startPage;
	}
	public void setStartPage(String startPage) {
		this.startPage = startPage;
	}
	public String getIdentity() {
		return identity;
	}
	public void setIdentity(String identity) {
		this.identity = identity;
	}
	public String getHouseId() {
		return houseId;
	}
	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}
	public String getGridId() {
		return gridId;
	}
	public void setGridId(String gridId) {
		this.gridId = gridId;
	}
	public String getHouseStatus() {
		return houseStatus;
	}
	public void setHouseStatus(String houseStatus) {
		this.houseStatus = houseStatus;
	}
	public String getHouseCustomerRelationType() {
		return houseCustomerRelationType;
	}
	public void setHouseCustomerRelationType(String houseCustomerRelationType) {
		this.houseCustomerRelationType = houseCustomerRelationType;
	}
	public String getCustomerAffilication() {
		return customerAffilication;
	}
	public void setCustomerAffilication(String customerAffilication) {
		this.customerAffilication = customerAffilication;
	}
	public String getUerReportAgeTP() {
		return uerReportAgeTP;
	}
	public void setUerReportAgeTP(String uerReportAgeTP) {
		this.uerReportAgeTP = uerReportAgeTP;
	}
	public String getCustomerCertificateType() {
		return customerCertificateType;
	}
	public void setCustomerCertificateType(String customerCertificateType) {
		this.customerCertificateType = customerCertificateType;
	}
	public String getMcId() {
		return mcId;
	}
	public void setMcId(String mcId) {
		this.mcId = mcId;
	}
	public String getStartAge() {
		return startAge;
	}
	public void setStartAge(String startAge) {
		this.startAge = startAge;
	}
	public String getEndAge() {
		return endAge;
	}
	public void setEndAge(String endAge) {
		this.endAge = endAge;
	}
	public String getSysUserId() {
		return sysUserId;
	}
	public void setSysUserId(String sysUserId) {
		this.sysUserId = sysUserId;
	}
	public int getStartPagePra() {
		return StartPagePra;
	}
	public void setStartPagePra(int startPagePra) {
		StartPagePra = startPagePra;
	}
	public int getPageSizeParm() {
		return pageSizeParm;
	}
	public void setPageSizeParm(int pageSizeParm) {
		this.pageSizeParm = pageSizeParm;
	}

	public String getAgeQuery() {
		return ageQuery;
	}
	public void setAgeQuery(String ageQuery) {
		this.ageQuery = ageQuery;
	}
	public String getAgeType() {
		return ageType;
	}
	public void setAgeType(String ageType) {
		this.ageType = ageType;
	}
	public String getOrganization() {
		return organization;
	}
	public void setOrganization(String organization) {
		this.organization = organization;
	}
	
	/** 
	 * @return birthday 
	 */
	public String getBirthday() {
		return birthday;
	}
	/**   
	 * @param: birthday the birthday to set   
	 */
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getRelationType() {
		return relationType;
	}
	public void setRelationType(String relationType) {
		this.relationType = relationType;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getGridcode() {
		return gridcode;
	}
	public void setGridcode(String gridcode) {
		this.gridcode = gridcode;
	}
	public String getBuildingCode() {
		return buildingCode;
	}
	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
	}
	public String getHouseCode() {
		return houseCode;
	}
	public void setHouseCode(String houseCode) {
		this.houseCode = houseCode;
	}
	public String getIsSecondhand() {
		return isSecondhand;
	}
	public void setIsSecondhand(String isSecondhand) {
		this.isSecondhand = isSecondhand;
	}
	public String getStartDeliversTime() {
		return startDeliversTime;
	}
	public void setStartDeliversTime(String startDeliversTime) {
		this.startDeliversTime = startDeliversTime;
	}
	public String getEndDeliverTime() {
		return endDeliverTime;
	}
	public void setEndDeliverTime(String endDeliverTime) {
		this.endDeliverTime = endDeliverTime;
	}
	public String getCheckInTimeStart() {
		return checkInTimeStart;
	}
	public void setCheckInTimeStart(String checkInTimeStart) {
		this.checkInTimeStart = checkInTimeStart;
	}
	public String getCheckInTimeEnd() {
		return checkInTimeEnd;
	}
	public void setCheckInTimeEnd(String checkInTimeEnd) {
		this.checkInTimeEnd = checkInTimeEnd;
	}
	public String getCurPage() {
		return curPage;
	}
	public void setCurPage(String curPage) {
		this.curPage = curPage;
	}
	public String getPageSize() {
		return pageSize;
	}
	public void setPageSize(String pageSize) {
		this.pageSize = pageSize;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getAge() {
		return age;
	}
	public void setAge(String age) {
		this.age = age;
	}
	public String getCustomerType() {
		return customerType;
	}
	public void setCustomerType(String customerType) {
		this.customerType = customerType;
	}
	public String getMainMobile() {
		return mainMobile;
	}
	public void setMainMobile(String mainMobile) {
		this.mainMobile = mainMobile;
	}
	public String getStandbyMobile() {
		return standbyMobile;
	}
	public void setStandbyMobile(String standbyMobile) {
		this.standbyMobile = standbyMobile;
	}
	public String getAffiliation() {
		return affiliation;
	}
	public void setAffiliation(String affiliation) {
		this.affiliation = affiliation;
	}
	public String getCertificateType() {
		return certificateType;
	}
	public void setCertificateType(String certificateType) {
		this.certificateType = certificateType;
	}
	public String getCertificateId() {
		return certificateId;
	}
	public void setCertificateId(String certificateId) {
		this.certificateId = certificateId;
	}

	public String getUrgencyContacts() {
		return urgencyContacts;
	}
	public void setUrgencyContacts(String urgencyContacts) {
		this.urgencyContacts = urgencyContacts;
	}
	public String getUrgencyMobileNumber() {
		return urgencyMobileNumber;
	}
	public void setUrgencyMobileNumber(String urgencyMobileNumber) {
		this.urgencyMobileNumber = urgencyMobileNumber;
	}
	public String getUrgencyPhoneNumber() {
		return urgencyPhoneNumber;
	}
	public void setUrgencyPhoneNumber(String urgencyPhoneNumber) {
		this.urgencyPhoneNumber = urgencyPhoneNumber;
	}
	public String getIsHaveCar() {
		return isHaveCar;
	}
	public void setIsHaveCar(String isHaveCar) {
		this.isHaveCar = isHaveCar;
	}
	public String getPostCode() {
		return postCode;
	}
	public void setPostCode(String postCode) {
		this.postCode = postCode;
	}
	public String getContactAddr() {
		return contactAddr;
	}
	public void setContactAddr(String contactAddr) {
		this.contactAddr = contactAddr;
	}
	public String getRegisterAddr() {
		return registerAddr;
	}
	public void setRegisterAddr(String registerAddr) {
		this.registerAddr = registerAddr;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getQq() {
		return qq;
	}
	public void setQq(String qq) {
		this.qq = qq;
	}
	public String getWeChat() {
		return weChat;
	}
	public void setWeChat(String weChat) {
		this.weChat = weChat;
	}
	public String getBlood() {
		return blood;
	}
	public void setBlood(String blood) {
		this.blood = blood;
	}
	public String getOccupation() {
		return occupation;
	}
	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public String getCompanyAddr() {
		return companyAddr;
	}
	public void setCompanyAddr(String companyAddr) {
		this.companyAddr = companyAddr;
	}
	
	
	 
	
}
