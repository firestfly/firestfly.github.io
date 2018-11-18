package bingo.vkcrm.service.common;

import bingo.dao.Page;

import java.io.Serializable;

/**
 * Created by DomYY on 15/8/27.
 */
public class PageResult implements Serializable {

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    private static final long serialVersionUID = -4263336128482001626L;

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

    public int getPageSize() {
        return pageSize;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public int getTotalSize() {
        return totalSize;
    }

    public int getStartRow() {
        return startRow;
    }

    public int getEndRow() {
        return endRow;
    }
    
    /** 
	 * @return timestamp 
	 */
	public String getTimestamp() {
		return timestamp;
	}

	/**   
	 * @param: timestamp the timestamp to set   
	 */
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	/**
     * 实例化分页结果
     * @param page
     */
    public PageResult(Page page) {
        this.totalSize = page.getTotalRows();
        this.curPage = page.getPage();
        this.pageSize = page.getPageSize();
        this.totalPage = page.getTotalPages();
        this.startRow = pageSize * (curPage - 1) + 1;
        this.endRow = pageSize * (curPage - 1) + 1 + pageSize - 1;
    }
}
