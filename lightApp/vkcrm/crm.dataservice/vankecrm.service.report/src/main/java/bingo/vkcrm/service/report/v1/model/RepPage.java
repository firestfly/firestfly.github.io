package bingo.vkcrm.service.report.v1.model;

public class RepPage {
	 /**
     * 当前页, 从1开始计数
     */
    private int curPage;
    /**
     * 页大小
     */
    private int pageSize;
    /**
     * 总页数
     */
    private int totalPage;
    /**
     * 总记录数
     */
    private int totalSize;
    /**
     * 起始行, 从1开始计数
     */
    private int startRow;
    /**
     * 结束行, 从1开始计数
     */
    private int endRow;
    
    /**
     * 当前日期格式 yyyy-MM-dd HH:mm:ss
     */
    private String timestamp;

	public int getCurPage() {
		return curPage;
	}

	public void setCurPage(int curPage) {
		this.curPage = curPage;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public int getTotalSize() {
		return totalSize;
	}

	public void setTotalSize(int totalSize) {
		this.totalSize = totalSize;
	}

	public int getStartRow() {
		return startRow;
	}

	public void setStartRow(int startRow) {
		this.startRow = startRow;
	}

	public int getEndRow() {
		return endRow;
	}

	public void setEndRow(int endRow) {
		this.endRow = endRow;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
    
    
}
