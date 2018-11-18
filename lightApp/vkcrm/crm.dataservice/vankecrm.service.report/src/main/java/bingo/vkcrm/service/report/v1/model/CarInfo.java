package bingo.vkcrm.service.report.v1.model;

import bingo.vkcrm.service.model.BaseModel;
//查询条件：管理中心、项目、网格、楼栋、房屋、客户姓名、主用手机、房屋状态（全部、常住、空置、出租、度假）、证件类型、证件号码、车牌号；
//显示内容：车牌号、购置时间、车辆品牌、车辆颜色、管理中心、项目、网格、楼栋、房屋、单元、房屋状态、客户姓名、主用手机、证件类型、证件号码；

public class CarInfo extends BaseModel{
	private String licenseNumber;//车牌号
	private String buyTime;//购置时间
	private String brand;//车辆品牌
	private String color;//车辆颜色
	private String guli;//管理中心
	private String projectId ;//项目
	private String gridCode;//网格
	private String buildingCode;//楼栋
	private String houseCode ;//房屋
	private String unit;//单元
	private String status;//房屋状态
	private String fullName;//客户姓名
	private String mainMobile;//主用手机
	private String certificateType;//证件类型
	private String certificateId;//证件号码
	
	private String branText;//车辆品牌 显示
	
	private String colorText;//颜色 中文显示
	
	private String mcName; //管理中心中文显示
	
	private String projectText;//项目中文显示
	
	private String gridName;//网格中文显示
	
	private String buildingName;//楼栋中文显示
	
	private String statusText;//房屋状态中文显示
	
	private String certificateText;//证件类型中文显示
	
	private String huoseName;
	
	private String sysUserId;
	
	private String mcId;
	
	
	private String gridId;
	
	private String houseId;
	private String registerTimeStar;//登记开始时间
	private String registerTimeEnd;//登记结束时间
	
	
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
	public String getMcId() {
		return mcId;
	}
	public void setMcId(String mcId) {
		this.mcId = mcId;
	}
	public String getSysUserId() {
		return sysUserId;
	}
	public void setSysUserId(String sysUserId) {
		this.sysUserId = sysUserId;
	}
	public String getHuoseName() {
		return huoseName;
	}
	public void setHuoseName(String huoseName) {
		this.huoseName = huoseName;
	}
	public String getBranText() {
		return branText;
	}
	public void setBranText(String branText) {
		this.branText = branText;
	}
	public String getColorText() {
		return colorText;
	}
	public void setColorText(String colorText) {
		this.colorText = colorText;
	}
	public String getMcName() {
		return mcName;
	}
	public void setMcName(String mcName) {
		this.mcName = mcName;
	}
	public String getProjectText() {
		return projectText;
	}
	public void setProjectText(String projectText) {
		this.projectText = projectText;
	}
	public String getGridName() {
		return gridName;
	}
	public void setGridName(String gridName) {
		this.gridName = gridName;
	}
	public String getBuildingName() {
		return buildingName;
	}
	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}
	public String getStatusText() {
		return statusText;
	}
	public void setStatusText(String statusText) {
		this.statusText = statusText;
	}
	public String getCertificateText() {
		return certificateText;
	}
	public void setCertificateText(String certificateText) {
		this.certificateText = certificateText;
	}
	private String curPage;
	
	private String pageSize;
	
	
	
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
	public String getLicenseNumber() {
		return licenseNumber;
	}
	public void setLicenseNumber(String licenseNumber) {
		this.licenseNumber = licenseNumber;
	}
	public String getBuyTime() {
		return buyTime;
	}
	public void setBuyTime(String buyTime) {
		this.buyTime = buyTime;
	}
	public String getBrand() {
		return brand;
	}
	public void setBrand(String brand) {
		this.brand = brand;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getGuli() {
		return guli;
	}
	public void setGuli(String guli) {
		this.guli = guli;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getGridCode() {
		return gridCode;
	}
	public void setGridCode(String gridCode) {
		this.gridCode = gridCode;
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
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getMainMobile() {
		return mainMobile;
	}
	public void setMainMobile(String mainMobile) {
		this.mainMobile = mainMobile;
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
	/** 
	 * @return registerTimeStar 
	 */
	public String getRegisterTimeStar() {
		return registerTimeStar;
	}
	/**   
	 * @param: registerTimeStar the registerTimeStar to set   
	 */
	public void setRegisterTimeStar(String registerTimeStar) {
		this.registerTimeStar = registerTimeStar;
	}
	/** 
	 * @return registerTimeEnd 
	 */
	public String getRegisterTimeEnd() {
		return registerTimeEnd;
	}
	/**   
	 * @param: registerTimeEnd the registerTimeEnd to set   
	 */
	public void setRegisterTimeEnd(String registerTimeEnd) {
		this.registerTimeEnd = registerTimeEnd;
	}
	
	
}


