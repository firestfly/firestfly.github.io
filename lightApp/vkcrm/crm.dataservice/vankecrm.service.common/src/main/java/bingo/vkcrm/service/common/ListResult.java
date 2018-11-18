package bingo.vkcrm.service.common;

import bingo.dao.Page;
import bingo.dao.PageList;

import java.io.Serializable;
import java.util.List;

/**
 * 列表数据结果
 * @param <T> 业务数据类型
 *
 * Created by DomYY on 15/8/27.
 */
public class ListResult<T> implements Serializable {

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    private static final long serialVersionUID = -4263336128482001626L;

    /**
     * 数据集合
     */
    private List<T> list;

    public List<T> getList() {
        return list;
    }

    /**
     * 分页信息
     */
    private PageResult pagination;

    public PageResult getPagination() {
        return pagination;
    }

    public ListResult() {

    }

    public ListResult(Page page, PageList<T> data){
        this.list = data.getResultSet();
        this.pagination = new PageResult(page);
    }

    public ListResult(Page page, List<T> data){
        this.list = data;
        this.pagination = new PageResult(page);
    }

    /**
     * @param list      数据集合
     * @param curPage   当前页数
     * @param pageSize  页大小
     * @param totalSize 总记录数
     * @param totalPage 总页数
     */
    public ListResult(List<T> list, int curPage, int pageSize, Long totalSize, int totalPage) {
        this.list = list;
//        this.pagination = new PageResult();
//        this.pagination.setTotalSize(totalSize);
//        this.pagination.setCurPage(curPage);
//        this.pagination.setPageSize(pageSize);
//        this.pagination.setTotalPage(totalPage);
//        this.pagination.setStartRow(pageSize * (curPage - 1) + 1);
//        this.pagination.setEndRow(pageSize * (curPage - 1) + 1 + pageSize - 1);
    }


}
