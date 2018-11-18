package bingo.vkcrm.service.report.v1.model;

import java.io.Serializable;

import bingo.vkcrm.service.model.BaseModel;

public class BasicInformation extends BaseModel implements Serializable{
	/**   
	 * @Fields serialVersionUID : TODO 
	 */     
	    
	private static final long serialVersionUID = 1L;

	private String mcname;//运营中心名称
	
	private String organization; //管理中心
	
	private String city;//城市
	
	private String company;//公司管理中心
	
	private String projectId;//项目id
	
    private String gridId;//网格ID
    
    private String gridName;//网格名称 
    
    private int houseCount;//总户数
    
    private int takeOverCount;//已接管户数
    
    private int  checkConut;//已入住户数
    
    private int residentCount;//常住户数
    
    private int leaseCount;//出租户数
    
    private int nullCount; //空置户数
    
    private  int vacation;//度假户数

	private int carCount;//车辆数
	
	private int petsCount;//宠物数量
	
	private int personCount;//总人数
	
	private int ownerCount;//业主数
	
	private int unOwnerCount;//家庭成员
	
	private String userId;
	
	private String mcId;
	
	private String curPage;
	private String pageSize;
	
	private String organizationText;
	
	private String cityText;
	
    private String projectText;
    
    private String gridText;
    
    private String sysUserId;
    
    private String cityCode;
    
    




	public String getCityCode() {
		return cityCode;
	}

	public void setCityCode(String cityCode) {
		this.cityCode = cityCode;
	}

	public String getSysUserId() {
		return sysUserId;
	}

	public void setSysUserId(String sysUserId) {
		this.sysUserId = sysUserId;
	}

	public String getOrganizationText() {
		return organizationText;
	}

	public void setOrganizationText(String organizationText) {
		this.organizationText = organizationText;
	}

	public String getCityText() {
		 return this.getValue("CityCode", this.cityCode);
	}

	public void setCityText(String cityText) {
		this.cityText = cityText;
	}

	public String getProjectText() {
		return projectText;
	}

	public void setProjectText(String projectText) {
		this.projectText = projectText;
	}

	public String getGridText() {
		return gridText;
	}

	public void setGridText(String gridText) {
		this.gridText = gridText;
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

	public String getMcId() {
		return mcId;
	}

	public void setMcId(String mcId) {
		this.mcId = mcId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getMcname() {
		return mcname;
	}

	public void setMcname(String mcname) {
		this.mcname = mcname;
	}

	public String getOrganization() {
		return organization;
	}

	public void setOrganization(String organization) {
		this.organization = organization;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getGridId() {
		return gridId;
	}

	public void setGridId(String gridId) {
		this.gridId = gridId;
	}

	public String getGridName() {
		return gridName;
	}

	public void setGridName(String gridName) {
		this.gridName = gridName;
	}

	/** 
	 * @return houseCount 
	 */
	public int getHouseCount() {
		return houseCount;
	}

	/**   
	 * @param: houseCount the houseCount to set   
	 */
	public void setHouseCount(int houseCount) {
		this.houseCount = houseCount;
	}

	/** 
	 * @return takeOverCount 
	 */
	public int getTakeOverCount() {
		return takeOverCount;
	}

	/**   
	 * @param: takeOverCount the takeOverCount to set   
	 */
	public void setTakeOverCount(int takeOverCount) {
		this.takeOverCount = takeOverCount;
	}

	/** 
	 * @return checkConut 
	 */
	public int getCheckConut() {
		return checkConut;
	}

	/**   
	 * @param: checkConut the checkConut to set   
	 */
	public void setCheckConut(int checkConut) {
		this.checkConut = checkConut;
	}

	/** 
	 * @return residentCount 
	 */
	public int getResidentCount() {
		return residentCount;
	}

	/**   
	 * @param: residentCount the residentCount to set   
	 */
	public void setResidentCount(int residentCount) {
		this.residentCount = residentCount;
	}

	/** 
	 * @return leaseCount 
	 */
	public int getLeaseCount() {
		return leaseCount;
	}

	/**   
	 * @param: leaseCount the leaseCount to set   
	 */
	public void setLeaseCount(int leaseCount) {
		this.leaseCount = leaseCount;
	}

	/** 
	 * @return nullCount 
	 */
	public int getNullCount() {
		return nullCount;
	}

	/**   
	 * @param: nullCount the nullCount to set   
	 */
	public void setNullCount(int nullCount) {
		this.nullCount = nullCount;
	}

	/** 
	 * @return vacation 
	 */
	public int getVacation() {
		return vacation;
	}

	/**   
	 * @param: vacation the vacation to set   
	 */
	public void setVacation(int vacation) {
		this.vacation = vacation;
	}

	/** 
	 * @return carCount 
	 */
	public int getCarCount() {
		return carCount;
	}

	/**   
	 * @param: carCount the carCount to set   
	 */
	public void setCarCount(int carCount) {
		this.carCount = carCount;
	}

	/** 
	 * @return petsCount 
	 */
	public int getPetsCount() {
		return petsCount;
	}

	/**   
	 * @param: petsCount the petsCount to set   
	 */
	public void setPetsCount(int petsCount) {
		this.petsCount = petsCount;
	}

	/** 
	 * @return personCount 
	 */
	public int getPersonCount() {
		return personCount;
	}

	/**   
	 * @param: personCount the personCount to set   
	 */
	public void setPersonCount(int personCount) {
		this.personCount = personCount;
	}

	/** 
	 * @return ownerCount 
	 */
	public int getOwnerCount() {
		return ownerCount;
	}

	/**   
	 * @param: ownerCount the ownerCount to set   
	 */
	public void setOwnerCount(int ownerCount) {
		this.ownerCount = ownerCount;
	}

	/** 
	 * @return unOwnerCount 
	 */
	public int getUnOwnerCount() {
		return unOwnerCount;
	}

	/**   
	 * @param: unOwnerCount the unOwnerCount to set   
	 */
	public void setUnOwnerCount(int unOwnerCount) {
		this.unOwnerCount = unOwnerCount;
	}

	
}
