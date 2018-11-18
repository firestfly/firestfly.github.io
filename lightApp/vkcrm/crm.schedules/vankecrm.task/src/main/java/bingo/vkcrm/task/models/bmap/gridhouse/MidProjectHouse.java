package bingo.vkcrm.task.models.bmap.gridhouse;

public class MidProjectHouse {
	private String houseId;
	private String gridId;
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
	public MidProjectHouse(String houseId, String gridId) {
		super();
		this.houseId = houseId;
		this.gridId = gridId;
	}
	public MidProjectHouse() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
}
