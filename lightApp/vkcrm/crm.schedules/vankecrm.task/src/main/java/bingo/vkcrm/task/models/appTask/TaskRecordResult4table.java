package bingo.vkcrm.task.models.appTask;

import java.util.List;

public class TaskRecordResult4table {
    private List<TackTableResult> data ;

    private String has_more;
    
    
    private String perpage;

    private String page;
    
    private String  total_page;
    
    

	public String getTotal_page() {
		return total_page;
	}

	public void setTotal_page(String total_page) {
		this.total_page = total_page;
	}

	public String getPage() {
		return page;
	}

	public void setPage(String page) {
		this.page = page;
	}

	public List<TackTableResult> getData() {
		return data;
	}

	public void setData(List<TackTableResult> data) {
		this.data = data;
	}

	public String getHas_more() {
		return has_more;
	}

	public void setHas_more(String has_more) {
		this.has_more = has_more;
	}

	public String getPerpage() {
		return perpage;
	}

	public void setPerpage(String perpage) {
		this.perpage = perpage;
	}
}