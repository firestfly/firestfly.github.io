package bingo.vkcrm.task.models.bmap.grid;

public class Grid {
	private String code;
	private String managerId;
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getManagerId() {
		return managerId;
	}
	public void setManagerId(String managerId) {
		this.managerId = managerId;
	}
	public Grid(String code, String managerId) {
		super();
		this.code = code;
		this.managerId = managerId;
	}
	public Grid() {
		super();
		
	}
	
}
