package bingo.vkcrm.task.models.response;

import java.util.List;

public class GridStaffResult {
    private String has_more;
    private int page;
    private int perpage;
    private int total_page;
    private List<GridStaffData> data;

    public GridStaffResult() {
        super();

    }

    public GridStaffResult(String has_more, int page, int perpage, int total_page, List<GridStaffData> data) {
        super();
        this.has_more = has_more;
        this.page = page;
        this.perpage = perpage;
        this.total_page = total_page;
        this.data = data;
    }

    public String getHas_more() {
        return has_more;
    }

    public void setHas_more(String has_more) {
        this.has_more = has_more;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPerpage() {
        return perpage;
    }

    public void setPerpage(int perpage) {
        this.perpage = perpage;
    }

    public int getTotal_page() {
        return total_page;
    }

    public void setTotal_page(int total_page) {
        this.total_page = total_page;
    }

    public List<GridStaffData> getData() {
        return data;
    }

    public void setData(List<GridStaffData> data) {
        this.data = data;
    }
}
