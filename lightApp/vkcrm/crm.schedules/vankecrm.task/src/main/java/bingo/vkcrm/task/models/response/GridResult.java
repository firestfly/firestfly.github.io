package bingo.vkcrm.task.models.response;

import java.util.List;

public class GridResult {

	private Boolean has_more;
	private String page;
	private String perpage;
	private String total_page;

	private List<GridData> data;

	public GridResult() {

	}

	public GridResult(Boolean has_more, String page, String perpage, String total_page, List<GridData> data) {
		super();
		this.has_more = has_more;
		this.page = page;
		this.perpage = perpage;
		this.total_page = total_page;
		this.data = data;
	}

	public Boolean getHas_more() {
		return has_more;
	}

	public void setHas_more(Boolean has_more) {
		this.has_more = has_more;
	}

	public String getPage() {
		return page;
	}

	public void setPage(String page) {
		this.page = page;
	}

	public String getPerpage() {
		return perpage;
	}

	public void setPerpage(String perpage) {
		this.perpage = perpage;
	}

	public String getTotal_page() {
		return total_page;
	}

	public void setTotal_page(String total_page) {
		this.total_page = total_page;
	}

	public List<GridData> getData() {
		return data;
	}

	public void setData(List<GridData> data) {
		this.data = data;
	}
}
